export enum Frequency {
  DAILY = 'Daily',
  WEEKLY = 'Weekly',
  BIWEEKLY = 'Bi-Weekly',
  MONTHLY = 'Monthly'
}

export interface Goal {
  id: string;
  title: string;
  category: string;
  targetAmount: number;
  currentAmount: number;
  startDate: string;
  deadline: string;
  frequency: Frequency;
  installmentAmount: number;
  imageUrl: string;
  status: 'active' | 'completed';
  aiMotivation?: string;
}

export interface Transaction {
  id: string;
  goalId: string;
  amount: number;
  date: string;
  type: 'deposit' | 'bonus' | 'withdrawal';
  description: string;
}

export interface UserState {
  name: string;
  email: string;
  balance: number; 
  points: number;
  kycStatus: 'verified' | 'pending' | 'unverified';
  joinDate: string;
  phone?: string;
  address?: string;
  notifications?: {
    paymentReminders: boolean;
    goalMilestones: boolean;
  };
}

export type ViewState = 'DASHBOARD' | 'CREATE_GOAL' | 'GOAL_DETAILS' | 'PROFILE';