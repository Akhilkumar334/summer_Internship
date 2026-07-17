import React from 'react';
import { useNavigate } from 'react-router-dom';

const RoleSelection = () => {
  const navigate = useNavigate();

  const handleSelectRole = (role) => {
    navigate(`/login?role=${role}`);
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: '500px', textAlign: 'center' }}>
        <h2>Welcome to Job Board</h2>
        <p className="auth-subtitle">Before we continue, please select your account type.</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
          <button 
            className="btn-primary" 
            style={{ padding: '1rem', fontSize: '1.1rem' }}
            onClick={() => handleSelectRole('candidate')}
          >
            I am a Candidate
          </button>
          <button 
            className="btn-secondary" 
            style={{ padding: '1rem', fontSize: '1.1rem', backgroundColor: 'var(--bg-color)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}
            onClick={() => handleSelectRole('employer')}
          >
            I am an Employer
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
