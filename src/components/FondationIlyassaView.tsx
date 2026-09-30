import React, { useState } from 'react';
import { FoundationProject, FoundationExpense, FoundationDonation, User } from '../types';
import { HeartHandshake, Plus, Award, Users, Droplets, BookOpen, Stethoscope, FileText, ReceiptText, Trash2 } from 'lucide-react';

interface FondationIlyassaViewProps {
  projects: FoundationProject[];
  expenses: FoundationExpense[];
  donations: FoundationDonation[];
  onAddProject: (p: Omit<FoundationProject, 'id'>) => void;
  onAddExpense: (e: Omit<FoundationExpense, 'id'>) => void;
  onDeleteProject?: (id: string) => void;
  onDeleteExpense: (id: string) => void;
  currentUser: User;
}

export const FondationIlyassaView: React.FC<FondationIlyassaViewProps> = ({
  projects,
  expenses,
  donations,
  onAddProject,
  onAddExpense,
  onDeleteProject,
  onDeleteExpense,
  currentUser
}) => {
  const isAgent = currentUser.role.includes('_agent');
  const canDelete = currentUser.role === 'admin' || currentUser.role === 'pdg' || currentUser.role === 'fondation_manager';

  const [showModal, setShowModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState(5000000);
  const [beneficiaries, setBeneficiaries] = useState(500);
  const [category, setCategory] = useState<FoundationProject['category']>('Éducation');

  // Expense Form State
  const [expCategory, setExpCategory] = useState<FoundationExpense['category']>('Logistique humanitaire');
  const [expDescription, setExpDescription] = useState('');
  const [expAmount, setExpAmount] = useState<number>(150000);

  const totalBeneficiaries = projects.reduce((acc, p) => acc + p.beneficiaries, 0);
  const totalBudget = projects.reduce((acc, p) => acc + p.budget, 0);
  const totalDisbursed = projects.reduce((acc, p) => acc + p.disbursed, 0);
  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    onAddProject({
      title,
      description,
      budget,
      disbursed: budget * 0.8,
      beneficiaries,
      status: 'En cours',
      category
    });

    setTitle('');
    setDescription('');
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
    setExpAmount(150000);
    setShowExpenseModal(false);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-950 via-rose-900 to-slate-900 rounded-2xl p-8 text-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-300 text-xs font-semibold mb-3">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Branche Humanitaire & Sociale</span>
          </div>
          <h2 className="text-3xl font-serif font-bold tracking-tight">Fondation Ilyassa</h2>
          <p className="text-rose-100/80 text-sm mt-1 max-w-xl">
            Soutien aux communautés vulnérables, construction de forages d'eau potable, programmes d'éducation, santé rurale et suivi des charges de fonctionnement.
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
            className="px-5 py-3 bg-rose-500 hover:bg-rose-400 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau Projet Humanitaire</span>
          </button>
        </div>
      </div>

      {/* Stats (4 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Bénéficiaires Impactés</p>
          <h3 className="text-2xl font-bold font-mono tabular-nums text-slate-900 mb-1">
            {totalBeneficiaries.toLocaleString()} <span className="text-sm font-sans font-normal text-slate-500">personnes</span>
          </h3>
          <p className="text-xs text-rose-600 font-medium flex items-center gap-1">
            <Users className="w-3.5 h-3.5" /> Communautés rurales & urbaines
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Fonds Décaissés (Projets)</p>
          <h3 className="text-2xl font-bold font-mono tabular-nums text-slate-900 mb-1">
            {totalDisbursed.toLocaleString()} <span className="text-sm font-sans font-normal text-slate-500">FCFA</span>
          </h3>
          <p className="text-xs text-slate-500">Sur un budget de {totalBudget.toLocaleString()} FCFA</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Dépenses & Fonctionnement</p>
          <h3 className="text-2xl font-bold font-mono tabular-nums text-rose-700 mb-1">
            {totalExpenses.toLocaleString()} <span className="text-sm font-sans font-normal text-slate-500">FCFA</span>
          </h3>
          <p className="text-xs text-slate-500">{expenses.length} postes de charges</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Projets Actifs</p>
          <h3 className="text-2xl font-bold font-mono tabular-nums text-slate-900 mb-1">
            {projects.length} <span className="text-sm font-sans font-normal text-slate-500">programmes</span>
          </h3>
          <p className="text-xs text-emerald-600 font-medium">100% audités</p>
        </div>
      </div>

      {/* Projects Cards Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Programmes et Initiatives Humanitaires</h3>
            <p className="text-xs text-slate-500">Suivi des réalisations sur le terrain</p>
          </div>
          <span className="text-xs font-medium text-rose-700 bg-rose-50 px-3 py-1 rounded-lg">
            Action Sociale
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((p) => (
            <div key={p.id} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 flex flex-col justify-between relative group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700">
                    {p.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      p.status === 'Terminé' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {p.status}
                    </span>
                    {onDeleteProject && (
                      <button
                        onClick={() => onDeleteProject(p.id)}
                        className="p-1 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-lg transition-colors"
                        title="Supprimer le projet"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
                <h4 className="font-bold text-slate-900 text-base">{p.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{p.description}</p>
              </div>

              <div className="pt-4 border-t border-slate-200/60 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Bénéficiaires :</span>
                  <span className="font-bold text-slate-900 font-mono">{p.beneficiaries.toLocaleString()} pers.</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Budget / Dépense :</span>
                  <span className="font-bold text-slate-900 font-mono">{p.budget.toLocaleString()} FCFA</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Registre des Dépenses & Charges (Fondation Ilyassa)</h3>
              <p className="text-xs text-slate-500">Suivi de la logistique humanitaire, achats de kits, missions terrain et frais administratifs</p>
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
                      Aucune dépense de fonctionnement enregistrée pour la fondation.
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

      {/* Modal Add Project */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-5">
            <h3 className="text-lg font-bold text-slate-900 font-serif">Nouveau Projet Humanitaire — Fondation Ilyassa</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Titre du Projet</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Forage d'eau village Mbalmayo"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Catégorie</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="Éducation">Éducation</option>
                    <option value="Santé">Santé</option>
                    <option value="Eau potable">Eau potable</option>
                    <option value="Social">Social</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Bénéficiaires (est.)</label>
                  <input
                    type="number"
                    step="any"
                    min="10"
                    required
                    value={beneficiaries}
                    onChange={(e) => setBeneficiaries(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold font-mono outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Budget Total (FCFA)</label>
                <input
                  type="number"
                  step="any"
                  min="100000"
                  required
                  value={budget}
                  onChange={(e) => setBudget(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold font-mono outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description / Objectifs</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Détails du programme d'aide..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-rose-500 resize-none"
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
                  className="px-5 py-2 bg-rose-600 text-white font-semibold rounded-xl text-xs hover:bg-rose-700 shadow-md"
                >
                  Lancer le Projet
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
              <h3 className="text-lg font-bold text-slate-900 font-serif">Nouvelle Dépense (Fondation Ilyassa)</h3>
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
                  <option value="Logistique humanitaire">Logistique humanitaire</option>
                  <option value="Achats matériel / kits">Achats matériel / kits</option>
                  <option value="Frais administratifs">Frais administratifs</option>
                  <option value="Mission terrain">Mission terrain</option>
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
                  placeholder="Ex: Achat kits scolaires rentrée"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Montant (FCFA)</label>
                <input
                  type="number"
                  step="any"
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
