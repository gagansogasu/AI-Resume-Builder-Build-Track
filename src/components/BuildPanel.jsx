import React, { useState, useEffect } from 'react';
import { Copy, ExternalLink, Check, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BuildPanel = ({ currentStep }) => {
    const navigate = useNavigate();
    const [copied, setCopied] = useState(false);
    const [artifact, setArtifact] = useState('');
    const [status, setStatus] = useState(null); // 'worked', 'error', 'screenshot'

    useEffect(() => {
        const saved = localStorage.getItem(`rb_step_${currentStep}_artifact`);
        if (saved) {
            setArtifact(saved);
        } else {
            setArtifact('');
        }

        const savedStatus = localStorage.getItem(`rb_step_${currentStep}_status`);
        setStatus(savedStatus);
    }, [currentStep]);

    const handleCopy = () => {
        navigator.clipboard.writeText(getPromptForStep(currentStep));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleStatus = (type) => {
        setStatus(type);
        localStorage.setItem(`rb_step_${currentStep}_status`, type);

        // Simulating artifact upload for now if it's "worked" or "screenshot"
        if (type === 'worked' || type === 'screenshot') {
            const mockArtifact = `https://lovable.dev/projects/rb-step-${currentStep}`;
            setArtifact(mockArtifact);
            localStorage.setItem(`rb_step_${currentStep}_artifact`, mockArtifact);
        }
    };

    const handleNext = () => {
        if (currentStep < 8) {
            const nextStep = String(currentStep + 1).padStart(2, '0');
            const nextPath = getPathForStep(currentStep + 1);
            navigate(nextPath);
        } else {
            navigate('/rb/proof');
        }
    };

    return (
        <div className="flex flex-col h-full p-6 space-y-6 overflow-y-auto">
            <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Prompt Engineer</h3>
                <div className="relative group">
                    <textarea
                        readOnly
                        value={getPromptForStep(currentStep)}
                        className="w-full h-48 p-4 text-sm font-mono bg-gray-50 border border-gray-100 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none resize-none"
                    />
                    <button
                        onClick={handleCopy}
                        className="absolute top-3 right-3 p-2 bg-white border border-gray-100 rounded-md shadow-sm hover:bg-gray-50 transition-colors text-gray-500"
                        title="Copy to clipboard"
                    >
                        {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                    </button>
                </div>
            </div>

            <a
                href="https://lovable.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-white rounded-lg font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
            >
                Build in Lovable <ExternalLink size={16} />
            </a>

            <div className="pt-6 border-t border-gray-100">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Build Status</h3>
                <div className="grid grid-cols-1 gap-2">
                    <button
                        onClick={() => handleStatus('worked')}
                        className={`flex items-center gap-3 px-4 py-3 border rounded-lg text-sm font-semibold transition-all ${status === 'worked' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-gray-100 text-gray-600 hover:border-gray-200'}`}
                    >
                        <Check size={18} className={status === 'worked' ? 'text-green-500' : 'text-gray-300'} />
                        It Worked
                    </button>
                    <button
                        onClick={() => handleStatus('error')}
                        className={`flex items-center gap-3 px-4 py-3 border rounded-lg text-sm font-semibold transition-all ${status === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-white border-gray-100 text-gray-600 hover:border-gray-200'}`}
                    >
                        <AlertCircle size={18} className={status === 'error' ? 'text-red-500' : 'text-gray-300'} />
                        Encountered Error
                    </button>
                    <button
                        onClick={() => handleStatus('screenshot')}
                        className={`flex items-center gap-3 px-4 py-3 border rounded-lg text-sm font-semibold transition-all ${status === 'screenshot' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-100 text-gray-600 hover:border-gray-200'}`}
                    >
                        <ImageIcon size={18} className={status === 'screenshot' ? 'text-blue-500' : 'text-gray-300'} />
                        Add Screenshot
                    </button>
                </div>
            </div>

            <div className="flex-1" />

            <button
                disabled={!artifact}
                onClick={handleNext}
                className={`w-full py-4 rounded-xl font-bold text-base transition-all ${artifact
                    ? 'bg-gray-900 text-white shadow-xl hover:-translate-y-0.5 active:translate-y-0'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
            >
                {currentStep === 8 ? 'View Final Proof' : 'Next Milestone'}
            </button>
        </div>
    );
};

const getPromptForStep = (step) => {
    const prompts = {
        1: "Analyze the core problems in current resume building processes. Focus on ATS compatibility, AI-driven content generation, and layout design. Create a structured problem statement document.",
        2: "Research the current market for AI Resume Builders. List top 5 competitors, their pricing models, and key features. Identify a unique value proposition for our 'AI Resume Builder'.",
        3: "Design the high-level architecture. We need a frontend (React), a backend (Node.js/Python), and an AI Engine (OpenAI/Gemini). Draw a block diagram of data flow.",
        4: "Create High Level Design (HLD). Detail the component structure, routing, and state management strategy. Define the visual theme and layout system.",
        5: "Define Low Level Design (LLD). Map out individual component props, local state, and API endpoints. Detail the database schema for resumes and users.",
        6: "Start the core build. Implement the routing system, layout shell, and basic navigation as specified in the PRD.",
        7: "Implement a test checklist. Ensure all routes work, artifacts are stored correctly, and the gating system prevents skipping steps.",
        8: "Prepare for shipping. Finalize the deployment configuration, environment variables, and repository structure. Generate the final proof of work.",
    };
    return prompts[step] || "Continue building the AI Resume Builder project...";
};

const getPathForStep = (step) => {
    const paths = {
        1: '/rb/01-problem',
        2: '/rb/02-market',
        3: '/rb/03-architecture',
        4: '/rb/04-hld',
        5: '/rb/05-lld',
        6: '/rb/06-build',
        7: '/rb/07-test',
        8: '/rb/08-ship',
    };
    return paths[step];
};

export default BuildPanel;
