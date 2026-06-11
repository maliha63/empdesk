import { useNavigate } from "react-router-dom";
import { ArrowLeft, Home, AlertCircle } from "lucide-react";
import Button from "../components/Button";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f172a] flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Error Icon */}
          <div className="relative">
            <div className="absolute inset-0 bg-brand-500/20 blur-3xl rounded-full"></div>
            <div className="relative bg-gradient-to-br from-brand-500 to-blue-600 p-6 rounded-2xl">
              <AlertCircle size={56} className="text-white" strokeWidth={1.5} />
            </div>
          </div>

          {/* Error Content */}
          <div className="space-y-4">
            <h1 className="text-7xl font-bold bg-gradient-to-r from-brand-600 to-blue-600 bg-clip-text text-transparent">
              404
            </h1>

            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Page not found
            </h2>

            <p className="text-gray-600 dark:text-gray-400 text-base max-w-md mx-auto leading-relaxed">
              Sorry, the page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track with EmpDesk.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-6 w-full sm:w-auto">
            <Button
              onClick={() => navigate(-1)}
              icon={<ArrowLeft size={18} />}
              variant="primary"
              className="bg-gray-100 dark:bg-[#1f2a3d] text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-[#2a3a4d] flex-1 sm:flex-none"
            >
              Go Back
            </Button>
            <Button
              onClick={() => navigate("/dashboard")}
              icon={<Home size={18} />}
              variant="primary"
              className="bg-brand-500 text-white hover:bg-brand-600 flex-1 sm:flex-none"
            >
              Dashboard
            </Button>
          </div>

          {/* Quick Links */}
          <div className="pt-8 border-t border-gray-200 dark:border-[#1f2a3d] w-full">
            <p className="text-sm font-medium text-gray-900 dark:text-white mb-4">
              Helpful links:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: "Dashboard", path: "/dashboard" },
                { label: "Employees", path: "/employees" },
                { label: "Reports", path: "/reports" },
                { label: "Payroll", path: "/payroll" },
              ].map((link) => (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-[#1f2a3d] rounded-lg hover:bg-gray-100 dark:hover:bg-[#2a3a4d] transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Footer Message */}
          <p className="text-xs text-gray-400 dark:text-gray-500 pt-4">
            If you think this is a mistake, please <button onClick={() => navigate("/dashboard")} className="text-brand-500 hover:underline">contact support</button>.
          </p>
        </div>
      </div>
    </div>
  );
}
