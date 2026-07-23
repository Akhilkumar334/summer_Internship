import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockAppliedJobs } from '../mockData';

const JobProgressDetail = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedApplications = localStorage.getItem('custom_candidate_applications');
    const appliedJobs = storedApplications ? JSON.parse(storedApplications) : mockAppliedJobs;
    const foundJob = appliedJobs.find(j => j.id === jobId);
    setJob(foundJob);
    setLoading(false);
  }, [jobId]);

  if (loading) {
    return <div className="page-content">Loading...</div>;
  }

  if (!job) {
    return <div className="page-content">Job not found</div>;
  }

  return (
    <div className="page-content">
      <button className="btn-back" onClick={() => navigate(-1)}>
        &larr; Back
      </button>
      
      <div className="detail-header">
        <div className="company-logo-large">{job.logo || 'J'}</div>
        <div className="detail-title-group">
          <h2>{job.title}</h2>
          <p className="company-name-large">{job.company}</p>
          <div className="detail-meta">
            <span>📍 {job.location}</span>
            <span>💰 {job.salary}</span>
          </div>
        </div>
      </div>

      <div className="card timeline-card">
        <h3>Application Status</h3>
        <div className="timeline-container">
          {job.timeline.map((item, index) => (
            <div key={index} className={`timeline-step ${item.completed ? 'completed' : 'pending'}`}>
              <div className="step-circle">
                {item.completed ? '✓' : ''}
              </div>
              <div className="step-info">
                <h4>{item.step}</h4>
                {item.date && <p>{item.date}</p>}
              </div>
              {index < job.timeline.length - 1 && <div className="step-line"></div>}
            </div>
          ))}
        </div>
      </div>
      
      <div className="card description-card">
        <h3>Job Description</h3>
        <p>{job.description}</p>
      </div>
    </div>
  );
};

export default JobProgressDetail;
