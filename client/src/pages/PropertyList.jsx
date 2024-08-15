import "../styles/List.scss";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import ListingCard from "../components/ListingCard";
import { useEffect, useState, useCallback } from "react";
import { setPropertyList } from "../redux/state";
import Loader from "../components/Loader";
import Footer from "../components/Footer";
import { apiCall } from "../utils/api";
import { useNavigate } from "react-router-dom";
import { Settings } from "@mui/icons-material";

const PropertyList = () => {
  const [loading, setLoading] = useState(true)
  const user = useSelector((state) => state.user)
  const propertyList = user?.propertyList || [];
  const navigate = useNavigate();
 
  const dispatch = useDispatch()
  const getPropertyList = useCallback(async () => {
    try {
      const data = await apiCall(`/users/${user._id}/properties`);
      dispatch(setPropertyList(data))
      setLoading(false)
    } catch (err) {
      console.log("Fetch all properties failed", err.message)
    }
  }, [user._id, dispatch])

  useEffect(() => {
    getPropertyList()
  }, [getPropertyList])

  return loading ? <Loader /> : (
    <>
      <Navbar />
      <div className="header-section">
        <h1 className="title-list">Your Property List</h1>
        <button 
          className="manage-btn"
          onClick={() => navigate('/create-listing')}
        >
          <Settings />
          Create New Property
        </button>
      </div>
      <div className="list">
        {Array.isArray(propertyList) && propertyList.length > 0 ? (
          propertyList.map(
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
            <div key={_id} className="property-item">
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
              <button 
                className="manage-property-btn"
                onClick={() => navigate(`/properties/manage/${_id}`)}
              >
                <Settings />
                Manage
              </button>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <h2>No properties found</h2>
            <p>You haven't listed any properties yet. Start by creating your first listing!</p>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default PropertyList;
