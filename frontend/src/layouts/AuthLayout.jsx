import "./AuthLayout.css";

const AuthLayout = ({ children }) => {
  return (
    <div className="auth-layout">
      <div className="auth-left">
        <div className="overlay">
          <h1>Student Internship Management System</h1>
          <p>
            Simplifying internship management for students,
            coordinators and administrators through one
            powerful platform.
          </p>
        </div>
      </div>

      <div className="auth-right">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;