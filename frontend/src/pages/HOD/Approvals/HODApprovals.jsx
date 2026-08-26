import DashboardLayout from "../../../layouts/DashboardLayout";
import "./HODApprovals.css";
import BackButton from "../../../components/common/BackButton/BackButton";
const approvals = [
  {
    id: 1,
    student: "Bala Krishna",
    roll: "21A91A0501",
    document: "Offer Letter",
    coordinator: "Dr. Ramesh",
    status: "Pending",
  },
  {
    id: 2,
    student: "Rahul",
    roll: "21A91A0502",
    document: "Final Report",
    coordinator: "Dr. Suresh",
    status: "Pending",
  },
  {
    id: 3,
    student: "Anjali",
    roll: "21A91A0503",
    document: "Completion Certificate",
    coordinator: "Dr. Priya",
    status: "Pending",
  },
];

const HODApprovals = () => {
  return (
    <DashboardLayout>
       <BackButton />

      <div className="hod-approvals">

        <div className="page-header">

          <h1>Department Approvals</h1>

          <p>
            Review internship documents submitted by coordinators.
          </p>

        </div>

        <div className="approval-card">

          <table>

            <thead>

              <tr>

                <th>ID</th>
                <th>Student</th>
                <th>Roll No</th>
                <th>Document</th>
                <th>Coordinator</th>
                <th>Status</th>
                <th>Action</th>

              </tr>

            </thead>

            <tbody>

              {approvals.map((item) => (

                <tr key={item.id}>

                  <td>{item.id}</td>

                  <td>{item.student}</td>

                  <td>{item.roll}</td>

                  <td>{item.document}</td>

                  <td>{item.coordinator}</td>

                  <td>{item.status}</td>

                  <td>

                    <button className="view-btn">
                      View
                    </button>

                    <button className="approve-btn">
                      Approve
                    </button>

                    <button className="reject-btn">
                      Reject
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

export default HODApprovals;