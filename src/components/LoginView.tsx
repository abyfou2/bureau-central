import React, { useState } from 'react';
import { User } from '../types';
import { Shield, Lock, Mail, LogIn, Building2 } from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: (user: User) => void;
  users: User[];
  onAddUser: (user: User) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess, users, onAddUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      try {
        let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (!user) {
          const isSuperAdmin = email.toLowerCase() === 'nasmacharity@gmail.com';
          const isAdmin = isSuperAdmin || email.includes('admin') || email.includes('pdg');
          user = {
            id: `usr-${Date.now()}`,
            name: isSuperAdmin ? 'ABYFOU' : email.split('@')[0],
            email,
            role: isSuperAdmin ? 'admin' : (email.includes('pdg') ? 'pdg' : 'bureau_manager'),
            department: isAdmin ? 'Global' : 'Bureau',
            title: isSuperAdmin ? 'Super Administrateur & RH' : 'Gestionnaire / Collaborateur',
            avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
          };
          onAddUser(user);
        }

        onLoginSuccess(user);
      } catch (err: any) {
        console.error(err);
        setError('Erreur de connexion. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-amber-500/20 p-8 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-700 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-amber-600/30 text-white">
            <Building2 className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-slate-900">BureauCentral</h1>
          <p className="text-xs text-slate-600 font-medium">Plateforme Intégrée de Gestion Multidomaines</p>
        </div>

        {error && (
          <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs font-medium text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Adresse Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre.email@bureaucentral.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold rounded-xl text-sm shadow-md hover:from-amber-700 hover:to-amber-800 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
            ) : (
              <>
                <LogIn className="w-4 h-4" /> Se connecter
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};
