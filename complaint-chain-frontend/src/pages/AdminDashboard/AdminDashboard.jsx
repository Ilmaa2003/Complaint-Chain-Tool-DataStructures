import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("track");
  const [complaints, setComplaints] = useState([]);
  const [cancelledComplaints, setCancelledComplaints] = useState([]);
  const [authorities, setAuthorities] = useState([]);
  const [citizens, setCitizens] = useState([]);
  const [trackFilter, setTrackFilter] = useState("high-low");
  const [trackStatus, setTrackStatus] = useState("pending");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Authority popup state
  const [authorityPopup, setAuthorityPopup] = useState({
    visible: false,
    editing: false,
    data: { id: null, name: "", email: "", phone: "", password: "", department: "Select Department", level: "Level 1" },
    errors: {}
  });

  // ------------------- Fetch functions -------------------
  const loadComplaints = () => {
    axios.get(`http://localhost:8081/Complaint-chain/api/complaints/${trackStatus}?sort=${trackFilter}`)
      .then(res => setComplaints(res.data))
      .catch(() => setError("❌ Failed to load complaints."));
  };

  const loadCancelledComplaints = () => {
    axios.get("http://localhost:8081/Complaint-chain/api/complaints/cancelled")
      .then(res => setCancelledComplaints(res.data))
      .catch(() => setError("❌ Failed to load cancelled complaints."));
  };

  const loadAuthorities = () => {
    axios.get("http://localhost:8081/Complaint-chain/api/authority")
      .then(res => setAuthorities(res.data))
      .catch(() => setError("❌ Failed to load authority profiles."));
  };

  const loadCitizens = () => {
    axios.get("http://localhost:8081/Complaint-chain/api/auth/all-citizens")
      .then(res => setCitizens(res.data))
      .catch(() => setError("❌ Failed to load citizens."));
  };

  useEffect(() => {
    if (activeTab === "track") loadComplaints();
    if (activeTab === "cancelled") loadCancelledComplaints();
    if (activeTab === "authority") loadAuthorities();
    if (activeTab === "citizen") loadCitizens();
  }, [activeTab, trackFilter, trackStatus]);

  // ------------------- Authority handlers -------------------
  const handleAuthorityChange = (e) => {
    const { name, value } = e.target;
    setAuthorityPopup({ ...authorityPopup, data: { ...authorityPopup.data, [name]: value } });
  };

  const validateAuthority = () => {
    const { data, editing } = authorityPopup;
    const errors = {};
    
    if (!data.name) errors.name = "Name is required.";
    
    if (!data.email) errors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(data.email)) errors.email = "Invalid email format.";
    else if (!editing && authorities.some(a => a.email === data.email)) errors.email = "Email already exists.";
    
    if (!data.phone) errors.phone = "Phone is required.";
    else if (!/^\d{10}$/.test(data.phone)) errors.phone = "Phone must be 10 digits.";
    else if (!editing && authorities.some(a => a.phone === data.phone)) errors.phone = "Phone already exists.";
    
    if (!data.password && !editing) errors.password = "Password is required.";
    
    if (data.department === "Select Department") errors.department = "Select a valid department.";
    
    setAuthorityPopup(prev => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  };

  const handleAuthoritySave = () => {
    if (!validateAuthority()) return;

    const { data, editing } = authorityPopup;
    const request = editing
      ? axios.put(`http://localhost:8081/Complaint-chain/api/authority/${data.id}`, data)
      : axios.post("http://localhost:8081/Complaint-chain/api/authority", data);

    request.then(() => {
      setMessage(editing ? "✅ Authority updated!" : "✅ Authority added!");
      setTimeout(() => setMessage(""), 2500);
      setAuthorityPopup({
        visible: false,
        editing: false,
        data: { id: null, name: "", email: "", phone: "", password: "", department: "Select Department", level: "Level 1" },
        errors: {}
      });
      loadAuthorities();
    }).catch(() => setError("❌ Failed to save authority."));
  };

  const handleEditAuthority = (authority) => {
    setAuthorityPopup({
      visible: true,
      editing: true,
      data: { ...authority, password: "" },
      errors: {}
    });
  };

  const handleDeleteAuthority = (id) => {
    if (!window.confirm("Are you sure you want to delete this authority?")) return;
    axios.delete(`http://localhost:8081/Complaint-chain/api/authority/${id}`)
      .then(() => {
        setMessage("✅ Authority deleted!");
        setTimeout(() => setMessage(""), 2500);
        loadAuthorities();
      }).catch(() => setError("❌ Failed to delete authority."));
  };

  return (
    <div className="cust-home-page">
      <div className="cust-home-container">
        <h1>Admin Dashboard</h1>
        {error && <div className="cust-error">{error}</div>}
        {message && <div className="popupOverlay themedPopup"><div className="successMessagePopup">{message}</div></div>}

        {/* ------------------- Tabs ------------------- */}
        <div className="cust-btn-group">
          <button className={`cust-btn ${activeTab === "track" ? "cust-btn-active" : ""}`} onClick={() => setActiveTab("track")}>Track Complaints</button>
          <button className={`cust-btn ${activeTab === "cancelled" ? "cust-btn-active" : ""}`} onClick={() => setActiveTab("cancelled")}>Cancelled Complaints</button>
          <button className={`cust-btn ${activeTab === "authority" ? "cust-btn-active" : ""}`} onClick={() => setActiveTab("authority")}>Authority Profiles</button>
          <button className={`cust-btn ${activeTab === "citizen" ? "cust-btn-active" : ""}`} onClick={() => setActiveTab("citizen")}>Citizen Profiles</button>
        </div>

        {/* ------------------- Track Complaints ------------------- */}
        {activeTab === "track" && (
          <div className="cust-tab-box">
            <h3>Track Complaints</h3>
            <div className="filterContainer">
              <label>Status: </label>
              <select value={trackStatus} onChange={e => setTrackStatus(e.target.value)}>
                <option value="pending">Pending</option>
                <option value="inprogress">In Progress</option>
              </select>
              <label>Sort by: </label>
              <select value={trackFilter} onChange={e => setTrackFilter(e.target.value)}>
                <option value="high-low">Priority: High → Low</option>
                <option value="low-high">Priority: Low → High</option>
                <option value="date-asc">Date: Ascending</option>
                <option value="date-desc">Date: Descending</option>
              </select>
            </div>
            <table className="cust-table">
              <thead>
                <tr><th>ID</th><th>Department</th><th>Priority</th><th>Description</th><th>Submission Date</th><th>Status</th></tr>
              </thead>
              <tbody>
                {complaints.map(c => (
                  <tr key={c.id} style={{ backgroundColor: c.status === "In Progress" ? "#fff3cd" : "#1e1e2f" }}>
                    <td>{c.id}</td>
                    <td>{c.department}</td>
                    <td>{c.urgency}</td>
                    <td>{c.description}</td>
                    <td>{new Date(c.submittedAt).toLocaleString()}</td>
                    <td>{c.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ------------------- Cancelled Complaints ------------------- */}
        {activeTab === "cancelled" && (
          <div className="cust-tab-box">
            <h3>Cancelled Complaints</h3>
            <table className="cust-table">
              <thead>
                <tr><th>ID</th><th>Department</th><th>Priority</th><th>Description</th><th>Reason</th><th>Cancelled At</th></tr>
              </thead>
              <tbody>
                {cancelledComplaints.map(c => (
                  <tr key={c.id}><td>{c.originalId}</td><td>{c.department}</td><td>{c.urgency}</td><td>{c.description}</td><td>{c.reason}</td><td>{new Date(c.submittedAt).toLocaleString()}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ------------------- Authority Profiles ------------------- */}
        {activeTab === "authority" && (
          <div className="cust-tab-box">
            <h3>Authority Profile Management</h3>
            <div style={{ textAlign: "center", marginBottom: "15px" }}>
              <button className="cust-btn-submit" onClick={() => setAuthorityPopup({ visible: true, editing: false, data: { id:null, name:"", email:"", phone:"", password:"", department:"Select Department", level:"Level 1" }, errors: {} })}>Add Authority</button>
            </div>
            <table className="cust-table">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Phone</th><th>Department</th><th>Level</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {authorities.map(a => (
                  <tr key={a.id}>
                    <td>{a.name}</td>
                    <td>{a.email}</td>
                    <td>{a.phone}</td>
                    <td>{a.department}</td>
                    <td>{a.level}</td>
                    <td>
                      <button onClick={() => handleEditAuthority(a)}>Edit</button>
                      <button onClick={() => handleDeleteAuthority(a.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ------------------- Authority Popup ------------------- */}
        {authorityPopup.visible && (
          <div className="popupOverlay themedPopup">
            <div className="cancelPopup">
              <h3>{authorityPopup.editing ? "Edit Authority" : "Add Authority"}</h3>
              {["name","email","phone","password"].map(f => (
                <div key={f} className="form-group">
                  <label>{f.charAt(0).toUpperCase()+f.slice(1)}:</label>
                  <input
                    type="text"
                    name={f}
                    value={authorityPopup.data[f]}
                    onChange={handleAuthorityChange}
                    placeholder={f === "password" ? "Enter password" : ""}
                  />
                  {authorityPopup.errors[f] && <div className="fieldError">{authorityPopup.errors[f]}</div>}
                </div>
              ))}
              <div className="form-group">
                <label>Department:</label>
                <select name="department" value={authorityPopup.data.department} onChange={handleAuthorityChange}>
                  <option value="Select Department" disabled>Select Department</option>
                  <option>Health</option>
                  <option>Education</option>
                  <option>Transport</option>
                  <option>Utilities</option>
                </select>
                {authorityPopup.errors.department && <div className="fieldError">{authorityPopup.errors.department}</div>}
              </div>
              <div className="form-group">
                <label>Authority Level:</label>
                <select name="level" value={authorityPopup.data.level} onChange={handleAuthorityChange}>
                  <option>Level 1</option>
                  <option>Level 2</option>
                  <option>Level 3</option>
                </select>
              </div>
              <div className="popupButtons">
                <button onClick={handleAuthoritySave}>{authorityPopup.editing ? "Update" : "Add"}</button>
                <button onClick={() => setAuthorityPopup({ visible:false, editing:false, data:{ id:null, name:"", email:"", phone:"", password:"", department:"Select Department", level:"Level 1" }, errors: {} })}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* ------------------- Citizen Profiles ------------------- */}
        {activeTab === "citizen" && (
          <div className="cust-tab-box">
            <h3>Citizen Profiles</h3>
            <table className="cust-table">
              <thead>
                <tr><th>ID</th><th>Name</th><th>NIC</th><th>Email</th><th>Phone</th></tr>
              </thead>
              <tbody>
                {citizens.map(c => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.firstName} {c.lastName}</td>
                    <td>{c.nic}</td>
                    <td>{c.email}</td>
                    <td>{c.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
