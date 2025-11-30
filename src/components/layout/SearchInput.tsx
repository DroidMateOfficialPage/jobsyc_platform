"use client";

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaSearch } from 'react-icons/fa';

const SearchInput = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleFocus = () => {
    setShowSuggestions(true);
  };

  const handleBlur = () => {
    setTimeout(() => setShowSuggestions(false), 200);
  };

  return (
    <StyledWrapper>
      <div className="container">
        <div className="search-container">
          <input
            className="input"
            type="text"
            placeholder="Pretraži..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          <FaSearch className="search__icon" />
          {showSuggestions && (
            <div className="suggestions">
              <div className="suggestion">Nema dostupnih rezultata</div>
            </div>
          )}
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .container {
    position: relative;
    background: linear-gradient(135deg, rgb(42, 77, 122) 0%, rgb(164, 202, 248) 100%);
    border-radius: 1000px;
    padding: 3px;
    display: flex;
    align-items: center;
    z-index: 1;
    max-width: 400px;
    margin: 0 10px;
    box-shadow: 0 0 15px rgba(2, 116, 179, 0.2);
  }

  .search-container {
    position: relative;
    width: 100%;
    border-radius: 50px;
    background: linear-gradient(135deg, rgb(42, 77, 122) 0%, rgb(214, 229, 247) 100%);
    display: flex;
    align-items: center;
  }

  .input {
    padding: 15px 8px;
    height: 24px;
    width: 100%;
    background: linear-gradient(135deg, rgb(42, 77, 122) 0%, rgb(214, 229, 247) 100%);
    border: none;
    color:rgb(45, 75, 103);
    font-size: 15px;
    border-radius: 50px;
    outline: none;
    transition: background 0.3s ease;
  }

  .input:focus {
    background: linear-gradient(135deg, rgb(239, 247, 255) 0%, rgb(214, 229, 247) 100%);
  }

  .search__icon {
    width: 20px;
    height: 20px;
    margin-left: -30px;
    color: white;
  }

  .suggestions {
    position: absolute;
    top: 110%;
    left: 0;
    width: 100%;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 10;
  }

  .suggestion {
    padding: 10px;
    cursor: pointer;
    transition: background 0.2s ease;
  }

  .suggestion:hover {
    background: #f1f1f1;
  }
`;

export default SearchInput;