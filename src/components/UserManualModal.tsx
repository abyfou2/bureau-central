import React from 'react';
import { BookOpen, X, Printer, Shield, Coins, UtensilsCrossed, Briefcase, HeartHandshake, CheckCircle2 } from 'lucide-react';

interface UserManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserManualModal: React.FC<UserManualModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handlePrintPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <title>Manuel de Formation - BureauCentral</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; max-width: 800px; margin: 0 auto; }
            h1 { font-size: 24px; color: #0f172a; border-bottom: 2px solid #d97706; padding-bottom: 12px; margin-bottom: 5px; font-family: serif; }
            h2 { font-size: 14px; color: #475569; margin-top: 0; margin-bottom: 30px; font-weight: normal; }
            h3 { font-size: 16px; color: #92400e; margin-top: 25px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; font-family: serif; }
            h4 { font-size: 13px; color: #1e293b; margin-top: 15px; margin-bottom: 5px; font-weight: bold; }
            p, li { font-size: 13px; }
            ul { margin-top: 5px; padding-left: 20px; }
            li { margin-bottom: 6px; }
            .section { margin-bottom: 25px; }
            @media print {
              body { padding: 10px; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <h1>Manuel de Formation & Guide d'Utilisation</h1>
          <h2>Plateforme Intégrée BureauCentral — Édition 2026</h2>

          <div class="section">
            <h3>01. Introduction & Objectifs de BureauCentral</h3>
            <p><strong>BureauCentral</strong> est la plateforme de gestion intégrée et multidépendante conçue pour centraliser les opérations stratégiques et financières de l'organisation. Elle couvre quatre départements clés sous un pilotage exécutif unifié :</p>
            <ul>
              <li><strong>Bureau d'Or & Lingots :</strong> Achat, vente et traçabilité des stocks d'or physique certifié LBMA.</li>
              <li><strong>Restaurant & Traiteur :</strong> Suivi des recettes, boissons, jus et dépenses d'exploitation.</li>
              <li><strong>Services Divers :</strong> Prestations logistiques, consulting et facturation inter-entreprises.</li>
              <li><strong>Fondation Ilyassa :</strong> Pilotage des projets humanitaires, forages d'eau et aide sociale.</li>
            </ul>
          </div>

          <div class="section">
            <h3>02. Authentification & Gestion des Rôles (RBAC)</h3>
            <p>L'accès à la plateforme est sécurisé par rôle. Chaque utilisateur dispose de droits stricts selon son département :</p>
            <ul>
              <li><strong>Super Administrateur & RH (ABYFOU - nasmacharity@gmail.com) :</strong> Accès total à tous les départements, gestion des utilisateurs, journal d'audit et paramètres de sécurité.</li>
              <li><strong>Président Directeur Général (PDG - Alh. Ilyassa) :</strong> Vue globale consolidée de toutes les activités, bilans stratégiques et rapports financiers.</li>
              <li><strong>Responsables de Département :</strong> Gestion opérationnelle et enregistrement des transactions spécifiques à leur pôle.</li>
            </ul>
          </div>

          <div class="section">
            <h3>03. Guide Pratique par Département</h3>
            <h4>1. Bureau d'Or & Lingots</h4>
            <p>Permet de suivre le cours mondial en temps réel (affiché en USD et en FCFA par once et par gramme). Enregistrez les achats ou ventes de lingots (poids en kg, pureté 24K/22K, prix et contrepartie).</p>
            
            <h4>2. Restaurant & Traiteur</h4>
            <p>Enregistrez chaque jour les recettes (boissons, jus, salle) et les dépenses (achats de denrées, salaires, fonctionnement). Le solde net s'actualise en temps réel.</p>
            
            <h4>3. Services Divers & Facturation</h4>
            <p>Suivi des dossiers clients (transport sécurisé, immobilier, consulting) et des statuts de prestations.</p>
            
            <h4>4. Fondation Ilyassa</h4>
            <p>Gestion des programmes humanitaires (forages d'eau, éducation, santé) avec suivi des budgets, décaissements et bénéficiaires.</p>
          </div>

          <div class="section">
            <h3>04. Bonnes Pratiques & Sécurité</h3>
            <ul>
              <li>Déconnectez-vous toujours de votre session lorsque vous quittez votre poste de travail.</li>
              <li>Toutes les actions sensibles sont enregistrées automatiquement dans le journal d'audit sécurisé.</li>
              <li>Utilisez le bouton d'export PDF sur chaque page pour générer des rapports officiels.</li>
            </ul>
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
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold">Manuel de Formation & Guide d'Utilisation</h2>
              <p className="text-xs text-slate-400">Plateforme Intégrée BureauCentral — Édition 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrintPDF}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-md"
            >
              <Printer className="w-4 h-4" /> Imprimer / PDF
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 text-lg font-bold"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 text-slate-700 text-sm leading-relaxed">
          
          {/* Section 1 */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-slate-900 font-serif flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-mono">01</span>
              Introduction & Objectifs de BureauCentral
            </h3>
            <p>
              <strong>BureauCentral</strong> est la plateforme de gestion intégrée et multidépendante conçue pour centraliser les opérations stratégiques et financières de l'organisation. Elle couvre quatre départements clés sous un pilotage exécutif unifié :
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <li className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                <strong className="text-slate-900">Bureau d'Or & Lingots :</strong> Achat, vente et traçabilité des stocks d'or physique certifié LBMA.
              </li>
              <li className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                <strong className="text-slate-900">Restaurant & Traiteur :</strong> Suivi des recettes, boissons, jus et dépenses d'exploitation.
              </li>
              <li className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                <strong className="text-slate-900">Services Divers :</strong> Prestations logistiques, consulting et facturation inter-entreprises.
              </li>
              <li className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                <strong className="text-slate-900">Fondation Ilyassa :</strong> Pilotage des projets humanitaires, forages d'eau et aide sociale.
              </li>
            </ul>
          </div>

          <hr className="border-slate-100" />

          {/* Section 2 */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-slate-900 font-serif flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-mono">02</span>
              Authentification & Gestion des Rôles (RBAC)
            </h3>
            <p>
              L'accès à la plateforme est sécurisé par rôle. Chaque utilisateur dispose de droits stricts selon son département :
            </p>
            <div className="space-y-2">
              <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl text-xs space-y-1">
                <p className="font-bold text-amber-900">Super Administrateur & RH (ex: ABYFOU - nasmacharity@gmail.com)</p>
                <p className="text-slate-600">Accès total à tous les départements, gestion des utilisateurs, journal d'audit et paramètres de sécurité.</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                <p className="font-bold text-slate-900">Président Directeur Général (PDG - ex: Alh. Ilyassa)</p>
                <p className="text-slate-600">Vue globale consolidée de toutes les activités, bilans stratégiques et rapports financiers.</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                <p className="font-bold text-slate-900">Responsables de Département (Bureau, Restaurant, Services, Fondation)</p>
                <p className="text-slate-600">Gestion opérationnelle et enregistrement des transactions spécifiques à leur pôle.</p>
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section 3 */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-slate-900 font-serif flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-mono">03</span>
              Guide Pratique par Département
            </h3>
            <div className="space-y-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-amber-600" /> 1. Bureau d'Or & Lingots
                </h4>
                <p>
                  Permet de suivre le cours mondial en temps réel (affiché en USD et en FCFA par once et par gramme). Cliquez sur <strong>« Nouvelle Transaction Or »</strong> pour enregistrer un achat ou une vente de lingots (poids en kg, pureté 24K/22K, prix et contrepartie).
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <UtensilsCrossed className="w-4 h-4 text-emerald-600" /> 2. Restaurant & Traiteur
                </h4>
                <p>
                  Enregistrez chaque jour les recettes (boissons, jus, salle) et les dépenses (achats de denrées, salaires, fonctionnement). Le solde net s'actualise en temps réel.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-blue-600" /> 3. Services Divers & Facturation
                </h4>
                <p>
                  Suivi des dossiers clients (transport sécurisé, immobilier, consulting). Permet de suivre le statut des prestations (En attente, En cours, Traité).
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <HeartHandshake className="w-4 h-4 text-rose-600" /> 4. Fondation Ilyassa
                </h4>
                <p>
                  Gestion des programmes humanitaires (forages d'eau, éducation, santé) avec suivi des budgets alloués, des décaissements et du nombre de bénéficiaires.
                </p>
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section 4 */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-slate-900 font-serif flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-mono">04</span>
              Bonnes Pratiques & Sécurité
            </h3>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
              <li>Déconnectez-vous toujours de votre session lorsque vous quittez votre poste de travail.</li>
              <li>Toutes les actions sensibles (validation d'achats d'or, création de comptes, décaissements) sont enregistrées automatiquement dans le journal d'audit sécurisé.</li>
              <li>Utilisez le bouton <strong>« Exporter en PDF »</strong> sur chaque page pour générer des rapports officiels imprimables.</li>
            </ul>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-900 text-white font-semibold rounded-xl text-xs hover:bg-slate-800 transition-colors"
          >
            Fermer le Manuel
          </button>
        </div>

      </div>
    </div>
  );
};
