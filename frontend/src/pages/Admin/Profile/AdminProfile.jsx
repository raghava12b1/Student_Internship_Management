import DashboardLayout from "../../../layouts/DashboardLayout";
import "./AdminProfile.css";
import BackButton from "../../../components/common/BackButton/BackButton";

const AdminProfile = () => {
  return (
    <DashboardLayout>
       <BackButton />

      <div className="admin-profile">

        <div className="profile-card">

          <div className="profile-avatar">
            👤
          </div>

          <h2>System Administrator</h2>

          <p>Student Internship Management System</p>

          <div className="profile-info">

            <div className="info-row">
              <span>Full Name</span>
              <strong>Admin User</strong>
            </div>

            <div className="info-row">
              <span>Email</span>
              <strong>admin@sims.com</strong>
            </div>

            <div className="info-row">
              <span>Phone</span>
              <strong>+91 9876543210</strong>
            </div>

            <div className="info-row">
              <span>Role</span>
              <strong>Administrator</strong>
            </div>

            <div className="info-row">
              <span>University</span>
              <strong>Aditya University</strong>
            </div>

          </div>

          <button className="edit-btn">
            Edit Profile
          </button>

        </div>

      </div>

    </DashboardLayout>
  );
};

export default AdminProfile;