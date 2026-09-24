import "./StatCards.css";

import {
  FaFileAlt,
  FaClock,
  FaCertificate,
} from "react-icons/fa";


const StatCards = ({ dashboardData }) => {

  // ============================================================
  // OFFER LETTER
  // ============================================================

  const offerLetterUploaded =
    dashboardData?.documents?.offer_letter_uploaded || false;

  const offerLetterStatus =
    offerLetterUploaded
      ? "Uploaded"
      : "Not Uploaded";


  // ============================================================
  // PENDING REVIEWS
  // ============================================================

  const pendingReviews =
    Number(
      dashboardData?.statistics?.pending_reviews || 0
    );


  // ============================================================
  // CERTIFICATE
  // ============================================================

  const certificateUploaded =
    dashboardData?.certificate?.uploaded || false;

  const certificateVerified =
    dashboardData?.certificate?.verified || false;


  let certificateStatus = "Not Uploaded";

  if (certificateUploaded && certificateVerified) {
    certificateStatus = "Verified";
  } else if (certificateUploaded) {
    certificateStatus = "Uploaded";
  }


  // ============================================================
  // CARDS
  // ============================================================

  const cards = [

    {
      title: "Offer Letter",
      value: offerLetterStatus,
      icon: <FaFileAlt />,
    },

    {
      title: "Pending Reviews",
      value: pendingReviews,
      icon: <FaClock />,
    },

    {
      title: "Certificate",
      value: certificateStatus,
      icon: <FaCertificate />,
    },

  ];


  // ============================================================
  // UI
  // ============================================================

  return (

    <div className="stats-grid">

      {cards.map((card, index) => (

        <div
          className="stat-card"
          key={index}
        >

          <div className="stat-icon">
            {card.icon}
          </div>

          <h3 className="card-value">
            {card.value}
          </h3>

          <p>
            {card.title}
          </p>

        </div>

      ))}

    </div>

  );

};


export default StatCards;