import "./RecentApplications.css";

const RecentApplications = ({ dashboardData }) => {

  // ============================================================
  // RECENT SUBMISSIONS FROM DJANGO
  // ============================================================

  const submissions = Array.isArray(
    dashboardData?.recent_submissions
  )
    ? dashboardData.recent_submissions
    : [];

  // ============================================================
  // STATUS CLASS
  // ============================================================

  const getStatusClass = (status) => {
    if (!status) {
      return "not-submitted";
    }

    return status
      .toLowerCase()
      .replace(/\s+/g, "-");
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="recent-card">

      <div className="recent-header">
        <h2>
          Recent Submissions
        </h2>
      </div>

      {submissions.length > 0 ? (

        <table className="recent-table">

          <thead>
            <tr>
              <th>
                Document
              </th>

              <th>
                Submitted On
              </th>

              <th>
                Status
              </th>

              <th>
                Verified By
              </th>
            </tr>
          </thead>

          <tbody>

            {submissions.map((item, index) => (

              <tr
                key={item.id || index}
              >

                <td>
                  {item.document || "--"}
                </td>

                <td>
                  {item.submitted_on || "--"}
                </td>

                <td>

                  <span
                    className={`status ${getStatusClass(
                      item.status
                    )}`}
                  >
                    {item.status || "Not Submitted"}
                  </span>

                </td>

                <td>
                  {item.verified_by || "--"}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      ) : (

        <div className="no-submissions">
          <p>
            No submissions available.
          </p>
        </div>

      )}

    </div>
  );
};

export default RecentApplications;