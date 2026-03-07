import React from 'react';
import { Activity, Gauge, TrendingUp, AlertTriangle } from 'lucide-react';

const IndicatorsPanel = ({ indicators, summary }) => {
    if (!indicators) return null;

    const rsiColor = summary.RSI === 'Overbought' ? 'text-rose-400' : summary.RSI === 'Oversold' ? 'text-emerald-400' : 'text-slate-300';
    const macdColor = summary.MACD.includes('Bullish') ? 'text-emerald-400' : summary.MACD.includes('Bearish') ? 'text-rose-400' : 'text-slate-300';
    const volColor = summary.Volatility === 'High' ? 'text-rose-400' : summary.Volatility === 'Low' ? 'text-emerald-400' : 'text-amber-400';

    return (
        <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/60 shadow-xl rounded-2xl p-5 flex flex-col w-full relative group">
            <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-r-2xl pointer-events-none"></div>

            <div className="flex items-center gap-2 mb-4">
                <Activity size={20} className="text-indigo-400" />
                <h3 className="text-lg font-bold text-slate-100 tracking-wide">Technical Indicators</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {/* RSI Item */}
                <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-4 flex flex-col justify-between hover:bg-slate-700/30 transition-colors shadow-inner">
                    <span className="text-xs uppercase font-bold text-slate-500 mb-2 font-mono flex items-center justify-between">
                        RSI
                        <Gauge size={14} className={rsiColor} />
                    </span>
                    <div>
                        <div className="text-xl font-bold font-mono text-white mb-0.5">{indicators.RSI.toFixed(2)}</div>
                        <div className={`text-xs font-semibold tracking-wide ${rsiColor}`}>{summary.RSI}</div>
                    </div>
                </div>

                {/* MACD Item */}
                <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-4 flex flex-col justify-between hover:bg-slate-700/30 transition-colors shadow-inner">
                    <span className="text-xs uppercase font-bold text-slate-500 mb-2 font-mono flex items-center justify-between">
                        MACD Histogram
                        <TrendingUp size={14} className={macdColor} />
                    </span>
                    <div>
                        <div className="text-xl font-bold font-mono text-white mb-0.5">{(indicators.MACD - indicators.MACD_Signal).toFixed(4)}</div>
                        <div className={`text-xs font-semibold tracking-wide ${macdColor}`}>{summary.MACD}</div>
                    </div>
                </div>

                {/* SMA Item */}
                <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-4 flex flex-col justify-between hover:bg-slate-700/30 transition-colors shadow-inner">
                    <span className="text-xs uppercase font-bold text-slate-500 mb-2 font-mono">SMA (20)</span>
                    <div className="text-xl font-bold font-mono text-white mt-auto">{indicators.SMA_20.toFixed(4)}</div>
                </div>

                {/* EMA Item */}
                <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-4 flex flex-col justify-between hover:bg-slate-700/30 transition-colors shadow-inner">
                    <span className="text-xs uppercase font-bold text-slate-500 mb-2 font-mono">EMA (20)</span>
                    <div className="text-xl font-bold font-mono text-white mt-auto">{indicators.EMA_20.toFixed(4)}</div>
                </div>

                {/* ATR Volatility */}
                <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-4 flex flex-col justify-between hover:bg-slate-700/30 transition-colors shadow-inner">
                    <span className="text-xs uppercase font-bold text-slate-500 mb-2 font-mono flex items-center justify-between">
                        ATR
                        <AlertTriangle size={14} className={volColor} />
                    </span>
                    <div>
                        <div className="text-xl font-bold font-mono text-white mb-0.5">{indicators.ATR.toFixed(4)}</div>
                        <div className={`text-xs font-semibold tracking-wide ${volColor}`}>Vol: {summary.Volatility}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IndicatorsPanel;
