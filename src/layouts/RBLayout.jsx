import React from 'react';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import TopBar from '../components/TopBar';
import BuildPanel from '../components/BuildPanel';

const RBLayout = () => {
    const { stepId } = useParams();
    const location = useLocation();
    const isProofPage = location.pathname.includes('/rb/proof');

    // Extract step number from path (e.g., /rb/01-problem -> 1)
    const stepMatch = location.pathname.match(/\/rb\/(\d+)-/);
    const currentStep = stepMatch ? parseInt(stepMatch[1]) : (isProofPage ? 8 : 0);

    return (
        <div className="flex flex-col h-screen bg-[#F7F6F3] overflow-hidden">
            {/* Top Bar */}
            <TopBar currentStep={currentStep} />

            {/* Main Content Area */}
            <div className="flex flex-1 overflow-hidden">
                {/* Workspace (70%) */}
                <main className={`${isProofPage ? 'w-full' : 'w-[70%]'} flex flex-col overflow-y-auto`}>
                    {/* Context Header */}
                    {!isProofPage && (
                        <div className="p-8 pb-4 bg-white border-b border-gray-100">
                            <h2 className="text-2xl font-serif font-bold text-gray-900">
                                {currentStep}. {getStepTitle(currentStep)}
                            </h2>
                            <p className="text-gray-500 text-sm mt-1">Implement the core requirements for this milestone.</p>
                        </div>
                    )}

                    <div className="p-8 flex-1">
                        <Outlet />
                    </div>
                </main>

                {/* Build Panel (30%) */}
                {!isProofPage && (
                    <aside className="w-[30%] border-l border-gray-100 bg-white flex flex-col">
                        <BuildPanel currentStep={currentStep} />
                    </aside>
                )}
            </div>

            {/* Proof Footer - Only visible on steps 1-8? Or maybe just status? */}
            {!isProofPage && (
                <footer className="h-12 border-t border-gray-100 bg-white flex items-center justify-between px-8 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    <div>AI Resume Builder Beta</div>
                    <div className="flex gap-4">
                        <span>Final Submission locked</span>
                    </div>
                </footer>
            )}
        </div>
    );
};

const getStepTitle = (step) => {
    const titles = {
        1: 'Problem Statement',
        2: 'Market Analysis',
        3: 'Architecture Design',
        4: 'High Level Design',
        5: 'Low Level Design',
        6: 'Core Build',
        7: 'Test Protocol',
        8: 'Shipping',
    };
    return titles[step] || 'Project Milestone';
};

export default RBLayout;
