import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Megaphone, Send, Pencil, Trash2, X, Plus } from 'lucide-react';

const AdminAnnouncements = () => {
    const { token } = useAuth();
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ titleEn: '', titleHi: '', contentEn: '', contentHi: '' });

    const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/api/Admin`;

    // Fetch all announcements
    const fetchAnnouncements = async () => {
        try {
            const response = await fetch(`${API_BASE}/announcements`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
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

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    // Create or Update
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editingId 
                ? `${API_BASE}/announcement/${editingId}` 
                : `${API_BASE}/announcement`;
            const method = editingId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error(editingId ? 'Failed to update' : 'Failed to create');

            toast.success(editingId ? 'Announcement updated!' : 'Announcement published!');
            resetForm();
            fetchAnnouncements();
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Delete
    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this announcement?')) return;
        try {
            const response = await fetch(`${API_BASE}/announcement/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to delete');
            toast.success('Announcement deleted!');
            fetchAnnouncements();
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Edit — load data into form
    const handleEdit = (ann) => {
        setEditingId(ann.id);
        setFormData({ 
            titleEn: ann.titleEn, 
            titleHi: ann.titleHi, 
            contentEn: ann.contentEn, 
            contentHi: ann.contentHi 
        });
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setFormData({ titleEn: '', titleHi: '', contentEn: '', contentHi: '' });
        setEditingId(null);
        setShowForm(false);
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-600 rounded-2xl text-white">
                        <Megaphone />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white">Manage Announcements</h1>
                        <p className="text-gray-400">Create, edit, and delete bilingual updates.</p>
                    </div>
                </div>
                {!showForm && (
                    <button 
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-bold rounded-2xl hover:bg-purple-700 transition-all shadow-lg shadow-purple-500/20"
                    >
                        <Plus size={20} />
                        New Announcement
                    </button>
                )}
            </div>

            {/* Create / Edit Form */}
            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-8 mb-10">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white">
                            {editingId ? '✏️ Edit Announcement' : '📢 New Announcement'}
                        </h2>
                        <button type="button" onClick={resetForm} className="text-gray-400 hover:text-white transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* English */}
                        <div className="space-y-4">
                            <h3 className="text-blue-400 font-bold uppercase tracking-widest text-xs">English Version</h3>
                            <div>
                                <label className="block text-sm text-gray-500 mb-2 font-medium">Title</label>
                                <input 
                                    type="text" 
                                    value={formData.titleEn} 
                                    onChange={e => setFormData({...formData, titleEn: e.target.value})}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Final Exam Schedule 2025"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-500 mb-2 font-medium">Content</label>
                                <textarea 
                                    value={formData.contentEn} 
                                    onChange={e => setFormData({...formData, contentEn: e.target.value})}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-white h-36 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                    placeholder="Enter English description..."
                                    required
                                />
                            </div>
                        </div>

                        {/* Hindi */}
                        <div className="space-y-4">
                            <h3 className="text-orange-400 font-bold uppercase tracking-widest text-xs">Hindi Version</h3>
                            <div>
                                <label className="block text-sm text-gray-500 mb-2 font-medium">शीर्षक (हिन्दी)</label>
                                <input 
                                    type="text" 
                                    value={formData.titleHi} 
                                    onChange={e => setFormData({...formData, titleHi: e.target.value})}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-white outline-none focus:ring-2 focus:ring-orange-500"
                                    placeholder="वार्षिक परीक्षा समय सारणी 2025"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-500 mb-2 font-medium">विवरण (हिन्दी)</label>
                                <textarea 
                                    value={formData.contentHi} 
                                    onChange={e => setFormData({...formData, contentHi: e.target.value})}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-white h-36 outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                                    placeholder="अपनी जानकारी यहाँ लिखें..."
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button type="submit" className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-black rounded-2xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all">
                            <Send size={20} />
                            {editingId ? 'UPDATE ANNOUNCEMENT' : 'PUBLISH ANNOUNCEMENT'}
                        </button>
                        <button type="button" onClick={resetForm} className="px-8 py-4 bg-white/5 text-gray-400 font-bold rounded-2xl hover:bg-white/10 transition-all">
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {/* Announcements List */}
            <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-400 uppercase tracking-widest mb-4">
                    All Announcements ({announcements.length})
                </h2>

                {loading ? (
                    <div className="text-center py-16 text-gray-500">Loading announcements...</div>
                ) : announcements.length === 0 ? (
                    <div className="text-center py-16 bg-white/5 border border-dashed border-white/10 rounded-3xl">
                        <Megaphone className="mx-auto mb-4 text-gray-600" size={48} />
                        <p className="text-gray-500 text-lg">No announcements yet.</p>
                        <p className="text-gray-600 text-sm mt-1">Click "New Announcement" to post your first update.</p>
                    </div>
                ) : (
                    announcements.map((ann) => (
                        <div key={ann.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/[0.07] transition-all group">
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest shrink-0">
                                            {new Date(ann.datePosted).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-1 truncate">{ann.titleEn}</h3>
                                    <p className="text-sm text-gray-500 mb-1 truncate">{ann.titleHi}</p>
                                    <p className="text-sm text-gray-400 line-clamp-2 mt-2">{ann.contentEn}</p>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2 shrink-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => handleEdit(ann)}
                                        className="p-3 bg-blue-500/20 text-blue-400 rounded-xl hover:bg-blue-500/30 transition-all"
                                        title="Edit"
                                    >
                                        <Pencil size={18} />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(ann.id)}
                                        className="p-3 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-all"
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminAnnouncements;
