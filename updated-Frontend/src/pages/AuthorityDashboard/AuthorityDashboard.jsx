import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AuthorityDashboard.css"; // Reuse same styles

const AuthorityDashboard = () => {
  const [activeTab, setActiveTab] = useState("assigned");
  const [userData, setUserData] = useState({ id: "", name: "", email: "", department: "" });
  const [assignedComplaints, setAssignedComplaints] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [logoutPopup, setLogoutPopup] = useState(false);
  const [showMessage, setShowMessage] = useState(false); // control display of success message

  // Fetch authority details
  useEffect(() => {
    const email = localStorage.getItem("authorityEmail");
    if (!email) return setError("No email found. Please log in.");

    axios
      .get(`http://localhost:8081/Complaint-chain/api/authority/findByEmail?email=${email}`)
      .then((res) => setUserData(res.data))
      .catch(() => setError("❌ Failed to fetch authority details."));
  }, []);

  // Load assigned complaints
  useEffect(() => {
    if (activeTab === "assigned") loadAssignedComplaints();
  }, [activeTab]);

  const loadAssignedComplaints = () => {
    const email = localStorage.getItem("authorityEmail");
    if (!email) return setError("No email found. Please log in.");

    axios
      .get(`http://localhost:8081/Complaint-chain/api/tasks/complaints-by-authority?email=${email}`)
      .then((res) => setAssignedComplaints(res.data))
      .catch(() => setError("❌ Failed to load assigned complaints."));
  };

  // Mark complaint as resolved
  const handleResolve = (id) => {
    axios
      .put(`http://localhost:8081/Complaint-chain/api/complaints/resolve/${id}`)
      .then(() => {
        setMessage("✅ Complaint marked as resolved!");
        setShowMessage(true);
        setAssignedComplaints(assignedComplaints.filter((c) => c.id !== id));

        // hide after 2.5s
        setTimeout(() => {
          setMessage("");
          setShowMessage(false);
        }, 2500);
      })
      .catch(() => setError("❌ Failed to resolve complaint."));
  };

  const handleLogout = () => {
    localStorage.removeItem("authorityEmail");
    window.location.href = "/";
  };

  return (
    <div className="cust-home-page">
      <div className="cust-home-container">
        <h1>Authority Dashboard</h1>
        {error && <div className="cust-error">{error}</div>}

        {/* Success Message */}
        {showMessage && (
          <div className="popupOverlay">
            <div
              style={{
                backgroundColor: "#001f4d", // dark blue
                color: "#ffffff",
                padding: "20px",
                borderRadius: "10px",
                fontSize: "16px",
                fontWeight: "bold",
                boxShadow: "0px 0px 10px rgba(0,0,0,0.2)",
                minWidth: "300px",
                textAlign: "center",
              }}
            >
              {message}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="cust-btn-group">
          <button className={`cust-btn ${activeTab==="assigned"?"cust-btn-active":""}`} onClick={()=>setActiveTab("assigned")}>Assigned Complaints</button>
          <button className={`cust-btn ${activeTab==="profile"?"cust-btn-active":""}`} onClick={()=>setActiveTab("profile")}>Profile</button>
        </div>

        {/* Assigned Complaints */}
        {activeTab === "assigned" && (
          <div className="cust-tab-box">
            <h3>Assigned Complaints</h3>
            <table className="cust-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Citizen</th>
                  <th>Department</th>
                  <th>Priority</th>
                  <th>Description</th>
                  <th>Submitted At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {assignedComplaints.map((c) => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.name}</td>
                    <td>{c.department}</td>
                    <td>{c.urgency}</td>
                    <td>{c.description}</td>
                    <td>{new Date(c.submittedAt).toLocaleString()}</td>
                    <td>
                      <button onClick={() => handleResolve(c.id)}>Resolve</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Profile */}
        {activeTab === "profile" && (
          <div className="cust-tab-box">
            <h3>Authority Profile</h3>
            <table className="cust-table">
              <tbody>
                <tr><td>ID:</td><td>{userData.id}</td></tr>
                <tr><td>Name:</td><td>{userData.name}</td></tr>
                <tr><td>Email:</td><td>{userData.email}</td></tr>
                <tr><td>Department:</td><td>{userData.department}</td></tr>
              </tbody>
            </table>
            <div style={{ marginTop: "20px", textAlign: "center" }}>
              <button onClick={() => setLogoutPopup(true)} className="cust-btn-submit">Logout</button>
            </div>
            {logoutPopup && (
              <div className="popupOverlay">
                <div className="cancelPopup">
                  <h3>Confirm Logout</h3>
                  <p>Are you sure you want to logout?</p>
                  <div className="popupButtons">
                    <button onClick={handleLogout}>Yes, Logout</button>
                    <button onClick={() => setLogoutPopup(false)}>Cancel</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorityDashboard;
