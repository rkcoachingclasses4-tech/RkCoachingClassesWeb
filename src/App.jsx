import { createContext, useContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import { translations } from './utils/translations';
import './App.css';

// Create Language Context
const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

// Layout component to include Navbar and Footer on every page
const Layout = () => {
  return (
    <div className="min-h-screen bg-[var(--bg)] selection:bg-[var(--accent)] selection:text-white transition-colors duration-500">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      {/* Global Toaster for notifications */}
      <Toaster position="bottom-right" reverseOrder={false} />
    </div>
  );
};

import { AuthProvider, useAuth } from './context/AuthContext';
import Results from './pages/Results';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardOverview from './components/admin/pages/DashboardOverview';
import AdminAnnouncements from './components/admin/pages/AdminAnnouncements';
import AdminResults from './components/admin/pages/AdminResults';
import AdminClasses from './components/admin/pages/AdminClasses';
import AdminSessions from './components/admin/pages/AdminSessions';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user || (role && user.role !== role)) {
    return <Navigate to="/login" />;
  }
  return children;
};

import AdminLayout from './layouts/AdminLayout';

const StandardLayout = () => (
  <>
    <Navbar />
    <Outlet />
    <Footer />
  </>
);

function App() {
  const [lang, setLang] = useState('en');

  const toggleLanguage = () => {
    setLang(prev => prev === 'en' ? 'hi' : 'en');
  };

  const t = translations[lang];

  return (
    <AuthProvider>
      <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t }}>
        <Toaster position="bottom-right" reverseOrder={false} />
        <Router>
          <Routes>
            {/* Public Layout */}
            <Route path="/" element={<StandardLayout />}>
              <Route index element={<Home />} />
              <Route path="results" element={<Results />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
            </Route>

            {/* Admin Layout */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute role="Admin">
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardOverview />} />
              <Route path="announcements" element={<AdminAnnouncements />} />
              <Route path="results" element={<AdminResults />} />
              <Route path="classes" element={<AdminClasses />} />
              <Route path="sessions" element={<AdminSessions />} />
            </Route>
          </Routes>
        </Router>
      </LanguageContext.Provider>
    </AuthProvider>
  );
}

export default App;
