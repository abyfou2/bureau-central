import React, { useState } from 'react';
import { FoundationProject, FoundationDonation } from '../types';
import { HeartHandshake, Plus, Award, Users, Droplets, BookOpen, Stethoscope, FileText } from 'lucide-react';

interface FondationIlyassaViewProps {
  projects: FoundationProject[];
  donations: FoundationDonation[];
  onAddProject: (p: Omit<FoundationProject, 'id'>) => void;
}

export const FondationIlyassaView: React.FC<FondationIlyassaViewProps> = ({
  projects,
  donations,
  onAddProject
}) => {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState(5000000);
  const [beneficiaries, setBeneficiaries] = useState(500);
  const [category, setCategory] = useState<FoundationProject['category']>('Éducation');

  const totalBeneficiaries = projects.reduce((acc, p) => acc + p.beneficiaries, 0);
  const totalBudget = projects.reduce((acc, p) => acc + p.budget, 0);
  const totalDisbursed = projects.reduce((acc, p) => acc + p.disbursed, 0);

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
            Soutien aux communautés vulnérables, construction de forages d'eau potable, programmes d'éducation et santé rurale.
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
            className="px-5 py-3 bg-rose-500 hover:bg-rose-400 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau Projet Humanitaire</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Bénéficiaires Impactés</p>
          <h3 className="text-3xl font-bold font-mono tabular-nums text-slate-900 mb-1">
            {totalBeneficiaries.toLocaleString()} <span className="text-base font-sans font-normal text-slate-500">personnes</span>
          </h3>
          <p className="text-xs text-rose-600 font-medium flex items-center gap-1">
            <Users className="w-3.5 h-3.5" /> Communautés rurales & urbaines
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Fonds Décaissés</p>
          <h3 className="text-3xl font-bold font-mono tabular-nums text-slate-900 mb-1">
            {(totalDisbursed / 1000000).toFixed(1)}M <span className="text-base font-sans font-normal text-slate-500">FCFA</span>
          </h3>
          <p className="text-xs text-slate-500">Sur un budget total de {(totalBudget / 1000000).toFixed(1)}M FCFA</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Projets Actifs</p>
          <h3 className="text-3xl font-bold font-mono tabular-nums text-slate-900 mb-1">
            {projects.length} <span className="text-base font-sans font-normal text-slate-500">programmes</span>
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
            <div key={p.id} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700">
                    {p.category}
                  </span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    p.status === 'Terminé' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {p.status}
                  </span>
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
                  <span className="text-slate-500">Budget :</span>
                  <span className="font-bold text-slate-900 font-mono">{(p.budget / 1000000).toFixed(1)}M FCFA</span>
                </div>
              </div>
            </div>
          ))}
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
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="ex: Forage d'eau potable Village..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Catégorie</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium"
                >
                  <option value="Eau potable">Eau potable</option>
                  <option value="Éducation">Éducation</option>
                  <option value="Santé">Santé</option>
                  <option value="Social">Social</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Objectifs du projet..."
                  rows={3}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Budget (FCFA)</label>
                  <input
                    type="number"
                    step="500000"
                    value={budget}
                    onChange={(e) => setBudget(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Bénéficiaires</label>
                  <input
                    type="number"
                    value={beneficiaries}
                    onChange={(e) => setBeneficiaries(parseInt(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onChange={() => setShowModal(false)}
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-sm"
                >
                  Lancer le Projet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
