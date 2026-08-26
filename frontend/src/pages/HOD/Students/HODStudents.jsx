import DashboardLayout from "../../../layouts/DashboardLayout";
import "./HODStudents.css";
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
    department: "CSE",
    company: "Wipro",
    status: "Pending",
  },
  {
    id: 4,
    name: "Sravani",
    roll: "21A91A0504",
    department: "CSE",
    company: "Accenture",
    status: "Completed",
  },
];

const HODStudents = () => {
  return (
    <DashboardLayout>
       <BackButton />
      <div className="hod-students">

        <div className="page-header">
          <h1>Department Students</h1>
          <p>
            View and monitor all internship students in the department.
          </p>
        </div>

        <div className="students-card">

          <table>

            <thead>

              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Roll Number</th>
                <th>Department</th>
                <th>Company</th>
                <th>Status</th>
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

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>
    </DashboardLayout>
  );
};

export default HODStudents;