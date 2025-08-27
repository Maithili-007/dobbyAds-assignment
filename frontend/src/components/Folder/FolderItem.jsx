import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';

const FolderItem = ({ folder, children }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { currentFolder, navigateToFolder, deleteFolder } = useApp();
  const isActive = currentFolder?._id === folder._id;

  const handleFolderClick = () => {
    navigateToFolder(folder);
  };

  const handleToggleExpand = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleDeleteFolder = async (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${folder.name}"?`)) {
      const result = await deleteFolder(folder._id);
      if (!result.success) {
        alert(result.error);
      }
    }
  };

  return (
    <div className="folder-item-container">
      <div 
        className={`folder-item ${isActive ? 'active' : ''}`}
        onClick={handleFolderClick}
      >
        <div className="folder-item-left">
          {children.length > 0 && (
            <button 
              className="expand-button"
              onClick={handleToggleExpand}
            >
              {isExpanded ? '▼' : '▶'}
            </button>
          )}
          <span className="folder-icon">📁</span>
          <span className="folder-name">{folder.name}</span>
        </div>
        
        <div className="folder-item-actions">
          <button 
            className="delete-button"
            onClick={handleDeleteFolder}
            title="Delete folder"
          >
            🗑️
          </button>
        </div>
      </div>
      
      {isExpanded && children.length > 0 && (
        <div className="folder-children">
          {children.map(childFolder => (
            <FolderItem 
              key={childFolder._id} 
              folder={childFolder} 
              children={childFolder.children || []}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FolderItem;
