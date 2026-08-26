import DashboardLayout from "../../../layouts/DashboardLayout";
import "./CoordinatorStudentDetails.css";
import BackButton from "../../../components/common/BackButton/BackButton";

const CoordinatorStudentDetails = () => {
  return (
    <DashboardLayout>

      <BackButton />

      <div className="student-details">


        {/* =================================================
            STUDENT PROFILE
        ================================================= */}

        <div className="profile-card">

          <div className="profile-left">

            <div className="avatar">
              BK
            </div>

            <div>

              <h2>
                Bala Krishna
              </h2>

              <p>
                Roll No : 21A91A0501
              </p>

              <p>
                CSE - III Year
              </p>

            </div>

          </div>


          <div className="profile-right">

            <button className="approve">
              Approve Student
            </button>

          </div>

        </div>


        {/* =================================================
            INTERNSHIP
        ================================================= */}

        <div className="details-card">

          <h2>
            Internship Details
          </h2>

          <div className="grid">

            <div>

              <span>
                Company
              </span>

              <h3>
                Infosys
              </h3>

            </div>


            <div>

              <span>
                Role
              </span>

              <h3>
                Frontend Developer
              </h3>

            </div>


            <div>

              <span>
                Duration
              </span>

              <h3>
                2 Months
              </h3>

            </div>


            <div>

              <span>
                Status
              </span>

              <h3>
                Ongoing
              </h3>

            </div>

          </div>

        </div>


        {/* =================================================
            DOCUMENTS
        ================================================= */}

        <div className="details-card">

          <h2>
            Uploaded Documents
          </h2>


          <table>

            <thead>

              <tr>

                <th>
                  Document
                </th>

                <th>
                  Status
                </th>

                <th>
                  View
                </th>

                <th>
                  Approve
                </th>

              </tr>

            </thead>


            <tbody>


              {/* OFFER LETTER */}

              <tr>

                <td>
                  Offer Letter
                </td>

                <td>
                  Pending
                </td>

                <td>

                  <button className="view-btn">
                    View PDF
                  </button>

                </td>

                <td>

                  <button className="approve">
                    Approve
                  </button>

                </td>

              </tr>


              {/* FINAL REPORT */}

              <tr>

                <td>
                  Final Report
                </td>

                <td>
                  Not Uploaded
                </td>

                <td>
                  -
                </td>

                <td>
                  -
                </td>

              </tr>


              {/* COMPLETION CERTIFICATE */}

              <tr>

                <td>
                  Completion Certificate
                </td>

                <td>
                  Not Uploaded
                </td>

                <td>
                  -
                </td>

                <td>
                  -
                </td>

              </tr>


            </tbody>

          </table>

        </div>

      </div>

    </DashboardLayout>
  );
};

export default CoordinatorStudentDetails;