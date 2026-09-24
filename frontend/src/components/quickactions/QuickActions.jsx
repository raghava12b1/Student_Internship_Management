import "./QuickActions.css";

import { useNavigate } from "react-router-dom";

import {
  FaFileAlt,
  FaCertificate,
  FaChartLine,
} from "react-icons/fa";


const QuickActions = () => {

  const navigate = useNavigate();


  const actions = [

    {
      icon: <FaFileAlt />,
      title: "Upload Offer Letter",
      path: "/student/offer-letter",
    },

    {
      icon: <FaFileAlt />,
      title: "Upload Final Report",
      path: "/student/final-report",
    },

    {
      icon: <FaCertificate />,
      title: "Upload Certificate",
      path: "/student/certificate",
    },

    {
      icon: <FaChartLine />,
      title: "View Progress",
      path: "/student/progress",
    },

  ];


  return (

    <div className="quick-actions">

      <h2>
        Quick Actions
      </h2>


      <div className="actions-grid">

        {actions.map((action, index) => (

          <button
            key={index}
            className="action-card"
            onClick={() => navigate(action.path)}
          >

            <div className="action-icon">
              {action.icon}
            </div>

            <span>
              {action.title}
            </span>

          </button>

        ))}

      </div>

    </div>

  );
};


export default QuickActions;