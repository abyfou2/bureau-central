export type UserRole = 
  | 'admin' 
  | 'pdg' 
  | 'bureau_manager' 
  | 'bureau_agent'
  | 'restaurant_manager' 
  | 'restaurant_agent'
  | 'services_manager' 
  | 'services_agent'
  | 'fondation_manager'
  | 'fondation_agent';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  department?: 'Bureau' | 'Restaurant' | 'Services diverses' | 'Fondation Ilyassa' | 'Global';
  avatar: string;
  email: string;
  title: string;
  password?: string;
}

export interface GoldTransaction {
  id: string;
  type: 'achat' | 'vente';
  weightKg: number;
  purity: string; // ex: '24K', '22K'
  pricePerGram: number; // en USD ou XOF
  totalAmount: number;
  clientOrSupplier: string;
  date: string;
  status: 'Validé' | 'En attente' | 'Clôturé';
}

export interface RestaurantTransaction {
  id: string;
  type: 'recette' | 'depense';
  category: 'Vente Boissons/Jus' | 'Salaires' | 'Fonctionnement' | 'Stock Cuisine' | 'Autre Recette';
  description: string;
  amount: number;
  date: string;
}

export interface DiverseServiceRequest {
  id: string;
  clientName: string;
  serviceType: 'Logistique & Transport' | 'Consulting & Audit' | 'Immobilier' | 'Maintenance';
  description: string;
  amount: number;
  status: 'En attente' | 'En cours' | 'Traité' | 'Facturé';
  date: string;
}

export interface FoundationProject {
  id: string;
  title: string;
  description: string;
  budget: number;
  disbursed: number;
  beneficiaries: number;
  status: 'En cours' | 'Terminé' | 'Planifié';
  category: 'Éducation' | 'Santé' | 'Eau potable' | 'Social';
}

export interface FoundationDonation {
  id: string;
  donorName: string;
  amount: number;
  projectId: string;
  date: string;
  note: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userName: string;
  role: string;
  action: string;
  department: string;
}
