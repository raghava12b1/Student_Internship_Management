import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StudentRegistration.css";

function StudentRegistration() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    rollNumber: "",
    collegeEmail: "",
    mobileNumber: "",
    department: "",
    year: "",
    section: "",
    semester: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ============================================================
  // BACK TO LOGIN
  // ============================================================

  const goToLogin = () => {
    navigate("/", {
      state: {
        showLogin: true,
        selectedRole: "Student",
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      fullName,
      rollNumber,
      collegeEmail,
      mobileNumber,
      department,
      year,
      semester,
      password,
      confirmPassword,
    } = formData;

    // ----------------------------------------------------------
    // REQUIRED FIELDS
    // ----------------------------------------------------------

    if (
      !fullName ||
      !rollNumber ||
      !collegeEmail ||
      !mobileNumber ||
      !department ||
      !year ||
      !semester ||
      !password ||
      !confirmPassword
    ) {
      alert("Please fill all required fields.");
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
    // PASSWORD VALIDATION
    // ----------------------------------------------------------

    if (password.length < 8) {
      alert("Password must contain at least 8 characters.");
      return;
    }

    // ----------------------------------------------------------
    // CONFIRM PASSWORD
    // ----------------------------------------------------------

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    // ----------------------------------------------------------
    // EMAIL VALIDATION
    // ----------------------------------------------------------

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(collegeEmail)) {
      alert("Please enter a valid email address.");
      return;
    }

    // ----------------------------------------------------------
    // PREVENT DOUBLE SUBMISSION
    // ----------------------------------------------------------

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      // --------------------------------------------------------
      // SEND REGISTRATION DATA TO DJANGO
      // --------------------------------------------------------

      const response = await fetch(
        "http://127.0.0.1:8000/api/accounts/register/",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            student_name: fullName.trim(),
            roll_number: rollNumber.trim(),
            department: department,
            year: Number(year),
            semester: Number(semester),
            mobile_number: mobileNumber.trim(),
            email: collegeEmail.trim(),
            password: password,
            confirm_password: confirmPassword,
          }),
        }
      );

      // --------------------------------------------------------
      // READ DJANGO RESPONSE
      // --------------------------------------------------------

      const data = await response.json();

      console.log("Registration response:", data);

      // --------------------------------------------------------
      // REGISTRATION FAILED
      // --------------------------------------------------------

      if (!response.ok) {
        let errorMessage = "Registration failed.";

        if (typeof data === "object" && data !== null) {
          const messages = [];

          Object.entries(data).forEach(([field, errors]) => {
            if (Array.isArray(errors)) {
              messages.push(`${field}: ${errors.join(", ")}`);
            } else {
              messages.push(`${field}: ${errors}`);
            }
          });

          if (messages.length > 0) {
            errorMessage = messages.join("\n");
          }
        }

        alert(errorMessage);
        return;
      }

      // --------------------------------------------------------
      // REGISTRATION SUCCESS
      // --------------------------------------------------------

      alert(
        "Student registration successful!\n\n" +
        `Username: ${rollNumber.trim()}\n` +
        "You can now login."
      );

      // --------------------------------------------------------
      // GO TO LOGIN
      // --------------------------------------------------------

      goToLogin();

    } catch (error) {
      console.error("Registration error:", error);

      alert(
        "Unable to connect to the server.\n\n" +
        "Please make sure Django is running at:\n" +
        "http://127.0.0.1:8000/"
      );

    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="student-registration-page">

      {/* ======================================================
          TOP NAVIGATION
      ====================================================== */}

      <div className="student-registration-topbar">

        <button
          type="button"
          className="student-back-button"
          onClick={goToLogin}
        >
          <span>←</span>
          Back to Login
        </button>

        <button
          type="button"
          className="student-close-button"
          onClick={goToLogin}
          aria-label="Close registration"
        >
          ×
        </button>

      </div>

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="student-registration-header">

        <div className="student-brand-mark">
          AU
        </div>

        <div className="student-header-content">

          <span className="student-university">
            ADITYA UNIVERSITY
          </span>

          <h1>
            Student Registration
          </h1>

          <p>
            Create your university account and access the
            Student Internship Management Portal.
          </p>

        </div>

      </div>

      {/* ======================================================
          MAIN
      ====================================================== */}

      <div className="student-registration-wrapper">

        {/* ====================================================
            LEFT INFORMATION PANEL
        ==================================================== */}

        <aside className="student-registration-info">

          <div className="student-info-number">
            01
          </div>

          <span className="student-info-label">
            STUDENT ACCESS
          </span>

          <h2>
            Start Your
            <span>Internship Journey</span>
          </h2>

          <p>
            Create your student account to manage internship
            applications, offer letters, final reports,
            progress and certificates.
          </p>

          <div className="student-info-divider"></div>

          {/* FEATURE 1 */}

          <div className="student-feature">

            <span>✓</span>

            <div>

              <strong>
                Internship Tracking
              </strong>

              <small>
                Track your internship journey digitally
              </small>

            </div>

          </div>

          {/* FEATURE 2 */}

          <div className="student-feature">

            <span>✓</span>

            <div>

              <strong>
                Document Management
              </strong>

              <small>
                Manage internship documents securely
              </small>

            </div>

          </div>

          {/* FEATURE 3 */}

          <div className="student-feature">

            <span>✓</span>

            <div>

              <strong>
                Progress Monitoring
              </strong>

              <small>
                Keep your faculty updated
              </small>

            </div>

          </div>

        </aside>

        {/* ====================================================
            FORM
        ==================================================== */}

        <main className="student-registration-form-card">

          <div className="student-form-heading">

            <span>
              CREATE ACCOUNT
            </span>

            <h2>
              Student Details
            </h2>

            <p>
              Enter your university information carefully.
            </p>

          </div>

          <form onSubmit={handleSubmit}>

            <div className="student-form-grid">

              {/* =================================================
                  FULL NAME
              ================================================= */}

              <div className="student-form-field">

                <label>
                  Full Name
                  <span>*</span>
                </label>

                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                />

              </div>

              {/* =================================================
                  ROLL NUMBER
              ================================================= */}

              <div className="student-form-field">

                <label>
                  Roll Number
                  <span>*</span>
                </label>

                <input
                  type="text"
                  name="rollNumber"
                  placeholder="e.g. 26A21A1201"
                  value={formData.rollNumber}
                  onChange={handleChange}
                />

              </div>

              {/* =================================================
                  EMAIL
              ================================================= */}

              <div className="student-form-field">

                <label>
                  College Email
                  <span>*</span>
                </label>

                <input
                  type="email"
                  name="collegeEmail"
                  placeholder="yourname@aec.edu.in"
                  value={formData.collegeEmail}
                  onChange={handleChange}
                />

              </div>

              {/* =================================================
                  MOBILE
              ================================================= */}

              <div className="student-form-field">

                <label>
                  Mobile Number
                  <span>*</span>
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

              <div className="student-form-field">

                <label>
                  Department
                  <span>*</span>
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
                  YEAR
              ================================================= */}

              <div className="student-form-field">

                <label>
                  Year
                  <span>*</span>
                </label>

                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                >

                  <option value="">
                    Select Year
                  </option>

                  <option value="1">
                    1st Year
                  </option>

                  <option value="2">
                    2nd Year
                  </option>

                  <option value="3">
                    3rd Year
                  </option>

                  <option value="4">
                    4th Year
                  </option>

                </select>

              </div>

              {/* =================================================
                  SEMESTER
              ================================================= */}

              <div className="student-form-field">

                <label>
                  Semester
                  <span>*</span>
                </label>

                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                >

                  <option value="">
                    Select Semester
                  </option>

                  <option value="1">
                    1st Semester
                  </option>

                  <option value="2">
                    2nd Semester
                  </option>

                  <option value="3">
                    3rd Semester
                  </option>

                  <option value="4">
                    4th Semester
                  </option>

                  <option value="5">
                    5th Semester
                  </option>

                  <option value="6">
                    6th Semester
                  </option>

                  <option value="7">
                    7th Semester
                  </option>

                  <option value="8">
                    8th Semester
                  </option>

                </select>

              </div>

              {/* =================================================
                  SECTION
              ================================================= */}

              <div className="student-form-field">

                <label>
                  Section
                </label>

                <select
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                >

                  <option value="">
                    Select Section
                  </option>

                  <option value="A">
                    Section A
                  </option>

                  <option value="B">
                    Section B
                  </option>

                  <option value="C">
                    Section C
                  </option>

                  <option value="D">
                    Section D
                  </option>

                </select>

                <small>
                  Section is currently stored only in the frontend.
                </small>

              </div>

              {/* =================================================
                  PASSWORD
              ================================================= */}

              <div className="student-form-field">

                <label>
                  Password
                  <span>*</span>
                </label>

                <div className="student-password-wrapper">

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

                <small>
                  Minimum 8 characters
                </small>

              </div>

              {/* =================================================
                  CONFIRM PASSWORD
              ================================================= */}

              <div className="student-form-field">

                <label>
                  Confirm Password
                  <span>*</span>
                </label>

                <div className="student-password-wrapper">

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

            <div className="student-form-notice">

              <span>✓</span>

              <p>
                Your information will be used only for
                university internship management.
              </p>

            </div>

            {/* ==================================================
                SUBMIT
            ================================================== */}

            <button
              type="submit"
              className="student-register-button"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Creating Account..."
                : "Create Student Account"}

              {!isSubmitting && (
                <span>
                  →
                </span>
              )}

            </button>

          </form>

        </main>

      </div>

    </div>
  );
}

export default StudentRegistration;