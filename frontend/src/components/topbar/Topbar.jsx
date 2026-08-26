import "./Topbar.css";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { IoNotificationsOutline } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";

import LogoutModal from "../common/LogoutModal/LogoutModal";
import NotificationDropdown from "../common/NotificationDropdown/NotificationDropdown";
import ProfileDropdown from "../common/ProfileDropdown/ProfileDropdown";

const Topbar = ({ setSidebarOpen }) => {

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const location = useLocation();

  // =====================================================
  // CURRENT USER
  // =====================================================

  let currentUser = null;

  try {
    const storedUser = localStorage.getItem("currentUser");

    if (storedUser) {
      currentUser = JSON.parse(storedUser);
    }
  } catch (error) {
    console.error(
      "Unable to read current user:",
      error
    );
  }

  // =====================================================
  // USER NAME & ROLE
  // =====================================================

  let userName =
    currentUser?.name ||
    currentUser?.full_name;

  let role =
    currentUser?.role;

  // Backward compatibility
  if (!userName) {
    userName =
      localStorage.getItem("userName");
  }

  if (!role) {
    role =
      localStorage.getItem("userRole");
  }

  // =====================================================
  // ROLE DETECTION
  // =====================================================

  if (!role) {

    if (
      location.pathname.startsWith("/coordinator")
    ) {
      role = "Internship Coordinator";

    } else if (
      location.pathname.startsWith("/admin")
    ) {
      role = "Administrator";

    } else {
      role = "Student";
    }
  }

  // Don't hardcode student name
  if (!userName) {
    userName = "User";
  }

  // =====================================================
  // ROLE PATH
  // =====================================================

  const rolePath =
    role === "Student"
      ? "student"
      : role === "Internship Coordinator"
      ? "coordinator"
      : "admin";

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  // =====================================================
  // PAGE TITLES
  // =====================================================

  const pageTitles = {

    // -----------------------------------------------------
    // STUDENT
    // -----------------------------------------------------

    "/student/dashboard":
      "Dashboard",

    "/student/offer-letter":
      "Offer Letter",

    "/student/final-report":
      "Final Report",

    "/student/certificate":
      "Completion Certificate",

    "/student/progress":
      "Progress",

    "/student/profile":
      "My Profile",

    "/student/settings":
      "Settings",

    // -----------------------------------------------------
    // COORDINATOR
    // -----------------------------------------------------

    "/coordinator/dashboard":
      "Dashboard",

    "/coordinator/students":
      "Students",

    "/coordinator/document/offer":
      "Offer Verification",

    "/coordinator/document/weekly":
      "Weekly Documents",

    "/coordinator/document/final":
      "Final Documents",

    "/coordinator/document/certificate":
      "Certificate Documents",

    "/coordinator/reports":
      "Reports",

    "/coordinator/notifications":
      "Notifications",

    "/coordinator/profile":
      "My Profile",

    "/coordinator/settings":
      "Settings",

    // -----------------------------------------------------
    // ADMIN
    // -----------------------------------------------------

    "/admin/dashboard":
      "Dashboard",

    "/admin/students":
      "Students",

    "/admin/coordinators":
      "Coordinators",

    "/admin/companies":
      "Companies",

    "/admin/internships":
      "Internship Management",

    "/admin/reports":
      "Reports",

    "/admin/analytics":
      "Analytics",

    "/admin/notifications":
      "Notifications",

    "/admin/profile":
      "My Profile",

    "/admin/settings":
      "Settings",
  };

  const pageTitle =
    pageTitles[location.pathname] ||
    "Dashboard";

  // =====================================================
  // UI
  // =====================================================

  return (
    <header className="topbar">

      {/* LEFT SIDE */}

      <div className="topbar-left">

        <button
          className="menu-toggle"
          onClick={() =>
            setSidebarOpen(true)
          }
        >
          <FiMenu />
        </button>

        <h2>
          {pageTitle}
        </h2>

      </div>

      {/* RIGHT SIDE */}

      <div className="topbar-right">

        {/* Notifications */}

        <div className="notification-wrapper">

          <button
            className="notification-btn"
            onClick={() =>
              setShowNotifications(
                !showNotifications
              )
            }
          >

            <IoNotificationsOutline />

            <span className="notification-badge">
              3
            </span>

          </button>

          {showNotifications && (
            <NotificationDropdown />
          )}

        </div>

        {/* Profile */}

        <div className="profile-wrapper">

          <div
            className="profile"
            onClick={() =>
              setShowProfile(
                !showProfile
              )
            }
          >

            <FaUserCircle
              className="profile-icon"
            />

            <div>

              <h4>
                {userName}
              </h4>

              <p>
                {role}
              </p>

            </div>

          </div>

          {showProfile && (
            <ProfileDropdown
              role={rolePath}
              onLogout={handleLogout}
            />
          )}

        </div>

      </div>

      {/* Logout Modal */}

      {showLogoutModal && (
        <LogoutModal
          onClose={() =>
            setShowLogoutModal(false)
          }
        />
      )}

    </header>
  );
};

export default Topbar;