import React, { useState, useEffect } from 'react';
import { 
  INITIAL_USERS, 
  INITIAL_GOLD_TRANSACTIONS, 
  INITIAL_RESTAURANT_TRANSACTIONS, 
  INITIAL_SERVICES_REQUESTS, 
  INITIAL_FOUNDATION_PROJECTS, 
  INITIAL_FOUNDATION_DONATIONS, 
  INITIAL_AUDIT_LOGS 
} from './mockData';
import { User, GoldTransaction, RestaurantTransaction, DiverseServiceRequest, FoundationProject, AuditLog } from './types';
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
import { LoginView } from './components/LoginView';
import { Lock } from 'lucide-react';
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
    const savedVersion = localStorage.getItem('bureau_app_version');
    if (savedVersion !== '2.10') {
      localStorage.setItem('bureau_app_version', '2.10');
      localStorage.removeItem('bureau_users');
      localStorage.removeItem('bureau_gold_transactions');
      localStorage.removeItem('bureau_restaurant_transactions');
      localStorage.removeItem('bureau_diverse_services');
      localStorage.removeItem('bureau_foundation_projects');
      return INITIAL_USERS;
    }
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
  const [restaurantTransactions, setRestaurantTransactions] = useState<RestaurantTransaction[]>(() => {
    const saved = localStorage.getItem('bureau_restaurant_transactions');
    return saved ? JSON.parse(saved) : INITIAL_RESTAURANT_TRANSACTIONS;
  });
  const [diverseServices, setDiverseServices] = useState<DiverseServiceRequest[]>(() => {
    const saved = localStorage.getItem('bureau_diverse_services');
    return saved ? JSON.parse(saved) : INITIAL_SERVICES_REQUESTS;
  });
  const [foundationProjects, setFoundationProjects] = useState<FoundationProject[]>(() => {
    const saved = localStorage.getItem('bureau_foundation_projects');
    return saved ? JSON.parse(saved) : INITIAL_FOUNDATION_PROJECTS;
  });
  const [foundationDonations] = useState(INITIAL_FOUNDATION_DONATIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('bureau_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  useEffect(() => {
    localStorage.setItem('bureau_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('bureau_gold_transactions', JSON.stringify(goldTransactions));
  }, [goldTransactions]);

  useEffect(() => {
    localStorage.setItem('bureau_restaurant_transactions', JSON.stringify(restaurantTransactions));
  }, [restaurantTransactions]);

  useEffect(() => {
    localStorage.setItem('bureau_diverse_services', JSON.stringify(diverseServices));
  }, [diverseServices]);

  useEffect(() => {
    localStorage.setItem('bureau_foundation_projects', JSON.stringify(foundationProjects));
  }, [foundationProjects]);

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
  };

  const handleUpdateGoldTransaction = (updated: GoldTransaction) => {
    setGoldTransactions(prev => prev.map(t => t.id === updated.id ? updated : t));
    addAuditLog(`Modification transaction ${updated.id}`, 'Bureau');
  };

  const handleDeleteGoldTransaction = (id: string) => {
    setGoldTransactions(prev => prev.filter(t => t.id !== id));
    addAuditLog(`Suppression transaction ${id}`, 'Bureau');
  };

  const handleAddRestaurantTransaction = (t: Omit<RestaurantTransaction, 'id'>) => {
    const newTx: RestaurantTransaction = { ...t, id: `rt-${Date.now()}` };
    setRestaurantTransactions([newTx, ...restaurantTransactions]);
    addAuditLog(`Restaurant: Ajout ${t.type} (${t.category} - ${t.amount.toLocaleString()} FCFA)`, 'Restaurant');
  };

  const handleAddServiceRequest = (req: Omit<DiverseServiceRequest, 'id'>) => {
    const newReq: DiverseServiceRequest = { ...req, id: `dsr-${Date.now()}` };
    setDiverseServices([newReq, ...diverseServices]);
    addAuditLog(`Nouveau dossier service divers: ${req.clientName}`, 'Services diverses');
  };

  const handleAddFoundationProject = (p: Omit<FoundationProject, 'id'>) => {
    const newProj: FoundationProject = { ...p, id: `fp-${Date.now()}` };
    setFoundationProjects([newProj, ...foundationProjects]);
    addAuditLog(`Lancement projet humanitaire: ${p.title}`, 'Fondation Ilyassa');
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
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        activeDepartmentLabel={getActiveDepartmentLabel()}
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
                    restaurantTransactions={restaurantTransactions}
                    diverseServices={diverseServices}
                    foundationProjects={foundationProjects}
                    auditLogs={auditLogs}
                    onNavigateTab={setActiveTab}
                    onOpenAiModal={() => setIsAiModalOpen(true)}
                    isAdmin={currentUser.role === 'admin'}
                  />
                )}

                {activeTab === 'bureau_or' && (
                  <BureauGoldView
                    transactions={goldTransactions}
                    onAddTransaction={handleAddGoldTransaction}
                    onUpdateTransaction={handleUpdateGoldTransaction}
                    onDeleteTransaction={handleDeleteGoldTransaction}
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
                    onAddRequest={handleAddServiceRequest}
                  />
                )}

                {activeTab === 'fondation_ilyassa' && (
                  <FondationIlyassaView
                    projects={foundationProjects}
                    donations={foundationDonations}
                    onAddProject={handleAddFoundationProject}
                  />
                )}

                {activeTab === 'rbac_management' && (
                  <div className="space-y-6">
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
    </div>
  );
}
