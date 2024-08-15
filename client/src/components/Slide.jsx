import "../styles/Slide.scss"
import { KeyboardArrowDown } from "@mui/icons-material";

const Slide = () => {
  return (
    <div className="slide">
      <div className="slide-content">
        <h1>
          Welcome to StaySpot
        </h1>
        <p>
          Find your perfect gateway to the world. Every stay tells a story.
        </p>
        <a 
          href="#listings" 
          className="cta-button"
          onClick={(e) => {
            e.preventDefault();
            const listingsSection = document.getElementById('listings');
            if (listingsSection) {
              listingsSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          Explore Properties
        </a>
      </div>
      <div className="scroll-indicator">
        <KeyboardArrowDown />
      </div>
    </div>
  );
};

export default Slide;
