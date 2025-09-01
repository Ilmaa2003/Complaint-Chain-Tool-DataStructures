import React from "react";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-page">
      <div className="home-container">
        <h1>Welcome Complaint Chain</h1>
        <p>
          Submit complaints, track their progress, and stay updated with public
          services efficiently. Start by creating an account or logging in.
        </p>
        <div className="btn-group">
          <a href="/register" className="btn">Register</a>
          <a href="/login" className="btn">Login</a>
        </div>
      </div>
    </div>
  );
};

export default Home;
