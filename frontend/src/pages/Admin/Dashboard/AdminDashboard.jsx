import DashboardLayout from "../../../layouts/DashboardLayout";
import "./AdminDashboard.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAdminDashboard } from "../../../services/api";

const AdminDashboard = () => {

  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getAdminDashboard()
      .then(setDashboardData)
      .catch((err) => setError(err.message || "Unable to load dashboard data."));
  }, []);

  const statistics = dashboardData?.statistics || {};
  const stats = [
    { title: "Total Students", value: statistics.students ?? 0, color: "#2563eb", icon: "🎓" },
    { title: "Applications", value: statistics.applications ?? 0, color: "#10b981", icon: "📄" },
    { title: "Internships", value: statistics.internships ?? 0, color: "#f59e0b", icon: "🏢" },
    { title: "Pending Applications", value: statistics.pending_applications ?? 0, color: "#ef4444", icon: "🏆" },
  ];

  return (

    <DashboardLayout>

      <div className="coordinator-dashboard">

        {error && <p style={{ color: "#ef4444" }}>{error}</p>}

        {/* Welcome */}

        <div className="welcome-card">

          <div>

            <h1>Welcome Back 👋</h1>

            <p>Administrator Dashboard</p>

          </div>

        </div>


        {/* Statistics */}

        <div className="stats-grid">

          {stats.map((item, index) => (

            <div
              className="stat-card"
              key={index}
            >

              <div
                className="icon-box"
                style={{
                  background: item.color,
                }}
              >
                {item.icon}
              </div>

              <h2>{item.value}</h2>

              <p>{item.title}</p>

            </div>

          ))}

        </div>


        {/* Quick Actions */}

        <div className="dashboard-section">

          <h2>Quick Actions</h2>

          <div className="quick-grid">

            <button
              onClick={() =>
                navigate("/admin/students")
              }
            >
              🎓 Manage Students
            </button>


            <button
              onClick={() =>
                navigate("/admin/coordinators")
              }
            >
              👨‍🏫 Manage Coordinators
            </button>


            <button
              onClick={() =>
                navigate("/admin/companies")
              }
            >
              🏢 Manage Companies
            </button>


            <button
              onClick={() =>
                navigate("/admin/reports")
              }
            >
              📊 View Reports
            </button>


            <button
              onClick={() =>
                navigate("/admin/analytics")
              }
            >
              📈 Analytics
            </button>


            <button
              onClick={() =>
                navigate("/admin/notifications")
              }
            >
              🔔 Notifications
            </button>


            <button
              onClick={() =>
                navigate("/admin/profile")
              }
            >
              👤 Profile
            </button>


            <button
              onClick={() =>
                navigate("/admin/settings")
              }
            >
              ⚙️ Settings
            </button>

          </div>

        </div>


        {/* Recent Activities */}

        <div className="dashboard-section">

          <h2>Recent Activities</h2>

          <table>

            <thead>

              <tr>

                <th>User</th>
                <th>Activity</th>
                <th>Status</th>

              </tr>

            </thead>


            <tbody>

              {(dashboardData?.recent_applications || []).map((application) => (
                <tr key={application.id}>
                  <td>{application.company_name || "Student"}</td>
                  <td>{application.role || "Internship application"}</td>
                  <td>{application.status || "Pending"}</td>
                </tr>
              ))}

              {!dashboardData?.recent_applications?.length && (
                <tr>
                  <td colSpan="3">No recent activities.</td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

      </div>

    </DashboardLayout>

  );
};

export default AdminDashboard;