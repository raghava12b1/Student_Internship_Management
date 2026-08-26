import { Routes, Route } from "react-router-dom";

// ============================================================
// PUBLIC COMPONENTS
// ============================================================

import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Developers from "./components/Developers/Developers";
import About from "./components/About/About";
import Contact from "./components/Contact/Contact";

// ============================================================
// REGISTRATIONS
// ============================================================

import StudentRegistration
  from "./pages/Registrations/StudentForm/StudentRegistration";

import CoordinatorRegistration
  from "./pages/Registrations/CoordinatorForm/CoordinatorRegistraion";

import HodRegistration
  from "./pages/Registrations/HodForm/HodRegistration";

// ============================================================
// STUDENT
// ============================================================

import StudentDashboard
  from "./pages/Student/Dashboard/StudentDashboard";

import OfferLetter
  from "./pages/Student/OfferLetter/OfferLetter";

import WeeklyReport
  from "./pages/Student/WeeklyReport/WeeklyReport";

import FinalReport
  from "./pages/Student/FinalReport/FinalReport";

import Certificate
  from "./pages/Student/Certificate/Certificate";

import Progress
  from "./pages/Student/Progress/Progress";

import StudentProfile
  from "./pages/Student/Profile/StudentProfile";

import StudentSettings
  from "./pages/Student/Settings/StudentSettings";

// ============================================================
// COORDINATOR
// ============================================================

import CoordinatorDashboard
  from "./pages/Coordinator/Dashboard/CoordinatorDashboard";

import CoordinatorStudents
  from "./pages/Coordinator/Students/CoordinatorStudents";

import CoordinatorStudentDetails
  from "./pages/Coordinator/StudentDetails/CoordinatorStudentDetails";

import OfferLetterVerification
  from "./pages/Coordinator/OfferLetters/OfferLetterVerification";

import DocumentVerification
  from "./pages/Coordinator/DocumentVerification/DocumentVerification";

import CoordinatorReports
  from "./pages/Coordinator/Reports/CoordinatorReports";

import CoordinatorNotifications
  from "./pages/Coordinator/Notifications/CoordinatorNotifications";

import CoordinatorProfile
  from "./pages/Coordinator/Profile/CoordinatorProfile";

import CoordinatorSettings
  from "./pages/Coordinator/Settings/CoordinatorSettings";

// ============================================================
// HOD
// ============================================================

import HODDashboard
  from "./pages/HOD/Dashboard/HODDashboard";

import HODStudents
  from "./pages/HOD/Students/HODStudents";

import HODCoordinators
  from "./pages/HOD/Coordinators/HODCoordinators";

import HODApprovals
  from "./pages/HOD/Approvals/HODApprovals";

import HODReports
  from "./pages/HOD/Reports/HODReports";

import HODAnalytics
  from "./pages/HOD/Analytics/HODAnalytics";

import HODNotifications
  from "./pages/HOD/Notifications/HODNotifications";

import HODProfile
  from "./pages/HOD/Profile/HODProfile";

import HODSettings
  from "./pages/HOD/Settings/HODSettings";

// ============================================================
// ADMIN
// ============================================================

import AdminDashboard
  from "./pages/Admin/Dashboard/AdminDashboard";

import AdminStudents
  from "./pages/Admin/Students/AdminStudents";

import AdminCoordinators
  from "./pages/Admin/Coordinators/AdminCoordinators";

import AdminHODs
  from "./pages/Admin/HODs/AdminHODs";

import AdminCompanies
  from "./pages/Admin/Companies/AdminCompanies";

import AdminInternships
  from "./pages/Admin/Internships/AdminInternships";

import AdminReports
  from "./pages/Admin/Reports/AdminReports";

import AdminAnalytics
  from "./pages/Admin/Analytics/AdminAnalytics";

import AdminNotifications
  from "./pages/Admin/Notifications/AdminNotifications";

import AdminProfile
  from "./pages/Admin/Profile/AdminProfile";

import AdminSettings
  from "./pages/Admin/Settings/AdminSettings";

// ============================================================
// APP
// ============================================================

