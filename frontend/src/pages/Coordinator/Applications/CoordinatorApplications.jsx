import { useEffect, useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import "./CoordinatorApplications.css";
import BackButton from "../../../components/common/BackButton/BackButton";

const STORAGE_KEY = "applications";

const CoordinatorApplications = () => {
  const [applications, setapplications] = useState([]);
  const [selectedapplication, setSelectedapplication] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const getAccessToken = () => {
    return (
      localStorage.getItem("accessToken") ||
      localStorage.getItem("access_token") ||
      localStorage.getItem("access")
    );
  };

  useEffect(() => {
    const loadapplications = async () => {
      try {
        const accessToken = getAccessToken();

        if (!accessToken) {
          setapplications([]);
          setSelectedapplication(null);
          setLoading(false);
          return;
        }

        const response = await fetch("http://127.0.0.1:8000/api/applications/review/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Server returned ${response.status}`);
        }

        const data = await response.json();
        const items = Array.isArray(data) ? data : Array.isArray(data.results) ? data.results : [];

        const filtered = items.filter((item) => {
          const type = String("").toLowerCase();
          return true;
        });

        setapplications(filtered);

        if (filtered.length > 0) {
          setSelectedapplication(filtered[0]);
          setRemarks(filtered[0].remarks || "");
        } else {
          setSelectedapplication(null);
        }
      } catch (error) {
        console.error("Unable to load Applications:", error);
        setapplications([]);
        setSelectedapplication(null);
      } finally {
        setLoading(false);
      }
    };

    loadapplications();
  }, []);

  /*
   * =====================================================
   * SELECT Application
   * =====================================================
   */

  const handleSelectapplication = (application) => {
    setSelectedapplication(application);
    setRemarks(application.remarks || "");
    setMessage("");
  };

  /*
   * =====================================================
   * UPDATE STATUS
   * =====================================================
   */

  const updateapplicationStatus = async (newStatus) => {
    if (!selectedapplication) {
      return;
    }

    const accessToken = getAccessToken();

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/applications/${selectedapplication.id}/review/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            status: newStatus === "Approved" ? "APPROVED" : "REJECTED",
            remarks: remarks.trim(),
          }),
        }
      );

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || "Unable to update Application status.");
      }

      const updatedapplications = applications.map((application) => {
        if (application.id === selectedapplication.id) {
          return {
            ...application,
            status: newStatus,
            remarks: remarks.trim(),
          };
        }

        return application;
      });

      setapplications(updatedapplications);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedapplications));

      const updatedSelectedapplication = updatedapplications.find(
        (application) => application.id === selectedapplication.id
      );

      setSelectedapplication(updatedSelectedapplication);

      setMessage(
        newStatus === "Approved"
          ? "Application approved successfully."
          : "Application rejected successfully."
      );
    } catch (error) {
      console.error("application review update failed:", error);
      setMessage("Failed to update Application. Please check Django and try again.");
    }
  };

  /*
   * =====================================================
   * APPROVE
   * =====================================================
   */

  const handleApprove = () => {
    updateapplicationStatus("Approved");
  };

  /*
   * =====================================================
   * REJECT
   * =====================================================
   */

  const handleReject = () => {
    if (!remarks.trim()) {
      setMessage(
        "Please enter remarks before rejecting the Application."
      );
      return;
    }

    updateapplicationStatus("Rejected");
  };

  /*
   * =====================================================
   * STATUS CLASS
   * =====================================================
   */

  const getStatusClass = (status) => {
    return (
      status
        ?.toLowerCase()
        .replace(/\s+/g, "-") || ""
    );
  };

  /*
   * =====================================================
   * LOADING
   * =====================================================
   */

  if (loading) {
    return (
      <DashboardLayout>
        <BackButton />

        <div className="application-page">
          <div className="page-header">
            <h1>View Applications</h1>

            <p>
              Loading Applications...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  /*
   * =====================================================
   * MAIN UI
   * =====================================================
   */

  return (
    <DashboardLayout>

      <BackButton />

      <div className="application-page">

        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <div className="page-header">

          <h1>
            View Applications
          </h1>

          <p>
            Review the student's uploaded Application
            and approve or reject it.
          </p>

        </div>


        {/* =================================================
            Application LIST
        ================================================= */}

        <div className="card">

          <h2>
            Pending Applications
          </h2>

          {applications.length === 0 ? (

            <div className="application-empty">

              <h3>
                No Applications available
              </h3>

              <p>
                Student Applications will appear here
                when they are uploaded.
              </p>

            </div>

          ) : (

            <div className="application-list">

              {applications.map((application, index) => (

                <div
                  className={`application-list-item ${
                    selectedapplication?.id === application.id
                      ? "selected"
                      : ""
                  }`}
                  key={application.id || index}
                  onClick={() =>
                    handleSelectapplication(application)
                  }
                >

                  <div>

                    <strong>
                      {application.student_name || "Student"}
                    </strong>

                    <p>
                      {application.roll_number || "--"}
                      {" • "}
                      {application.company_name || "--"}
                    </p>

                  </div>

                  <span
                    className={`status ${getStatusClass(
                      application.status
                    )}`}
                  >
                    {application.status || "Pending Verification"}
                  </span>

                </div>

              ))}

            </div>

          )}

        </div>


        {/* =================================================
            SELECTED STUDENT DETAILS
        ================================================= */}

        {selectedapplication && (

          <>

            {/* STUDENT INFORMATION */}

            <div className="card">

              <h2>
                Student Information
              </h2>

              <div className="details-grid">

                <div>
                  <span>
                    Student Name
                  </span>

                  <h3>
                    {selectedapplication.student_name || "--"}
                  </h3>
                </div>


                <div>
                  <span>
                    Roll Number
                  </span>

                  <h3>
                    {selectedapplication.roll_number || "--"}
                  </h3>
                </div>


                <div>
                  <span>
                    Department
                  </span>

                  <h3>
                    {selectedapplication.department || "--"}
                  </h3>
                </div>


                <div>
                  <span>
                    Company
                  </span>

                  <h3>
                    {selectedapplication.company_name || "--"}
                  </h3>
                </div>


                <div>
                  <span>
                    Role
                  </span>

                  <h3>
                    {selectedapplication.role || "--"}
                  </h3>
                </div>


                <div>
                  <span>
                    Duration
                  </span>

                  <h3>
                    {selectedapplication.duration || "--"}
                  </h3>
                </div>


                <div>
                  <span>
                    Uploaded On
                  </span>

                  <h3>
                    {selectedapplication.applied_at || "--"}
                  </h3>
                </div>


                <div>
                  <span>
                    Status
                  </span>

                  <h3
                    className={`status-text ${getStatusClass(
                      selectedapplication.status
                    )}`}
                  >
                    {selectedapplication.status ||
                      "Pending Verification"}
                  </h3>
                </div>

              </div>

            </div>


            {/* =================================================
                REMARKS
            ================================================= */}

            <div className="card">

              <h2>
                Coordinator Remarks
              </h2>

              <textarea
                placeholder="Write remarks here..."
                rows="6"
                value={remarks}
                onChange={(e) =>
                  setRemarks(e.target.value)
                }
              />

            </div>


            {/* =================================================
                MESSAGE
            ================================================= */}

            {message && (

              <div className="application-message">
                {message}
              </div>

            )}


            {/* =================================================
                BUTTONS
            ================================================= */}

            <div className="button-group">

              <button
                className="approve-btn"
                onClick={handleApprove}
                disabled={
                  selectedapplication.status === "Approved"
                }
              >
                ✅ Approve
              </button>


              <button
                className="reject-btn"
                onClick={handleReject}
                disabled={
                  selectedapplication.status === "Rejected"
                }
              >
                ❌ Reject
              </button>

            </div>

          </>

        )}

      </div>

    </DashboardLayout>
  );
};

export default CoordinatorApplications;

