import { useState, useContext } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Signup = () => {
  const [name, setName] = useState('');
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
    
    // Mock signup logic
    const mockUser = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: name || email.split('@')[0],
      role: role
    };
    
    login(mockUser, 'mock-jwt-token');
    
    // Redirect based on role
    if (role === 'employer') {
      navigate('/employer-dashboard');
    } else {
      navigate('/candidate-dashboard');
    }
  };

  const roleDisplay = role === 'employer' ? 'Employer' : 'Candidate';

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create {roleDisplay} Account</h2>
        <p className="auth-subtitle">Join us as a {role}</p>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
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
          
          <button type="submit" className="btn-primary">Sign Up</button>
        </form>
        
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
