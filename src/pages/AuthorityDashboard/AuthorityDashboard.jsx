import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AuthorityDashboard.css"; // Reuse same styles

const AuthorityDashboard = () => {
  const [activeTab, setActiveTab] = useState("assigned");
  const [userData, setUserData] = useState({ id: "", name: "", email: "", department: "" });
  const [assignedComplaints, setAssignedComplaints] = useState([]);
  const [resolvedComplaints, setResolvedComplaints] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [logoutPopup, setLogoutPopup] = useState(false);

  // Fetch authority details
  useEffect(() => {
    const email = localStorage.getItem("authorityEmail");
    if (!email) return setError("No email found. Please log in.");

    axios
      .get(`http://localhost:8081/Complaint-chain/api/auth/authority?email=${email}`)
      .then((res) => setUserData(res.data))
      .catch(() => setError("❌ Failed to fetch authority details."));
  }, []);

  // Load assigned complaints
  useEffect(() => {
    if (activeTab === "assigned") loadAssignedComplaints();
    if (activeTab === "resolved") loadResolvedComplaints();
  }, [activeTab]);

  const loadAssignedComplaints = () => {
    axios
      .get("http://localhost:8081/Complaint-chain/api/complaints/assigned")
      .then((res) => setAssignedComplaints(res.data))
      .catch(() => setError("❌ Failed to load assigned complaints."));
  };

  const loadResolvedComplaints = () => {
    axios
      .get("http://localhost:8081/Complaint-chain/api/complaints/resolved")
      .then((res) => setResolvedComplaints(res.data))
      .catch(() => setError("❌ Failed to load resolved complaints."));
  };

  // Mark complaint as resolved
  const handleResolve = (id) => {
    axios
      .post(`http://localhost:8081/Complaint-chain/api/complaints/resolve/${id}`)
      .then(() => {
        setMessage("✅ Complaint marked as resolved!");
        setAssignedComplaints(assignedComplaints.filter((c) => c.id !== id));
        loadResolvedComplaints();
        setTimeout(() => setMessage(""), 2500);
      })
      .catch(() => setError("❌ Failed to resolve complaint."));
  };

  // Reject complaint with reason
  const handleReject = (id) => {
    const reason = prompt("Enter reason for rejection:");
    if (!reason) return;

    axios
      .post(`http://localhost:8081/Complaint-chain/api/complaints/reject/${id}?reason=${encodeURIComponent(reason)}`)
      .then(() => {
        setMessage("⚠️ Complaint rejected successfully!");
        setAssignedComplaints(assignedComplaints.filter((c) => c.id !== id));
        setTimeout(() => setMessage(""), 2500);
      })
      .catch(() => setError("❌ Failed to reject complaint."));
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
        {message && (
          <div className="popupOverlay">
            <div className="successMessagePopup">{message}</div>
          </div>
        )}

        {/* Tabs */}
        <div className="cust-btn-group">
          <button className={`cust-btn ${activeTab==="assigned"?"cust-btn-active":""}`} onClick={()=>setActiveTab("assigned")}>Assigned Complaints</button>
          <button className={`cust-btn ${activeTab==="resolved"?"cust-btn-active":""}`} onClick={()=>setActiveTab("resolved")}>Resolved Complaints</button>
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
                      <button onClick={() => handleReject(c.id)}>Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Resolved Complaints */}
        {activeTab === "resolved" && (
          <div className="cust-tab-box">
            <h3>Resolved Complaints</h3>
            <table className="cust-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Citizen</th>
                  <th>Department</th>
                  <th>Description</th>
                  <th>Resolved At</th>
                </tr>
              </thead>
              <tbody>
                {resolvedComplaints.map((c) => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.name}</td>
                    <td>{c.department}</td>
                    <td>{c.description}</td>
                    <td>{new Date(c.resolvedAt).toLocaleString()}</td>
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
