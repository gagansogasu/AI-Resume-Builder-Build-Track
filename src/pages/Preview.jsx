import React, { useEffect, useState } from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, ExternalLink } from 'lucide-react';

const Preview = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const saved = localStorage.getItem('resumeBuilderData');
        if (saved) {
            try {
                setData(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse saved data", e);
            }
        }
    }, []);

    if (!data) {
        return (
            <div className="flex-1 flex items-center justify-center p-20 text-center">
                <div className="space-y-4 max-w-sm">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                        <Mail size={32} />
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-gray-900">Start Your Story</h2>
                    <p className="text-sm text-gray-500 font-medium">Head over to the Builder section to craft your professional resume. Your progress will appear here automatically.</p>
                </div>
            </div>
        );
    }

    const { personalInfo, summary, education, experience, projects, skills, links } = data;

    return (
        <div className="flex-1 bg-gray-100/50 overflow-y-auto py-20 px-8">
            <div className="max-w-[210mm] mx-auto bg-white p-[25mm] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] min-h-[297mm] font-sans text-gray-950 leading-[1.6]">
                {/* Header */}
                <header className="border-b-2 border-black pb-10 mb-12">
                    <h1 className="text-6xl font-serif font-bold tracking-tighter mb-6 uppercase leading-none">{personalInfo.name || 'Your Name'}</h1>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-[11px] font-bold uppercase tracking-widest text-gray-500">
                        {personalInfo.email && <div className="flex items-center gap-2"><Mail size={12} className="text-black" /> {personalInfo.email}</div>}
                        {personalInfo.phone && <div className="flex items-center gap-2"><Phone size={12} className="text-black" /> {personalInfo.phone}</div>}
                        {personalInfo.location && <div className="flex items-center gap-2"><MapPin size={12} className="text-black" /> {personalInfo.location}</div>}
                    </div>
                    <div className="flex gap-6 mt-6 border-t border-gray-100 pt-6">
                        {links.github && <a href={links.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest hover:text-primary transition-colors"><Github size={14} /> GitHub</a>}
                        {links.linkedin && <a href={links.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest hover:text-primary transition-colors"><Linkedin size={14} /> LinkedIn</a>}
                    </div>
                </header>

                <div className="space-y-12">
                    {/* Summary */}
                    {summary && (
                        <section className="space-y-4">
                            <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 border-b border-gray-100 pb-2">Professional Summary</h2>
                            <p className="text-[13px] text-gray-900 leading-relaxed italic pr-12">{summary}</p>
                        </section>
                    )}

                    {/* Experience */}
                    {experience.some(e => e.company.trim()) && (
                        <section className="space-y-8">
                            <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 border-b border-gray-100 pb-2">Experience</h2>
                            <div className="space-y-10">
                                {experience.map((exp, i) => exp.company.trim() && (
                                    <div key={i} className="space-y-3">
                                        <div className="flex justify-between items-baseline">
                                            <h3 className="text-lg font-bold uppercase tracking-tight text-gray-900">{exp.role}</h3>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{exp.period}</span>
                                        </div>
                                        <div className="text-sm font-bold italic text-gray-600 tracking-wide">{exp.company}</div>
                                        <p className="text-[13px] text-gray-800 whitespace-pre-line leading-relaxed">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Projects */}
                    {projects.some(p => p.title.trim()) && (
                        <section className="space-y-8">
                            <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 border-b border-gray-100 pb-2">Selected Projects</h2>
                            <div className="grid grid-cols-1 gap-8">
                                {projects.map((proj, i) => proj.title.trim() && (
                                    <div key={i} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm font-bold uppercase tracking-tight text-gray-900">{proj.title}</div>
                                            {proj.link && <a href={proj.link} target="_blank" rel="noreferrer" className="text-[9px] font-bold text-gray-300 hover:text-primary uppercase tracking-widest flex items-center gap-1 transition-colors">Project Link <ExternalLink size={10} /></a>}
                                        </div>
                                        <p className="text-[13px] text-gray-800 leading-relaxed">{proj.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    <div className="grid grid-cols-12 gap-12 pt-4">
                        {/* Education */}
                        <div className="col-span-12 md:col-span-7">
                            {education.some(e => e.school.trim()) && (
                                <section className="space-y-8">
                                    <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 border-b border-gray-100 pb-2">Academic Background</h2>
                                    <div className="space-y-6">
                                        {education.map((edu, i) => edu.school.trim() && (
                                            <div key={i} className="space-y-1">
                                                <div className="text-sm font-bold uppercase tracking-tight text-gray-900">{edu.school}</div>
                                                <div className="text-[13px] italic text-gray-600">{edu.degree}</div>
                                                <div className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">{edu.year}</div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>

                        {/* Skills */}
                        <div className="col-span-12 md:col-span-5">
                            {skills.trim() && (
                                <section className="space-y-8">
                                    <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 border-b border-gray-100 pb-2">Expertise</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {skills.split(',').map((skill, i) => skill.trim() && (
                                            <span key={i} className="text-[11px] font-bold px-3 py-1 bg-gray-50 border border-gray-100 uppercase tracking-tighter text-gray-700">
                                                {skill.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                    </div>
                </div>

                <footer className="mt-32 pt-10 border-t border-gray-100 text-[9px] text-center font-bold uppercase tracking-[0.3em] text-gray-300">
                    System generated via KodNest Premium AI Resume Builder
                </footer>
            </div>
        </div>
    );
};

export default Preview;
