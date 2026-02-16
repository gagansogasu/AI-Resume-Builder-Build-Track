import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Trash2, Database, Save, CheckCircle2, Zap, AlertCircle, Mail, Phone, MapPin, Github, Linkedin, ExternalLink, Layout, Sparkles } from 'lucide-react';

const ACTION_VERBS = ['Built', 'Developed', 'Designed', 'Implemented', 'Led', 'Improved', 'Created', 'Optimized', 'Automated', 'Managed', 'Analyzed', 'Coordinated', 'Executed'];

const Builder = () => {
    const defaultData = {
        personalInfo: { name: '', email: '', phone: '', location: '' },
        summary: '',
        education: [{ school: '', degree: '', year: '' }],
        experience: [{ company: '', role: '', period: '', description: '' }],
        projects: [{ title: '', link: '', description: '' }],
        skills: '',
        links: { github: '', linkedin: '' }
    };

    const [formData, setFormData] = useState(defaultData);
    const [template, setTemplate] = useState('Classic'); // Classic, Modern, Minimal
    const [isSaved, setIsSaved] = useState(false);

    // 1) Auto-load and Auto-save
    useEffect(() => {
        const saved = localStorage.getItem('resumeBuilderData');
        if (saved) {
            try {
                setFormData(JSON.parse(saved));
            } catch (e) { console.error(e); }
        }
        const savedTemplate = localStorage.getItem('resumeTemplate');
        if (savedTemplate) setTemplate(savedTemplate);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            localStorage.setItem('resumeBuilderData', JSON.stringify(formData));
            localStorage.setItem('resumeTemplate', template);
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 2000);
        }, 1000);
        return () => clearTimeout(timer);
    }, [formData, template]);

    const handleInputChange = (section, field, value, index = null) => {
        setFormData(prev => {
            const newData = JSON.parse(JSON.stringify(prev));
            if (index !== null) {
                newData[section][index][field] = value;
            } else if (typeof field === 'string') {
                if (section === 'personalInfo' || section === 'links') {
                    newData[section][field] = value;
                } else {
                    newData[section] = value;
                }
            } else {
                newData[section] = value;
            }
            return newData;
        });
    };

    const addItem = (section) => {
        const itemTemplates = {
            education: { school: '', degree: '', year: '' },
            experience: { company: '', role: '', period: '', description: '' },
            projects: { title: '', link: '', description: '' }
        };
        setFormData(prev => ({ ...prev, [section]: [...prev[section], itemTemplates[section]] }));
    };

    const removeItem = (section, index) => {
        setFormData(prev => ({ ...prev, [section]: prev[section].filter((_, i) => i !== index) }));
    };

    // 2) Bullet Discipline Logic
    const validateBullet = (text) => {
        if (!text.trim()) return [];
        const tips = [];
        const startsWithVerb = ACTION_VERBS.some(v => text.trim().toLowerCase().startsWith(v.toLowerCase()));
        if (!startsWithVerb) tips.push("Start with a strong action verb.");
        const hasNumbers = /[0-9](%|k|X|x|%|\s?percent)/i.test(text) || /[0-9]+/.test(text);
        if (!hasNumbers) tips.push("Add measurable impact (numbers).");
        return tips;
    };

    const loadSampleData = () => {
        setFormData({
            personalInfo: { name: 'Gagan Sogasu', email: 'gagan@example.com', phone: '+91 98765 43210', location: 'Bengaluru, India' },
            summary: 'Developed premium web applications and AI-driven systems. Expert in React and modern CSS architectures, helping businesses scale their digital products with 25% better performance.',
            education: [{ school: 'KodNest Institute', degree: 'Full Stack Development', year: '2024' }],
            experience: [{ company: 'TechFlow Solutions', role: 'Frontend Developer', period: '2023 - Present', description: 'Implemented the AI-powered builder rail and premium design systems for over 10k monthly users.' }],
            projects: [
                { title: 'Placement Readiness Platform', link: 'https://github.com/prp', description: 'Built a comprehensive system for tracking student preparation and interview readiness with 95% accuracy.' },
                { title: 'AI Portfolio Builder', link: 'https://github.com/portfolio-ai', description: 'Automated portfolio generation tool using LLMs.' }
            ],
            skills: 'React, Node.js, Tailwind CSS, Python, Git, UI/UX Design, TypeScript, AWS, Docker',
            links: { github: 'https://github.com/gagansogasu', linkedin: 'https://linkedin.com/in/gagansogasu' }
        });
    };

    // 3) ATS Score & Improvement Panel
    const { score, currentImprovements } = useMemo(() => {
        let currentScore = 0;
        const improvements = [];

        const wordCount = formData.summary.trim() ? formData.summary.trim().split(/\s+/).length : 0;
        if (wordCount >= 40 && wordCount <= 120) currentScore += 15;
        else if (wordCount < 40 && wordCount > 0) improvements.push({ id: 'summary', text: "Expand your summary to 40-120 words." });
        else if (wordCount === 0) improvements.push({ id: 'summary', text: "Write a professional summary." });

        const projectCount = formData.projects.filter(p => p.title.trim()).length;
        if (projectCount >= 2) currentScore += 10;
        else improvements.push({ id: 'projects', text: "Add at least 2 key projects." });

        const expCount = formData.experience.filter(e => e.company.trim()).length;
        if (expCount >= 1) currentScore += 10;
        else improvements.push({ id: 'exp', text: "Add work experience or internships." });

        const skillsList = formData.skills.split(',').filter(s => s.trim().length > 0);
        if (skillsList.length >= 8) currentScore += 10;
        else improvements.push({ id: 'skills', text: "List 8+ technical skills." });

        if (formData.links.github.trim() || formData.links.linkedin.trim()) currentScore += 10;

        const hasNumbers = [...formData.experience, ...formData.projects].some(item =>
            /[0-9](%|k|X|x|%|\s?percent)/i.test(item.description) || /[0-9]+/.test(item.description)
        );
        if (hasNumbers) currentScore += 15;
        else improvements.push({ id: 'numbers', text: "Add measurable impact (numbers)." });

        if (formData.education.length > 0 && formData.education.every(e => e.school.trim() && e.degree.trim())) currentScore += 10;
        if (formData.personalInfo.name && formData.personalInfo.email) currentScore += 20;

        return {
            score: Math.min(100, currentScore),
            currentImprovements: improvements.slice(0, 3)
        };
    }, [formData]);

    return (
        <div className="flex flex-1 overflow-hidden">
            {/* Left Section: Form */}
            <div className="w-[60%] overflow-y-auto px-12 py-10 bg-white border-r border-gray-100">
                <div className="flex justify-between items-start mb-10">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-gray-900 tracking-tight">The Architect</h1>
                        <p className="text-gray-400 text-[10px] uppercase font-bold tracking-[0.2em] mt-1">Design & Content Control</p>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                        <div className="flex gap-2">
                            {['Classic', 'Modern', 'Minimal'].map(t => (
                                <button
                                    key={t}
                                    onClick={() => setTemplate(t)}
                                    className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${template === t ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-gray-50 text-gray-400 hover:text-gray-600'}`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <button onClick={loadSampleData} className="px-4 py-2 border border-gray-100 text-gray-400 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 transition-all">
                                Sample Data
                            </button>
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest ${isSaved ? 'text-green-600 bg-green-50' : 'text-gray-300'}`}>
                                {isSaved ? <CheckCircle2 size={12} /> : <div className="w-2 h-2 bg-gray-200 rounded-full animate-pulse" />}
                                {isSaved ? 'Saved' : 'Auto-saving'}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-12 pb-24">
                    <Section title="Identity">
                        <div className="grid grid-cols-2 gap-4">
                            <InputField label="Name" value={formData.personalInfo.name} onChange={(v) => handleInputChange('personalInfo', 'name', v)} />
                            <InputField label="Email" value={formData.personalInfo.email} onChange={(v) => handleInputChange('personalInfo', 'email', v)} />
                            <InputField label="Phone" value={formData.personalInfo.phone} onChange={(v) => handleInputChange('personalInfo', 'phone', v)} />
                            <InputField label="Location" value={formData.personalInfo.location} onChange={(v) => handleInputChange('personalInfo', 'location', v)} />
                        </div>
                    </Section>

                    <Section title="Mission Statement">
                        <textarea
                            value={formData.summary}
                            onChange={(e) => handleInputChange('summary', null, e.target.value)}
                            className="w-full h-32 p-6 bg-gray-50 border border-transparent rounded-[32px] text-sm focus:bg-white focus:border-primary/10 outline-none resize-none font-medium text-gray-700 transition-all"
                            placeholder="Elevator pitch..."
                        />
                    </Section>

                    <Section title="Experience" onAdd={() => addItem('experience')}>
                        {formData.experience.map((exp, i) => (
                            <div key={i} className="space-y-4 p-8 border border-gray-50 bg-gray-50/30 rounded-[32px] relative group">
                                <div className="grid grid-cols-3 gap-4">
                                    <InputField label="Company" value={exp.company} onChange={(v) => handleInputChange('experience', 'company', v, i)} />
                                    <InputField label="Role" value={exp.role} onChange={(v) => handleInputChange('experience', 'role', v, i)} />
                                    <InputField label="Period" value={exp.period} onChange={(v) => handleInputChange('experience', 'period', v, i)} />
                                </div>
                                <div className="relative">
                                    <textarea
                                        value={exp.description}
                                        onChange={(e) => handleInputChange('experience', 'description', e.target.value, i)}
                                        className="w-full h-24 p-4 bg-white border border-gray-100 rounded-2xl text-sm outline-none resize-none font-medium text-gray-700"
                                        placeholder="Implemented X using Y..."
                                    />
                                    {/* 2) Inline Bullet Guidance */}
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {validateBullet(exp.description).map((tip, idx) => (
                                            <div key={idx} className="text-[10px] font-bold text-primary flex items-center gap-1 bg-primary/5 px-2 py-0.5 rounded italic">
                                                <Sparkles size={10} /> {tip}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <button onClick={() => removeItem('experience', i)} className="absolute top-4 right-4 text-gray-200 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </Section>

                    <Section title="Projects" onAdd={() => addItem('projects')}>
                        {formData.projects.map((proj, i) => (
                            <div key={i} className="space-y-4 p-8 border border-gray-50 bg-gray-50/30 rounded-[32px] relative group">
                                <div className="grid grid-cols-2 gap-4">
                                    <InputField label="Title" value={proj.title} onChange={(v) => handleInputChange('projects', 'title', v, i)} />
                                    <InputField label="Public Link" value={proj.link} onChange={(v) => handleInputChange('projects', 'link', v, i)} />
                                </div>
                                <div className="relative">
                                    <textarea
                                        value={proj.description}
                                        onChange={(e) => handleInputChange('projects', 'description', e.target.value, i)}
                                        className="w-full h-24 p-4 bg-white border border-gray-100 rounded-2xl text-sm outline-none resize-none font-medium text-gray-700"
                                        placeholder="Built Z with A & B..."
                                    />
                                    {/* Inline Bullet Guidance */}
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {validateBullet(proj.description).map((tip, idx) => (
                                            <div key={idx} className="text-[10px] font-bold text-primary flex items-center gap-1 bg-primary/5 px-2 py-0.5 rounded italic">
                                                <Sparkles size={10} /> {tip}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <button onClick={() => removeItem('projects', i)} className="absolute top-4 right-4 text-gray-200 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </Section>

                    <Section title="Expertise">
                        <InputField label="Skills" value={formData.skills} onChange={(v) => handleInputChange('skills', null, v)} placeholder="Comma-separated..." />
                    </Section>
                </div>
            </div>

            {/* Right Section: Live Preview & Score Panel */}
            <div className="w-[40%] bg-gray-50/50 p-12 overflow-y-auto border-l border-gray-100">
                <div className="sticky top-0 space-y-8">
                    {/* Score & Improvements */}
                    <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-8">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">ATS Readiness Score</h3>
                                <div className="text-5xl font-serif font-bold text-gray-900 tracking-tighter">{score}%</div>
                            </div>
                            <div className={`p-3 rounded-2xl ${score > 80 ? 'bg-amber-50 text-amber-500' : 'bg-gray-50 text-gray-300'}`}>
                                <Zap size={24} fill={score > 80 ? 'currentColor' : 'none'} />
                            </div>
                        </div>

                        <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                            <div className="h-full bg-primary transition-all duration-1000 ease-out" style={{ width: `${score}%` }} />
                        </div>

                        {/* 3) Top Improvements Panel */}
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                                Top 3 Improvements
                            </h4>
                            <div className="space-y-3">
                                {currentImprovements.length > 0 ? currentImprovements.map((imp, i) => (
                                    <div key={imp.id} className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100/50 flex items-start gap-4">
                                        <div className="w-5 h-5 bg-white border border-gray-200 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold text-gray-400">
                                            {i + 1}
                                        </div>
                                        <p className="text-xs font-semibold text-gray-600 leading-relaxed">{imp.text}</p>
                                    </div>
                                )) : (
                                    <div className="text-xs font-bold text-green-600 flex items-center gap-2">
                                        <CheckCircle2 size={16} /> All optimization benchmarks reached.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Template Rendering */}
                    <div className={`bg-white aspect-[1/1.414] w-full shadow-2xl rounded-sm p-10 flex flex-col font-sans transition-all duration-500 scale-[0.85] origin-top border border-gray-100 ${template === 'Minimal' ? 'text-[9px] gap-4' : template === 'Modern' ? 'text-[10px] gap-6' : 'text-[10px] gap-5'}`}>
                        {/* Dynamic Layout Based on Template */}
                        {template === 'Modern' ? (
                            <div className="flex flex-col h-full">
                                <header className="border-l-[12px] border-black pl-6 py-2 mb-8">
                                    <h2 className="text-3xl font-serif font-bold uppercase tracking-tighter">{formData.personalInfo.name || 'YOUR NAME'}</h2>
                                    <div className="flex gap-4 mt-2 text-[8px] font-bold uppercase text-gray-400 tracking-widest">{formData.personalInfo.email} • {formData.personalInfo.location}</div>
                                </header>
                                <div className="space-y-8 flex-1">
                                    <PreviewSection title="Experience" data={formData.experience} template={template} />
                                    <PreviewSection title="Projects" data={formData.projects} template={template} />
                                    <PreviewSection title="Education" data={formData.education} template={template} />
                                </div>
                            </div>
                        ) : template === 'Minimal' ? (
                            <div className="flex flex-col h-full text-center items-center">
                                <header className="mb-10 w-full border-b border-black/5 pb-6">
                                    <h2 className="text-2xl font-serif font-bold tracking-tight italic">{formData.personalInfo.name || 'your name'}</h2>
                                    <div className="mt-1 opacity-50 font-medium tracking-tight tracking-tighter">{formData.personalInfo.email} | {formData.personalInfo.phone}</div>
                                </header>
                                <div className="space-y-10 w-full text-left">
                                    <PreviewSection title="Work" data={formData.experience} template={template} />
                                    <PreviewSection title="Skills" data={formData.skills} template={template} />
                                </div>
                            </div>
                        ) : (
                            // Classic
                            <div className="flex flex-col h-full">
                                <header className="border-b-2 border-black pb-4 mb-6 text-center">
                                    <h2 className="text-4xl font-serif font-bold uppercase tracking-tight leading-none">{formData.personalInfo.name || 'YOUR NAME'}</h2>
                                    <div className="mt-2 text-[9px] font-bold uppercase tracking-[0.3em] text-gray-400 flex justify-center gap-4">
                                        <span>{formData.personalInfo.email}</span>
                                        <span>{formData.personalInfo.location}</span>
                                    </div>
                                </header>
                                <div className="space-y-8">
                                    <PreviewSection title="Background" data={formData.experience} template={template} />
                                    <PreviewSection title="Projects" data={formData.projects} template={template} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const PreviewSection = ({ title, data, template }) => {
    if (!data || (Array.isArray(data) && data.length === 0) || (typeof data === 'string' && !data.trim())) return null;
    return (
        <section>
            <h3 className={`font-bold border-b border-gray-100 mb-2 uppercase tracking-widest text-[8px] text-gray-400 ${template === 'Minimal' ? 'text-center' : ''}`}>{title}</h3>
            {Array.isArray(data) ? data.map((item, i) => (
                <div key={i} className="mb-2">
                    <div className="flex justify-between font-bold">
                        <span className="uppercase">{item.role || item.title || item.school}</span>
                        <span className="opacity-40">{item.period || item.year}</span>
                    </div>
                    {item.company && <div className="italic opacity-60 text-[8px] font-bold">{item.company}</div>}
                </div>
            )) : <div className="text-[9px] font-medium leading-relaxed">{data}</div>}
        </section>
    );
};

const Section = ({ title, children, onAdd }) => (
    <div className="space-y-6">
        <div className="flex justify-between items-center group">
            <h2 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">{title}</h2>
            {onAdd && (
                <button onClick={onAdd} className="p-2 text-primary hover:bg-primary/5 rounded-full transition-all active:scale-90"><Plus size={20} /></button>
            )}
        </div>
        {children}
    </div>
);

const InputField = ({ label, value, onChange, placeholder }) => (
    <div className="space-y-1.5 flex-1">
        <label className="text-[9px] font-bold uppercase tracking-wider text-gray-400 ml-1">{label}</label>
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full p-4 bg-gray-50 border border-transparent rounded-[24px] text-sm focus:bg-white focus:border-primary/10 outline-none transition-all font-medium text-gray-700 placeholder:text-gray-200"
        />
    </div>
);

export default Builder;
