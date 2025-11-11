export type Ability = 0 | 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 4.5 | 5;

export type LoanStatus = 'owned' | 'on-loan' | 'loaned-out';

export type Player = {
  id: string;
  name: string;
  nationality: string;
  age: number;
  position: string;
  currentAbility: Ability;
  potentialAbility: Ability;
  loanStatus?: LoanStatus;
};

export type DepthSlot = {
  role?: string;
  first?: Player;
  second?: Player;
  youth?: Player;
};

export type SquadPlan = {
  formation: string;
  depthChart: Record<string, DepthSlot>;
  updatedAt: string;
};

