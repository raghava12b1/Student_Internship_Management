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

  /*
   * =====================================================
   * CURRENT USER
   * =====================================================
   *
   * Later Django will provide this information.
   *
   * Expected format:
   *
   * {
   *   name: "Actual Database Name",
   *   role: "Internship Coordinator"
   * }
   *
   */

  let currentUser = null;

  try {
    const storedUser = localStorage.getItem("currentUser");

    if (storedUser) {
      currentUser = JSON.parse(storedUser);
    }
  } catch (error) {
    console.error("Unable to read current user:", error);
  }

  /*
   * Temporary fallback for the current frontend.
   *
   * Once Django login is connected,
   * currentUser will come from the backend.
   */

  let userName = currentUser?.name || currentUser?.full_name;

  let role = currentUser?.role;

  /*
   * Backward compatibility with our old frontend
   */

  if (!userName) {
    userName = localStorage.getItem("userName");
  }

  if (!role) {
    role = localStorage.getItem("userRole");
  }

  /*
   * Detect role from URL if no user data exists.
   */

  if (!role) {
    if (location.pathname.startsWith("/coordinator")) {
      role = "Internship Coordinator";
    } else if (location.pathname.startsWith("/hod")) {
      role = "Head of Department";
    } else if (location.pathname.startsWith("/admin")) {
      role = "Administrator";
    } else {
      role = "Student";
    }
  }

  /*
   * Do NOT hardcode Bala anymore.
   */

  if (!userName) {
    userName = "User";
  }

  /*
   * =====================================================
   * ROLE PATH
   * =====================================================
   */

  const rolePath =
    role === "Student"
      ? "student"
      : role === "Internship Coordinator"
      ? "coordinator"
      : role === "Head of Department"
      ? "hod"
      : "admin";

  /*
   * =====================================================
   * LOGOUT
   * =====================================================
   */

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  /*
   * =====================================================
   * PAGE TITLES
   * =====================================================
   */

  const pageTitles = {
    "/student/dashboard": "Dashboard",
    "/student/offer-letter": "Offer Letter",
    "/student/weekly-report": "Weekly Report",
    "/student/final-report": "Final Report",
    "/student/certificate": "Completion Certificate",
    "/student/progress": "Progress",
    "/student/profile": "My Profile",
    "/student/settings": "Settings",

    "/coordinator/dashboard": "Dashboard",
    "/coordinator/students": "Students",
    "/coordinator/document/offer": "Offer Verification",
    "/coordinator/document/weekly": "Weekly Documents",
    "/coordinator/document/final": "Final Documents",
    "/coordinator/document/certificate": "Certificate Documents",
    "/coordinator/reports": "Reports",
    "/coordinator/notifications": "Notifications",
    "/coordinator/profile": "My Profile",
    "/coordinator/settings": "Settings",

    "/hod/dashboard": "Dashboard",
    "/hod/students": "Students",
    "/hod/coordinators": "Coordinators",
    "/hod/approvals": "Approvals",
    "/hod/reports": "Reports",
    "/hod/analytics": "Analytics",
    "/hod/notifications": "Notifications",
    "/hod/profile": "My Profile",
    "/hod/settings": "Settings",

    "/admin/dashboard": "Dashboard",
    "/admin/students": "Students",
    "/admin/coordinators": "Coordinators",
    "/admin/hods": "HODs",
    "/admin/companies": "Companies",
    "/admin/internships": "Internship Management",
    "/admin/reports": "Reports",
    "/admin/analytics": "Analytics",
    "/admin/notifications": "Notifications",
    "/admin/profile": "My Profile",
    "/admin/settings": "Settings",
  };

  const pageTitle =
    pageTitles[location.pathname] || "Dashboard";

  /*
   * =====================================================
   * UI
   * =====================================================
   */

  return (
    <header className="topbar">

      {/* LEFT SIDE */}

      <div className="topbar-left">

        <button
          className="menu-toggle"
          onClick={() => setSidebarOpen(true)}
        >
          <FiMenu />
        </button>

        <h2>{pageTitle}</h2>

      </div>

      {/* RIGHT SIDE */}

      <div className="topbar-right">

        {/* Notifications */}

        <div className="notification-wrapper">

          <button
            className="notification-btn"
            onClick={() =>
              setShowNotifications(!showNotifications)
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
              setShowProfile(!showProfile)
            }
          >

            <FaUserCircle className="profile-icon" />

            <div>

              <h4>{userName}</h4>

              <p>{role}</p>

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