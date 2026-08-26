import "./RecentApplications.css";

const RecentApplications = () => {

  /*
   * =====================================================
   * CURRENT USER / STUDENT DATA
   * =====================================================
   *
   * Later this information will come from Django.
   *
   * Expected structure:
   *
   * {
   *   recentSubmissions: [
   *     {
   *       document: "Offer Letter",
   *       submittedOn: "20 Jul 2026",
   *       status: "Approved",
   *       verifiedBy: "Coordinator"
   *     }
   *   ]
   * }
   */

  let currentUser = null;

  try {
    const storedUser = localStorage.getItem("currentUser");

    if (storedUser) {
      currentUser = JSON.parse(storedUser);
    }
  } catch (error) {
    console.error("Unable to read current user:", error);
  }


  /*
   * =====================================================
   * RECENT SUBMISSIONS
   * =====================================================
   */

  const submissions =
    Array.isArray(currentUser?.recentSubmissions)
      ? currentUser.recentSubmissions
      : [];


  /*
   * =====================================================
   * STATUS CLASS
   * =====================================================
   */

  const getStatusClass = (status) => {

    if (!status) {
      return "not-submitted";
    }

    return status
      .toLowerCase()
      .replace(/\s+/g, "-");

  };


  /*
   * =====================================================
   * UI
   * =====================================================
   */

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

              <tr key={item.id || index}>

                <td>
                  {item.document || "--"}
                </td>

                <td>
                  {item.submittedOn || "--"}
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
                  {item.verifiedBy || "--"}
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