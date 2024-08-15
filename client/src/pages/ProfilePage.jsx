import React from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Edit, 
  Settings, 
  Security, 
  Notifications,
  ArrowBack 
} from "@mui/icons-material";
import "../styles/ProfilePage.scss";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProfileImageUpdate from "../components/ProfileImageUpdate";
import { getImageUrl } from "../utils/api";

const ProfilePage = () => {
  const user = useSelector((state) => state.user);
  const { userId } = useParams();
  const navigate = useNavigate();

  // Check if the current user is viewing their own profile
  const isOwnProfile = user && user._id === userId;

  if (!user) {
    navigate("/login");
    return null;
  }

  if (!isOwnProfile) {
    navigate("/");
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="profile-page">
        <div className="profile-header">
          <button 
            className="back-btn"
            onClick={() => navigate(-1)}
          >
            <ArrowBack />
            Back
          </button>
          <h1>My Profile</h1>
        </div>

        <div className="profile-content">
          <div className="profile-section">
            <div className="profile-info">
                          <div className="profile-image">
              <ProfileImageUpdate />
            </div>
              
              <div className="profile-details">
                <h2>{user.firstName} {user.lastName}</h2>
                <p className="email">{user.email}</p>
                <p className="member-since">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="profile-actions">
            <div className="action-card">
              <Settings />
              <h3>Account Settings</h3>
              <p>Manage your account preferences and settings</p>
            </div>

            <div className="action-card">
              <Security />
              <h3>Privacy & Security</h3>
              <p>Update your password and privacy settings</p>
            </div>

            <div className="action-card">
              <Notifications />
              <h3>Notifications</h3>
              <p>Manage your notification preferences</p>
            </div>
          </div>

          <div className="profile-stats">
            <h3>Your Activity</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-number">{user.tripList?.length || 0}</span>
                <span className="stat-label">Trips</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{user.wishList?.length || 0}</span>
                <span className="stat-label">Wishlist Items</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{user.propertyList?.length || 0}</span>
                <span className="stat-label">Properties</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{user.reservationList?.length || 0}</span>
                <span className="stat-label">Reservations</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProfilePage; 