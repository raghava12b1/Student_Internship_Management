import { useState } from "react";
import "./Contact.css";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Student",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    alert("Thank you! Your message has been submitted.");

    setFormData({
      name: "",
      email: "",
      role: "Student",
      subject: "",
      message: "",
    });
  };

  return (
    <section className="contact-page">

      {/* =====================================================
          CONTACT HERO
      ===================================================== */}

      <section className="contact-hero">

        <div className="contact-hero-grid"></div>

        <div className="contact-hero-inner">

          <div className="contact-eyebrow">
            <span className="contact-eyebrow-line"></span>
            ADITYA UNIVERSITY
          </div>

          <div className="contact-badge">
            Student Internship Management Portal
          </div>

          <h1>
            Let's Stay
            <span>Connected.</span>
          </h1>

          <p>
            Have a question about internships, portal access,
            applications, or support? Reach out to the
            appropriate university team.
          </p>

          <div className="contact-status">
            <span className="contact-status-dot"></span>
            University Support & Communication
          </div>

        </div>

      </section>


      {/* =====================================================
          CONTACT INFORMATION
      ===================================================== */}

      <section className="contact-information">

        <div className="contact-container">

          <div className="contact-section-heading">

            <div>

              <span className="contact-section-kicker">
                GET IN TOUCH
              </span>

              <h2>
                We're here to
                <span>help.</span>
              </h2>

            </div>

            <p>
              Whether you are a student, coordinator, HOD,
              or administrator, use the information below
              to connect with the university.
            </p>

          </div>


          <div className="contact-cards">

            {/* CARD 1 */}

            <div className="contact-card">

              <div className="contact-card-number">
                01
              </div>

              <div className="contact-card-icon">
                ✉
              </div>

              <span className="contact-card-label">
                EMAIL
              </span>

              <h3>
                Internship Support
              </h3>

              <p>
                For internship-related questions,
                applications, and portal assistance.
              </p>

              <a href="mailto:internships@adityauniversity.in">
                internships@adityauniversity.in
              </a>

            </div>


            {/* CARD 2 */}

            <div className="contact-card">

              <div className="contact-card-number">
                02
              </div>

              <div className="contact-card-icon">
                ☎
              </div>

              <span className="contact-card-label">
                PHONE
              </span>

              <h3>
                University Support
              </h3>

              <p>
                Contact the university support team
                for assistance during working hours.
              </p>

              <a href="tel:+918842327000">
                +91 8842 327 000
              </a>

            </div>


            {/* CARD 3 */}

            <div className="contact-card">

              <div className="contact-card-number">
                03
              </div>

              <div className="contact-card-icon">
                ⌖
              </div>

              <span className="contact-card-label">
                LOCATION
              </span>

              <h3>
                Aditya University
              </h3>

              <p>
                Surampalem, Kakinada District,
                Andhra Pradesh, India.
              </p>

              <span className="contact-location-text">
                University Campus
              </span>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          CONTACT FORM
      ===================================================== */}

      <section className="contact-form-section">

        <div className="contact-container">

          <div className="contact-form-wrapper">

            {/* LEFT */}

            <div className="contact-form-info">

              <span className="contact-section-kicker">
                SEND A MESSAGE
              </span>

              <div className="contact-form-number">
                04
              </div>

              <h2>
                Have something
                <span>to ask?</span>
              </h2>

              <p>
                Send us your query and provide the relevant
                details. Our team can use your information
                to understand and respond to your request.
              </p>


              <div className="contact-form-divider"></div>


              <div className="contact-form-point">

                <span>✓</span>

                <div>
                  <strong>
                    Student Support
                  </strong>

                  <small>
                    Internship registration and tracking
                  </small>
                </div>

              </div>


              <div className="contact-form-point">

                <span>✓</span>

                <div>
                  <strong>
                    Faculty Coordination
                  </strong>

                  <small>
                    Internship monitoring and approvals
                  </small>
                </div>

              </div>


              <div className="contact-form-point">

                <span>✓</span>

                <div>
                  <strong>
                    Portal Assistance
                  </strong>

                  <small>
                    Account and system-related queries
                  </small>
                </div>

              </div>

            </div>


            {/* RIGHT FORM */}

            <div className="contact-form-content">

              <form onSubmit={handleSubmit}>

                <div className="contact-form-row">

                  <div className="contact-field">

                    <label>
                      Full Name *
                    </label>

                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                    />

                  </div>


                  <div className="contact-field">

                    <label>
                      Email Address *
                    </label>

                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                    />

                  </div>

                </div>


                <div className="contact-form-row">

                  <div className="contact-field">

                    <label>
                      Your Role
                    </label>

                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                    >

                      <option value="Student">
                        Student
                      </option>

                      <option value="Coordinator">
                        Coordinator
                      </option>

                      <option value="HOD">
                        HOD
                      </option>

                      <option value="Admin">
                        Administrator
                      </option>

                    </select>

                  </div>


                  <div className="contact-field">

                    <label>
                      Subject *
                    </label>

                    <input
                      type="text"
                      name="subject"
                      placeholder="What is this regarding?"
                      value={formData.subject}
                      onChange={handleChange}
                    />

                  </div>

                </div>


                <div className="contact-field">

                  <label>
                    Message *
                  </label>

                  <textarea
                    name="message"
                    rows="6"
                    placeholder="Write your message here..."
                    value={formData.message}
                    onChange={handleChange}
                  ></textarea>

                </div>


                <div className="contact-submit-area">

                  <span>
                    Your information will be used only
                    for responding to your request.
                  </span>

                  <button
                    type="submit"
                    className="contact-submit-btn"
                  >
                    Send Message
                    <span>→</span>
                  </button>

                </div>

              </form>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          SUPPORT ROLES
      ===================================================== */}

      <section className="contact-support">

        <div className="contact-container">

          <div className="support-heading">

            <span className="contact-section-kicker">
              WHO CAN HELP?
            </span>

            <h2>
              The right support
              <span>for every role.</span>
            </h2>

          </div>


          <div className="support-grid">

            <div className="support-item">

              <span>01</span>

              <div className="support-icon">
                🎓
              </div>

              <h3>
                Students
              </h3>

              <p>
                Internship registration, documents,
                applications, progress, and portal access.
              </p>

            </div>


            <div className="support-item">

              <span>02</span>

              <div className="support-icon">
                👨‍🏫
              </div>

              <h3>
                Coordinators
              </h3>

              <p>
                Student monitoring, internship coordination,
                reviews, and approvals.
              </p>

            </div>


            <div className="support-item">

              <span>03</span>

              <div className="support-icon">
                🏢
              </div>

              <h3>
                HOD
              </h3>

              <p>
                Department-level internship management,
                monitoring, and reporting.
              </p>

            </div>


            <div className="support-item">

              <span>04</span>

              <div className="support-icon">
                ⚙️
              </div>

              <h3>
                Administrators
              </h3>

              <p>
                Platform management, user administration,
                and system-level assistance.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="contact-cta">

        <div className="contact-cta-inner">

          <span className="contact-section-kicker">
            ADITYA UNIVERSITY
          </span>

          <h2>
            Your internship.
            <span>Connected.</span>
          </h2>

          <p>
            A smarter way to manage the complete
            internship journey.
          </p>

          <a
            href="mailto:internships@adityauniversity.in"
            className="contact-cta-button"
          >
            Contact Support
            <span>→</span>
          </a>

        </div>

      </section>

    </section>
  );
}

export default Contact;