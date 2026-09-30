import DashboardLayout from "../../../layouts/DashboardLayout";
import "./AdminReports.css";
import BackButton from "../../../components/common/BackButton/BackButton";
import { useEffect, useMemo, useState } from "react";
import { getAdminDashboard, getInternshipReport } from "../../../services/api";
import { exportToExcel } from "../../../utils/exportExcel";

const initialReports = [
  {
    id: 1,
    report: "CSE Internship Report",
    department: "CSE",
    generatedBy: "Admin",
    date: "25 Jul 2026",
    status: "Generated",
  },
  {
    id: 2,
    report: "ECE Internship Summary",
    department: "ECE",
    generatedBy: "Admin",
    date: "24 Jul 2026",
    status: "Generated",
  },
  {
    id: 3,
    report: "Weekly Progress Report",
    department: "IT",
    generatedBy: "Coordinator",
    date: "23 Jul 2026",
    status: "Pending",
  },
  {
    id: 4,
    report: "Completion Certificate Report",
    department: "AI & DS",
    generatedBy: "Admin",
    date: "22 Jul 2026",
    status: "Generated",
  },
];

const AdminReports = () => {
  const [reports, setReports] = useState(initialReports);

  useEffect(() => {
    getAdminDashboard()
      .then((data) => setReports(data.reports || []))
      .catch(() => setReports([]));
  }, []);

  /* =====================================================
     INTERNSHIP REPORT STATE
  ===================================================== */

  const [internships, setInternships] = useState([]);
  const [internshipLoading, setInternshipLoading] = useState(true);
  const [internshipError, setInternshipError] = useState("");
  const [companyFilter, setCompanyFilter] = useState("All Companies");
  const [stipendFilter, setStipendFilter] = useState("ALL");

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
        setInternshipError("Unable to load internship data.");
      } finally {
        setInternshipLoading(false);
      }
    };

    loadInternships();
  }, []);

  /* Company options from data */
  const companyOptions = useMemo(() => {
    const names = [
      ...new Set(
        internships.map((i) => i.company_name).filter(Boolean)
      ),
    ];
    return names.sort();
  }, [internships]);

  /* Filtered internships */
  const filteredInternships = useMemo(() => {
    return internships.filter((item) => {

      const matchesCompany =
        companyFilter === "All Companies" ||
        item.company_name === companyFilter;

      const stipendType = item.stipend_type || (
        item.stipend !== null &&
        item.stipend !== undefined &&
        Number(item.stipend) > 0
          ? "STIPEND"
          : "NO_STIPEND"
      );

      const matchesStipend =
        stipendFilter === "ALL" || stipendType === stipendFilter;

      return matchesCompany && matchesStipend;
    });
  }, [internships, companyFilter, stipendFilter]);

  /* Excel export */
  const handleExportExcel = () => {

    const columns = [
      { header: "Student Name", key: "student_name" },
      { header: "Roll Number", key: "roll_number" },
      { header: "Department", key: "department" },
      { header: "Year", key: "year" },
      { header: "Company", key: "company_name" },
      { header: "Role", key: "role" },
      { header: "Internship Status", key: "status" },
      { header: "Stipend Type", key: "stipend_type_label" },
      { header: "Stipend Amount", key: "stipend" },
    ];

    const exportData = filteredInternships.map((item) => ({
      ...item,
      stipend_type_label:
        item.stipend_type === "PAID_BY_STUDENT"
          ? "Paid By Student"
          : item.stipend_type === "STIPEND" ||
            (!item.stipend_type && Number(item.stipend) > 0)
            ? "Stipend"
            : "No Stipend",
      stipend:
        item.stipend !== null && item.stipend !== undefined
          ? item.stipend
          : "",
    }));

    const parts = ["SIMS"];

    if (companyFilter !== "All Companies") {
      parts.push(companyFilter.replace(/\s+/g, "_"));
    }

    if (stipendFilter !== "ALL") {
      parts.push(stipendFilter);
    }

    parts.push("Internship_Report");

    exportToExcel(exportData, columns, parts.join("_") + ".xlsx");
  };

  return (
    <DashboardLayout>
      <BackButton />

      <div className="admin-reports">

        <div className="page-header">
          <h1>Reports Management</h1>

          <p>
            View and download internship reports.
          </p>
        </div>


        <div className="table-card">

          <table>

            <thead>

              <tr>
                <th>ID</th>
                <th>Report Name</th>
                <th>Department</th>
                <th>Generated By</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>

            </thead>


            <tbody>

              {reports.map((report) => (

                <tr key={report.id}>

                  <td>
                    {report.id}
                  </td>

                  <td>{report.report}</td>

                  <td>
                    {report.student || report.department || "--"}
                  </td>

                  <td>
                    {report.generatedBy || "System"}
                  </td>

                  <td>
                    {report.date ? new Date(report.date).toLocaleDateString() : "--"}
                  </td>

                  <td>
                    {report.status}
                  </td>

                  <td>

                    <button className="view-btn" onClick={() => report.file ? window.open(report.file, "_blank", "noopener,noreferrer") : window.alert("No report file is available.")}>
                      View
                    </button>

                    <button className="download-btn" onClick={() => report.file ? window.open(report.file, "_blank", "noopener,noreferrer") : window.alert("No report file is available.")}>
                      Download
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {/* =============================================
            INTERNSHIP REPORT — FILTERS + TABLE
        ============================================= */}

        <div className="table-card internship-report-card">

          <h2 className="internship-report-title">
            Internship Report
          </h2>
          <p className="internship-report-desc">
            Filter by company and stipend status
          </p>

          {/* Filter Bar */}
          <div className="admin-filter-bar">

            <div className="admin-filter-group">
              <label
                className="admin-filter-label"
                htmlFor="admin-company-filter"
              >
                Company
              </label>
              <select
                id="admin-company-filter"
                className="admin-filter-select"
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

            <div className="admin-filter-group">
              <label
                className="admin-filter-label"
                htmlFor="admin-stipend-filter"
              >
                Stipend
              </label>
              <select
                id="admin-stipend-filter"
                className="admin-filter-select"
                value={stipendFilter}
                onChange={(e) =>
                  setStipendFilter(e.target.value)
                }
              >
                <option value="ALL">
                  All Students
                </option>
                <option value="STIPEND">
                  Stipend
                </option>
                <option value="NO_STIPEND">
                  No Stipend
                </option>
                <option value="PAID_BY_STUDENT">
                  Paid By Student
                </option>
              </select>
            </div>

            <button
              className="admin-export-btn"
              onClick={handleExportExcel}
              disabled={
                filteredInternships.length === 0
              }
            >
              ⬇ Download Excel
            </button>

          </div>

          {/* Result Count */}
          <p className="admin-result-count">
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

            <p style={{ color: "#64748b", padding: "20px 0" }}>
              Loading internship data...
            </p>

          ) : internshipError ? (

            <p style={{ color: "#dc2626", padding: "20px 0" }}>
              {internshipError}
            </p>

          ) : filteredInternships.length === 0 ? (

            <p style={{ color: "#64748b", padding: "20px 0" }}>
              No internship records match the
              selected filters.
            </p>

          ) : (

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
                          {item.student_name || "--"}
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
                      <td>{item.role || "--"}</td>
                      <td>{item.status || "--"}</td>
                      <td>
                        {item.stipend_type === "PAID_BY_STUDENT"
                          ? "Paid By Student"
                          : item.stipend_type === "STIPEND" ||
                            (!item.stipend_type && Number(item.stipend) > 0)
                            ? `Stipend - ₹${Number(
                                item.stipend
                              ).toLocaleString()}`
                            : "No Stipend"}
                      </td>
                    </tr>
                  )
                )}
              </tbody>

            </table>

          )}

        </div>

      </div>

    </DashboardLayout>
  );
};

export default AdminReports;