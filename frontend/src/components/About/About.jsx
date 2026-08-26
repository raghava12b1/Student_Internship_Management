import "./About.css";
import { Link } from "react-router-dom";

function About() {
  return (
    <section className="about-page">

      {/* =====================================================
          HERO — SMART INTERNSHIP MANAGEMENT
      ===================================================== */}

      <div className="about-hero">

        <div className="about-hero-grid"></div>

        <div className="about-hero-inner">

          <div className="about-eyebrow">
            <span className="about-eyebrow-line"></span>
            ADITYA UNIVERSITY
          </div>

          <div className="about-badge">
            Student Internship Management Portal
          </div>

          <h1>
            Smart Internship
            <span>Management.</span>
          </h1>

          <p>
            Our aim is to make internship management smarter,
            simpler, and more transparent — connecting students,
            coordinators, HODs, and administrators through one
            centralized digital platform.
          </p>

          <div className="about-hero-actions">

            <Link
              to="/"
              className="about-primary-btn"
            >
              Explore Portal
              <span>→</span>
            </Link>

            <div className="about-platform-status">
              <span></span>
              University Digital Platform
            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          OUR AIM
      ===================================================== */}

      <section className="about-introduction">

        <div className="about-section-container">

          <div className="about-section-heading">

            <span className="section-number">
              01
            </span>

            <div>

              <span className="section-kicker">
                OUR AIM
              </span>

              <h2>
                Making internships
                <br />
                <span>smart and simple.</span>
              </h2>

            </div>

          </div>


          <div className="about-introduction-content">

            <div className="about-large-text">

              Transforming traditional internship
              management into a connected digital
              experience.

            </div>


            <div className="about-description">

              <p>
                The Student Internship Management Portal is
                designed to bring the entire internship journey
                into one structured and intelligent platform.
              </p>

              <p>
                From internship registration and documentation
                to progress tracking, approvals, and faculty
                coordination, the system reduces manual work
                and provides better visibility for every
                stakeholder.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          WHAT WE SOLVE
      ===================================================== */}

      <section className="about-solutions">

        <div className="about-section-container">

          <div className="solutions-heading">

            <div>

              <span className="section-kicker">
                WHAT WE SOLVE
              </span>

              <h2>
                From manual processes
                <br />
                <span>to smart workflows.</span>
              </h2>

            </div>

            <p>
              The portal is built around the practical
              requirements of university internship management.
            </p>

          </div>


          <div className="solution-grid">

            <div className="solution-card">

              <div className="solution-number">
                01
              </div>

              <div className="solution-icon">
                🎓
              </div>

              <h3>
                Student Management
              </h3>

              <p>
                Students can manage internship information,
                applications, documents, and progress through
                one centralized dashboard.
              </p>

              <span className="solution-line"></span>

            </div>


            <div className="solution-card">

              <div className="solution-number">
                02
              </div>

              <div className="solution-icon">
                📊
              </div>

              <h3>
                Smart Progress Tracking
              </h3>

              <p>
                Monitor internship progress, submissions,
                approvals, and important activities through
                structured digital workflows.
              </p>

              <span className="solution-line"></span>

            </div>


            <div className="solution-card">

              <div className="solution-number">
                03
              </div>

              <div className="solution-icon">
                👨‍🏫
              </div>

              <h3>
                Faculty Coordination
              </h3>

              <p>
                Coordinators and HODs can monitor student
                activities, review information, and manage
                internship processes efficiently.
              </p>

              <span className="solution-line"></span>

            </div>


            <div className="solution-card">

              <div className="solution-number">
                04
              </div>

              <div className="solution-icon">
                🔐
              </div>

              <h3>
                Role-Based Access
              </h3>

              <p>
                Dedicated dashboards provide relevant access
                for students, coordinators, HODs, and
                administrators.
              </p>

              <span className="solution-line"></span>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          ECOSYSTEM
      ===================================================== */}

      <section className="about-ecosystem">

        <div className="about-section-container">

          <div className="ecosystem-top">

            <div>

              <span className="section-kicker">
                THE ECOSYSTEM
              </span>

              <h2>
                Four roles.
                <br />
                <span>One smart system.</span>
              </h2>

            </div>

            <p>
              Every stakeholder gets a dedicated experience
              while remaining connected to the same internship
              workflow.
            </p>

          </div>


          <div className="ecosystem-grid">

            <div className="ecosystem-item">

              <span className="ecosystem-index">
                01
              </span>

              <div className="ecosystem-icon">
                🎓
              </div>

              <h3>
                Students
              </h3>

              <p>
                Manage internship activities, documents,
                applications, and progress.
              </p>

            </div>


            <div className="ecosystem-item">

              <span className="ecosystem-index">
                02
              </span>

              <div className="ecosystem-icon">
                👨‍🏫
              </div>

              <h3>
                Coordinators
              </h3>

              <p>
                Coordinate internship activities and monitor
                student progress.
              </p>

            </div>


            <div className="ecosystem-item">

              <span className="ecosystem-index">
                03
              </span>

              <div className="ecosystem-icon">
                🏢
              </div>

              <h3>
                HOD
              </h3>

              <p>
                Maintain department-level visibility and
                oversee internship operations.
              </p>

            </div>


            <div className="ecosystem-item">

              <span className="ecosystem-index">
                04
              </span>

              <div className="ecosystem-icon">
                ⚙️
              </div>

              <h3>
                Administrators
              </h3>

              <p>
                Manage the overall platform and institutional
                internship processes.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          SMART APPROACH
      ===================================================== */}

      <section className="about-vision">

        <div className="vision-background"></div>

        <div className="about-section-container">

          <div className="vision-content">

            <span className="section-kicker">
              OUR APPROACH
            </span>

            <h2>
              Internship management should be
              <span>
                simpler, smarter, and more transparent.
              </span>
            </h2>

            <p>
              Instead of depending on disconnected documents,
              spreadsheets, messages, and manual follow-ups,
              the platform creates a unified digital workflow
              where internship information can be organized,
              monitored, reviewed, and managed efficiently.
            </p>

            <div className="vision-accent"></div>

          </div>

        </div>

      </section>


      {/* =====================================================
          VALUES
      ===================================================== */}

      <section className="about-values">

        <div className="about-section-container">

          <div className="values-heading">

            <span className="section-kicker">
              BUILT AROUND
            </span>

            <h2>
              Principles that
              <span>matter.</span>
            </h2>

          </div>


          <div className="values-grid">

            <div className="value-card">

              <span>
                01
              </span>

              <h3>
                Clarity
              </h3>

              <p>
                Keep internship information structured,
                accessible, and easy to understand.
              </p>

            </div>


            <div className="value-card">

              <span>
                02
              </span>

              <h3>
                Efficiency
              </h3>

              <p>
                Reduce repetitive manual work through
                streamlined digital workflows.
              </p>

            </div>


            <div className="value-card">

              <span>
                03
              </span>

              <h3>
                Transparency
              </h3>

              <p>
                Provide stakeholders with clear visibility
                into internship activities and progress.
              </p>

            </div>


            <div className="value-card">

              <span>
                04
              </span>

              <h3>
                Security
              </h3>

              <p>
                Keep access organized through role-based
                authentication and controlled dashboards.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="about-cta">

        <div className="cta-inner">

          <div className="cta-number">
            05
          </div>

          <div className="cta-content">

            <span className="section-kicker">
              READY TO BEGIN?
            </span>

            <h2>
              Make your internship journey
              <span>smarter.</span>
            </h2>

            <p>
              Access the Student Internship Management Portal
              and take control of your internship experience.
            </p>

            <Link
              to="/"
              className="cta-button"
            >
              Get Started
              <span>→</span>
            </Link>

          </div>

        </div>

      </section>

    </section>
  );
}

export default About;