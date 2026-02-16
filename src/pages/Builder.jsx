import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Trash2, Database, Save, CheckCircle2, Zap, AlertCircle, Mail, Phone, MapPin, Github, Linkedin, ExternalLink } from 'lucide-react';

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
    const [isSaved, setIsSaved] = useState(false);

    // 1) Auto-load and Auto-save
    useEffect(() => {
        const saved = localStorage.getItem('resumeBuilderData');
        if (saved) {
            try {
                setFormData(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse saved data", e);
            }
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            localStorage.setItem('resumeBuilderData', JSON.stringify(formData));
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 2000);
        }, 1000); // Debounce save
        return () => clearTimeout(timer);
    }, [formData]);

    const handleInputChange = (section, field, value, index = null) => {
        setFormData(prev => {
            const newData = JSON.parse(JSON.stringify(prev)); // Deep clone
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
        setFormData(prev => ({
            ...prev,
            [section]: [...prev[section], itemTemplates[section]]
        }));
    };

    const removeItem = (section, index) => {
        setFormData(prev => ({
            ...prev,
            [section]: prev[section].filter((_, i) => i !== index)
        }));
    };

    const loadSampleData = () => {
        setFormData({
            personalInfo: { name: 'Gagan Sogasu', email: 'gagan@example.com', phone: '+91 98765 43210', location: 'Bengaluru, India' },
            summary: 'Ambitious Software Engineer with a focus on building premium web applications and AI-driven systems. Expert in React and modern CSS architectures, helping businesses scale their digital products with 25% better performance.',
            education: [{ school: 'KodNest Institute', degree: 'Full Stack Development', year: '2024' }],
            experience: [{ company: 'TechFlow Solutions', role: 'Frontend Developer', period: '2023 - Present', description: 'Leading the implementation of the AI-powered builder rail and premium design systems for over 10k monthly users.' }],
            projects: [
                { title: 'Placement Readiness Platform', link: 'https://github.com/prp', description: 'A comprehensive system for tracking student preparation and interview readiness with 95% accuracy.' },
                { title: 'AI Portfolio Builder', link: 'https://github.com/portfolio-ai', description: 'Automated portfolio generation tool using LLMs.' }
            ],
            skills: 'React, Node.js, Tailwind CSS, Python, Git, UI/UX Design, TypeScript, AWS, Docker',
            links: { github: 'https://github.com/gagansogasu', linkedin: 'https://linkedin.com/in/gagansogasu' }
        });
    };

    // 3) ATS Score v1
    const { score, suggestions } = useMemo(() => {
        let currentScore = 0;
        const currentSuggestions = [];

        // Summary length 40-120 words
        const wordCount = formData.summary.trim() ? formData.summary.trim().split(/\s+/).length : 0;
        if (wordCount >= 40 && wordCount <= 120) {
            currentScore += 15;
        } else {
            currentSuggestions.push("Write a stronger summary (40–120 words).");
        }

        // At least 2 projects
        const projectCount = formData.projects.filter(p => p.title.trim()).length;
        if (projectCount >= 2) {
            currentScore += 10;
        } else {
            currentSuggestions.push("Add at least 2 projects.");
        }

        // At least 1 experience
        const expCount = formData.experience.filter(e => e.company.trim()).length;
        if (expCount >= 1) {
            currentScore += 10;
        } else {
            currentSuggestions.push("Add at least 1 work experience entry.");
        }

        // Skills >= 8
        const skillsList = formData.skills.split(',').filter(s => s.trim().length > 0);
        if (skillsList.length >= 8) {
            currentScore += 10;
        } else {
            currentSuggestions.push("Add more skills (target 8+).");
        }

        // Links exist
        if (formData.links.github.trim() || formData.links.linkedin.trim()) {
            currentScore += 10;
        } else {
            currentSuggestions.push("Add your GitHub or LinkedIn profile.");
        }

        // Measurable impact (numbers)
        const hasNumbers = [...formData.experience, ...formData.projects].some(item =>
            /[0-9](%|k|X|x|%|\s?percent)/i.test(item.description) || /[0-9]+/.test(item.description)
        );
        if (hasNumbers) {
            currentScore += 15;
        } else {
            currentSuggestions.push("Add measurable impact (numbers) in bullets.");
        }

        // Complete education
        const eduComplete = formData.education.length > 0 && formData.education.every(e => e.school.trim() && e.degree.trim() && e.year.trim());
        if (eduComplete) {
            currentScore += 10;
        } else {
            currentSuggestions.push("Complete all fields in education section.");
        }

        // Ensure baseline for non-empty but sub-optimal sections
        if (formData.personalInfo.name && formData.personalInfo.email) currentScore += 20;

        return {
            score: Math.min(100, currentScore),
            suggestions: currentSuggestions.slice(0, 3)
        };
    }, [formData]);

    return (
        <div className="flex flex-1 overflow-hidden">
            {/* Left Section: Form (60%) */}
            <div className="w-[60%] overflow-y-auto px-12 py-10 bg-white border-r border-gray-100">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-gray-900 tracking-tight">Craft Your Story</h1>
                        <p className="text-gray-400 text-[10px] uppercase font-bold tracking-[0.2em] mt-1">AI Resume Builder v1.2</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={loadSampleData}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-100 text-gray-500 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 transition-all active:scale-95"
                        >
                            <Database size={14} /> Load Sample
                        </button>
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${isSaved ? 'text-green-600 bg-green-50' : 'text-gray-400 bg-gray-50'}`}>
                            {isSaved ? <CheckCircle2 size={14} /> : <div className="w-3 h-3 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin" />}
                            {isSaved ? 'Autosaved' : 'Saving...'}
                        </div>
                    </div>
                </div>

                <div className="space-y-12 pb-24">
                    {/* Personal Info */}
                    <Section title="Personal Information">
                        <div className="grid grid-cols-2 gap-4">
                            <InputField label="Full Name" value={formData.personalInfo.name} onChange={(v) => handleInputChange('personalInfo', 'name', v)} />
                            <InputField label="Email Address" value={formData.personalInfo.email} onChange={(v) => handleInputChange('personalInfo', 'email', v)} />
                            <InputField label="Phone Number" value={formData.personalInfo.phone} onChange={(v) => handleInputChange('personalInfo', 'phone', v)} />
                            <InputField label="Location" value={formData.personalInfo.location} onChange={(v) => handleInputChange('personalInfo', 'location', v)} />
                        </div>
                    </Section>

                    {/* Summary */}
                    <Section title="Professional Summary">
                        <div className="space-y-2">
                            <textarea
                                value={formData.summary}
                                onChange={(e) => handleInputChange('summary', null, e.target.value)}
                                placeholder="Summary of your professional journey..."
                                className="w-full h-32 p-4 bg-gray-50 border border-transparent rounded-2xl text-sm focus:bg-white focus:border-primary/20 focus:ring-1 focus:ring-primary/5 outline-none resize-none font-medium text-gray-700 transition-all"
                            />
                            <div className="flex justify-end text-[10px] font-bold text-gray-400 tracking-widest uppercase">
                                {formData.summary.trim() ? formData.summary.trim().split(/\s+/).length : 0} Words (Target: 40-120)
                            </div>
                        </div>
                    </Section>

                    {/* Education */}
                    <Section title="Education" onAdd={() => addItem('education')}>
                        <div className="space-y-4">
                            {formData.education.map((edu, i) => (
                                <div key={i} className="p-6 border border-gray-50 bg-gray-50/30 rounded-3xl relative group">
                                    <div className="grid grid-cols-2 gap-4">
                                        <InputField label="Institution" value={edu.school} onChange={(v) => handleInputChange('education', 'school', v, i)} />
                                        <InputField label="Degree" value={edu.degree} onChange={(v) => handleInputChange('education', 'degree', v, i)} />
                                        <InputField label="Year" value={edu.year} onChange={(v) => handleInputChange('education', 'year', v, i)} />
                                    </div>
                                    <button onClick={() => removeItem('education', i)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </Section>

                    {/* Experience */}
                    <Section title="Experience" onAdd={() => addItem('experience')}>
                        <div className="space-y-4">
                            {formData.experience.map((exp, i) => (
                                <div key={i} className="p-6 border border-gray-50 bg-gray-50/30 rounded-3xl relative group">
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <InputField label="Company" value={exp.company} onChange={(v) => handleInputChange('experience', 'company', v, i)} />
                                        <InputField label="Role" value={exp.role} onChange={(v) => handleInputChange('experience', 'role', v, i)} />
                                        <InputField label="Period" value={exp.period} onChange={(v) => handleInputChange('experience', 'period', v, i)} />
                                    </div>
                                    <textarea
                                        value={exp.description}
                                        onChange={(e) => handleInputChange('experience', 'description', e.target.value, i)}
                                        placeholder="Experience details..."
                                        className="w-full h-24 p-4 bg-white border border-gray-100 rounded-2xl text-sm outline-none resize-none font-medium text-gray-700"
                                    />
                                    <button onClick={() => removeItem('experience', i)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </Section>

                    {/* Projects */}
                    <Section title="Projects" onAdd={() => addItem('projects')}>
                        <div className="space-y-4">
                            {formData.projects.map((proj, i) => (
                                <div key={i} className="p-6 border border-gray-50 bg-gray-50/30 rounded-3xl relative group">
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <InputField label="Title" value={proj.title} onChange={(v) => handleInputChange('projects', 'title', v, i)} />
                                        <InputField label="Link" value={proj.link} onChange={(v) => handleInputChange('projects', 'link', v, i)} />
                                    </div>
                                    <textarea
                                        value={proj.description}
                                        onChange={(e) => handleInputChange('projects', 'description', e.target.value, i)}
                                        placeholder="Project details..."
                                        className="w-full h-24 p-4 bg-white border border-gray-100 rounded-2xl text-sm outline-none resize-none font-medium text-gray-700"
                                    />
                                    <button onClick={() => removeItem('projects', i)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </Section>

                    {/* Skills */}
                    <Section title="Skills">
                        <InputField
                            label="Comma separated skills"
                            value={formData.skills}
                            onChange={(v) => handleInputChange('skills', null, v)}
                            placeholder="e.g., React, AI, Node..."
                        />
                    </Section>

                    {/* Links */}
                    <Section title="Links">
                        <div className="grid grid-cols-2 gap-4">
                            <InputField label="GitHub" value={formData.links.github} onChange={(v) => handleInputChange('links', 'github', v)} />
                            <InputField label="LinkedIn" value={formData.links.linkedin} onChange={(v) => handleInputChange('links', 'linkedin', v)} />
                        </div>
                    </Section>
                </div>
            </div>

            {/* Right Section: Real Live Preview (40%) */}
            <div className="w-[40%] bg-gray-50/50 p-12 overflow-y-auto border-l border-gray-100">
                <div className="sticky top-0 space-y-10">
                    {/* 3) ATS Score Meter */}
                    <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
                        <div className="flex justify-between items-end">
                            <div>
                                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-1">ATS Readiness Score</h3>
                                <div className="text-4xl font-serif font-bold text-gray-900">{score}%</div>
                            </div>
                            <div className="mb-1">
                                <Zap size={24} className={score > 80 ? 'text-amber-500' : 'text-gray-200'} />
                            </div>
                        </div>

                        <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                            <div
                                className="h-full bg-primary transition-all duration-1000 ease-out"
                                style={{ width: `${score}%` }}
                            />
                        </div>

                        {/* 4) Suggestions */}
                        {suggestions.length > 0 && (
                            <div className="pt-4 border-t border-gray-50 space-y-3">
                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary">Key Improvements</h4>
                                <div className="space-y-2">
                                    {suggestions.map((s, i) => (
                                        <div key={i} className="flex items-start gap-2 text-xs font-medium text-gray-500 leading-relaxed">
                                            <AlertCircle size={14} className="mt-0.5 text-primary shrink-0 opacity-40" />
                                            {s}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {score === 100 && (
                            <div className="flex items-center gap-2 text-xs font-bold text-green-600 bg-green-50 p-3 rounded-xl border border-green-100">
                                <CheckCircle2 size={16} /> Perfect Score! Your resume is ready to ship.
                            </div>
                        )}
                    </div>

                    {/* 2) Real Preview Shell */}
                    <div className="bg-white aspect-[1/1.414] w-full shadow-2xl rounded-sm p-10 flex flex-col font-sans text-[10px] text-gray-800 scale-90 origin-top overflow-hidden border border-gray-100">
                        {/* Header */}
                        <div className="border-b border-gray-900 pb-4 mb-6">
                            <h2 className="text-xl font-serif font-bold tracking-tight uppercase mb-2">
                                {formData.personalInfo.name || 'Your Name'}
                            </h2>
                            <div className="flex flex-wrap gap-x-3 gap-y-1 text-gray-500 font-medium">
                                {formData.personalInfo.email && <div className="flex items-center gap-1"><Mail size={8} /> {formData.personalInfo.email}</div>}
                                {formData.personalInfo.phone && <div className="flex items-center gap-1"><Phone size={8} /> {formData.personalInfo.phone}</div>}
                                {formData.personalInfo.location && <div className="flex items-center gap-1"><MapPin size={8} /> {formData.personalInfo.location}</div>}
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Summary */}
                            {formData.summary.trim() && (
                                <section>
                                    <h3 className="font-bold border-b border-gray-100 mb-1 uppercase tracking-widest text-[8px] text-gray-400">Summary</h3>
                                    <p className="leading-relaxed italic">{formData.summary}</p>
                                </section>
                            )}

                            {/* Experience */}
                            {formData.experience.some(e => e.company.trim()) && (
                                <section>
                                    <h3 className="font-bold border-b border-gray-100 mb-2 uppercase tracking-widest text-[8px] text-gray-400">Experience</h3>
                                    <div className="space-y-3">
                                        {formData.experience.map((exp, i) => exp.company.trim() && (
                                            <div key={i}>
                                                <div className="flex justify-between font-bold">
                                                    <span className="uppercase">{exp.role}</span>
                                                    <span className="text-gray-400">{exp.period}</span>
                                                </div>
                                                <div className="italic text-gray-600 font-medium">{exp.company}</div>
                                                <p className="mt-1 opacity-80">{exp.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Projects */}
                            {formData.projects.some(p => p.title.trim()) && (
                                <section>
                                    <h3 className="font-bold border-b border-gray-100 mb-2 uppercase tracking-widest text-[8px] text-gray-400">Projects</h3>
                                    <div className="space-y-2">
                                        {formData.projects.map((proj, i) => proj.title.trim() && (
                                            <div key={i}>
                                                <div className="flex justify-between font-bold">
                                                    <span>{proj.title}</span>
                                                    {proj.link && <span className="text-[7px] text-primary lowercase">{proj.link}</span>}
                                                </div>
                                                <p className="opacity-80">{proj.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Education */}
                            {formData.education.some(e => e.school.trim()) && (
                                <section>
                                    <h3 className="font-bold border-b border-gray-100 mb-2 uppercase tracking-widest text-[8px] text-gray-400">Education</h3>
                                    <div className="space-y-2">
                                        {formData.education.map((edu, i) => edu.school.trim() && (
                                            <div key={i} className="flex justify-between">
                                                <div>
                                                    <div className="font-bold uppercase">{edu.school}</div>
                                                    <div className="italic opacity-80">{edu.degree}</div>
                                                </div>
                                                <div className="font-bold text-gray-400">{edu.year}</div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Skills */}
                            {formData.skills.trim() && (
                                <section>
                                    <h3 className="font-bold border-b border-gray-100 mb-1 uppercase tracking-widest text-[8px] text-gray-400">Skills</h3>
                                    <div className="flex flex-wrap gap-2 text-[7px] font-bold">
                                        {formData.skills.split(',').map((s, i) => s.trim() && (
                                            <span key={i} className="bg-gray-50 border border-gray-100 px-1.5 py-0.5 uppercase tracking-tighter">{s.trim()}</span>
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

const Section = ({ title, children, onAdd }) => (
    <div className="space-y-6">
        <div className="flex justify-between items-center group">
            <h2 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">{title}</h2>
            {onAdd && (
                <button
                    onClick={onAdd}
                    className="p-2 text-primary hover:bg-primary/5 rounded-full transition-all active:scale-90"
                >
                    <Plus size={20} />
                </button>
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
            className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl text-sm focus:bg-white focus:border-primary/20 focus:ring-1 focus:ring-primary/10 outline-none transition-all font-medium text-gray-700 placeholder:text-gray-300"
        />
    </div>
);

export default Builder;
