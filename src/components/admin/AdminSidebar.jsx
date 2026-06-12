import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
    LayoutDashboard, 
    Megaphone, 
    GraduationCap, 
    BookOpen,
    Calendar,
    LogOut, 
    ArrowLeftRight,
    X
} from 'lucide-react';

const AdminSidebar = ({ isOpen, setIsOpen }) => {
    const location = useLocation();
    const { logout } = useAuth();

    const menuItems = [
        { path: '/admin/dashboard', icon: <LayoutDashboard size={20} />, label: 'Overview' },
        { path: '/admin/announcements', icon: <Megaphone size={20} />, label: 'Announcements' },
        { path: '/admin/results', icon: <GraduationCap size={20} />, label: 'Exam Results' },
        { path: '/admin/classes', icon: <BookOpen size={20} />, label: 'Classes & Subjects' },
        { path: '/admin/sessions', icon: <Calendar size={20} />, label: 'Sessions' },
    ];

    return (
        <div className={`w-64 h-screen bg-[#0f172a] text-white flex flex-col fixed left-0 top-0 border-r border-white/10 z-50 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
            <div className="p-6 flex justify-between items-center">
                <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                    RK ADMIN
                </h2>
                <button 
                    onClick={() => setIsOpen(false)}
                    className="md:hidden p-2 text-gray-400 hover:text-white bg-white/5 rounded-lg border border-white/10"
                >
                    <X size={20} />
                </button>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                            location.pathname === item.path 
                                ? 'bg-blue-600 shadow-lg shadow-blue-900/50 text-white' 
                                : 'hover:bg-white/5 text-gray-400 hover:text-white'
                        }`}
                    >
                        {item.icon}
                        <span className="font-medium">{item.label}</span>
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-white/10 space-y-2">
                {/* SWITCH BUTTON */}
                <Link 
                    to="/" 
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 transition-all w-full border border-purple-500/30"
                >
                    <ArrowLeftRight size={20} />
                    <span className="font-bold uppercase text-xs tracking-widest">Main Website</span>
                </Link>

                <button 
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all w-full mt-4"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default AdminSidebar;
