import React from 'react';
import { useLanguage } from '../App';

const About = () => {
  const { t } = useLanguage();

  return (
    <div className="py-20 px-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-700">
      <h1 className="text-4xl font-extrabold mb-8 text-[var(--text-h)]">{t.about.title}</h1>
      <div className="space-y-6 text-lg leading-relaxed text-[var(--text)]">
        <p>{t.about.intro}</p>
        <p>{t.about.mission}</p>
        <div className="bg-[var(--accent-bg)] p-8 rounded-2xl border-l-4 border-[var(--accent)] my-10">
          <h2 className="text-xl font-bold text-[var(--text-h)] mb-2">{t.about.visionTitle}</h2>
          <p className="italic font-medium">{t.about.visionMsg}</p>
          <p className="mt-4 font-bold">— RK Sir</p>
        </div>
        <h2 className="text-2xl font-bold text-[var(--text-h)] mt-12">{t.about.whyTitle}</h2>
        <ul className="grid md:grid-cols-2 gap-4 mt-6">
          {t.about.reasons.map(item => (
            <li key={item} className="flex gap-2 items-center">
              <span className="w-2 h-2 bg-[var(--accent)] rounded-full"></span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default About;
