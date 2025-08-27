import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import Modal from '../Common/Modal.jsx';
import Button from '../Common/Button.jsx';

const CreateFolderModal = ({ onClose }) => {
  const [folderName, setFolderName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { createFolder, currentFolder } = useApp();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!folderName.trim()) {
      setError('Folder name is required');
      return;
    }

    setError('');
    setLoading(true);

    const result = await createFolder({
      name: folderName.trim(),
      parentId: currentFolder?._id || null
    });

    if (result.success) {
      onClose();
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <Modal title="Create New Folder" onClose={onClose}>
      <form onSubmit={handleSubmit} className="create-folder-form">
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label htmlFor="folderName">Folder Name</label>
          <input
            type="text"
            id="folderName"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder="Enter folder name"
            disabled={loading}
            autoFocus
          />
        </div>
        
        <div className="form-group">
          <label>Location</label>
          <div className="location-display">
            {currentFolder ? currentFolder.path : '/Root'}
          </div>
        </div>
        
        <div className="modal-actions">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            Create Folder
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateFolderModal;
