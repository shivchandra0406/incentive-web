import { Routes, Route, Navigate } from 'react-router-dom';
import IncentiveRulesList from './pages/incentiveRules/IncentiveRulesList';
import IncentiveRuleForm from './pages/incentiveRules/IncentiveRuleForm';
import TargetBasedRuleForm from './pages/incentiveRules/TargetBasedRuleForm';
import Dashboard from './pages/dashboard/Dashboard';
import LoginPage from './pages/auth/Login';
import TestPage from './pages/TestPage';
import { useAuth } from './contexts/AuthContext';

const AppRouter = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />} />

      {/* Protected routes */}
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
      <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
      <Route path="/test" element={isAuthenticated ? <TestPage /> : <Navigate to="/login" />} />

      {/* Incentive Rules routes */}
      <Route path="/incentive-rules" element={isAuthenticated ? <IncentiveRulesList /> : <Navigate to="/login" />} />

      {/* Special route for Target-Based Rule - must come before the generic route */}
      <Route path="/incentive-rules/create/target" element={isAuthenticated ? <TargetBasedRuleForm /> : <Navigate to="/login" />} />

      {/* Generic routes for other rule types */}
      <Route path="/incentive-rules/create/:type" element={isAuthenticated ? <IncentiveRuleForm /> : <Navigate to="/login" />} />
      <Route path="/incentive-rules/edit/:id" element={isAuthenticated ? <IncentiveRuleForm /> : <Navigate to="/login" />} />
      <Route path="/incentive-rules/:id" element={isAuthenticated ? <IncentiveRuleForm /> : <Navigate to="/login" />} />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRouter;
