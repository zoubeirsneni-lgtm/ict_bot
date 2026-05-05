import React, { useEffect, useState, useCallback, useRef } from 'react';
import { TradingChart } from './components/TradingChart';
import { Sidebar } from './components/Sidebar';
import { RiskPanel } from './components/RiskPanel';
import { DataService } from './services/dataService';
import { ICTService } from './services/ictService';
import { Candle, ICTPattern, Trade, RiskSettings } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, LayoutGrid, Settings, Wallet } from 'lucide-react';

const SYMBOL = 'BTCUSDT';

export default function App() {
  const [candles, setCandles] = useState<Candle[]>([]);
  const [patterns, setPatterns] = useState<ICTPattern[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [balance, setBalance] = useState(10000);
  const [riskSettings, setRiskSettings] = useState<RiskSettings>({
    stake: 100,
    expirySeconds: 60,
    maxDailyLoss: 500,
  });

  const dataServiceRef = useRef<DataService | null>(null);

  const handleNewCandle = useCallback((candle: Candle) => {
    setCandles(prev => {
      const updated = [...prev, candle].slice(-200);
      
      // Run ICT Analysis
      const mss = ICTService.detectMSS(updated);
      const fvg = ICTService.detectFVG(updated);
      
      const newPatterns = [...fvg];
      if (mss) newPatterns.push(mss);
      
      setPatterns(newPatterns);
      return updated;
    });
  }, []);

  useEffect(() => {
    const service = new DataService(SYMBOL, handleNewCandle);
    dataServiceRef.current = service;

    const init = async () => {
      const history = await service.fetchHistory(SYMBOL);
      setCandles(history);
      service.start();
    };

    init();

    return () => service.stop();
  }, [handleNewCandle]);

  const handleTrade = (type: 'CALL' | 'PUT') => {
    const lastCandle = candles[candles.length - 1];
    if (!lastCandle) return;

    const newTrade: Trade = {
      id: Math.random().toString(36).substr(2, 9),
      symbol: SYMBOL,
      type,
      entryPrice: lastCandle.close,
      amount: riskSettings.stake,
      expiryTime: Date.now() + (riskSettings.expirySeconds * 1000),
      status: 'OPEN',
      timestamp: Date.now(),
    };

    setTrades(prev => [newTrade, ...prev]);
    setBalance(prev => prev - riskSettings.stake);

    // Simulate resolution
    setTimeout(() => {
      setTrades(currentTrades => {
        return currentTrades.map(t => {
          if (t.id === newTrade.id) {
            // In a real app we'd fetch the price at expiryTime
            const win = Math.random() > 0.45; // Simulated 55% win rate for demo
            if (win) {
              setBalance(b => b + (riskSettings.stake * 1.8)); // 80% payout
              return { ...t, status: 'WIN' };
            } else {
              return { ...t, status: 'LOSS' };
            }
          }
          return t;
        });
      });
    }, riskSettings.expirySeconds * 1000);
  };

  return (
    <div className="h-screen w-screen bg-[#0A0A0A] text-white flex flex-col font-sans selection:bg-white/10 selection:text-white overflow-hidden">
      {/* Top Navbar */}
      <nav className="h-14 border-bottom border-white/10 flex items-center justify-between px-6 bg-white/5 backdrop-blur-md z-50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center">
                <Activity size={20} className="text-black" />
             </div>
             <h1 className="text-sm font-black uppercase italic tracking-tighter">ICT Pulse v1.0</h1>
          </div>
          
          <div className="h-4 w-px bg-white/20" />
          
          <div className="flex gap-4">
            <button className="text-[10px] font-bold uppercase tracking-widest text-white/50 hover:text-white flex items-center gap-1.5 transition-colors">
              <LayoutGrid size={12} /> Dashboard
            </button>
            <button className="text-[10px] font-bold uppercase tracking-widest text-white flex items-center gap-1.5 transition-colors">
              <Activity size={12} className="text-green-500" /> Live Feed
            </button>
            <button className="text-[10px] font-bold uppercase tracking-widest text-white/50 hover:text-white flex items-center gap-1.5 transition-colors">
              <Settings size={12} /> Strategy
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-sm border border-white/10">
            <Wallet size={14} className="text-white/40" />
            <span className="text-xs font-mono font-bold">${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 border border-white/20" />
        </div>
      </nav>

      {/* Main Container */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Side: Chart & Controls */}
        <div className="flex-1 flex flex-col relative">
          <div className="flex-1">
             <TradingChart data={candles} patterns={patterns} symbol={SYMBOL} />
          </div>
          <RiskPanel 
            settings={riskSettings}
            onChange={setRiskSettings}
            onTrade={handleTrade}
            balance={balance}
          />
        </div>

        {/* Right Side: Sidebar */}
        <Sidebar 
          signals={patterns} 
          portfolio={trades}
          onSelectSignal={(s) => console.log('Focus on', s)} 
        />
      </main>

      {/* Trade Resolution Notifications */}
      <div className="fixed bottom-32 right-8 w-64 pointer-events-none z-[100]">
        <AnimatePresence>
          {trades.slice(0, 3).map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`mb-2 p-3 rounded border backdrop-blur-xl ${
                t.status === 'WIN' ? 'bg-green-500/20 border-green-500/50' : 
                t.status === 'LOSS' ? 'bg-red-500/20 border-red-500/50' : 
                'bg-white/10 border-white/20'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">{t.type} {SYMBOL}</span>
                <span className={`text-[10px] font-bold uppercase ${
                  t.status === 'WIN' ? 'text-green-500' : 
                  t.status === 'LOSS' ? 'text-red-500' : 'text-white'
                }`}>
                  {t.status}
                </span>
              </div>
              <div className="text-lg font-mono font-bold mt-1">
                {t.status === 'WIN' ? `+$${(t.amount * 0.8).toFixed(2)}` : `-$${t.amount.toFixed(2)}`}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
