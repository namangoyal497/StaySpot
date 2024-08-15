import { useState } from "react";
import "../styles/ListingCard.scss";
import {
  ArrowForwardIos,
  ArrowBackIosNew,
  Favorite,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setWishList } from "../redux/state";
import { apiCall } from "../utils/api";

const ListingCard = ({
  listingId,
  creator,
  listingPhotoPaths,
  city,
  province,
  country,
  category,
  type,
  price,
  startDate,
  endDate,
  totalPrice,
  guestCount,
  status,
  booking,
}) => {
  /* SLIDER FOR IMAGES */
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevSlide = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + listingPhotoPaths.length) % listingPhotoPaths.length
    );
  };

  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % listingPhotoPaths.length);
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();

  /* ADD TO WISHLIST */
  const user = useSelector((state) => state.user);
  const wishList = user?.wishList || [];

  const isLiked = wishList?.find((item) => item?._id === listingId);
  
  // Format dates for user-friendly display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Calculate number of nights
  const getNightsCount = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  const patchWishList = async () => {
    console.log("patchWishList called");
    console.log("User:", user);
    console.log("Creator:", creator);
    console.log("ListingId:", listingId);
    
    // Check if user and creator exist and are valid
    if (!user?._id || !creator?._id) {
      console.log("User or creator not found");
      return;
    }
    
    // Check if user is not the creator of the listing
    if (user._id === creator._id) {
      console.log("Cannot add your own listing to wishlist");
      return;
    }

    try {
      console.log("Making API call to:", `/users/${user._id}/${listingId}`);
      const response = await apiCall(`/users/${user._id}/${listingId}`, "PATCH");
      console.log("API Response:", response);
      
      if (response && Array.isArray(response.wishList)) {
        dispatch(setWishList(response.wishList));
        console.log("Wishlist updated successfully");
      } else {
        console.log("Failed to update wishlist:", response);
      }
    } catch (error) {
      console.log("Error updating wishlist:", error);
    }
  };

  // Debug: Log image paths
  console.log("ListingCard - listingPhotoPaths:", listingPhotoPaths);

  return (
    <div
      className="listing-card"
      onClick={() => {
        navigate(`/properties/${listingId}`);
      }}
    >
      <div className="slider-container">
        <div
          className="slider"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {listingPhotoPaths?.map((photo, index) => {
            const imageUrl = `http://127.0.0.1:3001/${photo?.replace("public\\", "").replace("public/", "").replace(/\\/g, "/")}`;
            return (
              <div key={index} className="listing-slide">
                <img
                  src={imageUrl}
                  alt={`${index + 1}`}
                  onError={(e) => {
                    console.error(`Failed to load image: ${imageUrl}`);
                    e.target.style.display = 'none';
                  }}
                  onLoad={() => {
                    console.log(`Successfully loaded image: ${imageUrl}`);
                  }}
                />
                <div
                  className="prev-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrevSlide(e);
                  }}
                >
                  <ArrowBackIosNew sx={{ fontSize: "15px" }} />
                </div>
                <div
                  className="next-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNextSlide(e);
                  }}
                >
                  <ArrowForwardIos sx={{ fontSize: "15px" }} />
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Favorite button positioned on image corner */}
        <button
          className={`favorite ${isLiked ? 'liked' : 'not-liked'}`}
          onClick={(e) => {
            e.stopPropagation();
            console.log("Like button clicked, user:", user);
            patchWishList();
          }}
          disabled={!user}
          title={isLiked ? "Remove from favorites" : "Add to favorites"}
          aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
        >
          <div className="favorite-icon">
            {isLiked ? (
              <Favorite sx={{ color: "white", fontSize: "20px" }} />
            ) : (
              <Favorite sx={{ color: "#ef4444", fontSize: "20px" }} />
            )}
          </div>
          <span className="favorite-text">
            {isLiked ? "Liked" : "Like"}
          </span>
        </button>
      </div>

      <h3>
        {city}, {province}, {country}
      </h3>
      <p>{category}</p>

      {!booking ? (
        <>
          <p>{type}</p>
          <p>
            <span>${price}</span> per night
          </p>
        </>
      ) : (
        <>
          <div className="booking-info-container">
            <p className="booking-dates">
              {formatDate(startDate)} - {formatDate(endDate)}
            </p>
            <p className="booking-nights">
              {getNightsCount(startDate, endDate)} {getNightsCount(startDate, endDate) === 1 ? 'night' : 'nights'}
              {guestCount && ` • ${guestCount} ${guestCount === 1 ? 'guest' : 'guests'}`}
            </p>
            <p className="booking-price">
              <span>${totalPrice}</span> total
            </p>
            {status && (
              <div className={`status-badge ${status}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ListingCard;
