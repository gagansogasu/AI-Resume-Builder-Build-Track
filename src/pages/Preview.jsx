import React, { useEffect, useState } from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, ExternalLink, Printer, Clipboard, AlertTriangle, Check, Globe } from 'lucide-react';

const Preview = () => {
    const [data, setData] = useState(null);
    const [template, setTemplate] = useState('Classic');
    const [copied, setCopied] = useState(false);
    const [warnings, setWarnings] = useState([]);

    useEffect(() => {
        const savedData = localStorage.getItem('resumeBuilderData');
        const savedTemplate = localStorage.getItem('resumeTemplate');
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                // Ensure new data structure safety
                if (!parsed.skills || typeof parsed.skills === 'string') parsed.skills = { technical: [], soft: [], tools: [] };
                setData(parsed);
                validateData(parsed);
            } catch (e) { console.error(e); }
        }
        if (savedTemplate) setTemplate(savedTemplate);
    }, []);

    const validateData = (resumeData) => {
        const issues = [];
        if (!resumeData.personalInfo.name.trim()) issues.push("Name is missing.");
        const hasWork = resumeData.experience.some(e => e.company.trim());
        const hasProject = resumeData.projects.some(p => p.title.trim());
        if (!hasWork && !hasProject) issues.push("At least one project or experience entry is needed.");
        setWarnings(issues);
    };

    const handlePrint = () => {
        window.print();
    };

    const copyAsText = () => {
        if (!data) return;
        const { personalInfo, summary, education, experience, projects, skills, links } = data;

        let text = `${personalInfo.name || 'NAME'}\n`;
        text += `${personalInfo.email} | ${personalInfo.phone} | ${personalInfo.location}\n\n`;

        if (summary) text += `SUMMARY\n${summary}\n\n`;

        if (experience.some(e => e.company)) {
            text += `EXPERIENCE\n`;
            experience.map(exp => {
                if (exp.company) text += `${exp.role} @ ${exp.company} (${exp.period})\n${exp.description}\n\n`;
            });
        }

        if (projects.some(p => p.title)) {
            text += `PROJECTS\n`;
            projects.map(p => {
                if (p.title) {
                    text += `${p.title}\n${p.description}\n`;
                    if (p.techStack && p.techStack.length > 0) text += `Tech: ${p.techStack.join(', ')}\n`;
                    if (p.liveUrl) text += `Live: ${p.liveUrl}\n`;
                    if (p.githubUrl) text += `GitHub: ${p.githubUrl}\n`;
                    text += `\n`;
                }
            });
        }

        if (Object.values(skills).some(s => s.length > 0)) {
            text += `SKILLS\n`;
            Object.entries(skills).forEach(([cat, s]) => {
                if (s.length > 0) text += `${cat.toUpperCase()}: ${s.join(', ')}\n`;
            });
            text += `\n`;
        }

        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!data) return (
        <div className="flex-1 flex items-center justify-center p-20 text-center">
            <div className="space-y-4 max-w-sm">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300"><Mail size={32} /></div>
                <h2 className="text-2xl font-serif font-bold text-gray-900">Start Your Story</h2>
                <p className="text-sm text-gray-500 font-medium">Head over to the Builder section to craft your professional resume. Your progress will appear here automatically.</p>
            </div>
        </div>
    );

    const { personalInfo, summary, education, experience, projects, skills, links } = data;

    return (
        <div className="flex-1 bg-[#F7F6F3] overflow-y-auto py-12 px-8">
            <div className="max-w-[1200px] mx-auto mb-8 flex flex-col gap-6 no-print">
                <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                        {['Classic', 'Modern', 'Minimal'].map(t => (
                            <button
                                key={t}
                                onClick={() => {
                                    setTemplate(t);
                                    localStorage.setItem('resumeTemplate', t);
                                }}
                                className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${template === t ? 'bg-gray-900 text-white shadow-xl' : 'bg-white text-gray-400 hover:text-gray-600 border border-gray-100'}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-3">
                        <button onClick={copyAsText} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${copied ? 'bg-green-600 text-white' : 'bg-white text-gray-700 border border-gray-100'}`}>
                            {copied ? <Check size={14} /> : <Clipboard size={14} />} {copied ? 'Copied' : 'Copy as Text'}
                        </button>
                        <button onClick={handlePrint} className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-xl">
                            <Printer size={14} /> Print / Save PDF
                        </button>
                    </div>
                </div>

                {warnings.length > 0 && (
                    <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-start gap-4">
                        <AlertTriangle size={18} className="text-amber-500 shrink-0" />
                        <div>
                            <p className="text-xs font-bold text-amber-900 uppercase tracking-widest mb-1">Incomplete Resume Warning</p>
                            {warnings.map((w, idx) => <p key={idx} className="text-xs text-amber-700 font-medium opacity-80">• {w}</p>)}
                        </div>
                    </div>
                )}
            </div>

            <div className={`resume-container max-w-[210mm] mx-auto bg-white p-[25mm] shadow-2xl min-h-[297mm] font-sans text-gray-950 leading-[1.6] ${template === 'Minimal' ? 'text-center' : ''}`}>
                <header className={`mb-12 ${template === 'Classic' ? 'text-center border-b-2 border-black pb-8' : template === 'Modern' ? 'border-l-[16px] border-black pl-8 py-4' : 'border-b border-gray-50 pb-8'}`}>
                    <h1 className="text-5xl font-serif font-bold tracking-tight uppercase leading-none mb-4">{personalInfo.name || 'Your Name'}</h1>
                    <div className={`flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-500 ${template === 'Minimal' || template === 'Classic' ? 'justify-center' : ''}`}>
                        {personalInfo.email} • {personalInfo.phone} • {personalInfo.location}
                    </div>
                </header>

                <div className="space-y-12 text-left">
                    {summary && (
                        <section className="space-y-3">
                            <h2 className={`text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 border-b border-gray-100 pb-2 ${template === 'Minimal' ? 'text-center' : ''}`}>Professional Summary</h2>
                            <p className={`text-[13px] italic leading-relaxed text-gray-800 ${template === 'Minimal' ? 'text-center' : ''}`}>{summary}</p>
                        </section>
                    )}

                    {experience.some(e => e.company.trim()) && (
                        <section className="space-y-6">
                            <h2 className={`text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 border-b border-gray-100 pb-2 ${template === 'Minimal' ? 'text-center' : ''}`}>Experience</h2>
                            {experience.map((exp, i) => exp.company.trim() && (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between items-baseline font-bold uppercase text-[13px]">
                                        <span>{exp.role}</span>
                                        <span className="text-[10px] text-gray-400">{exp.period}</span>
                                    </div>
                                    <div className="text-[11px] italic font-bold text-gray-600 uppercase tracking-wide">{exp.company}</div>
                                    <p className="text-[12px] text-gray-700 leading-relaxed whitespace-pre-line">{exp.description}</p>
                                </div>
                            ))}
                        </section>
                    )}

                    {projects.some(p => p.title.trim()) && (
                        <section className="space-y-6">
                            <h2 className={`text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 border-b border-gray-100 pb-2 ${template === 'Minimal' ? 'text-center' : ''}`}>Selected Projects</h2>
                            <div className="grid grid-cols-1 gap-6">
                                {projects.map((proj, i) => proj.title.trim() && (
                                    <div key={i} className="p-4 bg-gray-50/50 border border-gray-100 rounded-lg space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold uppercase text-[13px] tracking-tight">{proj.title}</span>
                                            <div className="flex gap-2">
                                                {proj.githubUrl && <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="no-print"><Github size={12} className="text-gray-400 hover:text-black transition-colors" /></a>}
                                                {proj.liveUrl && <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="no-print"><Globe size={12} className="text-gray-400 hover:text-black transition-colors" /></a>}
                                            </div>
                                        </div>
                                        <p className="text-[12px] text-gray-700 italic leading-relaxed">{proj.description}</p>
                                        <div className="flex flex-wrap gap-1.5 pt-1">
                                            {proj.techStack?.map((tech, idx) => (
                                                <span key={idx} className="text-[9px] font-bold px-2 py-0.5 bg-white border border-gray-100 text-primary uppercase tracking-tighter">#{tech}</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    <div className="grid grid-cols-12 gap-12">
                        <div className="col-span-12 md:col-span-12">
                            {Object.values(skills).some(s => s.length > 0) && (
                                <section className="space-y-6">
                                    <h2 className={`text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 border-b border-gray-100 pb-2 ${template === 'Minimal' ? 'text-center' : ''}`}>Expertise Matrix</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        {Object.entries(skills).map(([cat, list]) => list.length > 0 && (
                                            <div key={cat} className="space-y-3">
                                                <h4 className="text-[9px] font-bold uppercase tracking-widest text-primary/60">{cat.replace(/([A-Z])/g, ' $1')}</h4>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {list.map((s, idx) => (
                                                        <span key={idx} className="text-[10px] font-bold px-2 py-0.5 bg-gray-50 border border-gray-100 uppercase tracking-tighter text-gray-800 transition-all hover:bg-white">
                                                            {s}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                    </div>
                </div>

                <footer className="mt-auto pt-10 border-t border-gray-50 text-[9px] text-center font-bold uppercase tracking-[0.3em] text-gray-300 no-print">
                    System generated via KodNest Premium AI Resume Builder
                </footer>
            </div>
        </div>
    );
};

export default Preview;
