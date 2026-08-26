import "./NotificationDropdown.css";

const NotificationDropdown = ({ notifications = [] }) => {

  return (

    <div className="notification-dropdown">

      <h4>
        Notifications
      </h4>


      {notifications.length === 0 ? (

        <div className="notification-empty">

          <p>
            No notifications available.
          </p>

        </div>

      ) : (

        notifications.map((item) => (

          <div
            className="notification-item"
            key={item.id}
          >

            <h5>
              {item.title}
            </h5>

            <p>
              {item.time}
            </p>

          </div>

        ))

      )}


      <button className="view-all-btn">
        View All
      </button>

    </div>

  );

};

export default NotificationDropdown;