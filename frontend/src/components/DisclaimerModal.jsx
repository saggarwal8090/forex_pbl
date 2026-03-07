import React from 'react';
import { Skull, X } from 'lucide-react';

const DisclaimerModal = ({ onAccept, onDecline }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
            {/* Retro Windows-style dialog */}
            <div className="w-[420px] max-w-[90vw] shadow-2xl rounded-sm overflow-hidden border-2 border-slate-500/60 animate-scale-in"
                style={{
                    background: 'linear-gradient(180deg, #1a1f35 0%, #0d1117 100%)',
                    boxShadow: '0 0 60px rgba(99, 102, 241, 0.15), inset 0 1px 0 rgba(255,255,255,0.05)',
                }}>

                {/* Title Bar — retro style */}
                <div className="flex items-center justify-between px-3 py-2"
                    style={{
                        background: 'linear-gradient(90deg, #1e3a5f 0%, #0f1b2d 100%)',
                        borderBottom: '1px solid #2a3a5a',
                    }}>
                    <span className="text-sm font-bold text-slate-200 tracking-wide font-mono">Trading Error</span>
                    <button
                        onClick={onDecline}
                        className="w-6 h-6 flex items-center justify-center border border-slate-500/50 bg-slate-800/50 hover:bg-rose-600/80 transition-colors rounded-sm text-slate-300 hover:text-white"
                    >
                        <X size={14} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 flex gap-5">
                    {/* Skull Icon */}
                    <div className="flex-shrink-0 pt-1">
                        <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-600/50 flex items-center justify-center shadow-inner">
                            <Skull size={28} className="text-slate-300" />
                        </div>
                    </div>

                    {/* Text */}
                    <div className="flex flex-col gap-4">
                        <h2 className="text-xl font-bold text-slate-100 tracking-tight">Welcome to Trading</h2>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Where you pay for every single mistake with <span className="text-slate-200 font-semibold">dollars</span>, not apologies.
                        </p>
                        <p className="text-slate-400 text-sm italic">Are you ready to start?</p>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-end gap-3 px-6 pb-6">
                    <button
                        onClick={onDecline}
                        className="px-6 py-2 text-sm font-bold text-slate-300 border border-slate-600/60 bg-slate-800/60 hover:bg-slate-700/80 rounded-sm transition-all tracking-wide shadow-inner cursor-pointer"
                    >
                        Go Back
                    </button>
                    <button
                        onClick={onAccept}
                        className="px-6 py-2 text-sm font-bold text-white border border-indigo-500/40 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 rounded-sm transition-all tracking-wide shadow-lg shadow-indigo-500/20 cursor-pointer"
                    >
                        Start
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DisclaimerModal;
