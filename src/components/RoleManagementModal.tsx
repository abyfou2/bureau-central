import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { ShieldCheck, X, UserCheck, Lock, CheckCircle2, UserPlus, Pencil, Trash2, KeyRound } from 'lucide-react';

interface RoleManagementModalProps {
  users: User[];
  currentUser: User;
  onSwitchUser: (user: User) => void;
  onAddUser: (user: User) => void;
  onUpdateUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
  onClose: () => void;
}

export const RoleManagementModal: React.FC<RoleManagementModalProps> = ({
  users,
  currentUser,
  onSwitchUser,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  onClose
}) => {
  const isAdmin = currentUser.role === 'admin';
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [role, setRole] = useState<UserRole>('bureau_manager');
  const [department, setDepartment] = useState<'Bureau' | 'Restaurant' | 'Services diverses' | 'Fondation Ilyassa' | 'Global'>('Bureau');
  const [password, setPassword] = useState('1234');

  // Password Prompt Modal for account switching
  const [targetSwitchUser, setTargetSwitchUser] = useState<User | null>(null);
  const [switchPasswordInput, setSwitchPasswordInput] = useState('');
  const [switchError, setSwitchError] = useState('');

  const handleOpenEdit = (user: User) => {
    setEditingUserId(user.id);
    setName(user.name);
    setEmail(user.email);
    setTitle(user.title);
    setRole(user.role);
    setDepartment(user.department || 'Global');
    setPassword(user.password || '1234');
    setShowAddForm(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    if (editingUserId) {
      onUpdateUser({
        id: editingUserId,
        name,
        email,
        role,
        department,
        title: title || 'Collaborateur',
        password,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'
      });
      setEditingUserId(null);
    } else {
      const newUser: User = {
        id: `usr-${Date.now()}`,
        name,
        email,
        role,
        department,
        title: title || 'Collaborateur',
        password,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'
      };
      onAddUser(newUser);
    }

    setName('');
    setEmail('');
    setTitle('');
    setPassword('1234');
    setShowAddForm(false);
  };

  const handleAttemptSwitch = (user: User) => {
    if (user.id === currentUser.id) return;
    setTargetSwitchUser(user);
    setSwitchPasswordInput('');
    setSwitchError('');
  };

  const handleConfirmSwitch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetSwitchUser) return;

    if (switchPasswordInput === (targetSwitchUser.password || '1234')) {
      onSwitchUser(targetSwitchUser);
      setTargetSwitchUser(null);
      onClose();
    } else {
      setSwitchError('Mot de passe incorrect.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-serif">Gestion des Rôles & Utilisateurs (RBAC)</h3>
              <p className="text-xs text-slate-500">
                {isAdmin ? "Super Admin : Modification, Rôles, Suppression et Sécurité" : "Liste des utilisateurs autorisés"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Header (Admin only) */}
        {isAdmin && (
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-700">Comptes enregistrés ({users.length})</span>
            <button
              onClick={() => {
                setEditingUserId(null);
                setName('');
                setEmail('');
                setTitle('');
                setPassword('1234');
                setShowAddForm(!showAddForm);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 text-white rounded-xl text-xs font-medium hover:bg-amber-700 transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" /> {showAddForm ? "Annuler" : "Créer un utilisateur"}
            </button>
          </div>
        )}

        {/* Add / Edit User Form */}
        {showAddForm && isAdmin && (
          <form onSubmit={handleSaveUser} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-900">{editingUserId ? "Modifier l'utilisateur" : "Nouveau Compte Utilisateur"}</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Nom complet</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Fatou Ndiaye"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="fatou@bureaucentral.com"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Rôle</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full px-2 py-2 rounded-lg border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="admin">Super Admin</option>
                  <option value="pdg">PDG / Promoteur</option>
                  <option value="bureau_manager">Resp. Bureau d'Or</option>
                  <option value="bureau_agent">Agent Saisie Bureau</option>
                  <option value="restaurant_manager">Resp. Restaurant</option>
                  <option value="restaurant_agent">Agent Saisie Restaurant</option>
                  <option value="services_manager">Resp. Services Divers</option>
                  <option value="fondation_manager">Resp. Fondation</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Département</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value as any)}
                  className="w-full px-2 py-2 rounded-lg border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="Bureau">Bureau</option>
                  <option value="Restaurant">Restaurant</option>
                  <option value="Services diverses">Services Divers</option>
                  <option value="Fondation Ilyassa">Fondation</option>
                  <option value="Global">Global</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Mot de passe (Sécurité)</label>
                <input
                  type="text"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="1234"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-mono outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Poste exact</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Directeur Général"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-slate-900 text-white font-semibold rounded-lg text-xs hover:bg-slate-800 transition-colors"
            >
              {editingId ? "Mettre à jour l'utilisateur" : "Enregistrer l'utilisateur"}
            </button>
          </form>
        )}

        {/* Users list */}
        <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
          {users.map((user) => {
            const isSelected = user.id === currentUser.id;

            return (
              <div
                key={user.id}
                className={`p-4 rounded-xl border transition-all flex items-center justify-between ${
                  isSelected 
                    ? 'border-amber-500 bg-amber-50/60 shadow-xs' 
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-4 flex-1 cursor-pointer" onClick={() => handleAttemptSwitch(user)}>
                  <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-xl object-cover border border-slate-300" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">{user.name}</h4>
                      {isSelected && (
                        <span className="text-[10px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Actif
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 font-medium">{user.title}</p>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">{user.email} • Rôle : <span className="font-bold uppercase text-slate-600">{user.role}</span></p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                    {user.department || 'Global'}
                  </span>

                  {isAdmin && (
                    <div className="flex items-center gap-1.5 border-l border-slate-200 pl-3">
                      <button
                        onClick={() => handleOpenEdit(user)}
                        className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                        title="Modifier le rôle ou les accès"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      {users.length > 1 && user.id !== currentUser.id && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Supprimer l'utilisateur ${user.name} ?`)) {
                              onDeleteUser(user.id);
                            }
                          }}
                          className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors"
                          title="Supprimer l'utilisateur"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}

                  {!isSelected && (
                    <button
                      onClick={() => handleAttemptSwitch(user)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                    >
                      <Lock className="w-3 h-3" /> Basculer
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Password Prompt Modal for Switching */}
        {targetSwitchUser && (
          <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Authentification Requise</h4>
                  <p className="text-[11px] text-slate-500">Entrez le mot de passe de {targetSwitchUser.name}</p>
                </div>
              </div>

              <form onSubmit={handleConfirmSwitch} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Mot de passe du compte</label>
                  <input
                    type="password"
                    autoFocus
                    required
                    value={switchPasswordInput}
                    onChange={(e) => setSwitchPasswordInput(e.target.value)}
                    placeholder="••••"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-mono outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  {switchError && <p className="text-xs text-rose-600 mt-1 font-semibold">{switchError}</p>}
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setTargetSwitchUser(null)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs hover:bg-slate-200"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 text-white font-semibold rounded-xl text-xs hover:bg-slate-800 shadow-md"
                  >
                    Confirmer & Basculer
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <span>Sécurité : Le basculement de compte nécessite le mot de passe attribué.</span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
