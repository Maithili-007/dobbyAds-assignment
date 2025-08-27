import React from 'react';
import { useApp } from '../../context/AppContext';
import ImageGrid from '../Image/ImageGrid';
import SearchResults from '../Image/SearchResults';
import LoadingSpinner from '../Common/LoadingSpinner';

const MainContent = () => {
  const { 
    currentFolder, 
    searchQuery, 
    searchResults, 
    images, 
    loading 
  } = useApp();

  const getBreadcrumbs = () => {
    if (!currentFolder) return [{ name: 'Root', path: '/' }];
    
    const pathParts = currentFolder.path.split('/').filter(part => part);
    const breadcrumbs = [{ name: 'Root', path: '/' }];
    
    pathParts.forEach((part, index) => {
      const path = '/' + pathParts.slice(0, index + 1).join('/');
      breadcrumbs.push({ name: part, path });
    });
    
    return breadcrumbs;
  };

  // FIXED: Only show loading for actual searches, not continuous loading
  const isSearching = searchQuery.trim().length > 0;
  const showSearchResults = isSearching && searchResults.length >= 0; // >= 0 to show even empty results

  return (
    <main className="main-content">
      <div className="content-header">
        <div className="breadcrumbs">
          {getBreadcrumbs().map((crumb, index) => (
            <span key={index} className="breadcrumb-item">
              {crumb.name}
              {index < getBreadcrumbs().length - 1 && (
                <span className="breadcrumb-separator"> / </span>
              )}
            </span>
          ))}
        </div>
        
        <div className="content-stats">
          {isSearching ? (
            <span>{searchResults.length} search results for "{searchQuery}"</span>
          ) : (
            <span>{images.length} images in current folder</span>
          )}
        </div>
      </div>
      
      <div className="content-body">
        {loading && !isSearching && <LoadingSpinner />}
        
        {showSearchResults ? (
          <SearchResults />
        ) : !loading ? (
          <ImageGrid />
        ) : null}
      </div>
    </main>
  );
};

export default MainContent;

