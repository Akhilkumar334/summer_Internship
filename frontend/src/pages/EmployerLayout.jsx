import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';
import ProfileDropdown from '../components/ProfileDropdown';

const EmployerLayout = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <div className="employer-layout">
      {/* Top Navbar */}
      <nav className="navbar">
        <div className="nav-brand">
          <h1>Job Board</h1>
          <span className="badge employer-badge">Employer</span>
        </div>
        <div className="nav-actions">
          <ProfileDropdown />
        </div>
      </nav>

      <div className="candidate-container"> {/* Reusing layout container class for consistency */}
        {/* Sidebar Navigation */}
        <aside className="sidebar">
          <nav className="sidebar-nav">
            <Link to="/employer-dashboard" className={`sidebar-link ${isActive('/employer-dashboard')}`}>
              Overview
            </Link>
            <Link to="/employer-dashboard/my-jobs" className={`sidebar-link ${isActive('/employer-dashboard/my-jobs')}`}>
              My Jobs
            </Link>
            <Link to="/employer-dashboard/applicants" className={`sidebar-link ${isActive('/employer-dashboard/applicants')}`}>
              Applicants
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

export default EmployerLayout;
