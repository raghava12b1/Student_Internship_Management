import DashboardLayout from "../../../layouts/DashboardLayout";
import "./Progress.css";
import BackButton from "../../../components/common/BackButton/BackButton";

const Progress = () => {

  /*
   * =====================================================
   * CURRENT USER / STUDENT DATA
   * =====================================================
   *
   * This is the frontend data structure.
   *
   * Later Django will provide these values from the
   * student's actual database record.
   *
   * Expected structure:
   *
   * {
   *   name: "Student Name",
   *   companyName: "Company Name",
   *   internshipRole: "Frontend Developer",
   *   internshipStartDate: "01 Jul 2026",
   *   internshipEndDate: "31 Aug 2026",
   *   progress: 70,
   *
   *   submissionTimeline: [
   *     {
   *       title: "Offer Letter",
   *       status: "Approved"
   *     }
   *   ],
   *
   *   coordinatorRemarks: "..."
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
   * =====================================================
   * INTERNSHIP DETAILS
   * =====================================================
   */

  const companyName =
    currentUser?.companyName || "--";

  const internshipRole =
    currentUser?.internshipRole || "--";

  const internshipStartDate =
    currentUser?.internshipStartDate || "--";

  const internshipEndDate =
    currentUser?.internshipEndDate || "--";


  /*
   * =====================================================
   * OVERALL PROGRESS
   * =====================================================
   */

  const progress = Number(
    currentUser?.progress ?? 0
  );

  const safeProgress = Math.min(
    100,
    Math.max(0, progress)
  );


  /*
   * =====================================================
   * SUBMISSION TIMELINE
   * =====================================================
   */

  const progressData = Array.isArray(
    currentUser?.submissionTimeline
  )
    ? currentUser.submissionTimeline
    : [];


  /*
   * =====================================================
   * COORDINATOR REMARKS
   * =====================================================
   */

  const coordinatorRemarks =
    currentUser?.coordinatorRemarks || "No remarks available.";


  /*
   * =====================================================
   * STATUS CLASS
   * =====================================================
   */

  const getStatusClass = (status) => {

    if (!status) {
      return "not-submitted";
    }

    return status
      .toLowerCase()
      .replace(/\s+/g, "-");
  };


  return (
    <DashboardLayout>

      <BackButton />

      <div className="progress-page">

        <h1>
          Internship Progress
        </h1>

        <p>
          Track your internship submission and approval status.
        </p>


        {/* =================================================
            INTERNSHIP DETAILS
        ================================================= */}

        <div className="progress-card">

          <h2>
            Internship Details
          </h2>

          <div className="details-grid">

            <div>

              <span>
                Company
              </span>

              <h3>
                {companyName}
              </h3>

            </div>


            <div>

              <span>
                Role
              </span>

              <h3>
                {internshipRole}
              </h3>

            </div>


            <div>

              <span>
                Duration
              </span>

              <h3>
                {internshipStartDate} - {internshipEndDate}
              </h3>

            </div>

          </div>

        </div>


        {/* =================================================
            OVERALL PROGRESS
        ================================================= */}

        <div className="progress-card">

          <h2>
            Overall Progress
          </h2>

          <div className="progress-bar">

            <div
              className="progress-fill"
              style={{
                width: `${safeProgress}%`,
              }}
            ></div>

          </div>

          <h3>
            {safeProgress}% Completed
          </h3>

        </div>


        {/* =================================================
            SUBMISSION TIMELINE
        ================================================= */}

        <div className="progress-card">

          <h2>
            Submission Timeline
          </h2>

          <div className="timeline">

            {progressData.length > 0 ? (

              progressData.map((item, index) => (

                <div
                  className="timeline-item"
                  key={item.id || index}
                >

                  <div className="timeline-title">

                    {item.title || "--"}

                  </div>


                  <div
                    className={`status ${getStatusClass(
                      item.status
                    )}`}
                  >

                    {item.status || "Not Submitted"}

                  </div>

                </div>

              ))

            ) : (

              <div className="timeline-empty">

                <p>
                  No submission data available.
                </p>

              </div>

            )}

          </div>

        </div>


        {/* =================================================
            COORDINATOR REMARKS
        ================================================= */}

        <div className="progress-card">

          <h2>
            Coordinator Remarks
          </h2>

          <p className="remarks">
            {coordinatorRemarks}
          </p>

        </div>

      </div>

    </DashboardLayout>
  );
};

export default Progress;