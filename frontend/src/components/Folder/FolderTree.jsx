import React from 'react';
import { useApp } from '../../context/AppContext.jsx';
import FolderItem from './FolderItem.jsx';

const FolderTree = () => {
  const { folders } = useApp();

  const buildFolderTree = (parentId = null) => {
    return folders
      .filter(folder => folder.parentId === parentId)
      .map(folder => ({
        ...folder,
        children: buildFolderTree(folder._id)
      }));
  };

  const renderFolderTree = (folderTree) => {
    return folderTree.map(folder => (
      <FolderItem 
        key={folder._id} 
        folder={folder} 
        children={folder.children}
      />
    ));
  };

  const folderTree = buildFolderTree();

  return (
    <div className="folder-tree">
      {folderTree.length === 0 ? (
        <div className="empty-state">
          <p>No folders yet. Create your first folder!</p>
        </div>
      ) : (
        renderFolderTree(folderTree)
      )}
    </div>
  );
};

export default FolderTree;
