import DashboardLayout from "../../../layouts/DashboardLayout";
import "./AdminInternships.css";
import BackButton from "../../../components/common/BackButton/BackButton";
import { useEffect, useState } from "react";
import { getAdminDashboard, updateInternship } from "../../../services/api";

const initialInternships = [
  {
    id: 1,
    student: "Bala Krishna",
    company: "Infosys",
    coordinator: "Dr. Ramesh",
    duration: "2 Months",
    status: "Completed",
  },
  {
    id: 2,
    student: "Rahul",
    company: "TCS",
    coordinator: "Dr. Suresh",
    duration: "3 Months",
    status: "In Progress",
  },
  {
    id: 3,
    student: "Anjali",
    company: "Wipro",
    coordinator: "Dr. Priya",
    duration: "2 Months",
    status: "Pending",
  },
  {
    id: 4,
    student: "Sravani",
    company: "Accenture",
    coordinator: "Dr. Kumar",
    duration: "6 Months",
    status: "Completed",
  },
];

const AdminInternships = () => {
  const [internships, setInternships] = useState(initialInternships);

  useEffect(() => {
    getAdminDashboard()
      .then((data) => setInternships(data.internships || []))
      .catch(() => setInternships([]));
  }, []);

  const editInternship = async (item) => {
    const status = window.prompt("Status: PENDING, ONGOING, COMPLETED, or REJECTED", item.status?.toUpperCase());
    if (status === null || !["PENDING", "ONGOING", "COMPLETED", "REJECTED"].includes(status.trim().toUpperCase())) return;
    try {
      const updated = await updateInternship(item.id, { status: status.trim().toUpperCase() });
      setInternships((current) => current.map((record) => record.id === item.id ? { ...record, status: updated.status } : record));
    } catch (error) {
      window.alert(error.message);
    }
  };

  return (
    <DashboardLayout>
       <BackButton />

      <div className="admin-internships">

        <div className="page-header">
          <h1>Internship Management</h1>
          <p>
            Monitor and manage all internship records.
          </p>
        </div>

        <div className="table-card">

          <table>

            <thead>

              <tr>
                <th>ID</th>
                <th>Student</th>
                <th>Company</th>
                <th>Coordinator</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Action</th>
              </tr>

            </thead>

            <tbody>

              {internships.map((item) => (

                <tr key={item.id}>

                  <td>{item.id}</td>
                  <td>{item.student}</td>
                  <td>{item.company}</td>
                  <td>{item.coordinator}</td>
                  <td>{item.duration}</td>
                  <td>{item.status}</td>

                  <td>

                    <button className="view-btn" onClick={() => window.alert(`${item.student} - ${item.company}`)}>
                      View
                    </button>

                    <button className="edit-btn" onClick={() => editInternship(item)}>
                      Manage
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </DashboardLayout>
  );
};

export default AdminInternships;