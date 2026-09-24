import { useEffect, useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import "./OfferLetterVerification.css";
import BackButton from "../../../components/common/BackButton/BackButton";

const STORAGE_KEY = "offerLetters";

const OfferLetterVerification = () => {
  const [offerLetters, setOfferLetters] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState(null);
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
    const loadOfferLetters = async () => {
      try {
        const accessToken = getAccessToken();

        if (!accessToken) {
          setOfferLetters([]);
          setSelectedOffer(null);
          setLoading(false);
          return;
        }

        const response = await fetch("http://127.0.0.1:8000/api/documents/review/", {
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
          const type = String(item.document_type || "").toLowerCase();
          return type.includes("offer") || type === "offer_letter";
        });

        setOfferLetters(filtered);

        if (filtered.length > 0) {
          setSelectedOffer(filtered[0]);
          setRemarks(filtered[0].remarks || "");
        } else {
          setSelectedOffer(null);
        }
      } catch (error) {
        console.error("Unable to load offer letters:", error);
        setOfferLetters([]);
        setSelectedOffer(null);
      } finally {
        setLoading(false);
      }
    };

    loadOfferLetters();
  }, []);

  /*
   * =====================================================
   * SELECT OFFER LETTER
   * =====================================================
   */

  const handleSelectOffer = (offer) => {
    setSelectedOffer(offer);
    setRemarks(offer.remarks || "");
    setMessage("");
  };

  /*
   * =====================================================
   * UPDATE STATUS
   * =====================================================
   */

  const updateOfferStatus = async (newStatus) => {
    if (!selectedOffer) {
      return;
    }

    const accessToken = getAccessToken();

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/documents/${selectedOffer.id}/review/`,
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
        throw new Error(errText || "Unable to update offer letter status.");
      }

      const updatedOffers = offerLetters.map((offer) => {
        if (offer.id === selectedOffer.id) {
          return {
            ...offer,
            status: newStatus,
            remarks: remarks.trim(),
          };
        }

        return offer;
      });

      setOfferLetters(updatedOffers);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedOffers));

      const updatedSelectedOffer = updatedOffers.find(
        (offer) => offer.id === selectedOffer.id
      );

      setSelectedOffer(updatedSelectedOffer);

      setMessage(
        newStatus === "Approved"
          ? "Offer letter approved successfully."
          : "Offer letter rejected successfully."
      );
    } catch (error) {
      console.error("Offer review update failed:", error);
      setMessage("Failed to update offer letter. Please check Django and try again.");
    }
  };

  /*
   * =====================================================
   * APPROVE
   * =====================================================
   */

  const handleApprove = () => {
    updateOfferStatus("Approved");
  };

  /*
   * =====================================================
   * REJECT
   * =====================================================
   */

  const handleReject = () => {
    if (!remarks.trim()) {
      setMessage(
        "Please enter remarks before rejecting the offer letter."
      );
      return;
    }

    updateOfferStatus("Rejected");
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

        <div className="offer-page">
          <div className="page-header">
            <h1>Offer Letter Verification</h1>

            <p>
              Loading offer letters...
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

      <div className="offer-page">

        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <div className="page-header">

          <h1>
            Offer Letter Verification
          </h1>

          <p>
            Review the student's uploaded offer letter
            and approve or reject it.
          </p>

        </div>


        {/* =================================================
            OFFER LETTER LIST
        ================================================= */}

        <div className="card">

          <h2>
            Pending Offer Letters
          </h2>

          {offerLetters.length === 0 ? (

            <div className="offer-empty">

              <h3>
                No offer letters available
              </h3>

              <p>
                Student offer letters will appear here
                when they are uploaded.
              </p>

            </div>

          ) : (

            <div className="offer-list">

              {offerLetters.map((offer, index) => (

                <div
                  className={`offer-list-item ${
                    selectedOffer?.id === offer.id
                      ? "selected"
                      : ""
                  }`}
                  key={offer.id || index}
                  onClick={() =>
                    handleSelectOffer(offer)
                  }
                >

                  <div>

                    <strong>
                      {offer.studentName || "Student"}
                    </strong>

                    <p>
                      {offer.rollNumber || "--"}
                      {" • "}
                      {offer.company || "--"}
                    </p>

                  </div>

                  <span
                    className={`status ${getStatusClass(
                      offer.status
                    )}`}
                  >
                    {offer.status || "Pending Verification"}
                  </span>

                </div>

              ))}

            </div>

          )}

        </div>


        {/* =================================================
            SELECTED STUDENT DETAILS
        ================================================= */}

        {selectedOffer && (

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
                    {selectedOffer.studentName || "--"}
                  </h3>
                </div>


                <div>
                  <span>
                    Roll Number
                  </span>

                  <h3>
                    {selectedOffer.rollNumber || "--"}
                  </h3>
                </div>


                <div>
                  <span>
                    Department
                  </span>

                  <h3>
                    {selectedOffer.department || "--"}
                  </h3>
                </div>


                <div>
                  <span>
                    Company
                  </span>

                  <h3>
                    {selectedOffer.company || "--"}
                  </h3>
                </div>


                <div>
                  <span>
                    Role
                  </span>

                  <h3>
                    {selectedOffer.role || "--"}
                  </h3>
                </div>


                <div>
                  <span>
                    Duration
                  </span>

                  <h3>
                    {selectedOffer.duration || "--"}
                  </h3>
                </div>


                <div>
                  <span>
                    Uploaded On
                  </span>

                  <h3>
                    {selectedOffer.uploadedOn || "--"}
                  </h3>
                </div>


                <div>
                  <span>
                    Status
                  </span>

                  <h3
                    className={`status-text ${getStatusClass(
                      selectedOffer.status
                    )}`}
                  >
                    {selectedOffer.status ||
                      "Pending Verification"}
                  </h3>
                </div>

              </div>

            </div>


            {/* =================================================
                PDF
            ================================================= */}

            <div className="card">

              <h2>
                Offer Letter
              </h2>

              <div className="pdf-preview">

                <div className="pdf-icon">
                  📄
                </div>

                <h3>
                  {selectedOffer.documentName ||
                    "OfferLetter.pdf"}
                </h3>

                {selectedOffer.documentUrl ? (

                  <a
                    href={selectedOffer.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="download-btn"
                  >
                    View PDF
                  </a>

                ) : (

                  <button
                    className="download-btn"
                    type="button"
                    onClick={() =>
                      setMessage(
                        "Offer letter PDF is not available yet."
                      )
                    }
                  >
                    View PDF
                  </button>

                )}

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

              <div className="offer-message">
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
                  selectedOffer.status === "Approved"
                }
              >
                ✅ Approve
              </button>


              <button
                className="reject-btn"
                onClick={handleReject}
                disabled={
                  selectedOffer.status === "Rejected"
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

export default OfferLetterVerification;