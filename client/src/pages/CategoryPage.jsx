import { useState, useEffect, useCallback } from "react";
import "../styles/List.scss";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setListings } from "../redux/state";
import Loader from "../components/Loader";
import ListingCard from "../components/ListingCard";
import Footer from "../components/Footer"
import { apiCall } from "../utils/api";

const CategoryPage = () => {
  const [loading, setLoading] = useState(true);
  const { category } = useParams()

  const dispatch = useDispatch()
  const listings = useSelector((state) => state.listings);

  console.log("CategoryPage rendered with category:", category);

  const getFeedListings = useCallback(async () => {
    try {
      console.log("getFeedListings called with category:", category);
      
      // Map frontend category labels to backend category values
      const categoryMapping = {
        "Beachfront": "beachfront",
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

      const backendCategory = categoryMapping[category] || category;
      console.log("Frontend category:", category, "Backend category:", backendCategory);

      const data = await apiCall(`/properties?category=${backendCategory}`, 'GET', null);
      console.log("API response:", data);
      dispatch(setListings({ listings: data }));
      setLoading(false);
    } catch (err) {
      console.log("Fetch Listings Failed", err.message);
      console.log("Error details:", err);
      setLoading(false);
    }
  }, [category, dispatch]);

  useEffect(() => {
    console.log("CategoryPage useEffect triggered");
    // Clear existing listings first
    dispatch(setListings({ listings: [] }));
    getFeedListings();
  }, [getFeedListings, dispatch]);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <h1 className="title-list">{category} listings</h1>
      <div className="list">
        {listings?.length > 0 ? (
          listings.map(
            ({
              _id,
              creator,
              listingPhotos,
              city,
              province,
              country,
              category,
              type,
              price,
            }) => (
              <ListingCard
                key={_id}
                listingId={_id}
                creator={creator}
                listingPhotos={listingPhotos}
                city={city}
                province={province}
                country={country}
                category={category}
                type={type}
                price={price}
              />
            )
          )
        ) : (
          <div className="empty-state">
            <h2>No listings found</h2>
            <p>No {category} listings available at the moment. Try exploring other categories!</p>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default CategoryPage;
