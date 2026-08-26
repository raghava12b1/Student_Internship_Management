import DashboardLayout from "../../../layouts/DashboardLayout";
import "./AdminHODs.css";
import BackButton from "../../../components/common/BackButton/BackButton";
const hods = [
  {
    id: 1,
    name: "Dr. Ramesh Kumar",
    employeeId: "HOD001",
    department: "CSE",
    email: "ramesh@aditya.edu.in",
    experience: "18 Years",
    status: "Active",
  },
  {
    id: 2,
    name: "Dr. Lakshmi Devi",
    employeeId: "HOD002",
    department: "ECE",
    email: "lakshmi@aditya.edu.in",
    experience: "15 Years",
    status: "Active",
  },
  {
    id: 3,
    name: "Dr. Srinivas Rao",
    employeeId: "HOD003",
    department: "IT",
    email: "srinivas@aditya.edu.in",
    experience: "20 Years",
    status: "On Leave",
  },
];

const AdminHODs = () => {
  return (
    <DashboardLayout>
       <BackButton />

      <div className="admin-hods">

        <div className="page-header">

          <h1>HOD Management</h1>

          <p>
            View and manage all Heads of Department.
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
                <th>Experience</th>
                <th>Status</th>
                <th>Action</th>

              </tr>

            </thead>

            <tbody>

              {hods.map((hod) => (

                <tr key={hod.id}>

                  <td>{hod.id}</td>

                  <td>{hod.name}</td>

                  <td>{hod.employeeId}</td>

                  <td>{hod.department}</td>

                  <td>{hod.email}</td>

                  <td>{hod.experience}</td>

                  <td>{hod.status}</td>

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

export default AdminHODs;