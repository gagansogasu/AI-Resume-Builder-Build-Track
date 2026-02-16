import React, { useEffect, useState, useMemo } from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, Printer, Clipboard, AlertCircle, Check, Globe, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ACTION_VERBS = ['Built', 'Developed', 'Designed', 'Implemented', 'Led', 'Improved', 'Created', 'Optimized', 'Automated', 'Managed', 'Analyzed', 'Coordinated', 'Executed'];

const THEME_COLORS = [
    { name: 'Teal', hsl: 'hsl(168, 60%, 40%)' },
    { name: 'Navy', hsl: 'hsl(220, 60%, 35%)' },
    { name: 'Burgundy', hsl: 'hsl(345, 60%, 35%)' },
    { name: 'Forest', hsl: 'hsl(150, 50%, 30%)' },
    { name: 'Charcoal', hsl: 'hsl(0, 0%, 25%)' }
];

const Preview = () => {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [template, setTemplate] = useState('Classic');
    const [accentColor, setAccentColor] = useState(THEME_COLORS[0].hsl);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const savedData = localStorage.getItem('resumeBuilderData');
        const savedTemplate = localStorage.getItem('resumeTemplate');
        const savedColor = localStorage.getItem('resumeAccentColor');

        if (savedData) {
            try { setData(JSON.parse(savedData)); } catch (e) { console.error(e); }
        }
        if (savedTemplate) setTemplate(savedTemplate);
        if (savedColor) setAccentColor(savedColor);
    }, []);

    const { score, suggestions } = useMemo(() => {
        if (!data) return { score: 0, suggestions: [] };
        let s = 0;
        const sugs = [];

        if (data.personalInfo.name.trim()) s += 10;
        else sugs.push("Add your name (+10)");

        if (data.personalInfo.email.trim()) s += 10;
        else sugs.push("Add an email (+10)");

        if (data.summary.trim().length > 50) s += 10;
        else sugs.push("Summary > 50 chars (+10)");

        if (data.experience.length >= 1 && data.experience.some(e => e.description.trim().length > 0)) s += 15;
        else sugs.push("Add detailed experience (+15)");

        if (data.education.some(e => e.school.trim())) s += 10;
        else sugs.push("Add education (+10)");

        const totalSkills = (data.skills.technical?.length || 0) + (data.skills.soft?.length || 0) + (data.skills.tools?.length || 0);
        if (totalSkills >= 5) s += 10;
        else sugs.push("Add at least 5 skills (+10)");

        if (data.projects?.length >= 1) s += 10;
        else sugs.push("Add at least 1 project (+10)");

        if (data.personalInfo.phone.trim()) s += 5;
        else sugs.push("Add phone number (+5)");

        if (data.links.linkedin.trim()) s += 5;
        else sugs.push("Add LinkedIn (+5)");

        if (data.links.github.trim()) s += 5;
        else sugs.push("Add GitHub (+5)");

        const hasVerbs = ACTION_VERBS.some(v => data.summary.toLowerCase().includes(v.toLowerCase()));
        if (hasVerbs) s += 10;
        else sugs.push("Add action verbs (+10)");

        return { score: Math.min(100, s), suggestions: sugs };
    }, [data]);

    const handlePrint = () => window.print();

    const handleCopy = () => {
        if (!data) return;
        const text = `${data.personalInfo.name}\n${data.personalInfo.email}\n\nSUMMARY\n${data.summary}\n\nEXPERIENCE\n${data.experience.map(e => `${e.role} @ ${e.company}\n${e.description}`).join('\n\n')}`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!data) return <div className="p-20 text-center">Loading...</div>;

    const scoreColor = score > 70 ? '#10b981' : score > 40 ? '#f59e0b' : '#ef4444';
    const scoreLabel = score > 70 ? 'Strong Resume' : score > 40 ? 'Getting There' : 'Needs Work';

    return (
        <div className="flex flex-1 bg-[#F7F6F3] overflow-y-auto px-12 py-10 relative">
            {/* Sidebar for Score & Stats */}
            <div className="w-[300px] shrink-0 space-y-8 no-print sticky top-10 h-fit">
                <button
                    onClick={() => navigate('/builder')}
                    className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors"
                >
                    <ChevronLeft size={14} /> Back to Editor
                </button>

                {/* Circular Score Meter */}
                <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex flex-col items-center gap-6 text-center">
                    <div className="relative w-32 h-32">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-gray-50" />
                            <circle
                                cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="10" fill="transparent"
                                strokeDasharray={364.4}
                                strokeDashoffset={364.4 - (364.4 * score) / 100}
                                strokeLinecap="round"
                                style={{ color: scoreColor, transition: 'stroke-dashoffset 1s ease-out' }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-serif font-bold text-gray-900 leading-none">{score}%</span>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: scoreColor }}>{scoreLabel}</div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ATS Readiness Score</p>
                    </div>

                    <div className="w-full pt-6 border-t border-gray-50 text-left space-y-4">
                        <h4 className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Improvements</h4>
                        {suggestions.length > 0 ? (
                            <div className="space-y-2">
                                {suggestions.slice(0, 4).map((s, i) => (
                                    <div key={i} className="flex items-start gap-2 text-[10px] font-medium text-gray-500 italic">
                                        <AlertCircle size={10} className="shrink-0 mt-0.5" /> {s}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-[10px] font-bold text-green-500 uppercase tracking-tighter">Maximum score reached! ✨</p>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <button onClick={handleCopy} className={`w-full py-4 rounded-3xl text-[10px] font-bold uppercase tracking-widest transition-all ${copied ? 'bg-green-600 text-white' : 'bg-white text-gray-900 border border-gray-200'}`}>
                        {copied ? 'Copied to Clipboard' : 'Copy as Text'}
                    </button>
                    <button onClick={handlePrint} className="w-full py-4 bg-gray-900 text-white rounded-3xl text-[10px] font-bold uppercase tracking-widest shadow-xl">
                        Print / Export PDF
                    </button>
                </div>
            </div>

            {/* Resume Preview */}
            <div className="flex-1 flex justify-center">
                <div
                    className={`resume-container bg-white aspect-[1/1.414] w-[210mm] shadow-2xl p-16 transition-all duration-700 relative overflow-hidden flex flex-col ${template === 'Classic' ? 'font-serif' : 'font-sans'}`}
                    style={{ borderTop: `6px solid ${accentColor}` }}
                >
                    <header className={`mb-12 ${template === 'Minimal' ? 'text-center' : ''}`}>
                        <h1 className="text-5xl font-serif font-bold tracking-tighter uppercase leading-none mb-6" style={{ color: accentColor }}>{data.personalInfo.name || 'Your Name'}</h1>
                        <div className={`flex flex-wrap gap-6 text-[10px] font-bold uppercase tracking-widest text-gray-400 ${template === 'Minimal' ? 'justify-center' : ''}`}>
                            {data.personalInfo.email} • {data.personalInfo.phone} • {data.personalInfo.location}
                        </div>
                    </header>

                    <div className="space-y-12 text-left">
                        {data.summary && (
                            <section className="space-y-3">
                                <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-300 border-b border-gray-50 pb-2">Mission</h2>
                                <p className="text-[13px] italic leading-relaxed text-gray-800">{data.summary}</p>
                            </section>
                        )}

                        <section className="space-y-6">
                            <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-300 border-b border-gray-50 pb-2">Background</h2>
                            <div className="space-y-8">
                                {data.experience.map((exp, i) => exp.company && (
                                    <div key={i} className="space-y-1">
                                        <div className="flex justify-between font-bold uppercase text-[12px]">
                                            <span>{exp.role} @ {exp.company}</span>
                                            <span className="text-[10px] opacity-40">{exp.period}</span>
                                        </div>
                                        <p className="text-[12px] opacity-70 italic leading-relaxed">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <div className="grid grid-cols-2 gap-10">
                            <section className="space-y-4">
                                <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-300 border-b border-gray-50 pb-2">Education</h2>
                                {data.education.map((edu, i) => edu.school && (
                                    <div key={i} className="text-[11px] font-bold leading-tight">
                                        <div className="uppercase">{edu.school}</div>
                                        <div className="opacity-40">{edu.degree} — {edu.year}</div>
                                    </div>
                                ))}
                            </section>
                            <section className="space-y-4">
                                <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-300 border-b border-gray-50 pb-2">Expertise</h2>
                                <div className="flex flex-wrap gap-2">
                                    {Object.values(data.skills).flat().map((s, i) => (
                                        <span key={i} className="text-[9px] font-medium px-2 py-0.5 bg-gray-50 border border-gray-100 rounded uppercase tracking-tighter">{s}</span>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </div>

                    <footer className="mt-auto pt-10 text-center no-print">
                        <p className="text-[8px] font-bold uppercase tracking-[0.5em] text-gray-200">KodNest Premium Artifact</p>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default Preview;
