import type { ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
}: ModalProps) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-2xl",
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className={`bg-white dark:bg-[#111827] rounded-2xl w-full ${sizeClasses[size]} shadow-lg`}
      >
        <div className="flex items-center justify-between border-b border-(--border) p-6">
          <h2 className="text-lg font-semibold text-(--text-primary)">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1f2a3d] transition-colors"
          >
            <X size={20} className="text-(--text-muted)" />
          </button>
        </div>

        <div className="p-6">{children}</div>

        {footer && (
          <div className="flex gap-3 border-t border-(--border) p-6 bg-gray-50 dark:bg-[#0f172a] rounded-b-2xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
