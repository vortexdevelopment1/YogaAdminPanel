// Pagination component with Previous/Next page controls and active page tracker

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages || totalPages === 0;

  return (
    <div className="flex items-center justify-between px-2 py-3">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={isFirstPage}
        className={`px-4 py-2 text-xs md:text-sm font-medium rounded-lg border border-sand bg-white text-charcoal transition-colors ${
          isFirstPage
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-sand/40 cursor-pointer"
        }`}
      >
        Previous
      </button>

      <span className="text-xs md:text-sm text-warmgray font-medium">
        Page <span className="font-semibold text-charcoal">{totalPages === 0 ? 0 : currentPage}</span> of{" "}
        <span className="font-semibold text-charcoal">{totalPages}</span>
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={isLastPage}
        className={`px-4 py-2 text-xs md:text-sm font-medium rounded-lg border border-sand bg-white text-charcoal transition-colors ${
          isLastPage
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-sand/40 cursor-pointer"
        }`}
      >
        Next
      </button>
    </div>
  );
}
