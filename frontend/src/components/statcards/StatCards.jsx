import "./StatCards.css";

import {
  FaFileAlt,
  FaClock,
  FaCertificate,
} from "react-icons/fa";

const StatCards = () => {

  /*
   * =====================================================
   * CURRENT USER / STUDENT DATA
   * =====================================================
   *
   * Later this information will come from Django.
   *
   * Expected structure:
   *
   * {
   *   offerLetterStatus: "Uploaded",
   *   pendingReviews: 3,
   *   certificateStatus: "Uploaded"
   * }
   */

  let currentUser = null;

  try {

    const storedUser =
      localStorage.getItem("currentUser");

    if (storedUser) {
      currentUser = JSON.parse(storedUser);
    }

  } catch (error) {

    console.error(
      "Unable to read current user:",
      error
    );

  }


  /*
   * =====================================================
   * STUDENT STATISTICS
   * =====================================================
   */

  const offerLetterStatus =
    currentUser?.offerLetterStatus ||
    "Not Uploaded";

  const pendingReviews =
    Number(
      currentUser?.pendingReviews ?? 0
    );

  const certificateStatus =
    currentUser?.certificateStatus ||
    "Not Uploaded";


  /*
   * =====================================================
   * CARDS
   * =====================================================
   */

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


  /*
   * =====================================================
   * UI
   * =====================================================
   */

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