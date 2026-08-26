import "./StudentProfile.css";
import BackButton from "../../../components/common/BackButton/BackButton";

import {
  FaUserGraduate,
  FaIdCard,
  FaEnvelope,
  FaBuilding,
  FaGraduationCap,
  FaLayerGroup,
  FaCheckCircle,
  FaUniversity,
} from "react-icons/fa";

const StudentProfile = () => {

  /*
   * =====================================================
   * CURRENT USER / STUDENT DATA
   * =====================================================
   *
   * The frontend expects the logged-in student's data
   * inside currentUser.
   *
   * Later this will be populated from the Django backend.
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
   * =====================================================
   * STUDENT INFORMATION
   * =====================================================
   */

  const student = {
    name:
      currentUser?.name ||
      currentUser?.full_name ||
      "--",

    rollNumber:
      currentUser?.rollNumber ||
      currentUser?.roll_number ||
      "--",

    email:
      currentUser?.email ||
      "--",

    department:
      currentUser?.department ||
      "--",

    year:
      currentUser?.academicYear ||
      currentUser?.year ||
      "--",

    section:
      currentUser?.section ||
      "--",

    institution:
      currentUser?.institution ||
      "Aditya University",
  };


  /*
   * =====================================================
   * PROFILE DETAILS
   * =====================================================
   */

  const details = [
    {
      label: "Full Name",
      value: student.name,
      icon: <FaUserGraduate />,
    },

    {
      label: "Roll Number",
      value: student.rollNumber,
      icon: <FaIdCard />,
      className: "highlight-value",
    },

    {
      label: "Email Address",
      value: student.email,
      icon: <FaEnvelope />,
    },

    {
      label: "Department",
      value: student.department,
      icon: <FaBuilding />,
    },

    {
      label: "Academic Year",
      value: student.year,
      icon: <FaGraduationCap />,
    },

    {
      label: "Section",
      value: student.section,
      icon: <FaLayerGroup />,
    },
  ];


  return (
    <div className="student-profile">

      {/* =====================================================
          BACK BUTTON
      ===================================================== */}

      <div className="profile-back">
        <BackButton />
      </div>


      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="profile-header">

        <div className="profile-header-content">

          <span className="profile-eyebrow">
            Student Account
          </span>

          <h1>
            My Profile
          </h1>

          <p>
            View your personal, academic and university
            information associated with your internship account.
          </p>

        </div>


        <div className="profile-header-badge">

          <FaCheckCircle />

          <span>
            Account Active
          </span>

        </div>

      </div>


      {/* =====================================================
          MAIN PROFILE CARD
      ===================================================== */}

      <div className="profile-card">


        {/* ===================================================
            STUDENT IDENTITY
        =================================================== */}

        <aside className="profile-identity">

          <div className="avatar-wrapper">

            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                student.name
              )}&background=071a3a&color=ffffff&size=200&bold=true`}
              alt={`${student.name} profile`}
              className="profile-avatar-image"
            />

            <span className="avatar-status">
              <span></span>
            </span>

          </div>


          <div className="identity-info">

            <h2>
              {student.name}
            </h2>

            <p className="identity-role">

              <FaUserGraduate />

              Student

            </p>

          </div>


          <div className="identity-divider"></div>


          {/* =================================================
              UNIVERSITY
          ================================================= */}

          <div className="university-info">

            <div className="university-icon">

              <FaUniversity />

            </div>

            <div>

              <span>
                Institution
              </span>

              <strong>
                {student.institution}
              </strong>

            </div>

          </div>


          {/* =================================================
              PROFILE STATUS
          ================================================= */}

          <div className="identity-status">

            <FaCheckCircle />

            <div>

              <strong>
                Profile Verified
              </strong>

              <span>
                University account
              </span>

            </div>

          </div>

        </aside>


        {/* ===================================================
            PROFILE INFORMATION
        =================================================== */}

        <section className="profile-information">

          <div className="information-heading">

            <div>

              <span className="section-eyebrow">
                Account Information
              </span>

              <h3>
                Student Details
              </h3>

              <p>
                Your registered academic and contact information.
              </p>

            </div>

          </div>


          {/* =================================================
              STUDENT DETAILS
          ================================================= */}

          <div className="profile-details">

            {details.map((detail, index) => (

              <div
                className={`detail ${
                  detail.className || ""
                }`}
                key={index}
              >

                <div className="detail-icon">

                  {detail.icon}

                </div>


                <div className="detail-content">

                  <label>
                    {detail.label}
                  </label>

                  <span>
                    {detail.value}
                  </span>

                </div>

              </div>

            ))}

          </div>


          {/* =================================================
              ACCOUNT NOTE
          ================================================= */}

          <div className="profile-note">

            <div className="profile-note-icon">

              <FaCheckCircle />

            </div>

            <div>

              <strong>
                Information is managed by the university
              </strong>

              <p>
                If any personal or academic information is
                incorrect, please contact your department
                coordinator or university administration.
              </p>

            </div>

          </div>

        </section>

      </div>

    </div>
  );
};

export default StudentProfile;