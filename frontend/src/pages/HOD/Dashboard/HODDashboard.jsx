import DashboardLayout from "../../../layouts/DashboardLayout";
import "./HODDashboard.css";
import { useNavigate } from "react-router-dom";
import BackButton from "../../../components/common/BackButton/BackButton";
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
    title: "Pending Approvals",
    value: 15,
    color: "#f59e0b",
    icon: "📄",
  },
  {
    title: "Partner Companies",
    value: 42,
    color: "#ef4444",
    icon: "🏢",
  },
  {
    title: "Completed Internships",
    value: 181,
    color: "#8b5cf6",
    icon: "🏆",
  },
];

const HODDashboard = () => {

  const navigate = useNavigate();

  return (

    <DashboardLayout>
      <BackButton />

      <div className="coordinator-dashboard">

        {/* Welcome */}

        <div className="welcome-card">

          <div>

            <h1>Welcome Back 👋</h1>

            <p>Head of Department Dashboard</p>

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
              onClick={() => navigate("/hod/students")}
            >
              🎓 View Students
            </button>

            <button
              onClick={() => navigate("/hod/coordinators")}
            >
              👨‍🏫 Manage Coordinators
            </button>

            <button
              onClick={() => navigate("/hod/approvals")}
            >
              ✅ Review Approvals
            </button>

            <button
              onClick={() => navigate("/hod/reports")}
            >
              📊 Department Reports
            </button>

            <button
              onClick={() => navigate("/hod/analytics")}
            >
              📈 Analytics
            </button>

          </div>

        </div>

        {/* Recent Activities */}

        <div className="dashboard-section">

          <h2>Recent Department Activities</h2>

          <table>

            <thead>

              <tr>

                <th>Student</th>
                <th>Activity</th>
                <th>Status</th>

              </tr>

            </thead>

            <tbody>

              <tr>

                <td>Bala Krishna</td>
                <td>Final Report Submitted</td>
                <td>Pending</td>

              </tr>

              <tr>

                <td>Rahul</td>
                <td>Completion Certificate Approved</td>
                <td>Completed</td>

              </tr>

              <tr>

                <td>Anjali</td>
                <td>Offer Letter Uploaded</td>
                <td>Under Review</td>

              </tr>

            </tbody>

          </table>

        </div>

      </div>

    </DashboardLayout>

  );
};

export default HODDashboard;