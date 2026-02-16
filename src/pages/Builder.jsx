import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Trash2, CheckCircle2, Zap, Mail, Phone, MapPin, Github, Linkedin, ExternalLink, Sparkles, X, ChevronDown, ChevronUp, Globe, Loader2, Check } from 'lucide-react';

const ACTION_VERBS = ['Built', 'Developed', 'Designed', 'Implemented', 'Led', 'Improved', 'Created', 'Optimized', 'Automated', 'Managed', 'Analyzed', 'Coordinated', 'Executed'];

const THEME_COLORS = [
    { name: 'Teal', hsl: 'hsl(168, 60%, 40%)' },
    { name: 'Navy', hsl: 'hsl(220, 60%, 35%)' },
    { name: 'Burgundy', hsl: 'hsl(345, 60%, 35%)' },
    { name: 'Forest', hsl: 'hsl(150, 50%, 30%)' },
    { name: 'Charcoal', hsl: 'hsl(0, 0%, 25%)' }
];

const TagInput = ({ tags, onAdd, onRemove, placeholder }) => {
    const [input, setInput] = useState('');
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && input.trim()) {
            e.preventDefault();
            onAdd(input.trim());
            setInput('');
        }
    };
    return (
        <div className="space-y-2">
            <div className="flex flex-wrap gap-2 min-h-[40px] p-2 bg-gray-50 border border-transparent rounded-2xl focus-within:bg-white focus-within:border-primary/10 transition-all">
                {tags.map((tag, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-gray-100 rounded-full text-[10px] font-bold text-gray-700 shadow-sm">
                        {tag}
                        <button onClick={() => onRemove(i)} className="text-gray-300 hover:text-red-500"><X size={10} /></button>
                    </span>
                ))}
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={tags.length === 0 ? placeholder : ""}
                    className="flex-1 bg-transparent border-none outline-none text-sm font-medium px-2 min-w-[120px] placeholder:text-gray-300"
                />
            </div>
        </div>
    );
};

