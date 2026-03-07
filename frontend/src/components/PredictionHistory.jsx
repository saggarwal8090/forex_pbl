import React from 'react';
import { History, CheckCircle, XCircle, MinusCircle } from 'lucide-react';

const PredictionHistory = ({ trackerStats }) => {
    if (!trackerStats) return null;

    const { total_resolved, accuracy_percent, history } = trackerStats;

    return (
        <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/60 shadow-xl rounded-2xl p-5 flex flex-col w-full">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <History size={20} className="text-purple-400" />
                    <h3 className="text-lg font-bold text-slate-100 tracking-wide">Prediction Accuracy Tracker</h3>
                </div>

                {/* Stats Pills */}
                <div className="hidden sm:flex items-center gap-3 text-xs font-mono">
                    <span className="bg-slate-900 border border-slate-700 px-3 py-1 rounded-lg text-slate-300">Total: {total_resolved}</span>
                    <span className="bg-emerald-900/30 border border-emerald-700/50 text-emerald-400 px-3 py-1 rounded-lg">Accuracy: {accuracy_percent}%</span>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-900/50 rounded-t-lg">
                        <tr>
                            <th className="px-4 py-3 rounded-tl-lg">Time</th>
                            <th className="px-4 py-3">Pair</th>
                            <th className="px-4 py-3">Predicted</th>
                            <th className="px-4 py-3">Init Price</th>
                            <th className="px-4 py-3">Final Price</th>
                            <th className="px-4 py-3 rounded-tr-lg">Result</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.slice(0, 10).map((pred) => (
                            <tr key={pred.id} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors">
                                <td className="px-4 py-3 font-mono text-xs">{new Date(pred.timestamp * 1000).toLocaleTimeString()}</td>
                                <td className="px-4 py-3 text-slate-200 font-medium">{pred.pair}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 text-xs font-bold rounded ${pred.predicted_signal === 'BUY' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                        pred.predicted_signal === 'AVOID' || pred.predicted_signal === 'SELL' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                                            'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                                        }`}>
                                        {pred.predicted_signal}
                                    </span>
                                </td>
                                <td className="px-4 py-3 font-mono">{pred.price_at_prediction.toFixed(4)}</td>
                                <td className="px-4 py-3 font-mono">{pred.resolution_price ? pred.resolution_price.toFixed(4) : '-'}</td>
                                <td className="px-4 py-3">
                                    {pred.status === 'correct' ? <CheckCircle size={16} className="text-emerald-400" /> :
                                        pred.status === 'incorrect' ? <XCircle size={16} className="text-rose-400" /> :
                                            <span className="flex items-center gap-1 text-slate-500 text-xs"><MinusCircle size={14} /> Pending</span>}
                                </td>
                            </tr>
                        ))}
                        {history.length === 0 && (
                            <tr>
                                <td colSpan="6" className="px-4 py-8 text-center text-slate-500 italic">No predictions logged yet. Waiting for market data.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PredictionHistory;
