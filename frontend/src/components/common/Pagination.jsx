import React, { useState, useEffect } from "react";

const Pagination = ({ totalPages, currentPage, onPageChange }) => {

    const [pages, setPages] = useState([]);

    useEffect(() => {
        const newPages = [];

        // Always include the current page
        if (newPages[0] !== currentPage) {
            newPages.push(currentPage);
        }

        // Include ellipsis and the last page only if the gap exists
        if (totalPages - currentPage > 1) {
            newPages.push("...");
            newPages.push(totalPages);
        } else if (totalPages - currentPage === 1) {
            // Directly add the last page if it's adjacent
            newPages.push(totalPages);
        }

        setPages(newPages); // Update pages array with new pages
    }, [currentPage, totalPages]);

    // Handle previous page navigation
    const handlePrevClick = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    // Handle next page navigation
    const handleNextClick = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <div className="py-4 flex items-center justify-between text-gray-500">
            {/* Previous Button */}
            <button
                title="Prev"
                onClick={handlePrevClick}
                disabled={currentPage === 1} // Disable if on the first page
                className="py-2 px-4 mr-2 rounded-[6px] bg-[#51DFC3] text-gray-800 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Prev
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-2 text-sm">
                {pages?.map((page, index) =>
                    page === "..." ? (
                        <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
                            ...
                        </span>
                    ) : (
                        <button
                            key={`page-${page}`}
                            onClick={() => onPageChange(page)} // Change page on click
                            className={`px-2 rounded-sm ${page === currentPage && "bg-[#51DFC3] text-gray-800"}`}
                        >
                            {page}
                        </button>
                    )
                )}
            </div>

            {/* Next Button */}
            <button
                title="Next"
                onClick={handleNextClick}
                disabled={currentPage === totalPages}
                className="py-2 px-4 ml-2 rounded-[6px] bg-[#51DFC3] text-gray-800 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;