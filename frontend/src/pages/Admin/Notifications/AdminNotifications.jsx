import DashboardLayout from "../../../layouts/DashboardLayout";
import "./AdminNotifications.css";
import BackButton from "../../../components/common/BackButton/BackButton";

const notifications = [
  {
    id: 1,
    title: "New Student Registration",
    message: "Bala Krishna registered for internship.",
    time: "5 minutes ago",
    type: "Student",
  },
  {
    id: 2,
    title: "Offer Letter Approved",
    message: "Coordinator approved Rahul's offer letter.",
    time: "20 minutes ago",
    type: "Approval",
  },
  {
    id: 3,
    title: "Company Added",
    message: "Infosys has been added as a partner company.",
    time: "1 hour ago",
    type: "Company",
  },
  {
    id: 4,
    title: "Final Report Submitted",
    message: "Anjali submitted the final internship report.",
    time: "3 hours ago",
    type: "Report",
  },
  {
    id: 5,
    title: "Completion Certificate Uploaded",
    message: "Sravani uploaded the internship completion certificate.",
    time: "Yesterday",
    type: "Certificate",
  },
];

const AdminNotifications = () => {
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