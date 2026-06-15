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
    <div className="flex items-start justify-between gap-4 flex-wrap mb-8">
      <div>
        {crumbs && crumbs.length > 0 && (
          <nav
            className="flex items-center gap-1.5 mb-3 text-[15px]"
            aria-label="Breadcrumb"
          >
            {crumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && (
                  <ChevronRight
                    size={18}
                    className="text-gray-400 dark:text-[#2a3a54]"
                  />
                )}
                {c.to ? (
                  <button
                    onClick={() => navigate(c.to!)}
                    className="font-medium text-gray-500 dark:text-[#4b5e7a] hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
                  >
                    {c.label}
                  </button>
                ) : (
                  <span className="font-semibold text-(--text-primary)">
                    {c.label}
                  </span>
                )}
              </span>
            ))}
          </nav>
        )}

        <h1 className="text-2xl font-bold text-(--text-primary) tracking-tight leading-none">
          {title}
        </h1>

        {description && (
          <p className="text-sm text-(--text-muted) mt-1.5 font-normal">
            {description}
          </p>
        )}
      </div>

      {action && <div className="mt-1 shrink-0">{action}</div>}
    </div>
  );
}
