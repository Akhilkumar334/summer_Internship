import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Counter from './pages/Counter';
import Login from './pages/Login';
import Signup from './pages/Signup';

import EmployerDashboard from './pages/EmployerDashboard';
import CandidateDashboard from './pages/CandidateDashboard';

// Protected Route wrapper
const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRole && user.role !== allowedRole) return <Navigate to="/login" replace />;

  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/counter" element={<Counter />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* Protected Routes */}
      <Route 
        path="/employer-dashboard" 
        element={
          <ProtectedRoute allowedRole="employer">
            <EmployerDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/candidate-dashboard" 
        element={
          <ProtectedRoute allowedRole="candidate">
            <CandidateDashboard />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default App;
