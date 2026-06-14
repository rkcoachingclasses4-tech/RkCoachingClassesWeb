import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { GraduationCap, Save, Pencil, Trash2, X, Plus, Filter } from 'lucide-react';

const AdminResults = () => {
    const { token } = useAuth();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [filterClass, setFilterClass] = useState('all');
    const [filterSession, setFilterSession] = useState('all');

    // Dynamic master data from DB
    const [classes, setClasses] = useState([]);
    const [sessions, setSessions] = useState([]);

    const [formData, setFormData] = useState({ 
        studentName: '', 
        rollNo: '', 
        classLevel: '', 
        subject: '',
        academicSession: '',
        marks: '', 
        overallPercentage: '',
        resultStatus: 'Pass' 
    });

    const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/api/Admin`;
    const PUBLIC_API = `${import.meta.env.VITE_API_BASE_URL}/api/PublicData`;

    // Subjects for the currently selected class
    const selectedClass = classes.find(c => String(c.level) === formData.classLevel);
    const subjectsForClass = selectedClass ? selectedClass.subjects : [];

    // Fetch master data
    const fetchMasterData = async () => {
        try {
            const [classRes, sessionRes] = await Promise.all([
                fetch(`${PUBLIC_API}/classes`),
                fetch(`${PUBLIC_API}/sessions`)
            ]);
            if (classRes.ok) {
                const classData = await classRes.json();
                setClasses(classData);
                if (classData.length > 0) {
                    setFormData(prev => ({ ...prev, classLevel: String(classData[0].level) }));
                }
            }
            if (sessionRes.ok) {
                const sessionData = await sessionRes.json();
                setSessions(sessionData);
                if (sessionData.length > 0) {
                    setFormData(prev => ({ ...prev, academicSession: sessionData[0].name }));
                }
            }
        } catch (error) {
            console.error("Error fetching master data:", error);
        }
    };

    // Fetch all results
    const fetchResults = async () => {
        try {
            const response = await fetch(`${API_BASE}/results`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setResults(data);
            }
        } catch (error) {
            console.error("Error fetching results:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMasterData();
        fetchResults();
    }, []);

    // Create or Update
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editingId 
                ? `${API_BASE}/result/${editingId}` 
                : `${API_BASE}/result`;
            const method = editingId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    studentName: formData.studentName,
                    rollNo: formData.rollNo,
                    classLevel: parseInt(formData.classLevel),
                    subject: formData.subject,
                    marks: parseInt(formData.marks),
                    overallPercentage: parseFloat(formData.overallPercentage),
                    academicSession: formData.academicSession,
                    resultStatus: formData.resultStatus
                }),
            });

            if (!response.ok) throw new Error(editingId ? 'Failed to update' : 'Failed to save');

            toast.success(editingId ? 'Result updated!' : 'Result saved!');
            resetForm();
            fetchResults();
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Delete
    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this result?')) return;
        try {
            const response = await fetch(`${API_BASE}/result/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to delete');
            toast.success('Result deleted!');
            fetchResults();
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Edit — load data into form
    const handleEdit = (r) => {
        setEditingId(r.id);
        setFormData({ 
            studentName: r.studentName,
            rollNo: r.rollNo,
            classLevel: String(r.classLevel),
            subject: r.subject,
            academicSession: r.academicSession,
            marks: String(r.marks),
            overallPercentage: String(r.overallPercentage),
            resultStatus: r.resultStatus
        });
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setFormData({ 
            studentName: '', rollNo: '', 
            classLevel: classes.length > 0 ? String(classes[0].level) : '', 
            subject: '', 
            academicSession: sessions.length > 0 ? sessions[0].name : '', 
            marks: '', overallPercentage: '', resultStatus: 'Pass' 
        });
        setEditingId(null);
        setShowForm(false);
    };

    // Filtered results
    const filteredResults = results.filter(r => {
        if (filterClass !== 'all' && r.classLevel !== parseInt(filterClass)) return false;
        if (filterSession !== 'all' && r.academicSession !== filterSession) return false;
        return true;
    });

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 flex-wrap gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-500 rounded-2xl text-white shadow-lg shadow-amber-500/20">
                        <GraduationCap />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white">Student Results</h1>
                        <p className="text-gray-400">Manage session-wise performance data.</p>
                    </div>
                </div>
                {!showForm && (
                    <button 
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-amber-500 text-white font-bold rounded-2xl hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20"
                    >
                        <Plus size={20} />
                        Add Result
                    </button>
                )}
            </div>

            {/* Create / Edit Form */}
            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6 mb-10">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white">
                            {editingId ? '✏️ Edit Result' : '📝 Add New Result'}
                        </h2>
                        <button type="button" onClick={resetForm} className="text-gray-400 hover:text-white transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Student Full Name</label>
                            <input 
                                type="text" 
                                value={formData.studentName}
                                onChange={e => setFormData({...formData, studentName: e.target.value})}
                                className="w-full bg-black/30 border border-white/10 rounded-xl px-5 py-3 text-white outline-none focus:ring-2 focus:ring-amber-500"
                                placeholder="Enter full name"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Roll Number</label>
                            <input 
                                type="text" 
                                value={formData.rollNo}
                                onChange={e => setFormData({...formData, rollNo: e.target.value})}
                                className="w-full bg-black/30 border border-white/10 rounded-xl px-5 py-3 text-white outline-none focus:ring-2 focus:ring-amber-500"
                                placeholder="e.g. 241001"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Academic Session</label>
                            <select 
                                value={formData.academicSession}
                                onChange={e => setFormData({...formData, academicSession: e.target.value})}
                                className="w-full bg-black/30 border border-white/10 rounded-xl px-5 py-3 text-white outline-none cursor-pointer"
                            >
                                {sessions.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Class Level</label>
                            <select 
                                value={formData.classLevel}
                                onChange={e => setFormData({...formData, classLevel: e.target.value, subject: ''})}
                                className="w-full bg-black/30 border border-white/10 rounded-xl px-5 py-3 text-white outline-none cursor-pointer"
                            >
                                {classes.map(c => <option key={c.id} value={String(c.level)}>{c.nameEn}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Subject</label>
                            <select 
                                value={formData.subject}
                                onChange={e => setFormData({...formData, subject: e.target.value})}
                                className="w-full bg-black/30 border border-white/10 rounded-xl px-5 py-3 text-white outline-none cursor-pointer"
                            >
                                <option value="">-- Select Subject --</option>
                                {subjectsForClass.map(s => <option key={s.id} value={s.nameEn}>{s.nameEn}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Subject Marks</label>
                            <input 
                                type="number" 
                                value={formData.marks}
                                onChange={e => setFormData({...formData, marks: e.target.value})}
                                className="w-full bg-black/30 border border-white/10 rounded-xl px-5 py-3 text-white outline-none focus:ring-2 focus:ring-amber-500"
                                placeholder="e.g. 98"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Overall %</label>
                            <input 
                                type="number" 
                                step="0.01"
                                value={formData.overallPercentage}
                                onChange={e => setFormData({...formData, overallPercentage: e.target.value})}
                                className="w-full bg-black/30 border border-white/10 rounded-xl px-5 py-3 text-white outline-none focus:ring-2 focus:ring-amber-500"
                                placeholder="e.g. 96.50"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Status</label>
                            <select 
                                value={formData.resultStatus}
                                onChange={e => setFormData({...formData, resultStatus: e.target.value})}
                                className="w-full bg-black/30 border border-white/10 rounded-xl px-5 py-3 text-white outline-none cursor-pointer"
                            >
                                <option value="Pass">Pass</option>
                                <option value="Fail">Fail</option>
                                <option value="Top Scorer">Top Scorer</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button type="submit" className="flex items-center gap-3 px-8 py-4 bg-amber-500 text-white font-black rounded-2xl shadow-xl hover:bg-amber-600 transition-all">
                            <Save size={20} />
                            {editingId ? 'UPDATE RESULT' : 'SAVE RESULT'}
                        </button>
                        <button type="button" onClick={resetForm} className="px-8 py-4 bg-white/5 text-gray-400 font-bold rounded-2xl hover:bg-white/10 transition-all">
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {/* Filter Bar */}
            <div className="flex items-center gap-4 mb-6 flex-wrap">
                <div className="flex items-center gap-2 text-gray-400">
                    <Filter size={16} />
                    <span className="text-sm font-bold uppercase tracking-widest">Filter:</span>
                </div>
                <select 
                    value={filterClass} 
                    onChange={e => setFilterClass(e.target.value)}
                    className="bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2 text-sm outline-none cursor-pointer"
                >
                    <option value="all">All Classes</option>
                    {classes.map(c => <option key={c.id} value={String(c.level)}>{c.nameEn}</option>)}
                </select>
                <select 
                    value={filterSession} 
                    onChange={e => setFilterSession(e.target.value)}
                    className="bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2 text-sm outline-none cursor-pointer"
                >
                    <option value="all">All Sessions</option>
                    {sessions.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                </select>
                <span className="text-sm text-gray-500">
                    Showing {filteredResults.length} of {results.length} results
                </span>
            </div>

            {/* Results Table */}
            {loading ? (
                <div className="text-center py-16 text-gray-500">Loading results...</div>
            ) : filteredResults.length === 0 ? (
                <div className="text-center py-16 bg-white/5 border border-dashed border-white/10 rounded-3xl">
                    <GraduationCap className="mx-auto mb-4 text-gray-600" size={48} />
                    <p className="text-gray-500 text-lg">No results found.</p>
                    <p className="text-gray-600 text-sm mt-1">Click "Add Result" to upload student data.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Student</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Roll No</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Class</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Subject</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Marks</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Overall</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Session</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredResults.map((r) => (
                                <tr key={r.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                    <td className="p-4 text-white font-bold">{r.studentName}</td>
                                    <td className="p-4 text-gray-400 font-mono text-sm">{r.rollNo}</td>
                                    <td className="p-4">
                                        <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-lg text-xs font-bold">{r.classLevel}th</span>
                                    </td>
                                    <td className="p-4 text-gray-300">{r.subject}</td>
                                    <td className="p-4 text-amber-400 font-black">{r.marks}%</td>
                                    <td className="p-4 text-white">{r.overallPercentage}%</td>
                                    <td className="p-4 text-gray-400 text-sm">{r.academicSession}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                            r.resultStatus === 'Top Scorer' ? 'bg-amber-500/20 text-amber-400' :
                                            r.resultStatus === 'Pass' ? 'bg-emerald-500/20 text-emerald-400' :
                                            'bg-red-500/20 text-red-400'
                                        }`}>
                                            {r.resultStatus}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => handleEdit(r)}
                                                className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all"
                                                title="Edit"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(r.id)}
                                                className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminResults;
