import { useEffect, useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import "./Certificate.css";
import BackButton from "../../../components/common/BackButton/BackButton";
import { apiFetch, getStudentDashboard } from "../../../services/api";

const Certificate = () => {
  const [internshipId, setInternshipId] = useState(null);
  const [internship, setInternship] = useState(null);
  
  const [certNumber, setCertNumber] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [file, setFile] = useState(null);

  const [loadingInternship, setLoadingInternship] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadInternship = async () => {
      try {
        setLoadingInternship(true);
        setError("");

        const dashboard = await getStudentDashboard();
        const id = dashboard?.internship?.id;

        if (!id) {
          setError("No internship information found for your account.");
          return;
        }

        setInternshipId(id);
        setInternship(dashboard.internship);
      } catch (err) {
        console.error("Failed to load internship:", err);
        setError(err.message || "Unable to load internship information.");
      } finally {
        setLoadingInternship(false);
      }
    };
    loadInternship();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!internshipId) {
      setError("Internship information is not available. Please refresh the page.");
      return;
    }

    if (!certNumber.trim()) {
      setError("Please enter the Certificate Number.");
      return;
    }

    if (!issueDate) {
      setError("Please enter the Completion Date.");
      return;
    }

    if (!file) {
      setError("Please upload your certificate PDF.");
      return;
    }

    const formData = new FormData();
    formData.append("internship", internshipId);
    formData.append("certificate_number", certNumber.trim());
    formData.append("issue_date", issueDate);
    formData.append("certificate_file", file);

    try {
      setLoading(true);

      const response = await apiFetch("/certificates/upload/", {
        method: "POST",
        body: formData,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
  let errorMessage = data?.detail || data?.message;

  if (!errorMessage && typeof data === "object") {
    errorMessage = Object.entries(data)
      .map(([field, errors]) => {
        const message = Array.isArray(errors)
          ? errors.join(", ")
          : String(errors);

        return `${field}: ${message}`;
      })
      .join(" | ");
  }

  throw new Error(
    errorMessage || "Failed to submit certificate."
  );
}

      setMessage("Certificate submitted successfully.");
      setCertNumber("");
      setIssueDate("");
      setFile(null);
      
      const fileInput = document.getElementById("certificate-file");
      if (fileInput) fileInput.value = "";
      
    } catch (err) {
      console.error("CERTIFICATE ERROR:", err);
      setError(err.message || "Something went wrong while submitting the certificate.");
    } finally {
      setLoading(false);
    }
  };

  if (loadingInternship) {
    return (
      <DashboardLayout>
        <BackButton />
        <div className="certificate-page">
          <h1>Internship Completion Certificate</h1>
          <p>Loading internship information...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
       <BackButton />

      <div className="certificate-page">

        <h1>Internship Completion Certificate</h1>

        <p>
          Upload your internship completion certificate issued by the company.
        </p>

        {error && <div className="error-message" style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
        {message && <div className="success-message" style={{color: 'green', marginBottom: '10px'}}>{message}</div>}

        <form className="certificate-card" onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Company Name</label>
            <input
              type="text"
              value={internship?.company_name || ""}
              disabled
              readOnly
            />
          </div>

          <div className="form-group">
            <label>Certificate Number</label>
            <input
              type="text"
              placeholder="Enter Certificate Number"
              value={certNumber}
              onChange={(e) => setCertNumber(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Completion Date</label>
            <input 
              type="date" 
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Upload Certificate (PDF)</label>
            <input 
              id="certificate-file"
              type="file" 
              accept=".pdf"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>

          <button className="submit-btn" type="submit" disabled={loading}>
            {loading ? "Uploading..." : "Upload Certificate"}
          </button>

        </form>

      </div>

    </DashboardLayout>
  );
};

export default Certificate;