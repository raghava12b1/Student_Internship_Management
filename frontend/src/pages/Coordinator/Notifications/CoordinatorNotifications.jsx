import DashboardLayout from "../../../layouts/DashboardLayout";
import "./CoordinatorNotifications.css";
import BackButton from "../../../components/common/BackButton/BackButton";
const notifications = [
  {
    id: 1,
    title: "New Offer Letter Uploaded",
    student: "Bala Krishna",
    time: "5 mins ago",
    type: "new",
  },
  {
    id: 2,
    title: "Weekly Report Submitted",
    student: "Rahul Kumar",
    time: "30 mins ago",
    type: "pending",
  },
  {
    id: 3,
    title: "Final Report Approved",
    student: "Priya Sharma",
    time: "2 hours ago",
    type: "approved",
  },
  {
    id: 4,
    title: "Certificate Rejected",
    student: "Anjali",
    time: "Yesterday",
    type: "rejected",
  },
];

const CoordinatorNotifications = () => {
  return (
    <DashboardLayout>
       <BackButton />
      <div className="notifications-page">

        <div className="page-header">
          <h1>Notifications</h1>
          <p>Latest internship activities and document updates.</p>
        </div>

        {notifications.map((item) => (
          <div className="notification-card" key={item.id}>

            <div className={`icon ${item.type}`}>
              🔔
            </div>

            <div className="notification-content">
              <h3>{item.title}</h3>
              <p>{item.student}</p>
            </div>

            <span>{item.time}</span>

          </div>
        ))}

      </div>
    </DashboardLayout>
  );
};

export default CoordinatorNotifications;