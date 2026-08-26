import DashboardLayout from "../../../layouts/DashboardLayout";
import "./HODNotifications.css";
import BackButton from "../../../components/common/BackButton/BackButton";
const notifications = [
  {
    id: 1,
    title: "Offer Letter Approved",
    message: "Bala Krishna's offer letter has been approved by the coordinator.",
    time: "10 Minutes Ago",
    type: "Success",
  },
  {
    id: 2,
    title: "Final Report Pending",
    message: "Rahul's final internship report is waiting for HOD approval.",
    time: "45 Minutes Ago",
    type: "Pending",
  },
  {
    id: 3,
    title: "Completion Certificate Uploaded",
    message: "Anjali uploaded her internship completion certificate.",
    time: "2 Hours Ago",
    type: "Information",
  },
  {
    id: 4,
    title: "New Internship Registration",
    message: "A new student has registered for internship tracking.",
    time: "Today",
    type: "New",
  },
];

const HODNotifications = () => {
  return (
    <DashboardLayout>
       <BackButton />
      <div className="hod-notifications">

        <div className="page-header">
          <h1>Notifications</h1>
          <p>
            Stay updated with department internship activities.
          </p>
        </div>

        <div className="notification-list">

          {notifications.map((notification) => (

            <div
              className="notification-card"
              key={notification.id}
            >

              <div className="notification-left">

                <div className="notification-icon">
                  🔔
                </div>

              </div>

              <div className="notification-content">

                <h3>{notification.title}</h3>

                <p>{notification.message}</p>

                <span>{notification.time}</span>

              </div>

              <div className="notification-type">
                {notification.type}
              </div>

            </div>

          ))}

        </div>

      </div>
    </DashboardLayout>
  );
};

export default HODNotifications;