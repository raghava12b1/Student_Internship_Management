import DashboardLayout from "../../../layouts/DashboardLayout";
import "./AdminCompanies.css";
import BackButton from "../../../components/common/BackButton/BackButton";
const companies = [
  {
    id: 1,
    name: "Infosys",
    location: "Hyderabad",
    students: 42,
    coordinator: "Dr. Ramesh",
    status: "Active",
  },
  {
    id: 2,
    name: "TCS",
    location: "Bengaluru",
    students: 35,
    coordinator: "Dr. Suresh",
    status: "Active",
  },
  {
    id: 3,
    name: "Wipro",
    location: "Chennai",
    students: 28,
    coordinator: "Dr. Priya",
    status: "Inactive",
  },
  {
    id: 4,
    name: "Accenture",
    location: "Pune",
    students: 51,
    coordinator: "Dr. Kumar",
    status: "Active",
  },
];

const AdminCompanies = () => {
  return (
    <DashboardLayout>
       <BackButton />
      <div className="admin-companies">

        <div className="page-header">
          <h1>Company Management</h1>
          <p>Manage internship partner companies.</p>
        </div>

        <div className="table-card">

          <table>

            <thead>
              <tr>
                <th>ID</th>
                <th>Company</th>
                <th>Location</th>
                <th>Students</th>
                <th>Coordinator</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {companies.map((company) => (

                <tr key={company.id}>

                  <td>{company.id}</td>
                  <td>{company.name}</td>
                  <td>{company.location}</td>
                  <td>{company.students}</td>
                  <td>{company.coordinator}</td>
                  <td>{company.status}</td>

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

export default AdminCompanies;