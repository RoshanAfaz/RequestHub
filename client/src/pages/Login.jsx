import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        const result = await login(email, password);
        if (result.success) {
            // Role-based redirect
            if (result.user.role === "admin" || result.user.role === "hr") {
                navigate("/hr-dashboard");
            } else {
                navigate("/dashboard");
            }
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-white relative overflow-hidden">
             {/* Dynamic Background */}
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -mr-64 -mt-32 animate-pulse"></div>
             <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] -ml-64 mb-32"></div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full glass-panel p-10 relative z-10 border border-white/50 shadow-2xl"
            >
                <div className="text-center">
                    <div className="flex flex-col items-center mb-8">
                        <div 
                            onClick={() => navigate("/")}
                            className="w-14 h-14 bg-gradient-to-tr from-primary to-accent rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-xl cursor-pointer hover:scale-110 active:scale-95 transition-all"
                        >R</div>
                        <h2 className="text-4xl font-black font-display tracking-tight text-slate-800 mt-4 leading-none">
                            Welcome <span className="text-primary">Back</span>.
                        </h2>
                        <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-3">Access RequestHub Portal</p>
                    </div>
                </div>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="mb-4">
                            <label className="label">Your Email</label>
                            <input
                                type="email"
                                required
                                className="input-field"
                                placeholder="name@organization.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="label">Secret Key</label>
                            <input
                                type="password"
                                required
                                className="input-field"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-xs font-bold text-center bg-red-50 p-3 rounded-xl border border-red-100">
                             ⚠️ {error}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            className="btn btn-primary w-full py-4 text-md shadow-xl shadow-primary/20 active:scale-[0.98]"
                        >
                            Log Into Dashboard
                        </button>
                    </div>

                    <p className="text-center text-sm font-medium text-slate-500 pt-4">
                        New representative?{" "}
                        <button
                            type="button"
                            onClick={() => navigate("/register")}
                            className="font-black text-primary hover:underline transition-all"
                        >
                            Register account
                        </button>
                    </p>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;
