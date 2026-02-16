import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Database, Save, CheckCircle2 } from 'lucide-react';

const Builder = () => {
    const [formData, setFormData] = useState({
        personalInfo: { name: '', email: '', phone: '', location: '' },
        summary: '',
        education: [{ school: '', degree: '', year: '' }],
        experience: [{ company: '', role: '', period: '', description: '' }],
        projects: [{ title: '', link: '', description: '' }],
        skills: '',
        links: { github: '', linkedin: '' }
    });

    const [isSaved, setIsSaved] = useState(false);

    const handleInputChange = (section, field, value, index = null) => {
        setFormData(prev => {
            const newData = { ...prev };
            if (index !== null) {
                newData[section][index][field] = value;
            } else if (typeof field === 'string') {
                if (section === 'personalInfo' || section === 'links') {
                    newData[section][field] = value;
                } else {
                    newData[section] = value;
                }
            }
            return newData;
        });
        setIsSaved(false);
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
            summary: 'Ambitious Software Engineer with a focus on building premium web applications and AI-driven systems. Expert in React and modern CSS architectures.',
            education: [{ school: 'KodNest Institute', degree: 'Full Stack Development', year: '2024' }],
            experience: [{ company: 'TechFlow Solutions', role: 'Frontend Developer', period: '2023 - Present', description: 'Leading the implementation of the AI-powered builder rail and premium design systems.' }],
            projects: [{ title: 'Placement Readiness Platform', link: 'https://github.com/prp', description: 'A comprehensive system for tracking student preparation and interview readiness.' }],
            skills: 'React, Node.js, Tailwind CSS, Python, Git, UI/UX Design',
            links: { github: 'https://github.com/gagansogasu', linkedin: 'https://linkedin.com/in/gagansogasu' }
        });
    };

    useEffect(() => {
        const saved = localStorage.getItem('rb_resume_data');
        if (saved) setFormData(JSON.parse(saved));
    }, []);

    const saveToLocal = () => {
        localStorage.setItem('rb_resume_data', JSON.stringify(formData));
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    return (
        <div className="flex flex-1 overflow-hidden">
            {/* Left Section: Form (60%) */}
            <div className="w-[60%] overflow-y-auto px-12 py-10 bg-white border-r border-gray-100">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-gray-900 tracking-tight">Craft Your Story</h1>
                        <p className="text-gray-500 text-sm mt-1 uppercase tracking-widest font-bold">Resume Builder</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={loadSampleData}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors"
                        >
                            <Database size={14} /> Load Sample
                        </button>
                        <button
                            onClick={saveToLocal}
                            className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${isSaved ? 'bg-green-600 text-white' : 'bg-gray-900 text-white hover:bg-gray-800'}`}
                        >
                            {isSaved ? <CheckCircle2 size={14} /> : <Save size={14} />}
                            {isSaved ? 'Saved' : 'Save Progress'}
                        </button>
                    </div>
                </div>

                <div className="space-y-12">
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
                        <textarea
                            value={formData.summary}
                            onChange={(e) => handleInputChange('summary', null, e.target.value)}
                            placeholder="Briefly describe your career goals and key achievements..."
                            className="w-full h-32 p-4 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-1 focus:ring-primary outline-none resize-none font-medium text-gray-600"
                        />
                    </Section>

                    {/* Education */}
                    <Section title="Education" onAdd={() => addItem('education')}>
                        {formData.education.map((edu, i) => (
                            <div key={i} className="p-4 border border-gray-50 bg-gray-50/30 rounded-2xl relative group mb-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <InputField label="Institution" value={edu.school} onChange={(v) => handleInputChange('education', 'school', v, i)} />
                                    <InputField label="Degree / Course" value={edu.degree} onChange={(v) => handleInputChange('education', 'degree', v, i)} />
                                    <InputField label="Year of Completion" value={edu.year} onChange={(v) => handleInputChange('education', 'year', v, i)} />
                                </div>
                                <button onClick={() => removeItem('education', i)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </Section>

                    {/* Experience */}
                    <Section title="Work Experience" onAdd={() => addItem('experience')}>
                        {formData.experience.map((exp, i) => (
                            <div key={i} className="p-4 border border-gray-50 bg-gray-50/30 rounded-2xl relative group mb-4">
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <InputField label="Company" value={exp.company} onChange={(v) => handleInputChange('experience', 'company', v, i)} />
                                    <InputField label="Role" value={exp.role} onChange={(v) => handleInputChange('experience', 'role', v, i)} />
                                    <InputField label="Period" value={exp.period} onChange={(v) => handleInputChange('experience', 'period', v, i)} />
                                </div>
                                <textarea
                                    value={exp.description}
                                    onChange={(e) => handleInputChange('experience', 'description', e.target.value, i)}
                                    placeholder="Work details..."
                                    className="w-full h-24 p-4 bg-white border border-gray-100 rounded-xl text-sm focus:ring-1 focus:ring-primary outline-none resize-none font-medium text-gray-600"
                                />
                                <button onClick={() => removeItem('experience', i)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </Section>

                    {/* Projects */}
                    <Section title="Key Projects" onAdd={() => addItem('projects')}>
                        {formData.projects.map((proj, i) => (
                            <div key={i} className="p-4 border border-gray-50 bg-gray-50/30 rounded-2xl relative group mb-4">
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <InputField label="Project Title" value={proj.title} onChange={(v) => handleInputChange('projects', 'title', v, i)} />
                                    <InputField label="Link (URL)" value={proj.link} onChange={(v) => handleInputChange('projects', 'link', v, i)} />
                                </div>
                                <textarea
                                    value={proj.description}
                                    onChange={(e) => handleInputChange('projects', 'description', e.target.value, i)}
                                    placeholder="Project details..."
                                    className="w-full h-24 p-4 bg-white border border-gray-100 rounded-xl text-sm focus:ring-1 focus:ring-primary outline-none resize-none font-medium text-gray-600"
                                />
                                <button onClick={() => removeItem('projects', i)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </Section>

                    {/* Skills */}
                    <Section title="Skills & Expertise">
                        <InputField
                            label="Skills (Comma separated)"
                            value={formData.skills}
                            onChange={(v) => handleInputChange('skills', null, v)}
                            placeholder="React, JavaScript, AI, Node..."
                        />
                    </Section>

                    {/* Links */}
                    <Section title="Professional Links">
                        <div className="grid grid-cols-2 gap-4">
                            <InputField label="GitHub Profile" value={formData.links.github} onChange={(v) => handleInputChange('links', 'github', v)} />
                            <InputField label="LinkedIn Profile" value={formData.links.linkedin} onChange={(v) => handleInputChange('links', 'linkedin', v)} />
                        </div>
                    </Section>
                </div>
            </div>

            {/* Right Section: Live Preview (40%) */}
            <div className="w-[40%] bg-gray-50 p-12 overflow-y-auto">
                <div className="sticky top-0">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
                        <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                        Live Preview
                    </h3>

                    {/* Placeholder Resume Shell */}
                    <div className="bg-white aspect-[1/1.414] w-full shadow-2xl rounded-sm p-10 flex flex-col pointer-events-none origin-top transition-all duration-500">
                        {/* Header Shell */}
                        <div className="border-b-2 border-gray-900 pb-4 mb-6">
                            <div className={`h-8 w-48 bg-gray-100 rounded mb-2 transition-all ${formData.personalInfo.name ? 'opacity-20' : 'opacity-100'}`} />
                            <div className="flex gap-2">
                                <div className="h-3 w-32 bg-gray-50 rounded" />
                                <div className="h-3 w-32 bg-gray-50 rounded" />
                            </div>
                        </div>

                        {/* Content Shells */}
                        <div className="space-y-6">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="space-y-2">
                                    <div className="h-4 w-24 bg-gray-100 rounded" />
                                    <div className="h-2 w-full bg-gray-50 rounded leading-none" />
                                    <div className="h-2 w-5/6 bg-gray-50 rounded leading-none" />
                                </div>
                            ))}
                        </div>

                        <div className="mt-auto flex justify-center pb-8 opacity-20 italic font-serif text-sm">
                            "Structure is the key to clarity"
                        </div>
                    </div>

                    <div className="mt-8 p-6 bg-primary/5 border border-primary/10 rounded-2xl">
                        <p className="text-xs text-primary font-bold uppercase tracking-wider mb-2">Editor Tip</p>
                        <p className="text-sm text-gray-600 leading-relaxed font-medium">Use the "Preview" tab in the navigation to see the exact minimalist layout of your resume.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Section = ({ title, children, onAdd }) => (
    <div className="space-y-4">
        <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">{title}</h2>
            {onAdd && (
                <button
                    onClick={onAdd}
                    className="p-2 text-primary hover:bg-primary/5 rounded-full transition-colors"
                >
                    <Plus size={20} />
                </button>
            )}
        </div>
        {children}
    </div>
);

const InputField = ({ label, value, onChange, placeholder }) => (
    <div className="space-y-1.5">
        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 ml-1">{label}</label>
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full p-3 bg-gray-50 border border-transparent rounded-xl text-sm focus:border-primary/20 focus:bg-white focus:ring-1 focus:ring-primary/10 outline-none transition-all font-medium text-gray-600"
        />
    </div>
);

export default Builder;
