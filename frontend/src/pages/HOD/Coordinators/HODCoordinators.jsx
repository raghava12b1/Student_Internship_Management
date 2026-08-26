import DashboardLayout from "../../../layouts/DashboardLayout";
import "./HODCoordinators.css";
import BackButton from "../../../components/common/BackButton/BackButton";
const coordinators = [
  {
    id: 1,
    name: "Dr. Ramesh",
    department: "CSE",
    email: "ramesh@aditya.edu.in",
    students: 52,
    status: "Active",
  },
  {
    id: 2,
    name: "Dr. Suresh",
    department: "CSE",
    email: "suresh@aditya.edu.in",
    students: 48,
    status: "Active",
  },
  {
    id: 3,
    name: "Dr. Priya",
    department: "CSE",
    email: "priya@aditya.edu.in",
    students: 44,
    status: "On Leave",
  },
];

const HODCoordinators = () => {
  return (
    <DashboardLayout>
       <BackButton />
      <div className="hod-coordinators">

        <div className="page-header">
          <h1>Internship Coordinators</h1>
          <p>
            View and manage internship coordinators in your department.
          </p>
        </div>

        <div className="coordinator-card">

          <table>

            <thead>

              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Email</th>
                <th>Students Assigned</th>
                <th>Status</th>
              </tr>

            </thead>

            <tbody>

              {coordinators.map((coordinator) => (

                <tr key={coordinator.id}>

                  <td>{coordinator.id}</td>

                  <td>{coordinator.name}</td>

                  <td>{coordinator.department}</td>

                  <td>{coordinator.email}</td>

                  <td>{coordinator.students}</td>

                  <td>{coordinator.status}</td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>
    </DashboardLayout>
  );
};

export default HODCoordinators;