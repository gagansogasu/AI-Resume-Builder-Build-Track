import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { PenLine, Eye, ShieldCheck } from 'lucide-react';

const AppLayout = () => {
    return (
        <div className="flex flex-col min-h-screen bg-[#F7F6F3]">
            {/* Top Navigation */}
            <nav className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-50">
                <Link to="/" className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white font-serif font-bold text-lg">
                        R
                    </div>
                    <span className="font-serif font-bold text-gray-900 tracking-tight text-lg">AI Resume Builder</span>
                </Link>

                <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-100">
                    <NavLink
                        to="/builder"
                        className={({ isActive }) => `flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${isActive ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <PenLine size={16} /> Builder
                    </NavLink>
                    <NavLink
                        to="/preview"
                        className={({ isActive }) => `flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${isActive ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <Eye size={16} /> Preview
                    </NavLink>
                    <NavLink
                        to="/proof"
                        className={({ isActive }) => `flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${isActive ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <ShieldCheck size={16} /> Proof
                    </NavLink>
                </div>

                <div className="w-32 flex justify-end">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/5 px-2 py-1 rounded border border-primary/10">
                        Premium
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 flex flex-col">
                <Outlet />
            </main>
        </div>
    );
};

export default AppLayout;
