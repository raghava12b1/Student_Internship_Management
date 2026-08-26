import DashboardLayout from "../../../layouts/DashboardLayout";
import "./HODSettings.css";
import BackButton from "../../../components/common/BackButton/BackButton";
const HODSettings = () => {
  return (
    <DashboardLayout>
       <BackButton />

      <div className="hod-settings">

        <div className="page-header">

          <h1>Settings</h1>

          <p>
            Manage your account preferences and department settings.
          </p>

        </div>

        {/* Account Settings */}

        <div className="settings-card">

          <h2>Account Settings</h2>

          <div className="setting-item">

            <div>
              <h3>Change Password</h3>
              <p>Update your account password.</p>
            </div>

            <button>Change</button>

          </div>

          <div className="setting-item">

            <div>
              <h3>Two-Factor Authentication</h3>
              <p>Secure your account with OTP verification.</p>
            </div>

            <button>Enable</button>

          </div>

        </div>

        {/* Notification Settings */}

        <div className="settings-card">

          <h2>Notification Settings</h2>

          <div className="setting-item">

            <div>
              <h3>Email Notifications</h3>
              <p>Receive internship updates through email.</p>
            </div>

            <input type="checkbox" defaultChecked />

          </div>

          <div className="setting-item">

            <div>
              <h3>Portal Notifications</h3>
              <p>Receive notifications inside the portal.</p>
            </div>

            <input type="checkbox" defaultChecked />

          </div>

        </div>

        {/* Department */}

        <div className="settings-card">

          <h2>Department Settings</h2>

          <div className="setting-item">

            <div>
              <h3>Internship Approval Mode</h3>
              <p>Allow HOD approval before final submission.</p>
            </div>

            <button>Enabled</button>

          </div>

          <div className="setting-item">

            <div>
              <h3>Export Reports</h3>
              <p>Download department internship reports.</p>
            </div>

            <button>Export</button>

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
};

export default HODSettings;