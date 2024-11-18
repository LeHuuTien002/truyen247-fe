import React from "react";

const Pagination = ({totalPages, currentPage, handleClick}) => {
    return (
        <nav className="mt-3">
            <ul className="pagination justify-content-center">
                {/* Nút Previous */}
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => handleClick(currentPage - 1)}>
                        Previous
                    </button>
                </li>

                {/* Các số trang */}
                {Array.from({length: totalPages}, (_, i) => (
                    <li
                        key={i}
                        className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}
                    >
                        <button
                            className="page-link"
                            onClick={() => handleClick(i + 1)}
                        >
                            {i + 1}
                        </button>
                    </li>
                ))}

                {/* Nút Next */}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => handleClick(currentPage + 1)}>
                        Next
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;
