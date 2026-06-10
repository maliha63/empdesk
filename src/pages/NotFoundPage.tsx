import { useNavigate } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";
import Button from "../components/Button";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 to-gray-800 dark:from-[#0f172a] dark:to-[#1f2a3d] flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Illustration */}
          <div className="w-64 h-64 mb-4">
            <img
              src="/404-illustration.png"
              alt="404 Error"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Error Content */}
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <h1 className="text-8xl font-bold text-gray-200 dark:text-gray-100">
                404
              </h1>
            </div>

            <h2 className="text-3xl font-bold text-white">
              Oops, something went wrong
            </h2>

            <p className="text-gray-400 dark:text-gray-300 text-lg max-w-md mx-auto">
              Sorry, the page you&apos;re looking for doesn&apos;t exist or has
              been moved. Let&apos;s get you back on track.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button
              onClick={() => navigate(-1)}
              icon={<ArrowLeft size={18} />}
              variant="primary"
              className="bg-white dark:bg-white text-gray-900 dark:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-100"
            >
              Go Back
            </Button>
            <Button
              onClick={() => navigate("/dashboard")}
              icon={<Home size={18} />}
              variant="primary"
              className="bg-gray-700 dark:bg-gray-600 text-white hover:bg-gray-600 dark:hover:bg-gray-700"
            >
              Dashboard
            </Button>
          </div>

          {/* Quick Links */}
          <div className="pt-8 border-t border-gray-700 dark:border-[#1f2a3d] w-full">
            <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">
              Need help? Here are some quick links:
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { label: "Dashboard", path: "/dashboard" },
                { label: "Employees", path: "/employees" },
                { label: "Reports", path: "/reports" },
                { label: "Settings", path: "/settings" },
              ].map((link) => (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className="text-sm text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-200 transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
