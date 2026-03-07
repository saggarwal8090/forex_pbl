import React from 'react';
import { Lightbulb, Info } from 'lucide-react';

const ExplanationPanel = ({ explanation }) => {
    if (!explanation) return null;

    return (
        <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/60 shadow-xl rounded-2xl p-5 flex flex-col w-full relative">
            <div className="flex items-center gap-2 mb-3">
                <Lightbulb size={20} className="text-amber-400" />
                <h3 className="text-lg font-bold text-slate-100 tracking-wide">AI Recommendation Logic</h3>
            </div>

            <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50 flex gap-3 shadow-inner">
                <Info size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-slate-300 text-sm leading-relaxed">
                    {explanation}
                </p>
            </div>
        </div>
    );
};

export default ExplanationPanel;
