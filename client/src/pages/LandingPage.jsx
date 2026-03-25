import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Zap, Shield, Bell, LayoutDashboard } from "lucide-react";

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-white selection:bg-primary selection:text-white overflow-x-hidden">
            {/* Header / Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-tr from-primary to-accent rounded-xl flex items-center justify-center text-white text-xl font-black shadow-lg shadow-primary/20">R</div>
                    <span className="text-xl font-black font-display tracking-tight text-slate-900">Request<span className="text-primary">Hub</span></span>
                </div>
                <div className="flex items-center gap-4">
                    <Link to="/login" className="px-5 py-2 text-sm font-bold text-slate-600 hover:text-primary transition-colors">Sign In</Link>
                    <Link to="/register" className="btn btn-primary px-6 py-2.5 !text-sm shadow-xl shadow-primary/20">Get Started</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="pt-32 pb-20 px-6 relative">
                 {/* Background Decorative Elements */}
                 <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -mr-64 -mt-32"></div>
                 <div className="absolute bottom-0 left-0 -z-10 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl -ml-64 mb-32"></div>

                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full border border-primary/10 text-primary mb-6">
                            <Zap size={16} />
                            <span className="text-xs font-black uppercase tracking-widest">Version 2.0 Available</span>
                        </div>
                        <h1 className="text-6xl lg:text-7xl font-black font-display text-slate-900 leading-[1.05] tracking-tight mb-8">
                            Transforming Organization <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-500 to-accent">Workflows</span>.
                        </h1>
                        <p className="text-xl text-slate-500 leading-relaxed mb-10 max-w-xl">
                            The ultimate, automated request management system designed for modern enterprises. Streamline approvals, track progress, and get things done in real-time.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-5">
                            <Link to="/register" className="btn btn-primary px-8 py-4 text-lg shadow-2xl shadow-primary/30 group">
                                Start Your Journey <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link to="/login" className="btn btn-outline px-8 py-4 text-lg">
                                Access Dashboard
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="relative"
                    >
                        {/* Mock Dashboard Preview */}
                        <div className="relative z-10 p-4 bg-slate-100 rounded-[2.5rem] shadow-2xl border border-white/50">
                            <div className="bg-white rounded-[2rem] overflow-hidden shadow-inner">
                                <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200" alt="Dashboard Preview" className="w-full h-auto opacity-90 hover:opacity-100 transition-opacity" />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Features Section */}
            <div className="bg-slate-50 py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl lg:text-5xl font-black font-display text-slate-900 mb-6">Designed for Excellence</h2>
                        <p className="text-lg text-slate-500 max-w-2xl mx-auto">Built from the ground up to solve complex enterprise request bottlenecks with ease.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="card group hover:bg-primary transition-colors duration-500">
                            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:bg-white/20 group-hover:text-white transition-colors">
                                <Zap size={28} />
                            </div>
                            <h3 className="text-xl font-black font-display text-slate-900 mb-4 group-hover:text-white transition-colors">Real-Time Sync</h3>
                            <p className="text-slate-500 group-hover:text-white/80 transition-colors">Instant status updates powered by WebSocket technology. No more page refreshing.</p>
                        </div>

                        <div className="card group hover:bg-indigo-600 transition-colors duration-500">
                             <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:bg-white/20 group-hover:text-white transition-colors">
                                <LayoutDashboard size={28} />
                            </div>
                            <h3 className="text-xl font-black font-display text-slate-900 mb-4 group-hover:text-white transition-colors">Premium Analytics</h3>
                            <p className="text-slate-500 group-hover:text-white/80 transition-colors">Elegant charts and summaries for HR to understand organizational health at a glance.</p>
                        </div>

                        <div className="card group hover:bg-emerald-600 transition-colors duration-500">
                             <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:bg-white/20 group-hover:text-white transition-colors">
                                <Shield size={28} />
                            </div>
                            <h3 className="text-xl font-black font-display text-slate-900 mb-4 group-hover:text-white transition-colors">Enterprise Security</h3>
                            <p className="text-slate-500 group-hover:text-white/80 transition-colors">Role-based access control and encrypted data management for your peace of mind.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-20 px-6">
                <div className="max-w-4xl mx-auto bg-slate-900 rounded-[3rem] p-12 lg:p-20 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                    <div className="relative z-10">
                        <h2 className="text-4xl lg:text-5xl font-black font-display text-white mb-8">Ready to modernize <br/> your workspace?</h2>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/register" className="btn btn-primary px-10 py-4 text-lg !bg-white !text-slate-900 hover:!bg-slate-100">Join RequestHub</Link>
                            <Link to="/login" className="btn btn-outline px-10 py-4 text-lg !bg-transparent !text-white !border-white/20 hover:!bg-white/10">Sign In</Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="py-12 border-t border-slate-100 text-center text-slate-400 text-sm font-medium">
                <div className="mb-6 flex items-center justify-center gap-2">
                    <div className="w-6 h-6 bg-slate-200 rounded flex items-center justify-center text-slate-500 text-[10px] font-black uppercase">R</div>
                    <p className="font-bold text-slate-800">RequestHub</p>
                </div>
                &copy; {new Date().getFullYear()} RequestHub. All rights reserved. Built for Excellence.
            </footer>
        </div>
    );
};

export default LandingPage;
