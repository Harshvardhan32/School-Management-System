import React from "react";

const Pagination = ({ totalPages, currentPage, onPageChange }) => {

    // Helper function to generate page numbers
    const getPageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
        return pages;
    };

    // Handle previous page click
    const handlePrevClick = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    // Handle next page click
    const handleNextClick = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <div className="py-4 flex items-center justify-between text-gray-500">
            <button
                onClick={handlePrevClick}
                disabled={currentPage === 1}
                className="py-2 px-4 mr-2 rounded-[6px] bg-lamaGreen text-gray-800 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Prev
            </button>

            <div className="flex items-center gap-2 text-sm">
                {getPageNumbers().map((page) => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`px-2 rounded-sm ${page === currentPage ? 'bg-lamaGreen text-gray-800' : ''}`}
                    >
                        {page}
                    </button>
                ))}
            </div>

            <button
                onClick={handleNextClick}
                disabled={currentPage === totalPages}
                className="py-2 px-4 ml-2 rounded-[6px] bg-lamaGreen text-gray-800 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;