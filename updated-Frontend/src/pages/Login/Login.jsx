import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Login.module.css";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setErrors({ ...errors, [e.target.id]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // 1️⃣ Admin login (local)
      if (
        formData.email === "admin@gmail.com" &&
        formData.password === "admin123"
      ) {
        localStorage.setItem("userEmail", formData.email);
        setSuccessMessage("Welcome, Admin!");
        setFormData({ email: "", password: "" });
        setTimeout(() => {
          setSuccessMessage("");
          navigate("/admin");
        }, 1500);
        return;
      }

      // 2️⃣ Authority login
      try {
        const authResponse = await axios.post(
          "http://localhost:8081/Complaint-chain/api/authority/login",
          formData
        );

        localStorage.setItem("authorityEmail", authResponse.data.email);
        
        setSuccessMessage(`Welcome, ${authResponse.data.name}!`);
        setFormData({ email: "", password: "" });
        setErrors({});
        setTimeout(() => {
          setSuccessMessage("");
          navigate("/authority"); // authority dashboard route
        }, 1500);
        return;
      } catch (authErr) {
        // if authority login fails, continue to citizen
      }

      // 3️⃣ Citizen login
      const response = await axios.post(
        "http://localhost:8081/Complaint-chain/api/auth/login",
        formData
      );

      localStorage.setItem("citizenEmail", response.data.email);
      setSuccessMessage(`Welcome, ${response.data.firstName}`);
      setFormData({ email: "", password: "" });
      setErrors({});
      setTimeout(() => {
        setSuccessMessage("");
        navigate("/dashboard"); // citizen dashboard route
      }, 1500);

    } catch (error) {
      let backendMsg = error.response?.data?.message || "Login failed!";
      let err = {};
      if (backendMsg.toLowerCase().includes("email")) err.email = backendMsg;
      else if (backendMsg.toLowerCase().includes("password"))
        err.password = backendMsg;
      else err.general = backendMsg;

      setErrors(err);
      setTimeout(() => setErrors({}), 3000);
    }
  };

  return (
    <div className={styles.loginPageContainer}>
      <div className={styles.loginPageLeft}>
        <div>
          <h1>Welcome Back</h1>
          <p>Log in to access your portal, manage complaints, and stay updated.</p>
        </div>
      </div>

      <div className={styles.loginPageRight}>
        <div className={styles.loginPageBox}>
          <h2>Login</h2>

          {errors.general && <div className={styles.errorMessage}>{errors.general}</div>}
          {successMessage && (
            <div className={styles.popupOverlay}>
              <div className={styles.successMessagePopup}>{successMessage}</div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {["email", "password"].map((field) => (
              <div key={field} className={styles.loginPageFormGroup}>
                <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <div className={styles.inputWithIcon}>
                  <input
                    type={field === "password" ? "password" : "text"}
                    id={field}
                    value={formData[field]}
                    onChange={handleChange}
                  />
                  {errors[field] && (
                    <span className={styles.errorIcon} data-tooltip={errors[field]}></span>
                  )}
                </div>
              </div>
            ))}

            <div className={styles.loginPageFormGroupFull}>
              <button className={styles.loginPageButton} type="submit">Login</button>
            </div>

            <div className={styles.loginPageExtraLinks}>
              <p>
                Don’t have an account? <a href="/register">Register</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
