import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import RoleSelection from './pages/RoleSelection';

import EmployerLayout from './pages/EmployerLayout';
import EmployerDashboard from './pages/EmployerDashboard';
import EmployerMyJobs from './pages/EmployerMyJobs';
import EmployerApplicants from './pages/EmployerApplicants';
import CandidateLayout from './pages/CandidateLayout';
import CandidateDashboard from './pages/CandidateDashboard';
import MyProgress from './pages/MyProgress';
import JobProgressDetail from './pages/JobProgressDetail';
import FindJobs from './pages/FindJobs';
import ProfilePage from './pages/ProfilePage';

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
      <Route path="/" element={<RoleSelection />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* Employer Routes using Layout */}
      <Route 
        path="/employer-dashboard" 
        element={
          <ProtectedRoute allowedRole="employer">
            <EmployerLayout />
          </ProtectedRoute>
        } 
      >
        <Route index element={<EmployerDashboard />} />
        <Route path="my-jobs" element={<EmployerMyJobs />} />
        <Route path="applicants" element={<EmployerApplicants />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
      
      {/* Candidate Routes using Layout */}
      <Route 
        path="/candidate-dashboard" 
        element={
          <ProtectedRoute allowedRole="candidate">
            <CandidateLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<CandidateDashboard />} />
        <Route path="progress" element={<MyProgress />} />
        <Route path="progress/:jobId" element={<JobProgressDetail />} />
        <Route path="find-jobs" element={<FindJobs />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
}

export default App;
