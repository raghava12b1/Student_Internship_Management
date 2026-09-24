import "./DashboardLayout.css";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Sidebar from "../components/sidebar/Sidebar";
import Topbar from "../components/topbar/Topbar";

const DashboardLayout = ({ children }) => {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const role = localStorage.getItem("userRole");

    if (!accessToken) {
      navigate("/", {
        replace: true,
        state: { showLogin: true },
      });
      return;
    }

    const requiredRole = location.pathname.startsWith("/admin")
      ? "Administrator"
      : location.pathname.startsWith("/coordinator")
      ? "Internship Coordinator"
      : "Student";

    if (role && role !== requiredRole) {
      const dashboardPath = role === "Administrator"
        ? "/admin/dashboard"
        : role === "Internship Coordinator"
        ? "/coordinator/dashboard"
        : "/student/dashboard";
      navigate(dashboardPath, { replace: true });
    }
  }, [location.pathname, navigate]);

  if (!localStorage.getItem("accessToken")) {
    return null;
  }

  return (
    <div className="dashboard-layout">

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="dashboard-content">

        <Topbar
          setSidebarOpen={setSidebarOpen}
        />

        {children}

      </main>

    </div>
  );
};

export default DashboardLayout;