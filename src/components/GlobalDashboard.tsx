import React from 'react';
import { 
  GoldTransaction, 
  RestaurantTransaction, 
  DiverseServiceRequest, 
  FoundationProject, 
  AuditLog 
} from '../types';
import { 
  Coins, 
  UtensilsCrossed, 
  Briefcase, 
  HeartHandshake, 
  TrendingUp, 
  ArrowUpRight, 
  Activity,
  Award,
  FileText
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';

interface GlobalDashboardProps {
  goldTransactions: GoldTransaction[];
  restaurantTransactions: RestaurantTransaction[];
  diverseServices: DiverseServiceRequest[];
  foundationProjects: FoundationProject[];
  auditLogs: AuditLog[];
  onNavigateTab: (tab: string) => void;
  onOpenAiModal: () => void;
  isAdmin: boolean;
}

export const GlobalDashboard: React.FC<GlobalDashboardProps> = ({
  goldTransactions,
  restaurantTransactions,
  diverseServices,
  foundationProjects,
  auditLogs,
  onNavigateTab,
  onOpenAiModal,
  isAdmin
}) => {
  const totalGoldKg = goldTransactions.reduce((acc, t) => t.type === 'achat' ? acc + t.weightKg : acc - t.weightKg, 0);
  const goldRevenue = goldTransactions.filter(t => t.type === 'vente').reduce((acc, t) => acc + t.totalAmount, 0);
  
  const restaurantRecettes = restaurantTransactions.filter(t => t.type === 'recette').reduce((acc, t) => acc + t.amount, 0);
  const restaurantDepenses = restaurantTransactions.filter(t => t.type === 'depense').reduce((acc, t) => acc + t.amount, 0);
  
  const servicesRevenue = diverseServices.filter(s => s.status === 'Traité' || s.status === 'Facturé' || s.status === 'En cours').reduce((acc, s) => acc + s.amount, 0);
  
  const foundationBeneficiaries = foundationProjects.reduce((acc, p) => acc + p.beneficiaries, 0);

  const chartData = [
    { name: "Bureau d'Or", montant: goldRevenue || 10000000, color: '#d97706' },
    { name: "Restaurant", montant: restaurantRecettes || 5000000, color: '#059669' },
    { name: "Services Divers", montant: servicesRevenue || 8000000, color: '#2563eb' },
    { name: "Fondation Ilyassa", montant: 6000000, color: '#e11d48' },
  ];

  const pieData = [
    { name: 'Bureau d\'Or', value: goldRevenue || 1, color: '#d97706' },
    { name: 'Restaurant (Recettes)', value: restaurantRecettes || 1, color: '#059669' },
    { name: 'Services Divers', value: servicesRevenue || 1, color: '#2563eb' },
  ];

  const handleExportPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <title>Bilan Stratégique - BureauCentral</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; max-width: 800px; margin: 0 auto; }
            h1 { font-size: 24px; color: #0f172a; border-bottom: 2px solid #d97706; padding-bottom: 12px; margin-bottom: 5px; font-family: serif; }
            h2 { font-size: 14px; color: #475569; margin-top: 0; margin-bottom: 30px; font-weight: normal; }
            h3 { font-size: 16px; color: #92400e; margin-top: 25px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; font-family: serif; }
            .kpi-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-top: 20px; }
            .kpi-card { background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; }
            .kpi-title { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: bold; margin-bottom: 5px; }
            .kpi-value { font-size: 20px; font-weight: bold; color: #0f172a; font-family: monospace; }
            @media print {
              body { padding: 10px; }
            }
          </style>
        </head>
        <body>
          <h1>Bilan Stratégique Consolidé</h1>
          <h2>BureauCentral — Pilotage Exécutif (Alh. Ilyassa & ABYFOU)</h2>

          <div class="kpi-grid">
            <div class="kpi-card">
              <div class="kpi-title">Bureau d'Or & Lingots</div>
              <div class="kpi-value">${totalGoldKg.toFixed(1)} kg</div>
              <p style="margin: 5px 0 0; font-size: 12px; color: #475569;">CA Ventes : ${goldRevenue.toLocaleString()} FCFA</p>
            </div>
            <div class="kpi-card">
              <div class="kpi-title">Restaurant (Recettes)</div>
              <div class="kpi-value">${restaurantRecettes.toLocaleString()} FCFA</div>
              <p style="margin: 5px 0 0; font-size: 12px; color: #475569;">Exploitation journalière</p>
            </div>
            <div class="kpi-card">
              <div class="kpi-title">Services Divers</div>
              <div class="kpi-value">${(servicesRevenue / 1000000).toFixed(1)}M FCFA</div>
              <p style="margin: 5px 0 0; font-size: 12px; color: #475569;">Dossiers en cours : ${diverseServices.length}</p>
            </div>
            <div class="kpi-card">
              <div class="kpi-title">Fondation Ilyassa</div>
              <div class="kpi-value">${foundationBeneficiaries.toLocaleString()} bénéficiaires</div>
              <p style="margin: 5px 0 0; font-size: 12px; color: #475569;">Projets actifs : ${foundationProjects.length}</p>
            </div>
          </div>

          <div style="margin-top: 40px; font-size: 11px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 15px;">
            Rapport généré automatiquement depuis la plateforme BureauCentral — 2026
          </div>
          
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 300);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Executive Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 rounded-2xl p-8 text-white shadow-lg border border-slate-700/50 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-4">
            <Award className="w-3.5 h-3.5" />
            <span>Pilotage Exécutif — Alh. Ilyassa & ABYFOU</span>
          </div>
          <h2 className="text-3xl font-serif font-bold tracking-tight mb-3">Tableau de Bord Général</h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            Bienvenue sur le centre de pilotage de BureauCentral. Suivez en temps réel les performances financières du Bureau d'Or, du Restaurant (recettes/dépenses), des Services Divers et l'impact social de la Fondation Ilyassa.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={onOpenAiModal}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold rounded-xl text-xs transition-all shadow-md flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Générer le Bilan Stratégique IA</span>
            </button>
            <button
              onClick={handleExportPDF}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl text-xs transition-all shadow-md flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>Exporter le Bilan PDF</span>
            </button>
            <button
              onClick={() => onNavigateTab('bureau_or')}
              className="px-5 py-2.5 bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-medium rounded-xl text-xs transition-all"
            >
              Inspecter le Bureau
            </button>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Bureau Or */}
        <div 
          onClick={() => onNavigateTab('bureau_or')}
          className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Coins className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> Actif
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Bureau d'Or & Lingots</p>
          <h3 className="text-2xl font-bold font-mono tabular-nums text-slate-900 mb-2">
            {totalGoldKg.toFixed(1)} <span className="text-sm font-sans font-normal text-slate-500">kg en réserve</span>
          </h3>
          <p className="text-xs text-slate-600">CA Ventes : <span className="font-semibold text-slate-900 font-mono">{goldRevenue.toLocaleString()} FCFA</span></p>
        </div>

        {/* Card 2: Restaurant */}
        <div 
          onClick={() => onNavigateTab('restaurant')}
          className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> Exploitation
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Restaurant (Recettes)</p>
          <h3 className="text-2xl font-bold font-mono tabular-nums text-slate-900 mb-2">
            {restaurantRecettes.toLocaleString()} <span className="text-sm font-sans font-normal text-slate-500">FCFA</span>
          </h3>
          <p className="text-xs text-slate-600">Boissons, jus & charges suivis</p>
        </div>

        {/* Card 3: Services Divers */}
        <div 
          onClick={() => onNavigateTab('services_divers')}
          className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Briefcase className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> Suivi
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Services Divers</p>
          <h3 className="text-2xl font-bold font-mono tabular-nums text-slate-900 mb-2">
            {(servicesRevenue / 1000000).toFixed(1)}M <span className="text-sm font-sans font-normal text-slate-500">FCFA facturés</span>
          </h3>
          <p className="text-xs text-slate-600">Demandes en cours : <span className="font-semibold text-slate-900">{diverseServices.length} dossiers</span></p>
        </div>

        {/* Card 4: Fondation Ilyassa */}
        <div 
          onClick={() => onNavigateTab('fondation_ilyassa')}
          className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-rose-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full flex items-center gap-1">
              Impact Social
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Fondation Ilyassa</p>
          <h3 className="text-2xl font-bold font-mono tabular-nums text-slate-900 mb-2">
            {foundationBeneficiaries.toLocaleString()} <span className="text-sm font-sans font-normal text-slate-500">bénéficiaires</span>
          </h3>
          <p className="text-xs text-slate-600">Projets actifs : <span className="font-semibold text-slate-900">{foundationProjects.length} programmes</span></p>
        </div>
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart - Revenue by Department */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-serif font-bold text-slate-900">Répartition du Chiffre d'Affaires</h3>
              <p className="text-xs text-slate-500">Comparatif par pôle d'activité (en FCFA)</p>
            </div>
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
              Consolidé
            </span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 25 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value: any) => [`${Number(value).toLocaleString()} FCFA`, 'Montant']} />
                <Bar dataKey="montant" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart - Revenue Share */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-serif font-bold text-slate-900">Parts de Marché & Pôles</h3>
              <p className="text-xs text-slate-500">Distribution relative des revenus</p>
            </div>
            <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
              Répartition
            </span>
          </div>
          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`pie-cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [`${Number(value).toLocaleString()} FCFA`, 'Valeur']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
