import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CandidateDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="nav-brand">
          <h1>Job Board</h1>
          <span className="badge candidate-badge">Candidate</span>
        </div>
        <div className="nav-actions">
          <span className="user-email">{user?.email}</span>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </nav>
      
      <div className="content">
        <div className="dashboard-header">
          <h2>Welcome back, {user?.name || 'Candidate'}!</h2>
          <p>Find your next big opportunity.</p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>My Profile</h3>
            <p>Update your resume and skills to stand out.</p>
            <button className="btn-secondary">Edit Profile</button>
          </div>
          <div className="dashboard-card">
            <h3>Job Matches</h3>
            <p>Discover jobs tailored to your skills.</p>
            <button className="btn-secondary">View Matches</button>
          </div>
          <div className="dashboard-card">
            <h3>Applications</h3>
            <p>Track the status of your recent applications.</p>
            <div className="list-placeholder">
              <div className="list-item">Software Engineer at TechCorp <span className="status pending">Pending</span></div>
              <div className="list-item">Frontend Developer at Webify <span className="status accepted">Interview</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;
