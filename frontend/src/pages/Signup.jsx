import { useState, useContext } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Signup = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'candidate';

  // Step state
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');

  // Step 1 states (Credentials)
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Step 2 states (Candidate specific)
  const [candidateName, setCandidateName] = useState('');
  const [contact, setContact] = useState('');
  const [highestQualification, setHighestQualification] = useState('');
  const [degree, setDegree] = useState('');
  const [college, setCollege] = useState('');
  const [gradYear, setGradYear] = useState('');
  const [skills, setSkills] = useState('');
  const [interests, setInterests] = useState('');
  const [experience, setExperience] = useState('');
  const [resumeName, setResumeName] = useState('');

  // Step 2 states (Employer specific)
  const [employerName, setEmployerName] = useState('');
  const [designation, setDesignation] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [companyLocation, setCompanyLocation] = useState('');
  const [employerContact, setEmployerContact] = useState('');

  const handleNextStep = (e) => {
    e.preventDefault();
    if (!email || !username || !password) {
      setError('Please fill in all account fields');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleBackStep = () => {
    setError('');
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    let profileData = {};

    if (role === 'candidate') {
      if (!candidateName || !contact || !highestQualification || !degree || !college || !gradYear || !skills || !interests) {
        setError('Please fill in all required profile fields');
        return;
      }
      profileData = {
        name: candidateName,
        contact,
        highestQualification,
        degree,
        college,
        gradYear,
        skills,
        interests,
        experience: experience || 'Fresher',
        resumeName: resumeName || 'resume_mock.pdf'
      };
    } else {
      if (!employerName || !designation || !companyName || !companyDescription || !companyLocation || !employerContact) {
        setError('Please fill in all required company fields');
        return;
      }
      profileData = {
        name: employerName,
        designation,
        companyName,
        companyDescription,
        companyWebsite: companyWebsite || '',
        companyLocation,
        contact: employerContact
      };
    }

    const mockUser = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      username: username.toLowerCase().replace(/\s+/g, ''),
      role,
      ...profileData
    };

    // Save to AuthContext
    login(mockUser, 'mock-jwt-token');

    // For Candidates, automatically add them to mock candidate list in localStorage
    // so they show up under "Applicants" when logged in as Employer
    if (role === 'candidate') {
      const storedCandidates = localStorage.getItem('custom_applicants');
      const candidates = storedCandidates ? JSON.parse(storedCandidates) : [];
      candidates.push({
        id: mockUser.id,
        name: mockUser.name,
        role: mockUser.degree + ' Graduate',
        status: 'Applied',
        avatar: mockUser.name.substring(0, 2).toUpperCase(),
        email: mockUser.email,
        contact: mockUser.contact,
        highestQualification: mockUser.highestQualification,
        college: mockUser.college,
        gradYear: mockUser.gradYear,
        skills: mockUser.skills,
        interests: mockUser.interests,
        experience: mockUser.experience,
        resumeName: mockUser.resumeName
      });
      localStorage.setItem('custom_applicants', JSON.stringify(candidates));
    }

    // Redirect based on role
    if (role === 'employer') {
      navigate('/employer-dashboard');
    } else {
      navigate('/candidate-dashboard');
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setResumeName(e.target.files[0].name);
    }
  };

  const roleDisplay = role === 'employer' ? 'Employer' : 'Candidate';

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: '600px', width: '100%' }}>
        <h2>Create {roleDisplay} Account</h2>
        <p className="auth-subtitle">
          {step === 1 ? 'Step 1: Account Credentials' : 'Step 2: Complete Your Onboarding'}
        </p>

        {error && <div className="auth-error" style={{ color: 'var(--error-color)', backgroundColor: 'var(--error-bg)', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', border: '1px solid #fecaca' }}>{error}</div>}

        {step === 1 ? (
          <form onSubmit={handleNextStep} className="auth-form">
            <div className="form-group">
              <label htmlFor="username">Username (Unique)</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a unique username"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                required
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%' }}>Continue to Onboarding</button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            {role === 'candidate' ? (
              <>
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Contact Details</label>
                  <input
                    type="text"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="Phone number or mobile"
                    required
                  />
                </div>

                <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Highest Qualification</label>
                    <input
                      type="text"
                      value={highestQualification}
                      onChange={(e) => setHighestQualification(e.target.value)}
                      placeholder="e.g. B.Tech, MBA"
                      required
                    />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Degree/Course</label>
                    <input
                      type="text"
                      value={degree}
                      onChange={(e) => setDegree(e.target.value)}
                      placeholder="e.g. Computer Science"
                      required
                    />
                  </div>
                </div>

                <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>College/University</label>
                    <input
                      type="text"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      placeholder="College Name"
                      required
                    />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Graduation Year</label>
                    <input
                      type="number"
                      value={gradYear}
                      onChange={(e) => setGradYear(e.target.value)}
                      placeholder="e.g. 2026"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Skills (comma separated)</label>
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="e.g. React, Node.js, Python"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Areas of Interest</label>
                  <input
                    type="text"
                    value={interests}
                    onChange={(e) => setInterests(e.target.value)}
                    placeholder="e.g. Web Development, UI Design"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Work Experience (Optional for Freshers)</label>
                  <textarea
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="Describe any internship or previous job experience"
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label>Upload Resume (PDF preferred)</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                      id="resume-upload"
                    />
                    <label htmlFor="resume-upload" className="btn-secondary" style={{ cursor: 'pointer', margin: 0 }}>
                      Choose File
                    </label>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                      {resumeName || 'No file chosen'}
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
                    value={employerName}
                    onChange={(e) => setEmployerName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Designation/Role</label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="e.g. HR Manager, Co-founder"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Company Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Your Company Name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Company Description</label>
                  <textarea
                    value={companyDescription}
                    onChange={(e) => setCompanyDescription(e.target.value)}
                    placeholder="Briefly describe what your company does"
                    rows="3"
                    required
                  />
                </div>

                <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Company Location</label>
                    <input
                      type="text"
                      value={companyLocation}
                      onChange={(e) => setCompanyLocation(e.target.value)}
                      placeholder="e.g. Bengaluru, Remote"
                      required
                    />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Contact Details</label>
                    <input
                      type="text"
                      value={employerContact}
                      onChange={(e) => setEmployerContact(e.target.value)}
                      placeholder="Company Phone or Mobile"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Company Website (Optional)</label>
                  <input
                    type="url"
                    value={companyWebsite}
                    onChange={(e) => setCompanyWebsite(e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
              </>
            )}

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button type="button" className="btn-secondary" onClick={handleBackStep} style={{ flex: 1 }}>
                Back
              </button>
              <button type="submit" className="btn-primary" style={{ flex: 2 }}>
                Complete Signup
              </button>
            </div>
          </form>
        )}

        <p className="auth-switch">
          Already have an account? <Link to={`/login?role=${role}`}>Login</Link>
        </p>
        <p className="auth-switch" style={{ marginTop: '0.5rem' }}>
          <Link to="/">← Back to role selection</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
