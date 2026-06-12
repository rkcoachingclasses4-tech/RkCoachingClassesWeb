import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        username: '',
        password: '',
        role: 'User'
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const result = await register(formData);
        setLoading(false);

        if (result.success) {
            toast.success('Registration successful! Please login.');
            navigate('/login');
        } else {
            toast.error(result.message || 'Registration failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[90vh] p-4">
            <div className="w-full max-w-lg p-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl">
                <h2 className="text-3xl font-bold text-center mb-6 text-white">Create Account</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white outline-none focus:ring-2 focus:ring-[var(--accent)]"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
                        <input
                            type="text"
                            name="username"
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white outline-none focus:ring-2 focus:ring-[var(--accent)]"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white outline-none focus:ring-2 focus:ring-[var(--accent)]"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white outline-none focus:ring-2 focus:ring-[var(--accent)]"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Role</label>
                        <select
                            name="role"
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white appearance-none"
                        >
                            <option value="User">User</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>
                    <div className="md:col-span-2 mt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-[var(--accent)] to-[#ff7b7b] text-white font-bold rounded-xl shadow-lg hover:scale-[1.02] transition-transform disabled:opacity-50"
                        >
                            {loading ? 'Creating account...' : 'Register'}
                        </button>
                    </div>
                    <div className="md:col-span-2 text-center text-gray-400 text-sm">
                        Already have an account? <Link to="/login" className="text-[var(--accent)] hover:underline">Login here</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
