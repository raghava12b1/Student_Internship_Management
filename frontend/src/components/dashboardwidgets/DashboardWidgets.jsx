import "./DashboardWidgets.css";

import {
  FaBell,
  FaCalendarAlt,
} from "react-icons/fa";


const DashboardWidgets = ({ dashboardData }) => {

  // ============================================================
  // UPCOMING DEADLINES FROM DJANGO
  // ============================================================

  const deadlines = Array.isArray(
    dashboardData?.deadlines
  )
    ? dashboardData.deadlines
    : [];


  // ============================================================
  // NOTIFICATIONS FROM DJANGO
  // ============================================================

  const notifications = Array.isArray(
    dashboardData?.recent_notifications
  )
    ? dashboardData.recent_notifications
    : [];


  // ============================================================
  // UI
  // ============================================================

  return (

    <div className="widgets-grid">

      {/* =====================================================
          UPCOMING DEADLINES
      ===================================================== */}

      <div className="widget-card">

        <div className="widget-title">

          <FaCalendarAlt />

          <h3>
            Upcoming Deadline
          </h3>

        </div>


        {deadlines.length > 0 ? (

          deadlines.map((deadline, index) => (

            <div
              className="widget-item"
              key={deadline.id || index}
            >

              <strong>
                {deadline.title || "Internship"}
              </strong>

              <p>
                {deadline.description || "--"}
              </p>

            </div>

          ))

        ) : (

          <div className="widget-item">

            <p>
              No upcoming deadlines.
            </p>

          </div>

        )}

      </div>


      {/* =====================================================
          NOTIFICATIONS
      ===================================================== */}

      <div className="widget-card">

        <div className="widget-title">

          <FaBell />

          <h3>
            Notifications
          </h3>

        </div>


        {notifications.length > 0 ? (

          notifications.map((notification, index) => (

            <div
              className="widget-item"
              key={notification.id || index}
            >

              <strong>
                {notification.sender ||
                  notification.title ||
                  "Notification"}
              </strong>

              <p>
                {notification.message ||
                  notification.description ||
                  "--"}
              </p>

            </div>

          ))

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