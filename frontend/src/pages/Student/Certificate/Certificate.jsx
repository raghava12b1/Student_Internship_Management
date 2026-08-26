import DashboardLayout from "../../../layouts/DashboardLayout";
import "./Certificate.css";
import BackButton from "../../../components/common/BackButton/BackButton";
const Certificate = () => {
  return (
    <DashboardLayout>
       <BackButton />

      <div className="certificate-page">

        <h1>Internship Completion Certificate</h1>

        <p>
          Upload your internship completion certificate issued by the company.
        </p>

        <div className="certificate-card">

          <div className="form-group">
            <label>Company Name</label>

            <input
              type="text"
              placeholder="Enter Company Name"
            />
          </div>

          <div className="form-group">
            <label>Certificate Number (Optional)</label>

            <input
              type="text"
              placeholder="Enter Certificate Number"
            />
          </div>

          <div className="form-group">
            <label>Completion Date</label>

            <input type="date" />
          </div>

          <div className="form-group">
            <label>Upload Certificate (PDF)</label>

            <input type="file" />
          </div>

          <button className="submit-btn">
            Upload Certificate
          </button>

        </div>

      </div>

    </DashboardLayout>
  );
};

export default Certificate;