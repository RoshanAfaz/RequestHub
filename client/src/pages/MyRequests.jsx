import { useState, useEffect } from "react";
import api from "../utils/api";
import { FileText, Clock, XCircle, Search, Eye } from "lucide-react";
import { motion } from "framer-motion";

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

    if (loading) return <div>Loading requests...</div>;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex flex-col mb-8">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Archive</h1>
                <p className="text-slate-500 font-medium mt-1">Manage and track your submitted requests.</p>
            </div>

            <div className="card p-0 overflow-hidden bg-white/60">
                <table className="min-w-full divide-y divide-slate-100">
                    <thead className="bg-slate-50/80">
                        <tr>
                            <th className="px-6 py-5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em]">ID</th>
                            <th className="px-6 py-5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em]">Request Details</th>
                            <th className="px-6 py-5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em]">Category</th>
                            <th className="px-6 py-5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em]">Deadline</th>
                            <th className="px-6 py-5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em]">Status</th>
                            <th className="px-6 py-5 text-center text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em]">View</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-50">
                        {requests.map((req) => (
                            <tr key={req._id} className="hover:bg-slate-50/50 transition-colors duration-300">
                                <td className="px-6 py-5 whitespace-nowrap text-[11px] font-bold text-slate-400">#{req._id.slice(-6)}</td>
                                <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-slate-800">{req.title}</td>
                                <td className="px-6 py-5 whitespace-nowrap">
                                    <span className="text-[11px] font-black text-primary border border-primary/10 bg-primary/5 px-2 py-0.5 rounded-md uppercase tracking-wider">
                                        {req.type}
                                    </span>
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap">
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <Clock size={14} className="text-slate-300" />
                                        <span className="text-sm font-medium">{new Date(req.dueDate).toLocaleDateString()}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`badge ${req.status === 'approved' ? 'badge-success' :
                                        req.status === 'rejected' ? 'badge-danger' :
                                            req.status === 'in-review' ? 'badge-info' :
                                                'badge-warning'
                                        }`}>
                                        {req.status}
                                    </span>
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap text-center text-sm">
                                    <button 
                                        onClick={() => { setSelectedRequest(req); setIsModalOpen(true); }}
                                        className="p-2 text-primary hover:bg-primary/5 rounded-lg transition-colors"
                                        title="View Details"
                                    >
                                        <Eye size={18} strokeWidth={2.5} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {requests.length === 0 && (
                            <tr>
                                <td colSpan="6" className="px-6 py-4 text-center text-gray-500 py-12">
                                    <div className="flex flex-col items-center justify-center">
                                        <FileText size={48} className="text-gray-300 mb-2" />
                                        <p>No requests found.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* View Details Modal */}
            {isModalOpen && selectedRequest && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-100"
                    >
                        {/* Header */}
                        <div className="bg-slate-50 p-8 border-b border-slate-100 flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Request Details</span>
                                    <span className={`badge ${selectedRequest.status === 'approved' ? 'badge-success' :
                                        selectedRequest.status === 'rejected' ? 'badge-danger' :
                                            selectedRequest.status === 'in-review' ? 'badge-info' :
                                                'badge-warning'
                                        }`}>
                                        {selectedRequest.status}
                                    </span>
                                </div>
                                <h2 className="text-3xl font-black font-display text-slate-900 leading-tight">{selectedRequest.title}</h2>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-slate-200/50 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                                <XCircle size={24} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto">
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <p className="label">Category</p>
                                    <span className="text-[11px] font-black text-primary border border-primary/10 bg-primary/5 px-2 py-0.5 rounded-md uppercase tracking-wider">
                                        {selectedRequest.type}
                                    </span>
                                </div>
                                <div>
                                    <p className="label">Deadline</p>
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <Clock size={16} className="text-slate-300" />
                                        <span className="text-sm font-bold text-slate-800">{new Date(selectedRequest.dueDate).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <p className="label">Detailed Description</p>
                                <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100 italic text-slate-600 leading-relaxed font-medium">
                                    "{selectedRequest.description}"
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="btn btn-primary"
                            >
                                Close View
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
};

export default MyRequests;
