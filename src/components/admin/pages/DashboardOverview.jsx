import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { 
    Users, 
    Megaphone, 
    Award, 
    BookOpen 
} from 'lucide-react';

const DashboardOverview = () => {
    const { user } = useAuth();

    const stats = [
        { label: 'Total Students', value: '150+', icon: <Users />, color: 'bg-blue-500' },
        { label: 'Announcements', value: '12', icon: <Megaphone />, color: 'bg-purple-500' },
        { label: 'Top Results', value: '45', icon: <Award />, color: 'bg-amber-500' },
        { label: 'Active Batches', value: '8', icon: <BookOpen />, color: 'bg-emerald-500' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-3xl font-black text-white">Welcome back, {user?.username}!</h1>
                <p className="text-gray-400 mt-2">Here's what's happening with RK Coaching Classes today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-3xl hover:bg-white/10 transition-all group">
                        <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                            {stat.icon}
                        </div>
                        <div className="text-2xl font-black text-white">{stat.value}</div>
                        <div className="text-sm text-gray-400">{stat.label}</div>
                    </div>
                ))}
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl p-8 text-white relative overflow-hidden">
                <div className="relative z-10 max-w-2xl">
                    <h2 className="text-2xl font-black mb-4">Manage your classes efficiently!</h2>
                    <p className="text-blue-100 mb-6">Use the sidebar to post new announcements for students or upload recent exam results for session-wise tracking.</p>
                </div>
                <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            </div>
        </div>
    );
};

export default DashboardOverview;
