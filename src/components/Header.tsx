import React from 'react';
import { User, UserRole } from '../types';
import { Shield, Sparkles, UserCheck, LogOut, Menu, Bell, BookOpen } from 'lucide-react';

interface HeaderProps {
  currentUser: User;
  onOpenRoleModal: () => void;
  onOpenAiModal: () => void;
  onOpenManualModal: () => void;
  onToggleSidebar: () => void;
  activeDepartmentLabel: string;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onOpenRoleModal,
  onOpenAiModal,
  onOpenManualModal,
  onToggleSidebar,
  activeDepartmentLabel,
  onLogout
}) => {
  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'pdg': return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'admin': return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'bureau_manager': return 'bg-yellow-100 text-yellow-900 border-yellow-300';
      case 'restaurant_manager': return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'services_manager': return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'fondation_manager': return 'bg-rose-100 text-rose-900 border-rose-300';
      default: return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <header className="h-18 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div className="flex items-center gap-4">
        <button 
          onClick={onToggleSidebar}
          className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
          title="Basculer le menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-slate-900 font-serif">BureauCentral</span>
            <span className="text-xs px-2 py-0.5 rounded font-medium bg-slate-100 text-slate-600 border border-slate-200 hidden sm:inline-block">
              {activeDepartmentLabel}
            </span>
          </div>
          <p className="text-xs text-slate-500 hidden sm:block">Plateforme de Gestion Intégrée & Multidépartementale</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* User Manual Button */}
        <button
          onClick={onOpenManualModal}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg shadow-xs transition-all font-medium text-xs tracking-wide"
          title="Manuel de Formation Utilisateur"
        >
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span className="hidden md:inline">Manuel</span>
        </button>

        {/* AI Advisor Button */}
        <button
          onClick={onOpenAiModal}
          className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg shadow-xs hover:from-amber-700 hover:to-amber-800 transition-all font-medium text-xs tracking-wide"
        >
          <Sparkles className="w-4 h-4 text-amber-200 animate-pulse" />
          <span className="hidden sm:inline">Conseiller IA Gemini</span>
        </button>

        {/* Role Selector Trigger */}
        <button
          onClick={onOpenRoleModal}
          className="flex items-center gap-3 p-1.5 pl-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all group"
          title="Changer de profil ou rôle (RBAC)"
        >
          <div className="text-right hidden md:block">
            <p className="text-xs font-semibold text-slate-900 leading-tight">{currentUser.name}</p>
            <span className={`inline-block text-[10px] font-medium px-1.5 py-0.2 rounded border ${getRoleBadgeColor(currentUser.role)}`}>
              {currentUser.title}
            </span>
          </div>
          <img 
            src={currentUser.avatar} 
            alt={currentUser.name} 
            className="w-9 h-9 rounded-lg object-cover border border-slate-300 group-hover:border-amber-500 transition-colors"
          />
        </button>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="p-2 text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors"
          title="Déconnexion"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
