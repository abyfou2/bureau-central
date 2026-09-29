import { User, GoldTransaction, RestaurantTransaction, DiverseServiceRequest, FoundationProject, FoundationDonation, AuditLog } from './types';

export const INITIAL_USERS: User[] = [
  {
    id: 'u1',
    name: 'ABYFOU',
    role: 'admin',
    department: 'Global',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    email: 'admin@bureaucentral.com',
    title: 'Super Administrateur & Sécurité',
    password: '1234'
  },
  {
    id: 'u2',
    name: 'Promoteur / Propriétaire',
    role: 'pdg',
    department: 'Global',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    email: 'pdg@bureaucentral.com',
    title: 'Président Directeur Général (PDG)',
    password: '1234'
  },
  {
    id: 'u3',
    name: 'Gestionnaire Bureau d\'Or',
    role: 'bureau_manager',
    department: 'Bureau',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    email: 'bureau.mgr@bureaucentral.com',
    title: 'Gestionnaire Bureau d\'Or',
    password: '1234'
  },
  {
    id: 'u4',
    name: 'Agent Saisie Bureau Or',
    role: 'bureau_agent',
    department: 'Bureau',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    email: 'bureau.agent@bureaucentral.com',
    title: 'Agent de Saisie - Bureau d\'Or',
    password: '1234'
  }
];

export const INITIAL_GOLD_TRANSACTIONS: GoldTransaction[] = [
  {
    id: 'gt-1',
    type: 'achat',
    weightKg: 0.21591,
    purity: '22.03K',
    pricePerGram: 63000,
    totalAmount: 13600531,
    clientOrSupplier: 'Moussa',
    date: '2026-09-29',
    status: 'Validé'
  }
];

export const INITIAL_RESTAURANT_TRANSACTIONS: RestaurantTransaction[] = [];

export const INITIAL_SERVICES_REQUESTS: DiverseServiceRequest[] = [];

export const INITIAL_FOUNDATION_PROJECTS: FoundationProject[] = [];

export const INITIAL_FOUNDATION_DONATIONS: FoundationDonation[] = [];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'al-1',
    timestamp: '2026-09-29 15:30',
    userName: 'ABYFOU',
    role: 'Super Administrateur & Sécurité',
    action: 'Initialisation des comptes sécurisés et rôles RBAC',
    department: 'Global'
  }
];
