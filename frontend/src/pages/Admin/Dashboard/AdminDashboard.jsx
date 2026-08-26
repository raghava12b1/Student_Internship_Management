import DashboardLayout from "../../../layouts/DashboardLayout";
import "./AdminDashboard.css";
import { useNavigate } from "react-router-dom";

const stats = [
  {
    title: "Total Students",
    value: 248,
    color: "#2563eb",
    icon: "🎓",
  },
  {
    title: "Coordinators",
    value: 8,
    color: "#10b981",
    icon: "👨‍🏫",
  },
  {
    title: "HODs",
    value: 4,
    color: "#8b5cf6",
    icon: "🎓",
  },
  {
    title: "Companies",
    value: 42,
    color: "#f59e0b",
    icon: "🏢",
  },
  {
    title: "Completed Internships",
    value: 181,
    color: "#ef4444",
    icon: "🏆",
  },
];

const AdminDashboard = () => {

  const navigate = useNavigate();

  return (

    <DashboardLayout>

      <div className="coordinator-dashboard">

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
              onClick={() => navigate("/admin/students")}
            >
              🎓 Manage Students
            </button>

            <button
              onClick={() => navigate("/admin/coordinators")}
            >
              👨‍🏫 Manage Coordinators
            </button>

            <button
              onClick={() => navigate("/admin/hods")}
            >
              🎓 Manage HODs
            </button>

            <button
              onClick={() => navigate("/admin/companies")}
            >
              🏢 Manage Companies
            </button>

            <button
              onClick={() => navigate("/admin/reports")}
            >
              📊 View Reports
            </button>
            <button onClick={() => navigate("/admin/analytics")}>
              📈 Analytics
            </button>

            <button onClick={() => navigate("/admin/notifications")}>
              🔔 Notifications
            </button>

            <button onClick={() => navigate("/admin/profile")}>
              👤 Profile
            </button>

            <button onClick={() => navigate("/admin/settings")}>
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

              <tr>

                <td>Bala Krishna</td>

                <td>Registered for Internship</td>

                <td>Completed</td>

              </tr>

              <tr>

                <td>Rahul</td>

                <td>Submitted Final Report</td>

                <td>Pending</td>

              </tr>

              <tr>

                <td>Coordinator</td>

                <td>Approved Offer Letter</td>

                <td>Approved</td>

              </tr>

            </tbody>

          </table>

        </div>

      </div>

    </DashboardLayout>

  );
};

export default AdminDashboard;