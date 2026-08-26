import DashboardLayout from "../../../layouts/DashboardLayout";
import "./AdminStudents.css";
import BackButton from "../../../components/common/BackButton/BackButton";

const students = [
  {
    id: 1,
    name: "Bala Krishna",
    roll: "21A91A0501",
    department: "CSE",
    company: "Infosys",
    status: "Completed",
  },
  {
    id: 2,
    name: "Rahul",
    roll: "21A91A0502",
    department: "CSE",
    company: "TCS",
    status: "In Progress",
  },
  {
    id: 3,
    name: "Anjali",
    roll: "21A91A0503",
    department: "ECE",
    company: "Wipro",
    status: "Pending",
  },
  {
    id: 4,
    name: "Sravani",
    roll: "21A91A0504",
    department: "IT",
    company: "Accenture",
    status: "Completed",
  },
];

const AdminStudents = () => {
  return (
    <DashboardLayout>
       <BackButton />

      <div className="admin-students">

        <div className="page-header">

          <h1>Student Management</h1>

          <p>
            View and manage all registered students.
          </p>

        </div>

        <div className="table-card">

          <table>

            <thead>

              <tr>

                <th>ID</th>
                <th>Name</th>
                <th>Roll Number</th>
                <th>Department</th>
                <th>Company</th>
                <th>Status</th>
                <th>Action</th>

              </tr>

            </thead>

            <tbody>

              {students.map((student) => (

                <tr key={student.id}>

                  <td>{student.id}</td>

                  <td>{student.name}</td>

                  <td>{student.roll}</td>

                  <td>{student.department}</td>

                  <td>{student.company}</td>

                  <td>{student.status}</td>

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

export default AdminStudents;