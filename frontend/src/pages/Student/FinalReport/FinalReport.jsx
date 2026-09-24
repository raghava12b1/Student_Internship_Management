import { useEffect, useState } from "react";

import DashboardLayout from "../../../layouts/DashboardLayout";
import BackButton from "../../../components/common/BackButton/BackButton";

import {
  apiFetch,
  getStudentDashboard,
} from "../../../services/api";

import "./FinalReport.css";

const FinalReport = () => {
  const [summary, setSummary] = useState("");
  const [skills, setSkills] = useState("");
  const [file, setFile] = useState(null);

  const [internshipId, setInternshipId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [loadingInternship, setLoadingInternship] =
    useState(true);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =========================================================
  // GET STUDENT INTERNSHIP
  // =========================================================

  useEffect(() => {
    const loadInternship = async () => {
      try {
        setLoadingInternship(true);
        setError("");

        const dashboard = await getStudentDashboard();

        console.log(
          "FINAL REPORT DASHBOARD:",
          dashboard
        );

        const id = dashboard?.internship?.id;

        if (!id) {
          setError(
            "No internship information found for your account."
          );
          return;
        }

        setInternshipId(id);

        console.log(
          "INTERNSHIP ID:",
          id
        );

      } catch (err) {
        console.error(
          "Failed to load internship:",
          err
        );

        setError(
          err.message ||
            "Unable to load internship information."
        );
      } finally {
        setLoadingInternship(false);
      }
    };

    loadInternship();
  }, []);

  // =========================================================
  // SUBMIT FINAL REPORT
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    // -----------------------------------------
    // CHECK INTERNSHIP
    // -----------------------------------------

    if (!internshipId) {
      setError(
        "Internship information is not available. Please refresh the page."
      );
      return;
    }

    // -----------------------------------------
    // VALIDATION
    // -----------------------------------------

    if (!summary.trim()) {
      setError(
        "Please enter your internship summary."
      );
      return;
    }

    if (!skills.trim()) {
      setError(
        "Please enter the skills you gained."
      );
      return;
    }

    if (!file) {
      setError(
        "Please upload your final report PDF."
      );
      return;
    }

    if (file.type !== "application/pdf") {
      setError(
        "Final report must be a PDF file."
      );
      return;
    }

    // -----------------------------------------
    // CREATE FORMDATA
    // -----------------------------------------

    const formData = new FormData();

    formData.append(
      "internship",
      internshipId
    );

    formData.append(
      "summary",
      summary.trim()
    );

    formData.append(
      "skills",
      skills.trim()
    );

    formData.append(
      "file",
      file
    );

    // -----------------------------------------
    // SUBMIT
    // -----------------------------------------

    try {
      setLoading(true);

      const response = await apiFetch(
        "/documents/final-report/",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response
        .json()
        .catch(() => ({}));

      console.log(
        "FINAL REPORT RESPONSE:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            data?.message ||
            "Failed to submit final report."
        );
      }

      // ---------------------------------------
      // SUCCESS
      // ---------------------------------------

      setMessage(
        "Final report submitted successfully."
      );

      setSummary("");
      setSkills("");
      setFile(null);

      const fileInput =
        document.getElementById(
          "final-report-file"
        );

      if (fileInput) {
        fileInput.value = "";
      }

    } catch (err) {
      console.error(
        "FINAL REPORT ERROR:",
        err
      );

      setError(
        err.message ||
          "Something went wrong while submitting the report."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loadingInternship) {
    return (
      <DashboardLayout>
        <BackButton />

        <div className="final-page">
          <h1>Final Internship Report</h1>

          <p>
            Loading internship information...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <DashboardLayout>
      <BackButton />

      <div className="final-page">

        <h1>
          Final Internship Report
        </h1>

        <p>
          Submit your final internship report
          for verification and evaluation.
        </p>

        <form
          className="final-card"
          onSubmit={handleSubmit}
        >

          {/* COMPANY NAME */}

          <div className="form-group">

            <label>
              Company Name
            </label>

            <input
              type="text"
              placeholder="Enter Company Name"
            />

          </div>


          {/* INTERNSHIP DURATION */}

          <div className="form-group">

            <label>
              Internship Duration
            </label>

            <input
              type="text"
              placeholder="Example: 15 May 2026 - 15 July 2026"
            />

          </div>


          {/* SUMMARY */}

          <div className="form-group">

            <label>
              Internship Summary
            </label>

            <textarea
              rows="6"
              placeholder="Briefly describe your internship experience..."
              value={summary}
              onChange={(e) =>
                setSummary(e.target.value)
              }
            />

          </div>


          {/* SKILLS */}

          <div className="form-group">

            <label>
              Skills Gained
            </label>

            <textarea
              rows="5"
              placeholder="React, Node.js, Communication, Teamwork..."
              value={skills}
              onChange={(e) =>
                setSkills(e.target.value)
              }
            />

          </div>


          {/* FILE */}

          <div className="form-group">

            <label>
              Upload Final Report (PDF)
            </label>

            <input
              id="final-report-file"
              type="file"
              accept="application/pdf"
              onChange={(e) =>
                setFile(e.target.files[0])
              }
            />

          </div>


          {/* ERROR */}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}


          {/* SUCCESS */}

          {message && (
            <div className="success-message">
              {message}
            </div>
          )}


          {/* SUBMIT */}

          <button
            type="submit"
            className="submit-btn"
            disabled={loading || !internshipId}
          >
            {loading
              ? "Submitting..."
              : "Submit Final Report"}
          </button>

        </form>

      </div>

    </DashboardLayout>
  );
};

export default FinalReport;