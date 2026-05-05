import { Clock, DollarSign, ShieldCheck } from 'lucide-react';
import React from 'react';
import { RiskSettings } from '../types';

interface RiskPanelProps {
  settings: RiskSettings;
  onChange: (settings: RiskSettings) => void;
  onTrade: (type: 'CALL' | 'PUT') => void;
  balance: number;
}

export const RiskPanel: React.FC<RiskPanelProps> = ({ settings, onChange, onTrade, balance }) => {
  return (
    <div className="p-6 bg-[#111] border-t border-white/10 flex items-center justify-between">
      <div className="flex items-center gap-12">
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 flex items-center gap-1">
            <DollarSign size={10} />
            Amount
          </label>
          <input 
            type="number"
            value={settings.stake}
            onChange={(e) => onChange({ ...settings, stake: Number(e.target.value) })}
            className="bg-transparent text-xl font-mono text-white border-b border-white/20 focus:border-white focus:outline-none w-24"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 flex items-center gap-1">
            <Clock size={10} />
            Expiry (Sec)
          </label>
          <select 
            value={settings.expirySeconds}
            onChange={(e) => onChange({ ...settings, expirySeconds: Number(e.target.value) })}
            className="bg-transparent text-xl font-mono text-white border-b border-white/20 focus:border-white focus:outline-none cursor-pointer"
          >
            <option value={60} className="bg-[#111]">60S</option>
            <option value={120} className="bg-[#111]">120S</option>
            <option value={300} className="bg-[#111]">300S</option>
          </select>
        </div>

        <div className="space-y-1 hidden md:block">
          <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 flex items-center gap-1">
            <ShieldCheck size={10} />
            Session Equity
          </label>
          <div className="text-xl font-mono text-white">
            ${balance.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button 
          onClick={() => onTrade('CALL')}
          className="relative group overflow-hidden bg-[#26a69a] text-white px-8 py-4 rounded font-black italic uppercase text-lg tracking-tighter hover:scale-105 active:scale-95 transition-all"
        >
          <div className="relative z-10 flex items-center gap-2">
            CALL <TrendingUp size={20} />
          </div>
          <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[0%] skew-x-12 transition-transform duration-300" />
        </button>

        <button 
          onClick={() => onTrade('PUT')}
          className="relative group overflow-hidden bg-[#ef5350] text-white px-8 py-4 rounded font-black italic uppercase text-lg tracking-tighter hover:scale-105 active:scale-95 transition-all"
        >
          <div className="relative z-10 flex items-center gap-2">
            PUT <TrendingDown size={20} />
          </div>
          <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[0%] skew-x-12 transition-transform duration-300" />
        </button>
      </div>
    </div>
  );
};

const TrendingUp = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
  </svg>
);

const TrendingDown = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" /><polyline points="17 18 23 18 23 12" />
  </svg>
);
