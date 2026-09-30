
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { apiFetch } from "../../../services/api";
import "./StudentApplications.css";

const initialForm = {
  company_name: "",
  role: "",
  location: "",
  company_url: "",
  start_date: "",
  end_date: "",
  mode: "",
  description: "",
};

const StudentApplications = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingApplications, setLoadingApplications] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchApplications = async () => {
    setLoadingApplications(true);

    try {
      const response = await apiFetch("/applications/", {
        method: "GET",
      });

      const data = await response.json().catch(() => []);

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to load applications."
        );
      }

      setApplications(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      setError(err.message || "Unable to load applications.");
    } finally {
      setLoadingApplications(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await apiFetch("/applications/", {
        method: "POST",
        body: JSON.stringify(form),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const details = Object.entries(data)
          .map(([field, errors]) =>
            `${field}: ${
              Array.isArray(errors) ? errors.join(", ") : errors
            }`
          )
          .join("\n");

        throw new Error(
          data.detail || details || "Application submission failed."
        );
      }

      setMessage("Application submitted successfully!");
      setForm(initialForm);
      await fetchApplications();
    } catch (err) {
      setError(err.message || "Unable to submit application.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toUpperCase()) {
      case "APPROVED":
        return "approved";
      case "REJECTED":
        return "rejected";
      default:
        return "pending";
    }
  };

  return (
    <DashboardLayout>
      <div className="student-application-page">
        <div className="application-heading">
          <h1>Apply for Internship</h1>
          <p>Fill in the details below to submit your application.</p>
        </div>

        <form className="application-form" onSubmit={handleSubmit}>
          <div className="application-form-grid">
            <label>
              Company Name *
              <input
                name="company_name"
                value={form.company_name}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Internship Role *
              <input
                name="role"
                value={form.role}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Location *
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Company Website
              <input
                type="url"
                name="company_url"
                value={form.company_url}
                onChange={handleChange}
                placeholder="https://example.com"
              />
            </label>

            <label>
              Start Date *
              <input
                type="date"
                name="start_date"
                value={form.start_date}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              End Date *
              <input
                type="date"
                name="end_date"
                value={form.end_date}
                onChange={handleChange}
                min={form.start_date || undefined}
                required
              />
            </label>

            <label>
              Internship Mode *
              <select
                name="mode"
                value={form.mode}
                onChange={handleChange}
                required
              >
                <option value="">Select mode</option>
                <option value="ONLINE">Online</option>
                <option value="OFFLINE">Offline</option>
                <option value="HYBRID">Hybrid</option>
              </select>
            </label>
          </div>

          <label className="application-description">
            Internship Description *
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={5}
              required
            />
          </label>

          {message && (
            <p className="application-success">{message}</p>
          )}

          {error && (
            <p className="application-error">{error}</p>
          )}

          <div className="application-buttons">
            <button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit Application"}
            </button>

            <button
              type="button"
              className="application-cancel"
              onClick={() => navigate("/student/dashboard")}
            >
              Back to Dashboard
            </button>
          </div>
        </form>

        <section className="application-history">
          <h2>My Applications</h2>
          <p>Track the status of your internship applications.</p>

          {loadingApplications ? (
            <p>Loading applications...</p>
          ) : applications.length === 0 ? (
            <p>No applications submitted yet.</p>
          ) : (
            <div className="application-list">
              {applications.map((application) => (
                <div
                  className="application-item"
                  key={application.id}
                >
                  <div>
                    <h3>{application.company_name}</h3>
                    <p>{application.role}</p>
                    <p>{application.location}</p>
                    <small>
                      Applied on:{" "}
                      {application.applied_at
                        ? new Date(
                            application.applied_at
                          ).toLocaleDateString()
                        : "--"}
                    </small>
                  </div>

                  <span
                    className={`application-status ${getStatusClass(
                      application.status
                    )}`}
                  >
                    {application.status || "PENDING"}
                  </span>

                  {application.remarks && (
                    <p className="application-remarks">
                      Remarks: {application.remarks}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
};

export default StudentApplications;
