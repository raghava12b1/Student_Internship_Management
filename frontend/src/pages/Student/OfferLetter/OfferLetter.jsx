import DashboardLayout from "../../../layouts/DashboardLayout";
import "./OfferLetter.css";
import BackButton from "../../../components/common/BackButton/BackButton";

const OfferLetter = () => {
  return (
    <DashboardLayout>
       <BackButton />
      <div className="offer-page">

        <h1>Upload Offer Letter</h1>

        <p>
          Submit your internship details and upload the official offer letter
          issued by the company.
        </p>

        <div className="offer-card">

          <label>Company Name</label>
          <input
            type="text"
            placeholder="Enter Company Name"
          />

          <label>Internship Role</label>
          <input
            type="text"
            placeholder="Enter Internship Role"
          />

          <label>Company Address</label>
          <textarea
            rows="3"
            placeholder="Enter Company Address"
          />

          <label>Internship Type</label>

          <select>
            <option>Select Internship Type</option>
            <option>Online</option>
            <option>Offline</option>
            <option>Hybrid</option>
          </select>

          <div className="date-row">

            <div>
              <label>Start Date</label>
              <input type="date" />
            </div>

            <div>
              <label>End Date</label>
              <input type="date" />
            </div>

          </div>

          <label>Stipend (Optional)</label>
          <input
            type="number"
            placeholder="Enter Monthly Stipend"
          />

          <label>HR Name (Optional)</label>
          <input
            type="text"
            placeholder="Enter HR Name"
          />

          <label>HR Email (Optional)</label>
          <input
            type="email"
            placeholder="Enter HR Email"
          />

          <label>HR Phone (Optional)</label>
          <input
            type="tel"
            placeholder="Enter HR Phone Number"
          />

          <label>Upload Offer Letter (PDF)</label>
          <input type="file" accept=".pdf" />

          <button>
            Upload Offer Letter
          </button>

        </div>

      </div>
    </DashboardLayout>
  );
};

export default OfferLetter;