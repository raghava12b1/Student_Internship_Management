import "./WelcomeCard.css";

const WelcomeCard = ({ dashboardData }) => {

  // ============================================================
  // STUDENT INFORMATION FROM DJANGO
  // ============================================================

  const student = dashboardData?.student || {};

  const userName =
    student.name ||
    student.username ||
    localStorage.getItem("userName") ||
    "User";


  // ============================================================
  // INTERNSHIP INFORMATION
  // ============================================================

  const internshipCount =
    Number(
      dashboardData?.statistics?.internships || 0
    );


  // ============================================================
  // CURRENT INTERNSHIP STATUS
  // ============================================================

  const internshipStatus =
    internshipCount > 0
      ? "Internship Assigned"
      : "No Internship Assigned";


  // ============================================================
  // OFFER LETTER STATUS
  // ============================================================

  const offerLetterUploaded =
    dashboardData?.documents?.offer_letter_uploaded || false;


  return (

    <section className="welcome-card">

      {/* =====================================================
          DECORATIVE BACKGROUND
      ===================================================== */}

      <div className="welcome-glow welcome-glow-one"></div>

      <div className="welcome-glow welcome-glow-two"></div>

      <div className="welcome-grid"></div>


      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="welcome-content">

        <div className="welcome-badge">

          <span className="welcome-status-dot"></span>

          Internship Portal

        </div>


        <h2>

          Good Morning, <span>{userName}</span> 👋

        </h2>


        <p>

          Welcome back to the Student Internship Management System.

          Track your internship progress, submit reports, manage

          documents and stay updated with your academic requirements.

        </p>


        {/* =====================================================
            META INFORMATION
        ===================================================== */}

        <div className="welcome-meta">

          <div className="welcome-meta-item">

            <strong>
              Internship Status
            </strong>

            <span>

              <i></i>

              {internshipStatus}

            </span>

          </div>


          <div className="welcome-divider"></div>


          <div className="welcome-meta-item">

            <strong>
              Current Progress
            </strong>

            <span>
              Progress will appear here
            </span>

          </div>

        </div>

      </div>


      {/* =====================================================
          VISUAL
      ===================================================== */}

      <div className="welcome-visual">

        <div className="visual-circle visual-circle-one"></div>

        <div className="visual-circle visual-circle-two"></div>


        <div className="welcome-icon-box">

          <div className="welcome-icon">
            🎓
          </div>

        </div>


        {/* =====================================================
            DOCUMENT CARD
        ===================================================== */}

        <div className="floating-card floating-card-top">

          <span>✓</span>

          <div>

            <strong>
              Documents
            </strong>

            <small>

              {offerLetterUploaded
                ? "Offer letter uploaded"
                : "No offer letter"}

            </small>

          </div>

        </div>


        {/* =====================================================
            INTERNSHIP CARD
        ===================================================== */}

        <div className="floating-card floating-card-bottom">

          <span>↗</span>

          <div>

            <strong>
              {internshipCount}
            </strong>

            <small>
              Internship
            </small>

          </div>

        </div>

      </div>

    </section>

  );

};

export default WelcomeCard;