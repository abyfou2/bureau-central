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
  }
];

export const INITIAL_GOLD_TRANSACTIONS: GoldTransaction[] = [];

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
