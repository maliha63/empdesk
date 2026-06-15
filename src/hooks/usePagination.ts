import { useState, useMemo } from "react";

export function usePagination<T>(items: T[], itemsPerPage: number) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const paginated = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  }, [items, page, itemsPerPage]);

  // Reset to page 1 when items change (filter/search)
  const reset = () => setPage(1);

  return { page, setPage, totalPages, paginated, reset };
}
