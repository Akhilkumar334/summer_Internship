import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

const ProfilePage = () => {
  const { user } = useContext(AuthContext);

  // Local state for editable fields
  const [candidateData, setCandidateData] = useState({
    skills: 'React, JavaScript, CSS',
  });

  const [employerData, setEmployerData] = useState({
    companyName: 'Tech Solutions Inc.',
    industry: 'Software Development',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage('');
    
    // Simulate API call to save profile
    setTimeout(() => {
      setIsSaving(false);
      setSaveMessage('Profile saved successfully!');
      
      // Clear message after 3 seconds
      setTimeout(() => setSaveMessage(''), 3000);
    }, 800);
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <h2>Your Profile</h2>
        <p>Manage your account settings and basic info.</p>
      </div>

      <div className="card profile-card" style={{ maxWidth: '600px' }}>
        <div className="profile-header-large">
          <div className="profile-avatar-large">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="profile-info-large">
            <h3>{user?.name || 'User'}</h3>
            <p>{user?.email}</p>
            <span className={`badge ${user?.role === 'employer' ? 'employer-badge' : 'candidate-badge'}`}>
              {user?.role}
            </span>
          </div>
        </div>

        <form onSubmit={handleSave} className="profile-details-form">
          {user?.role === 'candidate' ? (
            <>
              <div className="form-group">
                <label>Skills</label>
                <input 
                  type="text" 
                  value={candidateData.skills}
                  onChange={(e) => setCandidateData({...candidateData, skills: e.target.value})}
                  placeholder="e.g. React, Node.js"
                />
              </div>
              <div className="form-group">
                <label>Resume</label>
                <div>
                  <button type="button" className="btn-secondary">Upload New Resume</button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label>Company Name</label>
                <input 
                  type="text" 
                  value={employerData.companyName}
                  onChange={(e) => setEmployerData({...employerData, companyName: e.target.value})}
                  placeholder="Your Company Name"
                />
              </div>
              <div className="form-group">
                <label>Industry</label>
                <input 
                  type="text" 
                  value={employerData.industry}
                  onChange={(e) => setEmployerData({...employerData, industry: e.target.value})}
                  placeholder="e.g. Software Development"
                />
              </div>
            </>
          )}

          <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button type="submit" className="btn-primary" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
            {saveMessage && <span style={{ color: '#10b981', fontWeight: '500' }}>{saveMessage}</span>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
