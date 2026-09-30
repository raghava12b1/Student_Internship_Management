import { useState, useEffect, useCallback } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import DashboardLayout from "../../../layouts/DashboardLayout";

import "./CoordinatorStudentDetails.css";

import BackButton from "../../../components/common/BackButton/BackButton";

const API_URL = "http://127.0.0.1:8000/api";

const documentTypes = [

  { type: "OFFER_LETTER", label: "Offer Letter" },

  { type: "FINAL_REPORT", label: "Final Report" },

  { type: "CERTIFICATE", label: "Completion Certificate" },

];

const getToken = () =>

  localStorage.getItem("accessToken") ||

  localStorage.getItem("access") ||

  "";

const getStudentIdFromDocument = (document) => {

  const student = document?.student;

  if (student && typeof student === "object") {

    return student.id ?? student.student_id ?? student.student_profile?.id ?? null;

  }

  return document?.student_id ?? student ?? null;

};

const CoordinatorStudentDetails = () => {

  const location = useLocation();

  const navigate = useNavigate();

  const [student, setStudent] = useState(location.state?.student || null);

  const [documents, setDocuments] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {

    if (!student) {

      const savedStudent = sessionStorage.getItem("selectedCoordinatorStudent");

      if (savedStudent) {

        try {

          setStudent(JSON.parse(savedStudent));

        } catch {

          sessionStorage.removeItem("selectedCoordinatorStudent");

          navigate("/coordinator/students", { replace: true });

        }

      } else {

        navigate("/coordinator/students", { replace: true });

      }

    } else {

      sessionStorage.setItem("selectedCoordinatorStudent", JSON.stringify(student));

    }

  }, [student, navigate]);

  const studentId =

    student?.student_id ?? student?.student_profile?.id ?? student?.id;

  const fetchDocuments = useCallback(async () => {

    if (!studentId) {

      setError("Student ID is missing.");

      return;

    }

    const token = getToken();

    if (!token) {

      setError("Your login session has expired. Please log in again.");

      return;

    }

    setLoading(true);

    setError("");

    try {

      // Fetch all documents for this selected student, including reviewed documents.
      const response = await fetch(
        `${API_URL}/documents/student/${studentId}/`,
        {

        method: "GET",

        headers: {

          Authorization: `Bearer ${token}`,

          Accept: "application/json",

        },

      });

      if (response.status === 401) {

        throw new Error("Your login session has expired. Please log in again.");

      }

      const data = await response.json().catch(() => null);

      if (!response.ok) {

        throw new Error(

          data?.detail || `Failed to load documents (${response.status}).`

        );

      }

      const documentList = Array.isArray(data)

        ? data

        : Array.isArray(data?.results)

        ? data.results

        : [];

      setDocuments(

        documentList.filter(

          (document) =>

            String(getStudentIdFromDocument(document)) === String(studentId)

        )

      );

    } catch (err) {

      setError(err.message || "Unable to load documents.");

    } finally {

      setLoading(false);

    }

  }, [studentId]);

  useEffect(() => {

    if (studentId) fetchDocuments();

  }, [studentId, fetchDocuments]);

  const getLatestDocument = (type) =>

    documents

      .filter(

        (document) =>

          String(document.document_type || "").trim().toUpperCase() === type

      )

      .sort(

        (a, b) =>

          new Date(b.uploaded_at || 0) - new Date(a.uploaded_at || 0)

      )[0];

  const getFileUrl = (document) => {

    if (!document) return "";

    const file = document.file_url || document.file || "";

    if (!file) return "";

     if (/^https?:\/\//i.test(file)) {
    return file;
  }

    return `http://127.0.0.1:8000${file.startsWith("/") ? file : `/${file}`}`;

  };

  const reviewDocument = async (document, status) => {

    const documentId = document?.id ?? document?.pk;

    if (!documentId) {

      alert("Document ID is missing.");

      return;

    }

    const token = getToken();

    if (!token) {

      alert("Your login session has expired. Please log in again.");

      return;

    }

    let remarks = "";

    if (status === "REJECTED") {

      remarks = window.prompt("Enter rejection remarks:");

      if (remarks === null) return;

    }

    setUpdatingId(documentId);

    setError("");

    try {

      const response = await fetch(

        `${API_URL}/documents/${documentId}/review/`,

        {

          method: "PATCH",

          headers: {

            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`,

            Accept: "application/json",

          },

          body: JSON.stringify({ status, remarks: remarks || "" }),

        }

      );

      const data = await response.json().catch(() => null);

      if (response.status === 401) {

        throw new Error("Your login session has expired. Please log in again.");

      }

      if (!response.ok) {

        throw new Error(

          data?.detail ||

            data?.status?.[0] ||

            `Document review failed (${response.status}).`

        );

      }

      await fetchDocuments();

      alert(

        status === "APPROVED"

          ? "Document approved successfully."

          : "Document rejected successfully."

      );

    } catch (err) {

      alert(err.message || "Approval failed. Please try again.");

    } finally {

      setUpdatingId(null);

    }

  };

  const internship =

    student?.internship ||

    student?.internship_details ||

    documents[0]?.internship ||

    {};

  const companyName =

    student?.company_name ||

    internship?.company_name ||

    internship?.company?.name ||

    internship?.company ||

    "--";

  const role =

    student?.role ||

    internship?.role ||

    internship?.title ||

    internship?.position ||

    "--";

  const startDate =

    student?.start_date || internship?.start_date || internship?.startDate;

  const endDate =

    student?.end_date || internship?.end_date || internship?.endDate;

  const duration =

    student?.duration ||

    internship?.duration ||

    (startDate && endDate ? `${startDate} to ${endDate}` : "--");

  const internshipStatus = student?.status || internship?.status || "--";

  if (!student) return null;

  return (

    <DashboardLayout>

      <BackButton />

      <div className="student-details">

        <div className="profile-card">

          <div className="profile-left">

            <div className="avatar">

              {student.student_name

                ? student.student_name.charAt(0).toUpperCase()

                : "S"}

            </div>

            <div>

              <h2>{student.student_name || "--"}</h2>

              <p>Roll No : {student.roll_number || "--"}</p>

              <p>{student.department || "--"} - {student.year || "--"} Year</p>

            </div>

          </div>

          <div className="profile-right">

            <button className="approve" type="button">Approve Student</button>

          </div>

        </div>

        <div className="details-card">

          <h2>Internship Details</h2>

          <div className="grid">

            <div>

              <span>Company</span>

              <h3>{companyName}</h3>

            </div>

            <div>

              <span>Role</span>

              <h3>{role}</h3>

            </div>

            <div>

              <span>Duration</span>

              <h3>{duration}</h3>

            </div>

            <div>

              <span>Status</span>

              <h3>{internshipStatus}</h3>

            </div>

          </div>

        </div>

        <div className="details-card">

          <h2>Uploaded Documents</h2>

          {loading && <p>Loading documents...</p>}

          {error && <p style={{ color: "red" }} role="alert">{error}</p>}

          <table>

            <thead>

              <tr>

                <th>Document</th>

                <th>Status</th>

                <th>View</th>

                <th>Approve/Reject</th>

              </tr>

            </thead>

            <tbody>

              {documentTypes.map(({ type, label }) => {

                const document = getLatestDocument(type);

                const fileUrl = getFileUrl(document);

                const status = document?.status || "Not Uploaded";

                const isPending = status === "PENDING";

                const documentId = document?.id ?? document?.pk;

                return (

                  <tr key={type}>

                    <td>{label}</td>

                    <td>{status}</td>

                    <td>

                      {document && fileUrl ? (

                        <button

                          className="view-btn"

                          type="button"

                          onClick={() =>

                            window.open(fileUrl, "_blank", "noopener,noreferrer")

                          }

                        >

                          View PDF

                        </button>

                      ) : "-"}

                    </td>

                    <td>

                      {isPending && document ? (

                        <div style={{ display: "flex", gap: "8px" }}>

                          <button

                            className="approve"

                            type="button"

                            disabled={updatingId === documentId}

                            onClick={() => reviewDocument(document, "APPROVED")}

                          >

                            {updatingId === documentId ? "Processing..." : "Approve"}

                          </button>

                          <button

                            className="reject"

                            type="button"

                            disabled={updatingId === documentId}

                            onClick={() => reviewDocument(document, "REJECTED")}

                          >

                            Reject

                          </button>

                        </div>

                      ) : "-"}

                    </td>

                  </tr>

                );

              })}

            </tbody>

          </table>

          {!loading && documents.length === 0 && !error && (

            <p>No documents have been uploaded yet.</p>

          )}

          {error && (

            <button type="button" onClick={fetchDocuments}>Retry</button>

          )}

        </div>

      </div>

    </DashboardLayout>

  );

};

export default CoordinatorStudentDetails;
