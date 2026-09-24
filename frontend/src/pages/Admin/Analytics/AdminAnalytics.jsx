import DashboardLayout from "../../../layouts/DashboardLayout";
import "./AdminAnalytics.css";
import BackButton from "../../../components/common/BackButton/BackButton";
import { useEffect, useState } from "react";
import { getAdminDashboard, getStudents } from "../../../services/api";

const AdminAnalytics = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [departmentStats, setDepartmentStats] = useState([]);

  useEffect(() => {
    getAdminDashboard().then(setDashboardData).catch(() => {});
    getStudents().then((students) => {
      const counts = students.reduce((result, student) => {
        const department = student.department || "Unknown";
        result[department] = (result[department] || 0) + 1;
        return result;
      }, {});
      setDepartmentStats(
        Object.entries(counts).map(([department, students]) => ({ department, students }))
      );
    }).catch(() => {});
  }, []);

  const statistics = dashboardData?.statistics || {};
  const stats = [
    { title: "Total Students", value: statistics.students ?? 0, icon: "🎓", color: "#2563eb" },
    { title: "Applications", value: statistics.applications ?? 0, icon: "🏢", color: "#10b981" },
    { title: "Internships", value: statistics.internships ?? 0, icon: "📄", color: "#f59e0b" },
    { title: "Pending Applications", value: statistics.pending_applications ?? 0, icon: "🏆", color: "#8b5cf6" },
  ];

  return (
    <DashboardLayout>
       <BackButton />

      <div className="admin-analytics">

        <div className="page-header">

          <h1>Analytics Dashboard</h1>

          <p>System statistics and internship insights.</p>

        </div>

        <div className="stats-grid">

          {stats.map((item, index) => (

            <div className="stat-card" key={index}>

              <div
                className="stat-icon"
                style={{ background: item.color }}
              >
                {item.icon}
              </div>

              <h2>{item.value}</h2>

              <p>{item.title}</p>

            </div>

          ))}

        </div>

        <div className="table-card">

          <h2>Department Statistics</h2>

          <table>

            <thead>

              <tr>

                <th>Department</th>
                <th>Total Students</th>

              </tr>

            </thead>

            <tbody>

              {departmentStats.map((dept, index) => (

                <tr key={index}>

                  <td>{dept.department}</td>

                  <td>{dept.students}</td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </DashboardLayout>
  );
};

export default AdminAnalytics;