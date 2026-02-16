import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

const Home = () => {
    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    <Sparkles size={14} className="text-primary" />
                    AI-Powered Career Growth
                </div>

                <h1 className="text-7xl md:text-8xl font-serif font-bold text-gray-900 tracking-tight leading-[1.1]">
                    Build a Resume That <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600 italic">Gets Read.</span>
                </h1>

                <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
                    Designed for modern applicants. Leverage AI to structure your experience and land your dream role with a premium, focused layout.
                </p>

                <div className="pt-8">
                    <Link
                        to="/builder"
                        className="group inline-flex items-center gap-3 px-10 py-5 bg-gray-900 text-white rounded-2xl font-bold text-lg shadow-2xl shadow-gray-200 hover:bg-gray-800 transition-all hover:scale-105 active:scale-95"
                    >
                        Start Building <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="pt-16 grid grid-cols-3 gap-8 border-t border-gray-50 opacity-60">
                    <div>
                        <div className="text-2xl font-serif font-bold text-gray-900">ATS Optimized</div>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Structure first</p>
                    </div>
                    <div>
                        <div className="text-2xl font-serif font-bold text-gray-900">AI Assisted</div>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Smart suggestions</p>
                    </div>
                    <div>
                        <div className="text-2xl font-serif font-bold text-gray-900">Minimalist</div>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Focused design</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
