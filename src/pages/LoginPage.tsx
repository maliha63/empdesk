import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";
import { Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";

interface LoginFormValues {
  username: string;
  password: string;
}

export default function LoginPage() {
  const { login, isLoading, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>();

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard", { replace: true });
  }, [isAuthenticated, navigate]);

  async function onSubmit(data: LoginFormValues) {
    await login(data.username, data.password);
  }

  return (
    <div className="w-full">
      {/* Logo - Mobile Only */}
      <div className="lg:hidden text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-black dark:bg-zinc-800 shadow-[0_4px_16px_rgba(0,0,0,0.2)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.4)] mb-4">
          <svg width="24" height="24" viewBox="0 0 14 14" fill="none">
            <rect
              x="1"
              y="1"
              width="5"
              height="5"
              rx="1.5"
              fill="white"
              fillOpacity="0.95"
            />
            <rect
              x="8"
              y="1"
              width="5"
              height="5"
              rx="1.5"
              fill="white"
              fillOpacity="0.6"
            />
            <rect
              x="1"
              y="8"
              width="5"
              height="5"
              rx="1.5"
              fill="white"
              fillOpacity="0.6"
            />
            <rect
              x="8"
              y="8"
              width="5"
              height="5"
              rx="1.5"
              fill="white"
              fillOpacity="0.95"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
          emp<span className="text-gray-500 dark:text-gray-400">desk</span>
        </h1>
      </div>

      {/* Card */}
      <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-2xl p-8 shadow-[0_4px_24px_-4px_rgb(0,0,0,0.08)] dark:shadow-[0_4px_24px_-4px_rgb(0,0,0,0.4)]">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back
          </h2>
          <p className="text-sm text-gray-500 dark:text-[#4b5e7a] mt-1.5">
            Sign in to access your workspace
          </p>
        </div>

        {/* Fixed Caution Warning Layout */}
        {error && (
          <div className="mb-6 flex items-center gap-2.5 py-2.5 px-3.5 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold">
            <AlertCircle size={14} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-5"
        >
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-white mb-2">
              Username
            </label>
            <input
              type="text"
              autoComplete="username"
              placeholder="Enter your username"
              className={`w-full bg-gray-50 dark:bg-[#0b0f1a] border rounded-lg px-4 py-3 text-sm text-gray-900 dark:text-gray-100 outline-none placeholder-gray-400 dark:placeholder-[#545f72] focus:bg-white dark:focus:bg-[#0f1623] focus:border-black dark:focus:border-zinc-500 focus:ring-2 focus:ring-black/5 dark:focus:ring-white/5 ${errors.username ? "border-red-300 dark:border-red-500/50 ring-2 ring-red-500/10" : "border-gray-200 dark:border-[#1f2a3d]"}`}
              {...register("username", { required: "Username is required" })}
            />
            {errors.username && (
              <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-white mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                className={`w-full bg-gray-50 dark:bg-[#0b0f1a] border rounded-lg px-4 py-3 pr-11 text-sm text-gray-900 dark:text-gray-100 outline-none focus:bg-white dark:focus:bg-[#0f1623] focus:border-black dark:focus:border-zinc-500 focus:ring-2 focus:ring-black/5 dark:focus:ring-white/5 ${errors.password ? "border-red-300 dark:border-red-500/50 ring-2 ring-red-500/10" : "border-gray-200 dark:border-[#1f2a3d]"}`}
                {...register("password", { required: "Password is required" })}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#2a3a54] hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 mt-6 bg-black hover:bg-zinc-800 text-white font-semibold text-base py-3 rounded-lg disabled:opacity-50 shadow-[0_2px_8px_rgba(0,0,0,0.15)] transition-all"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Signing in...
              </span>
            ) : (
              <>
                Sign in <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      </div>

      <p className="text-center text-xs text-gray-400 dark:text-[#2a3a54] mt-8">
        © 2026 EmpDesk. All rights reserved.
      </p>
    </div>
  );
}
