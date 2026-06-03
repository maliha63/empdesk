import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";
import { Eye, EyeOff, ArrowRight } from "lucide-react";

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
    <div className="w-full max-w-sm mx-auto">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-brand-500 shadow-[0_4px_16px_rgb(59_130_246/0.4)] mb-4">
          <svg width="20" height="20" viewBox="0 0 14 14" fill="none">
            <rect x="1" y="1" width="5" height="5" rx="1.5" fill="white" fillOpacity="0.95"/>
            <rect x="8" y="1" width="5" height="5" rx="1.5" fill="white" fillOpacity="0.6"/>
            <rect x="1" y="8" width="5" height="5" rx="1.5" fill="white" fillOpacity="0.6"/>
            <rect x="8" y="8" width="5" height="5" rx="1.5" fill="white" fillOpacity="0.95"/>
          </svg>
        </div>
        <h1 className="text-[22px] font-bold text-gray-900 dark:text-white tracking-tight font-mono">
          emp<span className="text-brand-500">desk</span>
        </h1>
        <p className="text-sm text-gray-400 dark:text-[#4b5e7a] mt-1">
          Sign in to your workspace
        </p>
      </div>

      {/* Card */}
      <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-2xl p-6 shadow-[0_4px_24px_-4px_rgb(0,0,0,0.08)] dark:shadow-[0_4px_24px_-4px_rgb(0,0,0,0.4)]">

        {/* Test credentials */}
        <div className="mb-5 p-3.5 rounded-xl bg-brand-50 dark:bg-brand-500/[0.08] border border-brand-100 dark:border-brand-500/20">
          <p className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 mb-1.5 uppercase tracking-wide">
            Test accounts
          </p>
          <div className="space-y-1 font-mono text-[11px] text-gray-500 dark:text-[#4b5e7a]">
            <p>Manager → <span className="text-gray-800 dark:text-gray-300 font-medium">emilys</span> / emilyspass</p>
            <p>Employee → <span className="text-gray-800 dark:text-gray-300 font-medium">sophiab</span> / sophiabpass</p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 text-[13px]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-500 dark:text-[#4b5e7a] mb-1.5 uppercase tracking-wide">
              Username
            </label>
            <input
              type="text"
              autoComplete="username"
              placeholder="Enter your username"
              className={`w-full bg-[#f8fafc] dark:bg-[#0b0f1a] border rounded-xl px-4 py-2.5 text-[13px]
                text-gray-900 dark:text-gray-100 placeholder-gray-300 dark:placeholder-[#2a3a54]
                outline-none transition-all duration-150
                focus:bg-white dark:focus:bg-[#0f1623] focus:border-brand-400 focus:ring-2 focus:ring-brand-500/10
                ${errors.username
                  ? "border-red-300 dark:border-red-500/50 ring-2 ring-red-500/10"
                  : "border-[#e2e8f0] dark:border-[#1f2a3d]"
                }`}
              {...register("username", {
                required: "Username is required",
                minLength: { value: 3, message: "Min 3 characters" },
              })}
            />
            {errors.username && (
              <p className="mt-1 text-[11px] text-red-500">{errors.username.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-500 dark:text-[#4b5e7a] mb-1.5 uppercase tracking-wide">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                className={`w-full bg-[#f8fafc] dark:bg-[#0b0f1a] border rounded-xl px-4 py-2.5 pr-10 text-[13px]
                  text-gray-900 dark:text-gray-100 placeholder-gray-300 dark:placeholder-[#2a3a54]
                  outline-none transition-all duration-150
                  focus:bg-white dark:focus:bg-[#0f1623] focus:border-brand-400 focus:ring-2 focus:ring-brand-500/10
                  ${errors.password
                    ? "border-red-300 dark:border-red-500/50 ring-2 ring-red-500/10"
                    : "border-[#e2e8f0] dark:border-[#1f2a3d]"
                  }`}
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Min 6 characters" },
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 dark:text-[#2a3a54] hover:text-gray-500 dark:hover:text-gray-400 transition-colors"
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-[11px] text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 mt-1
              bg-brand-500 hover:bg-brand-600 active:bg-brand-700
              disabled:opacity-50 disabled:cursor-not-allowed
              text-white font-semibold text-[13px] py-2.5 rounded-xl
              transition-all duration-150
              shadow-[0_2px_8px_rgb(59_130_246/0.35)] hover:shadow-[0_4px_16px_rgb(59_130_246/0.4)]
              hover:-translate-y-[1px] active:translate-y-0"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Signing in...
              </span>
            ) : (
              <>
                Sign in
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>
      </div>

      <p className="text-center text-[11px] text-gray-300 dark:text-[#2a3a54] mt-6">
        Employee Management System · empdesk
      </p>
    </div>
  );
}