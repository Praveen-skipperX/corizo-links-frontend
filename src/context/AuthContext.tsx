import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import toast from "react-hot-toast";
import api from "../lib/api";
import { AuthState, LoginPayload } from "../types";

interface AuthContextType extends AuthState {
  login: (payload: LoginPayload) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const refreshUser = useCallback(async () => {
    try {
      const { data } = await api.get("/auth/me");
      if (data.success) {
        setState({
          user: data.data.user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        setState({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch {
      setState({ user: null, isAuthenticated: false, isLoading: false });
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (payload: LoginPayload): Promise<boolean> => {
    try {
      const { data } = await api.post("/auth/login", {
        email: payload.email,
        password: payload.password,
      });
      if (data.success) {
        setState({
          user: data.data.user,
          isAuthenticated: true,
          isLoading: false,
        });
        toast.success(`Welcome back, ${data.data.user.name}!`);
        return true;
      }
      toast.error(data.message || "Login failed.");
      return false;
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Login failed. Please try again.";
      toast.error(message);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await api.post("/auth/logout");
    } catch {
      // ignore
    } finally {
      setState({ user: null, isAuthenticated: false, isLoading: false });
      toast.success("Logged out successfully.");
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
