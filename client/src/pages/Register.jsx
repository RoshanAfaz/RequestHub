import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

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
    const [error, setError] = useState("");

    const departments = ["IT", "HR", "Finance", "Operations", "Sales", "Marketing"];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        const result = await register(
            formData.name,
            formData.email,
            formData.password,
            formData.role,
            formData.department
        );

        if (result.success) {
            alert("Registration successful! Please login.");
            navigate("/login");
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-white relative overflow-hidden">
             {/* Dynamic Background */}
             <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -mr-64 -mt-32 animate-pulse"></div>
             <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] -ml-64 mb-32"></div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl w-full glass-panel p-10 relative z-10 border border-white/50 shadow-2xl"
            >
                <div className="text-center mb-10">
                    <div 
                        onClick={() => navigate("/")}
                        className="w-12 h-12 bg-gradient-to-tr from-primary to-accent rounded-2xl mx-auto flex items-center justify-center text-white text-xl font-black shadow-xl cursor-pointer hover:scale-110 active:scale-95 transition-all mb-4"
                    >R</div>
                    <h2 className="text-4xl font-black font-display tracking-tight text-slate-800">
                        Join the <span className="text-primary">Hub</span>.
                    </h2>
                    <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">Create your professional profile</p>
                </div>

                <form className="space-y-8" onSubmit={handleSubmit}>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div>
                                <label className="label">Full Name</label>
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    className="input-field"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="label">Work Email</label>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="input-field"
                                    placeholder="john@organization.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="label">New Password</label>
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    className="input-field"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="label">Department</label>
                                <select
                                    name="department"
                                    required
                                    className="input-field appearance-none cursor-pointer"
                                    value={formData.department}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Department</option>
                                    {departments.map((dept) => (
                                        <option key={dept} value={dept}>{dept}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="label">Account Type</label>
                                <div className="grid grid-cols-2 gap-4 mt-2">
                                    <label className={`flex items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.role === 'user' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 hover:border-slate-200'}`}>
                                        <input
                                            type="radio"
                                            name="role"
                                            value="user"
                                            checked={formData.role === "user"}
                                            onChange={handleChange}
                                            className="hidden"
                                        />
                                        <span className="font-bold text-sm">Individual</span>
                                    </label>
                                    <label className={`flex items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.role === 'hr' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 hover:border-slate-200'}`}>
                                        <input
                                            type="radio"
                                            name="role"
                                            value="hr"
                                            checked={formData.role === "hr"}
                                            onChange={handleChange}
                                            className="hidden"
                                        />
                                        <span className="font-bold text-sm">HR Rep</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-xs font-bold text-center bg-red-50 p-4 rounded-xl border border-red-100">
                            ⚠️ {error}
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
                        <button
                            type="submit"
                            className="btn btn-primary flex-1 w-full sm:w-auto py-4 text-md shadow-xl shadow-primary/20"
                        >
                            Create Account
                        </button>
                        <p className="text-sm font-medium text-slate-500">
                             Have an account?{" "}
                            <button
                                type="button"
                                onClick={() => navigate("/login")}
                                className="font-black text-primary hover:underline transition-all"
                            >
                                Log in
                            </button>
                        </p>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default Register;
