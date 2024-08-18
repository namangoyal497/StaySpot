import React, { useState } from 'react';
import { Edit, CloudUpload, Check, Close } from '@mui/icons-material';
import { apiCall } from '../utils/api';

const PropertyImagesUpdate = ({ listingId, currentImages = [], onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // const user = useSelector((state) => state.user); // Will be used for future features

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate files
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        setError('Please select only image files');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError('Each file must be less than 5MB');
        return;
      }
    }

    // Limit to 10 images
    if (files.length > 10) {
      setError('Maximum 10 images allowed');
      return;
    }

    setSelectedFiles(files);
    setError('');

    // Create previews
    const urls = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        urls.push(e.target.result);
        if (urls.length === files.length) {
          setPreviewUrls(urls);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleUpdate = async () => {
    if (selectedFiles.length === 0) {
      setError('Please select at least one image');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append('listingPhotos', file);
      });

      const response = await apiCall(`/properties/${listingId}/images`, 'PATCH', formData, {
        headers: {
          // Don't set Content-Type, let browser set it with boundary
        }
      });

      // Call parent callback to update the listing
      if (onUpdate) {
        onUpdate(response.listing);
      }

      // Reset form
      setSelectedFiles([]);
      setPreviewUrls([]);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update property images. Please try again.');
      console.error('Error updating property images:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setSelectedFiles([]);
    setPreviewUrls([]);
    setError('');
    setIsEditing(false);
  };

  return (
    <div className="property-images-update">
      {!isEditing ? (
        <div className="images-display">
          <div className="images-grid">
            {currentImages.map((image, index) => (
              <div key={index} className="image-item">
                <img
                  src={`/files/${image}`}
                  alt={`Property ${index + 1}`}
                  className="property-image"
                />
              </div>
            ))}
          </div>
          <button
            className="edit-images-btn"
            onClick={() => setIsEditing(true)}
          >
            <Edit />
            Update Images
          </button>
        </div>
      ) : (
        <div className="images-edit">
          <div className="upload-section">
            <input
              type="file"
              id="property-images-input"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <label htmlFor="property-images-input" className="file-input-label">
              <CloudUpload />
              Choose Images (Max 10)
            </label>
          </div>

          {previewUrls.length > 0 && (
            <div className="preview-section">
              <h4>Preview:</h4>
              <div className="preview-grid">
                {previewUrls.map((url, index) => (
                  <div key={index} className="preview-item">
                    <img src={url} alt={`Preview ${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && <p className="error-message">{error}</p>}

          <div className="action-buttons">
            <button
              className="save-btn"
              onClick={handleUpdate}
              disabled={selectedFiles.length === 0 || loading}
            >
              {loading ? 'Updating...' : <Check />}
              {loading ? 'Updating...' : 'Save Changes'}
            </button>
            <button
              className="cancel-btn"
              onClick={handleCancel}
              disabled={loading}
            >
              <Close />
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyImagesUpdate; 