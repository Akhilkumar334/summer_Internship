import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiFetch } from '../utils/api';

const JobProgressDetail = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicationDetail = async () => {
      try {
        const appsData = await apiFetch('/applications/my-applications');
        const matchedApp = (appsData.applications || []).find(app => app.jobId.toString() === jobId);
        
        if (matchedApp) {
          const jobData = matchedApp.job || {};
          const companyName = jobData.employer?.employerProfile?.companyName || jobData.employer?.username || 'Job Board Inc';
          
          const timeline = [
            { step: 'Applied', date: new Date(matchedApp.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), completed: true },
            { step: 'Reviewed', date: matchedApp.status !== 'Pending' ? new Date(matchedApp.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : null, completed: matchedApp.status !== 'Pending' },
            { step: 'Interviewed', date: (matchedApp.status === 'Accepted') ? new Date(matchedApp.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : null, completed: matchedApp.status === 'Accepted' },
            { step: 'Offered', date: matchedApp.status === 'Accepted' ? new Date(matchedApp.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : null, completed: matchedApp.status === 'Accepted' }
          ];

          if (matchedApp.status === 'Rejected') {
            timeline[3] = { step: 'Rejected', date: new Date(matchedApp.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), completed: true };
          }

          setJob({
            id: jobData.id.toString(),
            title: jobData.title,
            company: companyName,
            logo: companyName.charAt(0).toUpperCase(),
            location: jobData.location,
            salary: typeof jobData.salary === 'number' ? `₹${jobData.salary.toLocaleString('en-IN')}` : jobData.salary || 'Not Disclosed',
            timeline,
            description: jobData.description
          });
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching application details:', err.message);
        setLoading(false);
      }
    };

    fetchApplicationDetail();
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
