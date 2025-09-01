import React, { useState, useEffect } from "react"; 
import axios from "axios";
import styles from "./Register.module.css";
import { useNavigate } from "react-router-dom"; // redirect


const Register = () => {
    const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    nic: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setErrors({ ...errors, [e.target.id]: "" }); // clear error while typing
  };

  // 🔹 Combined validation (required + format + uniqueness)
  const validateForm = async () => {
    let newErrors = {};

    // Required + format validations
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";

    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";

    if (!formData.phone) newErrors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = "Phone must be 10 digits";

    if (!formData.dob) newErrors.dob = "Date of birth is required";

    if (!formData.nic) newErrors.nic = "NIC is required";
    else if (!/^\d{9}[Vv]$|^\d{12}$/.test(formData.nic))
      newErrors.nic = "NIC must be 9 digits + V or 12 digits";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    // 🔹 Uniqueness checks (async API calls)
    const fieldsToCheck = ["email", "nic", "phone"];
    for (let field of fieldsToCheck) {
      if (formData[field]) {
        try {
          const response = await axios.get(
            `http://localhost:8081/Complaint-chain/api/auth/check-${field}?${field}=${formData[field]}`
          );
          if (response.data.exists) {
            newErrors[field] = `This ${field} is already registered`;
          }
        } catch (error) {
          console.error(`Error checking ${field} uniqueness`, error);
          newErrors[field] = `Could not validate ${field}. Please try again.`;
        }
      }
    }

    return newErrors;
  };

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => navigate("/login"), 2000); // 2s then redirect
      return () => clearTimeout(timer);
    }
  }, [successMessage, navigate]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = await validateForm(); // run all checks
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const payload = { ...formData };
      delete payload.confirmPassword;

      const response = await axios.post(
        "http://localhost:8081/Complaint-chain/api/auth/register",
        payload
      );

      setSuccessMessage("Registration successful! Welcome " + response.data.firstName);
      setErrors({});
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        dob: "",
        nic: "",
        password: "",
        confirmPassword: ""
      });

      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error) {
      if (error.response && error.response.data) {
        const backendMsg = error.response.data.message || "";
        let newErrors = {};
        if (backendMsg.toLowerCase().includes("email"))
          newErrors.email = "This email is already registered";
        if (backendMsg.toLowerCase().includes("nic"))
          newErrors.nic = "This NIC is already registered";
        if (backendMsg.toLowerCase().includes("phone"))
          newErrors.phone = "This phone is already registered";
        if (!newErrors.email && !newErrors.nic && !newErrors.phone)
          newErrors.general = backendMsg || "Registration failed!";
        setErrors(newErrors);
      } else {
        setErrors({ general: "Network error. Please try again." });
      }
    }
  };

  return (
    <div className={styles.registerPageContainer}>
      <div className={styles.registerPageLeft}>
        <div>
          <h1>Join the Citizen Portal</h1>
          <p>
            Register to submit complaints, track progress, and stay connected
            with public services.
          </p>
        </div>
      </div>

      <div className={styles.registerPageRight}>
        <div className={styles.registerPageBox}>
          <h2>Register</h2>

          {errors.general && (
            <div className={styles.errorMessage}>{errors.general}</div>
          )}
          {successMessage && (
            <div className={styles.popupOverlay}>
              <div className={styles.successMessagePopup}>
                {successMessage}
              </div>
            </div>
          )}

          <form className={styles.registerPageForm} onSubmit={handleSubmit}>
            {[
              "firstName",
              "lastName",
              "email",
              "phone",
              "dob",
              "nic",
              "password",
              "confirmPassword"
            ].map((field) => (
              <div key={field} className={styles.registerPageFormGroup}>
                <label htmlFor={field}>
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <div className={styles.inputWithIcon}>
                  <input
                    type={
                      field.includes("password")
                        ? "password"
                        : field === "dob"
                          ? "date"
                          : "text"
                    }
                    id={field}
                    value={formData[field]}
                    onChange={handleChange}
                  />
                  {errors[field] && (
                    <span
                      className={styles.errorIcon}
                      data-tooltip={errors[field]}
                    ></span>
                  )}
                </div>
              </div>
            ))}

            <div
              className={`${styles.registerPageFormGroup} ${styles.registerPageFullWidth}`}
            >
              <button className={styles.registerPageButton} type="submit">
                Register
              </button>
            </div>

            <div className={styles.registerPageExtraLinks}>
              <p>
                Already have an account? <a href="/login">Login</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
