import "./ProfileDropdown.css";
import { Link } from "react-router-dom";
import {
  FaUser,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

const ProfileDropdown = ({ role, onLogout }) => {
  const basePath = `/${role}`;

  return (
    <div className="profile-dropdown">

      <Link to={`${basePath}/profile`} className="dropdown-item">
        <FaUser />
        <span>My Profile</span>
      </Link>

      <Link to={`${basePath}/settings`} className="dropdown-item">
        <FaCog />
        <span>Settings</span>
      </Link>

      <button
        className="dropdown-item logout-btn"
        onClick={onLogout}
      >
        <FaSignOutAlt />
        <span>Logout</span>
      </button>

    </div>
  );
};

export default ProfileDropdown;