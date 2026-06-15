import { useCallback, useState, useEffect } from "react";

interface UseTableStateReturn<T> {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  paginatedData: T[];
  totalPages: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  handleSort: (key: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredData: T[];
}

/**
 * Hook to manage table state including pagination, sorting, and filtering
 */
export function useTableState<T extends Record<string, any>>(
  data: T[],
  itemsPerPage = 10,
  searchKeys: (keyof T)[] = [],
): UseTableStateReturn<T> {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<string>();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState("");

  // Filter data based on search term
  const filteredData = useCallback(() => {
    if (!searchTerm || searchKeys.length === 0) return data;

    return data.filter((item) =>
      searchKeys.some((key) => {
        const value = item[key];
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      }),
    );
  }, [data, searchTerm, searchKeys]);

  // Sort filtered data
  const sortedData = useCallback(() => {
    const sorted = [...filteredData()];

    if (sortBy) {
      sorted.sort((a, b) => {
        const aVal = a[sortBy as keyof T];
        const bVal = b[sortBy as keyof T];

        if (typeof aVal === "string" && typeof bVal === "string") {
          return sortOrder === "asc"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }

        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
        }

        return 0;
      });
    }

    return sorted;
  }, [filteredData, sortBy, sortOrder]);

  const sorted = sortedData();
  const totalPages = Math.ceil(sorted.length / itemsPerPage);

  // Reset to page 1 when filtering changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Validate current page
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const paginatedData = sorted.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
  };

  return {
    currentPage,
    setCurrentPage,
    paginatedData,
    totalPages,
    sortBy,
    sortOrder,
    handleSort,
    searchTerm,
    setSearchTerm,
    filteredData: sorted,
  };
}
