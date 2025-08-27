import React, { useState } from 'react';
import Header from './Header.jsx';
import Sidebar from './Sidebar.jsx';
import MainContent from './MainContent.jsx';
import CreateFolderModal from '../Folder/CreateFolderModal.jsx';
import UploadImageModal from '../Image/UploadImageModal.jsx';

const Dashboard = () => {
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showUploadImage, setShowUploadImage] = useState(false);

  return (
    <div className="dashboard">
      <Header 
        onCreateFolder={() => setShowCreateFolder(true)}
        onUploadImage={() => setShowUploadImage(true)}
      />
      
      <div className="dashboard-body">
        <Sidebar />
        <MainContent />
      </div>

      {showCreateFolder && (
        <CreateFolderModal onClose={() => setShowCreateFolder(false)} />
      )}

      {showUploadImage && (
        <UploadImageModal onClose={() => setShowUploadImage(false)} />
      )}
    </div>
  );
};

export default Dashboard;
