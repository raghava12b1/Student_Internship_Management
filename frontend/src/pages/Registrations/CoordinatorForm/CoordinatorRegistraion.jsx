import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CoordinatorRegistration.css";

function CoordinatorRegistration() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    employeeId: "",
    collegeEmail: "",
    mobileNumber: "",
    department: "",
    designation: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ============================================================
  // BACK TO LOGIN
  // ============================================================

  const goToLogin = () => {
    navigate("/", {
      state: {
        showLogin: true,
        selectedRole: "Coordinator",
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

    // ----------------------------------------------------------
    // REQUIRED FIELDS
    // ----------------------------------------------------------

    if (Object.values(formData).some((value) => !value)) {
      alert("Please fill all required fields.");
      return;
    }

    // ----------------------------------------------------------
    // PASSWORD VALIDATION
    // ----------------------------------------------------------

    if (formData.password.length < 8) {
      alert("Password must contain at least 8 characters.");
      return;
    }

    // ----------------------------------------------------------
    // CONFIRM PASSWORD
    // ----------------------------------------------------------

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    // ----------------------------------------------------------
    // MOBILE VALIDATION
    // ----------------------------------------------------------

    if (!/^[0-9]{10}$/.test(formData.mobileNumber)) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    // ----------------------------------------------------------
    // REGISTRATION
    // ----------------------------------------------------------

    console.log("Coordinator Registration:", formData);

    alert("Coordinator registration successful!");

    // Directly return to Login to Continue
    goToLogin();
  };

  return (
    <div className="coordinator-registration-page">

      {/* ======================================================
          TOP BAR
      ====================================================== */}

      <div className="coordinator-topbar">

        <button
          type="button"
          className="coordinator-back-button"
          onClick={goToLogin}
        >
          <span>←</span>
          Back to Login
        </button>

        <button
          type="button"
          className="coordinator-close-button"
          onClick={goToLogin}
        >
          ×
        </button>

      </div>


      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="coordinator-header">

        <div className="coordinator-brand-mark">
          AU
        </div>

        <div>

          <span>
            ADITYA UNIVERSITY
          </span>

          <h1>
            Coordinator Registration
          </h1>

          <p>
            Create your coordinator account to manage
            student internships and faculty activities.
          </p>

        </div>

      </div>


      {/* ======================================================
          MAIN
      ====================================================== */}

      <div className="coordinator-registration-wrapper">


        {/* ====================================================
            LEFT INFORMATION PANEL
        ==================================================== */}

        <aside className="coordinator-info">

          <div className="coordinator-number">
            02
          </div>

          <span className="coordinator-label">
            FACULTY ACCESS
          </span>

          <h2>
            Coordinate.
            <span>Connect. Manage.</span>
          </h2>

          <p>
            Manage students, verify internship documents,
            monitor progress and coordinate internship
            activities from one centralized platform.
          </p>

          <div className="coordinator-divider"></div>


          {/* FEATURE 1 */}

          <div className="coordinator-feature">

            <span>✓</span>

            <div>

              <strong>
                Student Management
              </strong>

              <small>
                Monitor assigned students
              </small>

            </div>

          </div>


          {/* FEATURE 2 */}

          <div className="coordinator-feature">

            <span>✓</span>

            <div>

              <strong>
                Document Verification
              </strong>

              <small>
                Review internship submissions
              </small>

            </div>

          </div>


          {/* FEATURE 3 */}

          <div className="coordinator-feature">

            <span>✓</span>

            <div>

              <strong>
                Progress Monitoring
              </strong>

              <small>
                Track internship activities
              </small>

            </div>

          </div>

        </aside>


        {/* ====================================================
            FORM
        ==================================================== */}

        <main className="coordinator-form-card">

          <div className="coordinator-form-heading">

            <span>
              CREATE ACCOUNT
            </span>

            <h2>
              Coordinator Details
            </h2>

            <p>
              Provide your official university information.
            </p>

          </div>


          <form onSubmit={handleSubmit}>

            <div className="coordinator-form-grid">


              {/* =================================================
                  FULL NAME
              ================================================= */}

              <div className="coordinator-form-field">

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


              {/* =================================================
                  EMPLOYEE ID
              ================================================= */}

              <div className="coordinator-form-field">

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


              {/* =================================================
                  EMAIL
              ================================================= */}

              <div className="coordinator-form-field">

                <label>
                  Official College Email *
                </label>

                <input
                  type="email"
                  name="collegeEmail"
                  placeholder="Enter official email"
                  value={formData.collegeEmail}
                  onChange={handleChange}
                />

              </div>


              {/* =================================================
                  MOBILE
              ================================================= */}

              <div className="coordinator-form-field">

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


              {/* =================================================
                  DEPARTMENT
              ================================================= */}

              <div className="coordinator-form-field">

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


              {/* =================================================
                  DESIGNATION
              ================================================= */}

              <div className="coordinator-form-field">

                <label>
                  Designation *
                </label>

                <select
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                >

                  <option value="">
                    Select Designation
                  </option>

                  <option value="Internship Coordinator">
                    Internship Coordinator
                  </option>

                  <option value="Faculty Coordinator">
                    Faculty Coordinator
                  </option>

                  <option value="Placement Coordinator">
                    Placement Coordinator
                  </option>

                  <option value="Department Coordinator">
                    Department Coordinator
                  </option>

                </select>

              </div>


              {/* =================================================
                  PASSWORD
              ================================================= */}

              <div className="coordinator-form-field">

                <label>
                  Password *
                </label>

                <div className="coordinator-password-wrapper">

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
                    {
                      showPassword
                        ? "Hide"
                        : "Show"
                    }
                  </button>

                </div>

              </div>


              {/* =================================================
                  CONFIRM PASSWORD
              ================================================= */}

              <div className="coordinator-form-field">

                <label>
                  Confirm Password *
                </label>

                <div className="coordinator-password-wrapper">

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
                    {
                      showConfirmPassword
                        ? "Hide"
                        : "Show"
                    }
                  </button>

                </div>

              </div>

            </div>


            {/* ==================================================
                NOTICE
            ================================================== */}

            <div className="coordinator-notice">

              <span>✓</span>

              <p>
                Coordinator accounts are intended for
                authorized university faculty members.
              </p>

            </div>


            {/* ==================================================
                SUBMIT
            ================================================== */}

            <button
              type="submit"
              className="coordinator-register-button"
            >
              Create Coordinator Account

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

export default CoordinatorRegistration;