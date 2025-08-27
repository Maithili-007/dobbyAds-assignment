import React from 'react';
import { useApp } from '../../context/AppContext.jsx';
import ImageItem from './ImageItem.jsx';

const SearchResults = () => {
  const { searchResults, searchQuery } = useApp();

  if (searchResults.length === 0 && searchQuery) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🔍</div>
        <h3>No images found</h3>
        <p>No images match your search for "{searchQuery}"</p>
      </div>
    );
  }

  return (
    <div className="search-results">
      <div className="search-results-header">
        <h3>Search Results for "{searchQuery}"</h3>
        <span className="results-count">{searchResults.length} results</span>
      </div>
      
      <div className="image-grid">
        {searchResults.map(image => (
          <div key={image._id} className="search-result-item">
            <ImageItem image={image} />
            <div className="search-result-location">
              <span className="location-label">Location:</span>
              <span className="location-path">{image.folderId?.path || 'Root'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
