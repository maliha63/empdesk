import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Crumb {
  label: string;
  to?:   string;
}

interface PageHeaderProps {
  title:        string;
  description?: string;
  crumbs?:      Crumb[];
  action?:      ReactNode;
}

import type { ReactNode } from "react";

export function PageHeader({ title, description, crumbs, action }: PageHeaderProps) {
  const navigate = useNavigate();
  return (
    <div className="flex items-start justify-between gap-4 flex-wrap">
      <div>
        {crumbs && crumbs.length > 0 && (
          <div className="flex items-center gap-1 mb-1">
            {crumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && <ChevronRight size={12} className="text-slate-600" />}
                {c.to ? (
                  <button
                    onClick={() => navigate(c.to!)}
                    className="text-xs text-slate-500 hover:text-white transition-colors"
                  >
                    {c.label}
                  </button>
                ) : (
                  <span className="text-xs text-slate-400">{c.label}</span>
                )}
              </span>
            ))}
          </div>
        )}
        <h1 className="text-xl font-semibold text-white">{title}</h1>
        {description && <p className="text-sm text-slate-400 mt-0.5">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}