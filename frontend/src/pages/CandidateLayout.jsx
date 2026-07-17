import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';
import ProfileDropdown from '../components/ProfileDropdown';

const CandidateLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <div className="candidate-layout">
      {/* Top Navbar */}
      <nav className="navbar">
        <div className="nav-brand">
          <h1>Job Board</h1>
          <span className="badge candidate-badge">Candidate</span>
        </div>
        <div className="nav-actions">
          <ProfileDropdown />
        </div>
      </nav>

      <div className="candidate-container">
        {/* Sidebar Navigation */}
        <aside className="sidebar">
          <nav className="sidebar-nav">
            <Link to="/candidate-dashboard" className={`sidebar-link ${isActive('/candidate-dashboard')}`}>
              Dashboard
            </Link>
            <Link to="/candidate-dashboard/progress" className={`sidebar-link ${isActive('/candidate-dashboard/progress')}`}>
              My Progress
            </Link>
            <Link to="/candidate-dashboard/find-jobs" className={`sidebar-link ${isActive('/candidate-dashboard/find-jobs')}`}>
              Find Jobs
            </Link>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CandidateLayout;
