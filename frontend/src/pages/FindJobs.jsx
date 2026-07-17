import React from 'react';
import { mockJobListings } from '../mockData';

const FindJobs = () => {
  return (
    <div className="page-content">
      <div className="page-header">
        <h2>Find Jobs</h2>
        <p>Based on your profile, here are some opportunities you might like.</p>
      </div>

      <div className="job-listings-list">
        {mockJobListings.map(job => (
          <div key={job.id} className="card job-listing-card">
            <div className="listing-top">
              <div className="company-logo-placeholder">{job.logo}</div>
              <div className="listing-info">
                <h3>{job.title}</h3>
                <p>{job.company} &bull; {job.location}</p>
              </div>
              <div className="match-score">
                <div className="score-circle">
                  <span>{job.matchPercentage}%</span>
                </div>
                <span className="score-label">Match</span>
              </div>
            </div>
            
            <div className="listing-middle">
              <span className="listing-salary">{job.salary}</span>
              <div className="listing-tags">
                {job.tags.map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </div>
            
            <div className="listing-bottom">
              <span className="posted-time">Posted {job.posted}</span>
              <button className="btn-primary-small">Easy Apply</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FindJobs;
