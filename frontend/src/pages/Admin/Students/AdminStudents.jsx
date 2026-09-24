import DashboardLayout from "../../../layouts/DashboardLayout";
import "./AdminStudents.css";
import BackButton from "../../../components/common/BackButton/BackButton";
import { useEffect, useState } from "react";
import { getStudents, updateStudent } from "../../../services/api";

const AdminStudents = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    getStudents()
      .then(setStudents)
      .catch(() => setStudents([]));
  }, []);

  const editStudent = async (student) => {
    const department = window.prompt("Department", student.department || "");
    if (department === null || department.trim() === "") return;
    try {
      const updated = await updateStudent(student.id, { department: department.trim() });
      setStudents((current) => current.map((item) => item.id === student.id ? { ...item, ...updated } : item));
    } catch (error) {
      window.alert(error.message);
    }
  };

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

                  <td>{student.student_name || "--"}</td>

                  <td>{student.roll_number || "--"}</td>

                  <td>{student.department}</td>

                  <td>{student.company_name || "--"}</td>

                  <td>{student.status}</td>

                  <td>

                    <button className="view-btn" onClick={() => window.alert(`${student.student_name || "Student"} - ${student.roll_number || "No roll number"}`)}>
                      View
                    </button>

                    <button className="edit-btn" onClick={() => editStudent(student)}>
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