function App() {
  return (
    <>
      {/* ======================================================
          PUBLIC NAVBAR
      ====================================================== */}

      <Navbar />

      <Routes>

        {/* ====================================================
            PUBLIC / LANDING
        ==================================================== */}

        <Route
          path="/"
          element={<Hero />}
        />

        <Route
          path="/developers"
          element={<Developers />}
        />

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />

        {/* ====================================================
            REGISTRATIONS
        ==================================================== */}

        <Route
          path="/register/student"
          element={<StudentRegistration />}
        />

        <Route
          path="/register/coordinator"
          element={<CoordinatorRegistration />}
        />

        <Route
          path="/register/hod"
          element={<HodRegistration />}
        />

        {/* ====================================================
            STUDENT
        ==================================================== */}

        <Route
          path="/student/dashboard"
          element={<StudentDashboard />}
        />

        <Route
          path="/student/offer-letter"
          element={<OfferLetter />}
        />

        <Route
          path="/student/weekly-report"
          element={<WeeklyReport />}
        />

        <Route
          path="/student/final-report"
          element={<FinalReport />}
        />

        <Route
          path="/student/certificate"
          element={<Certificate />}
        />

        <Route
          path="/student/progress"
          element={<Progress />}
        />

        <Route
          path="/student/profile"
          element={<StudentProfile />}
        />

        <Route
          path="/student/settings"
          element={<StudentSettings />}
        />

        {/* ====================================================
            COORDINATOR
        ==================================================== */}

        <Route
          path="/coordinator/dashboard"
          element={<CoordinatorDashboard />}
        />

        <Route
          path="/coordinator/students"
          element={<CoordinatorStudents />}
        />

        <Route
          path="/coordinator/student-details"
          element={<CoordinatorStudentDetails />}
        />

        <Route
          path="/coordinator/offer-letter"
          element={<OfferLetterVerification />}
        />

        <Route
          path="/coordinator/document/:type"
          element={<DocumentVerification />}
        />

        <Route
          path="/coordinator/reports"
          element={<CoordinatorReports />}
        />

        <Route
          path="/coordinator/notifications"
          element={<CoordinatorNotifications />}
        />

        <Route
          path="/coordinator/profile"
          element={<CoordinatorProfile />}
        />

        <Route
          path="/coordinator/settings"
          element={<CoordinatorSettings />}
        />

        {/* ====================================================
            HOD
        ==================================================== */}

        <Route
          path="/hod/dashboard"
          element={<HODDashboard />}
        />

        <Route
          path="/hod/students"
          element={<HODStudents />}
        />

        <Route
          path="/hod/coordinators"
          element={<HODCoordinators />}
        />

        <Route
          path="/hod/approvals"
          element={<HODApprovals />}
        />

        <Route
          path="/hod/reports"
          element={<HODReports />}
        />

        <Route
          path="/hod/analytics"
          element={<HODAnalytics />}
        />

        <Route
          path="/hod/notifications"
          element={<HODNotifications />}
        />

        <Route
          path="/hod/profile"
          element={<HODProfile />}
        />

        <Route
          path="/hod/settings"
          element={<HODSettings />}
        />

        {/* ====================================================
            ADMIN
        ==================================================== */}

        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />

        <Route
          path="/admin/students"
          element={<AdminStudents />}
        />

        <Route
          path="/admin/coordinators"
          element={<AdminCoordinators />}
        />

        <Route
          path="/admin/hods"
          element={<AdminHODs />}
        />

        <Route
          path="/admin/companies"
          element={<AdminCompanies />}
        />

        <Route
          path="/admin/internships"
          element={<AdminInternships />}
        />

        <Route
          path="/admin/reports"
          element={<AdminReports />}
        />

        <Route
          path="/admin/analytics"
          element={<AdminAnalytics />}
        />

        <Route
          path="/admin/notifications"
          element={<AdminNotifications />}
        />

        <Route
          path="/admin/profile"
          element={<AdminProfile />}
        />

        <Route
          path="/admin/settings"
          element={<AdminSettings />}
        />

      </Routes>
    </>
  );
}

export default App;