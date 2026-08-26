import DashboardLayout from "../../../layouts/DashboardLayout";
import BackButton from "../../../components/common/BackButton/BackButton";
import "./HODProfile.css";

const HODProfile = () => {
  return (
    <DashboardLayout>
      <main className="hod-profile-page">

        {/* Back Navigation */}
        <BackButton />

        {/* Page Header */}
        <header className="hod-profile-page-header">
          <div>
            <span className="profile-eyebrow">
              HOD ACCOUNT
            </span>

            <h1>My Profile</h1>

            <p>
              Manage and view your departmental profile information.
            </p>
          </div>
        </header>

        {/* Main Profile Card */}
        <section className="hod-profile-card">

          {/* Profile Identity */}
          <div className="hod-profile-hero">

            <div className="hod-profile-avatar">
              <span>👨‍🏫</span>

              <span className="avatar-status"></span>
            </div>

            <div className="hod-profile-identity">
              <div className="identity-top">
                <h2>Dr. Ramesh Kumar</h2>

                <span className="role-badge">
                  HOD
                </span>
              </div>

              <p className="designation">
                Head of Department
              </p>

              <p className="department">
                Computer Science & Engineering
              </p>

              <div className="profile-meta">
                <span>
                  🆔 HOD001
                </span>

                <span>
                  📍 Aditya University
                </span>
              </div>
            </div>

          </div>

          {/* Divider */}
          <div className="profile-divider"></div>

          {/* Personal / Professional Information */}
          <div className="profile-section">

            <div className="section-heading">
              <div className="section-icon">
                👤
              </div>

              <div>
                <h3>Professional Information</h3>
                <p>
                  Official information associated with your HOD account.
                </p>
              </div>
            </div>

            <div className="profile-info-grid">

              <div className="profile-info-item">
                <span className="info-label">
                  Employee ID
                </span>

                <strong>
                  HOD001
                </strong>
              </div>

              <div className="profile-info-item">
                <span className="info-label">
                  Department
                </span>

                <strong>
                  Computer Science & Engineering
                </strong>
              </div>

              <div className="profile-info-item">
                <span className="info-label">
                  Role
                </span>

                <strong>
                  Head of Department
                </strong>
              </div>

              <div className="profile-info-item">
                <span className="info-label">
                  Experience
                </span>

                <strong>
                  18 Years
                </strong>
              </div>

            </div>

          </div>

          {/* Contact Information */}
          <div className="profile-section">

            <div className="section-heading">
              <div className="section-icon">
                📞
              </div>

              <div>
                <h3>Contact Information</h3>
                <p>
                  Your official communication details.
                </p>
              </div>
            </div>

            <div className="profile-info-grid">

              <div className="profile-info-item">
                <span className="info-label">
                  Email Address
                </span>

                <strong>
                  hod.cse@aditya.edu.in
                </strong>
              </div>

              <div className="profile-info-item">
                <span className="info-label">
                  Phone Number
                </span>

                <strong>
                  +91 9876543210
                </strong>
              </div>

            </div>

          </div>

          {/* Account Status */}
          <div className="profile-status-card">

            <div className="status-icon">
              ✓
            </div>

            <div>
              <strong>
                Account Active
              </strong>

              <p>
                Your HOD account is currently active and verified.
              </p>
            </div>

            <span className="active-badge">
              Active
            </span>

          </div>

          {/* Actions */}
          <div className="profile-actions">

            <button
              type="button"
              className="edit-profile-btn"
            >
              <span>✏️</span>
              Edit Profile
            </button>

          </div>

        </section>

      </main>
    </DashboardLayout>
  );
};

export default HODProfile;