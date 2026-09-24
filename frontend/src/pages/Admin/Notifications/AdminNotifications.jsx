import DashboardLayout from "../../../layouts/DashboardLayout";
import "./AdminNotifications.css";
import BackButton from "../../../components/common/BackButton/BackButton";
import { useEffect, useState } from "react";
import { getAdminDashboard } from "../../../services/api";

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    getAdminDashboard()
      .then((data) => setNotifications(data.recent_notifications || []))
      .catch(() => setNotifications([]));
  }, []);

  return (
    <DashboardLayout>
       <BackButton />

      <div className="admin-notifications">

        <div className="page-header">
          <h1>Notifications</h1>
          <p>Latest activities across the Internship Management System.</p>
        </div>

        <div className="notification-list">

          {notifications.map((item) => (

            <div
              className="notification-card"
              key={item.id}
            >

              <div className="notification-icon">
                🔔
              </div>

              <div className="notification-content">

                <h3>{item.title}</h3>

                <p>{item.message}</p>

                <span>{item.type} • {item.time}</span>

              </div>

            </div>

          ))}

        </div>

      </div>

    </DashboardLayout>
  );
};

export default AdminNotifications;