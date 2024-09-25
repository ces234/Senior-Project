import "./NavBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import {
  faBookOpen,
  faCarrot,
  faCircleUser,
} from "@fortawesome/free-solid-svg-icons"; // Import the book open icon

import { useAuth } from "../../AuthContext";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(); 
        navigate('/login');
    }

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
        <button onClick={handleLogout}>Logout</button> {/* Logout button */}

      </div>
    </div>
  );
};

export default NavBar;
