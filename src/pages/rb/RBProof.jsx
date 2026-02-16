import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, Globe, Github, Zap, Copy, Check, Rocket, AlertTriangle, ExternalLink } from 'lucide-react';

const RBProof = () => {
    const [status, setStatus] = useState([]);
    const [links, setLinks] = useState({
        lovable: '',
        github: '',
        deploy: ''
    });
    const [checklistPassed, setChecklistPassed] = useState(false);
    const [shipped, setShipped] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        // 1. Get Step Status
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

        // 2. Get Checklist Status
        const savedChecklist = JSON.parse(localStorage.getItem('rb_test_checklist') || '{}');
        const testsPassed = Object.keys(savedChecklist).length === 10 && Object.values(savedChecklist).every(v => v);
        setChecklistPassed(testsPassed);

        // 3. Get Proof Links
        const savedSubmission = JSON.parse(localStorage.getItem('rb_final_submission') || '{}');
        setLinks(prev => ({ ...prev, ...savedSubmission }));
    }, []);

    useEffect(() => {
        const allStepsArr = status.length > 0 && status.every(s => s.completed);
        const linksDone = !!(links.lovable && links.github && links.deploy);

        if (allStepsArr && checklistPassed && linksDone) {
            setShipped(true);
        } else {
            setShipped(false);
        }
    }, [status, checklistPassed, links]);

    const handleLinkChange = (key, value) => {
        const newLinks = { ...links, [key]: value };
        setLinks(newLinks);
        localStorage.setItem('rb_final_submission', JSON.stringify(newLinks));
    };

    const handleCopySubmission = () => {
        const text = `------------------------------------------
AI Resume Builder — Final Submission

Lovable Project: ${links.lovable}
GitHub Repository: ${links.github}
Live Deployment: ${links.deploy}

Core Capabilities:
- Structured resume builder
- Deterministic ATS scoring
- Template switching
- PDF export with clean formatting
- Persistence + validation checklist
------------------------------------------`;

        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
            <div className="text-center space-y-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto border transition-all duration-1000 ${shipped ? 'bg-green-500 text-white border-green-400 scale-110 shadow-xl shadow-green-100' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
                    {shipped ? <Rocket size={32} /> : <ShieldCheck size={32} />}
                </div>
                <h1 className="text-4xl font-serif font-bold text-gray-900 tracking-tight">Final Dispatch</h1>
                <p className="text-gray-500 max-w-xl mx-auto italic font-medium">Verify your build integrity and certify your AI Resume Builder project for submission.</p>

                <div className="flex justify-center pt-2">
                    <span className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-700 ${shipped ? 'bg-green-100 text-green-700 ring-4 ring-green-50' : 'bg-gray-100 text-gray-500'}`}>
                        Status: {shipped ? 'Shipped' : 'In Progress'}
                    </span>
                </div>
            </div>

            {shipped && (
                <div className="bg-white border-2 border-green-100 p-8 rounded-[40px] text-center space-y-2 animate-in zoom-in-95 duration-700 shadow-2xl shadow-green-50/50">
                    <CheckCircle2 size={40} className="text-green-500 mx-auto mb-2" />
                    <h2 className="text-2xl font-serif font-bold text-gray-900">Project 3 Shipped Successfully.</h2>
                    <p className="text-sm text-gray-400 font-medium">Your build artifacts are verified and ready for external review.</p>
                </div>
            )}

            <div className={`grid md:grid-cols-2 gap-10 transition-opacity duration-700 ${shipped ? 'opacity-100' : 'opacity-100'}`}>
                {/* A) Step Completion Overview */}
                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
                        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-primary" />
                            Build Track Integrity
                        </h2>
                        <div className="grid grid-cols-1 gap-2">
                            {status.map((step) => (
                                <div key={step.id} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${step.completed ? 'bg-gray-50/50 border-gray-100' : 'bg-white border-gray-50 opacity-50'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${step.completed ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                            {step.completed ? <Check size={14} /> : step.id}
                                        </div>
                                        <span className="text-xs font-bold text-gray-700">{step.label}</span>
                                    </div>
                                    <span className={`text-[9px] font-black uppercase tracking-widest ${step.completed ? 'text-green-600' : 'text-gray-300'}`}>
                                        {step.completed ? 'Verified' : 'Pending'}
                                    </span>
                                </div>
                            ))}
                            {/* Checklist Status */}
                            <div className={`flex items-center justify-between p-4 rounded-2xl border transition-all mt-4 ${checklistPassed ? 'bg-primary/5 border-primary/10' : 'bg-white border-gray-50 opacity-50'}`}>
                                <div className="flex items-center gap-3">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${checklistPassed ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
                                        <Zap size={12} />
                                    </div>
                                    <span className="text-xs font-bold text-gray-700">QA Test Checklist (10 Items)</span>
                                </div>
                                <span className={`text-[9px] font-black uppercase tracking-widest ${checklistPassed ? 'text-primary' : 'text-gray-300'}`}>
                                    {checklistPassed ? 'All Passed' : 'Incomplete'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* B) Artifact Collection */}
                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-8">
                        <div>
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6 font-bold flex items-center gap-2">
                                <Globe size={16} className="text-gray-900" />
                                Deployment Proofs
                            </h2>
                            <div className="space-y-6">
                                <InputField
                                    icon={<Zap size={14} className="text-amber-500" />}
                                    label="Lovable Project Link"
                                    value={links.lovable}
                                    onChange={(v) => handleLinkChange('lovable', v)}
                                    placeholder="https://lovable.dev/projects/..."
                                />
                                <InputField
                                    icon={<Github size={14} className="text-gray-900" />}
                                    label="GitHub Repository"
                                    value={links.github}
                                    onChange={(v) => handleLinkChange('github', v)}
                                    placeholder="https://github.com/username/repo"
                                />
                                <InputField
                                    icon={<ExternalLink size={14} className="text-blue-500" />}
                                    label="Live Deployment URL"
                                    value={links.deploy}
                                    onChange={(v) => handleLinkChange('deploy', v)}
                                    placeholder="https://resume-builder-v1.vercel.app"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleCopySubmission}
                        disabled={!shipped}
                        className={`w-full py-5 rounded-[24px] font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-3 transition-all ${shipped
                            ? 'bg-gray-900 text-white shadow-2xl hover:bg-black active:scale-[0.98]'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                    >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                        {copied ? 'Payload Copied' : 'Copy Final Submission'}
                    </button>

                    {!shipped && (
                        <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-3">
                            <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                            <p className="text-[10px] font-bold text-amber-700 uppercase tracking-widest leading-relaxed">
                                Shipping is locked. You must verify all 8 steps, pass the 10-point QA checklist, and provide all 3 deployment links.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const InputField = ({ icon, label, value, onChange, placeholder }) => (
    <div className="space-y-2">
        <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2 ml-1">
            {icon} {label}
        </label>
        <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-medium focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-gray-50 outline-none transition-all"
        />
    </div>
);

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
