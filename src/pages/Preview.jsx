import React, { useEffect, useState } from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, ExternalLink } from 'lucide-react';

const Preview = () => {
    const [data, setData] = useState(null);
    const [template, setTemplate] = useState('Classic');

    useEffect(() => {
        const savedData = localStorage.getItem('resumeBuilderData');
        const savedTemplate = localStorage.getItem('resumeTemplate');
        if (savedData) {
            try {
                setData(JSON.parse(savedData));
            } catch (e) { console.error(e); }
        }
        if (savedTemplate) setTemplate(savedTemplate);
    }, []);

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
            <div className="max-w-[1200px] mx-auto mb-8 flex justify-center gap-2">
                {['Classic', 'Modern', 'Minimal'].map(t => (
                    <button
                        key={t}
                        onClick={() => {
                            setTemplate(t);
                            localStorage.setItem('resumeTemplate', t);
                        }}
                        className={`px-8 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all ${template === t ? 'bg-gray-900 text-white shadow-xl' : 'bg-white text-gray-400 hover:text-gray-600 border border-gray-100'}`}
                    >
                        {t} Template
                    </button>
                ))}
            </div>

            <div className={`max-w-[210mm] mx-auto bg-white p-[25mm] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] min-h-[297mm] font-sans text-gray-950 leading-[1.6] transition-all duration-700 ${template === 'Minimal' ? 'text-center' : ''}`}>

                {template === 'Modern' ? (
                    <div className="flex flex-col">
                        <header className="border-l-[16px] border-black pl-8 py-4 mb-16">
                            <h1 className="text-6xl font-serif font-bold tracking-tighter uppercase leading-none">{personalInfo.name || 'Your Name'}</h1>
                            <div className="flex flex-wrap gap-6 mt-6 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">
                                {personalInfo.email} • {personalInfo.phone} • {personalInfo.location}
                            </div>
                        </header>
                        <MainContent data={data} template={template} />
                    </div>
                ) : template === 'Minimal' ? (
                    <div className="flex flex-col items-center">
                        <header className="mb-20 w-full border-b border-gray-50 pb-10">
                            <h1 className="text-5xl font-serif font-bold tracking-tight italic text-gray-900">{personalInfo.name || 'your name'}</h1>
                            <div className="mt-4 flex justify-center gap-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                <span>{personalInfo.email}</span>
                                <span className="opacity-20">/</span>
                                <span>{personalInfo.location}</span>
                            </div>
                        </header>
                        <MainContent data={data} template={template} />
                    </div>
                ) : (
                    // Classic
                    <div className="flex flex-col">
                        <header className="border-b-2 border-black pb-10 mb-12 text-center">
                            <h1 className="text-5xl font-serif font-bold tracking-tight mb-8 uppercase leading-none">{personalInfo.name || 'Your Name'}</h1>
                            <div className="flex justify-center gap-8 text-[11px] font-bold uppercase tracking-widest text-gray-500">
                                <div className="flex items-center gap-2"><Mail size={12} className="text-black" /> {personalInfo.email}</div>
                                <div className="flex items-center gap-2"><MapPin size={12} className="text-black" /> {personalInfo.location}</div>
                            </div>
                        </header>
                        <MainContent data={data} template={template} />
                    </div>
                )}

                <footer className="mt-32 pt-10 border-t border-gray-100 text-[9px] text-center font-bold uppercase tracking-[0.3em] text-gray-300">
                    System generated via KodNest Premium AI Resume Builder — Minimal Series
                </footer>
            </div>
        </div>
    );
};

const MainContent = ({ data, template }) => (
    <div className="space-y-12 text-left">
        {data.summary && (
            <section className="space-y-4">
                <h2 className={`text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 border-b border-gray-100 pb-2 ${template === 'Minimal' ? 'text-center' : ''}`}>Professional Summary</h2>
                <p className={`text-[13px] text-gray-900 leading-relaxed italic ${template === 'Minimal' ? 'text-center' : 'pr-12'}`}>{data.summary}</p>
            </section>
        )}

        {data.experience.some(e => e.company.trim()) && (
            <section className="space-y-8">
                <h2 className={`text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 border-b border-gray-100 pb-2 ${template === 'Minimal' ? 'text-center' : ''}`}>Experience</h2>
                <div className="space-y-10">
                    {data.experience.map((exp, i) => exp.company.trim() && (
                        <div key={i} className="space-y-3">
                            <div className="flex justify-between items-baseline">
                                <h3 className={`text-lg font-bold uppercase tracking-tight text-gray-900 ${template === 'Minimal' ? 'w-full' : ''}`}>{exp.role}</h3>
                                {template !== 'Minimal' && <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{exp.period}</span>}
                            </div>
                            <div className="text-sm font-bold italic text-gray-600 tracking-wide">{exp.company}</div>
                            {template === 'Minimal' && <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{exp.period}</div>}
                            <p className="text-[13px] text-gray-800 whitespace-pre-line leading-relaxed">{exp.description}</p>
                        </div>
                    ))}
                </div>
            </section>
        )}

        {data.projects.some(p => p.title.trim()) && (
            <section className="space-y-8">
                <h2 className={`text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 border-b border-gray-100 pb-2 ${template === 'Minimal' ? 'text-center' : ''}`}>Key Projects</h2>
                <div className="grid grid-cols-1 gap-8">
                    {data.projects.map((proj, i) => proj.title.trim() && (
                        <div key={i} className="space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="text-sm font-bold uppercase tracking-tight text-gray-900">{proj.title}</div>
                                {proj.link && <a href={proj.link} target="_blank" rel="noreferrer" className="text-[9px] font-bold text-gray-300 hover:text-primary uppercase tracking-widest flex items-center gap-1 transition-colors"><ExternalLink size={10} /></a>}
                            </div>
                            <p className="text-[13px] text-gray-800 leading-relaxed">{proj.description}</p>
                        </div>
                    ))}
                </div>
            </section>
        )}

        <div className="grid grid-cols-12 gap-12">
            <div className="col-span-12 md:col-span-7">
                {data.education.some(e => e.school.trim()) && (
                    <section className="space-y-8">
                        <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 border-b border-gray-100 pb-2">Academic Background</h2>
                        <div className="space-y-6">
                            {data.education.map((edu, i) => edu.school.trim() && (
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
            <div className="col-span-12 md:col-span-5">
                {data.skills.trim() && (
                    <section className="space-y-8">
                        <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 border-b border-gray-100 pb-2">Technical Skills</h2>
                        <div className="flex flex-wrap gap-2 pt-2">
                            {data.skills.split(',').map((skill, i) => skill.trim() && (
                                <span key={i} className="text-[11px] font-bold px-3 py-1 bg-gray-50 border border-gray-100 uppercase tracking-tighter text-gray-700 transition-all hover:bg-white hover:border-gray-200">
                                    {skill.trim()}
                                </span>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    </div>
);

export default Preview;
