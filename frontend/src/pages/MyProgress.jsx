import React, { useState, useEffect } from 'react';
import { mockAppliedJobs } from '../mockData';
import { useNavigate } from 'react-router-dom';

const MyProgress = () => {
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
        <h2>My Progress</h2>
        <p>A high-level view of all your active applications.</p>
      </div>

      <div className="progress-list">
        {appliedJobs.length === 0 ? (
          <div className="card" style={{ padding: '2rem', textAlign: 'center', width: '100%' }}>
            <p style={{ color: 'var(--text-muted)' }}>You don't have any applications yet.</p>
          </div>
        ) : (
          appliedJobs.map(job => (
            <div key={job.id} className="card progress-card" onClick={() => navigate(`/candidate-dashboard/progress/${job.id}`)} style={{ cursor: 'pointer' }}>
              <div className="progress-card-header">
                <h3>{job.title}</h3>
                <p>{job.company}</p>
              </div>
              
              <div className="mini-timeline">
                {job.timeline.map((item, index) => (
                  <div key={index} className={`mini-step ${item.completed ? 'completed' : 'pending'}`} title={item.step}>
                    <div className="mini-circle"></div>
                    {index < job.timeline.length - 1 && <div className="mini-line"></div>}
                  </div>
                ))}
              </div>
              <div className="progress-status-text">
                Current Status: <strong>{job.status}</strong>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyProgress;
