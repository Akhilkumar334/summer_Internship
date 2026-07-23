import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Default to candidate if no role is found in URL
  const role = searchParams.get('role') || 'candidate';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Mock login logic using the role from the URL parameter
    const mockUser = {
      id: '1',
      email: email, // Treating the input as email for the mock, but we'll show it as username or email in UI
      username: email.split('@')[0], // Generate a mock username based on the input
      name: email.split('@')[0],
      role: role 
    };
    
    login(mockUser, 'mock-jwt-token');
    
    // Redirect based on role
    if (mockUser.role === 'employer') {
      navigate('/employer-dashboard');
    } else {
      navigate('/candidate-dashboard');
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
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button type="submit" className="btn-primary">Login</button>
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
