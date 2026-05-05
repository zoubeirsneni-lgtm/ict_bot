import { AlertTriangle, TrendingDown, TrendingUp, Zap, Activity } from 'lucide-react';
import React from 'react';
import { ICTPattern, SignalType, Trade } from '../types';
import { format } from 'date-fns';

interface SidebarProps {
  signals: ICTPattern[];
  portfolio: Trade[];
  onSelectSignal: (signal: ICTPattern) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ signals, portfolio, onSelectSignal }) => {
  return (
    <div className="w-80 h-full bg-[#111] border-l border-white/10 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-white/10 bg-white/5">
          <h3 className="text-xs font-bold uppercase tracking-widest text-white/50 flex items-center gap-2">
              <Zap size={14} className="text-yellow-500" />
              Live ICT Pulse
          </h3>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {signals.length === 0 && (
            <div className="h-64 flex flex-col items-center justify-center opacity-20 text-center p-8">
              <AlertTriangle size={48} className="mb-4" />
              <p className="text-sm font-mono italic">Awaiting Market Structure Shift...</p>
            </div>
          )}
          
          {signals.map((s) => (
            <div 
              key={s.id}
              onClick={() => onSelectSignal(s)}
              className="group p-3 rounded-lg bg-white/5 border border-white/5 hover:border-white/20 transition-all cursor-pointer"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  {s.type.includes('BULL') ? (
                    <TrendingUp size={16} className="text-[#26a69a]" />
                  ) : (
                    <TrendingDown size={16} className="text-[#ef5350]" />
                  )}
                  <span className={`text-xs font-bold uppercase ${s.type.includes('BULL') ? 'text-[#26a69a]' : 'text-[#ef5350]'}`}>
                    {s.type.replace(/_/g, ' ')}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-white/30">
                  {format(new Date(s.time * 1000), 'HH:mm:ss')}
                </span>
              </div>
              
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-sm font-mono text-white/80 leading-none">
                    {s.price.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-white/40 uppercase mt-1">Found Point</div>
                </div>
                <button className="bg-white/10 group-hover:bg-white/20 text-white text-[10px] font-bold px-2 py-1 rounded transition-colors uppercase italic">
                  Focus
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Portfolio Section */}
        <div className="p-4 border-t border-white/10 bg-white/5">
          <h3 className="text-xs font-bold uppercase tracking-widest text-white/50 flex items-center gap-2">
              <Activity size={14} className="text-blue-500" />
              Session Portfolio
          </h3>
        </div>
        <div className="h-64 overflow-y-auto p-4 space-y-2 bg-black/20">
           {portfolio.length === 0 && (
             <p className="text-[10px] text-center text-white/20 uppercase mt-12 italic">No active positions</p>
           )}
           {portfolio.map(trade => (
             <div key={trade.id} className="flex justify-between items-center p-2 rounded bg-white/5 border border-white/5">
               <div>
                  <div className={`text-[10px] font-bold ${trade.type === 'CALL' ? 'text-green-500' : 'text-red-500'}`}>
                    {trade.type} {trade.symbol}
                  </div>
                  <div className="text-[9px] text-white/30 font-mono">@{trade.entryPrice.toFixed(2)}</div>
               </div>
               <div className="text-right">
                  <div className={`text-[10px] font-bold leading-none ${
                    trade.status === 'WIN' ? 'text-green-500' : 
                    trade.status === 'LOSS' ? 'text-red-500' : 'text-white/50'
                  }`}>
                    {trade.status === 'WIN' ? `+$${(trade.amount * 0.8).toFixed(2)}` : 
                     trade.status === 'LOSS' ? `-$${trade.amount.toFixed(2)}` : 'PENDING'}
                  </div>
                  <div className="text-[9px] text-white/30 font-mono mt-0.5">
                    {format(new Date(trade.timestamp), 'HH:mm:ss')}
                  </div>
               </div>
             </div>
           ))}
        </div>
      </div>
      
      <div className="p-4 border-t border-white/10 bg-white/5">
        <div className="flex justify-between items-center text-[10px] font-mono uppercase text-white/30">
          <span>WebSocket: Active</span>
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        </div>
      </div>
    </div>
  );
};
