import { Link } from "react-router-dom";
import "./Developers.css";

import maahiImage from "../../assets/images/maahi.jpg";
import balaImage from "../../assets/images/bala.jpg";

function Developers() {
  return (
    <section className="developers-page">

      {/* =====================================================
          BACKGROUND EFFECTS
      ===================================================== */}

      <div className="developers-glow developers-glow-one"></div>
      <div className="developers-glow developers-glow-two"></div>
      <div className="developers-grid-pattern"></div>


      <div className="developers-container">

        {/* =====================================================
            BACK BUTTON
        ===================================================== */}

        <Link to="/" className="developers-back">
          <span className="back-arrow">←</span>
          <span>Back to Portal</span>
        </Link>


        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="developers-header">

          <div className="developers-eyebrow">
            <span className="eyebrow-line"></span>

            DEVELOPMENT TEAM

            <span className="eyebrow-line"></span>
          </div>


          <h1>
            Meet the
            <span>Developers</span>
          </h1>


          <p>
            The team behind the Student Internship Management Portal,
            building a modern platform to simplify internship management
            across the university.
          </p>

        </div>


        {/* =====================================================
            DEVELOPERS GRID
        ===================================================== */}

        <div className="developers-grid">


          {/* =================================================
              MEMBER 01 - BALA
          ================================================= */}

          <div className="developer-card">

            <div className="developer-number">
              01
            </div>


            {/* IMAGE */}

            <div className="developer-image-wrapper">

              <div className="developer-image-ring"></div>

              <img
                src={maahiImage}
                alt="Mahendra Balla"
                className="developer-image"
              />

              <div className="image-status">
                <span></span>
                Developer
              </div>

            </div>


            {/* INFORMATION */}

            <div className="developer-info">

              <div className="developer-role">
                FULL STACK DEVELOPER
              </div>

              <h2>
                Mahendra Balla
              </h2>

              <div className="developer-line"></div>

              <p>
                Responsible for application architecture,
                frontend development, backend integration
                and overall system functionality.
              </p>

            </div>


            {/* CARD FOOTER */}

            <div className="developer-bottom">

              <span className="developer-index">
                TEAM MEMBER 01
              </span>


              {/* LINKEDIN */}

              <a
                href="https://www.linkedin.com/in/mahendra-balla-b17694297/"
                target="_blank"
                rel="noopener noreferrer"
                className="developer-linkedin"
                aria-label="Bala LinkedIn profile"
              >

                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >

                  <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.44-2.13 2.94v5.67H9.35V8.99h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.3zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM3.56 20.45h3.57V8.99H3.56v11.46zM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46C23.21 24 24 23.23 24 22.28V1.72C24 .77 23.21 0 22.23 0z" />

                </svg>

              </a>

            </div>


            <div className="developer-accent"></div>

          </div>



          {/* =================================================
              MEMBER 02 - MAHI
          ================================================= */}

          <div className="developer-card">

            <div className="developer-number">
              02
            </div>


            {/* IMAGE */}

            <div className="developer-image-wrapper">

              <div className="developer-image-ring"></div>

              <img
                src={balaImage}
                alt="Bala Kagitalapalli"
                className="developer-image"
              />

              <div className="image-status">
                <span></span>
                Developer
              </div>

            </div>


            {/* INFORMATION */}

            <div className="developer-info">

              <div className="developer-role">
                FRONTEND DEVELOPER
              </div>

              <h2>
                Bala Kagitalapalli
              </h2>

              <div className="developer-line"></div>

              <p>
                Focused on modern interface design,
                responsive layouts, animations and
                delivering a smooth user experience.
              </p>

            </div>


            {/* CARD FOOTER */}

            <div className="developer-bottom">

              <span className="developer-index">
                TEAM MEMBER 02
              </span>


              {/* LINKEDIN */}

              <a
                href="https://www.linkedin.com/in/bala-kagitalapalli-205172291/"
                target="_blank"
                rel="noopener noreferrer"
                className="developer-linkedin"
                aria-label="Mahendra LinkedIn profile"
              >

                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >

                  <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.44-2.13 2.94v5.67H9.35V8.99h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.3zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM3.56 20.45h3.57V8.99H3.56v11.46zM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46C23.21 24 24 23.23 24 22.28V1.72C24 .77 23.21 0 22.23 0z" />

                </svg>

              </a>

            </div>


            <div className="developer-accent"></div>

          </div>



          {/* =================================================
              MEMBER 03
          ================================================= */}

          <div className="developer-card">

            <div className="developer-number">
              03
            </div>


            {/* IMAGE */}

            <div className="developer-image-wrapper">

              <div className="developer-image-ring"></div>

              <img
                src={maahiImage}
                alt="Developer Three"
                className="developer-image"
              />

              <div className="image-status">
                <span></span>
                Developer
              </div>

            </div>


            {/* INFORMATION */}

            <div className="developer-info">

              <div className="developer-role">
                BACKEND DEVELOPER
              </div>

              <h2>
                Developer Three
              </h2>

              <div className="developer-line"></div>

              <p>
                Responsible for backend services,
                database integration, APIs and
                reliable application functionality.
              </p>

            </div>


            {/* CARD FOOTER */}

            <div className="developer-bottom">

              <span className="developer-index">
                TEAM MEMBER 03
              </span>


              {/* LINKEDIN */}

              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="developer-linkedin"
                aria-label="Developer Three LinkedIn profile"
              >

                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >

                  <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.44-2.13 2.94v5.67H9.35V8.99h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.3zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM3.56 20.45h3.57V8.99H3.56v11.46zM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46C23.21 24 24 23.23 24 22.28V1.72C24 .77 23.21 0 22.23 0z" />

                </svg>

              </a>

            </div>


            <div className="developer-accent"></div>

          </div>

        </div>



        {/* =====================================================
            FOOTER
        ===================================================== */}

        <div className="developers-footer">

          <div className="footer-line"></div>

          <p>
            Designed & Developed with
            <span> precision </span>
            for
            <strong> Aditya University</strong>
          </p>

          <div className="footer-line"></div>

        </div>

      </div>

    </section>
  );
}

export default Developers;