import { useEffect, useState, useCallback } from "react";
import "../styles/List.scss";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { setTripList } from "../redux/state";
import ListingCard from "../components/ListingCard";
import Footer from "../components/Footer";
import { apiCall } from "../utils/api";

const TripList = () => {
  const [loading, setLoading] = useState(true);
  const userId = useSelector((state) => state.user._id);
  console.log(userId)
  const tripList = useSelector((state) => state.user.tripList || []);

  const dispatch = useDispatch();

  const getTripList = useCallback(async () => {
    try {
      const data = await apiCall(`/users/${userId}/trips`);
      dispatch(setTripList(data));
      setLoading(false);
    } catch (err) {
      console.log("Fetch Trip List failed!", err.message);
    }
  }, [userId, dispatch]);

  useEffect(() => {
    getTripList();
  }, [getTripList]);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <h1 className="title-list">Your Trip List</h1>
      <div className="list">
        {Array.isArray(tripList) && tripList.length > 0 ? (
          tripList.map(({ listingId, checkIn, checkOut, totalPrice, guestCount, status, booking=true }) => (
            <ListingCard
              listingId={listingId._id}
              creator={listingId.creator._id}
              listingPhotoPaths={listingId.listingPhotoPaths}
              city={listingId.city}
              province={listingId.province}
              country={listingId.country}
              category={listingId.category}
              startDate={checkIn}
              endDate={checkOut}
              totalPrice={totalPrice}
              guestCount={guestCount}
              status={status}
              booking={booking}
            />
          ))
        ) : (
          <div className="empty-state">
            <h2>No trips found</h2>
            <p>You haven't booked any trips yet. Start exploring properties to plan your next adventure!</p>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default TripList;
