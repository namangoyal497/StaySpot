import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowBack, Edit, Delete } from '@mui/icons-material';
import { apiCall, getImageUrl } from '../utils/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PropertyImagesUpdate from '../components/PropertyImagesUpdate';
import '../styles/PropertyManagement.scss';

const PropertyManagement = () => {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { listingId } = useParams();
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    fetchListing();
  }, [listingId]);

  const fetchListing = async () => {
    try {
      setLoading(true);
      const data = await apiCall(`/properties/${listingId}`);
      setListing(data);
    } catch (err) {
      setError('Failed to load property details');
      console.error('Error fetching listing:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImagesUpdate = (updatedListing) => {
    setListing(updatedListing);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await apiCall(`/properties/${listingId}`, 'DELETE');
        navigate('/properties');
      } catch (err) {
        setError('Failed to delete property');
        console.error('Error deleting listing:', err);
      }
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="property-management">
          <div className="loading">Loading property details...</div>
        </div>
      </>
    );
  }

  if (!listing) {
    return (
      <>
        <Navbar />
        <div className="property-management">
          <div className="error">Property not found</div>
        </div>
      </>
    );
  }

  // Check if user is the creator
  if (listing.creator._id !== user._id) {
    return (
      <>
        <Navbar />
        <div className="property-management">
          <div className="error">You can only manage your own properties</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="property-management">
        <div className="header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ArrowBack />
            Back
          </button>
          <h1>Manage Property</h1>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="property-content">
          <div className="property-info">
            <h2>{listing.title}</h2>
            <p className="location">
              {listing.city}, {listing.province}, {listing.country}
            </p>
            <p className="price">${listing.price} per night</p>
            <p className="details">
              {listing.guestCount} guests • {listing.bedroomCount} bedrooms • {listing.bathroomCount} bathrooms
            </p>
          </div>

          <div className="property-images">
            <h3>Property Images</h3>
            <PropertyImagesUpdate 
              listingId={listing._id}
              currentImages={listing.listingPhotoPaths}
              onUpdate={handleImagesUpdate}
            />
          </div>

          <div className="property-actions">
            <button className="edit-btn" onClick={() => navigate(`/properties/${listing._id}/edit`)}>
              <Edit />
              Edit Details
            </button>
            <button className="delete-btn" onClick={handleDelete}>
              <Delete />
              Delete Property
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PropertyManagement; 