import React, { useState } from 'react';
import { Sparkles, X, Loader2, Bot, Send } from 'lucide-react';

interface AiAssistantModalProps {
  onClose: () => void;
  departmentData: any;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  onClose,
  departmentData
}) => {
  const [prompt, setPrompt] = useState('Analyse la santé financière globale des 4 départements et propose 3 recommandations stratégiques pour optimiser la rentabilité du Bureau d\'Or et de la Fondation Ilyassa.');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, departmentData })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur serveur');

      setResponse(data.text);
    } catch (err: any) {
      setError(err.message || 'Impossible de joindre le service IA Gemini.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-6 flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-serif">Conseiller IA Stratégique (Gemini)</h3>
              <p className="text-xs text-slate-500">Analyse financière et recommandations pour la Direction Générale</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleGenerate} className="space-y-3 shrink-0">
          <label className="block text-xs font-semibold text-slate-700">Question ou consigne pour l'expert IA :</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-amber-500"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-sm flex items-center gap-2 disabled:opacity-50 shrink-0"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>Analyser</span>
            </button>
          </div>
        </form>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl">
            {error}
          </div>
        )}

        <div className="flex-1 bg-slate-50 rounded-xl border border-slate-200 p-5 overflow-y-auto space-y-3">
          {loading && (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500 space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
              <p className="text-xs font-medium">Analyse en cours par l'intelligence artificielle Gemini...</p>
            </div>
          )}

          {!loading && !response && (
            <div className="text-center py-12 text-slate-400 text-xs">
              <Bot className="w-10 h-10 mx-auto mb-2 opacity-40" />
              Cliquez sur "Analyser" pour obtenir un rapport stratégique complet basé sur vos données.
            </div>
          )}

          {!loading && response && (
            <div className="prose prose-sm max-w-none text-slate-800 text-xs leading-relaxed whitespace-pre-wrap font-sans">
              {response}
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 text-white font-semibold rounded-xl text-xs hover:bg-slate-800 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
