import React, { useEffect, useRef } from 'react';
import { createChart, LineSeries } from 'lightweight-charts';

const ChartPanel = ({ data, currentConfig, latestPrice }) => {
    const chartContainerRef = useRef();
    const chartInstanceRef = useRef();
    const lineSeriesRef = useRef();

    // Initialize chart
    useEffect(() => {
        if (!chartContainerRef.current) return;

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: 'solid', color: 'transparent' },
                textColor: '#94a3b8', // slate-400
            },
            grid: {
                vertLines: { color: '#334155' }, // slate-700
                horzLines: { color: '#334155' },
            },
            width: chartContainerRef.current.clientWidth,
            height: 400,
            timeScale: {
                timeVisible: true,
                secondsVisible: false,
                borderColor: '#475569',
            },
            rightPriceScale: {
                borderColor: '#475569',
            },
            crosshair: {
                mode: 1, // Normal crosshair
                vertLine: { width: 1, color: '#64748b', style: 3 },
                horzLine: { width: 1, color: '#64748b', style: 3 },
            }
        });

        // Lightweight charts v5 format
        const lineSeries = chart.addSeries(LineSeries, {
            color: '#6366f1',
            lineWidth: 2,
            crosshairMarkerVisible: true,
            crosshairMarkerRadius: 6,
            crosshairMarkerBorderColor: '#fff',
            crosshairMarkerBackgroundColor: '#4f46e5',
        });

        chartInstanceRef.current = chart;
        lineSeriesRef.current = lineSeries;

        const handleResize = () => {
            if (chartContainerRef.current) {
                chart.applyOptions({ width: chartContainerRef.current.clientWidth });
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, []);

    // Update Data
    useEffect(() => {
        if (lineSeriesRef.current && data && data.length > 0) {
            // Data needs to be ordered by time ascending
            try {
                const validData = [...data].filter(d => d && d.time !== undefined && !isNaN(d.time)).sort((a, b) => a.time - b.time);

                // remove exact duplicate timestamps for lightweight charts requirement
                const uniqueData = [];
                for (let i = 0; i < validData.length; i++) {
                    if (i === 0 || validData[i].time !== validData[i - 1].time) {
                        uniqueData.push(validData[i]);
                    }
                }

                lineSeriesRef.current.setData(uniqueData);
            } catch (e) {
                console.warn("Chart data error", e);
            }
        }
    }, [data]);

    return (
        <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/60 shadow-xl rounded-2xl p-4 flex flex-col w-full min-h-[460px] relative">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-t-2xl"></div>

            <div className="flex items-center justify-between mb-4 mt-1 px-2">
                <div>
                    <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-400">
                        {currentConfig && currentConfig.pair ? currentConfig.pair.replace('INR', '/INR') : 'Live'} Chart
                    </h2>
                    <span className="text-sm font-medium text-slate-400 tracking-wider">
                        Tick Engine ({currentConfig ? currentConfig.timeframe : 'N/A'})
                    </span>
                </div>

                {/* Latest Price badge */}
                {(latestPrice !== null && latestPrice !== undefined) && (
                    <div className="bg-slate-900 border border-slate-700 px-4 py-2 rounded-xl flex items-center shadow-inner gap-2">
                        <span className="text-slate-400 text-sm font-medium mr-1 tracking-widest">LIVE</span>
                        <span className="text-xl font-bold text-white font-mono break-all">
                            ₹{typeof latestPrice === 'number' ? latestPrice.toFixed(4) : latestPrice}
                        </span>
                    </div>
                )}
            </div>

            <div
                ref={chartContainerRef}
                className="flex-1 w-full bg-slate-900/50 rounded-xl overflow-hidden border border-slate-700/50 shadow-inner"
            />
        </div>
    );
};

export default ChartPanel;
