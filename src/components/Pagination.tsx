import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex items-center justify-between mt-6 px-4 py-3">
      <div className="text-xs text-(--text-muted)">
        Showing {startItem} to {endItem} of {totalItems} results
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-[#e2e8f0] dark:border-[#1f2a3d] hover:bg-gray-50 dark:hover:bg-[#1f2a3d] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} className="text-(--text-muted)" />
        </button>

        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                currentPage === page
                  ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                  : "border border-[#e2e8f0] dark:border-[#1f2a3d] text-(--text-muted) hover:bg-gray-50 dark:hover:bg-[#1f2a3d]"
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-[#e2e8f0] dark:border-[#1f2a3d] hover:bg-gray-50 dark:hover:bg-[#1f2a3d] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={16} className="text-(--text-muted)" />
        </button>
      </div>
    </div>
  );
}
