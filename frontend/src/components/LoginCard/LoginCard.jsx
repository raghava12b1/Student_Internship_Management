import "./LoginCard.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginCard() {

  const navigate = useNavigate();

  const [role, setRole] = useState("Student");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");


  const handleLogin = () => {

    console.log("Login button clicked");
    console.log("Username:", username);
    console.log("Role:", role);


    // Check username
    if (!username.trim()) {
      alert("Please enter username");
      return;
    }


    // Check password
    if (!password.trim()) {
      alert("Please enter password");
      return;
    }


    // Save login information
    localStorage.setItem("userName", username);
    localStorage.setItem("userRole", role);


    console.log(
      "Saved Name:",
      localStorage.getItem("userName")
    );

    console.log(
      "Saved Role:",
      localStorage.getItem("userRole")
    );


    // Navigate according to role

    if (role === "Student") {

      navigate("/student/dashboard");

    }

    else if (role === "Coordinator") {

      navigate("/coordinator/dashboard");

    }

    else if (role === "Admin") {

      navigate("/admin/dashboard");

    }

  };


  return (

    <section className="login-section">

      <div className="login-card">


        {/* Login Information */}

        <div className="login-info">

          <h2>
            Login to Continue
          </h2>

          <p>
            Access your dashboard based on your role.
          </p>

        </div>


        {/* Login Content */}

        <div className="login-content">


          {/* Role Buttons */}

          <div className="role-buttons">


            {/* Student */}

            <button
              type="button"
              className={`role-btn ${
                role === "Student" ? "active" : ""
              }`}
              onClick={() => setRole("Student")}
            >
              👨‍🎓 Student
            </button>


            {/* Coordinator */}

            <button
              type="button"
              className={`role-btn ${
                role === "Coordinator" ? "active" : ""
              }`}
              onClick={() => setRole("Coordinator")}
            >
              👨‍🏫 Internship Coordinator
            </button>


            {/* Admin */}

            <button
              type="button"
              className={`role-btn ${
                role === "Admin" ? "active" : ""
              }`}
              onClick={() => setRole("Admin")}
            >
              🛡 Admin
            </button>


          </div>


          {/* Login Form */}

          <div className="login-form">


            {/* Username */}

            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
            />


            {/* Password */}

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />


            {/* Forgot Password */}

            <a href="#">
              Forgot Password?
            </a>


            {/* Login */}

            <button
              type="button"
              className="login-btn"
              onClick={handleLogin}
            >
              Login
            </button>


          </div>

        </div>

      </div>

    </section>

  );

}

export default LoginCard;