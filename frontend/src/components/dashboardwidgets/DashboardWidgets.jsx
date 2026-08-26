import "./DashboardWidgets.css";
import { FaBell, FaCalendarAlt } from "react-icons/fa";

const DashboardWidgets = () => {

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
   *   companyName: "TCS",
   *   internshipEndDate: "30 Sep 2026",
   *
   *   notifications: [
   *     {
   *       sender: "Coordinator",
   *       message: "Your notification message."
   *     }
   *   ]
   * }
   *
   */

  let currentUser = null;

  try {

    const storedUser =
      localStorage.getItem("currentUser");

    if (storedUser) {
      currentUser =
        JSON.parse(storedUser);
    }

  } catch (error) {

    console.error(
      "Unable to read current user:",
      error
    );

  }


  /*
   * =====================================================
   * INTERNSHIP INFORMATION
   * =====================================================
   */

  const companyName =
    currentUser?.companyName ||
    "No company assigned";

  const internshipEndDate =
    currentUser?.internshipEndDate ||
    "--";


  /*
   * =====================================================
   * NOTIFICATIONS
   * =====================================================
   */

  const notifications =
    Array.isArray(
      currentUser?.notifications
    )
      ? currentUser.notifications
      : [];


  return (

    <div className="widgets-grid">


      {/* =================================================
          UPCOMING DEADLINES
      ================================================= */}

      <div className="widget-card">

        <div className="widget-title">

          <FaCalendarAlt />

          <h3>
            Upcoming Deadline
          </h3>

        </div>


        <div className="widget-item">

          <strong>
            {companyName}
          </strong>

          <p>
            Internship End Date - {internshipEndDate}
          </p>

        </div>

      </div>


      {/* =================================================
          NOTIFICATIONS
      ================================================= */}

      <div className="widget-card">

        <div className="widget-title">

          <FaBell />

          <h3>
            Notifications
          </h3>

        </div>


        {notifications.length > 0 ? (

          notifications.map(
            (notification, index) => (

              <div
                className="widget-item"
                key={
                  notification.id ||
                  index
                }
              >

                <strong>
                  {
                    notification.sender ||
                    "Notification"
                  }
                </strong>

                <p>
                  {
                    notification.message ||
                    "--"
                  }
                </p>

              </div>

            )

          )

        ) : (

          <div className="widget-item">

            <p>
              No new notifications.
            </p>

          </div>

        )}

      </div>

    </div>

  );

};

export default DashboardWidgets;