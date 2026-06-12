import React from 'react';
import Results from './Results';
import Announcement from './Announcement';
import About from './About';
import Contact from './Contact';
import { useLanguage } from '../App';

const Home = () => {
  const { t } = useLanguage();

  return (
    <div className="scroll-smooth">
      {/* Home Hero Section */}
      <section id="home" className="py-20 px-6 text-center bg-gradient-to-b from-[var(--accent-bg)] to-[var(--bg)] min-h-[80vh] flex flex-col justify-center items-center scroll-mt-20">

        {/* 8 Years Experience Badge */}
        <div className="mb-6 animate-in fade-in zoom-in duration-700">
          <svg width="120" height="120" viewBox="0 0 120 120" className="mx-auto drop-shadow-xl">
            {/* Outer rotating dashed ring */}
            <circle cx="60" cy="60" r="56" fill="none" stroke="var(--accent)" strokeWidth="2" strokeDasharray="8 4" opacity="0.4">
              <animateTransform attributeName="transform" type="rotate" from="0 60 60" to="360 60 60" dur="30s" repeatCount="indefinite" />
            </circle>
            {/* Solid ring */}
            <circle cx="60" cy="60" r="50" fill="none" stroke="var(--accent)" strokeWidth="3" opacity="0.6" />
            {/* Gradient fill circle */}
            <defs>
              <linearGradient id="badgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
            <circle cx="60" cy="60" r="44" fill="url(#badgeGrad)" />
            {/* Number */}
            <text x="60" y="52" textAnchor="middle" fill="white" fontSize="32" fontWeight="900" fontFamily="Inter, sans-serif">10+</text>
            {/* Label */}
            <text x="60" y="70" textAnchor="middle" fill="white" fontSize="9" fontWeight="700" fontFamily="Inter, sans-serif" letterSpacing="1.5" opacity="0.9">YEARS OF</text>
            <text x="60" y="82" textAnchor="middle" fill="white" fontSize="9" fontWeight="700" fontFamily="Inter, sans-serif" letterSpacing="1.5" opacity="0.9">EXPERIENCE</text>
            {/* Inner decorative ring */}
            <circle cx="60" cy="60" r="44" fill="none" stroke="white" strokeWidth="1" opacity="0.2" strokeDasharray="4 6">
              <animateTransform attributeName="transform" type="rotate" from="360 60 60" to="0 60 60" dur="20s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>

        <h1 className="text-5xl md:text-8xl font-black mb-6 text-[var(--text-h)] tracking-tighter animate-in fade-in slide-in-from-top-12 duration-1000">
          {t.hero.title} <span className="text-[var(--accent)]">{t.hero.titleAccent}</span>
        </h1>
        <p className="text-xl max-w-2xl mx-auto mb-10 text-[var(--text)] leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000">
          {t.hero.subtitle}
        </p>
        <div className="flex gap-4 justify-center animate-in fade-in zoom-in duration-1000">
          <button
            onClick={() => document.getElementById('result').scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-[var(--accent)] text-white rounded-2xl font-black shadow-2xl shadow-purple-500/40 hover:scale-105 active:scale-95 transition-all"
          >
            {t.hero.btnResults}
          </button>
          <button
            onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 border-2 border-[var(--border)] rounded-2xl font-black hover:bg-[var(--accent-bg)] transition-all"
          >
            {t.hero.btnJoin}
          </button>
        </div>
      </section>

      {/* Founder & Advantage Section */}
      <section className="py-20 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-tr from-[var(--accent)] to-transparent opacity-20 blur-2xl rounded-full"></div>
          <div className="relative rounded-[40px] overflow-hidden border-8 border-white shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500 bg-gray-100 group">
            <img
              src="/founder.png"
              alt={t.founder.name}
              className="w-full h-[500px] object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent text-white">
              <h3 className="text-2xl font-black">{t.founder.name}</h3>
              <p className="text-sm opacity-80 uppercase tracking-widest font-bold">{t.founder.badge}</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-4xl md:text-5xl font-black mb-8 tracking-tight text-[var(--text-h)]">
            {t.founder.title} <span className="text-[var(--accent)]">{t.founder.titleAccent}</span>{t.founder.title2} <span className="text-[var(--accent)]">{t.founder.titleAccent2}</span>
          </h2>
          <p className="text-lg text-[var(--text)] mb-8 leading-relaxed">
            {t.founder.desc}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {t.founder.features.map(item => (
              <div key={item.label} className="p-6 bg-[var(--bg)] rounded-3xl border border-[var(--border)] shadow-sm hover:shadow-xl transition-all border-b-4 border-b-[var(--accent)]">
                <div className="text-3xl mb-3">{item.icon}</div>
                <div className="font-black text-[var(--text-h)] mb-1">{item.label}</div>
                <div className="text-xs text-[var(--text)]">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Result Section */}
      <div id="result" className="scroll-mt-20">
        <Results />
      </div>

      {/* Announcement Section */}
      <div id="announcement" className="bg-[var(--code-bg)] border-y border-[var(--border)] scroll-mt-20">
        <Announcement />
      </div>

      {/* About Section */}
      <div id="about" className="scroll-mt-20">
        <About />
      </div>

      {/* Contact Section */}
      <div id="contact" className="bg-[var(--accent-bg)] scroll-mt-20">
        <Contact />
      </div>

      {/* Find Us Section */}
      <section id="location" className="py-20 px-6 border-t border-[var(--border)] bg-[var(--bg)] scroll-mt-20">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-8">{t.location.title}</h2>
          <div className="bg-[var(--bg)] p-8 rounded-3xl shadow-2xl border border-[var(--border)] inline-block text-left max-w-xl w-full">
            <h3 className="text-2xl font-bold mb-2">आरके कोचिंग क्लासेज</h3>
            <p className="text-[var(--text)] mb-6">
              Rajendra Nagar, Kabrai, Mahoba, Uttar Pradesh 210424
            </p>
            <div className="rounded-2xl overflow-hidden h-64 bg-gray-200 mb-6">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3599.234676572565!2d80.016335!3d25.41916!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3982abd211516e8b%3A0xe7b06eb9c0d6b0d4!2z4KS44KSw4KSV4KWHIOCkleCli-CkmuCkvuCkguCklSDgpJXgpY3gpLLgpL7gpL_gpLjgpYc!5e0!3m2!1shi!2sin!4v1718045000000!5m2!1shi!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
            <a href="https://www.google.com/maps/place/आरके+कोचिंग+क्लासेज/..." className="text-[var(--accent)] font-bold hover:underline">
              {t.location.btnMaps} ↗
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
