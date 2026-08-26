import DashboardLayout from "../../../layouts/DashboardLayout";
import "./HODAnalytics.css";
import BackButton from "../../../components/common/BackButton/BackButton";
const analytics = [
  {
    title: "Total Students",
    value: 248,
    icon: "🎓",
    color: "#2563eb",
  },
  {
    title: "Completed Internships",
    value: 181,
    icon: "🏆",
    color: "#16a34a",
  },
  {
    title: "Pending Internships",
    value: 67,
    icon: "📄",
    color: "#f59e0b",
  },
  {
    title: "Partner Companies",
    value: 42,
    icon: "🏢",
    color: "#dc2626",
  },
];

const companies = [
  {
    company: "Infosys",
    students: 52,
  },
  {
    company: "TCS",
    students: 48,
  },
  {
    company: "Wipro",
    students: 35,
  },
  {
    company: "Accenture",
    students: 28,
  },
  {
    company: "Cognizant",
    students: 20,
  },
];

const HODAnalytics = () => {
  return (
    <DashboardLayout>
       <BackButton />

      <div className="hod-analytics">

        <div className="page-header">

          <h1>Department Analytics</h1>

          <p>
            Internship statistics and department insights.
          </p>

        </div>

        {/* Analytics Cards */}

        <div className="analytics-grid">

          {analytics.map((item, index) => (

            <div
              className="analytics-card"
              key={index}
            >

              <div
                className="analytics-icon"
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

        {/* Company Statistics */}

        <div className="company-card">

          <h2>Company-wise Internship Distribution</h2>

          <table>

            <thead>

              <tr>

                <th>Company</th>

                <th>Students</th>

              </tr>

            </thead>

            <tbody>

              {companies.map((company, index) => (

                <tr key={index}>

                  <td>{company.company}</td>

                  <td>{company.students}</td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {/* Progress */}

        <div className="summary-card">

          <h2>Overall Internship Progress</h2>

          <div className="progress-bar">

            <div
              className="progress-fill"
              style={{
                width: "73%",
              }}
            ></div>

          </div>

          <p>
            73% of students have successfully completed their internships.
          </p>

        </div>

      </div>

    </DashboardLayout>
  );
};

export default HODAnalytics;