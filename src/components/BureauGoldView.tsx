import React, { useState } from 'react';
import { GoldTransaction, User } from '../types';
import { Coins, Plus, Scale, TrendingUp, ShieldCheck, FileText, CheckCircle2, Clock, Calculator, Pencil, Trash2, Lock, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { KitcoGoldTicker } from './KitcoGoldTicker';

interface BureauGoldViewProps {
  transactions: GoldTransaction[];
  onAddTransaction: (t: Omit<GoldTransaction, 'id'>) => void;
  onUpdateTransaction: (t: GoldTransaction) => void;
  onDeleteTransaction: (id: string) => void;
  currentUser: User;
}

export const BureauGoldView: React.FC<BureauGoldViewProps> = ({
  transactions,
  onAddTransaction,
  onUpdateTransaction,
  onDeleteTransaction,
  currentUser
}) => {
  const isAgent = currentUser.role.includes('_agent');
  const canDelete = currentUser.role === 'admin' || currentUser.role === 'pdg' || currentUser.role === 'bureau_manager';

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [type, setType] = useState<'achat' | 'vente'>('achat');
  
  // Exact Excel fields for Cameroon Gold Counter calculation
  const [weightGrams, setWeightGrams] = useState<number>(215.91);
  const [eau, setEau] = useState<number>(11.98);
  const [cours, setCours] = useState<number>(2860);
  const [clientOrSupplier, setClientOrSupplier] = useState<string>('Moussa');

  // Exact Excel Formulas:
  // 1. Divise = Poids(gm) / Eau
  const divise = eau > 0 ? Number((weightGrams / eau).toFixed(2)) : 0;
  // 2. Carrat = (Divise - 10.51) * 52.838 / Divise
  const carrat = divise > 0 ? Number((((divise - 10.51) * 52.838) / divise).toFixed(2)) : 0;
  // 3. Montant = Poids(gm) * Carrat * Cours
  const montant = Math.round(weightGrams * carrat * cours);

  const achatTransactions = transactions.filter(t => t.type === 'achat');
  const venteTransactions = transactions.filter(t => t.type === 'vente');

  const totalAchatKg = achatTransactions.reduce((acc, t) => acc + t.weightKg, 0);
  const totalAchatGrams = totalAchatKg * 1000;
  const totalAchatAmount = achatTransactions.reduce((acc, t) => acc + t.totalAmount, 0);

  const totalVenteKg = venteTransactions.reduce((acc, t) => acc + t.weightKg, 0);
  const totalVenteGrams = totalVenteKg * 1000;
  const totalVenteAmount = venteTransactions.reduce((acc, t) => acc + t.totalAmount, 0);

  const netStockKg = totalAchatKg - totalVenteKg;
  const netStockGrams = netStockKg * 1000;

  const handleOpenAddModal = () => {
    setEditingId(null);
    setType('achat');
    setWeightGrams(215.91);
    setEau(11.98);
    setCours(2860);
    setClientOrSupplier('');
    setShowAddModal(true);
  };

  const handleOpenEditModal = (t: GoldTransaction) => {
    setEditingId(t.id);
    setType(t.type);
    const wGm = t.weightKg * 1000;
    setWeightGrams(wGm);
    setEau(12.0);
    setCours(t.pricePerGram || 2860);
    setClientOrSupplier(t.clientOrSupplier);
    setShowAddModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientOrSupplier.trim()) return;

    const weightKg = weightGrams / 1000;
    const pricePerGram = carrat > 0 ? Math.round(montant / weightGrams) : 0;

    if (editingId) {
      onUpdateTransaction({
        id: editingId,
        type,
        weightKg,
        purity: `${carrat}K`,
        pricePerGram,
        totalAmount: montant,
        clientOrSupplier,
        date: new Date().toISOString().split('T')[0],
        status: 'Validé'
      });
    } else {
      onAddTransaction({
        type,
        weightKg,
        purity: `${carrat}K`,
        pricePerGram,
        totalAmount: montant,
        clientOrSupplier,
        date: new Date().toISOString().split('T')[0],
        status: 'Validé'
      });
    }

    setClientOrSupplier('');
    setEditingId(null);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Kitco Gold Spot Live Ticker */}
      {!isAgent && <KitcoGoldTicker />}

      {/* Department Header */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-slate-900 rounded-2xl p-8 text-white shadow-lg flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h2 className="text-3xl font-serif font-bold tracking-tight">Bureau d'Or — {isAgent ? 'Espace Saisie Opérations' : 'Gestion & Pilotage'}</h2>
          <p className="text-amber-100/80 text-sm mt-1 max-w-xl">
            {isAgent 
              ? "Interface dédiée à la saisie des opérations physiques et correction des erreurs de saisie."
              : "Gestion des stocks physiques, test d'Archimède et calculs précis selon le prix au gramme."
            }
          </p>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
          {!isAgent && (
            <button
              onClick={() => window.print()}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl text-xs transition-all shadow-md flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>Exporter en PDF</span>
            </button>
          )}
          <button
            onClick={handleOpenAddModal}
            className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nouvelle Saisie / Transaction</span>
          </button>
        </div>
      </div>

      {/* Stats Cards (3 Columns) */}
      {!isAgent && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Achats */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Achat Or</span>
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <ArrowDownRight className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold font-mono tabular-nums text-slate-900">
                {totalAchatGrams.toLocaleString()} <span className="text-xs font-sans font-normal text-slate-500">gm</span>
              </h3>
              <p className="text-xs text-amber-700 font-medium mt-0.5">
                ({totalAchatKg.toFixed(3)} kg achetés)
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100">
              <p className="text-[11px] text-slate-400">Montant total :</p>
              <p className="text-sm font-bold font-mono text-emerald-700">{totalAchatAmount.toLocaleString()} FCFA</p>
            </div>
          </div>

          {/* Card 2: Ventes */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Vente Or</span>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold font-mono tabular-nums text-slate-900">
                {totalVenteGrams.toLocaleString()} <span className="text-xs font-sans font-normal text-slate-500">gm</span>
              </h3>
              <p className="text-xs text-emerald-700 font-medium mt-0.5">
                ({totalVenteKg.toFixed(3)} kg vendus)
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100">
              <p className="text-[11px] text-slate-400">Montant total :</p>
              <p className="text-sm font-bold font-mono text-emerald-700">{totalVenteAmount.toLocaleString()} FCFA</p>
            </div>
          </div>

          {/* Card 3: Stock Net */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Stock Physique Net</span>
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold">
                <Scale className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold font-mono tabular-nums text-slate-900">
                {netStockGrams.toLocaleString()} <span className="text-xs font-sans font-normal text-slate-500">gm</span>
              </h3>
              <p className="text-xs text-amber-700 font-medium mt-0.5">
                ({netStockKg.toFixed(3)} kg en réserve)
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100">
              <p className="text-[11px] text-slate-400">Opérations totales :</p>
              <p className="text-sm font-bold font-mono text-slate-800">{transactions.length} enregistrements</p>
            </div>
          </div>
        </div>
      )}

      {/* Transactions Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-serif">Registre des Saisies Opérations</h3>
            <p className="text-xs text-slate-500">Formule exacte : Poids(gm) × Carrat × Prix/gramme</p>
          </div>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            {isAgent ? "Mode Saisie & Correction" : "Modèle Excel Intégré"}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-sm">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="py-3.5 px-6">Date / ID</th>
                <th className="py-3.5 px-6">Type</th>
                <th className="py-3.5 px-6">Fournisseur</th>
                <th className="py-3.5 px-6">Poids (gm)</th>
                <th className="py-3.5 px-6">Carrat</th>
                <th className="py-3.5 px-6">Prix / gramme</th>
                {!isAgent && <th className="py-3.5 px-6">Montant Total (FCFA)</th>}
                <th className="py-3.5 px-6 text-right">Actions (Saisie / Correction)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6 text-xs">
                    <p className="font-bold text-slate-900">{t.id}</p>
                    <p className="text-slate-500">{t.date}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                      t.type === 'achat' ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
                    }`}>
                      {t.type}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-sans font-medium text-slate-800">
                    {t.clientOrSupplier}
                  </td>
                  <td className="py-4 px-6 font-bold text-slate-900">
                    {(t.weightKg * 1000).toFixed(2)} gm
                  </td>
                  <td className="py-4 px-6">
                    <span className="bg-amber-100 text-amber-900 px-2 py-1 rounded font-bold text-xs">
                      {t.purity}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-700">
                    {t.pricePerGram ? t.pricePerGram.toLocaleString() : '-'}
                  </td>
                  {!isAgent && (
                    <td className="py-4 px-6 font-bold text-emerald-700 text-base">
                      {t.totalAmount.toLocaleString()} FCFA
                    </td>
                  )}
                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEditModal(t)}
                      className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors inline-flex items-center"
                      title="Corriger une erreur de saisie"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        onDeleteTransaction(t.id);
                      }}
                      className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors inline-flex items-center cursor-pointer"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-amber-600" />
                <h3 className="text-lg font-bold text-slate-900 font-serif">
                  {editingId ? "Corriger la Saisie (Erreur)" : "Nouvelle Saisie Opération"}
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1 font-sans">Fournisseur / Client</label>
                <input
                  type="text"
                  required
                  value={clientOrSupplier}
                  onChange={(e) => setClientOrSupplier(e.target.value)}
                  placeholder="Ex: Moussa"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-amber-500 font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1 font-sans">Poids (gm)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={weightGrams}
                    onChange={(e) => setWeightGrams(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1 font-sans">Eau (différence)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={eau}
                    onChange={(e) => setEau(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Calculated Fields Preview (Divise & Carrat) */}
              <div className="grid grid-cols-2 gap-4 bg-amber-50/70 p-3 rounded-xl border border-amber-200">
                <div>
                  <span className="text-[10px] text-amber-900 block font-sans font-semibold">1. Divise (= Poids / Eau)</span>
                  <span className="text-base font-bold text-amber-950">{divise}</span>
                </div>
                <div>
                  <span className="text-[10px] text-amber-900 block font-sans font-semibold">2. Carrat calculé</span>
                  <span className="text-base font-bold text-amber-950">{carrat} K</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1 font-sans">Prix / gramme</label>
                  <input
                    type="number"
                    step="1"
                    required
                    value={cours}
                    onChange={(e) => setCours(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1 font-sans">Type de Transaction</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-amber-500 font-sans"
                  >
                    <option value="achat">Achat d'Or</option>
                    <option value="vente">Vente d'Or</option>
                  </select>
                </div>
              </div>

              {!isAgent ? (
                <div className="bg-slate-900 text-white p-4 rounded-xl space-y-1">
                  <span className="text-[10px] uppercase text-amber-400 font-semibold font-sans">3. Montant Total (= Poids × Carrat × Prix/gramme)</span>
                  <p className="text-2xl font-bold text-amber-300">
                    {montant.toLocaleString()} <span className="text-xs text-slate-300 font-sans">FCFA</span>
                  </p>
                </div>
              ) : (
                <div className="bg-slate-100 p-3 rounded-xl border border-slate-200 text-slate-600 text-xs">
                  <p className="font-semibold">Note Agent :</p>
                  Les montants financiers globaux sont réservés à la direction, mais votre saisie et calculs de carrat sont validés.
                </div>
              )}

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-3 font-sans">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs hover:bg-slate-200 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 text-white font-semibold rounded-xl text-xs hover:bg-amber-700 transition-colors shadow-md"
                >
                  {editingId ? "Enregistrer la Correction" : "Enregistrer la Saisie"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
