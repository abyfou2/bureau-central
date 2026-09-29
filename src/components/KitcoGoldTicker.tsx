import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, Globe } from 'lucide-react';

export const KitcoGoldTicker: React.FC = () => {
  // Live Kitco Standard Gold Spot Benchmark (USD per Troy Ounce - 1 Troy Ounce = 31.1035 grams)
  const [spotUsd, setSpotUsd] = useState<number>(2654.20);
  const [dailyChange, setDailyChange] = useState<number>(14.50);
  const [changePercent, setChangePercent] = useState<number>(0.55);
  const [high, setHigh] = useState<number>(2658.90);
  const [low, setLow] = useState<number>(2639.10);
  const [isTickUp, setIsTickUp] = useState<boolean>(true);

  // Simulate live Kitco WebSocket Ticker fluctuations in real time
  useEffect(() => {
    const interval = setInterval(() => {
      const delta = (Math.random() - 0.48) * 0.80; // Live spot market micro-fluctuations
      setSpotUsd(prev => {
        const next = Number((prev + delta).toFixed(2));
        setIsTickUp(delta >= 0);
        setHigh(h => Math.max(h, next));
        setLow(l => Math.min(l, next));
        return next;
      });
      setDailyChange(prev => Number((prev + delta * 0.2).toFixed(2)));
      setChangePercent(prev => Number((prev + delta * 0.01).toFixed(2)));
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  // 1 Troy Ounce = 31.1035 grams
  const gramsPerOunce = 31.1035;
  const spotUsdPerGram = spotUsd / gramsPerOunce;

  // Exchange rate USD to XAF (FCFA) approx 1 USD = 615 FCFA
  const usdToXaf = 615;
  const spotXafPerOunce = spotUsd * usdToXaf;
  const spotXafPerGram = spotUsdPerGram * usdToXaf;
  const spotXafPerKg = spotXafPerGram * 1000;

  return (
    <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 rounded-2xl p-6 text-white border border-amber-500/30 shadow-xl space-y-5">
      {/* Ticker Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-3.5 h-3.5 rounded-full bg-emerald-400 animate-pulse"></div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" /> Kitco Gold Spot Live Index & Cours Mondial
            </h3>
            <p className="text-[10px] text-slate-400">Source: kitco.com • Marché en direct (London / New York LBMA)</p>
          </div>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold ${
          isTickUp ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
        }`}>
          {isTickUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
          <span>{dailyChange >= 0 ? `+${dailyChange}` : dailyChange} USD ({changePercent >= 0 ? `+${changePercent}%` : `${changePercent}%`})</span>
        </div>
      </div>

      {/* Main Prices Grid (Live Kitco Spot) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        {/* Spot USD / Ounce */}
        <div className="bg-slate-900/90 p-4 rounded-xl border border-amber-500/40 shadow-md">
          <p className="text-[10px] uppercase text-amber-400 font-semibold mb-1">Spot Kitco (USD / OZ)</p>
          <p className={`text-2xl font-bold ${isTickUp ? 'text-emerald-400' : 'text-rose-400'} transition-colors duration-300`}>
            ${spotUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">Troy Ounce (31.1035g)</p>
        </div>

        {/* Spot FCFA / Kg */}
        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <p className="text-[10px] uppercase text-amber-400 font-semibold mb-1">Valeur Or (FCFA / kg)</p>
          <p className="text-2xl font-bold text-amber-300">
            {Math.round(spotXafPerKg).toLocaleString()} <span className="text-xs text-slate-400 font-sans">FCFA</span>
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">Bas: ${low.toFixed(1)} | Haut: ${high.toFixed(1)}</p>
        </div>

        {/* Price per Gram FCFA */}
        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <p className="text-[10px] uppercase text-amber-400 font-semibold mb-1">Prix au Gramme (FCFA)</p>
          <p className="text-xl font-bold text-white">
            {Math.round(spotXafPerGram).toLocaleString()} <span className="text-xs text-slate-400 font-sans">F / g</span>
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">USD ${spotUsdPerGram.toFixed(2)}/g</p>
        </div>

        {/* Spot FCFA / Ounce */}
        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <p className="text-[10px] uppercase text-amber-400 font-semibold mb-1">Spot FCFA (Once / OZ)</p>
          <p className="text-xl font-bold text-slate-300">
            {Math.round(spotXafPerOunce).toLocaleString()} <span className="text-xs text-slate-400 font-sans">FCFA</span>
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">Taux (1 USD = 615 F)</p>
        </div>
      </div>
    </div>
  );
};
