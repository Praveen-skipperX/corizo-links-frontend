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
      <div className="min-h-screen bg-accent flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-y-auto relative flex items-center justify-center py-8 px-4">
      {/* Deep gradient background */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background:
            "linear-gradient(135deg, #1E153D 0%, #3b1f6b 45%, #6E24A5 100%)",
        }}
      />
      {/* Decorative orbs */}
      <div className="fixed top-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full opacity-20 blur-[80px] bg-primary pointer-events-none -z-10" />
      <div className="fixed bottom-[-80px] left-[-60px] w-[320px] h-[320px] rounded-full opacity-15 blur-[70px] bg-purple-400 pointer-events-none -z-10" />

      {/* Login card */}
      <div className="w-full max-w-[420px] animate-slide-in">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Brand header */}
          <div className="px-7 pt-7 pb-5 text-center border-b border-gray-100">
            <img
              src="https://corizo.in/wp-content/themes/techglobiz/images/hdr-logo.jpg"
              alt="Corizo Links"
              className="mx-auto h-10 w-auto"
            />
            <h1 className="text-lg font-bold text-accent tracking-tight">
              Links Portal
            </h1>
            {/* <p className="text-xs text-gray-400 mt-1 font-medium tracking-wide">
              links.corizo.in &nbsp;&middot;&nbsp; Internal Use Only
            </p> */}
          </div>

          <div className="px-7 py-5">
            <div className="mb-4">
              <h2 className="text-base font-bold text-accent">
                Sign In to Your Account
              </h2>
              {/* <p className="text-gray-500 text-xs mt-0.5">
                Enter your credentials to access the portal.
              </p> */}
            </div>

            {/* Security warning */}
            <div className="flex gap-3 bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
              <ShieldAlert
                size={16}
                className="text-red-500 flex-shrink-0 mt-px"
              />
              <p className="text-red-700 text-[11px] leading-relaxed font-medium">
                This portal is strictly for{" "}
                <strong>Corizo employees only</strong>.
                {userIp ? (
                  <>
                    {" "}
                    Your IP address (<strong>{userIp}</strong>) and all
                    activities are being
                  </>
                ) : (
                  <> All activities are being</>
                )}{" "}
                monitored and logged. Unauthorized access is prohibited and will
                be reported.
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-1.5"
                >
                  Email Address
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

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-xs text-primary hover:text-primary-dark font-semibold transition-colors"
                  >
                    Forgot Password?
                  </button>
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

              {/* Remember me */}
              <label className="flex items-center gap-2.5 cursor-pointer select-none group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 accent-primary cursor-pointer"
                />
                <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                  Remember me for 7 days
                </span>
              </label>

              {/* Submit button */}
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full flex items-center justify-center gap-2.5 py-2.5 text-sm mt-1"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Authenticating&hellip;
                  </>
                ) : (
                  <>
                    <Lock size={14} />
                    Sign In Securely
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="px-7 py-3 bg-gray-50 border-t border-gray-100 text-center">
            <p className="text-[11px] text-gray-400">
              &copy; {new Date().getFullYear()} Corizo &nbsp;&middot;&nbsp; All
              rights reserved &nbsp;&middot;&nbsp; For internal use only
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
