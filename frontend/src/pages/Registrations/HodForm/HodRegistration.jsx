import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HodRegistration.css";

function HodRegistration() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    employeeId: "",
    collegeEmail: "",
    mobileNumber: "",
    department: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ============================================================
  // GO TO LOGIN PAGE
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
  // HANDLE REGISTRATION
  // ============================================================

  const handleSubmit = (e) => {
    e.preventDefault();

    const {
      fullName,
      employeeId,
      collegeEmail,
      mobileNumber,
      department,
      password,
      confirmPassword,
    } = formData;

    // ----------------------------------------------------------
    // REQUIRED FIELD VALIDATION
    // ----------------------------------------------------------

    if (
      !fullName ||
      !employeeId ||
      !collegeEmail ||
      !mobileNumber ||
      !department ||
      !password ||
      !confirmPassword
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

    if (!/^[0-9]{10}$/.test(mobileNumber)) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    // ----------------------------------------------------------
    // EMAIL VALIDATION
    // ----------------------------------------------------------

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(collegeEmail)) {
      alert("Please enter a valid college email address.");
      return;
    }

    // ----------------------------------------------------------
    // REGISTRATION
    // ----------------------------------------------------------

    console.log("HOD Registration:", formData);

    alert("HOD registration successful!");

    // ----------------------------------------------------------
    // AFTER REGISTRATION → LOGIN TO CONTINUE
    // ----------------------------------------------------------

    goToLogin();
  };

  return (
    <div className="hod-registration-page">

      {/* ========================================================
          TOP BAR
      ======================================================== */}

      <div className="hod-topbar">

        <button
          type="button"
          className="hod-back-button"
          onClick={goToLogin}
        >
          <span>←</span>
          Back to Login
        </button>

        <button
          type="button"
          className="hod-close-button"
          onClick={goToLogin}
          aria-label="Close registration"
        >
          ×
        </button>

      </div>


      {/* ========================================================
          HEADER
      ======================================================== */}

      <div className="hod-header">

        <div className="hod-brand-mark">
          AU
        </div>

        <div>

          <span>
            ADITYA UNIVERSITY
          </span>

          <h1>
            HOD Registration
          </h1>

          <p>
            Create an authorized HOD account for department
            activities and internship operations.
          </p>

        </div>

      </div>


      {/* ========================================================
          MAIN REGISTRATION WRAPPER
      ======================================================== */}

      <div className="hod-registration-wrapper">


        {/* ======================================================
            LEFT INFORMATION PANEL
        ====================================================== */}

        <aside className="hod-info">

          <div className="hod-number">
            03
          </div>

          <span className="hod-label">
            DEPARTMENT LEADERSHIP
          </span>

          <h2>
            Lead With
            <span>Clarity & Control.</span>
          </h2>

          <p>
            Manage department-level internship activities,
            monitor coordinators, review approvals and analyze
            student internship performance.
          </p>

          <div className="hod-divider"></div>


          {/* FEATURE 1 */}

          <div className="hod-feature">

            <span>✓</span>

            <div>

              <strong>
                Department Oversight
              </strong>

              <small>
                Monitor internship operations
              </small>

            </div>

          </div>


          {/* FEATURE 2 */}

          <div className="hod-feature">

            <span>✓</span>

            <div>

              <strong>
                Approval Management
              </strong>

              <small>
                Review department requests
              </small>

            </div>

          </div>


          {/* FEATURE 3 */}

          <div className="hod-feature">

            <span>✓</span>

            <div>

              <strong>
                Analytics & Reports
              </strong>

              <small>
                Track department performance
              </small>

            </div>

          </div>

        </aside>


        {/* ======================================================
            FORM AREA
        ====================================================== */}

        <main className="hod-form-card">

          {/* FORM HEADER */}

          <div className="hod-form-heading">

            <span>
              CREATE ACCOUNT
            </span>

            <h2>
              HOD Details
            </h2>

            <p>
              Enter the official details required to create
              the HOD account.
            </p>

          </div>


          {/* ====================================================
              FORM
          ==================================================== */}

          <form onSubmit={handleSubmit}>


            {/* ==================================================
                ROW 1
            ================================================== */}

            <div className="hod-form-grid">


              {/* FULL NAME */}

              <div className="hod-form-field">

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


              {/* EMPLOYEE ID */}

              <div className="hod-form-field">

                <label>
                  Employee ID *
                </label>

                <input
                  type="text"
                  name="employeeId"
                  placeholder="Enter employee ID"
                  value={formData.employeeId}
                  onChange={handleChange}
                />

              </div>

            </div>


            {/* ==================================================
                ROW 2
            ================================================== */}

            <div className="hod-form-grid">


              {/* EMAIL */}

              <div className="hod-form-field">

                <label>
                  Official College Email *
                </label>

                <input
                  type="email"
                  name="collegeEmail"
                  placeholder="example@adityauniversity.in"
                  value={formData.collegeEmail}
                  onChange={handleChange}
                />

                <small className="hod-field-hint">
                  Use your official university email address
                </small>

              </div>


              {/* MOBILE */}

              <div className="hod-form-field">

                <label>
                  Mobile Number *
                </label>

                <input
                  type="tel"
                  name="mobileNumber"
                  placeholder="10-digit mobile number"
                  maxLength="10"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                />

              </div>

            </div>


            {/* ==================================================
                ROW 3
            ================================================== */}

            <div className="hod-form-grid">


              {/* DEPARTMENT */}

              <div className="hod-form-field">

                <label>
                  Department *
                </label>

                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                >

                  <option value="">
                    Select Department
                  </option>

                  <option value="IT">
                    Information Technology
                  </option>

                  <option value="CSE">
                    Computer Science Engineering
                  </option>

                  <option value="AIML">
                    Artificial Intelligence & Machine Learning
                  </option>

                  <option value="ECE">
                    Electronics & Communication Engineering
                  </option>

                  <option value="EEE">
                    Electrical & Electronics Engineering
                  </option>

                  <option value="MECH">
                    Mechanical Engineering
                  </option>

                  <option value="CIVIL">
                    Civil Engineering
                  </option>

                </select>

              </div>


              {/* DESIGNATION */}

              <div className="hod-form-field">

                <label>
                  Designation
                </label>

                <input
                  type="text"
                  value="Head of Department"
                  readOnly
                />

              </div>

            </div>


            {/* ==================================================
                ROW 4
            ================================================== */}

            <div className="hod-form-grid">


              {/* PASSWORD */}

              <div className="hod-form-field">

                <label>
                  Password *
                </label>

                <div className="hod-password-wrapper">

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

                <small className="hod-field-hint">
                  Minimum 8 characters
                </small>

              </div>


              {/* CONFIRM PASSWORD */}

              <div className="hod-form-field">

                <label>
                  Confirm Password *
                </label>

                <div className="hod-password-wrapper">

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

            <div className="hod-notice">

              <span>!</span>

              <p>
                HOD accounts should only be created using
                authorized university credentials. Keep your
                account credentials secure.
              </p>

            </div>


            {/* ==================================================
                SUBMIT BUTTON
            ================================================== */}

            <button
              type="submit"
              className="hod-register-button"
            >

              Create HOD Account

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

export default HodRegistration;