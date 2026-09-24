import { useState } from "react";
import "./Hero.css";

import heroImage from "../../assets/images/hero.png";
import { login } from "../../services/api";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

function Hero() {
  const location = useLocation();
  const navigate = useNavigate();

  // ============================================================
  // ROLE
  // ============================================================

  const initialRole =
    location.state?.selectedRole || "Student";

  // ============================================================
  // LOGIN STATE
  // ============================================================

  const [selectedRole, setSelectedRole] =
    useState(initialRole);

  const [showLogin, setShowLogin] =
    useState(
      location.state?.showLogin === true
    );

  // ============================================================
  // LOGIN FORM
  // ============================================================

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  // ============================================================
  // LOGIN
  // ============================================================

  const handleLogin = async () => {
    // ----------------------------------------------------------
    // EMPTY FIELD VALIDATION
    // ----------------------------------------------------------

    if (
      username.trim() === "" ||
      password.trim() === ""
    ) {
      alert("Please enter Username and Password");
      return;
    }

    try {
      // --------------------------------------------------------
      // LOGIN API
      // --------------------------------------------------------

      const data = await login(username.trim(), password);

      // --------------------------------------------------------
      // SAVE AUTHENTICATION DATA
      // --------------------------------------------------------

      localStorage.setItem(
        "accessToken",
        data.access
      );

      localStorage.setItem(
        "refreshToken",
        data.refresh
      );

      localStorage.setItem(
        "userName",
        data.username
      );

      // --------------------------------------------------------
      // CONVERT DJANGO ROLE
      // --------------------------------------------------------

      let frontendRole = "";

      switch (data.role) {
        case "STUDENT":
          frontendRole = "Student";
          break;

        case "COORDINATOR":
          frontendRole = "Internship Coordinator";
          break;

        case "ADMIN":
          frontendRole = "Administrator";
          break;

        default:
          frontendRole =
            data.role || selectedRole;
      }

      localStorage.setItem(
        "userRole",
        frontendRole
      );

      // --------------------------------------------------------
      // STORE BASIC CURRENT USER INFORMATION
      // --------------------------------------------------------

      const currentUser = {
        username: data.username,
        role: frontendRole,
      };

      localStorage.setItem(
        "currentUser",
        JSON.stringify(currentUser)
      );

      // --------------------------------------------------------
      // REDIRECT BASED ON BACKEND ROLE
      // --------------------------------------------------------

      switch (data.role) {
        case "STUDENT":
          navigate("/student/dashboard");
          break;

        case "COORDINATOR":
          navigate("/coordinator/dashboard");
          break;

        case "ADMIN":
          navigate("/admin/dashboard");
          break;

        default:
          alert(
            "Login successful, but the user role is not recognized."
          );
      }
    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      alert(
        "Unable to connect to the server. Please make sure Django is running."
      );
    }
  };

  // ============================================================
  // REGISTRATION PATH
  // ============================================================

  const getRegistrationPath = () => {
    switch (selectedRole) {
      case "Student":
        return "/register/student";

      case "Coordinator":
        return "/register/coordinator";

      case "Admin":
        return "/register/admin";

      default:
        return "/register/student";
    }
  };

  // ============================================================
  // OPEN LOGIN
  // ============================================================

  const openLogin = () => {
    setShowLogin(true);
    setSelectedRole("Student");

    navigate("/", {
      replace: true,
      state: {
        showLogin: true,
        selectedRole: "Student",
      },
    });
  };

  // ============================================================
  // BACK TO HOME
  // ============================================================

  const goToHome = () => {
    setShowLogin(false);

    setUsername("");
    setPassword("");

    navigate("/", {
      replace: true,
      state: {},
    });
  };

  // ============================================================
  // ROLE SELECTION
  // ============================================================

  const handleRoleChange = (role) => {
    setSelectedRole(role);
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <section
      className={`hero ${
        showLogin
          ? "login-view"
          : "home-view"
      }`}
    >

      {/* ======================================================
          HOME / HERO VIEW
      ====================================================== */}

      {!showLogin && (
        <div className="hero-page">
          <div className="hero-container">
            <div className="hero-content">

              {/* ==================================================
                  LEFT SIDE
              ================================================== */}

              <div className="hero-text">

                {/* UNIVERSITY */}

                <div className="hero-eyebrow">
                  <span className="eyebrow-line"></span>

                  ADITYA UNIVERSITY
                </div>

                {/* PORTAL BADGE */}

                <div className="hero-badge">
                  <span className="hero-badge-dot"></span>

                  <span>
                    Student Internship Management Portal
                  </span>
                </div>

                {/* MAIN HEADING */}

                <h1>
                  Student Internship Management System
                </h1>

                {/* DESCRIPTION */}

                <p>
                  A centralized digital platform for
                  managing internships, tracking student
                  progress, coordinating faculty activities,
                  and connecting students with industry
                  opportunities.
                </p>

                {/* ACTIONS */}

                <div className="hero-actions">

                  {/* GET STARTED */}

                  <button
                    type="button"
                    className="btn-get-started"
                    onClick={openLogin}
                  >
                    <span>
                      Get Started
                    </span>

                    <span className="btn-arrow">
                      →
                    </span>
                  </button>

                  {/* STATUS */}

                  <div className="hero-status">
                    <span className="status-dot"></span>

                    University Digital Platform
                  </div>

                </div>
              </div>

              {/* ==================================================
                  RIGHT SIDE IMAGE
              ================================================== */}

              <div className="hero-image">

                <div className="image-backdrop"></div>

                <div className="image-frame">
                  <img
                    src={heroImage}
                    alt="Student Internship Management System"
                  />
                </div>

                {/* FLOATING CARD 1 */}

                <div className="floating-card card-one">
                  <span className="floating-icon">
                    🎓
                  </span>

                  <div>
                    <strong>
                      Student
                    </strong>

                    <small>
                      Internship Tracking
                    </small>
                  </div>
                </div>

                {/* FLOATING CARD 2 */}

                <div className="floating-card card-two">
                  <span className="floating-icon">
                    ✓
                  </span>

                  <div>
                    <strong>
                      Digital
                    </strong>

                    <small>
                      Process Management
                    </small>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================
          LOGIN VIEW
      ====================================================== */}

      {showLogin && (
        <div className="login-page">
          <div className="login-container">

            {/* ==================================================
                BACK BUTTON
            ================================================== */}

            <button
              type="button"
              className="back-button"
              onClick={goToHome}
            >
              <span>
                ←
              </span>

              Back
            </button>

            {/* ==================================================
                LOGIN HEADER
            ================================================== */}

            <div className="login-header">

              {/* BRAND MARK */}

              <div className="login-brand-mark">
                AU
              </div>

              {/* HEADING */}

              <div className="login-heading">
                <span>
                  ADITYA UNIVERSITY
                </span>

                <h1>
                  Login to Continue
                </h1>

                <p>
                  Select your role and access your dashboard
                </p>
              </div>

            </div>

            {/* ==================================================
                LOGIN PANEL
            ================================================== */}

            <div className="login-panel">

              {/* =================================================
                  LEFT INFORMATION
              ================================================= */}

              <div className="login-info">

                <div className="login-info-number">
                  01
                </div>

                <h2>
                  Welcome Back
                </h2>

                <p>
                  Access the Student Internship Management
                  System using your university credentials.
                </p>

                <div className="login-info-divider"></div>

                <div className="login-security">
                  <span>
                    ✓
                  </span>

                  Secure University Access
                </div>

                <div className="login-security">
                  <span>
                    ✓
                  </span>

                  Role Based Dashboard
                </div>

              </div>

              {/* =================================================
                  RIGHT LOGIN CONTENT
              ================================================= */}

              <div className="login-content">

                {/* SECTION LABEL */}

                <div className="section-label">
                  SELECT YOUR ROLE
                </div>

                {/* =================================================
                    ROLE BUTTONS
                ================================================= */}

                <div className="role-buttons">

                  {/* STUDENT */}

                  <button
                    type="button"
                    className={`role-btn ${
                      selectedRole === "Student"
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      handleRoleChange("Student")
                    }
                  >
                    <span className="role-icon">
                      👨‍🎓
                    </span>

                    <span>
                      Student
                    </span>
                  </button>

                  {/* COORDINATOR */}

                  <button
                    type="button"
                    className={`role-btn ${
                      selectedRole === "Coordinator"
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      handleRoleChange("Coordinator")
                    }
                  >
                    <span className="role-icon">
                      👨‍🏫
                    </span>

                    <span>
                      Coordinator
                    </span>
                  </button>

                  {/* ADMIN */}

                  <button
                    type="button"
                    className={`role-btn ${
                      selectedRole === "Admin"
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      handleRoleChange("Admin")
                    }
                  >
                    <span className="role-icon">
                      🔐
                    </span>

                    <span>
                      Admin
                    </span>
                  </button>

                </div>

                {/* =================================================
                    LOGIN FORM
                ================================================== */}

                <div className="login-form">

                  {/* USERNAME */}

                  <div className="form-field">
                    <label>
                      Username
                    </label>

                    <input
                      type="text"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) =>
                        setUsername(
                          e.target.value
                        )
                      }
                    />
                  </div>

                  {/* PASSWORD */}

                  <div className="form-field">
                    <label>
                      Password
                    </label>

                    <input
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) =>
                        setPassword(
                          e.target.value
                        )
                      }
                    />
                  </div>

                  {/* FORGOT PASSWORD */}

                  <div className="form-footer">
                    <a
                      href="#"
                      className="forgot-link"
                      onClick={(e) =>
                        e.preventDefault()
                      }
                    >
                      Forgot Password?
                    </a>
                  </div>

                  {/* =================================================
                      AUTH BUTTONS
                  ================================================== */}

                  <div className="auth-buttons">

                    {/* LOGIN */}

                    <button
                      type="button"
                      className="login-btn"
                      onClick={handleLogin}
                    >
                      Login

                      <span>
                        →
                      </span>
                    </button>

                    {/* REGISTER */}

                    <Link
                      to={getRegistrationPath()}
                      state={{
                        fromLogin: true,
                        selectedRole:
                          selectedRole,
                      }}
                      className="register-link-btn"
                    >
                      Register
                    </Link>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}

export default Hero;