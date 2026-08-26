import DashboardLayout from "../../../layouts/DashboardLayout";
import "./CoordinatorSettings.css";
import BackButton from "../../../components/common/BackButton/BackButton";
const CoordinatorSettings = () => {
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
              <p>Receive internship updates through email.</p>
            </div>
            <input type="checkbox" defaultChecked />
          </div>

          <div className="setting-item">
            <div>
              <h3>SMS Notifications</h3>
              <p>Receive SMS alerts for important events.</p>
            </div>
            <input type="checkbox" />
          </div>

          <div className="setting-item">
            <div>
              <h3>Dark Mode</h3>
              <p>Enable dark theme for the dashboard.</p>
            </div>
            <input type="checkbox" />
          </div>

        </div>

        <div className="settings-card">

          <h2>Security</h2>

          <button className="action-btn">
            Change Password
          </button>

          <button className="logout-btn">
            Logout
          </button>

        </div>

      </div>
    </DashboardLayout>
  );
};

export default CoordinatorSettings;