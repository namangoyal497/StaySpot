import { categories } from "../data";
import "../styles/Categories.scss"
import { useNavigate } from "react-router-dom";

const Categories = () => {
  console.log("Categories component rendered");
  const navigate = useNavigate();
  
  const handleCategoryClick = (categoryLabel) => {
    console.log("Clicked category:", categoryLabel);
    navigate(`/properties/category/${categoryLabel}`);
  };
  
  return (
    <div className="categories">
      <h1>Explore Top Categories</h1>
      <p>
        Explore our wide range of vacation rentals that cater to all types of
        travelers. Immerse yourself in the local culture, enjoy the comforts of
        home, and create unforgettable memories in your dream destination.
      </p>

      <div className="categories_list">
        {categories?.slice(1, 7).map((category, index) => (
          <div 
            className="category"
            key={index}
            onClick={() => handleCategoryClick(category.label)}
            style={{ cursor: 'pointer' }}
          >
            <img 
              src={category.img || "/assets/logo.png"} 
              alt={category.label} 
            />
            <div className="overlay"></div>
            <div className="category_text">
              <div className="category_text_icon">{category.icon}</div>
              <p>{category.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
