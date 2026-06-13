import React, { useEffect, useState } from 'react';
import { useLanguage } from '../App';

const Announcement = () => {
    const { t, lang } = useLanguage();
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    
    const itemsPerPage = 3;
    const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/PublicData/announcements`;

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const response = await fetch(API_URL);
                if (response.ok) {
                    const data = await response.json();
                    setAnnouncements(data);
                }
            } catch (error) {
                console.error("Error fetching announcements:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnnouncements();
    }, []);

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentAnnouncements = announcements.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(announcements.length / itemsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
            document.getElementById('announcement')?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
            document.getElementById('announcement')?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    if (loading) {
        return <div className="py-20 text-center text-gray-500">Loading announcements...</div>;
    }

    return (
        <div className="py-20 px-6 max-w-4xl mx-auto">
            <h1 className="text-4xl font-extrabold mb-10 text-[var(--text-h)]">{t.announcement.title}</h1>
            <div className="space-y-8">
                {currentAnnouncements.length > 0 ? (
                    currentAnnouncements.map((ann, i) => (
                        <div key={i} className="p-8 bg-[var(--bg)] border border-[var(--border)] rounded-3xl shadow-sm hover:shadow-xl transition-all border-l-8 border-l-[var(--accent)] animate-in fade-in slide-in-from-left duration-500">
                            <div className="flex justify-between items-start mb-2">
                                <span className="bg-[var(--accent-bg)] text-[var(--accent)] px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest">
                                    {new Date(ann.datePosted).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </span>
                            </div>
                            <h2 className="text-2xl font-black mb-3 text-[var(--text-h)] tracking-tight">
                                {lang === 'en' ? ann.titleEn : ann.titleHi}
                            </h2>
                            <p className="text-[var(--text)] leading-relaxed text-lg italic whitespace-pre-wrap">
                                "{lang === 'en' ? ann.contentEn : ann.contentHi}"
                            </p>
                        </div>
                    ))
                ) : (
                    <div className="p-10 text-center bg-white/5 border border-dashed border-white/10 rounded-3xl">
                        <p className="text-gray-500 italic">No new announcements today. Check back later!</p>
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-12">
                    <button 
                        onClick={handlePrevPage} 
                        disabled={currentPage === 1}
                        className={`px-6 py-3 rounded-2xl font-bold transition-all ${
                            currentPage === 1 
                                ? 'bg-[var(--code-bg)] text-gray-400 cursor-not-allowed border border-[var(--border)]' 
                                : 'bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent)]/20 hover:scale-105 active:scale-95'
                        }`}
                    >
                        &larr; {lang === 'en' ? 'Previous' : 'पिछला'}
                    </button>
                    <span className="text-[var(--text)] font-semibold px-4 py-2 bg-[var(--code-bg)] rounded-xl border border-[var(--border)]">
                        {currentPage} / {totalPages}
                    </span>
                    <button 
                        onClick={handleNextPage} 
                        disabled={currentPage === totalPages}
                        className={`px-6 py-3 rounded-2xl font-bold transition-all ${
                            currentPage === totalPages 
                                ? 'bg-[var(--code-bg)] text-gray-400 cursor-not-allowed border border-[var(--border)]' 
                                : 'bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent)]/20 hover:scale-105 active:scale-95'
                        }`}
                    >
                        {lang === 'en' ? 'Next' : 'अगला'} &rarr;
                    </button>
                </div>
            )}
        </div>
    );
};

export default Announcement;
