import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { BookOpen, Plus, Trash2, Pencil, X, Save } from 'lucide-react';

const AdminClasses = () => {
    const { token } = useAuth();
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showClassForm, setShowClassForm] = useState(false);
    const [editingClassId, setEditingClassId] = useState(null);
    const [classForm, setClassForm] = useState({ level: '', nameEn: '', nameHi: '' });

    // Subject form state
    const [subjectForm, setSubjectForm] = useState({ classId: null, nameEn: '', nameHi: '' });
    const [showSubjectForm, setShowSubjectForm] = useState(null); // classId or null

    const API_BASE = 'https://localhost:7233/api/Admin';

    // ========== FETCH ==========
    const fetchClasses = async () => {
        try {
            const response = await fetch(`${API_BASE}/classes`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setClasses(data);
            }
        } catch (error) {
            console.error("Error fetching classes:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchClasses(); }, []);

    // ========== CLASS CRUD ==========
    const handleClassSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editingClassId ? `${API_BASE}/class/${editingClassId}` : `${API_BASE}/class`;
            const method = editingClassId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(classForm),
            });
            if (!response.ok) throw new Error('Failed');

            toast.success(editingClassId ? 'Class updated!' : 'Class added!');
            resetClassForm();
            fetchClasses();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleDeleteClass = async (id) => {
        if (!confirm('Delete this class and ALL its subjects?')) return;
        try {
            const response = await fetch(`${API_BASE}/class/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed');
            toast.success('Class deleted!');
            fetchClasses();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleEditClass = (cls) => {
        setEditingClassId(cls.id);
        setClassForm({ level: String(cls.level), nameEn: cls.nameEn, nameHi: cls.nameHi });
        setShowClassForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetClassForm = () => {
        setClassForm({ level: '', nameEn: '', nameHi: '' });
        setEditingClassId(null);
        setShowClassForm(false);
    };

    // ========== SUBJECT CRUD ==========
    const handleSubjectSubmit = async (e, classId) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_BASE}/subject`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ classId, nameEn: subjectForm.nameEn, nameHi: subjectForm.nameHi }),
            });
            if (!response.ok) throw new Error('Failed');
            toast.success('Subject added!');
            setSubjectForm({ classId: null, nameEn: '', nameHi: '' });
            setShowSubjectForm(null);
            fetchClasses();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleDeleteSubject = async (id) => {
        if (!confirm('Remove this subject?')) return;
        try {
            const response = await fetch(`${API_BASE}/subject/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed');
            toast.success('Subject removed!');
            fetchClasses();
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 flex-wrap gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-500 rounded-2xl text-white shadow-lg shadow-emerald-500/20">
                        <BookOpen />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white">Classes & Subjects</h1>
                        <p className="text-gray-400">Manage class levels and assign subjects to each.</p>
                    </div>
                </div>
                {!showClassForm && (
                    <button
                        onClick={() => setShowClassForm(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-600 transition-all shadow-lg"
                    >
                        <Plus size={20} />
                        Add Class
                    </button>
                )}
            </div>

            {/* Add / Edit Class Form */}
            {showClassForm && (
                <form onSubmit={handleClassSubmit} className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-10 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white">
                            {editingClassId ? '✏️ Edit Class' : '🏫 Add New Class'}
                        </h2>
                        <button type="button" onClick={resetClassForm} className="text-gray-400 hover:text-white">
                            <X size={24} />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Class Level (Number)</label>
                            <input
                                type="number" min="1" max="12"
                                value={classForm.level}
                                onChange={e => setClassForm({ ...classForm, level: e.target.value })}
                                className="w-full bg-black/30 border border-white/10 rounded-xl px-5 py-3 text-white outline-none focus:ring-2 focus:ring-emerald-500"
                                placeholder="e.g. 10"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Name (English)</label>
                            <input
                                type="text"
                                value={classForm.nameEn}
                                onChange={e => setClassForm({ ...classForm, nameEn: e.target.value })}
                                className="w-full bg-black/30 border border-white/10 rounded-xl px-5 py-3 text-white outline-none focus:ring-2 focus:ring-emerald-500"
                                placeholder="10th Class"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">नाम (हिन्दी)</label>
                            <input
                                type="text"
                                value={classForm.nameHi}
                                onChange={e => setClassForm({ ...classForm, nameHi: e.target.value })}
                                className="w-full bg-black/30 border border-white/10 rounded-xl px-5 py-3 text-white outline-none focus:ring-2 focus:ring-emerald-500"
                                placeholder="10वीं कक्षा"
                                required
                            />
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button type="submit" className="flex items-center gap-2 px-8 py-4 bg-emerald-500 text-white font-black rounded-2xl shadow-xl hover:bg-emerald-600 transition-all">
                            <Save size={20} />
                            {editingClassId ? 'UPDATE CLASS' : 'SAVE CLASS'}
                        </button>
                        <button type="button" onClick={resetClassForm} className="px-8 py-4 bg-white/5 text-gray-400 font-bold rounded-2xl hover:bg-white/10 transition-all">
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {/* Classes List */}
            {loading ? (
                <div className="text-center py-16 text-gray-500">Loading classes...</div>
            ) : classes.length === 0 ? (
                <div className="text-center py-16 bg-white/5 border border-dashed border-white/10 rounded-3xl">
                    <BookOpen className="mx-auto mb-4 text-gray-600" size={48} />
                    <p className="text-gray-500 text-lg">No classes configured yet.</p>
                    <p className="text-gray-600 text-sm mt-1">Click "Add Class" to get started.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {classes.map(cls => (
                        <div key={cls.id} className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
                            {/* Class Header */}
                            <div className="p-6 flex justify-between items-center border-b border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg">
                                        {cls.level}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">{cls.nameEn}</h3>
                                        <p className="text-sm text-gray-500">{cls.nameHi} • {cls.subjects.length} subject{cls.subjects.length !== 1 ? 's' : ''}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <button
                                        onClick={() => handleEditClass(cls)}
                                        className="p-3 bg-blue-500/20 text-blue-400 rounded-xl hover:bg-blue-500/30 transition-all"
                                    >
                                        <Pencil size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClass(cls.id)}
                                        className="p-3 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Subjects */}
                            <div className="p-6">
                                <div className="flex flex-wrap gap-3 mb-4">
                                    {cls.subjects.length > 0 ? cls.subjects.map(sub => (
                                        <div key={sub.id} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2 group">
                                            <span className="text-sm text-white font-medium">{sub.nameEn}</span>
                                            <span className="text-xs text-gray-500">({sub.nameHi})</span>
                                            <button
                                                onClick={() => handleDeleteSubject(sub.id)}
                                                className="ml-1 text-red-400/50 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    )) : (
                                        <p className="text-sm text-gray-600 italic">No subjects assigned yet.</p>
                                    )}
                                </div>

                                {/* Add Subject Inline Form */}
                                {showSubjectForm === cls.id ? (
                                    <form onSubmit={(e) => handleSubjectSubmit(e, cls.id)} className="flex flex-col sm:flex-row items-end gap-3 mt-4 p-4 bg-black/20 rounded-2xl border border-white/5">
                                        <div className="flex-1">
                                            <label className="block text-xs text-gray-500 mb-1">Subject (English)</label>
                                            <input
                                                type="text"
                                                value={subjectForm.nameEn}
                                                onChange={e => setSubjectForm({ ...subjectForm, nameEn: e.target.value })}
                                                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white text-sm outline-none focus:ring-1 focus:ring-emerald-500"
                                                placeholder="Math"
                                                required
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-xs text-gray-500 mb-1">विषय (हिन्दी)</label>
                                            <input
                                                type="text"
                                                value={subjectForm.nameHi}
                                                onChange={e => setSubjectForm({ ...subjectForm, nameHi: e.target.value })}
                                                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white text-sm outline-none focus:ring-1 focus:ring-emerald-500"
                                                placeholder="गणित"
                                                required
                                            />
                                        </div>
                                        <button type="submit" className="px-5 py-2 bg-emerald-500 text-white font-bold rounded-lg text-sm hover:bg-emerald-600 transition-all shrink-0">
                                            Add
                                        </button>
                                        <button type="button" onClick={() => { setShowSubjectForm(null); setSubjectForm({ classId: null, nameEn: '', nameHi: '' }); }} className="px-3 py-2 text-gray-400 hover:text-white transition-colors shrink-0">
                                            <X size={18} />
                                        </button>
                                    </form>
                                ) : (
                                    <button
                                        onClick={() => setShowSubjectForm(cls.id)}
                                        className="flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors mt-2 font-medium"
                                    >
                                        <Plus size={16} />
                                        Add Subject
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminClasses;
