import { useEffect, useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useParams } from "react-router-dom";
import "./DocumentVerification.css";
import BackButton from "../../../components/common/BackButton/BackButton";

const API_BASE_URL = "http://127.0.0.1:8000/api";

const documentData = {
  offer: {
    title: "Offer Letter Verification",
    type: "Offer Letter",
  },
  final: {
    title: "Final Report Verification",
    type: "Final Internship Report",
  },
  certificate: {
    title: "Completion Certificate Verification",
    type: "Completion Certificate",
  },
};

const DocumentVerification = () => {
  const { type } = useParams();

  const documentConfig =
    documentData[type] || documentData.offer;

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
   * =====================================================
   * GET ACCESS TOKEN
   * =====================================================
   */

  const getAccessToken = () => {
    return (
      localStorage.getItem("accessToken") ||
      localStorage.getItem("access_token") ||
      localStorage.getItem("access")
    );
  };

  /*
   * =====================================================
   * LOAD DOCUMENTS FROM DJANGO
   * =====================================================
   */

  useEffect(() => {
    const loadDocuments = async () => {
      setLoading(true);
      setError("");

      try {
        const accessToken = getAccessToken();

        if (!accessToken) {
          setError(
            "Access token not found. Please login again."
          );
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${API_BASE_URL}/documents/review/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.status === 401) {
          setError(
            "Your login session has expired. Please login again."
          );
          setLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error(
            `Server returned ${response.status}`
          );
        }

        const data = await response.json();

        /*
         * Django REST Framework can return either:
         *
         * [
         *   {...},
         *   {...}
         * ]
         *
         * OR
         *
         * {
         *   results: [...]
         * }
         */

        let documentList = [];

        if (Array.isArray(data)) {
          documentList = data;
        } else if (Array.isArray(data.results)) {
          documentList = data.results;
        } else if (Array.isArray(data.documents)) {
          documentList = data.documents;
        }

        /*
         * =================================================
         * FILTER CURRENT DOCUMENT TYPE
         * =================================================
         */

        const normalizeDocumentType = (value) => {
          return String(value || "")
            .trim()
            .toLowerCase()
            .replace(/&/g, "and")
            .replace(/[_\s-]+/g, "")
            .replace(/[^a-z0-9]/g, "");
        };

        const requiredType = normalizeDocumentType(
          documentConfig.type
        );

        const filteredDocuments = documentList.filter((item) => {
          const itemType = normalizeDocumentType(
            item.document_type ||
              item.type ||
              item.documentType ||
              item.document_type_display ||
              ""
          );

          if (!itemType) {
            return true;
          }

          return itemType.includes(requiredType) || requiredType.includes(itemType);
        });

        setDocuments(filteredDocuments);
      } catch (err) {
        console.error(
          "Unable to load documents:",
          err
        );

        setError(
          "Unable to connect to Django server. Please make sure Django is running."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, [type, documentConfig.type]);

  /*
   * =====================================================
   * HELPERS
   * =====================================================
   */

  const getStudentName = (document) => {
    return (
      document.student_name ||
      document.student?.name ||
      document.student?.full_name ||
      document.user?.name ||
      document.user?.username ||
      "--"
    );
  };

  const getRollNumber = (document) => {
    return (
      document.roll_number ||
      document.student?.roll_number ||
      document.student?.rollNumber ||
      "--"
    );
  };

  const getDepartment = (document) => {
    return (
      document.department ||
      document.student?.department ||
      "--"
    );
  };

  const getCompany = (document) => {
    return (
      document.company ||
      document.company_name ||
      document.internship?.company ||
      document.internship?.company_name ||
      "--"
    );
  };

  const getRole = (document) => {
    return (
      document.role ||
      document.internship?.role ||
      document.internship?.position ||
      "--"
    );
  };

  const getDuration = (document) => {
    if (
      document.start_date &&
      document.end_date
    ) {
      return `${document.start_date} - ${document.end_date}`;
    }

    if (
      document.internship?.start_date &&
      document.internship?.end_date
    ) {
      return `${document.internship.start_date} - ${document.internship.end_date}`;
    }

    if (document.duration) {
      return document.duration;
    }

    return "--";
  };

  const getUploadedDate = (document) => {
    return (
      document.uploaded_on ||
      document.uploaded_at ||
      document.created_at ||
      "--"
    );
  };

  const getStatus = (document) => {
    return (
      document.status ||
      document.verification_status ||
      "Pending Verification"
    );
  };

  const getFileName = (document) => {
    return (
      document.file_name ||
      document.filename ||
      document.name ||
      document.file?.split("/").pop() ||
      `${documentConfig.type}.pdf`
    );
  };

  const getFileUrl = (document) => {
    return (
      document.file_url ||
      document.document_url ||
      document.file ||
      document.url ||
      null
    );
  };

  /*
   * =====================================================
   * STATUS COLOR
   * =====================================================
   */

  const getStatusColor = (status) => {
    const value = String(status).toLowerCase();

    if (
      value.includes("approved") ||
      value.includes("verified")
    ) {
      return "#16a34a";
    }

    if (
      value.includes("rejected") ||
      value.includes("declined")
    ) {
      return "#dc2626";
    }

    return "#f59e0b";
  };

  /*
   * =====================================================
   * VIEW DOCUMENT
   * =====================================================
   */

  const handleViewDocument = (document) => {
    const fileUrl = getFileUrl(document);

    if (!fileUrl) {
      alert("Document file is not available.");
      return;
    }

    window.open(fileUrl, "_blank");
  };

  /*
   * =====================================================
   * DOWNLOAD DOCUMENT
   * =====================================================
   */

  const handleDownloadDocument = (document) => {
    const fileUrl = getFileUrl(document);

    if (!fileUrl) {
      alert("Document file is not available.");
      return;
    }

    const link = window.document.createElement("a");

    link.href = fileUrl;
    link.target = "_blank";
    link.download = getFileName(document);

    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
  };

  /*
   * =====================================================
   * APPROVE / REJECT
   *
   * IMPORTANT:
   * We are NOT inventing the backend endpoint here.
   * Once your friend gives us the exact PATCH/POST API,
   * we will connect these buttons.
   * =====================================================
   */

  const handleApprove = async (item) => {
    const textarea = window.document.querySelector(`#remarks-${item.id || item.pk || item.document_id}`);
    const remarks = textarea ? textarea.value.trim() : "";
    const accessToken = getAccessToken();

    try {
      const response = await fetch(`${API_BASE_URL}/documents/${item.id || item.pk}/review/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          status: "APPROVED",
          remarks,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(errorBody || "Could not approve document.");
      }

      setDocuments((current) =>
        current.map((currentItem) =>
          (currentItem.id || currentItem.pk) === (item.id || item.pk)
            ? { ...currentItem, status: "APPROVED", remarks }
            : currentItem
        )
      );
      alert("Document approved successfully.");
    } catch (err) {
      console.error("Approve document failed:", err);
      alert("Approval failed. Please check the backend and try again.");
    }
  };

  const handleReject = async (item) => {
    const textarea = window.document.querySelector(`#remarks-${item.id || item.pk || item.document_id}`);
    const remarks = textarea ? textarea.value.trim() : "";
    if (!remarks) {
      alert("Please enter remarks before rejecting the document.");
      return;
    }

    const accessToken = getAccessToken();

    try {
      const response = await fetch(`${API_BASE_URL}/documents/${item.id || item.pk}/review/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          status: "REJECTED",
          remarks,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(errorBody || "Could not reject document.");
      }

      setDocuments((current) =>
        current.map((currentItem) =>
          (currentItem.id || currentItem.pk) === (item.id || item.pk)
            ? { ...currentItem, status: "REJECTED", remarks }
            : currentItem
        )
      );
      alert("Document rejected successfully.");
    } catch (err) {
      console.error("Reject document failed:", err);
      alert("Rejection failed. Please check the backend and try again.");
    }
  };

  /*
   * =====================================================
   * UI
   * =====================================================
   */

  return (
    <DashboardLayout>

      <BackButton />

      <div className="verification-page">

        {/* Header */}

        <div className="page-header">

          <h1>
            {documentConfig.title}
          </h1>

          <p>
            Review the uploaded documents and take
            appropriate action.
          </p>

        </div>


        {/* Loading */}

        {loading && (

          <div className="card">

            <h2>
              Loading documents...
            </h2>

            <p>
              Fetching student documents from the
              Django backend.
            </p>

          </div>

        )}


        {/* Error */}

        {!loading && error && (

          <div className="card">

            <h2>
              Unable to Load Documents
            </h2>

            <p
              style={{
                color: "#dc2626",
                marginTop: "10px",
              }}
            >
              {error}
            </p>

          </div>

        )}


        {/* No Documents */}

        {!loading &&
          !error &&
          documents.length === 0 && (

            <div className="card">

              <h2>
                No {documentConfig.type} Documents
              </h2>

              <p>
                No student documents are currently
                available for verification.
              </p>

            </div>

          )}


        {/* =================================================
            ALL STUDENT DOCUMENTS
        ================================================= */}

        {!loading &&
          !error &&
          documents.map((document, index) => {

            const status =
              getStatus(document);

            return (

              <div
                className="verification-document"
                key={
                  document.id ||
                  document.pk ||
                  index
                }
              >

                {/* Student Information */}

                <div className="card">

                  <h2>
                    Student Information
                  </h2>

                  <div className="student-grid">

                    <div>
                      <span>Name</span>
                      <h3>
                        {getStudentName(document)}
                      </h3>
                    </div>


                    <div>
                      <span>Roll Number</span>
                      <h3>
                        {getRollNumber(document)}
                      </h3>
                    </div>


                    <div>
                      <span>Department</span>
                      <h3>
                        {getDepartment(document)}
                      </h3>
                    </div>


                    <div>
                      <span>Company</span>
                      <h3>
                        {getCompany(document)}
                      </h3>
                    </div>


                    <div>
                      <span>Role</span>
                      <h3>
                        {getRole(document)}
                      </h3>
                    </div>


                    <div>
                      <span>
                        Internship Duration
                      </span>

                      <h3>
                        {getDuration(document)}
                      </h3>
                    </div>


                    <div>
                      <span>
                        Document Type
                      </span>

                      <h3>
                        {documentConfig.type}
                      </h3>
                    </div>


                    <div>
                      <span>
                        Uploaded On
                      </span>

                      <h3>
                        {getUploadedDate(document)}
                      </h3>
                    </div>


                    <div>
                      <span>
                        Status
                      </span>

                      <h3
                        style={{
                          color:
                            getStatusColor(status),
                        }}
                      >
                        {status}
                      </h3>
                    </div>

                  </div>

                </div>


                {/* Uploaded Document */}

                <div className="card">

                  <h2>
                    Uploaded Document
                  </h2>

                  <div className="document-preview">

                    <div className="pdf-icon">
                      📄
                    </div>

                    <h3>
                      {getFileName(document)}
                    </h3>

                    <p>
                      Click below to preview or
                      download the uploaded document.
                    </p>


                    <div
                      style={{
                        display: "flex",
                        gap: "15px",
                        justifyContent: "center",
                        marginTop: "20px",
                        flexWrap: "wrap",
                      }}
                    >

                      <button
                        className="view-btn"
                        onClick={() =>
                          handleViewDocument(
                            document
                          )
                        }
                      >
                        👀 Preview Document
                      </button>


                      <button
                        className="view-btn"
                        onClick={() =>
                          handleDownloadDocument(
                            document
                          )
                        }
                      >
                        ⬇ Download Document
                      </button>

                    </div>

                  </div>

                </div>


                {/* Remarks */}

                <div className="card">

                  <h2>
                    Coordinator Remarks
                  </h2>

                  <textarea
                    rows="6"
                    placeholder="Enter remarks before approving or rejecting the document..."
                    id={`remarks-${document.id || index}`}
                  ></textarea>

                </div>


                {/* Action Buttons */}

                <div className="actions">

                  <button
                    className="approve-btn"
                    onClick={() =>
                      handleApprove(document)
                    }
                  >
                    ✅ Approve
                  </button>


                  <button
                    className="reject-btn"
                    onClick={() =>
                      handleReject(document)
                    }
                  >
                    ❌ Reject
                  </button>

                </div>

              </div>

            );
          })}

      </div>

    </DashboardLayout>
  );
};

export default DocumentVerification;