import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../App';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const Navbar = () => {
  const { lang, toggleLanguage, t } = useLanguage();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isScrollingManually = useRef(false);

  const navLinks = [
    { name: t.nav.home, id: 'home' },
    { name: t.nav.results, id: 'result' },
    { name: t.nav.announcement, id: 'announcement' },
    { name: t.nav.about, id: 'about' },
    { name: t.nav.contact, id: 'contact' },
  ];

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '-100px 0px -60% 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1.0]
    };

    const observer = new IntersectionObserver((entries) => {
      if (isScrollingManually.current) return;

      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
          setActiveSection(entry.target.id);
        }
      });
    }, options);

    navLinks.forEach((link) => {
      const element = document.getElementById(link.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [lang]);

  const scrollToSection = (id) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return;
    }

    isScrollingManually.current = true;
    setActiveSection(id);
    setIsMenuOpen(false);

    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });

      setTimeout(() => {
        isScrollingManually.current = false;
      }, 1000);
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-[var(--bg)] border-b border-[var(--border)] px-6 py-4 backdrop-blur-md bg-opacity-90">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection('home')}>
            <div className="w-10 h-10 bg-[var(--accent)] rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-purple-500/20">
              RK
            </div>
            <span className="font-heading font-bold text-xl tracking-tight text-[var(--text-h)]">
              Coaching Classes
            </span>
          </div>
          
          {/* Desktop Links */}
          <div className="hidden md:flex gap-8 items-center">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={`text-sm font-medium transition-all duration-300 relative py-2 px-1 ${
                  activeSection === link.id ? 'text-[var(--accent)]' : 'text-[var(--text)] hover:text-[var(--accent)]'
                }`}
              >
                {link.name}
                <span className={`absolute bottom-0 left-0 h-0.5 bg-[var(--accent)] transition-all duration-300 ${
                  activeSection === link.id ? 'w-full' : 'w-0'
                }`}></span>
              </button>
            ))}
            
            {/* Language Toggle */}
            <button 
              onClick={toggleLanguage}
              className="ml-4 px-3 py-1.5 border border-[var(--border)] rounded-lg text-xs font-bold hover:bg-[var(--accent-bg)] transition-all"
            >
              {lang === 'en' ? 'हिन्दी' : 'English'}
            </button>

            {/* Auth Buttons */}
            {user ? (
              <div className="flex gap-2">
                {user.role === 'Admin' && (
                  <button 
                    onClick={() => navigate('/admin/dashboard')}
                    className="px-5 py-2 bg-purple-600 text-white text-xs font-black rounded-xl hover:bg-purple-700 transition-all shadow-lg shadow-purple-500/20"
                  >
                    DASHBOARD
                  </button>
                )}
                <button 
                  onClick={logout}
                  className="px-5 py-2 bg-red-500/20 text-red-500 border border-red-500/50 text-xs font-black rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-lg"
                >
                  LOGOUT
                </button>
              </div>
            ) : (
              <button 
                onClick={() => navigate('/login')}
                className="px-5 py-2 bg-[var(--accent)] text-white text-xs font-black rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-purple-500/20"
              >
                {t.nav.admin}
              </button>
            )}
          </div>

          {/* Mobile UI */}
          <div className="flex items-center gap-2 md:hidden">
            <button 
              onClick={toggleLanguage}
              className="px-2 py-1.5 border border-[var(--border)] rounded-lg text-[10px] font-bold"
            >
              {lang === 'en' ? 'हि' : 'EN'}
            </button>
            {user ? (
              <div className="flex gap-1">
                {user.role === 'Admin' && (
                  <button 
                    onClick={() => navigate('/admin/dashboard')}
                    className="px-3 py-2 bg-purple-600 text-white text-[10px] font-black rounded-lg active:scale-95 shadow-lg shadow-purple-500/10"
                  >
                    DASH
                  </button>
                )}
                <button 
                  onClick={logout}
                  className="px-3 py-2 bg-red-500 text-white text-[10px] font-black rounded-lg active:scale-95 shadow-lg shadow-purple-500/10"
                >
                  LOGOUT
                </button>
              </div>
            ) : (
              <button 
                onClick={() => navigate('/login')}
                className="px-3 py-2 bg-[var(--accent)] text-white text-[10px] font-black rounded-lg active:scale-95 shadow-lg shadow-purple-500/10"
              >
                {lang === 'en' ? 'LOGIN' : 'लॉगिन'}
              </button>
            )}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-[var(--text-h)] hover:bg-[var(--accent-bg)] rounded-xl"
            >
              {isMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-40 md:hidden transition-all duration-500 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>
        <div className={`absolute right-0 top-0 h-full w-64 bg-[var(--bg)] shadow-2xl transition-transform duration-500 ease-out border-l border-[var(--border)] flex flex-col pt-24 px-6 gap-6 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className={`text-left text-lg font-bold py-2 border-b border-[var(--border)] transition-colors ${
                activeSection === link.id ? 'text-[var(--accent)] border-[var(--accent)]' : 'text-[var(--text-h)]'
              }`}
            >
              {link.name}
            </button>
          ))}
          {user ? (
            <div className="flex flex-col gap-3 mt-4">
              {user.role === 'Admin' && (
                <button 
                  onClick={() => { navigate('/admin/dashboard'); setIsMenuOpen(false); }}
                  className="px-6 py-4 bg-purple-600 text-white font-black rounded-2xl active:scale-95 shadow-xl shadow-purple-500/20 text-center"
                >
                  DASHBOARD
                </button>
              )}
              <button 
                onClick={() => { logout(); setIsMenuOpen(false); }}
                className="px-6 py-4 bg-red-500 text-white font-black rounded-2xl active:scale-95 shadow-xl shadow-red-500/20 text-center"
              >
                LOGOUT
              </button>
            </div>
          ) : (
            <button 
              onClick={() => { navigate('/login'); setIsMenuOpen(false); }}
              className="mt-4 px-6 py-4 bg-[var(--accent)] text-white font-black rounded-2xl active:scale-95 shadow-xl shadow-purple-500/20 text-center"
            >
              {t.nav.admin}
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
