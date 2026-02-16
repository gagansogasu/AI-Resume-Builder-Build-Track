import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Trash2, Database, Save, CheckCircle2, Zap, AlertCircle, Mail, Phone, MapPin, Github, Linkedin, ExternalLink, Layout, Sparkles, X, ChevronDown, ChevronUp, Globe, Loader2 } from 'lucide-react';

const ACTION_VERBS = ['Built', 'Developed', 'Designed', 'Implemented', 'Led', 'Improved', 'Created', 'Optimized', 'Automated', 'Managed', 'Analyzed', 'Coordinated', 'Executed'];

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
                    <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-gray-100 rounded-full text-xs font-bold text-gray-700 shadow-sm animate-in zoom-in-95 duration-200">
                        {tag}
                        <button onClick={() => onRemove(i)} className="text-gray-300 hover:text-red-500 transition-colors">
                            <X size={12} />
                        </button>
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
    const [isSaved, setIsSaved] = useState(false);
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [openProjects, setOpenProjects] = useState({});

    // Auto-load and Auto-save
    useEffect(() => {
        const saved = localStorage.getItem('resumeBuilderData');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Migrating old data if necessary
                if (typeof parsed.skills === 'string') parsed.skills = defaultData.skills;
                if (parsed.projects && parsed.projects.length > 0 && typeof parsed.projects[0].techStack === 'undefined') {
                    parsed.projects = parsed.projects.map(p => ({ ...p, techStack: [], liveUrl: '', githubUrl: '' }));
                }
                setFormData(parsed);
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
                } else if (section === 'skills') {
                    newData.skills[field] = value;
                } else {
                    newData[section] = value;
                }
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
            if (section === 'projects') {
                setOpenProjects(prevOpen => ({ ...prevOpen, [newList.length - 1]: true }));
            }
            return { ...prev, [section]: newList };
        });
    };

    const removeItem = (section, index) => {
        setFormData(prev => ({ ...prev, [section]: prev[section].filter((_, i) => i !== index) }));
    };

    const handleSkillAction = (category, action, payload) => {
        setFormData(prev => {
            const newSkills = { ...prev.skills };
            if (action === 'add') {
                if (!newSkills[category].includes(payload)) {
                    newSkills[category] = [...newSkills[category], payload];
                }
            } else if (action === 'remove') {
                newSkills[category] = newSkills[category].filter((_, i) => i !== payload);
            }
            return { ...prev, skills: newSkills };
        });
    };

    const suggestSkills = () => {
        setIsSuggesting(true);
        setTimeout(() => {
            setFormData(prev => ({
                ...prev,
                skills: {
                    technical: [...new Set([...prev.skills.technical, "TypeScript", "React", "Node.js", "PostgreSQL", "GraphQL"])],
                    soft: [...new Set([...prev.skills.soft, "Team Leadership", "Problem Solving"])],
                    tools: [...new Set([...prev.skills.tools, "Git", "Docker", "AWS"])]
                }
            }));
            setIsSuggesting(false);
        }, 1000);
    };

    const toggleProject = (index) => {
        setOpenProjects(prev => ({ ...prev, [index]: !prev[index] }));
    };

    // Bullet Discipline Logic
    const validateBullet = (text) => {
        if (!text.trim()) return [];
        const tips = [];
        const startsWithVerb = ACTION_VERBS.some(v => text.trim().toLowerCase().startsWith(v.toLowerCase()));
        if (!startsWithVerb) tips.push("Start with a strong action verb.");
        const hasNumbers = /[0-9](%|k|X|x|%|\s?percent)/i.test(text) || /[0-9]+/.test(text);
        if (!hasNumbers) tips.push("Add measurable impact (numbers).");
        return tips;
    };

    // ATS Score & Improvements
    const { score, currentImprovements } = useMemo(() => {
        let currentScore = 0;
        const improvements = [];

        const wordCount = formData.summary.trim() ? formData.summary.trim().split(/\s+/).length : 0;
        if (wordCount >= 40 && wordCount <= 120) currentScore += 15;
        else improvements.push({ id: 'summary', text: "Target 40-120 words for the summary." });

        const projectCount = formData.projects.filter(p => p.title.trim()).length;
        if (projectCount >= 2) currentScore += 10;
        else improvements.push({ id: 'projects', text: "Add at least 2 key projects." });

        const expCount = formData.experience.filter(e => e.company.trim()).length;
        if (expCount >= 1) currentScore += 10;
        else improvements.push({ id: 'exp', text: "Add work experience." });

        const totalSkills = formData.skills.technical.length + formData.skills.soft.length + formData.skills.tools.length;
        if (totalSkills >= 8) currentScore += 10;
        else improvements.push({ id: 'skills', text: "List 8+ total skills." });

        if (formData.links.github.trim() || formData.links.linkedin.trim()) currentScore += 10;

        const hasNumbers = [...formData.experience, ...formData.projects].some(item =>
            /[0-9](%|k|X|x|%|\s?percent)/i.test(item.description) || /[0-9]+/.test(item.description)
        );
        if (hasNumbers) currentScore += 15;
        else improvements.push({ id: 'numbers', text: "Focus on measurable results." });

        if (formData.education.length > 0 && formData.education.every(e => e.school.trim())) currentScore += 10;
        if (formData.personalInfo.name && formData.personalInfo.email) currentScore += 20;

        return { score: Math.min(100, currentScore), currentImprovements: improvements.slice(0, 3) };
    }, [formData]);

    return (
        <div className="flex flex-1 overflow-hidden">
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
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest ${isSaved ? 'text-green-600 bg-green-50' : 'text-gray-300'}`}>
                            {isSaved ? <CheckCircle2 size={12} /> : <div className="w-2 h-2 bg-gray-200 rounded-full animate-pulse" />}
                            {isSaved ? 'Saved' : 'Auto-saving'}
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

                    {/* Skills Section */}
                    <Section
                        title="Skill Arsenal"
                        customAction={
                            <button
                                onClick={suggestSkills}
                                disabled={isSuggesting}
                                className="flex items-center gap-2 px-4 py-2 bg-primary/5 text-primary border border-primary/10 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-primary/10 transition-all disabled:opacity-50"
                            >
                                {isSuggesting ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                                {isSuggesting ? 'Thinking...' : '✨ Suggest Skills'}
                            </button>
                        }
                    >
                        <div className="space-y-6">
                            <SkillCategory
                                label="Technical Skills"
                                count={formData.skills.technical.length}
                                tags={formData.skills.technical}
                                onAdd={(tag) => handleSkillAction('technical', 'add', tag)}
                                onRemove={(idx) => handleSkillAction('technical', 'remove', idx)}
                            />
                            <SkillCategory
                                label="Soft Skills"
                                count={formData.skills.soft.length}
                                tags={formData.skills.soft}
                                onAdd={(tag) => handleSkillAction('soft', 'add', tag)}
                                onRemove={(idx) => handleSkillAction('soft', 'remove', idx)}
                            />
                            <SkillCategory
                                label="Tools & Technologies"
                                count={formData.skills.tools.length}
                                tags={formData.skills.tools}
                                onAdd={(tag) => handleSkillAction('tools', 'add', tag)}
                                onRemove={(idx) => handleSkillAction('tools', 'remove', idx)}
                            />
                        </div>
                    </Section>

                    {/* Projects Section */}
                    <Section title="Project Portfolio" onAdd={() => addItem('projects')}>
                        <div className="space-y-4">
                            {formData.projects.map((proj, i) => (
                                <div key={i} className="border border-gray-100 rounded-[32px] overflow-hidden bg-white shadow-sm transition-all">
                                    <button
                                        onClick={() => toggleProject(i)}
                                        className="w-full px-8 py-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary font-bold text-xs">
                                                {i + 1}
                                            </div>
                                            <span className="font-bold text-gray-900">{proj.title || "Untitled Project"}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); removeItem('projects', i); }}
                                                className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                            {openProjects[i] ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                                        </div>
                                    </button>

                                    {openProjects[i] && (
                                        <div className="px-8 pb-8 space-y-6 animate-in slide-in-from-top-4 duration-300">
                                            <InputField label="Project Title" value={proj.title} onChange={(v) => handleInputChange('projects', 'title', v, i)} />
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center px-1">
                                                    <label className="text-[9px] font-bold uppercase tracking-wider text-gray-400">Description</label>
                                                    <span className={`text-[9px] font-bold ${proj.description.length > 200 ? 'text-red-500' : 'text-gray-300'}`}>
                                                        {proj.description.length}/200
                                                    </span>
                                                </div>
                                                <textarea
                                                    value={proj.description}
                                                    maxLength={200}
                                                    onChange={(e) => handleInputChange('projects', 'description', e.target.value, i)}
                                                    className="w-full h-24 p-4 bg-gray-50 border border-transparent rounded-2xl text-sm outline-none resize-none font-medium text-gray-700 focus:bg-white focus:border-primary/10 transition-all"
                                                    placeholder="Goal, actions, results..."
                                                />
                                                <div className="flex flex-wrap gap-2">
                                                    {validateBullet(proj.description).map((tip, idx) => (
                                                        <div key={idx} className="text-[10px] font-bold text-primary flex items-center gap-1">
                                                            <Sparkles size={10} /> {tip}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-bold uppercase tracking-wider text-gray-400 ml-1">Tech Stack</label>
                                                <TagInput
                                                    tags={proj.techStack || []}
                                                    onAdd={(tag) => handleInputChange('projects', 'techStack', [...(proj.techStack || []), tag], i)}
                                                    onRemove={(idx) => handleInputChange('projects', 'techStack', (proj.techStack || []).filter((_, k) => k !== idx), i)}
                                                    placeholder="Press Enter to add tech..."
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <InputField label="Live URL" value={proj.liveUrl} onChange={(v) => handleInputChange('projects', 'liveUrl', v, i)} placeholder="https://..." />
                                                <InputField label="GitHub URL" value={proj.githubUrl} onChange={(v) => handleInputChange('projects', 'githubUrl', v, i)} placeholder="https://github.com/..." />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </Section>

                    <Section title="Work History" onAdd={() => addItem('experience')}>
                        {formData.experience.map((exp, i) => (
                            <div key={i} className="p-8 border border-gray-50 bg-gray-50/30 rounded-[32px] relative group">
                                <div className="grid grid-cols-3 gap-4 mb-4">
                                    <InputField label="Company" value={exp.company} onChange={(v) => handleInputChange('experience', 'company', v, i)} />
                                    <InputField label="Role" value={exp.role} onChange={(v) => handleInputChange('experience', 'role', v, i)} />
                                    <InputField label="Period" value={exp.period} onChange={(v) => handleInputChange('experience', 'period', v, i)} />
                                </div>
                                <textarea
                                    value={exp.description}
                                    onChange={(e) => handleInputChange('experience', 'description', e.target.value, i)}
                                    className="w-full h-24 p-4 bg-white border border-gray-100 rounded-2xl text-sm outline-none resize-none"
                                />
                                <button onClick={() => removeItem('experience', i)} className="absolute top-4 right-4 text-gray-200 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </Section>
                </div>
            </div>

            {/* Right Section: Live Preview */}
            <div className="w-[40%] bg-gray-50/50 p-12 overflow-y-auto border-l border-gray-100">
                <div className="sticky top-0 space-y-8">
                    <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-8">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">ATS Readiness</h3>
                                <div className="text-5xl font-serif font-bold text-gray-900">{score}%</div>
                            </div>
                            <Zap size={24} className={score > 80 ? 'text-amber-500' : 'text-gray-200'} />
                        </div>
                        <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                            <div className="h-full bg-primary transition-all duration-1000 ease-out" style={{ width: `${score}%` }} />
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary">Top 3 Improvements</h4>
                            <div className="space-y-3">
                                {currentImprovements.map((imp, i) => (
                                    <div key={imp.id} className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100/50 flex items-start gap-4">
                                        <div className="w-5 h-5 bg-white border border-gray-200 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold text-gray-400">{i + 1}</div>
                                        <p className="text-xs font-semibold text-gray-600 leading-relaxed">{imp.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className={`bg-white aspect-[1/1.414] w-full shadow-2xl rounded-sm p-10 flex flex-col font-sans transition-all duration-500 scale-[0.85] origin-top border border-gray-100 ${template === 'Minimal' ? 'text-[8px] gap-4' : template === 'Modern' ? 'text-[9px] gap-6' : 'text-[9px] gap-5'}`}>
                        <h2 className={`font-serif font-bold uppercase tracking-tight text-lg text-gray-950 ${template === 'Minimal' ? 'text-center italic' : ''}`}>
                            {formData.personalInfo.name || 'Your Name'}
                        </h2>
                        <div className="space-y-6">
                            {/* Detailed Skills Preview */}
                            {(formData.skills.technical.length > 0 || formData.skills.soft.length > 0 || formData.skills.tools.length > 0) && (
                                <section className="space-y-3">
                                    <h4 className="font-bold border-b border-gray-100 text-[7px] uppercase tracking-widest text-gray-400">Skills Profile</h4>
                                    <div className="space-y-2">
                                        {Object.entries(formData.skills).map(([cat, tags]) => tags.length > 0 && (
                                            <div key={cat} className="flex flex-wrap gap-1.5">
                                                <span className="text-[6px] font-bold uppercase text-gray-400 w-full mb-0.5">{cat}</span>
                                                {tags.map((t, idx) => (
                                                    <span key={idx} className="bg-gray-50 border border-gray-100 px-2 py-0.5 font-bold uppercase tracking-tighter shadow-sm">{t}</span>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Detailed Projects Preview */}
                            {formData.projects.some(p => p.title.trim()) && (
                                <section className="space-y-4">
                                    <h4 className="font-bold border-b border-gray-100 text-[7px] uppercase tracking-widest text-gray-400">Key Projects</h4>
                                    <div className="space-y-4">
                                        {formData.projects.map((proj, i) => proj.title.trim() && (
                                            <div key={i} className="space-y-1.5 p-3 bg-gray-50/50 border border-gray-50 rounded shadow-sm">
                                                <div className="flex justify-between items-start">
                                                    <div className="font-bold uppercase text-[9px]">{proj.title}</div>
                                                    <div className="flex gap-1.5">
                                                        {proj.githubUrl && <Github size={8} />}
                                                        {proj.liveUrl && <Globe size={8} />}
                                                    </div>
                                                </div>
                                                <p className="text-[8px] opacity-80 leading-relaxed italic">{proj.description}</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {(proj.techStack || []).map((t, idx) => (
                                                        <span key={idx} className="text-[6px] font-bold text-primary px-1 opacity-60">#{t}</span>
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
            </div>
        </div>
    );
};

const Section = ({ title, children, onAdd, customAction }) => (
    <div className="space-y-6">
        <div className="flex justify-between items-center group">
            <h2 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">{title}</h2>
            <div className="flex items-center gap-4">
                {customAction}
                {onAdd && (
                    <button onClick={onAdd} className="p-2 text-primary hover:bg-primary/5 rounded-full transition-all active:scale-90"><Plus size={20} /></button>
                )}
            </div>
        </div>
        {children}
    </div>
);

const SkillCategory = ({ label, count, tags, onAdd, onRemove }) => (
    <div className="space-y-2">
        <div className="flex justify-between items-center px-1">
            <label className="text-[9px] font-bold uppercase tracking-wider text-gray-400">{label} ({count})</label>
        </div>
        <TagInput tags={tags} onAdd={onAdd} onRemove={onRemove} placeholder={`Add ${label.toLowerCase()}...`} />
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
            className="w-full p-4 bg-gray-50 border border-transparent rounded-[24px] text-sm focus:bg-white focus:border-primary/10 transition-all font-medium text-gray-700 hover:bg-gray-100/50"
        />
    </div>
);

export default Builder;
