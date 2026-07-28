import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { apiFetch } from '../utils/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Default to candidate if no role is found in URL
  const role = searchParams.get('role') || 'candidate';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      // 1. Call real login endpoint
      const response = await apiFetch('/auth/login', {
        method: 'POST',
        body: {
          emailOrUsername: email,
          password: password
        }
      });

      const { token, user: accountUser } = response;

      // Ensure the user is logging in from the correct page for their role
      if (accountUser.role !== role) {
        const intendedType = accountUser.role === 'employer' ? 'Employer' : 'Candidate';
        setError(`This account is registered as an ${intendedType}. Please use the ${intendedType} login.`);
        return;
      }

      let profileUser = {};

      try {
        // 2. Fetch user profile details using the token
        const profileResponse = await apiFetch('/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        profileUser = profileResponse.profile || {};
      } catch (profileErr) {
        console.log('Profile details not set up yet:', profileErr.message);
      }

      // 3. Merge account details and profile details
      const fullUser = {
        ...accountUser,
        ...profileUser,
        id: accountUser.id // Critical: Prevent profile.id from overwriting user.id
      };

      // 4. Save token and user details to context
      login(fullUser, token);

      // 5. Redirect based on the actual database role
      if (fullUser.role === 'employer') {
        navigate('/employer-dashboard');
      } else {
        navigate('/candidate-dashboard');
      }
    } catch (err) {
      setError(err.message || 'Incorrect credentials');
    }
  };

  const roleDisplay = role === 'employer' ? 'Employer' : 'Candidate';

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{roleDisplay} Login</h2>
        <p className="auth-subtitle">Login to your {role} account to continue</p>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email or Username</label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email or username"
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
                placeholder="Enter your password"
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
          </div>
          
          <button type="submit" className="btn-primary">Login</button>
          
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
        
        <p className="auth-switch">
          Don't have an account? <Link to={`/signup?role=${role}`}>Sign up</Link>
        </p>
        <p className="auth-switch" style={{ marginTop: '0.5rem' }}>
          <Link to="/">← Back to role selection</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
