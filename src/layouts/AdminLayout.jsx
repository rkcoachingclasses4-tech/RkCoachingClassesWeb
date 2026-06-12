import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import { Menu } from 'lucide-react';
import { useEffect } from 'react';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    // Close sidebar on route change in mobile
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

    return (
        <div className="flex min-h-screen bg-[#020617] relative">
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between bg-[#0f172a] p-4 border-b border-white/10 text-white w-full fixed top-0 z-40">
                <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                    RK ADMIN
                </h2>
                <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-white/5 rounded-lg border border-white/10">
                    <Menu size={24} />
                </button>
            </div>

            {/* Sidebar */}
            <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            
            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden" 
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
            
            {/* Main Content Area */}
            <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pt-24 md:pt-8 overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
