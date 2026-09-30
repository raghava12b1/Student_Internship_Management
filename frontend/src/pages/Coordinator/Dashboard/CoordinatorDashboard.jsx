import DashboardLayout from "../../../layouts/DashboardLayout";
import "./CoordinatorDashboard.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCoordinatorDashboard } from "../../../services/api";

const CoordinatorDashboard = () => {
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getCoordinatorDashboard();

        setDashboardData(data);
      } catch (err) {
        console.error("Coordinator dashboard error:", err);
        setError(err.message || "Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  /*
   * =====================================================
   * STATISTICS
   * =====================================================
   */

  const statistics = dashboardData?.statistics || {};

 const stats = [
  {
    title: "Internships",
    value: statistics.internships ?? 0,
    color: "#8b5cf6",
    icon: "🏆",
  },
  {
    title: "Total Documents",
    value: statistics.documents ?? 0,
    color: "#0891b2",
    icon: "📁",
  },
  {
    title: "Pending Documents",
    value: statistics.pending_documents ?? 0,
    color: "#f59e0b",
    icon: "⏳",
  },
  {
    title: "Approved Documents",
    value: statistics.approved_documents ?? 0,
    color: "#10b981",
    icon: "✅",
  },
  {
    title: "Rejected Documents",
    value: statistics.rejected_documents ?? 0,
    color: "#ef4444",
    icon: "❌",
  },
  {
    title: "Offer Letters",
    value: statistics.offer_letters ?? 0,
    color: "#0d9488",
    icon: "📃",
  },
  {
    title: "Final Reports",
    value: statistics.final_reports ?? 0,
    color: "#6366f1",
    icon: "📘",
  },
  {
    title: "Certificates",
    value: statistics.certificates ?? 0,
    color: "#9333ea",
    icon: "🏅",
  },
];

  /*
   * =====================================================
   * RECENT APPLICATIONS
   * =====================================================
   */

  const recentApplications =
    dashboardData?.recent_applications || [];

  return (
    <DashboardLayout>

      <div className="coordinator-dashboard">

        {/* =================================================
            WELCOME
        ================================================= */}

        <div className="welcome-card">

          <div>

            <h1>
              Welcome Back 👋
            </h1>

            <p>
              Internship Coordinator Dashboard
            </p>

          </div>

        </div>


        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (
          <div className="dashboard-section">
            <p>Loading dashboard data...</p>
          </div>
        )}


        {/* =================================================
            ERROR
        ================================================= */}

        {!loading && error && (
          <div className="dashboard-section">

            <p style={{ color: "#ef4444" }}>
              {error}
            </p>

          </div>
        )}


        {/* =================================================
            STATISTICS
        ================================================= */}

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

              <h2>
                {item.value}
              </h2>

              <p>
                {item.title}
              </p>

            </div>

          ))}

        </div>


        {/* =================================================
            QUICK ACTIONS
        ================================================= */}

        <div className="dashboard-section">

          <h2>
            Quick Actions
          </h2>

          <div className="quick-grid">

            <button
              onClick={() =>
                navigate("/coordinator/applications")
              }
            >
              📄 View Applications
            </button>


            <button
              onClick={() =>
                navigate("/coordinator/document/final")
              }
            >
              📚 Review Final Reports
            </button>


            <button
              onClick={() =>
                navigate("/coordinator/document/certificate")
              }
            >
              🏆 View Completion Certificates
            </button>


            <button
              onClick={() =>
                navigate("/coordinator/reports")
              }
            >
              📊 Generate Reports
            </button>

          </div>

        </div>


        {/* =================================================
            RECENT APPLICATIONS
        ================================================= */}

        <div className="dashboard-section">

          <h2>
            Recent Student Activities
          </h2>

          {recentApplications.length === 0 ? (

            <p>
              No recent applications found.
            </p>

          ) : (

            <table>

              <thead>

                <tr>

                  <th>
                    Student
                  </th>

                  <th>
                    Activity
                  </th>

                  <th>
                    Status
                  </th>

                </tr>

              </thead>

              <tbody>

                {recentApplications.map(
                  (application, index) => (

                    <tr
                      key={
                        application.id || index
                      }
                    >

                      <td>
                        {application.student_name ||
                          application.student ||
                          application.name ||
                          "--"}
                      </td>

                      <td>
                        {application.activity ||
                          application.application_type ||
                          application.title ||
                          "Application"}
                      </td>

                      <td>
                        {application.status || "--"}
                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          )}

        </div>

      </div>

    </DashboardLayout>
  );
};

export default CoordinatorDashboard;
