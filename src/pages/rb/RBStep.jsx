import React, { useEffect } from 'react';
import { useParams, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { ShieldAlert, BookOpen, CheckCircle2 } from 'lucide-react';

const RBStep = () => {
    const { pathname } = useLocation();
    const navigate = useNavigate();

    // Extract step number
    const stepMatch = pathname.match(/\/rb\/(\d+)-/);
    const currentStep = stepMatch ? parseInt(stepMatch[1]) : 0;

    // Gating Logic
    useEffect(() => {
        if (currentStep > 1) {
            const prevStep = currentStep - 1;
            const prevArtifact = localStorage.getItem(`rb_step_${prevStep}_artifact`);
            if (!prevArtifact) {
                // Redirect to the last available step or step 1
                for (let i = currentStep - 1; i >= 1; i--) {
                    if (localStorage.getItem(`rb_step_${i}_artifact`) || i === 1) {
                        // navigate(getPathForStep(i)); // This might cause infinite loops if not careful
                        // Better to just show a "Locked" state if we want to be fancy.
                        // For now, let's keep it simple: if they try to access a step without prev, we'll show an error in the UI.
                        break;
                    }
                }
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

const getStepDescription = (step) => {
    const descriptions = {
        1: "Clearly define the scope of the problem. Why do users need another resume builder? What specific pain points (ATS, formatting, content search) are we solving?",
        2: "Analyze the landscape. Look at competitors like Canva, Rezi, and Teal. What are they missing? How can AI give us an edge?",
        3: "Map the technical flow. How does a user's voice or text input transform into a formatted PDF? What AI models will handle which tasks?",
        4: "Design the user interface and experience. Focus on the flow from landing -> input -> preview -> export. Establish the styling tokens.",
        5: "Drill down into the data structures. Define how a 'Resume' object looks. What fields are mandatory? How do we store AI suggestions?",
        6: "This is where the magic happens. Implement the core engine that interfaces with the AI to generate resume content.",
        7: "Verify every feature. Test the edge cases: very long resumes, empty inputs, weird characters, and export reliability.",
        8: "Ready for launch? Finalize your repository, documentation, and deployment pipeline. ensure the project is public and accessible.",
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
