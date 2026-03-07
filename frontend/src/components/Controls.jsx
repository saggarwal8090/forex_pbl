import React from 'react';
import { Activity } from 'lucide-react';

const Controls = ({ config, setConfig, isConnected }) => {
    const handlePairChange = (e) => setConfig({ ...config, pair: e.target.value });
    const handleTimeframeChange = (e) => setConfig({ ...config, timeframe: e.target.value });

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-800/80 backdrop-blur-md border border-slate-700/60 shadow-xl rounded-2xl w-full relative overflow-hidden">
            {/* Glossy overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-500/5 to-purple-500/10 pointer-events-none"></div>

            <div className="flex flex-wrap items-center gap-4 z-10 w-full lg:w-auto">
                {/* Currency Pair */}
                <div className="flex flex-col">
                    <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 ml-1 tracking-wider">Pair</label>
                    <select
                        value={config.pair}
                        onChange={handlePairChange}
                        className="bg-slate-900 border border-slate-600 text-white text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2 cursor-pointer outline-none transition-all shadow-inner"
                    >
                        <option value="USDINR">USD / INR</option>
                        <option value="EURINR">EUR / INR</option>
                        <option value="GBPINR">GBP / INR</option>
                        <option value="JPYINR">JPY / INR</option>
                    </select>
                </div>

                {/* Timeframe */}
                <div className="flex flex-col">
                    <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 ml-1 tracking-wider">Timeframe</label>
                    <select
                        value={config.timeframe}
                        onChange={handleTimeframeChange}
                        className="bg-slate-900 border border-slate-600 text-white text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2 cursor-pointer outline-none transition-all shadow-inner"
                    >
                        <option value="1m">1 minute</option>
                        <option value="5m">5 minutes</option>
                        <option value="15m">15 minutes</option>
                        <option value="1h">1 hour</option>
                    </select>
                </div>

                {/* Risk Preference */}
                <div className="flex flex-col">
                    <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 ml-1 tracking-wider">Risk Level</label>
                    <div className="flex bg-slate-900 rounded-lg p-0.5 border border-slate-700">
                        {['low', 'medium', 'high'].map(r => (
                            <button
                                key={r}
                                onClick={() => setConfig({ ...config, risk: r })}
                                className={`px-4 py-1.5 text-xs font-semibold rounded-md capitalize transition-all duration-300 ${config.risk === r
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                    }`}
                            >
                                {r}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3 z-10 w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-900/50 border border-slate-700/50">
                <Activity size={18} className={isConnected ? "text-emerald-400 animate-pulse" : "text-rose-400"} />
                <span className="text-sm font-medium text-slate-300">
                    {isConnected ? "Engine Sync Active" : "Connecting..."}
                </span>
            </div>
        </div>
    );
};

export default Controls;
