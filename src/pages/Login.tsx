import {
  AlertTriangle,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldAlert,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<
    Partial<{ email: string; password: string }>
  >({});
  const [userIp, setUserIp] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && !isLoading)
      navigate("/dashboard", { replace: true });
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    api
      .get("/activities/my-ip")
      .then(({ data }) => {
        if (data.success) setUserIp(data.data.ip);
      })
      .catch(() => {});
  }, []);

  const validate = (): boolean => {
    const errs: typeof errors = {};
    if (!form.email.trim()) errs.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      errs.email = "Enter a valid email address.";
    if (!form.password) errs.password = "Password is required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange =
    (field: "email" | "password") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
      if (errors[field]) setErrors((er) => ({ ...er, [field]: undefined }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    const ok = await login({
      email: form.email.trim(),
      password: form.password,
      rememberMe,
    });
    setSubmitting(false);
    if (ok) navigate("/dashboard", { replace: true });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-sidebar flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-y-auto relative flex items-center justify-center py-6 px-4">
      <div
        className="fixed inset-0 -z-10"
        style={{
          background:
            "linear-gradient(145deg, #16102E 0%, #1E153D 40%, #3b1f6b 72%, #6E24A5 100%)",
        }}
      />
      <div className="fixed top-[-120px] right-[-80px] w-[420px] h-[420px] rounded-full opacity-[0.18] blur-[90px] bg-primary pointer-events-none -z-10" />
      <div className="fixed bottom-[-100px] left-[-60px] w-[340px] h-[340px] rounded-full opacity-[0.12] blur-[80px] bg-white pointer-events-none -z-10" />

      <div className="w-full max-w-[400px] animate-slide-up">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-white/10">
          <div className="px-6 pt-5 pb-4 flex items-center gap-3 border-b border-gray-100/80">
            <img
              src="https://corizo.in/wp-content/themes/techglobiz/images/hdr-logo.jpg"
              alt="Corizo"
              className="h-8 w-auto max-w-[120px] object-contain flex-shrink-0"
            />
            <div className="min-w-0">
              <h1 className="text-base font-extrabold text-accent tracking-tight leading-tight">
                Corizo Links
              </h1>
              <p className="text-[10px] text-gray-400 mt-0.5 font-semibold tracking-[0.12em] uppercase">
                Internal Portal
              </p>
            </div>
          </div>

          <div className="px-6 py-5">
            <div className="mb-4">
              <h2 className="text-[14px] font-bold text-accent tracking-tight">
                Sign in to your account
              </h2>
            </div>

            <div className="flex gap-2.5 bg-red-50/80 border border-red-100 rounded-xl p-2.5 mb-4">
              <ShieldAlert
                size={14}
                className="text-red-500 flex-shrink-0 mt-0.5"
              />
              <p className="text-red-700/90 text-[11px] leading-snug font-medium">
                For <strong>Corizo employees only</strong>.
                {userIp ? (
                  <>
                    {" "}
                    IP <strong>{userIp}</strong> and activity are logged.
                  </>
                ) : (
                  <> Activity is monitored and logged.</>
                )}
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-[13px] font-semibold text-gray-700 mb-1"
                >
                  Email address
                </label>
                <div className="relative">
                  <Mail
                    size={14}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange("email")}
                    placeholder="you@corizo.in"
                    autoComplete="email"
                    autoFocus
                    className={[
                      "input-field pl-10",
                      errors.email
                        ? "border-red-400 focus:ring-red-200 focus:border-red-400"
                        : "",
                    ].join(" ")}
                  />
                </div>
                {errors.email && <FieldError>{errors.email}</FieldError>}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor="password"
                    className="block text-[13px] font-semibold text-gray-700"
                  >
                    Password
                  </label>
                </div>
                <div className="relative">
                  <Lock
                    size={14}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange("password")}
                    placeholder="••••••••••"
                    autoComplete="current-password"
                    className={[
                      "input-field pl-10 pr-11",
                      errors.password
                        ? "border-red-400 focus:ring-red-200 focus:border-red-400"
                        : "",
                    ].join(" ")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.password && <FieldError>{errors.password}</FieldError>}
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer select-none group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 accent-primary cursor-pointer"
                />
                <span className="text-[13px] text-gray-500 group-hover:text-gray-700 transition-colors">
                  Remember me for 7 days
                </span>
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full flex items-center justify-center gap-2 py-2.5 text-sm"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Authenticating&hellip;
                  </>
                ) : (
                  <>
                    <Lock size={14} />
                    Sign in securely
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="px-6 py-2.5 bg-brand-light-bg/60 border-t border-gray-100 text-center">
            <p className="text-[10px] text-gray-400 font-medium">
              &copy; {new Date().getFullYear()} Corizo · Internal use only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const FieldError = ({ children }: { children: React.ReactNode }) => (
  <p className="flex items-center gap-1 text-red-500 text-xs mt-1.5 font-medium">
    <AlertTriangle size={11} />
    {children}
  </p>
);

export default LoginPage;
