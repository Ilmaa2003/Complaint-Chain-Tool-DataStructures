import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import CustomerDashboard from "./pages/CustomerDashboard/CustomerDashboard";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard"; // <- new

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<CustomerDashboard />} /> {/* Customer */}
        <Route path="/admin" element={<AdminDashboard />} /> {/* Admin */}
      </Routes>
    </Router>
  );
}

export default App;
