import { createContext, useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          // Verify token and get user account details
          const meData = await apiFetch('/auth/me', {
            headers: { 'Authorization': `Bearer ${storedToken}` }
          });
          
          let profileData = {};
          try {
            // Get profile details (might fail if not completed onboarding)
            const profileResponse = await apiFetch('/profile', {
              headers: { 'Authorization': `Bearer ${storedToken}` }
            });
            profileData = profileResponse.profile || {};
          } catch (profileErr) {
            console.log('Profile not set up yet:', profileErr.message);
          }

          setToken(storedToken);
          setUser({
            ...meData.user,
            ...profileData,
            id: meData.user.id // Critical: Prevent profile.id from overwriting user.id
          });
        } catch (err) {
          console.error('Session expired or invalid token:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem('token', jwtToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, token, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
