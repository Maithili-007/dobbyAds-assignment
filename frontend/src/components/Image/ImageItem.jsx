import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { api } from '../../utils/api.jsx';

const ImageItem = ({ image }) => {
  const [showFullImage, setShowFullImage] = useState(false);
  const { deleteImage } = useApp();

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${image.name}"?`)) {
      const result = await deleteImage(image._id);
      if (!result.success) {
        alert(result.error);
      }
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <>
      <div className="image-item" onClick={() => setShowFullImage(true)}>
        <div className="image-thumbnail">
          <img 
            src={api.getImageUrl(image.filePath)} 
            alt={image.name}
            loading="lazy"
          />
          <div className="image-overlay">
            <button 
              className="delete-button"
              onClick={handleDelete}
              title="Delete image"
            >
              🗑️
            </button>
          </div>
        </div>
        
        <div className="image-info">
          <h4 className="image-name" title={image.name}>
            {image.name}
          </h4>
          <div className="image-details">
            <span className="image-size">{formatFileSize(image.fileSize)}</span>
            <span className="image-date">{formatDate(image.createdAt)}</span>
          </div>
        </div>
      </div>

      {showFullImage && (
        <div className="image-modal" onClick={() => setShowFullImage(false)}>
          <div className="image-modal-content" onClick={e => e.stopPropagation()}>
            <div className="image-modal-header">
              <h3>{image.name}</h3>
              <button 
                className="close-button"
                onClick={() => setShowFullImage(false)}
              >
                ✕
              </button>
            </div>
            <div className="image-modal-body">
              <img 
                src={api.getImageUrl(image.filePath)} 
                alt={image.name}
                className="full-image"
              />
            </div>
            <div className="image-modal-footer">
              <div className="image-modal-info">
                <span>Size: {formatFileSize(image.fileSize)}</span>
                <span>Uploaded: {formatDate(image.createdAt)}</span>
                <span>Folder: {image.folderId?.path || 'Root'}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageItem;
