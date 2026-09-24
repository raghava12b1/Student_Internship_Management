import { useEffect, useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import "./CoordinatorProfile.css";
import BackButton from "../../../components/common/BackButton/BackButton";


// ============================================================
// DJANGO PROFILE API
// ============================================================
//
// IMPORTANT:
// Your backend friend must provide this endpoint.
//
// Expected:
// GET http://127.0.0.1:8000/api/accounts/profile/
//
// If your friend gives a different URL later,
// change ONLY the line below.
// ============================================================

const PROFILE_API = "http://127.0.0.1:8000/api/accounts/profile/";


const CoordinatorProfile = () => {

  // ==========================================================
  // STATE
  // ==========================================================

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // Form state
  const [formData, setFormData] = useState({
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
  });


  // ==========================================================
  // GET ACCESS TOKEN
  // ==========================================================

  const getAccessToken = () => {

    return (
      localStorage.getItem("accessToken") ||
      localStorage.getItem("access_token") ||
      localStorage.getItem("access")
    );

  };


  // ==========================================================
  // FETCH COORDINATOR PROFILE
  // ==========================================================

  useEffect(() => {

    const fetchCoordinatorProfile = async () => {

      try {

        setLoading(true);

        setError("");


        const token = getAccessToken();


        // ----------------------------------------------------
        // CHECK LOGIN TOKEN
        // ----------------------------------------------------

        if (!token) {

          setError(
            "Access token not found. Please login again."
          );

          setLoading(false);

          return;
        }


        // ----------------------------------------------------
        // CALL DJANGO API
        // ----------------------------------------------------

        const response = await fetch(PROFILE_API, {

          method: "GET",

          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },

        });


        // ----------------------------------------------------
        // TOKEN EXPIRED / UNAUTHORIZED
        // ----------------------------------------------------

        if (response.status === 401) {

          setError(
            "Your login session has expired. Please login again."
          );

          setLoading(false);

          return;
        }


        // ----------------------------------------------------
        // OTHER SERVER ERROR
        // ----------------------------------------------------

        if (!response.ok) {

          throw new Error(
            `Server returned ${response.status}`
          );

        }


        // ----------------------------------------------------
        // GET JSON
        // ----------------------------------------------------

        const data = await response.json();


        console.log(
          "Coordinator profile from Django:",
          data
        );


        // ----------------------------------------------------
        // STORE ORIGINAL DATA
        // ----------------------------------------------------


        // ----------------------------------------------------
        // SUPPORT DIFFERENT BACKEND FIELD NAMES
        // ----------------------------------------------------

        const fullName =
          data.full_name ||
          data.name ||
          data.coordinator_name ||
          data.user?.full_name ||
          data.user?.name ||
          "";


        const email =
          data.email ||
          data.email_address ||
          data.user?.email ||
          "";


        const phone =
          data.phone_number ||
          data.phone ||
          data.mobile_number ||
          "";


        const designation =
          data.designation ||
          data.position ||
          data.job_title ||
          "";


        const department =
          data.department ||
          data.department_name ||
          "";


        const experience =
          data.experience ||
          data.experience_years ||
          "";


        const staffId =
          data.staff_id ||
          data.employee_id ||
          "";


        const role =
          data.role ||
          data.account_role ||
          data.user?.role ||
          "Coordinator";


        const accountStatus =
          data.account_status ||
          data.status ||
          "Active";


        const accountType =
          data.account_type ||
          "University Staff";


        const lastUpdated =
          data.last_updated ||
          data.updated_at ||
          "";


        // ----------------------------------------------------
        // PUT API DATA INTO FORM
        // ----------------------------------------------------

        setFormData({

          full_name: fullName,

          email: email,

          phone_number: phone,

          designation: designation,

          department: department,

          experience: experience,

          staff_id: staffId,

          role: role,

          account_status: accountStatus,

          account_type: accountType,

          last_updated: lastUpdated,

        });


      } catch (err) {

        console.error(
          "Coordinator Profile Error:",
          err
        );


        setError(
          "Unable to connect to Django server. Please make sure the backend is running."
        );

      } finally {

        setLoading(false);

      }

    };


    fetchCoordinatorProfile();

  }, []);


  // ==========================================================
  // HANDLE INPUT CHANGE
  // ==========================================================

  const handleChange = (event) => {

    const { name, value } = event.target;

    setFormData((previous) => ({

      ...previous,

      [name]: value,

    }));

  };


  // ==========================================================
  // AVATAR INITIALS
  // ==========================================================

  const getInitials = () => {

    const name = formData.full_name
      ?.replace(/^Dr\.\s*/i, "")
      .trim();


    if (!name) {
      return "CO";
    }


    const words = name
      .split(" ")
      .filter(Boolean);


    if (words.length === 1) {

      return words[0]
        .substring(0, 2)
        .toUpperCase();

    }


    return (
      words[0][0] +
      words[words.length - 1][0]
    ).toUpperCase();

  };


  // ==========================================================
  // LOADING SCREEN
  // ==========================================================

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

              <p>
                Loading your profile information...
              </p>

            </div>

          </div>

        </div>

      </DashboardLayout>

    );

  }


  // ==========================================================
  // ERROR SCREEN
  // ==========================================================

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

              <p>
                {error}
              </p>

            </div>

          </div>

        </div>

      </DashboardLayout>

    );

  }


  // ==========================================================
  // MAIN PAGE
  // ==========================================================

  return (

    <DashboardLayout>

      <div className="coordinator-profile-page">


        {/* ==================================================
            BACK BUTTON
        ================================================== */}

        <div className="profile-navigation">

          <BackButton />

        </div>


        {/* ==================================================
            PAGE HEADER
        ================================================== */}

        <div className="profile-page-header">

          <div className="header-title">

            <span className="header-eyebrow">
              COORDINATOR ACCOUNT
            </span>

            <h1>
              My Profile
            </h1>

            <p>
              Manage your personal information and university profile details.
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


        {/* ==================================================
            MAIN PROFILE CARD
        ================================================== */}

        <div className="profile-main-card">


          {/* ==================================================
              PROFILE HERO
          ================================================== */}

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


                <h2>

                  {formData.full_name || "Coordinator"}

                </h2>


                <p>

                  {formData.department || "University Department"}

                </p>


                <div className="identity-meta">


                  <span>

                    <span className="meta-dot"></span>

                    {formData.email || "Email not available"}

                  </span>


                  <span>

                    Staff ID:{" "}

                    {formData.staff_id || "Not available"}

                  </span>


                </div>

              </div>

            </div>


            {/* VERIFIED BADGE */}

            <div className="profile-hero-badge">

              <span className="badge-icon">

                ✓

              </span>

              <div>

                <strong>
                  Verified
                </strong>

                <small>
                  University Account
                </small>

              </div>

            </div>

          </div>


          {/* ==================================================
              PROFILE CONTENT
          ================================================== */}

          <div className="profile-content">


            {/* ==================================================
                PERSONAL INFORMATION
            ================================================== */}

            <section className="profile-section">

              <div className="section-heading">

                <div className="section-icon">
                  👤
                </div>

                <div>

                  <h3>
                    Personal Information
                  </h3>

                  <p>
                    Basic information associated with your university account.
                  </p>

                </div>

              </div>


              <div className="profile-grid">


                {/* FULL NAME */}

                <div className="profile-field">

                  <label>
                    Full Name
                  </label>

                  <div className="input-wrapper">

                    <span className="input-icon">
                      A
                    </span>

                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                    />

                  </div>

                </div>


                {/* EMAIL */}

                <div className="profile-field">

                  <label>
                    Email Address
                  </label>

                  <div className="input-wrapper">

                    <span className="input-icon">
                      @
                    </span>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />

                  </div>

                </div>


                {/* PHONE */}

                <div className="profile-field">

                  <label>
                    Phone Number
                  </label>

                  <div className="input-wrapper">

                    <span className="input-icon">
                      ☎
                    </span>

                    <input
                      type="text"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleChange}
                    />

                  </div>

                </div>


                {/* DESIGNATION */}

                <div className="profile-field">

                  <label>
                    Designation
                  </label>

                  <div className="input-wrapper">

                    <span className="input-icon">
                      ID
                    </span>

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


            {/* ==================================================
                PROFESSIONAL INFORMATION
            ================================================== */}

            <section className="profile-section">

              <div className="section-heading">

                <div className="section-icon">
                  🏛
                </div>

                <div>

                  <h3>
                    Professional Information
                  </h3>

                  <p>
                    University department and professional experience.
                  </p>

                </div>

              </div>


              <div className="profile-grid">


                {/* DEPARTMENT */}

                <div className="profile-field">

                  <label>
                    Department
                  </label>

                  <div className="input-wrapper">

                    <span className="input-icon">
                      DE
                    </span>

                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                    />

                  </div>

                </div>


                {/* EXPERIENCE */}

                <div className="profile-field">

                  <label>
                    Experience
                  </label>

                  <div className="input-wrapper">

                    <span className="input-icon">
                      EX
                    </span>

                    <input
                      type="text"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                    />

                  </div>

                </div>


                {/* STAFF ID */}

                <div className="profile-field">

                  <label>
                    Staff ID
                  </label>

                  <div className="input-wrapper readonly">

                    <span className="input-icon">
                      #
                    </span>

                    <input
                      type="text"
                      name="staff_id"
                      value={formData.staff_id}
                      readOnly
                    />

                  </div>

                </div>


                {/* ACCOUNT ROLE */}

                <div className="profile-field">

                  <label>
                    Account Role
                  </label>

                  <div className="input-wrapper readonly">

                    <span className="input-icon">
                      R
                    </span>

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


            {/* ==================================================
                ACCOUNT INFORMATION
            ================================================== */}

            <section className="profile-section account-section">

              <div className="section-heading">

                <div className="section-icon">
                  🔐
                </div>

                <div>

                  <h3>
                    Account Information
                  </h3>

                  <p>
                    Security and account status information.
                  </p>

                </div>

              </div>


              <div className="account-info-grid">


                {/* ACCOUNT STATUS */}

                <div className="account-info-item">

                  <span className="account-info-label">
                    ACCOUNT STATUS
                  </span>

                  <span className="account-active">

                    <span></span>

                    {formData.account_status || "Active"}

                  </span>

                </div>


                {/* ACCOUNT TYPE */}

                <div className="account-info-item">

                  <span className="account-info-label">
                    ACCOUNT TYPE
                  </span>

                  <strong>
                    {formData.account_type || "University Staff"}
                  </strong>

                </div>


                {/* LAST UPDATED */}

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


          {/* ==================================================
              FOOTER ACTIONS
          ================================================== */}

          <div className="profile-footer">


            <div className="footer-message">

              <span className="footer-icon">
                ✓
              </span>

              <div>

                <strong>
                  Keep your information updated
                </strong>

                <p>
                  Make sure your contact details are accurate.
                </p>

              </div>

            </div>


            <div className="profile-actions">

              <button
                type="button"
                className="cancel-btn"
                onClick={() => window.location.reload()}
              >
                Cancel
              </button>


              <button
                type="button"
                className="save-btn"
                onClick={() => {
                  alert(
                    "Profile data is loaded from Django. Save API will be connected when the backend update endpoint is provided."
                  );
                }}
              >

                <span>
                  Save Changes
                </span>

                <span className="save-arrow">
                  →
                </span>

              </button>

            </div>

          </div>


        </div>

      </div>

    </DashboardLayout>

  );

};


export default CoordinatorProfile;