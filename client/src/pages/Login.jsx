import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Mail, Lock, LogIn, Loader2 } from "lucide-react";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            const role = user.role?.toLowerCase();
            if (role === "admin" || role === "hr") {
                navigate("/hr-dashboard");
            } else {
                navigate("/dashboard");
            }
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const loggedInUser = await login(email, password);
            toast.success("Welcome back!");
            
            const role = loggedInUser.role?.toLowerCase();
            if (role === "admin" || role === "hr") {
                navigate("/hr-dashboard");
            } else {
                navigate("/dashboard");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Invalid credentials. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <motion.div 
                    animate={{ rotate: [360, 0], scale: [1, 1.2, 1] }} 
                    transition={{ duration: 20, repeat: Infinity }}
                    className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl" 
                />
                <motion.div 
                    animate={{ rotate: [0, 360], scale: [1, 1.3, 1] }} 
                    transition={{ duration: 25, repeat: Infinity }}
                    className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-accent/5 rounded-full blur-3xl" 
                />
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[480px] bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 p-8 md:p-12 relative z-10 border border-slate-100"
            >
                <div className="text-center mb-10">
                    <div className="flex justify-center mb-6">
                        <div className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center font-black text-2xl shadow-xl shadow-primary/20 -rotate-3 transition-transform hover:rotate-0">
                            R
                        </div>
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight mb-2 font-display">
                        Welcome <span className="text-primary">Back.</span>
                    </h1>
                    <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">Secure Gateway Protocol</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 ml-1">Work Email</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="name@company.com"
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary/20 transition-all outline-none font-medium text-slate-700 placeholder:text-slate-300"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-[11px] font-black uppercase tracking-wider text-slate-400">Security Key</label>
                            <Link to="/register" className="text-[10px] font-bold text-primary hover:underline underline-offset-4">Forgot?</Link>
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary/20 transition-all outline-none font-medium text-slate-700 placeholder:text-slate-300"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-5 bg-primary text-white rounded-3xl font-black tracking-widest uppercase text-xs shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2 group mt-4"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={18} />
                        ) : (
                            <>
                                <span>Sign In to Hub</span>
                                <LogIn size={16} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                    
                    <p className="text-center text-sm font-bold text-slate-400 mt-6">
                        New representative? <Link to="/register" className="text-primary hover:underline underline-offset-4">Create Account</Link>
                    </p>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;
