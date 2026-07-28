import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { apiFetch } from '../utils/api';

const EmployerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    activePostings: 0,
    totalApplicants: 0,
    interviewsScheduled: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await apiFetch('/applications/stats');
        setStats(data);
      } catch (err) {
        console.error('Error fetching stats:', err.message);
      }
    };
    
    if (user) {
      fetchStats();
    }
  }, [user]);

  return (
    <div className="page-content">
      <div className="page-header">
        <h2>Welcome back, {user?.name || 'Employer'}!</h2>
        <p>Here is an overview of your hiring pipeline.</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card" style={{ textAlign: 'center', padding: '2rem' }}>
          <h3 style={{ fontSize: '2.5rem', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>{stats.activePostings}</h3>
          <p>Active Postings</p>
        </div>
        <div className="dashboard-card" style={{ textAlign: 'center', padding: '2rem' }}>
          <h3 style={{ fontSize: '2.5rem', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>{stats.totalApplicants}</h3>
          <p>Total Applicants</p>
        </div>
        <div className="dashboard-card" style={{ textAlign: 'center', padding: '2rem' }}>
          <h3 style={{ fontSize: '2.5rem', color: '#10b981', marginBottom: '0.5rem' }}>{stats.interviewsScheduled}</h3>
          <p>Interviews Scheduled</p>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
