import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Crumb {
  label: string;
  to?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  crumbs?: Crumb[];
  action?: ReactNode;
}

export function PageHeader({
  title,
  description,
  crumbs,
  action,
}: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
      <div>
        {crumbs && crumbs.length > 0 && (
          <nav
            className="flex items-center gap-1 mb-1.5"
            aria-label="Breadcrumb"
          >
            {crumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && (
                  <ChevronRight
                    size={12}
                    className="text-gray-300 dark:text-[#2a3a54]"
                  />
                )}
                {c.to ? (
                  <button
                    onClick={() => navigate(c.to!)}
                    className="text-[11px] font-medium text-gray-400 dark:text-[#4b5e7a] hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
                  >
                    {c.label}
                  </button>
                ) : (
                  <span className="text-[11px] font-medium text-(--text-muted)">
                    {c.label}
                  </span>
                )}
              </span>
            ))}
          </nav>
        )}

        <h1 className="text-xl font-bold text-(--text-primary) tracking-tight leading-tight">
          {title}
        </h1>

        {description && (
          <p className="text-sm text-(--text-muted) mt-0.5 font-normal">
            {description}
          </p>
        )}
      </div>

      {action && <div className="mt-0.5 shrink-0">{action}</div>}
    </div>
  );
}
