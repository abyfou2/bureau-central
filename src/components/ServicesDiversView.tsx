import React, { useState } from 'react';
import { DiverseServiceRequest, DiverseServiceExpense, User } from '../types';
import { Briefcase, Plus, CheckCircle2, FileText, Clock, ReceiptText, Trash2, TrendingUp } from 'lucide-react';

interface ServicesDiversViewProps {
  requests: DiverseServiceRequest[];
  expenses: DiverseServiceExpense[];
  onAddRequest: (req: Omit<DiverseServiceRequest, 'id'>) => void;
  onAddExpense: (e: Omit<DiverseServiceExpense, 'id'>) => void;
  onDeleteExpense: (id: string) => void;
  currentUser: User;
}

export const ServicesDiversView: React.FC<ServicesDiversViewProps> = ({
  requests,
  expenses,
  onAddRequest,
  onAddExpense,
  onDeleteExpense,
  currentUser
}) => {
  const isAgent = currentUser.role.includes('_agent');
  const canDelete = currentUser.role === 'admin' || currentUser.role === 'pdg' || currentUser.role === 'services_manager';

  const [showModal, setShowModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  const [clientName, setClientName] = useState('');
  const [serviceType, setServiceType] = useState<DiverseServiceRequest['serviceType']>('Logistique & Transport');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState(1000000);

  // Expense Form State
  const [expCategory, setExpCategory] = useState<DiverseServiceExpense['category']>('Logistique & Carburant');
  const [expDescription, setExpDescription] = useState('');
  const [expAmount, setExpAmount] = useState<number>(100000);

  const totalBilled = requests.reduce((acc, r) => acc + r.amount, 0);
  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
  const netProfit = totalBilled - totalExpenses;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !description.trim()) return;

    onAddRequest({
      clientName,
      serviceType,
      description,
      amount,
      status: 'En attente',
      date: new Date().toISOString().split('T')[0]
    });

    setClientName('');
    setDescription('');
    setAmount(1000000);
    setShowModal(false);
  };

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expDescription.trim() || expAmount <= 0) return;

    onAddExpense({
      category: expCategory,
      description: expDescription,
      amount: expAmount,
      date: new Date().toISOString().split('T')[0]
    });

    setExpDescription('');
    setExpAmount(100000);
    setShowExpenseModal(false);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-slate-900 rounded-2xl p-8 text-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-3">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Département Prestations & Services</span>
          </div>
          <h2 className="text-3xl font-serif font-bold tracking-tight">Services Divers, Facturation & Dépenses</h2>
          <p className="text-blue-100/80 text-sm mt-1 max-w-xl">
            Gestion centralisée des prestations logistiques, consulting, immobilier, suivi des charges et calcul du bénéfice net.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {!isAgent && (
            <button
              onClick={() => setShowExpenseModal(true)}
              className="px-4 py-3 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-xl text-xs transition-all shadow-md flex items-center gap-2"
            >
              <ReceiptText className="w-4 h-4" />
              <span>Ajouter une Dépense</span>
            </button>
          )}
          <button
            onClick={() => window.print()}
            className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl text-xs transition-all shadow-md flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            <span>Exporter en PDF</span>
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-3 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nouvelle Demande / Contrat</span>
          </button>
        </div>
      </div>

      {/* Stats Cards (4 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Chiffre d'Affaires Services</p>
          <h3 className="text-2xl font-bold font-mono tabular-nums text-slate-900 mb-1">
            {(totalBilled / 1000000).toFixed(2)}M <span className="text-xs font-sans font-normal text-slate-500">FCFA</span>
          </h3>
          <p className="text-xs text-blue-600 font-medium">Total facturé & en cours</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Dépenses Département</p>
          <h3 className="text-2xl font-bold font-mono tabular-nums text-rose-700 mb-1">
            {totalExpenses.toLocaleString()} <span className="text-xs font-sans font-normal text-slate-500">FCFA</span>
          </h3>
          <p className="text-xs text-slate-500">{expenses.length} postes de charges</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Bénéfice Net Services</p>
          <h3 className={`text-2xl font-bold font-mono tabular-nums mb-1 ${netProfit >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
            {netProfit.toLocaleString()} <span className="text-xs font-sans font-normal text-slate-500">FCFA</span>
          </h3>
          <p className="text-xs text-slate-600 font-medium">Marge nette d'exploitation</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Dossiers Actifs</p>
          <h3 className="text-2xl font-bold font-mono tabular-nums text-slate-900 mb-1">
            {requests.length} <span className="text-xs font-sans font-normal text-slate-500">contrats</span>
          </h3>
          <p className="text-xs text-slate-500">Clients institutionnels et privés</p>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Registre des Prestations et Demandes</h3>
            <p className="text-xs text-slate-500">Suivi des dossiers de services divers et facturation</p>
          </div>
          <span className="text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
            {requests.length} dossiers
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="py-3.5 px-6">Client / Entreprise</th>
                <th className="py-3.5 px-6">Type de Service</th>
                <th className="py-3.5 px-6">Description</th>
                <th className="py-3.5 px-6">Montant (FCFA)</th>
                <th className="py-3.5 px-6">Date</th>
                <th className="py-3.5 px-6">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                    Aucune prestation enregistrée pour le moment.
                  </td>
                </tr>
              ) : (
                requests.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-semibold text-slate-900">{r.clientName}</td>
                    <td className="py-4 px-6">
                      <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700">
                        {r.serviceType}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-600 max-w-xs truncate">{r.description}</td>
                    <td className="py-4 px-6 font-mono font-bold text-slate-900">{r.amount.toLocaleString()} FCFA</td>
                    <td className="py-4 px-6 text-slate-500 text-xs font-mono">{r.date}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full ${
                        r.status === 'Traité' ? 'bg-emerald-50 text-emerald-700' :
                        r.status === 'Facturé' ? 'bg-purple-50 text-purple-700' : 'bg-amber-50 text-amber-800'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Expenses Table */}
      {!isAgent && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Registre des Dépenses & Charges (Services Divers)</h3>
              <p className="text-xs text-slate-500">Suivi des frais logistiques, carburant, honoraires et fonctionnement</p>
            </div>
            <button
              onClick={() => setShowExpenseModal(true)}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" /> Ajouter une Dépense
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-sm">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3.5 px-6">Date</th>
                  <th className="py-3.5 px-6">Catégorie</th>
                  <th className="py-3.5 px-6">Description</th>
                  <th className="py-3.5 px-6">Montant (FCFA)</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {expenses.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 text-xs font-sans">
                      Aucune dépense enregistrée pour ce département.
                    </td>
                  </tr>
                ) : (
                  expenses.map((e) => (
                    <tr key={e.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6 text-xs text-slate-500">{e.date}</td>
                      <td className="py-4 px-6">
                        <span className="bg-rose-100 text-rose-900 px-2.5 py-1 rounded-full text-xs font-bold font-sans">
                          {e.category}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-sans font-medium text-slate-800">{e.description}</td>
                      <td className="py-4 px-6 font-bold text-rose-700 text-base">
                        {e.amount.toLocaleString()} FCFA
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => onDeleteExpense(e.id)}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors inline-flex items-center"
                          title="Supprimer la dépense"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Add Request */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 font-serif">Nouvelle Prestation Services Divers</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nom du Client / Partenaire</label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Ex: Legion BTA"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Type de Service</label>
                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Logistique & Transport">Logistique & Transport</option>
                    <option value="Consulting & Audit">Consulting & Audit</option>
                    <option value="Immobilier">Immobilier</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Montant (FCFA)</label>
                  <input
                    type="number"
                    step="50000"
                    min="10000"
                    required
                    value={amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold font-mono outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description de la Prestation</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Détails de la prestation, transport, mission..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs hover:bg-slate-200"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-xl text-xs hover:bg-blue-700 shadow-md"
                >
                  Enregistrer la Prestation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Add Expense */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 font-serif">Nouvelle Dépense (Services Divers)</h3>
              <button onClick={() => setShowExpenseModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleExpenseSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Catégorie de Dépense</label>
                <select
                  value={expCategory}
                  onChange={(e) => setExpCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="Logistique & Carburant">Logistique & Carburant</option>
                  <option value="Honoraires & Experts">Honoraires & Experts</option>
                  <option value="Frais Administratifs">Frais Administratifs</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description / Motif</label>
                <input
                  type="text"
                  required
                  value={expDescription}
                  onChange={(e) => setExpDescription(e.target.value)}
                  placeholder="Ex: Achat carburant mission terrain"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Montant (FCFA)</label>
                <input
                  type="number"
                  step="10000"
                  min="1000"
                  required
                  value={expAmount}
                  onChange={(e) => setExpAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold font-mono outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs hover:bg-slate-200"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 text-white font-semibold rounded-xl text-xs hover:bg-rose-700 shadow-md"
                >
                  Enregistrer la Dépense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
