import React, { useState } from 'react';
import { RestaurantTransaction } from '../types';
import { UtensilsCrossed, Plus, TrendingUp, TrendingDown, DollarSign, Wallet, ShoppingCart, Users, Wrench, FileText } from 'lucide-react';

interface RestaurantViewProps {
  transactions: RestaurantTransaction[];
  onAddTransaction: (t: Omit<RestaurantTransaction, 'id'>) => void;
}

export const RestaurantView: React.FC<RestaurantViewProps> = ({
  transactions,
  onAddTransaction
}) => {
  const [showModal, setShowModal] = useState(false);
  const [type, setType] = useState<'recette' | 'depense'>('recette');
  const [category, setCategory] = useState<RestaurantTransaction['category']>('Vente Boissons/Jus');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState(50000);

  const totalRecettes = transactions.filter(t => t.type === 'recette').reduce((acc, t) => acc + t.amount, 0);
  const totalDepenses = transactions.filter(t => t.type === 'depense').reduce((acc, t) => acc + t.amount, 0);
  const netSolde = totalRecettes - totalDepenses;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    onAddTransaction({
      type,
      category,
      description,
      amount,
      date: new Date().toISOString().split('T')[0]
    });

    setDescription('');
    setShowModal(false);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 rounded-2xl p-8 text-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-3">
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>Gestion Financière & Exploitation Restauration</span>
          </div>
          <h2 className="text-3xl font-serif font-bold tracking-tight">Restaurant — Recettes & Dépenses</h2>
          <p className="text-emerald-100/80 text-sm mt-1 max-w-xl">
            Suivi rigoureux des recettes (boissons, jus, ventes salle) et des dépenses (salaires, fonctionnement, stock de cuisine).
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl text-xs transition-all shadow-md flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            <span>Exporter en PDF</span>
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter Recette / Dépense</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Recettes</p>
          <h3 className="text-3xl font-bold font-mono tabular-nums text-emerald-600 mb-1">
            +{totalRecettes.toLocaleString()} <span className="text-sm font-sans text-slate-500 font-normal">FCFA</span>
          </h3>
          <p className="text-xs text-slate-500">Boissons, jus & ventes salle</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Dépenses</p>
          <h3 className="text-3xl font-bold font-mono tabular-nums text-rose-600 mb-1">
            -{totalDepenses.toLocaleString()} <span className="text-sm font-sans text-slate-500 font-normal">FCFA</span>
          </h3>
          <p className="text-xs text-slate-500">Salaires, charges & stock cuisine</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Solde Net Restaurant</p>
          <h3 className={`text-3xl font-bold font-mono tabular-nums mb-1 ${netSolde >= 0 ? 'text-slate-900' : 'text-rose-600'}`}>
            {netSolde.toLocaleString()} <span className="text-sm font-sans text-slate-500 font-normal">FCFA</span>
          </h3>
          <p className="text-xs text-emerald-600 font-medium">Bénéfice opérationnel</p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Journal des Flux Financiers</h3>
            <p className="text-xs text-slate-500">Historique des entrées et sorties de trésorerie du restaurant</p>
          </div>
          <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg">
            Comptabilité active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="py-3.5 px-6">Type</th>
                <th className="py-3.5 px-6">Catégorie</th>
                <th className="py-3.5 px-6">Description / Détails</th>
                <th className="py-3.5 px-6">Montant (FCFA)</th>
                <th className="py-3.5 px-6">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6 font-medium">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                      t.type === 'recette' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                    }`}>
                      {t.type === 'recette' ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                      {t.type === 'recette' ? 'Recette' : 'Dépense'}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-semibold text-slate-800">{t.category}</td>
                  <td className="py-4 px-6 text-slate-600">{t.description}</td>
                  <td className={`py-4 px-6 font-mono font-bold ${t.type === 'recette' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {t.type === 'recette' ? '+' : '-'}{t.amount.toLocaleString()} FCFA
                  </td>
                  <td className="py-4 px-6 text-slate-500 text-xs font-mono">{t.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add Transaction */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-5">
            <h3 className="text-lg font-bold text-slate-900 font-serif">Enregistrer une Recette ou Dépense</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Type de flux</label>
                <select
                  value={type}
                  onChange={(e) => {
                    const val = e.target.value as 'recette' | 'depense';
                    setType(val);
                    setCategory(val === 'recette' ? 'Vente Boissons/Jus' : 'Salaires');
                  }}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium"
                >
                  <option value="recette">Recette (Entrée d'argent)</option>
                  <option value="depense">Dépense (Sortie d'argent)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Catégorie</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium"
                >
                  {type === 'recette' ? (
                    <>
                      <option value="Vente Boissons/Jus">Vente Boissons & Jus (Salle)</option>
                      <option value="Autre Recette">Autre Recette / Traiteur</option>
                    </>
                  ) : (
                    <>
                      <option value="Salaires">Salaires personnel</option>
                      <option value="Stock Cuisine">Stock Cuisine & Denrées</option>
                      <option value="Fonctionnement">Fonctionnement (Énergie, Eau, Matériel)</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="ex: Achat caisse de jus d'orange & bissap"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Montant (FCFA)</label>
                <input
                  type="number"
                  step="5000"
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-emerald-500 hover:bg-emerald-400 rounded-xl shadow-sm"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
