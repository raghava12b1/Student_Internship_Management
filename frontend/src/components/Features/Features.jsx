import "./Features.css";
import { FaUserGraduate, FaBuilding, FaUserShield } from "react-icons/fa";

function Features() {
  return (
    <section className="features">
      <div className="container">

        <div className="section-title">
          <h2>Why Choose SIMS?</h2>
          <p>
            One platform for students, companies and administrators.
          </p>
        </div>

        <div className="feature-cards">

          <div className="feature-card">
            <FaUserGraduate className="feature-icon" />
            <h3>Student Portal</h3>
            <p>
              Search internships, apply online and track your applications easily.
            </p>
          </div>

          <div className="feature-card">
            <FaBuilding className="feature-icon" />
            <h3>Company Portal</h3>
            <p>
              Post internships, manage applicants and recruit talented students.
            </p>
          </div>

          <div className="feature-card">
            <FaUserShield className="feature-icon" />
            <h3>Admin Portal</h3>
            <p>
              Manage students, companies and internship activities efficiently.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}

export default Features;