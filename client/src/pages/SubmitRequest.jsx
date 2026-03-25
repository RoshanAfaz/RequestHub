import { useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Send, FileText, AlertCircle, Calendar, Hash, Type, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const SubmitRequest = () => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        type: "Leave",
        priority: "Medium",
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post("/requests", formData);
            toast.success("Request submitted successfully!");
            navigate("/my-requests");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit request. Try again.");
            setLoading(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto p-4 md:p-8 space-y-8"
        >
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-800 font-display tracking-tight flex items-center gap-4">
                        <Send className="text-primary" size={40} />
                        New <span className="text-primary">Submission</span>
                    </h1>
                    <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">Request Official Authorization</p>
                </div>
                
                <div className="hidden md:flex items-center gap-4 p-4 rounded-3xl bg-white border border-slate-100 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                        <AlertCircle size={20} />
                    </div>
                    <p className="text-xs font-bold text-slate-500 max-w-[160px]">Provide clear details for faster HR processing.</p>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-6 md:p-12 overflow-hidden relative">
                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Title Input */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Request Title</label>
                            <div className="relative group">
                                <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                                <input
                                    type="text"
                                    name="title"
                                    placeholder="Brief name of your request"
                                    required
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-4 md:py-5 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary/20 transition-all outline-none font-medium text-slate-700"
                                />
                            </div>
                        </div>

                        {/* Type Selection */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Request Type</label>
                            <div className="relative group">
                                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-4 md:py-5 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary/20 transition-all outline-none font-bold text-slate-700 appearance-none cursor-pointer"
                                >
                                    <option value="Leave">Leave Request</option>
                                    <option value="IT Support">IT Support</option>
                                    <option value="Maintenance">Maintenance</option>
                                    <option value="Resource">Resource Request</option>
                                    <option value="Other">Other Official Request</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         {/* Priority Selection */}
                         <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Priority Level</label>
                            <div className="grid grid-cols-3 gap-3">
                                {["Low", "Medium", "High"].map((p) => (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, priority: p })}
                                        className={`py-3 rounded-2xl text-[10px] font-black tracking-widest uppercase transition-all border-2 ${
                                            formData.priority === p 
                                            ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                                            : 'bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100'
                                        }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Submission Context</label>
                            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                                <Calendar size={18} className="text-slate-400" />
                                <span className="text-[11px] font-bold text-slate-500 italic">Auto-timestamped @ {new Date().toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Description Area */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Detailed Description</label>
                        <div className="relative group">
                            <FileText className="absolute left-5 top-5 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                            <textarea
                                name="description"
                                placeholder="Please explain your request in detail for the HR department..."
                                required
                                rows="6"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full pl-14 pr-6 py-6 bg-slate-50 border-2 border-transparent rounded-[2rem] focus:bg-white focus:border-primary/20 transition-all outline-none font-medium text-slate-700 leading-relaxed resize-none"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-6 md:py-8 bg-primary text-white rounded-[2rem] font-black tracking-[0.3em] uppercase text-xs shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    <span>Initiate Request Request</span>
                                    <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </>
                            )}
                        </button>
                        <p className="text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-6 italic">Secure Transmission Protected by RequestHub Global Cloud</p>
                    </div>
                </form>
            </div>
        </motion.div>
    );
};

export default SubmitRequest;
