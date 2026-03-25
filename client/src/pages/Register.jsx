import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { User, Mail, Lock, Building2, ShieldCheck, Loader2 } from "lucide-react";

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        department: "",
        role: "user",
    });
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const departments = ["IT", "HR", "Finance", "Operations", "Sales", "Marketing"];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!formData.department) {
            return toast.error("Please select a department");
        }
        setLoading(true);
        try {
            await register(formData);
            toast.success("Welcome aboard! Registration successful.");
            navigate("/login");
        } catch (err) {
            toast.error(err.response?.data?.message || "Registration failed. Try again.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <motion.div 
                    animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }} 
                    transition={{ duration: 20, repeat: Infinity }}
                    className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl" 
                />
                <motion.div 
                    animate={{ rotate: [360, 0], scale: [1, 1.3, 1] }} 
                    transition={{ duration: 25, repeat: Infinity }}
                    className="absolute -bottom-[10%] -left-[10%] w-[50%] h-[50%] bg-accent/5 rounded-full blur-3xl" 
                />
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[520px] bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 p-8 md:p-12 relative z-10 border border-slate-100"
            >
                <div className="text-center mb-10">
                    <div className="flex justify-center mb-6">
                        <div className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center font-black text-2xl shadow-xl shadow-primary/20 rotate-3 transition-transform hover:rotate-0">
                            R
                        </div>
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight mb-2">
                        Join the <span className="text-primary">Hub.</span>
                    </h1>
                    <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">Create Your Professional Profile</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 ml-1">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    placeholder="Roshan Afaz"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary/20 transition-all outline-none font-medium text-slate-700 placeholder:text-slate-300"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 ml-1">Department</label>
                            <div className="relative group">
                                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                                <select
                                    name="department"
                                    required
                                    value={formData.department}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary/20 transition-all outline-none font-medium text-slate-700 appearance-none cursor-pointer"
                                >
                                    <option value="" disabled>Select</option>
                                    {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 ml-1">Work Email</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                            <input
                                type="email"
                                name="email"
                                required
                                placeholder="name@company.com"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary/20 transition-all outline-none font-medium text-slate-700 placeholder:text-slate-300"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 ml-1">New Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                            <input
                                type="password"
                                name="password"
                                required
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary/20 transition-all outline-none font-medium text-slate-700 placeholder:text-slate-300"
                            />
                        </div>
                    </div>

                    <div className="p-4 rounded-3xl bg-primary/5 border border-primary/10 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <ShieldCheck size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-wider text-primary">Verified Account</p>
                            <p className="text-[10px] text-slate-500 font-medium">Standard Employee Access Level</p>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-5 bg-primary text-white rounded-3xl font-black tracking-widest uppercase text-xs shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={18} />
                        ) : (
                            "Create Account"
                        )}
                    </button>
                    
                    <p className="text-center text-sm font-bold text-slate-400">
                        Already have an account? <Link to="/login" className="text-primary hover:underline underline-offset-4">Log in</Link>
                    </p>
                </form>
            </motion.div>
        </div>
    );
};

export default Register;
