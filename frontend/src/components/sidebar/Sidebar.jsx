import "./Sidebar.css";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import sidebarConfig from "../../config/sidebarConfig";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // ============================================================
  // ROLE DETECTION
  // ============================================================

  let role = "student";
  let portalName = "Student Portal";
  let loginRole = "Student";

  if (location.pathname.startsWith("/coordinator")) {
    role = "coordinator";
    portalName = "Coordinator Portal";
    loginRole = "Coordinator";
  } else if (location.pathname.startsWith("/admin")) {
    role = "admin";
    portalName = "Admin Portal";
    loginRole = "Admin";
  }

  const menus = sidebarConfig[role] || [];

  // ============================================================
  // CLOSE SIDEBAR
  // ============================================================

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // ============================================================
  // BACK TO LOGIN
  // ============================================================

  const handleBackToLogin = () => {
    // First close sidebar
    setSidebarOpen(false);

    // Clear authentication data
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("internshipId");

    // Go to Home page and directly open Login screen
    navigate("/", {
      replace: true,
      state: {
        showLogin: true,
        selectedRole: loginRole,
      },
    });
  };

  return (
    <aside
      className={`sidebar ${
        sidebarOpen ? "show-sidebar" : ""
      }`}
    >

      {/* ======================================================
          SIDEBAR HEADER
      ====================================================== */}

      <div className="sidebar-logo">
        <h2>{portalName}</h2>
      </div>


      {/* ======================================================
          MOBILE CLOSE BUTTON
      ====================================================== */}

      <button
        type="button"
        className="close-sidebar"
        onClick={closeSidebar}
        aria-label="Close sidebar"
      >
        ✕
      </button>


      {/* ======================================================
          NAVIGATION MENU
      ====================================================== */}

      <nav className="sidebar-menu">

        {menus.map((menu) => {
          const Icon = menu.icon;

          return (
            <NavLink
              key={menu.name}
              to={menu.path}
              onClick={closeSidebar}
              className={({ isActive }) =>
                isActive
                  ? "menu-item active"
                  : "menu-item"
              }
            >
              <Icon />

              <span>
                {menu.name}
              </span>
            </NavLink>
          );
        })}

      </nav>


      {/* ======================================================
          BACK TO LOGIN
      ====================================================== */}

      <div className="sidebar-bottom">

        <button
          type="button"
          className="back-login-btn"
          onClick={handleBackToLogin}
        >

          <span className="back-login-icon">
            ←
          </span>

          <span>
            Back to Login
          </span>

        </button>

      </div>

    </aside>
  );
};

export default Sidebar;