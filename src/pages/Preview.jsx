import React, { useEffect, useState } from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, ExternalLink, Printer, Clipboard, AlertTriangle, Check, Globe, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
    const [showToast, setShowToast] = useState(false);

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

    const handleDownload = () => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
        window.print();
    };

    if (!data) return (
        <div className="flex-1 flex items-center justify-center p-20 text-center">
            <h2 className="text-2xl font-serif font-bold text-gray-900">No Data Found</h2>
        </div>
    );

    return (
        <div className="flex-1 bg-gray-50/50 overflow-y-auto py-12 px-8">
            {/* Control Bar */}
            <div className="max-w-[210mm] mx-auto mb-8 flex justify-between items-center no-print">
                <button
                    onClick={() => navigate('/builder')}
                    className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors"
                >
                    <ChevronLeft size={14} /> Back to Editor
                </button>
                <div className="flex gap-4 items-center">
                    <div className="flex gap-2">
                        {THEME_COLORS.map(c => (
                            <button
                                key={c.name}
                                onClick={() => {
                                    setAccentColor(c.hsl);
                                    localStorage.setItem('resumeAccentColor', c.hsl);
                                }}
                                className={`w-6 h-6 rounded-full border-2 transition-all ${accentColor === c.hsl ? 'border-gray-900 scale-110' : 'border-transparent'}`}
                                style={{ backgroundColor: c.hsl }}
                            />
                        ))}
                    </div>
                    <button
                        onClick={handleDownload}
                        className="px-8 py-3 bg-gray-900 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl"
                    >
                        Download PDF
                    </button>
                </div>
            </div>

            {/* Resume Drawing Container */}
            <div
                className={`resume-container max-w-[210mm] mx-auto bg-white shadow-2xl min-h-[297mm] font-sans text-gray-950 leading-[1.6] transition-all duration-700 overflow-hidden relative ${template === 'Classic' ? 'font-serif' : 'font-sans'}`}
                style={{ borderTop: `6px solid ${accentColor}` }}
            >
                {template === 'Modern' ? (
                    <div className="flex min-h-[297mm]">
                        {/* Sidebar */}
                        <div className="w-[30%] p-10 flex flex-col gap-10 text-white" style={{ backgroundColor: accentColor }}>
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-60">Contact</h4>
                                <div className="text-[10px] space-y-3 opacity-90 leading-relaxed font-medium">
                                    <div className="flex items-center gap-3"><Mail size={12} /> {data.personalInfo.email}</div>
                                    <div className="flex items-center gap-3"><Phone size={12} /> {data.personalInfo.phone}</div>
                                    <div className="flex items-center gap-3"><MapPin size={12} /> {data.personalInfo.location}</div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-60">Skills</h4>
                                <div className="flex flex-wrap gap-2">
                                    {(data.skills.technical || []).map((s, i) => (
                                        <span key={i} className="text-[8px] font-bold px-2 py-1 bg-white/10 rounded uppercase shadow-sm">{s}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        {/* Main Content */}
                        <div className="flex-1 p-16 flex flex-col gap-12">
                            <header>
                                <h1 className="text-5xl font-serif font-bold tracking-tighter uppercase leading-none mb-4" style={{ color: accentColor }}>{data.personalInfo.name || 'YOUR NAME'}</h1>
                                <p className="text-[11px] text-gray-400 uppercase tracking-[0.4em] font-bold">Researched & Strategic Leader</p>
                            </header>
                            <MainSection title="Professional Summary" data={data.summary} color={accentColor} />
                            <MainSection title="Key Projects" list={data.projects} color={accentColor} />
                            <MainSection title="Work History" list={data.experience} color={accentColor} />
                        </div>
                    </div>
                ) : (
                    // Classic / Minimal
                    <div className={`p-20 flex flex-col gap-12 h-full ${template === 'Minimal' ? 'items-center text-center' : ''}`}>
                        <header className={`w-full ${template === 'Minimal' ? 'border-none' : 'border-b border-gray-100 pb-10'}`}>
                            <h1 className="text-6xl font-serif font-bold tracking-tighter uppercase leading-none mb-6" style={{ color: accentColor }}>{data.personalInfo.name || 'Your Name'}</h1>
                            <div className={`flex gap-8 text-[11px] font-bold uppercase tracking-[0.3em] text-gray-400 ${template === 'Minimal' ? 'justify-center' : ''}`}>
                                <span>{data.personalInfo.email}</span>
                                <span>{data.personalInfo.location}</span>
                            </div>
                        </header>
                        <div className="space-y-12 w-full text-left">
                            <MainSection title="Summary" data={data.summary} color={accentColor} minimal={template === 'Minimal'} />
                            <MainSection title="Selected Experience" list={data.experience} color={accentColor} minimal={template === 'Minimal'} />
                        </div>
                    </div>
                )}
            </div>

            {/* Toast Notification */}
            {showToast && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 no-print">
                    <div className="bg-gray-900 border border-white/10 px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-4">
                        <Check size={20} className="text-green-500" />
                        <div>
                            <p className="text-white text-sm font-bold">PDF export ready!</p>
                            <p className="text-gray-400 text-xs">Check your downloads folder.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const MainSection = ({ title, data, list, color, minimal }) => {
    if (!data && (!list || list.length === 0)) return null;
    return (
        <section className={`space-y-4 ${minimal ? 'text-center' : ''}`}>
            <h3 className={`text-[10px] font-bold uppercase tracking-[0.4em] mb-4 ${minimal ? 'opacity-30' : ''}`} style={{ color: minimal ? undefined : color }}>{title}</h3>
            {data && <p className="text-[12px] opacity-80 italic leading-relaxed">{data}</p>}
            {list && (
                <div className="space-y-6">
                    {list.map((item, i) => (
                        <div key={i} className="space-y-1">
                            <div className="flex justify-between items-center font-bold uppercase text-[12px] tracking-tight">
                                <span>{item.role || item.title || item.company}</span>
                                <span className="text-[9px] opacity-40">{item.period || item.year}</span>
                            </div>
                            <p className="text-[11px] opacity-70 leading-relaxed">{item.description}</p>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default Preview;
