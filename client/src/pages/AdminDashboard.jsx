import { useState, useEffect } from "react";
import api from "../utils/api";
import { Users, UserCheck, Shield, ShieldAlert, Search } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get("/admin/users");
            setUsers(res.data);
            setLoading(false);
        } catch (error) {
            toast.error("Failed to load users");
            setLoading(false);
        }
    };

    const updateRole = async (userId, currentRole) => {
        const newRole = currentRole === "hr" ? "user" : "hr";
        try {
            await api.put(`/admin/users/${userId}/role`, { role: newRole });
            toast.success(`User updated to ${newRole.toUpperCase()}`);
            fetchUsers();
        } catch (error) {
            toast.error("Failed to update user role");
        }
    };

    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 space-y-8"
        >
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-slate-800 font-display tracking-tight flex items-center gap-3">
                        <Shield className="text-primary" size={32} />
                        Admin Control <span className="text-primary">Center</span>
                    </h1>
                    <p className="text-slate-500 font-medium mt-2">Manage personnel and verify HR representatives.</p>
                </div>

                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl w-80 focus:ring-4 focus:ring-primary/10 transition-all text-sm font-medium outline-none"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="stats-card">
                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Total Users</p>
                    <p className="text-3xl font-black mt-2 text-slate-800">{users.length}</p>
                </div>
                <div className="stats-card border-l-4 border-primary">
                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest">HR Reps</p>
                    <p className="text-3xl font-black mt-2 text-primary">{users.filter(u => u.role === 'hr').length}</p>
                </div>
                <div className="stats-card border-l-4 border-slate-800">
                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest">System Admins</p>
                    <p className="text-3xl font-black mt-2 text-slate-800">{users.filter(u => u.role === 'admin').length}</p>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                            <th className="px-8 py-6 text-left text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">User Profile</th>
                            <th className="px-8 py-6 text-left text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Department</th>
                            <th className="px-8 py-6 text-left text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Access Level</th>
                            <th className="px-8 py-6 text-center text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {filteredUsers.map((user) => (
                            <tr key={user._id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold">
                                            {user.name[0]}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800 text-sm">{user.name}</p>
                                            <p className="text-xs text-slate-500">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                                        {user.department}
                                    </span>
                                </td>
                                <td className="px-8 py-6">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                        user.role === 'admin' ? 'bg-slate-800 text-white' :
                                        user.role === 'hr' ? 'bg-primary/10 text-primary' :
                                        'bg-slate-100 text-slate-500'
                                    }`}>
                                        {user.role === 'admin' && <Shield size={12} />}
                                        {user.role === 'hr' && <UserCheck size={12} />}
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-center">
                                    {user.role !== 'admin' ? (
                                        <button 
                                            onClick={() => updateRole(user._id, user.role)}
                                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                                user.role === 'hr' 
                                                ? 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white' 
                                                : 'bg-primary/10 text-primary hover:bg-primary hover:text-white shadow-lg shadow-primary/20'
                                            }`}
                                        >
                                            {user.role === 'hr' ? 'Demote to User' : 'Promote to HR'}
                                        </button>
                                    ) : (
                                        <span className="text-slate-300 text-xs italic font-medium">Protected Admin</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default AdminDashboard;
