import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../utils/api';

const ProfilePage = () => {
  const { user, login, logout, token } = useContext(AuthContext);
  const navigate = useNavigate();

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
  const [resumeFile, setResumeFile] = useState(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await apiFetch('/profile');
        const profile = response.profile || {};
        if (user?.role === 'candidate') {
          setCandidateData({
            name: profile.name || user?.name || '',
            contact: profile.contact || user?.contact || '',
            highestQualification: profile.highestQualification || user?.highestQualification || '',
            degree: profile.degree || user?.degree || '',
            college: profile.college || user?.college || '',
            gradYear: profile.gradYear || user?.gradYear || '',
            skills: profile.skills || user?.skills || '',
            interests: profile.interests || user?.interests || '',
            experience: profile.experience || user?.experience || '',
            resumeName: profile.resumeName || user?.resumeName || ''
          });
        } else {
          setEmployerData({
            name: profile.name || user?.name || '',
            designation: profile.designation || user?.designation || '',
            companyName: profile.companyName || user?.companyName || '',
            companyDescription: profile.companyDescription || user?.companyDescription || '',
            companyWebsite: profile.companyWebsite || user?.companyWebsite || '',
            companyLocation: profile.companyLocation || user?.companyLocation || '',
            contact: profile.contact || user?.contact || ''
          });
        }
      } catch (err) {
        console.error('Error fetching profile:', err.message);
      }
    };
    if (user) {
      loadProfile();
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage('');

    try {
      let profileResponse;
      if (user?.role === 'candidate') {
        const formData = new FormData();
        formData.append('name', candidateData.name);
        formData.append('contact', candidateData.contact);
        formData.append('highestQualification', candidateData.highestQualification);
        formData.append('degree', candidateData.degree);
        formData.append('college', candidateData.college);
        formData.append('gradYear', candidateData.gradYear);
        formData.append('skills', candidateData.skills);
        formData.append('interests', candidateData.interests);
        formData.append('experience', candidateData.experience || 'Fresher');
        if (resumeFile) {
          formData.append('resume', resumeFile);
        }

        profileResponse = await apiFetch('/profile', {
          method: 'PUT',
          body: formData
        });
      } else {
        const payload = {
          name: employerData.name,
          designation: employerData.designation,
          companyName: employerData.companyName,
          companyDescription: employerData.companyDescription,
          companyWebsite: employerData.companyWebsite,
          companyLocation: employerData.companyLocation,
          contact: employerData.contact
        };

        profileResponse = await apiFetch('/profile', {
          method: 'PUT',
          body: payload
        });
      }

      const updatedUser = {
        ...user,
        ...(profileResponse.profile || {})
      };

      login(updatedUser, token);
      setIsSaving(false);
      setSaveMessage('Profile updated successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) {
      setIsSaving(false);
      setSaveMessage('Error: ' + err.message);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCandidateData({
        ...candidateData,
        resumeName: file.name
      });
      setResumeFile(file);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }
    try {
      const response = await apiFetch('/auth/change-password', {
        method: 'PUT',
        body: { currentPassword, newPassword }
      });
      setPasswordMessage({ type: 'success', text: response.message });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordMessage({ type: '', text: '' }), 4000);
    } catch (err) {
      setPasswordMessage({ type: 'error', text: err.message });
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to deactivate your account? This action cannot be undone and you will lose access to the platform.')) {
      setIsDeleting(true);
      try {
        await apiFetch('/auth/account', { method: 'DELETE' });
        logout();
        navigate('/login');
      } catch (err) {
        alert('Error deactivating account: ' + err.message);
        setIsDeleting(false);
      }
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
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                  This resume will be used to recommend jobs matching your profile.
                </p>
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

      <div className="card profile-card" style={{ maxWidth: '750px', margin: '2rem auto 0 auto' }}>
        <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
          <h3>Account Security</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Update your password.</p>
        </div>
        <form onSubmit={handleChangePassword}>
          <div className="form-group">
            <label>Current Password</label>
            <input 
              type="password" 
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>New Password</label>
              <input 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Confirm New Password</label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
            <button type="submit" className="btn-secondary">Update Password</button>
            {passwordMessage.text && (
              <span style={{ color: passwordMessage.type === 'error' ? '#ef4444' : '#10b981', fontWeight: '500' }}>
                {passwordMessage.text}
              </span>
            )}
          </div>
        </form>
      </div>

      <div className="card profile-card" style={{ maxWidth: '750px', margin: '2rem auto 2rem auto', border: '1px solid #fee2e2' }}>
        <div style={{ paddingBottom: '1rem', marginBottom: '1rem' }}>
          <h3 style={{ color: '#ef4444' }}>Danger Zone</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Deactivating your account will immediately remove your ability to log in. 
            For candidates, your previous applications will remain visible to employers for historical records. 
            For employers, all of your active job postings will be closed.
          </p>
        </div>
        <button 
          onClick={handleDeleteAccount} 
          disabled={isDeleting}
          style={{
            backgroundColor: '#ef4444',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          {isDeleting ? 'Deactivating...' : 'Deactivate Account'}
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
