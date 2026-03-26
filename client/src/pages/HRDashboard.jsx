import { useState, useEffect } from "react";
import api from "../utils/api";
import { Search, Filter, Check, X, Clock, Eye, Paperclip } from "lucide-react";
import { motion } from "framer-motion";
import {
    PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from "recharts";

const STATUS_COLORS = {
    pending: "#eab308", // yellow-500
    approved: "#22c55e", // green-500
    rejected: "#ef4444", // red-500
    "in-review": "#3b82f6" // blue-500
};

const HRDashboard = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ status: "", department: "", search: "" });
    const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, overdue: 0 });
    const [chartData, setChartData] = useState({ statusData: [], deptData: [] });
    const [isMounted, setIsMounted] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [confirmData, setConfirmData] = useState({ isOpen: false, status: "", requestId: "", title: "" });

    const departments = ["IT", "HR", "Finance", "Operations", "Sales", "Marketing"];

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const params = {};
            if (filter.status) params.status = filter.status;
            if (filter.department) params.department = filter.department;
            if (filter.search) params.search = filter.search;

            const res = await api.get("/requests", { params });
            setRequests(res.data);

            // Calculate stats from the fetched data (or fetch separate stats endpoint)
            // Ideally stats should be from a separate endpoint to be accurate across all pages
            // For now, calculating from current view if no filters, or just fetch all for stats
            // Let's simpler: fetch all for table, verify stats separately? 
            // We'll calculate simple stats from the response for now, but 
            // typically dashboard stats show GLOBAL totals, not filtered ones.
            // Let's assume fetching without filters for stats initially.
        } catch (error) {
            console.error("Failed to fetch requests", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const res = await api.get("/requests"); // Get all (admin)
            const allReqs = res.data;
            setStats({
                total: allReqs.length,
                pending: allReqs.filter(r => r.status === "pending").length,
                approved: allReqs.filter(r => r.status === "approved").length,
                overdue: allReqs.filter(r => r.status === "pending" && new Date(r.dueDate) < new Date()).length
            });

            // Process data for charts
            const statusCounts = allReqs.reduce((acc, req) => {
                acc[req.status] = (acc[req.status] || 0) + 1;
                return acc;
            }, {});
            const statusData = Object.keys(statusCounts).map(key => ({ name: key, value: statusCounts[key] }));

            const deptCounts = allReqs.reduce((acc, req) => {
                acc[req.department] = (acc[req.department] || 0) + 1;
                return acc;
            }, {});
            const deptData = Object.keys(deptCounts).map(key => ({ name: key, value: deptCounts[key] }));

            setChartData({ statusData, deptData });
        } catch (error) {
            console.error("Failed to fetch stats");
        }
    }

    useEffect(() => {
        fetchRequests();
    }, [filter.status, filter.department]); // Debounce search in real app

    useEffect(() => {
        fetchStats();
        // Delay mounting charts to allow layout to stabilize after animation
        const timer = setTimeout(() => setIsMounted(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchRequests();
    };

    const updateStatus = async (id, newStatus, skipConfirm = false) => {
        // Trigger confirmation for critical statuses if not explicitly skipped
        if (!skipConfirm && (newStatus === "approved" || newStatus === "rejected")) {
            const req = requests.find(r => r._id === id);
            setConfirmData({ isOpen: true, status: newStatus, requestId: id, title: req?.title || "this request" });
            return;
        }

        try {
            await api.put(`/requests/${id}/status`, { status: newStatus });
            // Close any open modals/confirmations
            setConfirmData({ isOpen: false, status: "", requestId: "", title: "" });
            setIsModalOpen(false);
            // Refresh list
            fetchRequests();
            fetchStats();
        } catch (error) {
            alert("Failed to update status");
        }
    };

    useEffect(() => {
        const handleRefresh = () => {
            fetchRequests();
            fetchStats();
        };

        window.addEventListener("refreshRequests", handleRefresh);
        return () => window.removeEventListener("refreshRequests", handleRefresh);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h1 className="text-3xl font-bold text-gray-800 mb-6">HR Dashboard</h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <div className="card group relative overflow-hidden bg-white/50">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700"></div>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.15em] text-[11px]">Total Requests</p>
                    <p className="text-4xl font-black font-display text-slate-900 mt-2">{stats.total}</p>
                    <div className="h-1 w-12 bg-primary/20 rounded-full mt-4 group-hover:w-20 transition-all duration-500"></div>
                </div>
                <div className="card group relative overflow-hidden bg-white/50">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700"></div>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.15em] text-[11px]">Pending</p>
                    <p className="text-4xl font-black font-display text-amber-500 mt-2">{stats.pending}</p>
                    <div className="h-1 w-12 bg-amber-500/20 rounded-full mt-4 group-hover:w-20 transition-all duration-500"></div>
                </div>
                <div className="card group relative overflow-hidden bg-white/50">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700"></div>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.15em] text-[11px]">Approved</p>
                    <p className="text-4xl font-black font-display text-emerald-500 mt-2">{stats.approved}</p>
                    <div className="h-1 w-12 bg-emerald-500/20 rounded-full mt-4 group-hover:w-20 transition-all duration-500"></div>
                </div>
                <div className="card group relative overflow-hidden bg-white/50">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-bl-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700"></div>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.15em] text-[11px]">Overdue</p>
                    <p className="text-4xl font-black font-display text-red-500 mt-2">{stats.overdue}</p>
                    <div className="h-1 w-12 bg-red-500/20 rounded-full mt-4 group-hover:w-20 transition-all duration-500"></div>
                </div>
            </div>

            {/* Analytics Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Status Distribution */}
                <div className="card group bg-white/40">
                    <h2 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                        Status Distribution
                    </h2>
                    <div style={{ width: "100%", height: 300, minHeight: 300 }}>
                        {isMounted && (
                            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                                <PieChart>
                                    <Pie
                                        data={chartData.statusData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {chartData.statusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || "#cbd5e1"} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip />
                                    <Legend className="capitalize" />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Department Breakdown */}
                <div className="card bg-white shadow-lg rounded-xl p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Requests by Department</h2>
                    <div style={{ width: "100%", height: 300, minHeight: 300 }}>
                        {isMounted && (
                            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                                <BarChart data={chartData.deptData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis allowDecimals={false} />
                                    <RechartsTooltip />
                                    <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} name="Requests" />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex gap-4 w-full md:w-auto">
                    <select
                        className="input-field max-w-xs"
                        value={filter.department}
                        onChange={(e) => setFilter({ ...filter, department: e.target.value })}
                    >
                        <option value="">All Departments</option>
                        {departments.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>

                    <select
                        className="input-field max-w-xs"
                        value={filter.status}
                        onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                    >
                        <option value="">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="in-review">In Review</option>
                    </select>
                </div>

                <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search by Request ID..."
                        className="input-field"
                        value={filter.search}
                        onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                    />
                    <button type="submit" className="btn btn-primary"><Search size={20} /></button>
                </form>
            </div>

            {/* Table */}
            <div className="card p-0 overflow-hidden bg-white/60 border-slate-100 flex flex-col">
                <div className="overflow-x-auto w-full">
                    <table className="min-w-full divide-y divide-slate-100">
                    <thead className="bg-slate-50/80">
                        <tr>
                            <th className="px-6 py-5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em]">ID</th>
                            <th className="px-6 py-5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em]">User</th>
                            <th className="px-6 py-5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em]">Request Details</th>
                            <th className="px-6 py-5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em]">Due Info</th>
                            <th className="px-6 py-5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em]">Status</th>
                            <th className="px-6 py-5 text-center text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em]">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-50">
                        {loading ? (
                            <tr><td colSpan="8" className="text-center py-4">Loading...</td></tr>
                        ) : requests.length === 0 ? (
                            <tr><td colSpan="8" className="text-center py-4">No requests found.</td></tr>
                        ) : (
                            requests.map((req) => {
                                const isOverdue = req.status === "pending" && new Date(req.dueDate) < new Date();
                                return (
                                    <tr key={req._id} className={`${isOverdue ? "bg-red-50/50" : "hover:bg-slate-50/50"} transition-colors duration-300`}>
                                        <td className="px-6 py-5 whitespace-nowrap text-[11px] font-bold text-slate-400">#{req._id.slice(-6)}</td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-700 font-bold text-sm shadow-inner">
                                                    {req.submittedBy?.name?.[0]?.toUpperCase() || "U"}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-800 leading-tight">{req.submittedBy?.name || "Unknown"}</p>
                                                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">{req.submittedBy?.email || "No email"}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <p className="text-sm font-bold text-slate-800">{req.title}</p>
                                            <p className="text-[11px] font-medium text-primary uppercase tracking-wider mt-1">{req.department || "Unassigned"}</p>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <Clock size={14} className={isOverdue ? "text-red-500" : "text-slate-400"} />
                                                <span className="text-sm font-medium">{new Date(req.dueDate).toLocaleDateString()}</span>
                                            </div>
                                            {isOverdue && <p className="text-[10px] font-black text-red-500 uppercase tracking-tighter mt-1">Overdue Action</p>}
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
                                        <td className="px-6 py-5 whitespace-nowrap text-center">
                                            <div className="flex justify-center gap-1">
                                                <button onClick={() => { setSelectedRequest(req); setIsModalOpen(true); }} title="View Details" className="p-2 text-primary hover:bg-primary/5 rounded-lg transition-colors">
                                                    <Eye size={18} strokeWidth={3} />
                                                </button>
                                                <button onClick={() => updateStatus(req._id, "approved")} title="Approve" className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                                                    <Check size={18} strokeWidth={3} />
                                                </button>
                                                <button onClick={() => updateStatus(req._id, "rejected")} title="Reject" className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                    <X size={18} strokeWidth={3} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                    </table>
                </div>
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
                                <X size={24} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto">
                            {/* User Info Section */}
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <p className="label">Submitted By</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                                            {selectedRequest.submittedBy?.name?.[0]?.toUpperCase() || "U"}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800">{selectedRequest.submittedBy?.name}</p>
                                            <p className="text-xs text-slate-400 font-medium">{selectedRequest.submittedBy?.email}</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <p className="label">Category & Dept</p>
                                    <p className="font-bold text-slate-800 uppercase tracking-widest text-xs flex items-center gap-2">
                                        <span className="text-primary">{selectedRequest.type}</span>
                                        <span className="text-slate-200">/</span>
                                        <span className="text-slate-500">{selectedRequest.department || "Unassigned"}</span>
                                    </p>
                                    <p className="text-xs text-slate-400 font-medium mt-1 italic">Due: {new Date(selectedRequest.dueDate).toLocaleDateString()}</p>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <p className="label">Detailed Description</p>
                                <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100 italic text-slate-600 leading-relaxed">
                                    "{selectedRequest.description}"
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-between gap-4">
                            <button
                                onClick={() => { updateStatus(selectedRequest._id, "in-review"); setIsModalOpen(false); }}
                                className="px-6 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-100 transition-all text-sm"
                            >
                                Mark In-Review
                            </button>
                            <div className="flex gap-4 flex-1">
                                <button
                                    onClick={() => { updateStatus(selectedRequest._id, "rejected"); setIsModalOpen(false); }}
                                    className="flex-1 px-6 py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-500 hover:text-white transition-all text-sm"
                                >
                                    Reject Request
                                </button>
                                <button
                                    onClick={() => { updateStatus(selectedRequest._id, "approved"); setIsModalOpen(false); }}
                                    className="flex-1 px-6 py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all text-sm"
                                >
                                    Approve Now
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Confirmation Modal */}
            {confirmData.isOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 text-center border border-slate-100"
                    >
                        <div className={`w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center ${
                            confirmData.status === 'approved' ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500'
                        }`}>
                            {confirmData.status === 'approved' ? <Check size={32} /> : <X size={32} />}
                        </div>
                        <h3 className="text-2xl font-black text-slate-800 mb-2 font-display">Are you sure?</h3>
                        <p className="text-slate-500 mb-8 px-4 leading-relaxed">
                            You are about to <span className={confirmData.status === 'approved' ? 'text-emerald-500 font-bold' : 'text-red-500 font-bold'}>
                                {confirmData.status}
                            </span> the request: <br/> <strong>"{confirmData.title}"</strong>. This action cannot be undone.
                        </p>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setConfirmData({ isOpen: false, status: "", requestId: "", title: "" })}
                                className="px-6 py-4 bg-slate-50 text-slate-500 font-bold rounded-2xl hover:bg-slate-100 transition-all text-sm"
                            >
                                Nevermind
                            </button>
                            <button
                                onClick={() => updateStatus(confirmData.requestId, confirmData.status, true)}
                                className={`px-6 py-4 text-white font-bold rounded-2xl transition-all text-sm shadow-lg ${
                                    confirmData.status === 'approved' 
                                        ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20' 
                                        : 'bg-red-500 hover:bg-red-600 shadow-red-500/20'
                                }`}
                            >
                                Yes, {confirmData.status === 'approved' ? 'Approve' : 'Reject'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
};

export default HRDashboard;
