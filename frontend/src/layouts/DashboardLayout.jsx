import "./DashboardLayout.css";
import { useState } from "react";

import Sidebar from "../components/sidebar/Sidebar";
import Topbar from "../components/topbar/Topbar";

const DashboardLayout = ({ children }) => {

  const [sidebarOpen, setSidebarOpen] = useState(false);

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