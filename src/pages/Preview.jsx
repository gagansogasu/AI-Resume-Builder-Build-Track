import React, { useEffect, useState } from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, ExternalLink } from 'lucide-react';

const Preview = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const saved = localStorage.getItem('rb_resume_data');
        if (saved) {
            setData(JSON.parse(saved));
        }
    }, []);

    if (!data) {
        return (
            <div className="flex-1 flex items-center justify-center p-20 text-center">
                <div className="space-y-4">
                    <h2 className="text-2xl font-serif font-bold text-gray-900">No Data Found</h2>
                    <p className="text-gray-500">Go back to the Builder and enter your details to see a preview.</p>
                </div>
            </div>
        );
    }

    const { personalInfo, summary, education, experience, projects, skills, links } = data;

    return (
        <div className="flex-1 bg-gray-100 overflow-y-auto py-12">
            <div className="max-w-[210mm] mx-auto bg-white p-[20mm] shadow-2xl min-h-[297mm] font-sans text-gray-900 leading-relaxed">
                {/* Header */}
                <header className="border-b-2 border-black pb-8 mb-10">
                    <h1 className="text-5xl font-serif font-bold tracking-tight mb-4 uppercase">{personalInfo.name || 'Your Name'}</h1>
                    <div className="grid grid-cols-2 gap-y-2 text-sm font-medium">
                        {personalInfo.email && <div className="flex items-center gap-2"><Mail size={14} /> {personalInfo.email}</div>}
                        {personalInfo.phone && <div className="flex items-center gap-2"><Phone size={14} /> {personalInfo.phone}</div>}
                        {personalInfo.location && <div className="flex items-center gap-2"><MapPin size={14} /> {personalInfo.location}</div>}
                        <div className="flex gap-4 mt-2 border-t border-gray-100 pt-2 col-span-2">
                            {links.github && <a href={links.github} className="flex items-center gap-1 hover:underline"><Github size={14} /> GitHub</a>}
                            {links.linkedin && <a href={links.linkedin} className="flex items-center gap-1 hover:underline"><Linkedin size={14} /> LinkedIn</a>}
                        </div>
                    </div>
                </header>

                <div className="space-y-10">
                    {/* Summary */}
                    {summary && (
                        <section className="space-y-3">
                            <h2 className="text-xs font-bold uppercase tracking-[0.3em] border-b border-gray-200 pb-1 inline-block">Professional Summary</h2>
                            <p className="text-sm text-gray-800 leading-relaxed italic">{summary}</p>
                        </section>
                    )}

                    {/* Experience */}
                    {experience.some(e => e.company) && (
                        <section className="space-y-6">
                            <h2 className="text-xs font-bold uppercase tracking-[0.3em] border-b border-gray-200 pb-1 inline-block">Work Experience</h2>
                            <div className="space-y-8">
                                {experience.map((exp, i) => exp.company && (
                                    <div key={i} className="space-y-2">
                                        <div className="flex justify-between items-baseline font-bold">
                                            <h3 className="text-lg uppercase tracking-tight">{exp.role}</h3>
                                            <span className="text-xs font-bold text-gray-500 uppercase">{exp.period}</span>
                                        </div>
                                        <div className="text-sm font-bold italic text-gray-700">{exp.company}</div>
                                        <p className="text-sm text-gray-800 whitespace-pre-line">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Projects */}
                    {projects.some(p => p.title) && (
                        <section className="space-y-6">
                            <h2 className="text-xs font-bold uppercase tracking-[0.3em] border-b border-gray-200 pb-1 inline-block">Key Projects</h2>
                            <div className="grid grid-cols-1 gap-6">
                                {projects.map((proj, i) => proj.title && (
                                    <div key={i} className="space-y-1">
                                        <div className="flex items-center gap-2 font-bold uppercase tracking-tight">
                                            {proj.title}
                                            {proj.link && <a href={proj.link} className="hover:underline opacity-50"><ExternalLink size={12} /></a>}
                                        </div>
                                        <p className="text-sm text-gray-800">{proj.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    <div className="grid grid-cols-12 gap-10">
                        {/* Education */}
                        <div className="col-span-12 md:col-span-7">
                            {education.some(e => e.school) && (
                                <section className="space-y-6">
                                    <h2 className="text-xs font-bold uppercase tracking-[0.3em] border-b border-gray-200 pb-1 inline-block">Education</h2>
                                    <div className="space-y-4">
                                        {education.map((edu, i) => edu.school && (
                                            <div key={i} className="space-y-1">
                                                <div className="text-sm font-bold uppercase">{edu.school}</div>
                                                <div className="text-sm italic">{edu.degree}</div>
                                                <div className="text-xs font-bold text-gray-500">{edu.year}</div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>

                        {/* Skills */}
                        <div className="col-span-12 md:col-span-5">
                            {skills && (
                                <section className="space-y-6">
                                    <h2 className="text-xs font-bold uppercase tracking-[0.3em] border-b border-gray-200 pb-1 inline-block">Technical Skills</h2>
                                    <div className="flex flex-wrap gap-2 pt-1">
                                        {skills.split(',').map((skill, i) => (
                                            <span key={i} className="text-xs font-bold px-2 py-1 bg-gray-50 border border-gray-100 uppercase tracking-tighter">
                                                {skill.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                    </div>
                </div>

                <footer className="mt-20 pt-8 border-t border-gray-100 text-[10px] text-center font-bold uppercase tracking-[0.2em] text-gray-300">
                    Generated via KodNest Premium AI Resume Builder — Minimal Series
                </footer>
            </div>
        </div>
    );
};

export default Preview;
