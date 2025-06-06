// components/Pagination.js
import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Pagination = ({ currentPage, totalPages, onNext, onPrev }) => {
  return (
    <div className="mt-6 flex justify-center items-center gap-4">
      <button
        onClick={onPrev}
        disabled={currentPage === 1}
        className={`px-4 py-2 rounded-md flex items-center gap-2 ${
          currentPage === 1
            ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        <FaChevronLeft />
        Prev
      </button>

      <span className="text-gray-800 dark:text-gray-200 font-medium">
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={onNext}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 rounded-md flex items-center gap-2 ${
          currentPage === totalPages
            ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        Next
        <FaChevronRight />
      </button>
    </div>
  );
};

export default Pagination;
