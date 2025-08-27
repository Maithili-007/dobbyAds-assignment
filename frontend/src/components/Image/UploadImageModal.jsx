import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import Modal from '../Common/Modal.jsx';
import Button from '../Common/Button.jsx';

const UploadImageModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    image: null
  });
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { uploadImage, currentFolder } = useApp();

  // File input handler
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log('File selected:', file); // Debug log

    if (file) {
      // Update state with file
      setFormData(prev => ({
        ...prev,
        image: file
      }));

      // Preview the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Autofill name if empty
      if (!formData.name) {
        const nameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");
        setFormData(prev => ({
          ...prev,
          name: nameWithoutExtension,
          image: file // keep file
        }));
      }
    }
  };

  // Text input handler
  const handleNameChange = (e) => {
    setFormData(prev => ({
      ...prev,
      name: e.target.value
    }));
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Image name is required');
      return;
    }

    if (!formData.image) {
      setError('Please select an image file');
      return;
    }

    if (!currentFolder) {
      setError('Please select a folder first');
      return;
    }

    setLoading(true);

    const uploadData = new FormData();
    uploadData.append('name', formData.name.trim());
    uploadData.append('image', formData.image);
    uploadData.append('folderId', currentFolder._id);

    console.log('FormData contents:');
    for (let pair of uploadData.entries()) {
      console.log(pair[0], ':', pair[1]);
    }

    try {
      const result = await uploadImage(uploadData);
      console.log('Upload result:', result);

      if (result.success) {
        onClose();
      } else {
        setError(result.error || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Upload failed: ' + err.message);
    }

    setLoading(false);
  };

  return (
    <Modal title="Upload Image" onClose={onClose}>
      <form onSubmit={handleSubmit} className="upload-image-form">
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="imageName">Image Name *</label>
          <input
            type="text"
            id="imageName"
            name="name"
            value={formData.name}
            onChange={handleNameChange}
            placeholder="Enter image name"
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="imageFile">Select Image *</label>
          <input
            type="file"
            id="imageFile"
            accept="image/*"
            onChange={handleImageChange}
            disabled={loading}
            required
          />
          {formData.image && (
            <div style={{ fontSize: '12px', color: 'green', marginTop: '5px' }}>
              ✅ File selected: {formData.image.name} ({Math.round(formData.image.size / 1024)} KB)
            </div>
          )}
        </div>

        {preview && (
          <div className="form-group">
            <label>Preview</label>
            <div className="image-preview">
              <img src={preview} alt="Preview" style={{ maxWidth: '200px', maxHeight: '200px' }} />
            </div>
          </div>
        )}

        <div className="form-group">
          <label>Upload Location</label>
          <div className="location-display">
            {currentFolder ? currentFolder.path : 'Please select a folder first'}
          </div>
        </div>

        <div className="modal-actions">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="primary" 
            loading={loading}
            disabled={!currentFolder || !formData.image}
          >
            Upload Image
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default UploadImageModal;

