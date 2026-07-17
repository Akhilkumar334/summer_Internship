import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const EmployerDashboard = () => {
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
          <span className="badge employer-badge">Employer</span>
        </div>
        <div className="nav-actions">
          <span className="user-email">{user?.email}</span>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </nav>
      
      <div className="content">
        <div className="dashboard-header">
          <h2>Welcome back, {user?.name || 'Employer'}!</h2>
          <p>Manage your job postings and find top talent.</p>
          <button className="btn-primary" style={{ width: 'auto', marginTop: '1rem' }}>+ Post a New Job</button>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card wide">
            <h3>Active Job Postings</h3>
            <p>Your currently open positions.</p>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Applicants</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Senior Frontend Engineer</td>
                  <td>12</td>
                  <td><span className="status active">Active</span></td>
                  <td><button className="btn-text">View</button></td>
                </tr>
                <tr>
                  <td>Product Manager</td>
                  <td>5</td>
                  <td><span className="status active">Active</span></td>
                  <td><button className="btn-text">View</button></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="dashboard-card">
            <h3>Recent Applications</h3>
            <div className="list-placeholder">
              <div className="list-item">qnmol applied for <br/><strong>Frontend Engineer</strong></div>
              <div className="list-item">Smith applied for <br/><strong>Product Manager</strong></div>
            </div>
            <button className="btn-secondary" style={{ marginTop: '1rem', width: '100%' }}>View All</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
