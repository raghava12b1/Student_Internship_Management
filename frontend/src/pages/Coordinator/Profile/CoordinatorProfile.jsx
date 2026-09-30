
import { useCallback, useEffect, useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import BackButton from "../../../components/common/BackButton/BackButton";
import "./CoordinatorProfile.css";

// Set VITE_API_BASE_URL in your .env file if needed.
// Example: VITE_API_BASE_URL=http://127.0.0.1:8000/api
const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api"
).replace(/\/+$/, "");

const PROFILE_API = `${API_BASE_URL}/accounts/coordinator/profile/`;

const EMPTY_PROFILE = {
  full_name: "",
  email: "",
  phone_number: "",
  designation: "",
  department: "",
  experience: "",
  staff_id: "",
  role: "",
  account_status: "",
  account_type: "",
  last_updated: "",
};

const getAccessToken = () =>
  localStorage.getItem("accessToken") ||
  localStorage.getItem("access_token") ||
  localStorage.getItem("access") ||
  "";

const getProfileValue = (data, keys, fallback = "") => {
  for (const key of keys) {
    const value = key.split(".").reduce(
      (obj, part) => obj?.[part],
      data
    );

    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }

  return fallback;
};

const CoordinatorProfile = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState(EMPTY_PROFILE);
  const [retryCount, setRetryCount] = useState(0);

  const fetchCoordinatorProfile = useCallback(async () => {
    setLoading(true);
    setError("");

    const token = getAccessToken();

    if (!token) {
      setError("Access token not found. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(PROFILE_API, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        throw new Error("Your session has expired. Please log in again.");
      }

      if (response.status === 403) {
        throw new Error(
          "You do not have permission to view this profile."
        );
      }

      if (response.status === 404) {
        throw new Error(
          `Profile API not found (404). Check the Django URL: ${PROFILE_API}`
        );
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail ||
          errorData.message ||
          `Django returned an error (${response.status}).`
        );
      }

      const data = await response.json();
      const profile = data.user || data.coordinator || data;

      setFormData({
        full_name: getProfileValue(profile, [
          "full_name",
          "name",
          "coordinator_name",
          "first_name",
        ]),
        email: getProfileValue(profile, [
          "email",
          "email_address",
          "user.email",
        ]),
        phone_number: getProfileValue(profile, [
          "phone_number",
          "phone",
          "mobile_number",
        ]),
        designation: getProfileValue(profile, [
          "designation",
          "position",
          "job_title",
        ]),
        department: getProfileValue(profile, [
          "department_name",
          "department.name",
          "department",
        ]),
        experience: getProfileValue(profile, [
          "experience",
          "experience_years",
        ]),
        staff_id: getProfileValue(profile, [
          "staff_id",
          "employee_id",
          "user.staff_id",
        ]),
        role: getProfileValue(
          profile,
          ["role", "account_role", "user.role"],
          "Coordinator"
        ),
        account_status: getProfileValue(
          profile,
          ["account_status", "status"],
          "Active"
        ),
        account_type: getProfileValue(
          profile,
          ["account_type"],
          "University Staff"
        ),
        last_updated: getProfileValue(profile, [
          "last_updated",
          "updated_at",
        ]),
      });
    } catch (err) {
      console.error("Coordinator profile error:", err);

      if (err instanceof TypeError) {
        setError(
          "Unable to connect to Django. Check that the backend is running and the API URL is correct."
        );
      } else {
        setError(err.message || "Unable to load your profile.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCoordinatorProfile();
  }, [fetchCoordinatorProfile, retryCount]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const getInitials = () => {
    const name = formData.full_name
      ?.replace(/^Dr\.\s*/i, "")
      .trim();

    if (!name) return "CO";

    const words = name.split(/\s+/).filter(Boolean);

    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }

    return (
      words[0][0] + words[words.length - 1][0]
    ).toUpperCase();
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="coordinator-profile-page">
          <div className="profile-navigation">
            <BackButton />
          </div>

          <div className="profile-page-header">
            <div className="header-title">
              <span className="header-eyebrow">
                COORDINATOR ACCOUNT
              </span>
              <h1>My Profile</h1>
              <p>Loading your profile information...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="coordinator-profile-page">
          <div className="profile-navigation">
            <BackButton />
          </div>

          <div className="profile-page-header">
            <div className="header-title">
              <span className="header-eyebrow">
                COORDINATOR ACCOUNT
              </span>
              <h1>My Profile</h1>
              <p role="alert">{error}</p>

              <button
                type="button"
                className="save-btn"
                onClick={() => setRetryCount((count) => count + 1)}
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="coordinator-profile-page">
        <div className="profile-navigation">
          <BackButton />
        </div>

        <div className="profile-page-header">
          <div className="header-title">
            <span className="header-eyebrow">
              COORDINATOR ACCOUNT
            </span>
            <h1>My Profile</h1>
            <p>
              Manage your personal information and university
              profile details.
            </p>
          </div>

          <div className="profile-status">
            <span className="status-indicator"></span>
            <div>
              <strong>
                {formData.account_status || "Active Account"}
              </strong>
              <small>
                {formData.account_type || "University Staff"}
              </small>
            </div>
          </div>
        </div>

        <div className="profile-main-card">
          <div className="profile-hero">
            <div className="profile-identity">
              <div className="profile-avatar-wrapper">
                <div className="profile-avatar">
                  {getInitials()}
                </div>
                <span className="avatar-status"></span>
              </div>

              <div className="identity-content">
                <span className="identity-label">
                  INTERNSHIP COORDINATOR
                </span>
                <h2>{formData.full_name || "Coordinator"}</h2>
                <p>
                  {formData.department || "University Department"}
                </p>

                <div className="identity-meta">
                  <span>
                    <span className="meta-dot"></span>
                    {formData.email || "Email not available"}
                  </span>
                  <span>
                    Staff ID: {formData.staff_id || "Not available"}
                  </span>
                </div>
              </div>
            </div>

            <div className="profile-hero-badge">
              <span className="badge-icon">✓</span>
              <div>
                <strong>Verified</strong>
                <small>University Account</small>
              </div>
            </div>
          </div>

          <div className="profile-content">
            <section className="profile-section">
              <div className="section-heading">
                <div className="section-icon">👤</div>
                <div>
                  <h3>Personal Information</h3>
                  <p>
                    Basic information associated with your university
                    account.
                  </p>
                </div>
              </div>

              <div className="profile-grid">
                <div className="profile-field">
                  <label>Full Name</label>
                  <div className="input-wrapper">
                    <span className="input-icon">A</span>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="profile-field">
                  <label>Email Address</label>
                  <div className="input-wrapper">
                    <span className="input-icon">@</span>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="profile-field">
                  <label>Phone Number</label>
                  <div className="input-wrapper">
                    <span className="input-icon">☎</span>
                    <input
                      type="text"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="profile-field">
                  <label>Designation</label>
                  <div className="input-wrapper">
                    <span className="input-icon">ID</span>
                    <input
                      type="text"
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="profile-section">
              <div className="section-heading">
                <div className="section-icon">🏛</div>
                <div>
                  <h3>Professional Information</h3>
                  <p>
                    University department and professional experience.
                  </p>
                </div>
              </div>

              <div className="profile-grid">
                <div className="profile-field">
                  <label>Department</label>
                  <div className="input-wrapper">
                    <span className="input-icon">DE</span>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="profile-field">
                  <label>Experience</label>
                  <div className="input-wrapper">
                    <span className="input-icon">EX</span>
                    <input
                      type="text"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="profile-field">
                  <label>Staff ID</label>
                  <div className="input-wrapper readonly">
                    <span className="input-icon">#</span>
                    <input
                      type="text"
                      name="staff_id"
                      value={formData.staff_id}
                      readOnly
                    />
                  </div>
                </div>

                <div className="profile-field">
                  <label>Account Role</label>
                  <div className="input-wrapper readonly">
                    <span className="input-icon">R</span>
                    <input
                      type="text"
                      name="role"
                      value={formData.role}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="profile-section account-section">
              <div className="section-heading">
                <div className="section-icon">🔐</div>
                <div>
                  <h3>Account Information</h3>
                  <p>
                    Security and account status information.
                  </p>
                </div>
              </div>

              <div className="account-info-grid">
                <div className="account-info-item">
                  <span className="account-info-label">
                    ACCOUNT STATUS
                  </span>
                  <span className="account-active">
                    <span></span>
                    {formData.account_status || "Active"}
                  </span>
                </div>

                <div className="account-info-item">
                  <span className="account-info-label">
                    ACCOUNT TYPE
                  </span>
                  <strong>
                    {formData.account_type || "University Staff"}
                  </strong>
                </div>

                <div className="account-info-item">
                  <span className="account-info-label">
                    LAST UPDATED
                  </span>
                  <strong>
                    {formData.last_updated || "Not available"}
                  </strong>
                </div>
              </div>
            </section>
          </div>

          <div className="profile-footer">
            <div className="footer-message">
              <span className="footer-icon">✓</span>
              <div>
                <strong>Keep your information updated</strong>
                <p>
                  Make sure your contact details are accurate.
                </p>
              </div>
            </div>

            <div className="profile-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={fetchCoordinatorProfile}
              >
                Cancel
              </button>

              <button
                type="button"
                className="save-btn"
                onClick={() =>
                  alert(
                    "Profile update API is not connected yet."
                  )
                }
              >
                <span>Save Changes</span>
                <span className="save-arrow">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CoordinatorProfile;
