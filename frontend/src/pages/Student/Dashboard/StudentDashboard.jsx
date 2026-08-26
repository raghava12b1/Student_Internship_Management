import DashboardLayout from "../../../layouts/DashboardLayout";
import WelcomeCard from "../../../components/welcome/WelcomeCard";
import StatCards from "../../../components/statcards/StatCards";
import RecentApplications from "../../../components/recentapplications/RecentApplications";
import DashboardWidgets from "../../../components/dashboardwidgets/DashboardWidgets";
import QuickActions from "../../../components/quickactions/QuickActions";
const StudentDashboard = () => {
  return (
    <DashboardLayout>

      <WelcomeCard />

      <QuickActions />

      <StatCards />

      <RecentApplications />

      <DashboardWidgets />

    </DashboardLayout>
  );
};

export default StudentDashboard;