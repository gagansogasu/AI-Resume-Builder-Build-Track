import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { ShieldAlert, BookOpen, CheckCircle2, AlertCircle } from 'lucide-react';

const RBStep = () => {
    const { pathname } = useLocation();
    const navigate = useNavigate();

    // Extract step number
    const stepMatch = pathname.match(/\/rb\/(\d+)-/);
    const currentStep = stepMatch ? parseInt(stepMatch[1]) : 0;

    const [checklist, setChecklist] = useState({
        saveLocal: false,
        livePreview: false,
        templateSync: false,
        themePersist: false,
        atsCorrect: false,
        scoreLive: false,
        exportWork: false,
        emptyState: false,
        mobileResp: false,
        noErrors: false
    });

    useEffect(() => {
        if (currentStep === 7) {
            const saved = localStorage.getItem('rb_test_checklist');
            if (saved) setChecklist(JSON.parse(saved));
        }
    }, [currentStep]);

    const toggleCheck = (key) => {
        const newChecklist = { ...checklist, [key]: !checklist[key] };
        setChecklist(newChecklist);
        localStorage.setItem('rb_test_checklist', JSON.stringify(newChecklist));

        // Mark step 7 as "artifact ready" if all are checked
        const allDone = Object.values(newChecklist).every(v => v);
        if (allDone) {
            localStorage.setItem('rb_step_7_artifact', 'completed');
            localStorage.setItem('rb_step_7_status', 'worked');
        } else {
            localStorage.removeItem('rb_step_7_artifact');
            localStorage.removeItem('rb_step_7_status');
        }
    };

    // Gating Logic
    useEffect(() => {
        if (currentStep > 1) {
            const prevStep = currentStep - 1;
            const prevArtifact = localStorage.getItem(`rb_step_${prevStep}_artifact`);
            if (!prevArtifact) {
                // navigate(getPathForStep(i)); 
            }
        }
    }, [currentStep, navigate]);

    const isPrevCompleted = currentStep === 1 || !!localStorage.getItem(`rb_step_${currentStep - 1}_artifact`);

    if (!isPrevCompleted) {
        return (
            <div className="max-w-xl mx-auto mt-20 p-12 bg-white border border-gray-100 rounded-3xl text-center space-y-6">
                <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-500">
                    <ShieldAlert size={40} />
                </div>
                <h1 className="text-3xl font-serif font-bold text-gray-900">Step Locked</h1>
                <p className="text-gray-500">Complete the previous milestone (Step {currentStep - 1}) to unlock this phase of the build.</p>
                <button
                    onClick={() => navigate(getPathForStep(currentStep - 1))}
                    className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors"
                >
                    Return to Step {currentStep - 1}
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid gap-8">
                {/* Content based on step */}
                <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm space-y-8">
                    <div className="flex items-center gap-4 text-primary">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                            <BookOpen size={24} />
                        </div>
                        <div className="text-xs font-bold uppercase tracking-widest">Milestone Guide</div>
                    </div>

                    <div className="prose prose-slate max-w-none">
                        <h3 className="text-xl font-bold text-gray-900">What to build in this step:</h3>
                        <p className="text-gray-600 leading-relaxed">
                            {getStepDescription(currentStep)}
                        </p>

                        {currentStep === 7 ? (
                            <div className="mt-8 space-y-4">
                                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">QA Test Checklist</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {Object.entries(checklistItems).map(([key, label]) => (
                                        <button
                                            key={key}
                                            onClick={() => toggleCheck(key)}
                                            className={`flex items-center gap-3 p-4 rounded-2xl border transition-all text-left ${checklist[key] ? 'bg-green-50 border-green-100 text-green-700' : 'bg-gray-50 border-gray-100 text-gray-500 hover:border-gray-200'}`}
                                        >
                                            <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${checklist[key] ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-200'}`}>
                                                {checklist[key] && <CheckCircle2 size={12} />}
                                            </div>
                                            <span className="text-xs font-bold">{label}</span>
                                        </button>
                                    ))}
                                </div>
                                {!Object.values(checklist).every(v => v) && (
                                    <div className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-center gap-3">
                                        <AlertCircle size={16} className="text-amber-500" />
                                        <p className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">Complete all 10 tests to unlock the Final Shipping step.</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="mt-8 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">Required Artifact</h4>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-2 text-sm text-gray-500">
                                        <CheckCircle2 size={16} className="text-gray-300" />
                                        <span>Detailed documentation or image uploaded</span>
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-gray-500">
                                        <CheckCircle2 size={16} className="text-gray-300" />
                                        <span>Confirmation of build success in build panel</span>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-blue-600 mb-2">Tips</h4>
                        <p className="text-xs text-blue-800 leading-relaxed">Use Lovable's image generation or chart tools to visualize your findings.</p>
                    </div>
                    <div className="bg-purple-50/50 p-6 rounded-2xl border border-purple-100">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-purple-600 mb-2">Tools</h4>
                        <p className="text-xs text-purple-800 leading-relaxed">ChatGPT for analysis, Figma for mockups, or Draw.io for architecture.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const checklistItems = {
    saveLocal: "Form sections save to localStorage",
    livePreview: "Live preview updates in real-time",
    templateSync: "Template switching preserves data",
    themePersist: "Color theme persists after refresh",
    atsCorrect: "ATS score calculates correctly",
    scoreLive: "Score updates live on edit",
    exportWork: "Export buttons work (copy/download)",
    emptyState: "Empty states handled gracefully",
    mobileResp: "Mobile responsive layout works",
    noErrors: "No console errors on any page"
};

const getStepDescription = (step) => {
    const descriptions = {
        1: "Clearly define the scope of the problem. Why do users need another resume builder? What specific pain points (ATS, formatting, content search) are we solving?",
        2: "Analyze the landscape. Look at competitors like Canva, Rezi, and Teal. What are they missing? How can AI give us an edge?",
        3: "Map the technical flow. How does a user's voice or text input transform into a formatted PDF? What AI models will handle which tasks?",
        4: "Design the user interface and experience. Focus on the flow from landing -> input -> preview -> export. Establish the styling tokens.",
        5: "Drill down into the data structures. Define how a 'Resume' object looks. What fields are mandatory? How do we store AI suggestions?",
        6: "This is where the magic happens. Implement the core engine that interfaces with the AI to generate resume content.",
        7: "Perform a comprehensive quality assurance sweep. Test the edge cases: very long resumes, empty inputs, weird characters, and export reliability using the checklist above.",
        8: "Ready for launch? Finalize your repository, documentation, and deployment pipeline. Ensure the project is public and accessible.",
    };
    return descriptions[step] || "Follow the instructions in the build panel to complete this milestone.";
};

const getPathForStep = (step) => {
    const paths = {
        1: '/rb/01-problem',
        2: '/rb/02-market',
        3: '/rb/03-architecture',
        4: '/rb/04-hld',
        5: '/rb/05-lld',
        6: '/rb/06-build',
        7: '/rb/07-test',
        8: '/rb/08-ship',
    };
    return paths[step];
};

export default RBStep;
