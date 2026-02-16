import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, Globe, Github, Zap, Copy, Check } from 'lucide-react';

const RBProof = () => {
    const [status, setStatus] = useState([]);
    const [links, setLinks] = useState({
        lovable: '',
        github: '',
        deploy: ''
    });
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const stepStatus = [];
        for (let i = 1; i <= 8; i++) {
            const artifact = localStorage.getItem(`rb_step_${i}_artifact`);
            stepStatus.push({
                id: i,
                label: getStepTitle(i),
                completed: !!artifact
            });
        }
        setStatus(stepStatus);

        const savedLinks = JSON.parse(localStorage.getItem('rb_final_links') || '{}');
        setLinks(prev => ({ ...prev, ...savedLinks }));
    }, []);

    const handleLinkChange = (key, value) => {
        const newLinks = { ...links, [key]: value };
        setLinks(newLinks);
        localStorage.setItem('rb_final_links', JSON.stringify(newLinks));
    };

    const handleCopySubmission = () => {
        const submission = {
            project: "AI Resume Builder",
            steps: status,
            links: links,
            timestamp: new Date().toISOString()
        };
        navigator.clipboard.writeText(JSON.stringify(submission, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const allStepsDone = status.length > 0 && status.every(s => s.completed);

    return (
        <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-700">
            <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500 border border-green-100">
                    <ShieldCheck size={32} />
                </div>
                <h1 className="text-4xl font-serif font-bold text-gray-900 tracking-tight">Proof of Work</h1>
                <p className="text-gray-500 max-w-xl mx-auto">Verify your progress and generate your final submission payload for the AI Resume Builder project.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Step Progress */}
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                    <h2 className="text-xl font-bold text-gray-900 border-b border-gray-50 pb-4 flex items-center gap-2">
                        <CheckCircle2 size={20} className="text-primary" />
                        Milestone Status
                    </h2>
                    <div className="grid grid-cols-1 gap-3">
                        {status.map((step) => (
                            <div key={step.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-50 bg-gray-50/30">
                                <div className="flex items-center gap-3">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${step.completed ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                        {step.completed ? <Check size={14} /> : step.id}
                                    </div>
                                    <span className={`text-sm font-semibold ${step.completed ? 'text-gray-900' : 'text-gray-400'}`}>{step.label}</span>
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-widest ${step.completed ? 'text-green-600' : 'text-gray-400'}`}>
                                    {step.completed ? 'Completed' : 'Pending'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Final Links */}
                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-50 pb-4 flex items-center gap-2">
                            <Globe size={20} className="text-primary" />
                            Final Delivery
                        </h2>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                    <Zap size={14} className="text-amber-500" /> Lovable Link
                                </label>
                                <input
                                    type="url"
                                    value={links.lovable}
                                    onChange={(e) => handleLinkChange('lovable', e.target.value)}
                                    placeholder="https://lovable.dev/projects/..."
                                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:ring-1 focus:ring-primary outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                    <Github size={14} className="text-gray-900" /> GitHub Repo
                                </label>
                                <input
                                    type="url"
                                    value={links.github}
                                    onChange={(e) => handleLinkChange('github', e.target.value)}
                                    placeholder="https://github.com/username/repo"
                                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:ring-1 focus:ring-primary outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                    <Globe size={14} className="text-blue-500" /> Live Deployment
                                </label>
                                <input
                                    type="url"
                                    value={links.deploy}
                                    onChange={(e) => handleLinkChange('deploy', e.target.value)}
                                    placeholder="https://my-resume-builder.vercel.app"
                                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:ring-1 focus:ring-primary outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleCopySubmission}
                        disabled={!allStepsDone}
                        className={`w-full py-5 rounded-3xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${allStepsDone
                            ? 'bg-primary text-white shadow-xl shadow-primary/20 hover:-translate-y-1 active:scale-95'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                    >
                        {copied ? <Check size={20} /> : <Copy size={20} />}
                        {copied ? 'Copied to Clipboard!' : 'Copy Final Submission'}
                    </button>
                    {!allStepsDone && (
                        <p className="text-center text-xs text-amber-600 font-medium">Complete all 8 milestones to enable final submission.</p>
                    )}
                </div>
            </div>
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
    return titles[step] || 'Milestone';
};

export default RBProof;
