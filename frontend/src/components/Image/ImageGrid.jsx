import React from 'react';
import { useApp } from '../../context/AppContext.jsx';
import ImageItem from './ImageItem.jsx';

const ImageGrid = () => {
  const { images, currentFolder } = useApp();

  if (images.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📷</div>
        <h3>No images in this folder</h3>
        <p>
          {currentFolder 
            ? `Upload some images to "${currentFolder.name}"`
            : 'Upload some images to get started'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="image-grid">
      {images.map(image => (
        <ImageItem key={image._id} image={image} />
      ))}
    </div>
  );
};

export default ImageGrid;
