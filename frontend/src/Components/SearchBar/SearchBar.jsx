import React, { useState, useEffect } from 'react';
import { search } from '../../Utils/Icons';

const SearchBar = ({ onSearch, placeholder = "Search..." }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Debounce search to avoid too many API calls
    const timer = setTimeout(() => {
      if (searchTerm) {
        onSearch(searchTerm);
      } else {
        onSearch('');
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFocus = () => {
    setIsExpanded(true);
  };

  const handleBlur = () => {
    if (!searchTerm) {
      setIsExpanded(false);
    }
  };

  return (
    <div className={`search-container ${isExpanded ? 'expanded' : ''}`}>
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      <div className="search-btn">
        {search}
      </div>
    </div>
  );
};

export default SearchBar; 