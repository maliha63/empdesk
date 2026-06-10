import { Pencil, Trash2 } from "lucide-react";

interface TableActionButtonsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  isLoading?: boolean;
}

export default function TableActionButtons({
  onEdit,
  onDelete,
  isLoading = false,
}: TableActionButtonsProps) {
  return (
    <div className="flex items-center gap-2">
      {onEdit && (
        <button
          onClick={onEdit}
          disabled={isLoading}
          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Edit"
        >
          <Pencil size={16} />
        </button>
      )}
      {onDelete && (
        <button
          onClick={onDelete}
          disabled={isLoading}
          className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  );
}
