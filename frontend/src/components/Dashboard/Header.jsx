import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import Button from '../Common/Button';

const Header = ({ onCreateFolder, onUploadImage }) => {
  const { user, logout } = useAuth();
  const { searchQuery, setSearchQuery, searchImages } = useApp();
  const [searchInput, setSearchInput] = useState('');

  // FIXED: Remove searchImages from dependencies to prevent infinite loop
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setSearchQuery(searchInput);
      if (searchInput.trim()) {
        searchImages(searchInput);
      } else {
        // Clear search results when search is empty
        searchImages('');
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchInput, setSearchQuery]); // Removed searchImages from dependencies

  // FIXED: Clear search when component unmounts or user navigates
  useEffect(() => {
    return () => {
      setSearchInput('');
      setSearchQuery('');
    };
  }, [setSearchQuery]);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  // FIXED: Clear search function
  const clearSearch = useCallback(() => {
    setSearchInput('');
    setSearchQuery('');
  }, [setSearchQuery]);

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="app-title">Image Manager</h1>
      </div>
      
      <div className="header-center">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search images..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="search-input"
          />
          {searchInput && (
            <button 
              className="search-clear"
              onClick={clearSearch}
              type="button"
            >
              ✕
            </button>
          )}
          <span className="search-icon">🔍</span>
        </div>
      </div>
      
      <div className="header-right">
        <Button variant="secondary" onClick={onCreateFolder}>
          📁 New Folder
        </Button>
        <Button variant="primary" onClick={onUploadImage}>
          📤 Upload Image
        </Button>
        <div className="user-menu">
          <span className="user-name">Welcome, {user?.username}</span>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;

