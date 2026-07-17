import React, { useState } from 'react';

const mockApplicants = [
  { id: 1, name: 'Akhil', role: 'Frontend Engineer', status: 'Applied', avatar: 'A' },
  { id: 2, name: 'Kritika', role: 'Product Manager', status: 'Interviewing', avatar: 'K' },
  { id: 3, name: 'Rohan', role: 'Frontend Engineer', status: 'Reviewed', avatar: 'R' },
  { id: 4, name: 'Anmol', role: 'Backend Engineer', status: 'Applied', avatar: 'An' },
  { id: 5, name: 'Ram', role: 'UI/UX Designer', status: 'Offered', avatar: 'Ra' },
];

const EmployerApplicants = () => {
  const [applicants, setApplicants] = useState(mockApplicants);

  const updateStatus = (id, newStatus) => {
    setApplicants(applicants.map(app => 
      app.id === id ? { ...app, status: newStatus } : app
    ));
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <h2>Applicants Pipeline</h2>
        <p>Review and move candidates through the hiring process.</p>
      </div>

      <div className="card applicants-pipeline-card">
        <div className="list-placeholder">
          {applicants.map(app => (
            <div key={app.id} className="modern-list-item" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div className="applicant-avatar">{app.avatar}</div>
                <div className="applicant-info">
                  <strong>{app.name}</strong>
                  <br />
                  <span className="job-role-text">{app.role}</span>
                </div>
              </div>
              
              <div className="pipeline-actions" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <span className={`status-badge status-${app.status.toLowerCase().replace(' ', '-')}`}>
                  {app.status}
                </span>
                
                <select 
                  className="mock-select"
                  value={app.status}
                  onChange={(e) => updateStatus(app.id, e.target.value)}
                >
                  <option value="Applied">Applied</option>
                  <option value="Reviewed">Reviewed</option>
                  <option value="Interviewing">Interviewing</option>
                  <option value="Offered">Offered</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployerApplicants;
