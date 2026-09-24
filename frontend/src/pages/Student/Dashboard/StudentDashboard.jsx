import { useEffect, useState } from "react";

import DashboardLayout from "../../../layouts/DashboardLayout";

import WelcomeCard from "../../../components/welcome/WelcomeCard";
import StatCards from "../../../components/statcards/StatCards";
import RecentApplications from "../../../components/recentapplications/RecentApplications";
import DashboardWidgets from "../../../components/dashboardwidgets/DashboardWidgets";
import QuickActions from "../../../components/quickactions/QuickActions";

import { getStudentDashboard } from "../../../services/api";


const StudentDashboard = () => {

  const [dashboardData, setDashboardData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  useEffect(() => {

    const fetchDashboard = async () => {

      try {

        // ======================================================
        // CHECK LOGIN
        // ======================================================

        const accessToken =
          localStorage.getItem("accessToken");

        const refreshToken =
          localStorage.getItem("refreshToken");


        if (!accessToken && !refreshToken) {

          setError(
            "Access token not found. Please login again."
          );

          setLoading(false);

          return;
        }


        // ======================================================
        // GET STUDENT DASHBOARD
        //
        // getStudentDashboard()
        //        ↓
        // apiFetch()
        //        ↓
        // access token
        //        ↓
        // refresh token if required
        //        ↓
        // retry request
        // ======================================================

        const data =
          await getStudentDashboard();


        console.log(
          "STUDENT DASHBOARD RESPONSE:",
          data
        );


        // ======================================================
        // SAVE DASHBOARD DATA
        // ======================================================

        setDashboardData(data);


        // ======================================================
        // SAVE CURRENT INTERNSHIP ID
        //
        // FinalReport.jsx uses this value when submitting
        // the final internship report.
        // ======================================================

        if (data.internship?.id) {

          localStorage.setItem(
            "internshipId",
            String(data.internship.id)
          );

          console.log(
            "INTERNSHIP ID SAVED:",
            data.internship.id
          );

        } else {

          console.warn(
            "No internship ID found in dashboard response."
          );

        }


        // ======================================================
        // UPDATE CURRENT USER
        //
        // Existing dashboard components may still use
        // currentUser from localStorage.
        // ======================================================

        let existingUser = {};


        try {

          existingUser =
            JSON.parse(
              localStorage.getItem(
                "currentUser"
              ) || "{}"
            );

        } catch (parseError) {

          console.error(
            "Unable to read current user:",
            parseError
          );

        }


        const updatedUser = {

          ...existingUser,


          username:
            data.student?.username ||
            existingUser.username ||
            "",


          name:
            data.student?.name ||
            existingUser.name ||
            "",


          rollNumber:
            data.student?.roll_number ||
            existingUser.rollNumber ||
            "",


          statistics:
            data.statistics || {},


          deadlines:
            data.deadlines || [],


          recentSubmissions:
            data.recent_submissions || [],


          recentApplications:
            data.recent_applications || [],


          notifications:
            data.recent_notifications || [],


          documents:
            data.documents || {},


          certificate:
            data.certificate || {},

        };


        localStorage.setItem(
          "currentUser",
          JSON.stringify(updatedUser)
        );


        // ======================================================
        // FINISHED
        // ======================================================

        setLoading(false);

      } catch (error) {

        console.error(
          "Student dashboard error:",
          error
        );


        setError(
          error.message ||
          "Unable to connect to the server. Please make sure Django is running."
        );


        setLoading(false);

      }

    };


    fetchDashboard();

  }, []);


  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {

    return (

      <DashboardLayout>

        <div
          style={{
            padding: "40px",
            textAlign: "center",
          }}
        >

          Loading student dashboard...

        </div>

      </DashboardLayout>

    );

  }


  // ============================================================
  // ERROR
  // ============================================================

  if (error) {

    return (

      <DashboardLayout>

        <div
          style={{
            padding: "40px",
            textAlign: "center",
          }}
        >

          <h2>
            Unable to Load Dashboard
          </h2>

          <p>
            {error}
          </p>

        </div>

      </DashboardLayout>

    );

  }


  // ============================================================
  // DASHBOARD
  // ============================================================

  return (

    <DashboardLayout>

      <WelcomeCard
        dashboardData={dashboardData}
      />


      <QuickActions />


      <StatCards
        dashboardData={dashboardData}
      />


      <RecentApplications
        dashboardData={dashboardData}
      />


      <DashboardWidgets
        dashboardData={dashboardData}
      />

    </DashboardLayout>

  );

};


export default StudentDashboard;