const Builder = () => {
    const defaultData = {
        personalInfo: { name: '', email: '', phone: '', location: '' },
        summary: '',
        education: [{ school: '', degree: '', year: '' }],
        experience: [{ company: '', role: '', period: '', description: '' }],
        projects: [],
        skills: { technical: [], soft: [], tools: [] },
        links: { github: '', linkedin: '' }
    };

    const [formData, setFormData] = useState(defaultData);
    const [template, setTemplate] = useState('Classic');
    const [accentColor, setAccentColor] = useState(THEME_COLORS[0].hsl);
    const [isSaved, setIsSaved] = useState(false);
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [openProjects, setOpenProjects] = useState({});
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('resumeBuilderData');
        if (saved) {
            try { setFormData(JSON.parse(saved)); } catch (e) { console.error(e); }
        }
        const savedTemplate = localStorage.getItem('resumeTemplate');
        if (savedTemplate) setTemplate(savedTemplate);
        const savedColor = localStorage.getItem('resumeAccentColor');
        if (savedColor) setAccentColor(savedColor);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            localStorage.setItem('resumeBuilderData', JSON.stringify(formData));
            localStorage.setItem('resumeTemplate', template);
            localStorage.setItem('resumeAccentColor', accentColor);
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 2000);
        }, 1000);
        return () => clearTimeout(timer);
    }, [formData, template, accentColor]);

    const handleInputChange = (section, field, value, index = null) => {
        setFormData(prev => {
            const newData = JSON.parse(JSON.stringify(prev));
            if (index !== null) newData[section][index][field] = value;
            else if (typeof field === 'string') {
                if (section === 'personalInfo' || section === 'links') newData[section][field] = value;
                else if (section === 'skills') newData.skills[field] = value;
                else newData[section] = value;
            }
            return newData;
        });
    };

    const addItem = (section) => {
        const itemTemplates = {
            education: { school: '', degree: '', year: '' },
            experience: { company: '', role: '', period: '', description: '' },
            projects: { title: '', description: '', techStack: [], liveUrl: '', githubUrl: '' }
        };
        setFormData(prev => {
            const newList = [...prev[section], itemTemplates[section]];
            if (section === 'projects') setOpenProjects(prevOpen => ({ ...prevOpen, [newList.length - 1]: true }));
            return { ...prev, [section]: newList };
        });
    };

    const removeItem = (section, index) => {
        setFormData(prev => ({ ...prev, [section]: prev[section].filter((_, i) => i !== index) }));
    };

    const handleDownload = () => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
    };

    // ATS Score Calculation (Deterministic)
    const { score, suggestions } = useMemo(() => {
        let s = 0;
        const sugs = [];

        // Rules
        if (formData.personalInfo.name.trim()) s += 10;
        else sugs.push("Add your full name (+10 points)");

        if (formData.personalInfo.email.trim()) s += 10;
        else sugs.push("Add an email address (+10 points)");

        if (formData.summary.trim().length > 50) s += 10;
        else sugs.push("Add a professional summary > 50 chars (+10 points)");

        if (formData.experience.length >= 1 && formData.experience.some(e => e.description.trim().length > 0)) s += 15;
        else sugs.push("Add experience with detailed bullets (+15 points)");

        if (formData.education.some(e => e.school.trim())) s += 10;
        else sugs.push("Add an education entry (+10 points)");

        const totalSkills = formData.skills.technical.length + formData.skills.soft.length + formData.skills.tools.length;
        if (totalSkills >= 5) s += 10;
        else sugs.push("Add at least 5 skills (+10 points)");

        if (formData.projects.length >= 1) s += 10;
        else sugs.push("Add at least 1 project (+10 points)");

        if (formData.personalInfo.phone.trim()) s += 5;
        else sugs.push("Add your phone number (+5 points)");

        if (formData.links.linkedin.trim()) s += 5;
        else sugs.push("Add your LinkedIn profile (+5 points)");

        if (formData.links.github.trim()) s += 5;
        else sugs.push("Add your GitHub profile (+5 points)");

        const hasVerbs = ACTION_VERBS.some(v => formData.summary.toLowerCase().includes(v.toLowerCase()));
        if (hasVerbs) s += 10;
        else sugs.push("Use action verbs in your summary (+10 points)");

        return { score: Math.min(100, s), suggestions: sugs.slice(0, 3) };
    }, [formData]);

    return (
        <div className="flex flex-1 overflow-hidden relative">
            {/* Main Editor Section */}
            <div className="w-[55%] overflow-y-auto px-12 py-10 bg-white border-r border-gray-100">
                <div className="flex justify-between items-start mb-10">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-gray-900 tracking-tight">The Architect</h1>
                        <p className="text-gray-400 text-[10px] uppercase font-bold tracking-[0.2em] mt-1">Refining Your Professional Identity</p>
                    </div>
                    <div className={`p-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest ${isSaved ? 'text-green-600 bg-green-50' : 'text-gray-300'}`}>
                        {isSaved ? 'Autosaved' : 'Saving...'}
                    </div>
                </div>

                <div className="space-y-12 pb-32">
                    <Section title="Identity">
                        <div className="grid grid-cols-2 gap-4">
                            <InputField label="Full Name" value={formData.personalInfo.name} onChange={(v) => handleInputChange('personalInfo', 'name', v)} />
                            <InputField label="Email Address" value={formData.personalInfo.email} onChange={(v) => handleInputChange('personalInfo', 'email', v)} />
                            <InputField label="Phone Number" value={formData.personalInfo.phone} onChange={(v) => handleInputChange('personalInfo', 'phone', v)} />
                            <InputField label="Location" value={formData.personalInfo.location} onChange={(v) => handleInputChange('personalInfo', 'location', v)} />
                        </div>
                    </Section>

                    <Section title="Summary">
                        <textarea
                            value={formData.summary}
                            onChange={(e) => handleInputChange('summary', null, e.target.value)}
                            className="w-full h-32 p-6 bg-gray-50 rounded-[32px] text-sm outline-none font-medium text-gray-700"
                            placeholder="Professional summary..."
                        />
                    </Section>

                    <Section title="Project Arsenal" onAdd={() => addItem('projects')}>
                        <div className="space-y-4">
                            {formData.projects.map((proj, i) => (
                                <div key={i} className="border border-gray-100 rounded-[24px] overflow-hidden">
                                    <button onClick={() => setOpenProjects(p => ({ ...p, [i]: !p[i] }))} className="w-full px-6 py-4 flex justify-between items-center bg-gray-50/50">
                                        <span className="font-bold text-xs uppercase tracking-widest">{proj.title || "New Project"}</span>
                                        <ChevronDown size={14} className={`transition-transform ${openProjects[i] ? 'rotate-180' : ''}`} />
                                    </button>
                                    {openProjects[i] && (
                                        <div className="p-6 space-y-4 animate-in slide-in-from-top-4 duration-200">
                                            <InputField label="Project Title" value={proj.title} onChange={(v) => handleInputChange('projects', 'title', v, i)} />
                                            <textarea
                                                value={proj.description}
                                                maxLength={200}
                                                onChange={(e) => handleInputChange('projects', 'description', e.target.value, i)}
                                                className="w-full h-24 p-4 bg-gray-50 rounded-2xl text-xs outline-none"
                                                placeholder="Brief description..."
                                            />
                                            <TagInput tags={proj.techStack || []} onAdd={(t) => handleInputChange('projects', 'techStack', [...(proj.techStack || []), t], i)} onRemove={(idx) => handleInputChange('projects', 'techStack', proj.techStack.filter((_, k) => k !== idx), i)} placeholder="Add techs..." />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </Section>

                    <Section title="Experience" onAdd={() => addItem('experience')}>
                        {formData.experience.map((exp, i) => (
                            <div key={i} className="p-6 bg-gray-50/30 border border-gray-100 rounded-[32px] space-y-4 relative group">
                                <div className="grid grid-cols-2 gap-4">
                                    <InputField label="Company" value={exp.company} onChange={(v) => handleInputChange('experience', 'company', v, i)} />
                                    <InputField label="Role" value={exp.role} onChange={(v) => handleInputChange('experience', 'role', v, i)} />
                                </div>
                                <textarea value={exp.description} onChange={(e) => handleInputChange('experience', 'description', e.target.value, i)} className="w-full h-24 p-4 bg-white border border-gray-100 rounded-2xl text-xs" placeholder="Describe your impact..." />
                                <button onClick={() => removeItem('experience', i)} className="absolute top-4 right-4 text-red-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={16} /></button>
                            </div>
                        ))}
                    </Section>

                    <Section title="Education" onAdd={() => addItem('education')}>
                        {formData.education.map((edu, i) => (
                            <div key={i} className="p-6 bg-gray-50/30 border border-gray-100 rounded-[32px] space-y-4 relative group">
                                <div className="grid grid-cols-3 gap-4">
                                    <InputField label="School" value={edu.school} onChange={(v) => handleInputChange('education', 'school', v, i)} />
                                    <InputField label="Degree" value={edu.degree} onChange={(v) => handleInputChange('education', 'degree', v, i)} />
                                    <InputField label="Year" value={edu.year} onChange={(v) => handleInputChange('education', 'year', v, i)} />
                                </div>
                                <button onClick={() => removeItem('education', i)} className="absolute top-4 right-4 text-red-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={16} /></button>
                            </div>
                        ))}
                    </Section>

                    <Section title="Links & Social">
                        <div className="grid grid-cols-2 gap-4">
                            <InputField label="LinkedIn" value={formData.links.linkedin} onChange={(v) => handleInputChange('links', 'linkedin', v)} placeholder="https://linkedin.com/in/..." />
                            <InputField label="GitHub" value={formData.links.github} onChange={(v) => handleInputChange('links', 'github', v)} placeholder="https://github.com/..." />
                        </div>
                    </Section>
                </div>
            </div>

            {/* Preview & Customization Sidebar */}
            <div className="w-[45%] bg-gray-50/80 p-8 flex flex-col gap-8 overflow-y-auto border-l border-gray-100">
                {/* 1) Template Picker */}
                <div className="space-y-4 no-print">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Layout Selection</h3>
                    <div className="flex gap-4">
                        {[
                            { id: 'Classic', desc: 'Serif, Single Column' },
                            { id: 'Modern', desc: 'Sleek Sidebar' },
                            { id: 'Minimal', desc: 'Sans-Serif, Spaced' }
                        ].map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setTemplate(t.id)}
                                className={`group relative w-[110px] aspect-[1/1.4] bg-white rounded-xl border-2 transition-all p-1.5 shadow-sm ${template === t.id ? 'border-primary ring-4 ring-primary/5' : 'border-gray-100 hover:border-gray-200'}`}
                            >
                                <div className="w-full h-full bg-gray-50 rounded-lg flex flex-col p-2 gap-1 overflow-hidden opacity-40">
                                    <div className="h-1.5 w-full bg-gray-200 rounded-full" />
                                    <div className="flex gap-1 h-full">
                                        {t.id === 'Modern' && <div className="w-1/3 bg-gray-200 rounded" />}
                                        <div className="flex-1 flex flex-col gap-1">
                                            <div className="h-1 w-full bg-gray-100 rounded-full" />
                                            <div className="h-1 w-2/3 bg-gray-100 rounded-full" />
                                            <div className="h-4 w-full bg-gray-200 rounded" />
                                        </div>
                                    </div>
                                </div>
                                {template === t.id && (
                                    <div className="absolute top-[-8px] right-[-8px] bg-primary text-white p-1 rounded-full shadow-lg">
                                        <Check size={12} strokeWidth={4} />
                                    </div>
                                )}
                                <div className="mt-2 text-[8px] font-bold uppercase tracking-tighter text-gray-500">{t.id}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* 4) Color Picker */}
                <div className="space-y-4 no-print">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Brand Color</h3>
                    <div className="flex gap-3">
                        {THEME_COLORS.map((c) => (
                            <button
                                key={c.name}
                                onClick={() => setAccentColor(c.hsl)}
                                className={`w-10 h-10 rounded-full p-1 border-2 transition-all ${accentColor === c.hsl ? 'border-gray-900 scale-110' : 'border-transparent'}`}
                            >
                                <div className="w-full h-full rounded-full shadow-inner" style={{ backgroundColor: c.hsl }} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* ATS Score Visualization moved down or shared */}
                <div className="flex flex-col gap-4 no-print bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center">
                        <div>
                            <div className="text-3xl font-serif font-bold text-gray-900">{score}%</div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">ATS Score</div>
                        </div>
                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${score > 70 ? 'bg-green-50 text-green-600' : score > 40 ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'}`}>
                            {score > 70 ? 'Strong Resume' : score > 40 ? 'Getting There' : 'Needs Work'}
                        </div>
                    </div>
                    {suggestions.length > 0 && (
                        <div className="space-y-2 mt-2">
                            {suggestions.map((s, i) => (
                                <p key={i} className="text-[10px] font-medium text-gray-500 flex items-center gap-2">
                                    <AlertCircle size={10} className="text-amber-500" /> {s}
                                </p>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex justify-between items-center no-print mt-auto">
                    <button onClick={handleDownload} className="w-full py-4 bg-gray-900 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl transition-transform active:scale-95">
                        Download PDF
                    </button>
                </div>

                {/* Live A4 Preview Rendering */}
                <div
                    className={`bg-white aspect-[1/1.414] w-full shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] rounded-sm p-12 transition-all duration-700 origin-top overflow-hidden scale-[0.8] flex flex-col font-sans text-gray-900 ${template === 'Classic' ? 'font-serif' : 'font-sans'}`}
                    style={{ borderTop: `4px solid ${accentColor}` }}
                >
                    {/* Simplified Preview Content for real-time visual feedback */}
                    <div className="flex flex-col gap-6">
                        <h2 className="text-4xl font-serif font-bold tracking-tight uppercase leading-none" style={{ color: accentColor }}>{formData.personalInfo.name || 'Your Name'}</h2>
                        <div className="flex flex-col gap-4">
                            <div className="h-2 w-full bg-gray-50 rounded" />
                            <div className="h-2 w-2/3 bg-gray-50 rounded" />
                            <div className="h-20 w-full bg-gray-50/50 rounded-2xl p-4 text-[10px] italic opacity-60 overflow-hidden">
                                {formData.summary || "Summary goes here..."}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Toast Notification */}
            {showToast && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-10 fade-in duration-500">
                    <div className="bg-gray-900 border border-white/10 px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-4">
                        <CheckCircle2 size={24} className="text-green-500" />
                        <div>
                            <p className="text-white text-sm font-bold">PDF export ready!</p>
                            <p className="text-gray-400 text-xs text-gray-500">Check your downloads folder.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const Section = ({ title, children, onAdd }) => (
    <div className="space-y-6">
        <div className="flex justify-between items-center group">
            <h2 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">{title}</h2>
            {onAdd && <button onClick={onAdd} className="p-2 text-primary hover:bg-primary/5 rounded-full transition-all active:scale-90"><Plus size={20} /></button>}
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
            className="w-full p-4 bg-gray-50 border border-transparent rounded-[24px] text-sm focus:bg-white focus:border-primary/10 transition-all font-medium text-gray-700"
        />
    </div>
);

export default Builder;
