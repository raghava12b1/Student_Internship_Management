import { useEffect, useState } from "react";

import DashboardLayout from "../../../layouts/DashboardLayout";
import "./CoordinatorNotifications.css";
import BackButton from "../../../components/common/BackButton/BackButton";


const API_BASE_URL =
  "http://127.0.0.1:8000/api";


const CoordinatorNotifications = () => {

  const [notifications, setNotifications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // ============================================================
  // GET ACCESS TOKEN
  // ============================================================

  const getAccessToken = () => {

    return (
      localStorage.getItem("accessToken") ||
      localStorage.getItem("access_token") ||
      localStorage.getItem("access")
    );

  };


  // ============================================================
  // FETCH NOTIFICATIONS
  // ============================================================

  useEffect(() => {

    const fetchNotifications = async () => {

      try {

        setLoading(true);
        setError("");


        const accessToken =
          getAccessToken();


        if (!accessToken) {

          setError(
            "Access token not found. Please login again."
          );

          setLoading(false);

          return;
        }


        const response = await fetch(
          `${API_BASE_URL}/notifications/`,
          {
            method: "GET",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${accessToken}`,
            },
          }
        );


        // ======================================================
        // SESSION EXPIRED
        // ======================================================

        if (response.status === 401) {

          setError(
            "Your login session has expired. Please login again."
          );

          setLoading(false);

          return;
        }


        // ======================================================
        // OTHER SERVER ERRORS
        // ======================================================

        if (!response.ok) {

          throw new Error(
            `Server returned ${response.status}`
          );

        }


        const data =
          await response.json();


        // ======================================================
        // HANDLE DIFFERENT DRF RESPONSE FORMATS
        // ======================================================

        let notificationList = [];


        if (Array.isArray(data)) {

          notificationList = data;

        } else if (
          Array.isArray(data.results)
        ) {

          notificationList =
            data.results;

        } else if (
          Array.isArray(data.notifications)
        ) {

          notificationList =
            data.notifications;

        }


        setNotifications(
          notificationList
        );

      } catch (err) {

        console.error(
          "Unable to load notifications:",
          err
        );

        setError(
          "Unable to connect to Django server. Please make sure Django is running."
        );

      } finally {

        setLoading(false);

      }

    };


    fetchNotifications();

  }, []);


  // ============================================================
  // HELPERS
  // ============================================================

  const getNotificationTitle = (
    notification
  ) => {

    return (
      notification.title ||
      notification.message ||
      notification.notification ||
      "Notification"
    );

  };


  const getStudentName = (
    notification
  ) => {

    return (
      notification.student_name ||
      notification.student?.name ||
      notification.student?.full_name ||
      notification.user?.name ||
      notification.user?.username ||
      "--"
    );

  };


  const getNotificationTime = (
    notification
  ) => {

    return (
      notification.time ||
      notification.created_at ||
      notification.created_on ||
      "--"
    );

  };


  const getNotificationType = (
    notification
  ) => {

    return (
      notification.type ||
      notification.notification_type ||
      "new"
    );

  };


  return (

    <DashboardLayout>

      <BackButton />


      <div className="notifications-page">


        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="page-header">

          <h1>
            Notifications
          </h1>

          <p>
            Latest internship activities and document updates.
          </p>

        </div>


        {/* ==================================================
            LOADING
        ================================================== */}

        {loading && (

          <div className="notification-card">

            <div className="notification-content">

              <h3>
                Loading notifications...
              </h3>

              <p>
                Fetching notifications from the Django backend.
              </p>

            </div>

          </div>

        )}


        {/* ==================================================
            ERROR
        ================================================== */}

        {!loading && error && (

          <div className="notification-card">

            <div className="notification-content">

              <h3>
                Unable to Load Notifications
              </h3>

              <p
                style={{
                  color: "#dc2626",
                }}
              >
                {error}
              </p>

            </div>

          </div>

        )}


        {/* ==================================================
            EMPTY STATE
        ================================================== */}

        {!loading &&
          !error &&
          notifications.length === 0 && (

            <div className="notification-card">

              <div className="notification-content">

                <h3>
                  No Notifications
                </h3>

                <p>
                  There are no new notifications.
                </p>

              </div>

            </div>

          )}


        {/* ==================================================
            NOTIFICATIONS
        ================================================== */}

        {!loading &&
          !error &&
          notifications.map(
            (item, index) => (

              <div
                className="notification-card"
                key={
                  item.id ||
                  item.pk ||
                  index
                }
              >

                <div
                  className={`icon ${
                    getNotificationType(item)
                  }`}
                >
                  🔔
                </div>


                <div className="notification-content">

                  <h3>
                    {getNotificationTitle(item)}
                  </h3>

                  <p>
                    {getStudentName(item)}
                  </p>

                </div>


                <span>
                  {getNotificationTime(item)}
                </span>

              </div>

            )
          )}

      </div>

    </DashboardLayout>

  );

};


export default CoordinatorNotifications;