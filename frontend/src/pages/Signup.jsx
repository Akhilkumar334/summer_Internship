import { useState, useContext } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { apiFetch } from '../utils/api';

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
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const evaluatePasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, text: '' };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[a-z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    
    if (score < 2) return { score: 1, text: 'weak' };
    if (score < 4) return { score: 2, text: 'medium' };
    return { score: 3, text: 'strong' };
  };
  const strength = evaluatePasswordStrength(password);

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
  const [resumeFile, setResumeFile] = useState(null);

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
    if (!email || !username || !password || !confirmPassword) {
      setError('Please fill in all account fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (strength.score < 3) {
      setError('Please choose a stronger password (at least 8 chars, including uppercase, lowercase, and numbers)');
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

    try {
      // 1. Call signup endpoint
      const authResponse = await apiFetch('/auth/signup', {
        method: 'POST',
        body: {
          username: username.toLowerCase().replace(/\s+/g, ''),
          email,
          password,
          role
        }
      });

      const { token, user: accountUser } = authResponse;
      
      // Store token immediately in localStorage so profile API uses it
      localStorage.setItem('token', token);

      let profileResponse;

      // 2. Call profile update endpoint depending on role
      if (role === 'candidate') {
        if (!candidateName || !contact || !highestQualification || !degree || !college || !gradYear || !skills || !interests) {
          setError('Please fill in all required profile fields');
          return;
        }

        // Form data for file upload support
        const formData = new FormData();
        formData.append('name', candidateName);
        formData.append('contact', contact);
        formData.append('highestQualification', highestQualification);
        formData.append('degree', degree);
        formData.append('college', college);
        formData.append('gradYear', gradYear);
        formData.append('skills', skills);
        formData.append('interests', interests);
        formData.append('experience', experience || 'Fresher');
        if (resumeFile) {
          formData.append('resume', resumeFile);
        }

        profileResponse = await apiFetch('/profile', {
          method: 'PUT',
          body: formData
        });
      } else {
        if (!employerName || !designation || !companyName || !companyDescription || !companyLocation || !employerContact) {
          setError('Please fill in all required company fields');
          return;
        }

        const profileData = {
          name: employerName,
          designation,
          companyName,
          companyDescription,
          companyWebsite: companyWebsite || '',
          companyLocation,
          contact: employerContact
        };

        profileResponse = await apiFetch('/profile', {
          method: 'PUT',
          body: profileData
        });
      }

      const fullUser = {
        ...accountUser,
        ...(profileResponse.profile || {})
      };

      // 3. Set verified context
      login(fullUser, token);

      // 4. Redirect based on role
      if (role === 'employer') {
        navigate('/employer-dashboard');
      } else {
        navigate('/candidate-dashboard');
      }
    } catch (err) {
      setError(err.message || 'Error occurred during registration');
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setResumeName(file.name);
      setResumeFile(file);
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
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  required
                />
                <button 
                  type="button" 
                  className="password-toggle-btn" 
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {password && (
                <div style={{ marginTop: '0.5rem' }}>
                  <div className="strength-bar-container">
                    <div className={`strength-bar strength-${strength.text}`}></div>
                  </div>
                  <span className={`strength-text text-${strength.text}`}>
                    Password strength: {strength.text.charAt(0).toUpperCase() + strength.text.slice(1)}
                  </span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="password-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                />
                <button 
                  type="button" 
                  className="password-toggle-btn" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  title={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%' }}>Continue to Onboarding</button>
            
            <div className="auth-divider">OR</div>
            
            <div className="social-auth-container">
              <button type="button" className="btn-social btn-google">
                <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
                </svg>
                Sign in with Google
              </button>
              <button type="button" className="btn-social btn-facebook" style={{ backgroundColor: '#1877F2', color: 'white', borderColor: '#1877F2' }}>
                <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Sign in with Facebook
              </button>
            </div>
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
