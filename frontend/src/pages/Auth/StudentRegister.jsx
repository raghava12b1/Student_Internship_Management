import { useState } from "react";
import { Link } from "react-router-dom";
import "./StudentRegister.css";


const StudentRegister = () => {
  const [formData, setFormData] = useState({
    studentName: "",
    rollNumber: "",
    registrationNumber: "",
    department: "",
    year: "",
    semester: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    console.log(formData);

    alert("Registration Successful!");

    // Later we'll connect Django API here
  };

  return (
    <div className="register-container">

      <div className="register-card">

        <h1>Student Registration</h1>
        <p>Create your internship portal account</p>

        <form onSubmit={handleSubmit}>

          <div className="input-group">
            <label>Student Name</label>
            <input
              type="text"
              name="studentName"
              placeholder="Enter Student Name"
              value={formData.studentName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Roll Number</label>
            <input
              type="text"
              name="rollNumber"
              placeholder="Enter Roll Number"
              value={formData.rollNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Registration Number</label>
            <input
              type="text"
              name="registrationNumber"
              placeholder="Enter Registration Number"
              value={formData.registrationNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Department</label>

            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
            >
              <option value="">Select Department</option>
              <option>IT</option>
              <option>DS</option>
              {/* <option>CSE</option>
              <option>AIML</option>
              <option>AIDS</option> */}
              {/* <option>ECE</option>
              <option>EEE</option>
              <option>Mechanical</option>
              <option>Civil</option> */}
            </select>
          </div>

          <div className="row">

            <div className="input-group">
              <label>Year</label>

              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
              >
                <option value="">Year</option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
              </select>

            </div>

            <div className="input-group">

              <label>Semester</label>

              <select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                required
              >
                <option value="">Semester</option>
                <option>1</option>
                <option>2</option>
              </select>

            </div>

          </div>

          <div className="input-group">
            <label>Mobile Number</label>

            <input
              type="tel"
              name="mobile"
              placeholder="Enter Mobile Number"
              value={formData.mobile}
              onChange={handleChange}
              required
            />

          </div>

          <div className="input-group">
            <label>Email ID</label>

            <input
              type="email"
              name="email"
              placeholder="Enter Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />

          </div>

          <div className="input-group">
            <label>Password</label>

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

          </div>

          <div className="input-group">
            <label>Confirm Password</label>

            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

          </div>

          <div className="show-password">

            <input
              type="checkbox"
              onChange={() => setShowPassword(!showPassword)}
            />

            <span>Show Password</span>

          </div>

          <button className="register-btn" type="submit">
            Register
          </button>

          <div className="login-link">
            Already have an account?{" "}
            <Link to="/">Login</Link>
          </div>

        </form>

      </div>

    </div>
  );
};

export default StudentRegister;