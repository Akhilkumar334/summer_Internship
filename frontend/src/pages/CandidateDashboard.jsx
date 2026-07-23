import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { mockAppliedJobs } from '../mockData';

const CandidateDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [appliedJobs, setAppliedJobs] = useState([]);

  useEffect(() => {
    const storedApplications = localStorage.getItem('custom_candidate_applications');
    if (storedApplications) {
      setAppliedJobs(JSON.parse(storedApplications));
    } else {
      localStorage.setItem('custom_candidate_applications', JSON.stringify(mockAppliedJobs));
      setAppliedJobs(mockAppliedJobs);
    }
  }, []);

  return (
    <div className="page-content">
      <div className="page-header">
        <h2>Welcome back, {user?.name || 'Candidate'}!</h2>
        <p>Here are the jobs you've recently applied to.</p>
      </div>

      <div className="job-cards-container">
        {appliedJobs.length === 0 ? (
          <div className="card" style={{ padding: '2rem', textAlign: 'center', width: '100%' }}>
            <p style={{ color: 'var(--text-muted)' }}>You haven't applied to any jobs yet.</p>
            <button className="btn-primary" onClick={() => navigate('/candidate-dashboard/find-jobs')} style={{ marginTop: '1rem' }}>
              Find Jobs
            </button>
          </div>
        ) : (
          appliedJobs.map(job => (
            <div 
              key={job.id} 
              className="modern-job-card"
              onClick={() => navigate(`/candidate-dashboard/progress/${job.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className="job-card-header">
                <div className="company-logo-placeholder">{job.logo || 'J'}</div>
                <div className="job-card-title-group">
                  <h3>{job.title}</h3>
                  <p className="company-name">{job.company}</p>
                </div>
              </div>
              
              <div className="job-card-details">
                <span className={`status-badge status-${job.status.toLowerCase()}`}>
                  {job.status}
                </span>
                <span className="applied-date">Applied: {job.appliedDate}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CandidateDashboard;
