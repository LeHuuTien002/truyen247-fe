import React from 'react';

const Pagination = ({ totalPages, currentPage, onPageChange, rowsPerPage }) => {
    const generatePageNumbers = () => {
        const pageNumbers = [];

        if (currentPage > rowsPerPage + 1) {
            pageNumbers.push(1);
            pageNumbers.push('...');
        }

        for (let i = Math.max(currentPage - rowsPerPage, 1); i <= Math.min(currentPage + rowsPerPage, totalPages); i++) {
            pageNumbers.push(i);
        }

        if (currentPage < totalPages - rowsPerPage - 1) {
            pageNumbers.push('...');
            pageNumbers.push(totalPages);
        }

        return pageNumbers;
    };

    return (
        <nav>
            <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => onPageChange(currentPage - 1)}>
                        <i className="bi bi-chevron-left"></i> {/* Mũi tên trái */}
                    </button>
                </li>

                {generatePageNumbers().map((page, index) => (
                    page === '...' ? (
                        <li key={index} className="page-item disabled">
                            <span className="page-link">...</span>
                        </li>
                    ) : (
                        <li key={index} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => onPageChange(page)}>
                                {page}
                            </button>
                        </li>
                    )
                ))}

                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => onPageChange(currentPage + 1)}>
                        <i className="bi bi-chevron-right"></i> {/* Mũi tên phải */}
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;
