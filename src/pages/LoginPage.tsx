import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";
import { Eye, EyeOff } from "lucide-react";

interface LoginFormValues {
  username: string;
  password: string;
}

export default function LoginPage() {
  const { login, isLoading, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>();

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard", { replace: true });
  }, [isAuthenticated, navigate]);

  async function onSubmit(data: LoginFormValues) {
    await login(data.username, data.password);
  }

  return (
    <div className="bg-surface-card border border-surface-border rounded-2xl p-8">
      <div className="mb-8">
        <span className="text-brand-500 font-bold text-2xl tracking-tight font-mono">
          emp<span className="text-white">desk</span>
        </span>
        <p className="text-slate-400 text-sm mt-2">Sign in to your workspace</p>
      </div>

      {/* Test credentials */}
      <div className="mb-6 p-3 rounded-lg bg-brand-500/10 border border-brand-500/20 text-xs text-slate-400 space-y-1 font-mono">
        <p className="text-brand-500 font-semibold mb-1 font-sans text-xs">Test accounts</p>
        <p>Manager → <span className="text-white">emilys</span> / emilyspass</p>
        <p>Employee → <span className="text-white">sophiab</span> / sophiabpass</p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Username</label>
          <input
            type="text"
            autoComplete="username"
            placeholder="Enter your username"
            className={`w-full bg-surface border rounded-lg px-4 py-2.5 text-sm text-white
              placeholder-slate-600 outline-none transition-colors focus:border-brand-500
              ${errors.username ? "border-red-500" : "border-surface-border"}`}
            {...register("username", {
              required: "Username is required",
              minLength: { value: 3, message: "Min 3 characters" },
            })}
          />
          {errors.username && <p className="mt-1 text-xs text-red-400">{errors.username.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              className={`w-full bg-surface border rounded-lg px-4 py-2.5 pr-10 text-sm text-white
                placeholder-slate-600 outline-none transition-colors focus:border-brand-500
                ${errors.password ? "border-red-500" : "border-surface-border"}`}
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Min 6 characters" },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed
            text-white font-medium text-sm py-2.5 rounded-lg transition-colors mt-2"
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}