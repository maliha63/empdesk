import type { ReactNode } from "react";

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export default function FormSection({
  title,
  description,
  children,
}: FormSectionProps) {
  return (
    <div className="space-y-4">
      <div className="bg-gray-50 dark:bg-[#0f172a] px-4 py-3 rounded-xl">
        <h3 className="text-sm font-semibold text-(--text-primary)">{title}</h3>
        {description && (
          <p className="text-xs text-(--text-muted) mt-1">{description}</p>
        )}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
