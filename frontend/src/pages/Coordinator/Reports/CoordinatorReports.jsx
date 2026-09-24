import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import "./CoordinatorReports.css";
import BackButton from "../../../components/common/BackButton/BackButton";
import { getInternshipReport } from "../../../services/api";
import { exportToExcel } from "../../../utils/exportExcel";

const API_BASE_URL = "http://127.0.0.1:8000/api";

const CoordinatorReports = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* Internship report state */
  const [internships, setInternships] = useState([]);
  const [internshipLoading, setInternshipLoading] = useState(true);
  const [internshipError, setInternshipError] = useState("");
  const [companyFilter, setCompanyFilter] = useState("All Companies");
  const [stipendFilter, setStipendFilter] = useState("All Students");

  /*
   * =====================================================
   * ACCESS TOKEN
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
   * LOAD DOCUMENTS FROM DJANGO
   * =====================================================
   */

  useEffect(() => {
    const loadReports = async () => {
      try {
        setLoading(true);
        setError("");

        const accessToken = getAccessToken();

        if (!accessToken) {
          setError(
            "Access token not found. Please login again."
          );
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${API_BASE_URL}/documents/review/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.status === 401) {
          setError(
            "Your login session has expired. Please login again."
          );
          setLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error(
            `Server returned ${response.status}`
          );
        }

        const data = await response.json();

        /*
         * Django REST Framework may return:
         *
         * [...]
         *
         * OR
         *
         * {
         *   results: [...]
         * }
         *
         * OR
         *
         * {
         *   documents: [...]
         * }
         */

        let documentList = [];

        if (Array.isArray(data)) {
          documentList = data;
        } else if (Array.isArray(data.results)) {
          documentList = data.results;
        } else if (Array.isArray(data.documents)) {
          documentList = data.documents;
        }

        setDocuments(documentList);

      } catch (err) {
        console.error(
          "Reports loading error:",
          err
        );

        setError(
          "Unable to connect to Django server. Please make sure Django is running."
        );
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  /*
   * =====================================================
   * LOAD INTERNSHIP DATA
   * =====================================================
   */

  useEffect(() => {
    const loadInternships = async () => {
      try {
        setInternshipLoading(true);
        setInternshipError("");

        const data = await getInternshipReport();

        if (Array.isArray(data)) {
          setInternships(data);
        } else if (Array.isArray(data.results)) {
          setInternships(data.results);
        } else {
          setInternships([]);
        }
      } catch (err) {
        console.error("Internship report error:", err);
        setInternshipError(
          "Unable to load internship data."
        );
      } finally {
        setInternshipLoading(false);
      }
    };

    loadInternships();
  }, []);

  /*
   * =====================================================
   * HELPER FUNCTIONS
   * =====================================================
   */

  const getStudentName = (item) => {
    return (
      item.student_name ||
      item.student?.name ||
      item.student?.full_name ||
      item.user?.name ||
      item.user?.username ||
      "--"
    );
  };

  const getRollNumber = (item) => {
    return (
      item.roll_number ||
      item.student?.roll_number ||
      item.student?.rollNumber ||
      item.user?.roll_number ||
      ""
    );
  };

  const getDepartment = (item) => {
    return (
      item.department ||
      item.student?.department ||
      item.user?.department ||
      "Unknown"
    );
  };

  const getDocumentName = (item) => {
    return (
      item.document_type ||
      item.type ||
      item.documentType ||
      item.document_name ||
      item.name ||
      "Document"
    );
  };

  const getStatus = (item) => {
    return (
      item.status ||
      item.verification_status ||
      item.approval_status ||
      "Pending"
    );
  };

  const getDate = (item) => {
    return (
      item.uploaded_on ||
      item.uploaded_at ||
      item.created_at ||
      item.updated_at ||
      "--"
    );
  };

  /*
   * =====================================================
   * FORMAT DATE
   * =====================================================
   */

  const formatDate = (value) => {
    if (!value || value === "--") {
      return "--";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  /*
   * =====================================================
   * NORMALIZE STATUS
   * =====================================================
   */

  const normalizeStatus = (status) => {
    const value = String(status).toLowerCase();

    if (
      value.includes("approved") ||
      value.includes("verified")
    ) {
      return "approved";
    }

    if (
      value.includes("rejected") ||
      value.includes("declined")
    ) {
      return "rejected";
    }

    return "pending";
  };

  /*
   * =====================================================
   * REPORT STATISTICS
   * =====================================================
   */

  const statistics = useMemo(() => {

    /*
     * Get unique students.
     *
     * We use roll number when available because
     * names can sometimes be duplicated.
     */

    const uniqueStudents = new Set();

    documents.forEach((item) => {

      const rollNumber = getRollNumber(item);

      const studentName = getStudentName(item);

      if (rollNumber) {
        uniqueStudents.add(`roll-${rollNumber}`);
      } else if (studentName !== "--") {
        uniqueStudents.add(`name-${studentName}`);
      }

    });


    let approved = 0;
    let pending = 0;
    let rejected = 0;


    documents.forEach((item) => {

      const status =
        normalizeStatus(
          getStatus(item)
        );

      if (status === "approved") {
        approved++;
      }

      if (status === "pending") {
        pending++;
      }

      if (status === "rejected") {
        rejected++;
      }

    });


    return {
      totalStudents: uniqueStudents.size,
      approved,
      pending,
      rejected,
    };

  }, [documents]);

  /*
   * =====================================================
   * DEPARTMENT SUMMARY
   * =====================================================
   */

  const departmentSummary = useMemo(() => {

    const departmentMap = {};

    documents.forEach((item) => {

      const department =
        getDepartment(item);

      if (!departmentMap[department]) {

        departmentMap[department] = {
          department,
          students: new Set(),
          approved: 0,
          pending: 0,
          rejected: 0,
        };

      }


      /*
       * Add student
       */

      const rollNumber =
        getRollNumber(item);

      const studentName =
        getStudentName(item);

      if (rollNumber) {

        departmentMap[
          department
        ].students.add(
          `roll-${rollNumber}`
        );

      } else if (
        studentName !== "--"
      ) {

        departmentMap[
          department
        ].students.add(
          `name-${studentName}`
        );

      }


      /*
       * Add status
       */

      const status =
        normalizeStatus(
          getStatus(item)
        );

      if (status === "approved") {
        departmentMap[
          department
        ].approved++;
      }

      if (status === "pending") {
        departmentMap[
          department
        ].pending++;
      }

      if (status === "rejected") {
        departmentMap[
          department
        ].rejected++;
      }

    });


    return Object.values(
      departmentMap
    ).map((item) => ({
      department: item.department,
      students: item.students.size,
      approved: item.approved,
      pending: item.pending,
      rejected: item.rejected,
    }));

  }, [documents]);

  /*
   * =====================================================
   * RECENT ACTIVITY
   * =====================================================
   */

  const recentActivity = useMemo(() => {

    return [...documents]

      .sort((a, b) => {

        const dateA = new Date(
          getDate(a)
        ).getTime();

        const dateB = new Date(
          getDate(b)
        ).getTime();

        return dateB - dateA;

      })

      .slice(0, 10);

  }, [documents]);

  /*
   * =====================================================
   * COMPANY OPTIONS (FROM INTERNSHIP DATA)
   * =====================================================
   */

  const companyOptions = useMemo(() => {
    const names = [
      ...new Set(
        internships
          .map((item) => item.company_name)
          .filter(Boolean)
      ),
    ];
    return names.sort();
  }, [internships]);

  /*
   * =====================================================
   * FILTERED INTERNSHIPS
   * =====================================================
   */

  const filteredInternships = useMemo(() => {
    return internships.filter((item) => {

      /* Company filter */
      const matchesCompany =
        companyFilter === "All Companies" ||
        item.company_name === companyFilter;

      /* Stipend filter */
      let matchesStipend = true;

      if (stipendFilter === "Getting Stipend") {
        matchesStipend =
          item.stipend !== null &&
          item.stipend !== undefined &&
          Number(item.stipend) > 0;
      }

      if (stipendFilter === "Not Getting Stipend") {
        matchesStipend =
          item.stipend === null ||
          item.stipend === undefined ||
          Number(item.stipend) <= 0;
      }

      return matchesCompany && matchesStipend;

    });
  }, [internships, companyFilter, stipendFilter]);

  /*
   * =====================================================
   * EXCEL EXPORT HANDLER
   * =====================================================
   */

  const handleExportExcel = () => {

    const columns = [
      { header: "Student Name", key: "student_name" },
      { header: "Roll Number", key: "roll_number" },
      { header: "Department", key: "department" },
      { header: "Year", key: "year" },
      { header: "Company", key: "company_name" },
      { header: "Role", key: "role" },
      { header: "Internship Status", key: "status" },
      { header: "Stipend Amount", key: "stipend" },
    ];

    /* Add computed stipend status */
    const exportData = filteredInternships.map(
      (item) => ({
        ...item,
        stipend:
          item.stipend !== null &&
          item.stipend !== undefined
            ? item.stipend
            : "0",
      })
    );

    /* Build dynamic filename */
    const parts = ["SIMS"];

    if (companyFilter !== "All Companies") {
      parts.push(
        companyFilter.replace(/\s+/g, "_")
      );
    }

    if (stipendFilter === "Getting Stipend") {
      parts.push("Getting_Stipend");
    }

    if (stipendFilter === "Not Getting Stipend") {
      parts.push("Not_Getting_Stipend");
    }

    parts.push("Internship_Report");

    exportToExcel(
      exportData,
      columns,
      parts.join("_") + ".xlsx"
    );

  };

  /*
   * =====================================================
   * LOADING
   * =====================================================
   */

  if (loading) {

    return (
      <DashboardLayout>

        <BackButton />

        <div className="reports-page">

          <div className="page-header">

            <h1>
              Reports & Analytics
            </h1>

            <p>
              Internship statistics and
              verification overview.
            </p>

          </div>

          <div className="table-card">

            <h2>
              Loading Reports...
            </h2>

            <p>
              Fetching data from the Django
              database.
            </p>

          </div>

        </div>

      </DashboardLayout>
    );

  }

  /*
   * =====================================================
   * ERROR
   * =====================================================
   */

  if (error) {

    return (
      <DashboardLayout>

        <BackButton />

        <div className="reports-page">

          <div className="page-header">

            <h1>
              Reports & Analytics
            </h1>

            <p>
              Internship statistics and
              verification overview.
            </p>

          </div>

          <div className="table-card">

            <h2>
              Unable to Load Reports
            </h2>

            <p
              style={{
                color: "#dc2626",
                marginTop: "10px",
              }}
            >
              {error}
            </p>

          </div>

        </div>

      </DashboardLayout>
    );

  }

  /*
   * =====================================================
   * MAIN UI
   * =====================================================
   */

  return (

    <DashboardLayout>

      <BackButton />

      <div className="reports-page">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="page-header">

          <h1>
            Reports & Analytics
          </h1>

          <p>
            Internship statistics and
            verification overview.
          </p>

        </div>


        {/* =================================================
            STATISTICS
        ================================================= */}

        <div className="stats-grid">

          <div className="stat-card blue">

            <h2>
              {statistics.totalStudents}
            </h2>

            <p>
              Total Students
            </p>

          </div>


          <div className="stat-card yellow">

            <h2>
              {statistics.pending}
            </h2>

            <p>
              Pending Verification
            </p>

          </div>


          <div className="stat-card green">

            <h2>
              {statistics.approved}
            </h2>

            <p>
              Approved
            </p>

          </div>


          <div className="stat-card red">

            <h2>
              {statistics.rejected}
            </h2>

            <p>
              Rejected
            </p>

          </div>

        </div>


        {/* =================================================
            DEPARTMENT SUMMARY
        ================================================= */}

        <div className="table-card">

          <h2>
            Department Summary
          </h2>

          {departmentSummary.length === 0 ? (

            <p>
              No department data available.
            </p>

          ) : (

            <table>

              <thead>

                <tr>

                  <th>
                    Department
                  </th>

                  <th>
                    Students
                  </th>

                  <th>
                    Approved
                  </th>

                  <th>
                    Pending
                  </th>

                  <th>
                    Rejected
                  </th>

                </tr>

              </thead>


              <tbody>

                {departmentSummary.map(
                  (item, index) => (

                    <tr
                      key={
                        item.department ||
                        index
                      }
                    >

                      <td>
                        {item.department}
                      </td>

                      <td>
                        {item.students}
                      </td>

                      <td>
                        {item.approved}
                      </td>

                      <td>
                        {item.pending}
                      </td>

                      <td>
                        {item.rejected}
                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          )}

        </div>


        {/* =================================================
            RECENT VERIFICATION ACTIVITY
        ================================================= */}

        <div className="table-card">

          <h2>
            Recent Verification Activity
          </h2>


          {recentActivity.length === 0 ? (

            <p>
              No recent verification activity.
            </p>

          ) : (

            <table>

              <thead>

                <tr>

                  <th>
                    Student
                  </th>

                  <th>
                    Document
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Date
                  </th>

                </tr>

              </thead>


              <tbody>

                {recentActivity.map(
                  (item, index) => {

                    const status =
                      normalizeStatus(
                        getStatus(item)
                      );

                    return (

                      <tr
                        key={
                          item.id ||
                          item.pk ||
                          index
                        }
                      >

                        <td>
                          {getStudentName(
                            item
                          )}
                        </td>

                        <td>
                          {getDocumentName(
                            item
                          )}
                        </td>

                        <td
                          className={
                            status
                          }
                        >
                          {getStatus(item)}
                        </td>

                        <td>
                          {formatDate(
                            getDate(item)
                          )}
                        </td>

                      </tr>

                    );

                  }
                )}

              </tbody>

            </table>

          )}

        </div>

        {/* =============================================
            INTERNSHIP REPORT — FILTERS + TABLE
        ============================================= */}

        <div className="table-card">

          <div className="table-header">
            <div>
              <h2>Internship Report</h2>
              <p className="table-description">
                Filter by company and stipend status
              </p>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="report-filter-bar">

            <div className="report-filter-group">
              <label
                className="report-filter-label"
                htmlFor="company-filter"
              >
                Company
              </label>
              <select
                id="company-filter"
                className="report-filter-select"
                value={companyFilter}
                onChange={(e) =>
                  setCompanyFilter(e.target.value)
                }
              >
                <option value="All Companies">
                  All Companies
                </option>
                {companyOptions.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div className="report-filter-group">
              <label
                className="report-filter-label"
                htmlFor="stipend-filter"
              >
                Stipend
              </label>
              <select
                id="stipend-filter"
                className="report-filter-select"
                value={stipendFilter}
                onChange={(e) =>
                  setStipendFilter(e.target.value)
                }
              >
                <option value="All Students">
                  All Students
                </option>
                <option value="Getting Stipend">
                  Getting Stipend
                </option>
                <option value="Not Getting Stipend">
                  Not Getting Stipend
                </option>
              </select>
            </div>

            <button
              className="report-export-btn"
              onClick={handleExportExcel}
              disabled={
                filteredInternships.length === 0
              }
            >
              ⬇ Download Excel
            </button>

          </div>

          {/* Result Count */}
          <p className="report-result-count">
            Showing{" "}
            <strong>
              {filteredInternships.length}
            </strong>{" "}
            student{filteredInternships.length !== 1
              ? "s"
              : ""}
          </p>

          {/* Internship Table */}
          {internshipLoading ? (

            <div className="loading-state">
              <p>Loading internship data...</p>
            </div>

          ) : internshipError ? (

            <div className="error-state">
              <p>{internshipError}</p>
            </div>

          ) : filteredInternships.length === 0 ? (

            <div className="loading-state">
              <p>
                No internship records match the
                selected filters.
              </p>
            </div>

          ) : (

            <div className="table-wrapper">
              <table>

                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Roll Number</th>
                    <th>Department</th>
                    <th>Year</th>
                    <th>Company</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Stipend</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredInternships.map(
                    (item, index) => (
                      <tr key={item.id || index}>
                        <td>
                          <strong>
                            {item.student_name ||
                              "--"}
                          </strong>
                        </td>
                        <td>
                          {item.roll_number || "--"}
                        </td>
                        <td>
                          {item.department || "--"}
                        </td>
                        <td>{item.year || "--"}</td>
                        <td>
                          {item.company_name || "--"}
                        </td>
                        <td>
                          {item.role || "--"}
                        </td>
                        <td>
                          <span
                            className={
                              "status-badge " +
                              (item.status || "")
                                .toLowerCase()
                            }
                          >
                            {item.status || "--"}
                          </span>
                        </td>
                        <td>
                          {item.stipend !== null &&
                          item.stipend !== undefined &&
                          Number(item.stipend) > 0
                            ? `₹${Number(
                                item.stipend
                              ).toLocaleString()}`
                            : "No Stipend"}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>

              </table>
            </div>

          )}

        </div>

      </div>

    </DashboardLayout>

  );
};

export default CoordinatorReports;