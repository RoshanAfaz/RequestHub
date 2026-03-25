import { useState, useEffect } from "react";
import api from "../utils/api";
import { FileText, Clock, XCircle, Search, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const MyRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const res = await api.get("/requests");
                setRequests(res.data);
            } catch (error) {
                console.error("Failed to fetch requests", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center h-[60vh]">
            <div className="animate-pulse text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Archive...</div>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 md:p-8 space-y-8"
        >
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                <div>
                    <h1 className="text-4xl font-black text-slate-800 tracking-tight font-display">My <span className="text-primary">Archive</span></h1>
                    <p className="text-slate-500 font-medium mt-1">Manage and track your submitted authorization requests.</p>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
                <div className="overflow-x-auto w-full">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Request ID</th>
                                <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Details</th>
                                <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Category</th>
                                <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Deadline</th>
                                <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-8 py-6 text-center text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">View</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {requests.map((req) => (
                                <tr key={req._id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-6 whitespace-nowrap text-[11px] font-bold text-slate-400">#{req._id.slice(-6).toUpperCase()}</td>
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <p className="font-bold text-slate-800 text-sm group-hover:text-primary transition-colors">{req.title}</p>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <span className="text-[10px] font-black text-primary bg-primary/10 px-3 py-1 rounded-lg uppercase tracking-wider">
                                            {req.type}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
                                            <Clock size={14} className="text-slate-300" />
                                            {new Date(req.dueDate).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <span className={`inline-flex px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                            req.status === 'approved' ? 'bg-emerald-100 text-emerald-600' :
                                            req.status === 'rejected' ? 'bg-rose-100 text-rose-600' :
                                            'bg-amber-100 text-amber-600'
                                        }`}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <button 
                                            onClick={() => { setSelectedRequest(req); setIsModalOpen(true); }}
                                            className="p-3 text-slate-400 hover:bg-primary/10 hover:text-primary rounded-xl transition-all"
                                        >
                                            <Eye size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {requests.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-16 h-16 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-300">
                                                <FileText size={32} />
                                            </div>
                                            <p className="text-slate-400 font-bold text-sm tracking-widest uppercase">No requests found.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* View Details Modal */}
            <AnimatePresence>
                {isModalOpen && selectedRequest && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-100"
                        >
                            <div className="p-8 md:p-12 space-y-8">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-3">Authorization Request</p>
                                        <h2 className="text-3xl font-black text-slate-800 leading-tight">{selectedRequest.title}</h2>
                                    </div>
                                    <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 flex items-center justify-center bg-slate-100 text-slate-400 hover:bg-rose-50 hover:text-rose-500 rounded-2xl transition-all">
                                        <XCircle size={24} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-6 bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Category</p>
                                        <p className="font-bold text-slate-800">{selectedRequest.type}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Due Date</p>
                                        <p className="font-bold text-slate-800">{new Date(selectedRequest.dueDate).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 ml-1">Case Description</p>
                                    <div className="bg-slate-50/30 rounded-[2rem] p-8 border border-slate-100 italic text-slate-600 leading-relaxed font-medium">
                                        "{selectedRequest.description}"
                                    </div>
                                </div>

                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="w-full py-5 bg-slate-800 text-white rounded-3xl font-black tracking-widest uppercase text-xs shadow-xl shadow-slate-800/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    Close View
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default MyRequests;
