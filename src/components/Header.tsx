import React, { useState } from 'react';
import { User, UserRole, AppNotification } from '../types';
import { Shield, Sparkles, UserCheck, LogOut, Menu, Bell, BookOpen, Wallet, Sliders, CheckCircle, X, AlertTriangle } from 'lucide-react';

interface HeaderProps {
  currentUser: User;
  onOpenRoleModal: () => void;
  onOpenAiModal: () => void;
  onOpenManualModal: () => void;
  onOpenTreasuryModal: () => void;
  onOpenApprovalConfigModal: () => void;
  onToggleSidebar: () => void;
  activeDepartmentLabel: string;
  notifications: AppNotification[];
  onMarkNotificationRead: (id: string) => void;
  onClearNotifications: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onOpenRoleModal,
  onOpenAiModal,
  onOpenManualModal,
  onOpenTreasuryModal,
  onOpenApprovalConfigModal,
  onToggleSidebar,
  activeDepartmentLabel,
  notifications,
  onMarkNotificationRead,
  onClearNotifications,
  onLogout
}) => {
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

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

  const isAdminOrPdg = currentUser.role === 'admin' || currentUser.role === 'pdg';

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

      <div className="flex items-center gap-2.5">
        {/* Treasury Button */}
        <button
          onClick={onOpenTreasuryModal}
          className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg shadow-xs transition-all font-medium text-xs"
          title="Trésorerie & Soldes de Caisse"
        >
          <Wallet className="w-4 h-4 text-emerald-600" />
          <span className="hidden lg:inline">Trésorerie</span>
        </button>

        {/* Approval Config (Admin / PDG) */}
        {isAdminOrPdg && (
          <button
            onClick={onOpenApprovalConfigModal}
            className="flex items-center gap-1.5 px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 rounded-lg shadow-xs transition-all font-medium text-xs"
            title="Configuration des seuils de validation PDG"
          >
            <Sliders className="w-4 h-4 text-purple-600" />
            <span className="hidden lg:inline">Seuils Validation</span>
          </button>
        )}

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
            className="p-2 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl relative transition-colors"
            title="Notifications & Alertes"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-xs animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotificationsDropdown && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden">
              <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold font-serif">Centre de Notifications</span>
                </div>
                <div className="flex items-center gap-2">
                  {notifications.length > 0 && (
                    <button
                      onClick={onClearNotifications}
                      className="text-[10px] text-slate-300 hover:text-white underline"
                    >
                      Tout effacer
                    </button>
                  )}
                  <button
                    onClick={() => setShowNotificationsDropdown(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    Aucune notification pour le moment.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => onMarkNotificationRead(n.id)}
                      className={`p-3 text-xs transition-colors cursor-pointer hover:bg-slate-50 ${n.read ? 'bg-white opacity-70' : 'bg-amber-50/40'}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-slate-900">{n.title}</span>
                        <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                      </div>
                      <p className="text-slate-600 mb-1">{n.message}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                          {n.department}
                        </span>
                        {!n.read && (
                          <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

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

