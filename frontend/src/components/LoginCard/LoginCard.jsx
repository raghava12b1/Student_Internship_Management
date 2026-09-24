import "./LoginCard.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../services/api";

function LoginCard() {

  const navigate = useNavigate();

  const [role, setRole] = useState("Student");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");


  const handleLogin = async () => {

    console.log("Login button clicked");
    console.log("Username:", username);
    console.log("Role:", role);

    setError("");


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


    setIsLoading(true);

    try {

      // ========================================
      // CALL DJANGO LOGIN API
      // ========================================

      const response = await apiFetch(
        "/accounts/login/",
        {
          method: "POST",
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        }
      );


      // ========================================
      // CHECK RESPONSE STATUS
      // ========================================

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || "Login failed. Please check your credentials."
        );
      }


      const data = await response.json();

      console.log("Login response:", data);


      // ========================================
      // SAVE TOKENS
      // ========================================

      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);


      // ========================================
      // SAVE USER INFO
      // ========================================

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

      console.log(
        "Access Token:",
        localStorage.getItem("accessToken")
      );


      // ========================================
      // NAVIGATE ACCORDING TO ROLE
      // ========================================

      if (role === "Student") {

        navigate("/student/dashboard");

      }

      else if (role === "Coordinator") {

        navigate("/coordinator/dashboard");

      }

      else if (role === "Admin") {

        navigate("/admin/dashboard");

      }

    } catch (err) {

      console.error("Login error:", err);
      setError(err.message);
      alert("Login Failed: " + err.message);

    } finally {

      setIsLoading(false);

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


            {/* Error Message */}

            {error && (
              <div style={{
                color: "red",
                fontSize: "14px",
                marginBottom: "10px",
                textAlign: "center"
              }}>
                {error}
              </div>
            )}

            {/* Login */}

            <button
              type="button"
              className="login-btn"
              onClick={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>


          </div>

        </div>

      </div>

    </section>

  );

}

export default LoginCard;