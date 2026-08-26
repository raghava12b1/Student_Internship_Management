import DashboardLayout from "../../../layouts/DashboardLayout";
import "./AdminAnalytics.css";
import BackButton from "../../../components/common/BackButton/BackButton";
const stats = [
  {
    title: "Total Students",
    value: 248,
    icon: "🎓",
    color: "#2563eb",
  },
  {
    title: "Companies",
    value: 42,
    icon: "🏢",
    color: "#10b981",
  },
  {
    title: "Active Internships",
    value: 95,
    icon: "📄",
    color: "#f59e0b",
  },
  {
    title: "Completed",
    value: 181,
    icon: "🏆",
    color: "#8b5cf6",
  },
];

const departmentStats = [
  { department: "CSE", students: 80 },
  { department: "ECE", students: 55 },
  { department: "IT", students: 48 },
  { department: "AI & DS", students: 65 },
];

const AdminAnalytics = () => {
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