import React, { useState, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import Controls from './Controls';
import ChartPanel from './ChartPanel';
import PredictionCard from './PredictionCard';
import IndicatorsPanel from './IndicatorsPanel';
import ExplanationPanel from './ExplanationPanel';
import PredictionHistory from './PredictionHistory';
import { ErrorBoundary } from 'react-error-boundary';

const Dashboard = () => {
    const [config, setConfig] = useState({ pair: 'USDINR', timeframe: '5m', risk: 'medium' });
    const [priceData, setPriceData] = useState([]);
    const [latestTick, setLatestTick] = useState(null);

    const fallbackRender = ({ error, resetErrorBoundary }) => {
        return (
            <div className="bg-rose-900/50 border border-rose-500 rounded-xl p-6 text-white text-center flex flex-col items-center justify-center min-h-[400px]">
                <h2 className="text-xl font-bold mb-4">Something went wrong in the Dashboard.</h2>
                <pre className="text-rose-200 text-sm bg-black/30 p-4 rounded overflow-auto max-w-full mb-4">
                    {error.message}
                </pre>
                <button
                    onClick={resetErrorBoundary}
                    className="bg-rose-500 hover:bg-rose-600 px-4 py-2 rounded font-bold"
                >
                    Try again
                </button>
            </div>
        );
    };

    const WS_URL = import.meta.env.VITE_WS_URL || `ws://${window.location.hostname}:8000/ws/dashboard1`;
    const { sendMessage, lastMessage, readyState } = useWebSocket(WS_URL, {
        shouldReconnect: () => true,
        reconnectAttempts: 10,
        reconnectInterval: 3000,
    });

    useEffect(() => {
        // Send current config to backend when component mounts or config changes
        if (readyState === ReadyState.OPEN) {
            sendMessage(JSON.stringify(config));
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setPriceData([]);
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setLatestTick(null);
        }
    }, [config, readyState, sendMessage]);

    useEffect(() => {
        if (lastMessage !== null) {
            try {
                const data = JSON.parse(lastMessage.data);
                if (data.type === 'tick') {
                    if (data.pair !== config.pair) return; // Prevent mixing old data

                    // eslint-disable-next-line react-hooks/set-state-in-effect
                    setLatestTick(data);
                    // Append to chart data (keep last 500)
                    // eslint-disable-next-line react-hooks/set-state-in-effect
                    setPriceData(prev => {
                        const newPoint = { time: data.timestamp / 1000, value: data.price };
                        // Simple logic handling for lightweight-charts requiring strictly increasing time
                        if (prev.length > 0 && newPoint.time <= prev[prev.length - 1].time) {
                            return prev; // ignore older/duplicate timestamps for simple line chart
                        }
                        const updated = [...prev, newPoint];
                        if (updated.length > 500) return updated.slice(updated.length - 500);
                        return updated;
                    });
                }
            } catch (err) {
                console.error("WS Parse error", err);
            }
        }
    }, [lastMessage, config.pair]);

    return (
        <ErrorBoundary fallbackRender={fallbackRender} onReset={() => setPriceData([])}>
            <div className="flex flex-col gap-6 w-full">
                {/* Top Controls */}
                <Controls config={config} setConfig={setConfig} isConnected={readyState === ReadyState.OPEN} />

                {/* Main Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Chart & Indicators & Explanation */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <ChartPanel data={priceData} currentConfig={config} latestPrice={latestTick?.price} />
                        {latestTick && <IndicatorsPanel indicators={latestTick.indicators} summary={latestTick.indicator_summary} />}
                        {latestTick && latestTick.explanation && <ExplanationPanel explanation={latestTick.explanation} />}
                    </div>

                    {/* Right Column: AI Prediction Engine & Tracker */}
                    <div className="lg:col-span-1 flex flex-col gap-6">
                        {latestTick ? (
                            <PredictionCard recommendationInfo={latestTick} />
                        ) : (
                            <div className="h-[500px] w-full flex items-center justify-center bg-slate-800 rounded-xl border border-slate-700 animate-pulse text-slate-400">
                                Waiting for live market data...
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Row: Prediction History / Accuracy */}
                <div className="w-full">
                    {latestTick && latestTick.tracker_stats && (
                        <PredictionHistory trackerStats={latestTick.tracker_stats} />
                    )}
                </div>
            </div>
        </ErrorBoundary>
    );
};

export default Dashboard;
