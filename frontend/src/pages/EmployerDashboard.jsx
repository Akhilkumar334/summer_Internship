import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const EmployerDashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="page-content">
      <div className="page-header">
        <h2>Welcome back, {user?.name || 'Employer'}!</h2>
        <p>Here is an overview of your hiring pipeline.</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card" style={{ textAlign: 'center', padding: '2rem' }}>
          <h3 style={{ fontSize: '2.5rem', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>3</h3>
          <p>Active Postings</p>
        </div>
        <div className="dashboard-card" style={{ textAlign: 'center', padding: '2rem' }}>
          <h3 style={{ fontSize: '2.5rem', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>17</h3>
          <p>Total Applicants</p>
        </div>
        <div className="dashboard-card" style={{ textAlign: 'center', padding: '2rem' }}>
          <h3 style={{ fontSize: '2.5rem', color: '#10b981', marginBottom: '0.5rem' }}>4</h3>
          <p>Interviews Scheduled</p>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
