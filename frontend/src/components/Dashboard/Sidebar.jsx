import React from 'react';
import { useApp } from '../../context/AppContext.jsx';
import FolderTree from '../Folder/FolderTree.jsx';

const Sidebar = () => {
  const { navigateToFolder, currentFolder } = useApp();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h3>Folders</h3>
      </div>
      
      <div className="sidebar-content">
        <div 
          className={`folder-item root-folder ${!currentFolder ? 'active' : ''}`}
          onClick={() => navigateToFolder(null)}
        >
          <span className="folder-icon">🏠</span>
          <span className="folder-name">Root</span>
        </div>
        
        <FolderTree />
      </div>
    </aside>
  );
};

export default Sidebar;
