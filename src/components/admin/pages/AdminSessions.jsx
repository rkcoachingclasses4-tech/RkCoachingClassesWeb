import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Calendar, Plus, Trash2, Pencil, X, Save, ToggleLeft, ToggleRight } from 'lucide-react';

const AdminSessions = () => {
    const { token } = useAuth();
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ name: '', isActive: true });

    const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/api/Admin`;

    const fetchSessions = async () => {
        try {
            const response = await fetch(`${API_BASE}/sessions`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setSessions(data);
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchSessions(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editingId ? `${API_BASE}/session/${editingId}` : `${API_BASE}/session`;
            const method = editingId ? 'PUT' : 'POST';
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(formData),
            });
            if (!response.ok) throw new Error('Failed');
            toast.success(editingId ? 'Session updated!' : 'Session created!');
            resetForm();
            fetchSessions();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this session?')) return;
        try {
            const response = await fetch(`${API_BASE}/session/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed');
            toast.success('Session deleted!');
            fetchSessions();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const toggleActive = async (session) => {
        // If deactivating, warn that results won't show
        if (session.isActive) {
            if (!confirm('Deactivating this session will hide all results on the website. Are you sure?')) return;
        } else {
            // Activating this session — warn it will deactivate all others
            const otherActive = sessions.find(s => s.isActive && s.id !== session.id);
            if (otherActive) {
                if (!confirm(`Activating "${session.name}" will deactivate the current active session "${otherActive.name}". Only one session can be active. Continue?`)) return;
            }
        }
        try {
            const response = await fetch(`${API_BASE}/session/${session.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ ...session, isActive: !session.isActive }),
            });
            if (!response.ok) throw new Error('Failed');
            toast.success(session.isActive ? 'Session deactivated — results hidden on website' : `Session "${session.name}" activated — now showing on website`);
            fetchSessions();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleEdit = (s) => {
        setEditingId(s.id);
        setFormData({ name: s.name, isActive: s.isActive });
        setShowForm(true);
    };

    const resetForm = () => {
        setFormData({ name: '', isActive: true });
        setEditingId(null);
        setShowForm(false);
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-500 rounded-2xl text-white shadow-lg shadow-indigo-500/20">
                        <Calendar />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white">Academic Sessions</h1>
                        <p className="text-gray-400">Manage academic year sessions (e.g., 2024-25).</p>
                        <p className="text-xs text-amber-400 mt-1 font-semibold">⚠ Only one session can be active — its results are displayed on the website.</p>
                    </div>
                </div>
                {!showForm && (
                    <button 
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-indigo-500 text-white font-bold rounded-2xl hover:bg-indigo-600 transition-all shadow-lg"
                    >
                        <Plus size={20} />
                        Add Session
                    </button>
                )}
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-10 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white">
                            {editingId ? '✏️ Edit Session' : '📅 New Session'}
                        </h2>
                        <button type="button" onClick={resetForm} className="text-gray-400 hover:text-white">
                            <X size={24} />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Session Name</label>
                            <input 
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                className="w-full bg-black/30 border border-white/10 rounded-xl px-5 py-3 text-white outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="e.g. 2024-25"
                                required
                            />
                        </div>
                        <div className="flex items-end">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={formData.isActive}
                                    onChange={e => setFormData({...formData, isActive: e.target.checked})}
                                    className="sr-only"
                                />
                                <div className={`w-12 h-6 rounded-full transition-colors ${formData.isActive ? 'bg-emerald-500' : 'bg-gray-600'} relative`}>
                                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${formData.isActive ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
                                </div>
                                <span className="text-sm text-gray-400 font-medium">
                                    {formData.isActive ? 'Active (visible on website)' : 'Inactive (hidden)'}
                                </span>
                            </label>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button type="submit" className="flex items-center gap-2 px-8 py-4 bg-indigo-500 text-white font-black rounded-2xl shadow-xl hover:bg-indigo-600 transition-all">
                            <Save size={20} />
                            {editingId ? 'UPDATE' : 'CREATE SESSION'}
                        </button>
                        <button type="button" onClick={resetForm} className="px-8 py-4 bg-white/5 text-gray-400 font-bold rounded-2xl hover:bg-white/10 transition-all">
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {loading ? (
                <div className="text-center py-16 text-gray-500">Loading sessions...</div>
            ) : sessions.length === 0 ? (
                <div className="text-center py-16 bg-white/5 border border-dashed border-white/10 rounded-3xl">
                    <Calendar className="mx-auto mb-4 text-gray-600" size={48} />
                    <p className="text-gray-500 text-lg">No sessions created yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sessions.map(s => (
                        <div key={s.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/[0.07] transition-all group flex flex-col sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                    <h3 className="text-2xl font-black text-white">{s.name}</h3>
                                    <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold ${
                                        s.isActive 
                                            ? 'bg-emerald-500/20 text-emerald-400' 
                                            : 'bg-gray-500/20 text-gray-500'
                                    }`}>
                                        {s.isActive ? '● Active' : '○ Inactive'}
                                    </span>
                                </div>
                                <div className="flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity mt-4 sm:mt-0">
                                    <button 
                                        onClick={() => toggleActive(s)}
                                        className={`p-2 rounded-lg transition-all ${s.isActive ? 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30' : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'}`}
                                        title={s.isActive ? 'Deactivate' : 'Activate'}
                                    >
                                        {s.isActive ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                                    </button>
                                    <button 
                                        onClick={() => handleEdit(s)}
                                        className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all"
                                    >
                                        <Pencil size={16} />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(s.id)}
                                        className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminSessions;
