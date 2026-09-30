import React, { useState, useEffect } from 'react';
import { 
  INITIAL_USERS, 
  INITIAL_GOLD_TRANSACTIONS, 
  INITIAL_GOLD_EXPENSES,
  INITIAL_RESTAURANT_TRANSACTIONS, 
  INITIAL_SERVICES_REQUESTS, 
  INITIAL_SERVICES_EXPENSES,
  INITIAL_FOUNDATION_PROJECTS, 
  INITIAL_FOUNDATION_EXPENSES,
  INITIAL_FOUNDATION_DONATIONS, 
  INITIAL_AUDIT_LOGS 
} from './mockData';
import { User, GoldTransaction, GoldExpense, RestaurantTransaction, DiverseServiceRequest, DiverseServiceExpense, FoundationProject, FoundationExpense, AuditLog, AppNotification, ApprovalConfig, TreasuryAccount } from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { GlobalDashboard } from './components/GlobalDashboard';
import { BureauGoldView } from './components/BureauGoldView';
import { RestaurantView } from './components/RestaurantView';
import { ServicesDiversView } from './components/ServicesDiversView';
import { FondationIlyassaView } from './components/FondationIlyassaView';
import { RoleManagementModal } from './components/RoleManagementModal';
import { AiAssistantModal } from './components/AiAssistantModal';
import { UserManualModal } from './components/UserManualModal';
import { TreasuryModal } from './components/TreasuryModal';
import { ApprovalConfigModal } from './components/ApprovalConfigModal';
import { LoginView } from './components/LoginView';
import { Lock, Database, Upload } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const defaultUser: User = INITIAL_USERS[0] || {
    id: 'u1',
    name: 'ABYFOU',
    role: 'admin',
    department: 'Global',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    email: 'admin@bureaucentral.com',
    title: 'Super Administrateur & Sécurité',
    password: '1234'
  };
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('bureau_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const savedUsers = localStorage.getItem('bureau_users');
    const uList = savedUsers ? JSON.parse(savedUsers) : INITIAL_USERS;
    return uList[0] || defaultUser;
  });
  const [activeTab, setActiveTab] = useState<string>('global_dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);

  // App Data State with localStorage persistence (with version check to reset old mock data)
  const [goldTransactions, setGoldTransactions] = useState<GoldTransaction[]>(() => {
    const saved = localStorage.getItem('bureau_gold_transactions');
    return saved ? JSON.parse(saved) : INITIAL_GOLD_TRANSACTIONS;
  });
  const [goldExpenses, setGoldExpenses] = useState<GoldExpense[]>(() => {
    const saved = localStorage.getItem('bureau_gold_expenses');
    return saved ? JSON.parse(saved) : INITIAL_GOLD_EXPENSES;
  });
  const [restaurantTransactions, setRestaurantTransactions] = useState<RestaurantTransaction[]>(() => {
    const saved = localStorage.getItem('bureau_restaurant_transactions');
    return saved ? JSON.parse(saved) : INITIAL_RESTAURANT_TRANSACTIONS;
  });
  const [diverseServices, setDiverseServices] = useState<DiverseServiceRequest[]>(() => {
    const saved = localStorage.getItem('bureau_diverse_services');
    return saved ? JSON.parse(saved) : INITIAL_SERVICES_REQUESTS;
  });
  const [diverseExpenses, setDiverseExpenses] = useState<DiverseServiceExpense[]>(() => {
    const saved = localStorage.getItem('bureau_diverse_expenses');
    return saved ? JSON.parse(saved) : INITIAL_SERVICES_EXPENSES;
  });
  const [foundationProjects, setFoundationProjects] = useState<FoundationProject[]>(() => {
    const saved = localStorage.getItem('bureau_foundation_projects');
    return saved ? JSON.parse(saved) : INITIAL_FOUNDATION_PROJECTS;
  });
  const [foundationExpenses, setFoundationExpenses] = useState<FoundationExpense[]>(() => {
    const saved = localStorage.getItem('bureau_foundation_expenses');
    return saved ? JSON.parse(saved) : INITIAL_FOUNDATION_EXPENSES;
  });
  const [foundationDonations] = useState(INITIAL_FOUNDATION_DONATIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('bureau_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('bureau_notifications');
    return saved ? JSON.parse(saved) : [
      {
        id: 'n-1',
        title: 'Système Opérationnel',
        message: 'Bienvenue sur BureauCentral. Tous les départements sont synchronisés.',
        type: 'success',
        department: 'Global',
        timestamp: 'Aujourd\'hui',
        read: false
      }
    ];
  });

  const [approvalConfig, setApprovalConfig] = useState<ApprovalConfig>(() => {
    const saved = localStorage.getItem('bureau_approval_config');
    return saved ? JSON.parse(saved) : {
      'Bureau': { enabled: true, thresholdAmount: 500000 },
      'Restaurant': { enabled: true, thresholdAmount: 150000 },
      'Services diverses': { enabled: true, thresholdAmount: 200000 },
      'Fondation Ilyassa': { enabled: true, thresholdAmount: 300000 }
    };
  });

  const [treasuryAccounts, setTreasuryAccounts] = useState<TreasuryAccount[]>(() => {
    const saved = localStorage.getItem('bureau_treasury_accounts');
    return saved ? JSON.parse(saved) : [
      { id: 'acc-1', department: "Bureau d'Or", accountName: 'Caisse Principale Or & Espèces', balance: 0, currency: 'XOF' },
      { id: 'acc-2', department: 'Restaurant', accountName: 'Compte Recettes Restaurant', balance: 0, currency: 'XOF' },
      { id: 'acc-3', department: 'Services Divers', accountName: 'Caisse Prestations & Consulting', balance: 0, currency: 'XOF' },
      { id: 'acc-4', department: 'Fondation Ilyassa', accountName: 'Fonds Humanitaires & Dons', balance: 0, currency: 'XOF' }
    ];
  });

  const [isTreasuryModalOpen, setIsTreasuryModalOpen] = useState(false);
  const [isApprovalConfigModalOpen, setIsApprovalConfigModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('bureau_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('bureau_approval_config', JSON.stringify(approvalConfig));
  }, [approvalConfig]);

  useEffect(() => {
    localStorage.setItem('bureau_treasury_accounts', JSON.stringify(treasuryAccounts));
  }, [treasuryAccounts]);

  const addNotification = (title: string, message: string, department: string, type: 'info' | 'warning' | 'success' | 'approval' = 'info') => {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title,
      message,
      department,
      type,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const updateTreasuryBalance = (departmentName: string, amountChange: number) => {
    setTreasuryAccounts(prev => prev.map(acc => {
      if (acc.department.toLowerCase().includes(departmentName.toLowerCase()) || departmentName.toLowerCase().includes(acc.department.toLowerCase())) {
        return { ...acc, balance: acc.balance + amountChange };
      }
      return acc;
    }));
  };

  const checkApprovalNeeded = (department: string, amount: number): boolean => {
    const cfg = approvalConfig[department];
    if (cfg && cfg.enabled && amount >= cfg.thresholdAmount) {
      addNotification(
        `Validation PDG Requise (${department})`,
        `Dépense de ${amount.toLocaleString()} FCFA supérieure au seuil (${cfg.thresholdAmount.toLocaleString()} FCFA). En attente d'approbation.`,
        department,
        'approval'
      );
      return true;
    }
    return false;
  };

  useEffect(() => {
    localStorage.setItem('bureau_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('bureau_gold_transactions', JSON.stringify(goldTransactions));
  }, [goldTransactions]);

  useEffect(() => {
    localStorage.setItem('bureau_gold_expenses', JSON.stringify(goldExpenses));
  }, [goldExpenses]);

  useEffect(() => {
    localStorage.setItem('bureau_restaurant_transactions', JSON.stringify(restaurantTransactions));
  }, [restaurantTransactions]);

  useEffect(() => {
    localStorage.setItem('bureau_diverse_services', JSON.stringify(diverseServices));
  }, [diverseServices]);

  useEffect(() => {
    localStorage.setItem('bureau_diverse_expenses', JSON.stringify(diverseExpenses));
  }, [diverseExpenses]);

  useEffect(() => {
    localStorage.setItem('bureau_foundation_projects', JSON.stringify(foundationProjects));
  }, [foundationProjects]);

  useEffect(() => {
    localStorage.setItem('bureau_foundation_expenses', JSON.stringify(foundationExpenses));
  }, [foundationExpenses]);

  useEffect(() => {
    localStorage.setItem('bureau_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  const handleAddUser = (newUser: User) => {
    setUsers([newUser, ...users]);
    addAuditLog(`Création d'un nouveau compte utilisateur: ${newUser.name} (${newUser.title})`, 'Global');
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error(e);
    }
    setIsAuthenticated(false);
    addAuditLog(`Déconnexion de l'utilisateur ${currentUser.name}`, 'Global');
  };

  // Handlers for adding records with audit logs
  const handleAddGoldTransaction = (t: Omit<GoldTransaction, 'id'>) => {
    const newTx: GoldTransaction = { ...t, id: `gt-${Date.now()}` };
    setGoldTransactions([newTx, ...goldTransactions]);
    addAuditLog(`Ajout transaction ${t.type} (${t.weightKg} kg)`, 'Bureau');
    if (t.type === 'vente') {
      updateTreasuryBalance("Bureau d'Or", t.totalAmount);
    } else {
      updateTreasuryBalance("Bureau d'Or", -t.totalAmount);
    }
  };

  const handleUpdateGoldTransaction = (updated: GoldTransaction) => {
    setGoldTransactions(prev => prev.map(t => t.id === updated.id ? updated : t));
    addAuditLog(`Modification transaction ${updated.id}`, 'Bureau');
  };

  const handleDeleteGoldTransaction = (id: string) => {
    setGoldTransactions(prev => prev.filter(t => t.id !== id));
    addAuditLog(`Suppression transaction ${id}`, 'Bureau');
  };

  const handleAddGoldExpense = (e: Omit<GoldExpense, 'id'>) => {
    checkApprovalNeeded('Bureau', e.amount);
    const newExp: GoldExpense = { ...e, id: `gexp-${Date.now()}` };
    setGoldExpenses([newExp, ...goldExpenses]);
    addAuditLog(`Bureau d'Or: Ajout dépense (${e.category} - ${e.amount.toLocaleString()} FCFA)`, 'Bureau');
    updateTreasuryBalance("Bureau d'Or", -e.amount);
  };

  const handleDeleteGoldExpense = (id: string) => {
    setGoldExpenses(prev => prev.filter(e => e.id !== id));
    addAuditLog(`Bureau d'Or: Suppression dépense ${id}`, 'Bureau');
  };

  const handleAddRestaurantTransaction = (t: Omit<RestaurantTransaction, 'id'>) => {
    const newTx: RestaurantTransaction = { ...t, id: `rt-${Date.now()}` };
    setRestaurantTransactions([newTx, ...restaurantTransactions]);
    addAuditLog(`Restaurant: Ajout ${t.type} (${t.category} - ${t.amount.toLocaleString()} FCFA)`, 'Restaurant');
    if (t.type === 'recette') {
      updateTreasuryBalance('Restaurant', t.amount);
    } else {
      checkApprovalNeeded('Restaurant', t.amount);
      updateTreasuryBalance('Restaurant', -t.amount);
    }
  };

  const handleAddServiceRequest = (req: Omit<DiverseServiceRequest, 'id'>) => {
    const newReq: DiverseServiceRequest = { ...req, id: `dsr-${Date.now()}` };
    setDiverseServices([newReq, ...diverseServices]);
    addAuditLog(`Nouveau dossier service divers: ${req.clientName}`, 'Services diverses');
    updateTreasuryBalance('Services Divers', req.amount);
  };

  const handleAddDiverseExpense = (e: Omit<DiverseServiceExpense, 'id'>) => {
    checkApprovalNeeded('Services diverses', e.amount);
    const newExp: DiverseServiceExpense = { ...e, id: `dexp-${Date.now()}` };
    setDiverseExpenses([newExp, ...diverseExpenses]);
    addAuditLog(`Services Divers: Ajout dépense (${e.category} - ${e.amount.toLocaleString()} FCFA)`, 'Services diverses');
    updateTreasuryBalance('Services Divers', -e.amount);
  };

  const handleDeleteDiverseExpense = (id: string) => {
    setDiverseExpenses(prev => prev.filter(e => e.id !== id));
    addAuditLog(`Services Divers: Suppression dépense ${id}`, 'Services diverses');
  };

  const handleAddFoundationProject = (p: Omit<FoundationProject, 'id'>) => {
    const newProj: FoundationProject = { ...p, id: `fp-${Date.now()}` };
    setFoundationProjects([newProj, ...foundationProjects]);
    addAuditLog(`Lancement projet humanitaire: ${p.title}`, 'Fondation Ilyassa');
  };

  const handleAddFoundationExpense = (e: Omit<FoundationExpense, 'id'>) => {
    checkApprovalNeeded('Fondation Ilyassa', e.amount);
    const newExp: FoundationExpense = { ...e, id: `fexp-${Date.now()}` };
    setFoundationExpenses([newExp, ...foundationExpenses]);
    addAuditLog(`Fondation Ilyassa: Ajout dépense (${e.category} - ${e.amount.toLocaleString()} FCFA)`, 'Fondation Ilyassa');
    updateTreasuryBalance('Fondation Ilyassa', -e.amount);
  };

  const handleDeleteFoundationExpense = (id: string) => {
    setFoundationExpenses(prev => prev.filter(e => e.id !== id));
    addAuditLog(`Fondation Ilyassa: Suppression dépense ${id}`, 'Fondation Ilyassa');
  };

  const addAuditLog = (action: string, department: string) => {
    const newLog: AuditLog = {
      id: `al-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      userName: currentUser.name,
      role: currentUser.title,
      action,
      department
    };
    setAuditLogs([newLog, ...auditLogs]);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
    if (currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
    addAuditLog(`Modification du compte utilisateur ${updatedUser.name} (${updatedUser.role})`, 'Administration');
  };

  const handleDeleteUser = (userId: string) => {
    const target = users.find(u => u.id === userId);
    setUsers(users.filter(u => u.id !== userId));
    addAuditLog(`Suppression du compte utilisateur ${target?.name || userId}`, 'Administration');
  };

  const handleSwitchUser = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'bureau_manager') setActiveTab('bureau_or');
    else if (user.role === 'restaurant_manager') setActiveTab('restaurant');
    else if (user.role === 'services_manager') setActiveTab('services_divers');
    else if (user.role === 'fondation_manager') setActiveTab('fondation_ilyassa');
    else setActiveTab('global_dashboard');

    addAuditLog(`Changement de profil utilisateur vers ${user.name} (${user.title})`, 'Global');
  };

  const handleExportBackup = () => {
    const backupData = {
      version: '2.13',
      exportDate: new Date().toISOString(),
      users,
      goldTransactions,
      goldExpenses,
      restaurantTransactions,
      diverseServices,
      diverseExpenses,
      foundationProjects,
      foundationExpenses,
      auditLogs,
      treasuryAccounts,
      approvalConfig,
      notifications
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `bureaucentral_backup_${new Date().toISOString().substring(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addAuditLog("Export de la sauvegarde de la base de données", "Administration");
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.users) setUsers(parsed.users);
          if (parsed.goldTransactions) setGoldTransactions(parsed.goldTransactions);
          if (parsed.goldExpenses) setGoldExpenses(parsed.goldExpenses);
          if (parsed.restaurantTransactions) setRestaurantTransactions(parsed.restaurantTransactions);
          if (parsed.diverseServices) setDiverseServices(parsed.diverseServices);
          if (parsed.diverseExpenses) setDiverseExpenses(parsed.diverseExpenses);
          if (parsed.foundationProjects) setFoundationProjects(parsed.foundationProjects);
          if (parsed.foundationExpenses) setFoundationExpenses(parsed.foundationExpenses);
          if (parsed.auditLogs) setAuditLogs(parsed.auditLogs);
          if (parsed.treasuryAccounts) setTreasuryAccounts(parsed.treasuryAccounts);
          if (parsed.approvalConfig) setApprovalConfig(parsed.approvalConfig);
          if (parsed.notifications) setNotifications(parsed.notifications);

          alert("Restauration de la base de données effectuée avec succès !");
          addAuditLog("Restauration de la base de données depuis un fichier de backup", "Administration");
        } catch (err) {
          alert("Erreur lors de la lecture du fichier de sauvegarde. Assurez-vous qu'il s'agit d'un fichier JSON valide.");
        }
      };
    }
  };

  const isGlobalUser = currentUser.role === 'pdg' || currentUser.role === 'admin';
  const checkAccess = (tab: string) => {
    if (isGlobalUser) return true;
    if (tab === 'bureau_or' && currentUser.department === 'Bureau') return true;
    if (tab === 'restaurant' && currentUser.department === 'Restaurant') return true;
    if (tab === 'services_divers' && currentUser.department === 'Services diverses') return true;
    if (tab === 'fondation_ilyassa' && currentUser.department === 'Fondation Ilyassa') return true;
    return false;
  };

  const getActiveDepartmentLabel = () => {
    switch (activeTab) {
      case 'global_dashboard': return 'Vue Globale PDG';
      case 'bureau_or': return 'Bureau d\'Or';
      case 'restaurant': return 'Restaurant (Comptabilité)';
      case 'services_divers': return 'Services Divers';
      case 'fondation_ilyassa': return 'Fondation Ilyassa';
      case 'rbac_management': return 'Administration RBAC';
      default: return 'Tableau de bord';
    }
  };

  if (!isAuthenticated) {
    return (
      <LoginView
        users={users}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setIsAuthenticated(true);
        }}
        onAddUser={handleAddUser}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 antialiased selection:bg-amber-500 selection:text-white">
      <Header
        currentUser={currentUser}
        onOpenRoleModal={() => setIsRoleModalOpen(true)}
        onOpenAiModal={() => setIsAiModalOpen(true)}
        onOpenManualModal={() => setIsManualModalOpen(true)}
        onOpenTreasuryModal={() => setIsTreasuryModalOpen(true)}
        onOpenApprovalConfigModal={() => setIsApprovalConfigModalOpen(true)}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        activeDepartmentLabel={getActiveDepartmentLabel()}
        notifications={notifications}
        onMarkNotificationRead={(id) => {
          setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        }}
        onClearNotifications={() => setNotifications([])}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          currentUser={currentUser}
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setIsSidebarOpen(false);
          }}
          isOpen={isSidebarOpen}
        />

        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-7xl mx-auto">
            {!checkAccess(activeTab) ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs my-12 space-y-4 max-w-lg mx-auto">
                <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                  <Lock className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold font-serif text-slate-900">Accès Restreint (RBAC)</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Votre profil actuel (<span className="font-semibold text-slate-900">{currentUser.title}</span>) ne dispose pas des droits nécessaires pour accéder à cette section.
                </p>
                <button
                  onClick={() => setIsRoleModalOpen(true)}
                  className="px-6 py-2.5 bg-slate-900 text-white font-semibold rounded-xl text-xs hover:bg-slate-800 transition-colors"
                >
                  Changer de rôle pour y accéder
                </button>
              </div>
            ) : (
              <>
                {activeTab === 'global_dashboard' && (
                  <GlobalDashboard
                    goldTransactions={goldTransactions}
                    goldExpenses={goldExpenses}
                    restaurantTransactions={restaurantTransactions}
                    diverseServices={diverseServices}
                    diverseExpenses={diverseExpenses}
                    foundationProjects={foundationProjects}
                    foundationExpenses={foundationExpenses}
                    auditLogs={auditLogs}
                    onNavigateTab={setActiveTab}
                    onOpenAiModal={() => setIsAiModalOpen(true)}
                    isAdmin={currentUser.role === 'admin'}
                  />
                )}

                {activeTab === 'bureau_or' && (
                  <BureauGoldView
                    transactions={goldTransactions}
                    expenses={goldExpenses}
                    onAddTransaction={handleAddGoldTransaction}
                    onUpdateTransaction={handleUpdateGoldTransaction}
                    onDeleteTransaction={handleDeleteGoldTransaction}
                    onAddExpense={handleAddGoldExpense}
                    onDeleteExpense={handleDeleteGoldExpense}
                    currentUser={currentUser}
                  />
                )}

                {activeTab === 'audit_journal' && currentUser.role === 'admin' && (
                  <div className="space-y-6">
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
                      <h3 className="text-lg font-bold text-slate-900 font-serif">Journal de Sécurité & Audit Système</h3>
                      <p className="text-xs text-slate-500">Traçabilité complète des actions, accès et modifications (Réservé au Super Administrateur)</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                      <table className="w-full text-left border-collapse font-mono text-xs">
                        <thead>
                          <tr className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                            <th className="py-3.5 px-6">Date / Heure</th>
                            <th className="py-3.5 px-6">Utilisateur</th>
                            <th className="py-3.5 px-6">Rôle</th>
                            <th className="py-3.5 px-6">Département</th>
                            <th className="py-3.5 px-6">Action Réalisée</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {auditLogs.map((log) => (
                            <tr key={log.id} className="hover:bg-slate-50">
                              <td className="py-3 px-6 text-slate-500">{log.timestamp}</td>
                              <td className="py-3 px-6 font-bold text-slate-900">{log.userName}</td>
                              <td className="py-3 px-6 text-slate-700">{log.role}</td>
                              <td className="py-3 px-6">
                                <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-800">{log.department}</span>
                              </td>
                              <td className="py-3 px-6 text-slate-900 font-medium">{log.action}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeTab === 'restaurant' && (
                  <RestaurantView
                    transactions={restaurantTransactions}
                    onAddTransaction={handleAddRestaurantTransaction}
                  />
                )}

                {activeTab === 'services_divers' && (
                  <ServicesDiversView
                    requests={diverseServices}
                    expenses={diverseExpenses}
                    onAddRequest={handleAddServiceRequest}
                    onAddExpense={handleAddDiverseExpense}
                    onDeleteExpense={handleDeleteDiverseExpense}
                    currentUser={currentUser}
                  />
                )}

                {activeTab === 'fondation_ilyassa' && (
                  <FondationIlyassaView
                    projects={foundationProjects}
                    expenses={foundationExpenses}
                    donations={foundationDonations}
                    onAddProject={handleAddFoundationProject}
                    onAddExpense={handleAddFoundationExpense}
                    onDeleteExpense={handleDeleteFoundationExpense}
                    currentUser={currentUser}
                  />
                )}

                {activeTab === 'rbac_management' && (
                  <div className="space-y-6">
                    {/* Database Backup & Restore Card */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
                      <div>
                        <h4 className="text-base font-bold font-serif mb-1">Sauvegarde & Restauration de la Base de Données</h4>
                        <p className="text-xs text-slate-300">Exportez toutes vos données (transactions, caisses, utilisateurs, audits) en un fichier JSON ou restaurez une sauvegarde précédente pour éviter toute perte de données lors des mises à jour.</p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <button
                          onClick={handleExportBackup}
                          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2"
                        >
                          <Database className="w-4 h-4" />
                          <span>Exporter la Sauvegarde (.JSON)</span>
                        </button>
                        <label className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer">
                          <Upload className="w-4 h-4" />
                          <span>Restaurer une Sauvegarde</span>
                          <input
                            type="file"
                            accept=".json"
                            onChange={handleImportBackup}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 font-serif">Matrice des Droits d'Accès (RBAC) & Utilisateurs</h3>
                        <p className="text-xs text-slate-500">Supervision des privilèges et création des comptes collaborateurs</p>
                      </div>
                      <button
                        onClick={() => setIsRoleModalOpen(true)}
                        className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-400 transition-colors"
                      >
                        Gérer / Ajouter un utilisateur
                      </button>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                            <th className="py-3.5 px-6">Utilisateur</th>
                            <th className="py-3.5 px-6">Rôle Principal</th>
                            <th className="py-3.5 px-6">Département Attitré</th>
                            <th className="py-3.5 px-6">Niveau d'Accès</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                          {users.map((u) => (
                            <tr key={u.id} className="hover:bg-slate-50">
                              <td className="py-4 px-6 flex items-center gap-3">
                                <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-lg object-cover" />
                                <div>
                                  <p className="font-bold text-slate-900">{u.name}</p>
                                  <p className="text-xs text-slate-500">{u.email}</p>
                                </div>
                              </td>
                              <td className="py-4 px-6 font-medium text-slate-800">{u.title}</td>
                              <td className="py-4 px-6">
                                <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-800">
                                  {u.department || 'Global'}
                                </span>
                              </td>
                              <td className="py-4 px-6">
                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                                  u.role === 'pdg' || u.role === 'admin' ? 'bg-amber-100 text-amber-900' : 'bg-blue-100 text-blue-900'
                                }`}>
                                  {u.role === 'pdg' || u.role === 'admin' ? 'Accès Global Total' : 'Accès Restreint Département'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {isRoleModalOpen && (
        <RoleManagementModal
          users={users}
          currentUser={currentUser}
          onSwitchUser={handleSwitchUser}
          onAddUser={handleAddUser}
          onUpdateUser={handleUpdateUser}
          onDeleteUser={handleDeleteUser}
          onClose={() => setIsRoleModalOpen(false)}
        />
      )}

      {isAiModalOpen && (
        <AiAssistantModal
          onClose={() => setIsAiModalOpen(false)}
          departmentData={{
            goldTransactions,
            restaurantTransactions,
            diverseServices,
            foundationProjects
          }}
        />
      )}

      <UserManualModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
      />

      {isTreasuryModalOpen && (
        <TreasuryModal
          accounts={treasuryAccounts}
          onUpdateAccount={(updatedAcc) => {
            setTreasuryAccounts(prev => prev.map(a => a.id === updatedAcc.id ? updatedAcc : a));
            addAuditLog(`Mise à jour du solde du compte ${updatedAcc.accountName} (${updatedAcc.balance.toLocaleString()} XOF)`, updatedAcc.department);
          }}
          onClose={() => setIsTreasuryModalOpen(false)}
          isAdmin={currentUser.role === 'admin' || currentUser.role === 'pdg'}
        />
      )}

      {isApprovalConfigModalOpen && (
        <ApprovalConfigModal
          config={approvalConfig}
          onSaveConfig={(newCfg) => {
            setApprovalConfig(newCfg);
            addAuditLog('Mise à jour de la configuration des seuils de validation PDG', 'Administration');
          }}
          onClose={() => setIsApprovalConfigModalOpen(false)}
        />
      )}
    </div>
  );
}
