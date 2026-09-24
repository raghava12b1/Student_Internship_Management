import DashboardLayout from "../../../layouts/DashboardLayout";
import "./AdminCompanies.css";
import BackButton from "../../../components/common/BackButton/BackButton";
import { useEffect, useState } from "react";
import { getCompanies, updateCompany } from "../../../services/api";

const AdminCompanies = () => {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    getCompanies()
      .then(setCompanies)
      .catch(() => setCompanies([]));
  }, []);

  const toggleCompany = async (company) => {
    try {
      const updated = await updateCompany(company.id, {
        is_active: company.status !== "Active",
      });
      setCompanies((current) => current.map((item) => (
        item.id === company.id ? { ...item, ...updated } : item
      )));
    } catch (error) {
      window.alert(error.message);
    }
  };

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

                <tr key={company.name}>

                  <td>--</td>
                  <td>{company.name}</td>
                  <td>{company.location || "--"}</td>
                  <td>{company.students}</td>
                  <td>{company.coordinator || "--"}</td>
                  <td>{company.status}</td>

                  <td>

                    <button className="view-btn" onClick={() => window.alert(`${company.name}: ${company.students} student(s)`)}>
                      View
                    </button>

                    <button className="edit-btn" onClick={() => toggleCompany(company)}>
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