
import DashboardLayout from "../../../layouts/DashboardLayout";
import "./CoordinatorSettings.css";
import BackButton from "../../../components/common/BackButton/BackButton";
import { useNavigate } from "react-router-dom";

const CoordinatorSettings = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("refresh_token");

    sessionStorage.clear();

    // Redirect to login page
    navigate("/", { replace: true });
  };

  return (
    <DashboardLayout>
      <BackButton />

      <div className="settings-page">
        <div className="page-header">
          <h1>Settings</h1>
          <p>Manage your account preferences and security.</p>
        </div>

        <div className="settings-card">
          <h2>Account Settings</h2>

          <div className="setting-item">
            <div>
              <h3>Email Notifications</h3>
              <p>
                Receive internship updates through email (Coming Soon).
              </p>
            </div>
            <input type="checkbox" disabled />
          </div>

          <div className="setting-item">
            <div>
              <h3>SMS Notifications</h3>
              <p>
                Receive SMS alerts for important events (Coming Soon).
              </p>
            </div>
            <input type="checkbox" disabled />
          </div>

          <div className="setting-item">
            <div>
              <h3>Dark Mode</h3>
              <p>
                Enable dark theme for the dashboard (Coming Soon).
              </p>
            </div>
            <input type="checkbox" disabled />
          </div>
        </div>

        <div className="settings-card">
          <h2>Security</h2>

          <button className="action-btn" type="button" disabled>
            Change Password (Coming Soon)
          </button>

          <button
            type="button"
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CoordinatorSettings;
