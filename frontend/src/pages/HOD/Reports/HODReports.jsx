import DashboardLayout from "../../../layouts/DashboardLayout";
import "./HODReports.css";
import BackButton from "../../../components/common/BackButton/BackButton";
const reports = [
  {
    id: 1,
    title: "Internship Summary Report",
    generatedOn: "25 Jul 2026",
    totalStudents: 248,
    completed: 181,
    pending: 67,
  },
  {
    id: 2,
    title: "Company Wise Internship Report",
    generatedOn: "24 Jul 2026",
    totalStudents: 248,
    completed: 181,
    pending: 67,
  },
  {
    id: 3,
    title: "Department Performance Report",
    generatedOn: "23 Jul 2026",
    totalStudents: 248,
    completed: 181,
    pending: 67,
  },
];

const HODReports = () => {
  return (
    <DashboardLayout>
       <BackButton />

      <div className="hod-reports">

        <div className="page-header">

          <h1>Department Reports</h1>

          <p>
            View and download internship reports for your department.
          </p>

        </div>

        <div className="report-grid">

          {reports.map((report) => (

            <div
              className="report-card"
              key={report.id}
            >

              <div className="report-icon">
                📊
              </div>

              <h2>{report.title}</h2>

              <p>
                Generated : {report.generatedOn}
              </p>

              <div className="report-stats">

                <div>
                  <span>Total</span>
                  <h3>{report.totalStudents}</h3>
                </div>

                <div>
                  <span>Completed</span>
                  <h3>{report.completed}</h3>
                </div>

                <div>
                  <span>Pending</span>
                  <h3>{report.pending}</h3>
                </div>

              </div>

              <button>
                📥 Download Report
              </button>

            </div>

          ))}

        </div>

      </div>

    </DashboardLayout>
  );
};

export default HODReports;