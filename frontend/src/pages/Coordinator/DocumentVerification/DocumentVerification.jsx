import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import DashboardLayout from "../../../layouts/DashboardLayout";
import BackButton from "../../../components/common/BackButton/BackButton";
import { apiFetch } from "../../../services/api";
import "./DocumentVerification.css";

const documentData = {
  offer: {
    title: "Offer Letter Verification",
    type: "OFFER_LETTER",
    displayType: "Offer Letter",
  },
  final: {
    title: "Final Report Verification",
    type: "FINAL_REPORT",
    displayType: "Final Report",
  },
  certificate: {
    title: "Completion Certificate Verification",
    type: "CERTIFICATE",
    displayType: "Certificate",
  },
  weekly: {
    title: "Weekly Report Verification",
    type: "WEEKLY_REPORT",
    displayType: "Weekly Report",
  },
};

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

const normalizeType = (value) =>
  String(value || "")
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "_");

const getDocumentId = (document) =>
  document?.id ?? document?.pk ?? document?.document_id ?? document?.document;

const getDocumentList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.documents)) return data.documents;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

const DocumentVerification = () => {
  const { type } = useParams();
  const documentConfig = documentData[type] || documentData.offer;

  const [documents, setDocuments] = useState([]);
  const [remarks, setRemarks] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState(null);

  const loadDocuments = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        status: "PENDING",
        document_type: documentConfig.type,
      });

      const response = await apiFetch(
        `/documents/review/?${params.toString()}`,
        { method: "GET" }
      );

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(
          body?.detail ||
            body?.message ||
            `Unable to fetch documents (${response.status}).`
        );
      }

      const data = await response.json();
      const list = getDocumentList(data).filter(
        (item) =>
          normalizeType(item?.document_type || item?.type) ===
          normalizeType(documentConfig.type)
      );

      setDocuments(list);
      setRemarks((current) => {
        const next = { ...current };
        list.forEach((item) => {
          const id = getDocumentId(item);
          if (id != null && next[id] === undefined) next[id] = "";
        });
        return next;
      });
    } catch (err) {
      console.error("Unable to load pending documents:", err);
      setError(err.message || "Unable to load pending documents.");
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }, [documentConfig.type]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const getStudentName = (document) =>
    document.student_name ||
    document.student?.name ||
    document.student?.full_name ||
    document.student?.user?.first_name ||
    document.user?.name ||
    document.user?.username ||
    "--";

  const getRollNumber = (document) =>
    document.roll_number ||
    document.student?.roll_number ||
    document.student?.rollNumber ||
    document.student?.user?.username ||
    "--";

  const getDepartment = (document) =>
    document.department || document.student?.department || "--";

  const getCompany = (document) =>
    document.company ||
    document.company_name ||
    document.internship?.company ||
    document.internship?.company_name ||
    "--";

  const getRole = (document) =>
    document.role ||
    document.internship?.role ||
    document.internship?.position ||
    "--";

  const getDuration = (document) => {
    const start = document.start_date || document.internship?.start_date;
    const end = document.end_date || document.internship?.end_date;

    if (start && end) return `${start} - ${end}`;
    return document.duration || "--";
  };

  const getUploadedDate = (document) =>
    document.uploaded_on ||
    document.uploaded_at ||
    document.created_at ||
    "--";

  const getStatus = (document) =>
    document.status || document.verification_status || "PENDING";

  const getFileName = (document) =>
    document.file_name ||
    document.filename ||
    document.name ||
    document.file?.split("/").pop() ||
    `${documentConfig.displayType}.pdf`;

  const getFileUrl = (document) => {
    const rawUrl =
      document.file_url ||
      document.document_url ||
      document.file ||
      document.url;

    if (!rawUrl) return null;
    if (/^https?:\/\//i.test(rawUrl)) return rawUrl;

    const backendOrigin = API_BASE_URL.replace(/\/api\/?$/, "");
    return `${backendOrigin}/${String(rawUrl).replace(/^\/+/, "")}`;
  };

  const getStatusColor = (status) => {
    const value = String(status || "").toLowerCase();
    if (value.includes("approved") || value.includes("verified"))
      return "#16a34a";
    if (value.includes("rejected") || value.includes("declined"))
      return "#dc2626";
    return "#f59e0b";
  };

  const handleViewDocument = (document) => {
    const fileUrl = getFileUrl(document);
    if (!fileUrl) {
      alert("Document file is not available.");
      return;
    }
    window.open(fileUrl, "_blank", "noopener,noreferrer");
  };

  const handleDownloadDocument = (document) => {
    const fileUrl = getFileUrl(document);
    if (!fileUrl) {
      alert("Document file is not available.");
      return;
    }

    const link = window.document.createElement("a");
    link.href = fileUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.download = getFileName(document);
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
  };

  const handleReview = async (document, status) => {
    const id = getDocumentId(document);
    if (id == null) {
      alert("Document ID is missing. Cannot submit the review.");
      return;
    }

    const note = String(remarks[id] || "").trim();
    if (status === "REJECTED" && !note) {
      alert("Please enter remarks before rejecting the document.");
      return;
    }

    setProcessingId(id);
    try {
      const response = await apiFetch(`/documents/${id}/review/`, {
        method: "PATCH",
        body: JSON.stringify({ status, remarks: note }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        const message =
          body?.detail ||
          body?.message ||
          body?.error ||
          (typeof body === "object"
            ? Object.entries(body)
                .map(([key, value]) =>
                  `${key}: ${Array.isArray(value) ? value.join(", ") : value}`
                )
                .join("\n")
            : "");
        throw new Error(
          message || `Unable to ${status.toLowerCase()} document (${response.status}).`
        );
      }

      // Keep the database record; remove it only from this pending list.
      setDocuments((current) =>
        current.filter((item) => String(getDocumentId(item)) !== String(id))
      );
      alert(
        status === "APPROVED"
          ? "Document approved successfully."
          : "Document rejected successfully."
      );
    } catch (err) {
      console.error(`${status} document failed:`, err);
      alert(err.message || `Unable to ${status.toLowerCase()} document.`);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <DashboardLayout>
      <BackButton />
      <div className="verification-page">
        <div className="page-header">
          <h1>{documentConfig.title}</h1>
          <p>Review the uploaded documents and take appropriate action.</p>
        </div>

        {loading && (
          <div className="card">
            <h2>Loading documents...</h2>
            <p>Fetching pending student documents from the Django backend.</p>
          </div>
        )}

        {!loading && error && (
          <div className="card">
            <h2>Unable to Load Documents</h2>
            <p style={{ color: "#dc2626", marginTop: "10px" }}>{error}</p>
            <button className="view-btn" onClick={loadDocuments}>
              Retry
            </button>
          </div>
        )}

        {!loading && !error && documents.length === 0 && (
          <div className="card">
            <h2>No Pending {documentConfig.displayType} Documents</h2>
            <p>No student documents are currently available for verification.</p>
            <button className="view-btn" onClick={loadDocuments}>
              Refresh
            </button>
          </div>
        )}

        {!loading &&
          !error &&
          documents.map((document, index) => {
            const id = getDocumentId(document);
            const status = getStatus(document);
            const busy = processingId != null && String(processingId) === String(id);

            return (
              <div
                className="verification-document"
                key={id ?? `${documentConfig.type}-${index}`}
              >
                <div className="card">
                  <h2>Student Information</h2>
                  <div className="student-grid">
                    <div>
                      <span>Name</span>
                      <h3>{getStudentName(document)}</h3>
                    </div>
                    <div>
                      <span>Roll Number</span>
                      <h3>{getRollNumber(document)}</h3>
                    </div>
                    <div>
                      <span>Department</span>
                      <h3>{getDepartment(document)}</h3>
                    </div>
                    <div>
                      <span>Company</span>
                      <h3>{getCompany(document)}</h3>
                    </div>
                    <div>
                      <span>Role</span>
                      <h3>{getRole(document)}</h3>
                    </div>
                    <div>
                      <span>Internship Duration</span>
                      <h3>{getDuration(document)}</h3>
                    </div>
                    <div>
                      <span>Document Type</span>
                      <h3>{documentConfig.displayType}</h3>
                    </div>
                    <div>
                      <span>Uploaded On</span>
                      <h3>{getUploadedDate(document)}</h3>
                    </div>
                    <div>
                      <span>Status</span>
                      <h3 style={{ color: getStatusColor(status) }}>{status}</h3>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <h2>Uploaded Document</h2>
                  <div className="document-preview">
                    <div className="pdf-icon">📄</div>
                    <h3>{getFileName(document)}</h3>
                    <p>Click below to preview or download the uploaded document.</p>
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
                        onClick={() => handleViewDocument(document)}
                      >
                        👀 Preview Document
                      </button>
                      <button
                        className="view-btn"
                        onClick={() => handleDownloadDocument(document)}
                      >
                        ⬇ Download Document
                      </button>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <h2>Coordinator Remarks</h2>
                  <textarea
                    rows="6"
                    placeholder="Enter remarks before approving or rejecting the document..."
                    value={id == null ? "" : remarks[id] || ""}
                    onChange={(event) =>
                      id != null &&
                      setRemarks((current) => ({
                        ...current,
                        [id]: event.target.value,
                      }))
                    }
                  />
                </div>

                <div className="actions">
                  <button
                    className="approve-btn"
                    disabled={busy}
                    onClick={() => handleReview(document, "APPROVED")}
                  >
                    {busy ? "Processing..." : "✅ Approve"}
                  </button>
                  <button
                    className="reject-btn"
                    disabled={busy}
                    onClick={() => handleReview(document, "REJECTED")}
                  >
                    {busy ? "Processing..." : "❌ Reject"}
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
