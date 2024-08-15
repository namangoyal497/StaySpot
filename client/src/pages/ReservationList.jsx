import { useEffect, useState, useCallback } from "react";
import "../styles/List.scss";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { setReservationList } from "../redux/state";
import ListingCard from "../components/ListingCard";
import HostActions from "../components/HostActions";
import Footer from "../components/Footer"

const ReservationList = () => {
  const [loading, setLoading] = useState(true);
  const userId = useSelector((state) => state.user._id);
  const reservationList = useSelector((state) => state.user.reservationList || []);
  console.log(userId)
  const dispatch = useDispatch();

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:3001/bookings/${bookingId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.ok) {
        // Refresh the reservation list
        getReservationList();
      } else {
        console.log("Failed to update booking status");
      }
    } catch (err) {
      console.log("Update booking status failed!", err.message);
    }
  };

  const getReservationList = useCallback(async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:3001/users/${userId}/reservations`,
        {
          method: "GET",
        }
      );

      const data = await response.json();
      dispatch(setReservationList(data));
      setLoading(false);
    } catch (err) {
      console.log("Fetch Reservation List failed!", err.message);
    }
  }, [userId, dispatch]);

  useEffect(() => {
    getReservationList();
  }, [getReservationList]);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <h1 className="title-list">Your Reservation List</h1>
      <div className="list">
        {Array.isArray(reservationList) && reservationList.length > 0 ? (
          reservationList.map(({ _id, listingId, userId: guestUser, checkIn, checkOut, totalPrice, guestCount, status, booking=true }) => (
          <div key={_id} className="reservation-item">
            <ListingCard
              listingId={listingId._id}
              creator={guestUser._id}
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
            <HostActions 
              bookingId={_id}
              status={status}
              onStatusUpdate={handleStatusUpdate}
            />
          </div>
        ))
        ) : (
          <div className="empty-state">
            <h2>No reservations found</h2>
            <p>You haven't received any reservations yet. Keep promoting your properties!</p>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ReservationList;
