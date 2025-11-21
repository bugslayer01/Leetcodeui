import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProblemListPage from './pages/ProblemListPage';
import ProblemPage from './pages/ProblemPage';
import AdminPage from './pages/AdminPage';
import LandingPage from './pages/LandingPage';
import Navbar from './components/Navbar';
import authService from './services/authService';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const user = authService.getCurrentUser();
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && !user.isAdmin) return <Navigate to="/" />;
  return children;
};

function App() {
  const location = useLocation();
  const isAuthPage = ['/login', '/signup'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 font-sans selection:bg-indigo-500/30">
      {!isAuthPage && <Navbar />}
      <div className={!isAuthPage && location.pathname !== '/' ? 'pt-16' : ''}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/problems" element={<ProblemListPage />} />
          <Route
            path="/problems/:id"
            element={
              <ProtectedRoute>
                <ProblemPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
