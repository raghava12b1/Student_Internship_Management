import DashboardLayout from "../../../layouts/DashboardLayout";
import "./AdminSettings.css";
import BackButton from "../../../components/common/BackButton/BackButton";

const AdminSettings = () => {
  return (
    <DashboardLayout>
       <BackButton />

      <div className="admin-settings">

        <div className="page-header">
          <h1>Settings</h1>
          <p>
            Configure your Student Internship Management System.
          </p>
        </div>

        <div className="settings-container">

          <div className="setting-card">

            <h3>👤 Account Settings</h3>

            <p>Manage your administrator account information.</p>

            <button disabled>Edit Account (Coming Soon)</button>

          </div>

          <div className="setting-card">

            <h3>🔒 Security</h3>

            <p>Update password and security preferences.</p>

            <button disabled>Change Password (Coming Soon)</button>

          </div>

          <div className="setting-card">

            <h3>🔔 Notifications</h3>

            <p>Control email and system notifications.</p>

            <button disabled>Notification Settings (Coming Soon)</button>

          </div>

          <div className="setting-card">

            <h3>🏢 University Settings</h3>

            <p>Configure internship management preferences.</p>

            <button disabled>Manage (Coming Soon)</button>

          </div>

          <div className="setting-card">

            <h3>💾 Backup & Restore</h3>

            <p>Create or restore system backups.</p>

            <button disabled>Backup Data (Coming Soon)</button>

          </div>

          <div className="setting-card">

            <h3>ℹ️ System Information</h3>

            <p>Version 1.0.0</p>

            <button disabled>View Details (Coming Soon)</button>

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
};

export default AdminSettings;