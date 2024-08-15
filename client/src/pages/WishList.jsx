import "../styles/List.scss";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import ListingCard from "../components/ListingCard";
import Footer from "../components/Footer"

const WishList = () => {
  const wishList = useSelector((state) => state.user.wishList || []);
  
  return (
    <>
      <Navbar />
      <h1 className="title-list">Your Wish List</h1>
      <div className="list">
        {Array.isArray(wishList) && wishList.length > 0 ? (
          wishList.map(
            ({
              _id,
              creator,
              listingPhotoPaths,
              city,
              province,
              country,
              category,
              type,
              price,
              booking = false,
            }) => (
            <ListingCard
              listingId={_id}
              creator={creator}
              listingPhotoPaths={listingPhotoPaths}
              city={city}
              province={province}
              country={country}
              category={category}
              type={type}
              price={price}
              booking={booking}
            />
          ))
        ) : (
          <div className="empty-state">
            <h2>No wishlist items found</h2>
            <p>You haven't added any properties to your wishlist yet. Start exploring to find your perfect stay!</p>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default WishList;
