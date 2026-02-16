import React from 'react';
import { Circle, CheckCircle2 } from 'lucide-react';

const TopBar = ({ currentStep }) => {
    return (
        <header className="h-16 border-b border-gray-100 bg-white flex items-center justify-between px-8 z-10 shrink-0">
            {/* Left */}
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-serif font-bold text-lg">
                    R
                </div>
                <div className="font-serif font-bold text-gray-900 tracking-tight">AI Resume Builder</div>
            </div>

            {/* Center */}
            <div className="text-sm font-semibold text-gray-500 bg-gray-50 px-4 py-1.5 rounded-full border border-gray-100">
                Project 3 — <span className="text-primary">Step {currentStep || 'X'} of 8</span>
            </div>

            {/* Right */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 border border-green-100 rounded text-[10px] font-bold uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    Live Development
                </div>
            </div>
        </header>
    );
};

export default TopBar;
