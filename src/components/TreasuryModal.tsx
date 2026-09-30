import React, { useState } from 'react';
import { TreasuryAccount } from '../types';
import { Wallet, X, Plus, TrendingUp, Building2 } from 'lucide-react';

interface TreasuryModalProps {
  accounts: TreasuryAccount[];
  onUpdateAccount: (account: TreasuryAccount) => void;
  onClose: () => void;
  isAdmin: boolean;
}

export const TreasuryModal: React.FC<TreasuryModalProps> = ({
  accounts,
  onUpdateAccount,
  onClose,
  isAdmin
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editBalance, setEditBalance] = useState<number>(0);

  const handleStartEdit = (acc: TreasuryAccount) => {
    if (!isAdmin) return;
    setEditingId(acc.id);
    setEditBalance(acc.balance);
  };

  const handleSave = (acc: TreasuryAccount) => {
    onUpdateAccount({
      ...acc,
      balance: Number(editBalance)
    });
    setEditingId(null);
  };

  const totalTreasury = accounts.reduce((acc, curr) => acc + curr.balance, 0);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-serif">Trésorerie & Soldes de Caisse</h3>
              <p className="text-xs text-slate-500">Suivi consolidé des avoirs bancaires et caisses par département</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Treasury Banner */}
        <div className="bg-gradient-to-br from-emerald-900 to-slate-900 text-white p-5 rounded-2xl shadow-md flex items-center justify-between">
          <div>
            <p className="text-xs text-emerald-300 uppercase tracking-wider font-medium">Trésorerie Consolidée Totale</p>
            <p className="text-2xl font-bold font-mono mt-1">{totalTreasury.toLocaleString()} XOF</p>
            <p className="text-[11px] text-slate-300 mt-1">Liquidités disponibles sur l'ensemble des départements</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-800/60 border border-emerald-600/40 flex items-center justify-center text-emerald-200">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Accounts List */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Comptes & Caisses par Pôle</span>
          <div className="grid grid-cols-1 gap-3 max-h-72 overflow-y-auto pr-1">
            {accounts.map((acc) => (
              <div key={acc.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 font-bold">
                    <Building2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{acc.accountName}</h4>
                    <span className="text-[11px] text-slate-500 font-medium">{acc.department}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {editingId === acc.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="any"
                        value={editBalance}
                        onChange={(e) => setEditBalance(Number(e.target.value))}
                        className="w-32 px-2.5 py-1 text-xs border border-emerald-500 rounded-lg outline-none font-mono font-bold"
                      />
                      <button
                        onClick={() => handleSave(acc)}
                        className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700"
                      >
                        Enregistrer
                      </button>
                    </div>
                  ) : (
                    <div className="text-right">
                      <p className="text-sm font-bold font-mono text-slate-900">{acc.balance.toLocaleString()} {acc.currency}</p>
                      {isAdmin && (
                        <button
                          onClick={() => handleStartEdit(acc)}
                          className="text-[10px] text-emerald-600 hover:underline font-medium"
                        >
                          Modifier le solde
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
