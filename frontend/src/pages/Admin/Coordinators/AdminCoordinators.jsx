import DashboardLayout from "../../../layouts/DashboardLayout";
import "./AdminCoordinators.css";
import { useEffect, useState } from "react";
import {
  getAdminDashboard,
  updateCoordinator,
  createCoordinator,
} from "../../../services/api";

const initialForm = {
  full_name: "",
  employee_id: "",
  college_email: "",
  mobile_number: "",
  department: "",
  designation: "",
  password: "",
  confirm_password: "",
};

const AdminCoordinators = () => {
  const [coordinators, setCoordinators] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadCoordinators = async () => {
    const data = await getAdminDashboard();
    setCoordinators(data.coordinators || []);
  };

  useEffect(() => {
    loadCoordinators().catch((err) => {
      setError(err.message || "Failed to load coordinators.");
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccess("");
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (Object.values(formData).some((value) => !value.trim())) {
      setError("Please fill in all fields.");
      return;
    }

    if (!/^\d{10}$/.test(formData.mobile_number)) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const result = await createCoordinator(formData);
      const created = result.coordinator;

      if (created) {
        setCoordinators((current) => [
          {
            id: created.id,
            name: created.full_name,
            employee_id: created.employee_id,
            department: created.department,
            email: created.college_email,
            students: 0,
            status: "Active",
          },
          ...current,
        ]);
      } else {
        await loadCoordinators();
      }

      setFormData(initialForm);
      setShowForm(false);
      setSuccess(
        `Coordinator account created. Username: ${formData.employee_id}. Share the password you set with the coordinator securely.`
      );
    } catch (err) {
      setError(err.message || "Unable to create coordinator.");
    } finally {
      setLoading(false);
    }
  };

  const editCoordinator = async (coordinator) => {
    const department = window.prompt(
      "Department",
      coordinator.department || ""
    );

    if (department === null || department.trim() === "") return;

    try {
      const updated = await updateCoordinator(coordinator.id, {
        department: department.trim(),
      });

      setCoordinators((current) =>
        current.map((item) =>
          item.id === coordinator.id ? { ...item, ...updated } : item
        )
      );
    } catch (err) {
      window.alert(err.message);
    }
  };

  return (
    <DashboardLayout>
      <div className="admin-coordinators">
        <div className="page-header">
          <div>
            <h1>Coordinator Management</h1>
            <p>Manage all internship coordinators in the university.</p>
          </div>

          <button
            type="button"
            className="add-coordinator-btn"
            onClick={() => {
              setShowForm((prev) => !prev);
              setError("");
              setSuccess("");
            }}
          >
            {showForm ? "Cancel" : "+ Add Coordinator"}
          </button>
        </div>

        {error && <div className="coordinator-message error">{error}</div>}
        {success && (
          <div className="coordinator-message success">{success}</div>
        )}

        {showForm && (
          <div className="coordinator-create-card">
            <h2>Create Coordinator Account</h2>
            <p>
              Enter the coordinator's details and set their login credentials.
            </p>

            <form onSubmit={handleCreate}>
              <div className="coordinator-form-grid">
                <div className="coordinator-form-field">
                  <label htmlFor="full_name">Full Name</label>
                  <input
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div className="coordinator-form-field">
                  <label htmlFor="employee_id">Employee ID</label>
                  <input
                    id="employee_id"
                    name="employee_id"
                    value={formData.employee_id}
                    onChange={handleChange}
                    placeholder="Enter employee ID"
                    required
                  />
                </div>

                <div className="coordinator-form-field">
                  <label htmlFor="college_email">College Email</label>
                  <input
                    id="college_email"
                    name="college_email"
                    type="email"
                    value={formData.college_email}
                    onChange={handleChange}
                    placeholder="Enter college email"
                    required
                  />
                </div>

                <div className="coordinator-form-field">
                  <label htmlFor="mobile_number">Mobile Number</label>
                  <input
                    id="mobile_number"
                    name="mobile_number"
                    type="tel"
                    maxLength={10}
                    value={formData.mobile_number}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    required
                  />
                </div>

                <div className="coordinator-form-field">
                  <label htmlFor="department">Department</label>
                  <input
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="e.g. IT"
                    required
                  />
                </div>

                <div className="coordinator-form-field">
                  <label htmlFor="designation">Designation</label>
                  <input
                    id="designation"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    placeholder="e.g. Internship Coordinator"
                    required
                  />
                </div>

                <div className="coordinator-form-field">
                  <label htmlFor="password">Password</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Minimum 8 characters"
                    minLength={8}
                    required
                  />
                </div>

                <div className="coordinator-form-field">
                  <label htmlFor="confirm_password">Confirm Password</label>
                  <input
                    id="confirm_password"
                    name="confirm_password"
                    type="password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    minLength={8}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="create-coordinator-btn"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Coordinator"}
              </button>
            </form>
          </div>
        )}

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
              {coordinators.length > 0 ? (
                coordinators.map((coordinator) => (
                  <tr key={coordinator.id}>
                    <td>{coordinator.id}</td>
                    <td>{coordinator.name}</td>
                    <td>{coordinator.employee_id || "--"}</td>
                    <td>{coordinator.department}</td>
                    <td>{coordinator.email}</td>
                    <td>{coordinator.students}</td>
                    <td>{coordinator.status}</td>
                    <td>
                      <button
                        className="view-btn"
                        onClick={() =>
                          window.alert(
                            `${coordinator.name} - ${
                              coordinator.email || "No email"
                            }`
                          )
                        }
                      >
                        View
                      </button>

                      <button
                        className="edit-btn"
                        onClick={() => editCoordinator(coordinator)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="empty-coordinators">
                    No coordinators found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminCoordinators;