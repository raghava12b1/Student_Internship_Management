import "./WelcomeCard.css";

const WelcomeCard = () => {

  /*
   * =====================================================
   * CURRENT USER
   * =====================================================
   *
   * Later this information will come from Django.
   *
   * Expected structure:
   *
   * {
   *   name: "Bala",
   *   role: "Student",
   *   progress: 70
   * }
   *
   */

  let currentUser = null;

  try {
    const storedUser = localStorage.getItem("currentUser");

    if (storedUser) {
      currentUser = JSON.parse(storedUser);
    }
  } catch (error) {
    console.error("Unable to read current user:", error);
  }

  /*
   * User name
   */

  const userName =
    currentUser?.name ||
    currentUser?.full_name ||
    localStorage.getItem("userName") ||
    "User";

  /*
   * Internship progress
   */

  const progress = Number(
    currentUser?.progress ?? 0
  );

  /*
   * Prevent invalid progress values
   */

  const safeProgress = Math.min(
    100,
    Math.max(0, progress)
  );

  return (
    <section className="welcome-card">

      {/* Decorative background */}

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
              <i></i> Active
            </span>

          </div>


          <div className="welcome-divider"></div>


          <div className="welcome-meta-item">

            <strong>
              Current Progress
            </strong>

            <span>
              {safeProgress}% Completed
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
              Up to date
            </small>

          </div>

        </div>


        {/* =====================================================
            PROGRESS CARD
        ===================================================== */}

        <div className="floating-card floating-card-bottom">

          <span>↗</span>

          <div>

            <strong>
              {safeProgress}%
            </strong>

            <small>
              Progress
            </small>

          </div>

        </div>

      </div>

    </section>
  );
};

export default WelcomeCard;