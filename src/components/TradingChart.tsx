import { createChart, IChartApi, ISeriesApi, CandlestickData, CandlestickSeries } from 'lightweight-charts';
import React, { useEffect, useRef } from 'react';
import { Candle, ICTPattern, SignalType } from '../types';

interface TradingChartProps {
  data: Candle[];
  patterns: ICTPattern[];
  symbol: string;
}

export const TradingChart: React.FC<TradingChartProps> = ({ data, patterns, symbol }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: '#0A0A0A' },
        textColor: '#D1D4DC',
      },
      grid: {
        vertLines: { color: 'rgba(42, 46, 57, 0.5)' },
        horzLines: { color: 'rgba(42, 46, 57, 0.5)' },
      },
      crosshair: {
        mode: 0,
      },
      timeScale: {
        borderColor: 'rgba(197, 203, 206, 0.8)',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    chartRef.current = chart;
    candlestickSeriesRef.current = candlestickSeries as any;

    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current?.clientWidth });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  useEffect(() => {
    const series = candlestickSeriesRef.current;
    if (series && data.length > 0) {
      const formattedData: CandlestickData[] = data.map(c => ({
        time: c.time as any,
        open: c.open,
        high: c.high,
        low: c.low,
        close: c.close,
      }));
      
      series.setData(formattedData);

      // Add markers for patterns
      const markers = patterns.map(p => ({
        time: p.time as any,
        position: p.type.includes('BULL') ? 'belowBar' as const : 'aboveBar' as const,
        color: p.type.includes('BULL') ? '#26a69a' : '#ef5350',
        shape: p.type.includes('MSS') ? 'arrowUp' as const : 'circle' as const,
        text: p.type,
      }));

      // In some versions of Lightweight Charts v5, setMarkers might be hidden or on a different sub-property
      // We check for it defensively and use any cast to ensure calls go through if present
      if (typeof series.setMarkers === 'function') {
        series.setMarkers(markers);
      } else if (typeof (series as any).createMarkers === 'function') {
        (series as any).createMarkers(markers);
      }
    }
  }, [data, patterns]);

  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="absolute top-4 left-4 z-10 flex items-center gap-4">
        <h2 className="text-2xl font-bold text-white tracking-tighter uppercase italic">{symbol}</h2>
        {data.length > 0 && (
          <div className={`text-lg font-mono ${data[data.length - 1].close >= data[data.length - 1].open ? 'text-[#26a69a]' : 'text-[#ef5350]'}`}>
            {data[data.length - 1].close.toFixed(2)}
          </div>
        )}
      </div>
      <div ref={chartContainerRef} className="flex-1 w-full" />
    </div>
  );
};
