import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProfileDropdown = () => {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleDropdown = () => setIsOpen(!isOpen);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    setIsOpen(false);
    // Navigate based on role
    if (user?.role === 'employer') {
      navigate('/employer-dashboard/profile');
    } else {
      navigate('/candidate-dashboard/profile');
    }
  };

  const handleLogoutClick = () => {
    setIsOpen(false);
    logout();
    navigate('/login');
  };

  const initials = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="profile-dropdown-container" ref={dropdownRef}>
      <button className="profile-btn" onClick={toggleDropdown}>
        <div className="profile-avatar-small">{initials}</div>
        <span className="profile-name">{user?.name || user?.email}</span>
        <span className="dropdown-arrow">▼</span>
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          <div className="dropdown-header">
            <strong>{user?.name || 'User'}</strong>
            <p>{user?.email}</p>
          </div>
          <div className="dropdown-divider"></div>
          <button className="dropdown-item" onClick={handleProfileClick}>
            👤 View Profile
          </button>
          <button className="dropdown-item logout-item" onClick={handleLogoutClick}>
            🚪 Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
