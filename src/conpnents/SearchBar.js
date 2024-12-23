import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        onSearch(value);
    };

    return (
        <div className="input-group mb-3">
            <input
                type="text"
                className="form-control"
                placeholder="Tìm kiếm ..."
                value={searchTerm}
                onChange={handleSearch}
            />
            <button className="btn btn-outline-warning" type="button">
                Tìm kiếm
            </button>
        </div>
    );
};

export default SearchBar;
