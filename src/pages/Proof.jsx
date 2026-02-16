import React from 'react';
import { Package, ShieldCheck, FileCheck, Layers } from 'lucide-react';

const Proof = () => {
    return (
        <div className="flex-1 flex flex-col items-center justify-center p-12 bg-white">
            <div className="max-w-2xl w-full space-y-12 text-center">
                <div className="space-y-4">
                    <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto text-white shadow-xl">
                        <Package size={32} />
                    </div>
                    <h1 className="text-4xl font-serif font-bold text-gray-900 tracking-tight">Project Artifacts</h1>
                    <p className="text-gray-500 max-w-md mx-auto">This page will store the final deliverables, deployment logs, and certification proofs for your AI Resume Builder project.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    <ArtifactCard
                        icon={<ShieldCheck className="text-green-500" />}
                        title="Development Proof"
                        description="Verification of the 8-step build track completion."
                        status="Ready"
                    />
                    <ArtifactCard
                        icon={<FileCheck className="text-blue-500" />}
                        title="deployment.json"
                        description="Vercel/GitHub deployment metadata."
                        status="Pending"
                    />
                    <ArtifactCard
                        icon={<Layers className="text-purple-500" />}
                        title="architecture.pdf"
                        description="System design and documentation artifact."
                        status="Pending"
                    />
                    <div className="p-8 border-2 border-dashed border-gray-100 rounded-3xl flex flex-col items-center justify-center opacity-40">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Add custom artifact</div>
                    </div>
                </div>

                <div className="pt-8 opacity-20 italic font-serif">
                    "Evidence of excellence is the ultimate project requirement."
                </div>
            </div>
        </div>
    );
};

const ArtifactCard = ({ icon, title, description, status }) => (
    <div className="p-6 bg-gray-50 border border-gray-100 rounded-3xl space-y-3 transition-all hover:shadow-lg hover:-translate-y-1 group">
        <div className="flex justify-between items-start">
            <div className="p-3 bg-white rounded-xl shadow-sm">
                {icon}
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded border ${status === 'Ready' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                {status}
            </span>
        </div>
        <h3 className="font-bold text-gray-900">{title}</h3>
        <p className="text-xs text-gray-500 leading-relaxed font-medium">{description}</p>
    </div>
);

export default Proof;
