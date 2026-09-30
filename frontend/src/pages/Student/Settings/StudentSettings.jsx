import "./StudentSettings.css";
import BackButton from "../../../components/common/BackButton/BackButton";
import DashboardLayout from "../../../layouts/DashboardLayout";

const StudentSettings = () => {
  return (
    
    <div className="student-settings">
         <BackButton />

      <div className="settings-header">
        <h2>Settings</h2>
        <p>Manage your account preferences.</p>
      </div>

      <div className="settings-card">

        <div className="setting-item">
          <div>
            <h4>Change Password</h4>
            <p>Update your account password (Coming Soon).</p>
          </div>

          <button disabled>Change</button>
        </div>

        <div className="setting-item">
          <div>
            <h4>Email Notifications</h4>
            <p>Receive internship updates via email (Coming Soon).</p>
          </div>

          <input type="checkbox" disabled />
        </div>

        <div className="setting-item">
          <div>
            <h4>Dark Mode</h4>
            <p>Enable dark theme (Coming Soon).</p>
          </div>

          <input type="checkbox" disabled />
        </div>

      </div>

    </div>
    
  );
};

export default StudentSettings;
