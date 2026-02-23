
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AuthCallback from './pages/AuthCallback';
import CompleteSignup from './pages/CompleteSignup';
import FeedSetup from './pages/FeedSetup';
import AutoUpload from './pages/AutoUpload';
import Insights from './pages/Insights';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Sidebar from './components/Sidebar';

// Simple guard to check if user is "logged in"
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = localStorage.getItem('is_logged_in') === 'true';

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = React.useState(true);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} toggle={() => setSidebarOpen(!isSidebarOpen)} />
      <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark">
        <header className="lg:hidden p-4 border-b bg-gradient-to-r from-white to-slate-50 shadow-sm dark:bg-slate-900 sticky top-0 z-30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">pets</span>
            <span className="font-bold">Paws & Pose</span>
          </div>
          <button onClick={() => setSidebarOpen(true)} className="p-2">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </header>
        {children}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/auth-callback" element={<AuthCallback />} />
        <Route path="/complete-signup" element={<CompleteSignup />} />

        {/* Protected Routes */}
        <Route path="/home" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
        <Route path="/style-learning" element={<ProtectedRoute><Layout><FeedSetup /></Layout></ProtectedRoute>} />
        <Route path="/upload" element={<ProtectedRoute><Layout><AutoUpload /></Layout></ProtectedRoute>} />
        <Route path="/insights" element={<ProtectedRoute><Layout><Insights /></Layout></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>} />
        {/* Placeholder for About / Brand Story */}
        <Route path="/about" element={<ProtectedRoute><Layout><div className="p-10"><h2>About Our Story & Values</h2></div></Layout></ProtectedRoute>} />

        {/* Default Redirects */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/dashboard" element={<Navigate to="/home" replace />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
