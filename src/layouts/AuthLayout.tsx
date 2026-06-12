import type { ReactNode } from "react";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Brand (40%) */}
      <div className="hidden lg:flex lg:w-2/5 bg-black flex-col items-center justify-center p-8 text-white">
        <div className="max-w-md text-center space-y-6">
          <div className="flex items-center justify-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-white/20 shadow-lg">
              <svg width="32" height="32" viewBox="0 0 14 14" fill="none">
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
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-2">EmpDesk</h1>
            <p className="text-white/80 text-lg">Manage your team, effortlessly</p>
          </div>
          <div className="pt-4 space-y-3 text-white/70">
            <div className="flex items-start gap-3">
              <span className="text-xl mt-1">✓</span>
              <span>Streamlined employee management</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl mt-1">✓</span>
              <span>Performance tracking and insights</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl mt-1">✓</span>
              <span>Leave and attendance management</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form (60% on desktop, 100% on mobile) */}
      <div className="w-full lg:w-3/5 bg-white dark:bg-[#0f172a] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
