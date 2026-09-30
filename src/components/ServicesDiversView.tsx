import React, { useState } from 'react';
import { DiverseServiceRequest } from '../types';
import { Briefcase, Plus, CheckCircle2, FileText, Clock } from 'lucide-react';

interface ServicesDiversViewProps {
  requests: DiverseServiceRequest[];
  onAddRequest: (req: Omit<DiverseServiceRequest, 'id'>) => void;
}

export const ServicesDiversView: React.FC<ServicesDiversViewProps> = ({
  requests,
  onAddRequest
}) => {
  const [showModal, setShowModal] = useState(false);
  const [clientName, setClientName] = useState('');
  const [serviceType, setServiceType] = useState<DiverseServiceRequest['serviceType']>('Logistique & Transport');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState(1000000);

  const totalBilled = requests.filter(r => r.status === 'Traité' || r.status === 'Facturé').reduce((acc, r) => acc + r.amount, 0);

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
    setShowModal(false);
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
          <h2 className="text-3xl font-serif font-bold tracking-tight">Services Divers & Facturation</h2>
          <p className="text-blue-100/80 text-sm mt-1 max-w-xl">
            Gestion centralisée des prestations logistiques, consulting, immobilier et facturation inter-entreprises.
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
            className="px-5 py-3 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nouvelle Demande / Contrat</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Chiffre d'Affaires Services</p>
          <h3 className="text-3xl font-bold font-mono tabular-nums text-slate-900 mb-1">
            {(totalBilled / 1000000).toFixed(2)}M <span className="text-base font-sans font-normal text-slate-500">FCFA</span>
          </h3>
          <p className="text-xs text-blue-600 font-medium">+19% vs mois dernier</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Dossiers Actifs</p>
          <h3 className="text-3xl font-bold font-mono tabular-nums text-slate-900 mb-1">
            {requests.length} <span className="text-base font-sans font-normal text-slate-500">contrats</span>
          </h3>
          <p className="text-xs text-slate-500">Clients institutionnels et privés</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Registre des Prestations et Demandes</h3>
            <p className="text-xs text-slate-500">Suivi des dossiers de services divers</p>
          </div>
          <span className="text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
            Actifs
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
              {requests.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6 font-semibold text-slate-900">{r.clientName}</td>
                  <td className="py-4 px-6">
                    <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700">
                      {r.serviceType}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-600 max-w-xs truncate">{r.description}</td>
                  <td className="py-4 px-6 font-mono font-bold text-slate-900">{r.amount.toLocaleString()}</td>
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add Request */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-5">
            <h3 className="text-lg font-bold text-slate-900 font-serif">Nouvelle Prestation Services Divers</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nom du Client / Partenaire</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="ex: Société Minière de l'Ouest"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Type de Service</label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium"
                >
                  <option value="Logistique & Transport">Logistique & Transport</option>
                  <option value="Consulting & Audit">Consulting & Audit</option>
                  <option value="Immobilier">Immobilier</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description de la Prestation</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Détails de la mission..."
                  rows={3}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Montant facturé (FCFA)</label>
                <input
                  type="number"
                  step="50000"
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
                  className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-sm"
                >
                  Enregistrer le Dossier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
