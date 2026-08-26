import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminRegistration.css";

function AdminRegistration() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    accessLevel: "System Admin",
    authorizationCode: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ============================================================
  // GO BACK TO LOGIN
  // ============================================================

  const goToLogin = () => {
    navigate("/", {
      state: {
        showLogin: true,
      },
    });
  };

  // ============================================================
  // HANDLE INPUT CHANGE
  // ============================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ============================================================
  // SUBMIT REGISTRATION
  // ============================================================

  const handleSubmit = (e) => {
    e.preventDefault();

    const {
      fullName,
      username,
      email,
      phone,
      password,
      confirmPassword,
      authorizationCode,
    } = formData;

    // ----------------------------------------------------------
    // REQUIRED FIELDS
    // ----------------------------------------------------------

    if (
      !fullName ||
      !username ||
      !email ||
      !phone ||
      !password ||
      !confirmPassword ||
      !authorizationCode
    ) {
      alert("Please fill all required fields.");
      return;
    }

    // ----------------------------------------------------------
    // PASSWORD VALIDATION
    // ----------------------------------------------------------

    if (password.length < 8) {
      alert("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    // ----------------------------------------------------------
    // MOBILE VALIDATION
    // ----------------------------------------------------------

    if (!/^[0-9]{10}$/.test(phone)) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    // ----------------------------------------------------------
    // EMAIL VALIDATION
    // ----------------------------------------------------------

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    // ----------------------------------------------------------
    // ADMIN REGISTRATION
    // ----------------------------------------------------------

    console.log("Admin Registration:", formData);

    alert("Admin registration successful!");

    // ----------------------------------------------------------
    // AFTER REGISTRATION → LOGIN TO CONTINUE
    // ----------------------------------------------------------

    goToLogin();
  };

  return (
    <div className="admin-registration-page">

      {/* ========================================================
          TOP BAR
      ======================================================== */}

      <div className="admin-registration-topbar">

        <button
          type="button"
          className="admin-back-button"
          onClick={goToLogin}
        >
          <span>←</span>
          Back to Login
        </button>

        <button
          type="button"
          className="admin-close-button"
          onClick={goToLogin}
          aria-label="Close registration"
        >
          ×
        </button>

      </div>


      {/* ========================================================
          HEADER
      ======================================================== */}

      <div className="admin-registration-header">

        <div className="admin-brand-mark">
          AU
        </div>

        <div>

          <span className="admin-university-name">
            ADITYA UNIVERSITY
          </span>

          <h1>
            Admin Registration
          </h1>

          <p>
            Create an authorized administrative account
            for the internship management system.
          </p>

        </div>

      </div>


      {/* ========================================================
          MAIN CONTENT
      ======================================================== */}

      <div className="admin-registration-wrapper">


        {/* ======================================================
            LEFT INFORMATION PANEL
        ====================================================== */}

        <aside className="admin-registration-info">

          <div className="admin-info-number">
            04
          </div>

          <span className="admin-info-kicker">
            SYSTEM ACCESS
          </span>

          <h2>
            Control.
            <span>Secure. Manage.</span>
          </h2>

          <p>
            Administrative accounts provide high-level
            access to users, companies, internships,
            reports and system operations.
          </p>

          <div className="admin-info-divider"></div>


          {/* SECURITY ITEM 1 */}

          <div className="admin-security-item">

            <span>✓</span>

            <div>

              <strong>
                Secure Access
              </strong>

              <small>
                Protected administrative account
              </small>

            </div>

          </div>


          {/* SECURITY ITEM 2 */}

          <div className="admin-security-item">

            <span>✓</span>

            <div>

              <strong>
                User Management
              </strong>

              <small>
                Manage university system users
              </small>

            </div>

          </div>


          {/* SECURITY ITEM 3 */}

          <div className="admin-security-item">

            <span>✓</span>

            <div>

              <strong>
                System Control
              </strong>

              <small>
                Manage portal-wide operations
              </small>

            </div>

          </div>

        </aside>


        {/* ======================================================
            FORM
        ====================================================== */}

        <main className="admin-registration-form">


          {/* FORM HEADER */}

          <div className="admin-form-heading">

            <span>
              CREATE ACCOUNT
            </span>

            <h2>
              Administrator Details
            </h2>

            <p>
              Enter the details required to create the
              administrative account.
            </p>

          </div>


          {/* ====================================================
              FORM
          ==================================================== */}

          <form onSubmit={handleSubmit}>


            {/* ==================================================
                ROW 1
            ================================================== */}

            <div className="admin-form-row">


              {/* FULL NAME */}

              <div className="admin-form-field">

                <label>
                  Full Name *
                </label>

                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter full name"
                  value={formData.fullName}
                  onChange={handleChange}
                />

              </div>


              {/* USERNAME */}

              <div className="admin-form-field">

                <label>
                  Username *
                </label>

                <input
                  type="text"
                  name="username"
                  placeholder="Choose username"
                  value={formData.username}
                  onChange={handleChange}
                />

              </div>

            </div>


            {/* ==================================================
                ROW 2
            ================================================== */}

            <div className="admin-form-row">


              {/* EMAIL */}

              <div className="admin-form-field">

                <label>
                  Email Address *
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="example@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                />

                <small className="admin-field-hint">
                  Personal or organizational email allowed
                </small>

              </div>


              {/* PHONE */}

              <div className="admin-form-field">

                <label>
                  Mobile Number *
                </label>

                <input
                  type="tel"
                  name="phone"
                  placeholder="10-digit mobile number"
                  maxLength="10"
                  value={formData.phone}
                  onChange={handleChange}
                />

              </div>

            </div>


            {/* ==================================================
                ROW 3
            ================================================== */}

            <div className="admin-form-row">


              {/* ACCESS LEVEL */}

              <div className="admin-form-field">

                <label>
                  Access Level
                </label>

                <select
                  name="accessLevel"
                  value={formData.accessLevel}
                  onChange={handleChange}
                >

                  <option value="System Admin">
                    System Admin
                  </option>

                  <option value="Super Admin">
                    Super Admin
                  </option>

                  <option value="Developer">
                    Developer
                  </option>

                </select>

              </div>


              {/* AUTHORIZATION CODE */}

              <div className="admin-form-field">

                <label>
                  Authorization Code *
                </label>

                <input
                  type="text"
                  name="authorizationCode"
                  placeholder="Enter authorization code"
                  value={formData.authorizationCode}
                  onChange={handleChange}
                />

              </div>

            </div>


            {/* ==================================================
                ROW 4
            ================================================== */}

            <div className="admin-form-row">


              {/* PASSWORD */}

              <div className="admin-form-field">

                <label>
                  Password *
                </label>

                <div className="admin-password-wrapper">

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    placeholder="Create password"
                    value={formData.password}
                    onChange={handleChange}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>

                </div>

                <small className="admin-field-hint">
                  Minimum 8 characters
                </small>

              </div>


              {/* CONFIRM PASSWORD */}

              <div className="admin-form-field">

                <label>
                  Confirm Password *
                </label>

                <div className="admin-password-wrapper">

                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                  >
                    {showConfirmPassword
                      ? "Hide"
                      : "Show"}
                  </button>

                </div>

              </div>

            </div>


            {/* ==================================================
                AUTHORIZATION NOTICE
            ================================================== */}

            <div className="admin-authorization-notice">

              <span>!</span>

              <p>
                Administrative accounts require valid
                authorization. Never share administrator
                credentials with unauthorized users.
              </p>

            </div>


            {/* ==================================================
                SUBMIT BUTTON
            ================================================== */}

            <button
              type="submit"
              className="admin-register-button"
            >

              Create Admin Account

              <span>
                →
              </span>

            </button>

          </form>

        </main>

      </div>

    </div>
  );
}

export default AdminRegistration;