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

            <button>Edit Account</button>

          </div>

          <div className="setting-card">

            <h3>🔒 Security</h3>

            <p>Update password and security preferences.</p>

            <button>Change Password</button>

          </div>

          <div className="setting-card">

            <h3>🔔 Notifications</h3>

            <p>Control email and system notifications.</p>

            <button>Notification Settings</button>

          </div>

          <div className="setting-card">

            <h3>🏢 University Settings</h3>

            <p>Configure internship management preferences.</p>

            <button>Manage</button>

          </div>

          <div className="setting-card">

            <h3>💾 Backup & Restore</h3>

            <p>Create or restore system backups.</p>

            <button>Backup Data</button>

          </div>

          <div className="setting-card">

            <h3>ℹ️ System Information</h3>

            <p>Version 1.0.0</p>

            <button>View Details</button>

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
};

export default AdminSettings;