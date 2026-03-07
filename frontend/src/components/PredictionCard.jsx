import React from 'react';
import { Target, ShieldAlert, Cpu } from 'lucide-react';

const PredictionCard = ({ recommendationInfo }) => {
    const { recommendation, confidence_score, risk_score, trend, probabilities } = recommendationInfo;

    // Determine vibrant styles based on recommendation
    let coreGradient = "";
    let recLabel = "";
    let glowColor = "";

    if (recommendation === "BUY") {
        coreGradient = "from-emerald-600 via-emerald-500 to-teal-400";
        recLabel = "STRONG BUY";
        glowColor = "shadow-emerald-500/30";
    } else if (recommendation === "AVOID" || recommendation === "SELL") {
        coreGradient = "from-rose-600 via-rose-500 to-orange-500";
        recLabel = "AVOID / SELL";
        glowColor = "shadow-rose-500/30";
    } else {
        coreGradient = "from-slate-600 via-slate-500 to-slate-400";
        recLabel = "HOLD POSITION";
        glowColor = "shadow-slate-500/10";
    }

    return (
        <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/60 shadow-xl rounded-2xl flex flex-col h-full min-h-[500px] overflow-hidden relative">
            {/* Decorative Top Banner */}
            <div className={`h-32 bg-gradient-to-br ${coreGradient} w-full flex flex-col items-center justify-center p-6 relative ${glowColor} shadow-xl`}>
                <div className="absolute top-4 left-4 right-4 flex justify-between items-center opacity-70">
                    <Cpu size={18} className="text-white" />
                    <div className="text-xs font-mono text-white tracking-widest bg-black/20 px-2 py-1 rounded backdrop-blur">AI OUTPUT</div>
                </div>

                <h2 className="text-4xl font-black text-white uppercase tracking-wider drop-shadow-md z-10 text-center flex-1 flex items-center justify-center pt-4">
                    {recLabel}
                </h2>
            </div>

            <div className="flex-1 p-6 flex flex-col gap-6">
                {/* Confidence Score */}
                <div className="flex flex-col gap-2 relative">
                    <div className="flex justify-between items-end">
                        <span className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                            <Target size={14} className="text-blue-400" />
                            Machine Confidence
                        </span>
                        <span className="text-2xl font-black font-mono text-white">{confidence_score}%</span>
                    </div>

                    <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-700/80 shadow-inner">
                        <div
                            className={`h-full rounded-full transition-all duration-1000 bg-gradient-to-r ${coreGradient}`}
                            style={{ width: `${confidence_score}%` }}
                        ></div>
                    </div>
                </div>

                {/* Risk Score */}
                <div className="flex flex-col gap-2 relative">
                    <div className="flex justify-between items-end">
                        <span className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                            <ShieldAlert size={14} className={risk_score > 60 ? "text-rose-400" : "text-amber-400"} />
                            Calculated Risk Index
                        </span>
                        <span className={`text-xl font-bold font-mono ${risk_score > 70 ? 'text-rose-400' : 'text-slate-200'}`}>
                            {risk_score}%
                        </span>
                    </div>

                    <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-700/80 shadow-inner">
                        <div
                            className={`h-full rounded-full transition-all duration-1000 ${risk_score > 60 ? 'bg-gradient-to-r from-orange-400 to-rose-500' : 'bg-gradient-to-r from-emerald-400 to-amber-500'}`}
                            style={{ width: `${risk_score}%` }}
                        ></div>
                    </div>
                </div>

                <div className="h-px w-full bg-slate-700/50 my-2"></div>

                {/* Probabilities Breakdown */}
                <div className="flex-1 flex flex-col">
                    <h4 className="text-xs font-bold uppercase text-slate-500 tracking-widest mb-4">Probability Spread</h4>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-emerald-400 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-400"></div> BUY
                            </span>
                            <span className="font-mono text-slate-300">{(probabilities.buy * 100).toFixed(1)}%</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-slate-400 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-slate-400"></div> HOLD
                            </span>
                            <span className="font-mono text-slate-300">{(probabilities.hold * 100).toFixed(1)}%</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-rose-400 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-rose-400"></div> AVOID
                            </span>
                            <span className="font-mono text-slate-300">{(probabilities.avoid * 100).toFixed(1)}%</span>
                        </div>
                    </div>
                </div>

                {/* Global Trend summary bottom */}
                <div className="mt-auto bg-slate-900/50 border border-slate-700/40 rounded-xl p-4 flex items-center justify-between shadow-inner">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Engine Analysis:</span>
                    <span className={`text-sm font-bold uppercase py-1 px-3 rounded-md bg-slate-800 ${trend === 'Bullish' ? 'text-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.1)]' :
                            trend === 'Bearish' ? 'text-rose-400 shadow-[0_0_10px_rgba(251,113,133,0.1)]' :
                                'text-slate-300'
                        }`}>
                        {trend} TREND
                    </span>
                </div>

            </div>
        </div>
    );
};

export default PredictionCard;
