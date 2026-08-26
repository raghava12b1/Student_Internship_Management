import {
  MdDashboard,
  MdWork,
  MdNotifications,
} from "react-icons/md";

import {
  FaUserGraduate,
  FaUsers,
  FaBuilding,
} from "react-icons/fa";

import {
  HiDocumentText,
} from "react-icons/hi";

import {
  BiBarChartAlt2,
} from "react-icons/bi";

import {
  IoSettingsSharp,
  IoAnalytics,
  IoPerson,
} from "react-icons/io5";


const sidebarConfig = {

  // ============================================================
  // STUDENT
  // ============================================================

  student: [

    {
      name: "Dashboard",
      icon: MdDashboard,
      path: "/student/dashboard",
    },

    {
      name: "Offer Letter",
      icon: HiDocumentText,
      path: "/student/offer-letter",
    },

    {
      name: "Final Report",
      icon: HiDocumentText,
      path: "/student/final-report",
    },

    {
      name: "Certificate",
      icon: MdWork,
      path: "/student/certificate",
    },

    {
      name: "Progress",
      icon: BiBarChartAlt2,
      path: "/student/progress",
    },

    {
      name: "Profile",
      icon: IoPerson,
      path: "/student/profile",
    },

    {
      name: "Settings",
      icon: IoSettingsSharp,
      path: "/student/settings",
    },

  ],


  // ============================================================
  // COORDINATOR
  // ============================================================

  coordinator: [

    {
      name: "Dashboard",
      icon: MdDashboard,
      path: "/coordinator/dashboard",
    },

    {
      name: "Students",
      icon: FaUserGraduate,
      path: "/coordinator/students",
    },

    {
      name: "Offer Verification",
      icon: HiDocumentText,
      path: "/coordinator/document/offer",
    },

    {
      name: "Documents",
      icon: HiDocumentText,
      path: "/coordinator/document/weekly",
    },

    {
      name: "Reports",
      icon: BiBarChartAlt2,
      path: "/coordinator/reports",
    },

    {
      name: "Notifications",
      icon: MdNotifications,
      path: "/coordinator/notifications",
    },

    {
      name: "Profile",
      icon: IoPerson,
      path: "/coordinator/profile",
    },

    {
      name: "Settings",
      icon: IoSettingsSharp,
      path: "/coordinator/settings",
    },

  ],


  // ============================================================
  // ADMIN
  // ============================================================

  admin: [

    {
      name: "Dashboard",
      icon: MdDashboard,
      path: "/admin/dashboard",
    },

    {
      name: "Students",
      icon: FaUserGraduate,
      path: "/admin/students",
    },

    {
      name: "Coordinators",
      icon: FaUsers,
      path: "/admin/coordinators",
    },

    {
      name: "Companies",
      icon: FaBuilding,
      path: "/admin/companies",
    },

    {
      name: "Internships",
      icon: MdWork,
      path: "/admin/internships",
    },

    {
      name: "Reports",
      icon: BiBarChartAlt2,
      path: "/admin/reports",
    },

    {
      name: "Analytics",
      icon: IoAnalytics,
      path: "/admin/analytics",
    },

    {
      name: "Notifications",
      icon: MdNotifications,
      path: "/admin/notifications",
    },

    {
      name: "Profile",
      icon: IoPerson,
      path: "/admin/profile",
    },

    {
      name: "Settings",
      icon: IoSettingsSharp,
      path: "/admin/settings",
    },

  ],

};


export default sidebarConfig;