import { useEffect, useState, useCallback } from "react";
import "../styles/Listings.scss";
import ListingCard from "./ListingCard";
import Loader from "./Loader";
import { useDispatch, useSelector } from "react-redux";
import { setListings } from "../redux/state";
import { apiCall } from "../utils/api";
import { categories } from "../data";

const Listings = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("All");

  const listings = useSelector((state) => state.listings);

  const getFeedListings = useCallback(async () => {
    try {
      console.log("Listings component - selectedFilter:", selectedFilter);
      
      // Map frontend category labels to backend category values
      const categoryMapping = {
        "Beachfront": "beach",
        "Windmills": "windmill", 
        "Iconic cities": "modern",
        "Countryside": "countryside",
        "Amazing Pools": "pool",
        "Islands": "island",
        "Lakefront": "lake",
        "Ski-in/out": "skiing",
        "Castles": "castle",
        "Caves": "cave",
        "Camping": "camping",
        "Arctic": "arctic",
        "Desert": "desert",
        "Barns": "barn",
        "Luxury": "lux"
      };

      const backendCategory = selectedFilter !== "All" ? categoryMapping[selectedFilter] || selectedFilter : null;
      console.log("Listings component - backendCategory:", backendCategory);
      
      const data = await apiCall(
        backendCategory
          ? `/properties?category=${backendCategory}`
          : "/properties",
        'GET',
        null
      );

      console.log("Listings component - API response:", data);
      dispatch(setListings({ listings: data }));
      setLoading(false);
    } catch (err) {
      console.log("Fetch Listings Failed", err.message);
    }
  }, [selectedFilter, dispatch]);

  useEffect(() => {
    getFeedListings();
  }, [selectedFilter, getFeedListings]);

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
  };

  return (
    <>
      {/* Filter Section */}
      <div className="listings-filter">
        <h2>Filter Properties</h2>
        <div className="filter-options">
          {categories?.map((category) => (
            <div
              key={category.label}
              className={`filter-item ${selectedFilter === category.label ? 'active' : ''}`}
              onClick={() => handleFilterChange(category.label)}
            >
              <div className="filter-icon">{category.icon}</div>
              <span>{category.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Listings Section */}
      {loading ? (
        <Loader />
      ) : (
        <div className="listings" id="listings">
          {listings.map(
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
              booking=false
            }) => (
              <ListingCard
                key={_id}
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
            )
          )}
        </div>
      )}
    </>
  );
};

export default Listings;
