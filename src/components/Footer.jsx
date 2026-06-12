import React from 'react';
import { useLanguage } from '../App';

const Footer = () => {
  const { t } = useLanguage();

  const handleScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { name: t.nav.home, id: 'home' },
    { name: t.nav.results, id: 'result' },
    { name: t.nav.announcement, id: 'announcement' },
    { name: t.nav.about, id: 'about' },
    { name: t.nav.contact, id: 'contact' },
  ];

  const socialLinks = [
    { 
      name: 'Facebook', 
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>, 
      link: 'https://www.facebook.com/profile.php?id=61571443448291' 
    },
    { 
      name: 'Instagram', 
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>, 
      link: 'https://www.instagram.com/rksir145/' 
    },
    { 
      name: 'Youtube', 
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>, 
      link: 'https://youtube.com/@rkcoachingclasses-u5e?si=BhcQytU5d5c-k1li' 
    },
  ];

  return (
    <footer className="bg-[var(--bg)] border-t border-[var(--border)] pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[var(--accent)] rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-purple-500/20">
                RK
              </div>
              <span className="font-black text-2xl tracking-tighter text-[var(--text-h)]">
                RK Classes
              </span>
            </div>
            <p className="text-[var(--text)] text-sm leading-relaxed mb-6">
              {t.footer.bio}
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl border border-[var(--border)] flex items-center justify-center text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all cursor-pointer"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-black text-[var(--text-h)] mb-6 uppercase tracking-widest text-xs">{t.footer.quickTitle}</h4>
            <ul className="space-y-4">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => handleScroll(link.id)}
                    className="text-[var(--text)] hover:text-[var(--accent)] transition-colors text-sm font-medium"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-black text-[var(--text-h)] mb-6 uppercase tracking-widest text-xs">{t.footer.contactTitle}</h4>
            <ul className="space-y-4 text-sm text-[var(--text)]">
              <li className="flex gap-3">
                <span className="text-[var(--accent)]">📍</span>
                {t.contact.addressVal}
              </li>
              <li className="flex gap-3">
                <span className="text-[var(--accent)]">📞</span>
                +91 {t.contact.phoneVal}
              </li>
              <li className="flex gap-3">
                <span className="text-[var(--accent)]">✉️</span>
                {t.contact.emailVal}
              </li>
            </ul>
          </div>

          {/* Accreditation/Status */}
          <div className="bg-[var(--accent-bg)] p-6 rounded-3xl border border-[var(--border)] flex flex-col justify-center">
            <div className="text-[var(--accent)] font-black text-4xl mb-2">10+</div>
            <p className="font-bold text-[var(--text-h)] text-sm mb-1">{t.footer.expTitle}</p>
            <p className="text-xs text-[var(--text)] opacity-70">{t.footer.expDesc}</p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-[var(--border)] flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-[var(--text)] opacity-60">
            © 2026 RK Coaching Classes. {t.footer.rights}
          </p>
          <div className="flex gap-8">
            <span className="text-xs text-[var(--text)] hover:text-[var(--accent)] cursor-pointer transition-colors">Privacy Policy</span>
            <span className="text-xs text-[var(--text)] hover:text-[var(--accent)] cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
