import {
  ChevronsLeft,
  ChevronsRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type EmployeePaginationProps = {
  currentPage: number;
  totalPages: number;
  rowsPerPage: number;
  totalEmployees: number;
  startIndex: number;
  endIndex: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
};

function EmployeePagination({
  currentPage,
  totalPages,
  rowsPerPage,
  totalEmployees,
  startIndex,
  endIndex,
  onPageChange,
  onRowsPerPageChange,
}: EmployeePaginationProps) {
  // Don't show pagination if there are 5 or fewer employees
  if (totalEmployees <= 5) {
    return null;
  }

  const goToFirstPage = () => {
    onPageChange(1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const goToLastPage = () => {
    onPageChange(totalPages);
  };

  return (
    <div className="flex items-center justify-between border-t border-[rgba(194,201,181,0.2)] bg-[#f3f4f5] px-6 py-4">
      {/* Rows per page */}
      <div className="flex items-center gap-2 text-sm text-[#625e58]">
        <span>Rows per page:</span>

        <select
          value={rowsPerPage}
          onChange={(event) => {
            onRowsPerPageChange(Number(event.target.value));
            onPageChange(1);
          }}
          className="flex items-center gap-2 rounded-lg bg-transparent px-3 py-2 font-bold text-[#424939] outline-none"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>

        <span className="ml-2">
          Showing {startIndex + 1}-{endIndex} of {totalEmployees}
        </span>
      </div>

      {/* Pagination buttons */}
      <div className="flex items-center gap-1 text-base text-[#625e58]">
        {/* First */}
        <button
          type="button"
          aria-label="First page"
          title="First page"
          disabled={currentPage === 1}
          onClick={goToFirstPage}
          className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronsLeft size={14} />
        </button>

        {/* Previous */}
        <button
          type="button"
          aria-label="Previous page"
          title="Previous page"
          disabled={currentPage === 1}
          onClick={goToPreviousPage}
          className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={14} />
        </button>

        {/* Current page */}
        <button
          type="button"
          className="flex h-8 min-w-8 items-center justify-center rounded-lg bg-[rgba(127,178,73,0.2)] px-3 font-bold text-[#234100]"
        >
          {currentPage}
        </button>

        {/* Next */}
        <button
          type="button"
          aria-label="Next page"
          title="Next page"
          disabled={currentPage === totalPages}
          onClick={goToNextPage}
          className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight size={14} />
        </button>

        {/* Last */}
        <button
          type="button"
          aria-label="Last page"
          title="Last page"
          disabled={currentPage === totalPages}
          onClick={goToLastPage}
          className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronsRight size={14} />
        </button>
      </div>
    </div>
  );
}

export default EmployeePagination;
