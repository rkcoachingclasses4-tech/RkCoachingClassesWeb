import React, { useState, useEffect } from 'react';
import { useLanguage } from '../App';

const API_BASE = 'https://localhost:7233/api/PublicData';

// Color themes for different class cards
const classColors = [
    { from: 'from-blue-500', to: 'to-blue-700', text: 'text-blue-700', ring: 'ring-blue-300' },
    { from: 'from-purple-500', to: 'to-purple-700', text: 'text-purple-700', ring: 'ring-purple-300' },
    { from: 'from-emerald-500', to: 'to-emerald-700', text: 'text-emerald-700', ring: 'ring-emerald-300' },
    { from: 'from-amber-500', to: 'to-amber-700', text: 'text-amber-700', ring: 'ring-amber-300' },
    { from: 'from-rose-500', to: 'to-rose-700', text: 'text-rose-700', ring: 'ring-rose-300' },
    { from: 'from-cyan-500', to: 'to-cyan-700', text: 'text-cyan-700', ring: 'ring-cyan-300' },
];

const Results = () => {
    const { t, lang } = useLanguage();
    const [classes, setClasses] = useState([]);
    const [classResults, setClassResults] = useState({}); // { classLevel: students[] }
    const [classLoading, setClassLoading] = useState({}); // { classLevel: bool }
    const [selectedSubjects, setSelectedSubjects] = useState({}); // { classLevel: subjectName }
    const [loadingClasses, setLoadingClasses] = useState(true);
    const [activeSession, setActiveSession] = useState(null);
    const [loadingSession, setLoadingSession] = useState(true);

    // Fetch active session
    useEffect(() => {
        const fetchActiveSession = async () => {
            try {
                const response = await fetch(`${API_BASE}/active-session`);
                if (response.ok) {
                    const data = await response.json();
                    setActiveSession(data);
                }
            } catch (error) {
                console.error("Error fetching active session:", error);
            } finally {
                setLoadingSession(false);
            }
        };
        fetchActiveSession();
    }, []);

    // Fetch classes from database
    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await fetch(`${API_BASE}/classes`);
                if (response.ok) {
                    const data = await response.json();
                    setClasses(data);

                    // Set default selected subject for each class
                    const defaults = {};
                    data.forEach(cls => {
                        if (cls.subjects.length > 0) {
                            defaults[cls.level] = cls.subjects[0].nameEn;
                        }
                    });
                    setSelectedSubjects(defaults);
                }
            } catch (error) {
                console.error("Error fetching classes:", error);
            } finally {
                setLoadingClasses(false);
            }
        };
        fetchClasses();
    }, []);

    // Fetch results when subject selection changes (only if active session exists)
    useEffect(() => {
        if (!activeSession) return;
        Object.entries(selectedSubjects).forEach(([level, subject]) => {
            if (subject) {
                fetchResults(parseInt(level), subject);
            }
        });
    }, [selectedSubjects, activeSession]);

    const fetchResults = async (classLevel, subject) => {
        setClassLoading(prev => ({ ...prev, [classLevel]: true }));
        try {
            const response = await fetch(`${API_BASE}/results?classLevel=${classLevel}&subject=${subject}`);
            if (response.ok) {
                const data = await response.json();
                // Sort by marks highest first
                const sortedData = data.sort((a, b) => b.marks - a.marks);
                setClassResults(prev => ({ ...prev, [classLevel]: sortedData }));
            }
        } catch (error) {
            console.error("Error fetching results:", error);
        } finally {
            setClassLoading(prev => ({ ...prev, [classLevel]: false }));
        }
    };

    const handleSubjectChange = (level, subject) => {
        setSelectedSubjects(prev => ({ ...prev, [level]: subject }));
    };

    const renderResults = (students, selectedSub, loading) => {
        if (loading) return <div className="text-center py-10 text-[var(--accent)] font-bold">Loading results...</div>;
        if (!students || students.length === 0) return <div className="text-center py-10 text-gray-500">No results found for {selectedSub}.</div>;

        return (
            <div className="mt-6">
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[var(--accent-bg)] text-[var(--accent)]">
                                <th className="p-4 border-b border-[var(--border)] rounded-tl-xl">{t.results.rollNo}</th>
                                <th className="p-4 border-b border-[var(--border)]">{t.results.name}</th>
                                <th className="p-4 border-b border-[var(--border)]">{selectedSub} %</th>
                                <th className="p-4 border-b border-[var(--border)] rounded-tr-xl">{t.results.overall} %</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((s, i) => (
                                <tr key={i} className="hover:bg-[var(--code-bg)] transition-colors">
                                    <td className="p-4 border-b border-[var(--border)] font-mono text-sm">{s.rollNo}</td>
                                    <td className="p-4 border-b border-[var(--border)] font-bold">{s.studentName}</td>
                                    <td className="p-4 border-b border-[var(--border)] text-[var(--accent)] font-black">{s.marks}%</td>
                                    <td className="p-4 border-b border-[var(--border)]">{s.overallPercentage}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="md:hidden space-y-4">
                    {students.map((s, i) => (
                        <div key={i} className="bg-[var(--bg)] p-6 rounded-2xl border border-[var(--border)] shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="text-xs font-bold text-[var(--text)] opacity-60 uppercase mb-1">{t.results.rollNo}: {s.rollNo}</div>
                                    <div className="text-lg font-black text-[var(--text-h)]">{s.studentName}</div>
                                </div>
                                <div className="bg-[var(--accent-bg)] text-[var(--accent)] px-3 py-1 rounded-lg text-sm font-black">
                                    {s.overallPercentage}% {t.results.overall}
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-[var(--code-bg)] rounded-xl border border-[var(--border)]">
                                <span className="text-sm font-medium">{selectedSub}</span>
                                <span className="text-xl font-black text-[var(--accent)]">{s.marks}%</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    if (loadingClasses || loadingSession) {
        return (
            <section className="py-20 px-4 md:px-6 bg-[var(--bg)] min-h-screen text-center">
                <div className="text-[var(--accent)] font-bold text-lg">Loading...</div>
            </section>
        );
    }

    // No active session — show a friendly message
    if (!activeSession) {
        return (
            <section className="py-20 px-4 md:px-6 bg-[var(--bg)] min-h-screen">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="text-center mb-12 md:mb-16 animate-in fade-in zoom-in duration-700">
                        <h1 className="text-4xl md:text-5xl font-black mb-4 text-[var(--text-h)] tracking-tighter leading-tight">{t.results.title}</h1>
                        <p className="text-lg md:text-xl text-[var(--text)]">{t.results.subtitle}</p>
                    </div>
                    <div className="py-16 bg-[var(--code-bg)] border border-dashed border-[var(--border)] rounded-3xl">
                        <div className="text-5xl mb-4">📅</div>
                        <p className="text-gray-500 text-xl font-bold">
                            {lang === 'en' ? 'No active session at the moment.' : 'अभी कोई सक्रिय सत्र नहीं है।'}
                        </p>
                        <p className="text-gray-400 text-sm mt-2">
                            {lang === 'en' ? 'Results will be displayed once an academic session is activated.' : 'शैक्षणिक सत्र सक्रिय होने पर परिणाम प्रदर्शित होंगे।'}
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-20 px-4 md:px-6 bg-[var(--bg)] min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12 md:mb-16 animate-in fade-in zoom-in duration-700">
                    <h1 className="text-4xl md:text-5xl font-black mb-4 text-[var(--text-h)] tracking-tighter leading-tight">{t.results.title}</h1>
                    <p className="text-lg md:text-xl text-[var(--text)]">{t.results.subtitle}</p>
                    {/* Active session badge */}
                    <div className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-[var(--accent-bg)] border border-[var(--accent)]/30 rounded-full shadow-lg">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                        </span>
                        <span className="text-sm font-bold text-[var(--text)]">
                            {lang === 'en' ? 'Session' : 'सत्र'}:
                        </span>
                        <span className="text-lg font-black text-[var(--accent)]">{activeSession.name}</span>
                    </div>
                </div>

                <div className="space-y-16 md:space-y-24">
                    {classes.map((cls, index) => {
                        const color = classColors[index % classColors.length];
                        const subjects = cls.subjects || [];
                        const selected = selectedSubjects[cls.level] || '';
                        const students = classResults[cls.level] || [];
                        const loading = classLoading[cls.level] || false;

                        return (
                            <div key={cls.id} className="bg-[var(--bg)] p-1 rounded-3xl border border-[var(--border)] shadow-2xl overflow-hidden">
                                <div className={`p-6 md:p-8 bg-gradient-to-br ${color.from} ${color.to} text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6`}>
                                    <div>
                                        <h2 className="text-2xl md:text-3xl font-black italic">
                                            {lang === 'en' ? cls.nameEn : cls.nameHi}
                                        </h2>
                                    </div>
                                    {subjects.length > 0 && (
                                        <div className="w-full md:w-auto flex flex-col md:flex-row items-start md:items-center gap-3 bg-white/10 p-3 rounded-2xl backdrop-blur-md">
                                            <span className="font-bold text-xs uppercase tracking-widest opacity-80">{t.results.selectSub}</span>
                                            <select 
                                                value={selected}
                                                onChange={(e) => handleSubjectChange(cls.level, e.target.value)}
                                                className={`w-full md:w-auto bg-white ${color.text} px-4 py-2 rounded-xl font-black focus:outline-none focus:ring-4 ${color.ring} transition-all cursor-pointer appearance-none text-center`}
                                            >
                                                {subjects.map(sub => (
                                                    <option key={sub.id} value={sub.nameEn}>
                                                        {lang === 'en' ? sub.nameEn : sub.nameHi}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4 md:p-8">
                                    {subjects.length > 0 
                                        ? renderResults(students, selected, loading)
                                        : <div className="text-center py-10 text-gray-500">No subjects configured for this class.</div>
                                    }
                                </div>
                            </div>
                        );
                    })}

                    {classes.length === 0 && (
                        <div className="text-center py-20 text-gray-500">
                            <p className="text-xl">No classes have been configured yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Results;
