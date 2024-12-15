import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const handleClick = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            onPageChange(pageNumber);
        }
    };

    const renderPaginationItems = () => {
        const paginationItems = [];

        // Trang đầu tiên
        if (currentPage > 3) {
            paginationItems.push(
                <li key="1" className="page-item">
                    <button className="page-link" onClick={() => handleClick(1)}>
                        1
                    </button>
                </li>
            );
            paginationItems.push(
                <li key="ellipsis-left" className="page-item disabled">
                    <span className="page-link">...</span>
                </li>
            );
        }

        // Các trang xung quanh trang hiện tại
        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 ||
                i === totalPages ||
                (i >= currentPage - 2 && i <= currentPage + 2)
            ) {
                paginationItems.push(
                    <li
                        key={i}
                        className={`page-item ${currentPage === i ? 'active' : ''}`}
                    >
                        <button className="page-link" onClick={() => handleClick(i)}>
                            {i}
                        </button>
                    </li>
                );
            }
        }

        // Trang cuối cùng
        if (currentPage < totalPages - 2) {
            paginationItems.push(
                <li key="ellipsis-right" className="page-item disabled">
                    <span className="page-link">...</span>
                </li>
            );
            paginationItems.push(
                <li key={totalPages} className="page-item">
                    <button className="page-link" onClick={() => handleClick(totalPages)}>
                        {totalPages}
                    </button>
                </li>
            );
        }

        return paginationItems;
    };

    return (
        <nav>
            <ul className="pagination justify-content-center">
                {/* Nút Previous */}
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => handleClick(currentPage - 1)}>
                        <i className="bi bi-chevron-left"></i> {/* Mũi tên trái */}
                    </button>
                </li>

                {/* Các trang */}
                {renderPaginationItems()}

                {/* Nút Next */}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => handleClick(currentPage + 1)}>
                        <i className="bi bi-chevron-right"></i> {/* Mũi tên phải */}
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;
