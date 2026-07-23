import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

const ProfilePage = () => {
  const { user, login, token } = useContext(AuthContext);

  // Local state initialized with user context data (with defaults if empty)
  const [candidateData, setCandidateData] = useState({
    name: user?.name || '',
    contact: user?.contact || '',
    highestQualification: user?.highestQualification || '',
    degree: user?.degree || '',
    college: user?.college || '',
    gradYear: user?.gradYear || '',
    skills: user?.skills || '',
    interests: user?.interests || '',
    experience: user?.experience || '',
    resumeName: user?.resumeName || 'resume_mock.pdf'
  });

  const [employerData, setEmployerData] = useState({
    name: user?.name || '',
    designation: user?.designation || '',
    companyName: user?.companyName || '',
    companyDescription: user?.companyDescription || '',
    companyWebsite: user?.companyWebsite || '',
    companyLocation: user?.companyLocation || '',
    contact: user?.contact || ''
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage('');

    let updatedUser = { ...user };

    if (user?.role === 'candidate') {
      updatedUser = {
        ...updatedUser,
        name: candidateData.name,
        contact: candidateData.contact,
        highestQualification: candidateData.highestQualification,
        degree: candidateData.degree,
        college: candidateData.college,
        gradYear: candidateData.gradYear,
        skills: candidateData.skills,
        interests: candidateData.interests,
        experience: candidateData.experience,
        resumeName: candidateData.resumeName
      };
    } else {
      updatedUser = {
        ...updatedUser,
        name: employerData.name,
        designation: employerData.designation,
        companyName: employerData.companyName,
        companyDescription: employerData.companyDescription,
        companyWebsite: employerData.companyWebsite,
        companyLocation: employerData.companyLocation,
        contact: employerData.contact
      };
    }

    // Simulate API call and save back to context
    setTimeout(() => {
      login(updatedUser, token);
      setIsSaving(false);
      setSaveMessage('Profile updated successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    }, 600);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setCandidateData({
        ...candidateData,
        resumeName: e.target.files[0].name
      });
    }
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <h2>Your Profile</h2>
        <p>Keep your account and professional details up to date.</p>
      </div>

      <div className="card profile-card" style={{ maxWidth: '750px', margin: '0 auto' }}>
        <div className="profile-header-large">
          <div className="profile-avatar-large">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="profile-info-large">
            <h3>{user?.name || 'User'}</h3>
            {user?.username && <p style={{ color: 'var(--primary-color)', fontWeight: '600', marginBottom: '0.25rem' }}>@{user.username}</p>}
            <p>{user?.email}</p>
            <span className={`badge ${user?.role === 'employer' ? 'employer-badge' : 'candidate-badge'}`}>
              {user?.role}
            </span>
          </div>
        </div>

        <form onSubmit={handleSave} className="profile-details-form" style={{ marginTop: '2rem' }}>
          {user?.role === 'candidate' ? (
            <>
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  value={candidateData.name}
                  onChange={(e) => setCandidateData({...candidateData, name: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Contact Details</label>
                <input 
                  type="text" 
                  value={candidateData.contact}
                  onChange={(e) => setCandidateData({...candidateData, contact: e.target.value})}
                  required
                />
              </div>

              <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Highest Qualification</label>
                  <input 
                    type="text" 
                    value={candidateData.highestQualification}
                    onChange={(e) => setCandidateData({...candidateData, highestQualification: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Degree/Course</label>
                  <input 
                    type="text" 
                    value={candidateData.degree}
                    onChange={(e) => setCandidateData({...candidateData, degree: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>College/University</label>
                  <input 
                    type="text" 
                    value={candidateData.college}
                    onChange={(e) => setCandidateData({...candidateData, college: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Graduation Year</label>
                  <input 
                    type="number" 
                    value={candidateData.gradYear}
                    onChange={(e) => setCandidateData({...candidateData, gradYear: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Skills (comma separated)</label>
                <input 
                  type="text" 
                  value={candidateData.skills}
                  onChange={(e) => setCandidateData({...candidateData, skills: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Areas of Interest</label>
                <input 
                  type="text" 
                  value={candidateData.interests}
                  onChange={(e) => setCandidateData({...candidateData, interests: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Work Experience</label>
                <textarea 
                  value={candidateData.experience}
                  onChange={(e) => setCandidateData({...candidateData, experience: e.target.value})}
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Resume (PDF preferred)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <input 
                    type="file" 
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    id="profile-resume-upload"
                  />
                  <label htmlFor="profile-resume-upload" className="btn-secondary" style={{ cursor: 'pointer', margin: 0 }}>
                    Upload New Resume
                  </label>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    {candidateData.resumeName}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  value={employerData.name}
                  onChange={(e) => setEmployerData({...employerData, name: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Designation/Role</label>
                <input 
                  type="text" 
                  value={employerData.designation}
                  onChange={(e) => setEmployerData({...employerData, designation: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Company Name</label>
                <input 
                  type="text" 
                  value={employerData.companyName}
                  onChange={(e) => setEmployerData({...employerData, companyName: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Company Description</label>
                <textarea 
                  value={employerData.companyDescription}
                  onChange={(e) => setEmployerData({...employerData, companyDescription: e.target.value})}
                  rows="4"
                  required
                />
              </div>

              <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Company Location</label>
                  <input 
                    type="text" 
                    value={employerData.companyLocation}
                    onChange={(e) => setEmployerData({...employerData, companyLocation: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Contact Details</label>
                  <input 
                    type="text" 
                    value={employerData.contact}
                    onChange={(e) => setEmployerData({...employerData, contact: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Company Website</label>
                <input 
                  type="url" 
                  value={employerData.companyWebsite}
                  onChange={(e) => setEmployerData({...employerData, companyWebsite: e.target.value})}
                />
              </div>
            </>
          )}

          <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button type="submit" className="btn-primary" disabled={isSaving}>
              {isSaving ? 'Saving Changes...' : 'Save Changes'}
            </button>
            {saveMessage && <span style={{ color: '#10b981', fontWeight: '500' }}>{saveMessage}</span>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
