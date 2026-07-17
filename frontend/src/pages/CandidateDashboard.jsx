import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { mockAppliedJobs } from '../mockData';

const CandidateDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="page-content">
      <div className="page-header">
        <h2>Welcome back, {user?.name || 'Candidate'}!</h2>
        <p>Here are the jobs you've recently applied to.</p>
      </div>

      <div className="job-cards-container">
        {mockAppliedJobs.map(job => (
          <div 
            key={job.id} 
            className="modern-job-card"
            onClick={() => navigate(`/candidate-dashboard/progress/${job.id}`)}
          >
            <div className="job-card-header">
              <div className="company-logo-placeholder">{job.logo}</div>
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
        ))}
      </div>
    </div>
  );
};

export default CandidateDashboard;
