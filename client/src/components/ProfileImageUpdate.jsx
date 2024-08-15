import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Edit, CloudUpload, Check, Close } from '@mui/icons-material';
import { apiCall } from '../utils/api';
import { setUser } from '../redux/state';

const ProfileImageUpdate = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      setSelectedFile(file);
      setError('');

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async () => {
    if (!selectedFile) {
      setError('Please select an image');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Check if user is logged in
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login again to update your profile');
        return;
      }

      const formData = new FormData();
      formData.append('profileImage', selectedFile);

      console.log('Updating profile image for user:', user._id);
      console.log('Token exists:', !!token);

      const response = await apiCall(`/users/${user._id}/profile-image`, 'PATCH', formData, {
        headers: {
          // Don't set Content-Type, let browser set it with boundary
        }
      });

      // Update user in Redux store
      dispatch(setUser({ ...user, profileImagePath: response.user.profileImagePath }));

      // Reset form
      setSelectedFile(null);
      setPreviewUrl(null);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile image:', err);
      if (err.message.includes('401') || err.message.includes('Unauthorized')) {
        setError('Please login again to update your profile');
      } else {
        setError('Failed to update profile image. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError('');
    setIsEditing(false);
  };

  return (
    <div className="profile-image-update">
      {!isEditing ? (
        <div className="profile-image-display">
          <img
            src={user.profileImagePath ? `/files/${user.profileImagePath}` : '/assets/default-profile.jpg'}
            alt="Profile"
            className="profile-image"
          />
          <button
            className="edit-image-btn"
            onClick={() => setIsEditing(true)}
          >
            <Edit />
            Change Photo
          </button>
        </div>
      ) : (
        <div className="profile-image-edit">
          <div className="image-preview">
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="preview-image" />
            ) : (
              <div className="upload-placeholder">
                <CloudUpload />
                <p>Select an image</p>
              </div>
            )}
          </div>

          <div className="upload-controls">
            <input
              type="file"
              id="profile-image-input"
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <label htmlFor="profile-image-input" className="file-input-label">
              <CloudUpload />
              Choose Image
            </label>

            {error && <p className="error-message">{error}</p>}

            <div className="action-buttons">
              <button
                className="save-btn"
                onClick={handleUpdate}
                disabled={!selectedFile || loading}
              >
                {loading ? 'Updating...' : <Check />}
                {loading ? 'Updating...' : 'Save'}
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
        </div>
      )}
    </div>
  );
};

export default ProfileImageUpdate; 