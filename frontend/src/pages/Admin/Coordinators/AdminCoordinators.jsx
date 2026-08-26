import DashboardLayout from "../../../layouts/DashboardLayout";
import "./AdminCoordinators.css";
import BackButton from "../../../components/common/BackButton/BackButton";

const coordinators = [
  {
    id: 1,
    name: "Dr. Ramesh",
    employeeId: "COORD001",
    department: "CSE",
    email: "ramesh@aditya.edu.in",
    students: 52,
    status: "Active",
  },
  {
    id: 2,
    name: "Dr. Suresh",
    employeeId: "COORD002",
    department: "ECE",
    email: "suresh@aditya.edu.in",
    students: 48,
    status: "Active",
  },
  {
    id: 3,
    name: "Dr. Priya",
    employeeId: "COORD003",
    department: "IT",
    email: "priya@aditya.edu.in",
    students: 45,
    status: "On Leave",
  },
];

const AdminCoordinators = () => {
  return (
    <DashboardLayout>
       <BackButton />

      <div className="admin-coordinators">

        <div className="page-header">

          <h1>Coordinator Management</h1>

          <p>
            Manage all internship coordinators in the university.
          </p>

        </div>

        <div className="table-card">

          <table>

            <thead>

              <tr>

                <th>ID</th>
                <th>Name</th>
                <th>Employee ID</th>
                <th>Department</th>
                <th>Email</th>
                <th>Students</th>
                <th>Status</th>
                <th>Action</th>

              </tr>

            </thead>

            <tbody>

              {coordinators.map((coordinator) => (

                <tr key={coordinator.id}>

                  <td>{coordinator.id}</td>

                  <td>{coordinator.name}</td>

                  <td>{coordinator.employeeId}</td>

                  <td>{coordinator.department}</td>

                  <td>{coordinator.email}</td>

                  <td>{coordinator.students}</td>

                  <td>{coordinator.status}</td>

                  <td>

                    <button className="view-btn">
                      View
                    </button>

                    <button className="edit-btn">
                      Edit
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

export default AdminCoordinators;