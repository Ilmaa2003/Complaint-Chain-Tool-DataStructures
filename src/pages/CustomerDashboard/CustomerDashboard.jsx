import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CustomerDashboard.css";

const CustomerDashboard = () => {
  const [activeTab, setActiveTab] = useState("submit");
  const [userData, setUserData] = useState({ firstName: "", lastName: "", email: "", nic: "", phone: "" });
  const [complaintData, setComplaintData] = useState({
    name: "",
    nationalId: "",
    contact: "",
    email: "",
    address: "",
    description: "",
    department: "Select Department",
    urgency: "High",
    submittedAt: new Date().toISOString().slice(0,16),
    status: "Pending"
  });

  const [complaints, setComplaints] = useState([]);
  const [cancelledComplaints, setCancelledComplaints] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [cancelPopup, setCancelPopup] = useState({ visible: false, complaint: null, reason: "" });
  const [logoutPopup, setLogoutPopup] = useState(false);
  const [trackFilter, setTrackFilter] = useState("high-low");
  const [trackStatus, setTrackStatus] = useState("pending"); // New: pending / inprogress

  // Fetch user data
  useEffect(() => {
    const email = localStorage.getItem("citizenEmail");
    if (!email) return setError("No email found in localStorage. Please log in.");

    axios.get(`http://localhost:8081/Complaint-chain/api/auth/citizen?email=${email}`)
      .then(res => {
        const data = res.data;
        setUserData(data);
        setComplaintData(prev => ({
          ...prev,
          name: `${data.firstName} ${data.lastName}`,
          nationalId: data.nic,
          contact: data.phone,
          email: data.email,
        }));
      })
      .catch(() => setError("❌ Failed to fetch citizen details."));
  }, []);

  // Load complaints & cancelled complaints on tab change or filter/status change
  useEffect(() => {
    if (activeTab === "track") loadComplaints(trackFilter, trackStatus);
    if (activeTab === "cancelled") loadCancelledComplaints();
  }, [activeTab, trackFilter, trackStatus]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setComplaintData({ ...complaintData, [name]: value });
    setFieldErrors({ ...fieldErrors, [name]: "" });
  };

  const handleLogout = () => {
    localStorage.removeItem("citizenEmail");
    window.location.href = "/";
  };

const handleSubmitComplaint = async (e) => {
  e.preventDefault();
  setMessage("");
  setError("");
  setFieldErrors({});

  let errors = {};
  if (!complaintData.address) errors.address = "Address is required";
  if (!complaintData.description) errors.description = "Description is required";
  if (complaintData.department === "Select Department") errors.department = "Select a department";
  if (new Date(complaintData.submittedAt) > new Date()) errors.submittedAt = "Submission date cannot be in the future";

  if (Object.keys(errors).length > 0) {
    setFieldErrors(errors);
    return;
  }

  const payload = {
    ...complaintData,
    submittedAt: new Date(complaintData.submittedAt).toISOString().slice(0, 19),
    status: "Pending"
  };

  try {
    // Submit complaint
    const res = await axios.post(
      "http://localhost:8081/Complaint-chain/api/complaints/submit",
      payload
    );

    setComplaints(prev => [...prev, res.data]);

    // Attempt auto-assign
    try {
      await axios.post(
        "http://localhost:8081/Complaint-chain/api/complaints/tasks/auto-assign"
      );
      setMessage(" Complaint submitted and assigned to an officer successfully!");
    } catch {
      // If auto-assign fails (e.g., no available authority)
      setMessage(" Complaint submitted. Your submission will be reviewed soon.");
    }

    // Reset form fields
    setComplaintData({
      address: "",
      description: "",
      department: "Select Department",
      urgency: "High",
      submittedAt: new Date().toISOString().slice(0, 16),
      status: "Pending"
    });

    setTimeout(() => setMessage(""), 2500);

  } catch (err) {
    console.error(err.response?.data || err.message);
    setError("❌ Failed to submit complaint. See console for details.");
    setTimeout(() => setError(""), 2500);
  }
};

  const loadComplaints = (filter = trackFilter, status = trackStatus) => {
let url = `http://localhost:8081/Complaint-chain/api/complaints/${status}?sort=${filter}`;

    axios.get(url)
      .then(res => setComplaints(res.data))
      .catch(() => setError("❌ Failed to load complaints."));
  };

  const loadCancelledComplaints = () => {
    axios.get("http://localhost:8081/Complaint-chain/api/complaints/cancelled")
      .then(res => setCancelledComplaints(res.data))
      .catch(() => setError("❌ Failed to load cancelled complaints."));
  };

  const handleRowClick = (complaint) => setCancelPopup({ visible: true, complaint, reason: "" });

  const handleCancelConfirm = () => {
    const { complaint, reason } = cancelPopup;
    if (!reason.trim()) { setError("❌ Please provide a reason for cancellation."); setTimeout(() => setError(""), 2500); return; }

    axios.post(`http://localhost:8081/Complaint-chain/api/complaints/cancel/${complaint.id}?reason=${encodeURIComponent(reason)}`)
      .then(() => {
        setComplaints(complaints.filter(c => c.id !== complaint.id));
        setCancelPopup({ visible: false, complaint: null, reason: "" });
        setMessage("✅ Complaint canceled successfully!");
        loadCancelledComplaints();
        setTimeout(() => setMessage(""), 2500);
      })
      .catch(() => { setError("❌ Failed to cancel complaint."); setTimeout(() => setError(""), 2500); });
  };

  return (
    <div className="cust-home-page">
      <div className="cust-home-container">
        <h1>Citizen Dashboard</h1>
        {error && <div className="cust-error">{error}</div>}
        {message && <div className="popupOverlay"><div className="successMessagePopup">{message}</div></div>}

        {/* Cancel Popup */}
        {cancelPopup.visible && (
          <div className="popupOverlay">
            <div className="cancelPopup">
              <h3>Cancel Complaint</h3>
              <p>Are you sure you want to cancel this complaint?</p>
              <p><strong>{cancelPopup.complaint.description}</strong></p>
              <textarea placeholder="Enter reason for cancellation" value={cancelPopup.reason} onChange={(e) => setCancelPopup({ ...cancelPopup, reason: e.target.value })} rows={3} />
              <div className="popupButtons">
                <button onClick={handleCancelConfirm}>Yes, Cancel</button>
                <button onClick={() => setCancelPopup({ visible:false, complaint:null, reason:"" })}>No</button>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="cust-btn-group">
          <button className={`cust-btn ${activeTab==="submit"?"cust-btn-active":""}`} onClick={()=>setActiveTab("submit")}>Submit Complaint</button>
          <button className={`cust-btn ${activeTab==="track"?"cust-btn-active":""}`} onClick={()=>setActiveTab("track")}>Track Complaint</button>
          <button className={`cust-btn ${activeTab==="cancelled"?"cust-btn-active":""}`} onClick={()=>setActiveTab("cancelled")}>Cancelled Complaints</button>
          <button className={`cust-btn ${activeTab==="profile"?"cust-btn-active":""}`} onClick={()=>setActiveTab("profile")}>User Profile</button>
        </div>

        {/* Submit Tab */}
        {activeTab==="submit" && (
          <div className="cust-tab-box">
            <h3>Submit Complaint</h3>
            <form onSubmit={handleSubmitComplaint} className="cust-form-grid">
              {[{label:"Name",name:"name",readOnly:true},{label:"NIC",name:"nationalId",readOnly:true},{label:"Phone",name:"contact",readOnly:true},{label:"Email",name:"email",readOnly:true}].map(f=>(
                <div className="form-group" key={f.name}><label>{f.label}:</label><input type="text" name={f.name} value={complaintData[f.name]} readOnly={f.readOnly}/></div>
              ))}
              <div className="form-group"><label>Address:</label><input type="text" name="address" value={complaintData.address} onChange={handleChange}/>{fieldErrors.address && <span className="errorMessage">{fieldErrors.address}</span>}</div>
              <div className="form-group full-width"><label>Description:</label><textarea name="description" value={complaintData.description} onChange={handleChange} rows={5}/>{fieldErrors.description && <span className="errorMessage">{fieldErrors.description}</span>}</div>
              <div className="form-group"><label>Department:</label><select name="department" value={complaintData.department} onChange={handleChange}><option disabled>Select Department</option><option>Health</option><option>Education</option><option>Transport</option><option>Utilities</option></select>{fieldErrors.department && <span className="errorMessage">{fieldErrors.department}</span>}</div>
              <div className="form-group"><label>Priority:</label><select name="urgency" value={complaintData.urgency} onChange={handleChange}><option>High</option><option>Low</option></select></div>
              <div className="form-group"><label>Submission Date & Time:</label><input type="datetime-local" name="submittedAt" value={complaintData.submittedAt} onChange={handleChange} max={new Date().toISOString().slice(0,16)}/>{fieldErrors.submittedAt && <span className="errorMessage">{fieldErrors.submittedAt}</span>}</div>
              <div className="form-group full-width" style={{textAlign:"center"}}><button type="submit" className="cust-btn-submit">Submit</button></div>
            </form>
          </div>
        )}

        {/* Track Tab */}
        {activeTab==="track" && (
          <div className="cust-tab-box">
            <h3>Track Complaint</h3>
            <div className="filterContainer">
              <label>Status: </label>
              <select value={trackStatus} onChange={(e)=>setTrackStatus(e.target.value)}>
                <option value="pending">Pending</option>
                <option value="inprogress">In Progress</option>
              </select>
              <label>Sort by: </label>
              <select value={trackFilter} onChange={(e)=>setTrackFilter(e.target.value)}>
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
                {complaints.map(c=>(
                  <tr key={c.id} onClick={()=>handleRowClick(c)} >
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

        {/* Cancelled Tab */}
        {activeTab==="cancelled" && (
          <div className="cust-tab-box">
            <h3>Cancelled Complaints</h3>
            <table className="cust-table">
              <thead><tr><th>ID</th><th>Department</th><th>Priority</th><th>Description</th><th>Reason</th><th>Cancelled At</th></tr></thead>
              <tbody>{cancelledComplaints.map(c=>(
                <tr key={c.id}><td>{c.originalId}</td><td>{c.department}</td><td>{c.urgency}</td><td>{c.description}</td><td>{c.reason}</td><td>{new Date(c.submittedAt).toLocaleString()}</td></tr>
              ))}</tbody>
            </table>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab==="profile" && (
          <div className="cust-tab-box">
            <h3>User Profile</h3>
            <table className="cust-table">
              <tbody>
                <tr><td>Full Name:</td><td>{userData.firstName} {userData.lastName}</td></tr>
                <tr><td>NIC:</td><td>{userData.nic}</td></tr>
                <tr><td>Email:</td><td>{userData.email}</td></tr>
                <tr><td>Phone:</td><td>{userData.phone}</td></tr>
              </tbody>
            </table>
            <div style={{marginTop:"20px", textAlign:"center"}}>
              <button onClick={()=>setLogoutPopup(true)} className="cust-btn-submit">Logout</button>
            </div>
            {logoutPopup && (
              <div className="popupOverlay">
                <div className="cancelPopup">
                  <h3>Confirm Logout</h3>
                  <p>Are you sure you want to logout?</p>
                  <div className="popupButtons">
                    <button onClick={handleLogout}>Yes, Logout</button>
                    <button onClick={()=>setLogoutPopup(false)}>Cancel</button>
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

export default CustomerDashboard;
