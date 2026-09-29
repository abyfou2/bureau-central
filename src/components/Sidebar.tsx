import React from 'react';
import { User, UserRole } from '../types';
import { 
  LayoutDashboard, 
  Coins, 
  UtensilsCrossed, 
  Briefcase, 
  HeartHandshake, 
  ShieldCheck, 
  BarChart3, 
  Users, 
  Lock, 
  ChevronRight 
} from 'lucide-react';

interface SidebarProps {
  currentUser: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  isOpen
}) => {
  const isGlobalUser = currentUser.role === 'pdg' || currentUser.role === 'admin';
  const isAgent = currentUser.role.includes('_agent');

  const menuItems = [
    {
      id: 'global_dashboard',
      label: 'Tableau de Bord Général',
      icon: LayoutDashboard,
      allowed: isGlobalUser,
      department: 'Global'
    },
    {
      id: 'bureau_or',
      label: 'Bureau d\'Or',
      icon: Coins,
      allowed: isGlobalUser || currentUser.department === 'Bureau',
      department: 'Bureau'
    },
    {
      id: 'restaurant',
      label: 'Restaurant & Traiteur',
      icon: UtensilsCrossed,
      allowed: isGlobalUser || currentUser.department === 'Restaurant',
      department: 'Restaurant'
    },
    {
      id: 'services_divers',
      label: 'Services Divers',
      icon: Briefcase,
      allowed: isGlobalUser || currentUser.department === 'Services diverses',
      department: 'Services diverses'
    },
    {
      id: 'fondation_ilyassa',
      label: 'Fondation Ilyassa',
      icon: HeartHandshake,
      allowed: isGlobalUser || currentUser.department === 'Fondation Ilyassa',
      department: 'Fondation Ilyassa'
    },
    {
      id: 'audit_journal',
      label: 'Journal de Sécurité',
      icon: ShieldCheck,
      allowed: currentUser.role === 'admin', // Super Admin ONLY
      department: 'Sécurité'
    },
    {
      id: 'rbac_management',
      label: 'Gestion des Rôles (RBAC)',
      icon: Users,
      allowed: isGlobalUser,
      department: 'Administration'
    }
  ];

  return (
    <aside className={`
      fixed md:static inset-y-0 left-0 z-40 w-72 bg-slate-900 text-slate-300 border-r border-slate-800 
      transform transition-transform duration-300 ease-in-out flex flex-col
      ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
    `}>
      {/* Brand / Logo */}
      <div className="h-18 px-6 flex items-center border-b border-slate-800/80 bg-slate-950">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-bold shadow-md font-serif text-lg">
            BC
          </div>
          <div>
            <h1 className="text-white font-bold tracking-tight text-base font-serif">BureauCentral</h1>
            <p className="text-[11px] text-amber-400 font-medium">Direction Générale & Départements</p>
          </div>
        </div>
      </div>

      {/* Navigation list */}
      <div className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
          Navigation Principale
        </div>

        {menuItems.map((item) => {
          if (!item.allowed) return null;
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`
                w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all
                ${isActive 
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold' 
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
                <span>{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-4 h-4 text-slate-950" />}
            </button>
          );
        })}
      </div>

      {/* Current User Badge */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/60">
        <div className="flex items-center gap-3">
          <img src={currentUser.avatar} alt={currentUser.name} className="w-10 h-10 rounded-xl object-cover border border-slate-700" />
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
            <p className="text-[10px] text-amber-400 font-medium truncate">{currentUser.title}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
