import DashboardLayout from "../../../layouts/DashboardLayout";
import "./WeeklyReport.css";
import BackButton from "../../../components/common/BackButton/BackButton";
const WeeklyReport = () => {
  return (
    <DashboardLayout>
      <div className="weekly-page">
         <BackButton />

        <h1>Weekly Internship Report</h1>

        <p>
          Submit your weekly internship progress for faculty review.
        </p>

        <div className="weekly-card">

          <div className="form-group">
            <label>Week Number</label>

            <select>
              <option>Select Week</option>
              <option>Week 1</option>
              <option>Week 2</option>
              <option>Week 3</option>
              <option>Week 4</option>
              <option>Week 5</option>
              <option>Week 6</option>
              <option>Week 7</option>
              <option>Week 8</option>
            </select>
          </div>

          <div className="form-group">
            <label>Report Title</label>

            <input
              type="text"
              placeholder="Example: Frontend Development Progress"
            />
          </div>

          <div className="form-group">
            <label>Work Completed</label>

            <textarea
              rows="5"
              placeholder="Describe the work completed during this week..."
            />
          </div>

          <div className="form-group">
            <label>Challenges Faced</label>

            <textarea
              rows="4"
              placeholder="Mention any technical or project challenges..."
            />
          </div>

          <div className="form-group">
            <label>Learning Outcomes</label>

            <textarea
              rows="4"
              placeholder="What did you learn this week?"
            />
          </div>

          <div className="form-group">
            <label>Upload Weekly Report (PDF)</label>

            <input type="file" />
          </div>

          <button className="submit-btn">
            Submit Weekly Report
          </button>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default WeeklyReport;