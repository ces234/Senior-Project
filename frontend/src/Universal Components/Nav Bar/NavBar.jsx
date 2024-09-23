import "./NavBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import {
  faBookOpen,
  faCarrot,
  faCircleUser,
} from "@fortawesome/free-solid-svg-icons"; // Import the book open icon

const NavBar = () => {
  const NavButton = ({ icon, text }) => {
    return (
      <div className="navButton">
        <FontAwesomeIcon className="navIcon" icon={icon} />
        <h3>{text}</h3>
      </div>
    );
  };

  return (
    <div className="navBar">
      {/* Calendar icon */}
      <div className="firstIconContainer">
        <NavButton icon={faCircleUser} />
      </div>
      <div className="otherIcons">
        <NavButton icon={faCalendar} text="Meal Plan" />
        <NavButton icon={faBookOpen} text="Recipes" />
        <NavButton icon={faCarrot} text="Pantry" />
      </div>
    </div>
  );
};

export default NavBar;
