import DashboardLayout from "../../../layouts/DashboardLayout";
import "./FinalReport.css";
import BackButton from "../../../components/common/BackButton/BackButton";

const FinalReport = () => {
  return (
    <DashboardLayout>
         <BackButton />
      <div className="final-page">

        <h1>Final Internship Report</h1>

        <p>
          Submit your final internship report for verification and evaluation.
        </p>

        <div className="final-card">

          <div className="form-group">

            <label>Company Name</label>

            <input
              type="text"
              placeholder="Enter Company Name"
            />

          </div>

          <div className="form-group">

            <label>Internship Duration</label>

            <input
              type="text"
              placeholder="Example: 15 May 2026 - 15 July 2026"
            />

          </div>

          <div className="form-group">

            <label>Internship Summary</label>

            <textarea
              rows="6"
              placeholder="Briefly describe your internship experience..."
            />

          </div>

          <div className="form-group">

            <label>Skills Gained</label>

            <textarea
              rows="5"
              placeholder="React, Node.js, Communication, Teamwork..."
            />

          </div>

          <div className="form-group">

            <label>Upload Final Report (PDF)</label>

            <input type="file" />

          </div>

          <button className="submit-btn">
            Submit Final Report
          </button>

        </div>

      </div>

    </DashboardLayout>
  );
};

export default FinalReport;