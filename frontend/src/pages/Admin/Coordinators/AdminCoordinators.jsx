import DashboardLayout from "../../../layouts/DashboardLayout";
import "./AdminCoordinators.css";
import BackButton from "../../../components/common/BackButton/BackButton";
import { useEffect, useState } from "react";
import { getAdminDashboard, updateCoordinator } from "../../../services/api";

const AdminCoordinators = () => {
  const [coordinators, setCoordinators] = useState([]);

  useEffect(() => {
    getAdminDashboard()
      .then((data) => setCoordinators(data.coordinators || []))
      .catch(() => setCoordinators([]));
  }, []);

  const editCoordinator = async (coordinator) => {
    const department = window.prompt("Department", coordinator.department || "");
    if (department === null || department.trim() === "") return;
    try {
      const updated = await updateCoordinator(coordinator.id, { department: department.trim() });
      setCoordinators((current) => current.map((item) => item.id === coordinator.id ? { ...item, ...updated } : item));
    } catch (error) {
      window.alert(error.message);
    }
  };

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

                  <td>{coordinator.employee_id || "--"}</td>

                  <td>{coordinator.department}</td>

                  <td>{coordinator.email}</td>

                  <td>{coordinator.students}</td>

                  <td>{coordinator.status}</td>

                  <td>

                    <button className="view-btn" onClick={() => window.alert(`${coordinator.name} - ${coordinator.email || "No email"}`)}>
                      View
                    </button>

                    <button className="edit-btn" onClick={() => editCoordinator(coordinator)}>
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