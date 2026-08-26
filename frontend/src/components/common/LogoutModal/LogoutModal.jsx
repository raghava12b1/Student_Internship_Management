import "./LogoutModal.css";
import { useNavigate } from "react-router-dom";

const LogoutModal = ({ onClose }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="logout-overlay">

      <div className="logout-modal">

        <h2>Logout</h2>

        <p>
          Are you sure you want to logout?
        </p>

        <div className="logout-actions">

          <button
            className="cancel-btn"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </div>

    </div>
  );
};

export default LogoutModal;