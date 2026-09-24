import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import "./CoordinatorStudents.css";
import BackButton from "../../../components/common/BackButton/BackButton";
import { useNavigate } from "react-router-dom";

const API_URL = "http://127.0.0.1:8000/api/accounts/students/";

const CoordinatorStudents = () => {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All Departments");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
   * =====================================================
   * GET ACCESS TOKEN
   * =====================================================
   */

  const getAccessToken = () => {
    return (
      localStorage.getItem("accessToken") ||
      localStorage.getItem("access_token") ||
      localStorage.getItem("access")
    );
  };

  /*
   * =====================================================
   * FETCH STUDENTS FROM DJANGO
   * =====================================================
   */

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError("");

        const accessToken = getAccessToken();

        if (!accessToken) {
          setError("Access token not found. Please login again.");
          setLoading(false);
          return;
        }

        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.status === 401) {
          setError("Session expired. Please login again.");
          setLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error(
            `Failed to fetch students. Status: ${response.status}`
          );
        }

        const data = await response.json();

        /*
         * Django currently returns an array:
         *
         * [
         *   {
         *     id,
         *     student_name,
         *     roll_number,
         *     department,
         *     year,
         *     semester,
         *     mobile_number
         *   }
         * ]
         */

        if (Array.isArray(data)) {
          setStudents(data);
        } else {
          setStudents([]);
          setError("Invalid student data received from server.");
        }
      } catch (err) {
        console.error("Students API Error:", err);

        setError(
          "Unable to load students. Please make sure Django is running."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  /*
   * =====================================================
   * DEPARTMENTS
   * =====================================================
   */

  const normalizeDepartment = (value) => {
    if (!value) return "";
    return value
      .trim()
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "")
      .replace(/^computer science and engineering$/, "cse")
      .replace(/^computer science engineering$/, "cse")
      .replace(/^cse$/, "cse");
  };

  const departments = useMemo(() => {
    const uniqueDepartments = [
      ...new Set(
        students
          .map((student) => student.department)
          .filter(Boolean)
      ),
    ];

    return uniqueDepartments;
  }, [students]);

  /*
   * =====================================================
   * SEARCH + DEPARTMENT FILTER
   * =====================================================
   */

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        student.student_name
          ?.toLowerCase()
          .includes(searchText) ||
        student.roll_number
          ?.toLowerCase()
          .includes(searchText) ||
        student.department
          ?.toLowerCase()
          .includes(searchText);

      const matchesDepartment =
        department === "All Departments" ||
        normalizeDepartment(student.department) === normalizeDepartment(department);

      return matchesSearch && matchesDepartment;
    });
  }, [students, search, department]);

  /*
   * =====================================================
   * VIEW STUDENT
   * =====================================================
   */

  const handleViewStudent = (student) => {
    /*
     * Change this route later if your project already has
     * a different student-details route.
     */

    navigate(`/coordinator/students/${student.id}`, {
      state: {
        student,
      },
    });
  };

  return (
    <DashboardLayout>

      <BackButton />

      <div className="students-page">

        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <div className="page-header">

          <h1>Students</h1>

          <p>
            Manage and monitor all internship students.
          </p>

        </div>


        {/* =================================================
            SEARCH + FILTER
        ================================================= */}

        <div className="student-controls">

          <div className="search-box">

            <span>🔍</span>

            <input
              type="text"
              placeholder="Search Student..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>


          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >

            <option value="All Departments">
              All Departments
            </option>

            {departments.map((dept) => (
              <option
                key={dept}
                value={dept}
              >
                {dept}
              </option>
            ))}

          </select>

        </div>


        {/* =================================================
            STUDENT TABLE
        ================================================= */}

        <div className="table-card">

          {loading ? (

            <div className="students-message">
              Loading students...
            </div>

          ) : error ? (

            <div className="students-message error">
              {error}
            </div>

          ) : (

            <table>

              <thead>

                <tr>

                  <th>STUDENT NAME</th>

                  <th>ROLL NUMBER</th>

                  <th>DEPARTMENT</th>

                  <th>YEAR</th>

                  <th>SEMESTER</th>

                  <th>MOBILE NUMBER</th>

                  <th>ACTION</th>

                </tr>

              </thead>


              <tbody>

                {filteredStudents.length > 0 ? (

                  filteredStudents.map((student) => (

                    <tr key={student.id}>

                      {/* STUDENT NAME */}

                      <td>
                        {student.student_name || "--"}
                      </td>


                      {/* ROLL NUMBER */}

                      <td>
                        {student.roll_number || "--"}
                      </td>


                      {/* DEPARTMENT */}

                      <td>
                        {student.department || "--"}
                      </td>


                      {/* YEAR */}

                      <td>
                        {student.year
                          ? `${student.year} Year`
                          : "--"}
                      </td>


                      {/* SEMESTER */}

                      <td>
                        {student.semester || "--"}
                      </td>


                      {/* MOBILE */}

                      <td>
                        {student.mobile_number || "--"}
                      </td>


                      {/* ACTION */}

                      <td>

                        <button
                          className="view-btn"
                          onClick={() =>
                            handleViewStudent(student)
                          }
                        >
                          View
                        </button>

                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>

                    <td
                      colSpan="7"
                      className="no-students"
                    >
                      No students found.
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          )}

        </div>


        {/* =================================================
            RESULT COUNT
        ================================================= */}

        {!loading && !error && (

          <div className="student-count">

            Showing{" "}
            <strong>
              {filteredStudents.length}
            </strong>{" "}
            of{" "}
            <strong>
              {students.length}
            </strong>{" "}
            students

          </div>

        )}

      </div>

    </DashboardLayout>
  );
};

export default CoordinatorStudents;