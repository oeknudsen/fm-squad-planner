import { create } from 'zustand';
import type { SquadPlan, Player } from '../types';
import { FORMATIONS, getPositionsForFormation } from '../data/formations';
import { savePlan, loadPlan, clearPlan } from '../utils/localStorage';

interface SquadStore {
  plan: SquadPlan;
  setFormation: (formation: string) => void;
  setPositionRole: (position: string, role: string) => void;
  upsertPlayer: (
    position: string,
    tier: 'first' | 'second' | 'youth',
    player: Player
  ) => void;
  removePlayer: (
    position: string,
    tier: 'first' | 'second' | 'youth'
  ) => void;
  swapPlayers: (
    fromPosition: string,
    fromTier: 'first' | 'second' | 'youth',
    toPosition: string,
    toTier: 'first' | 'second' | 'youth'
  ) => void;
  reset: () => void;
  import: (json: string) => void;
  export: () => string;
}

function createInitialPlan(): SquadPlan {
  const formation = FORMATIONS[0];
  const positions = getPositionsForFormation(formation);
  const depthChart: Record<string, any> = {};
  positions.forEach(pos => {
    depthChart[pos] = {};
  });
  
  return {
    formation,
    depthChart,
    updatedAt: new Date().toISOString(),
  };
}

function initializePlan(): SquadPlan {
  const saved = loadPlan();
  if (saved) {
    // Ensure all positions from current formation exist in depthChart
    const positions = getPositionsForFormation(saved.formation);
    const depthChart = { ...saved.depthChart };
    positions.forEach(pos => {
      if (!depthChart[pos]) {
        depthChart[pos] = {};
      }
    });
    return { ...saved, depthChart };
  }
  return createInitialPlan();
}

export const useSquadStore = create<SquadStore>((set, get) => {
  const initialPlan = initializePlan();

  // Auto-save subscriber
  const store = {
    plan: initialPlan,
    setFormation: (formation: string) => {
      set((state) => {
        const positions = getPositionsForFormation(formation);
        const depthChart: Record<string, any> = {};
        
        // Preserve existing players for positions that exist in new formation
        positions.forEach(pos => {
          depthChart[pos] = state.plan.depthChart[pos] || {};
        });

        const newPlan: SquadPlan = {
          ...state.plan,
          formation,
          depthChart,
          updatedAt: new Date().toISOString(),
        };
        
        savePlan(newPlan);
        return { plan: newPlan };
      });
    },
    setPositionRole: (position: string, role: string) => {
      set((state) => {
        const depthChart = { ...state.plan.depthChart };
        if (!depthChart[position]) {
          depthChart[position] = {};
        }
        depthChart[position] = {
          ...depthChart[position],
          role,
        };

        const newPlan: SquadPlan = {
          ...state.plan,
          depthChart,
          updatedAt: new Date().toISOString(),
        };
        
        savePlan(newPlan);
        return { plan: newPlan };
      });
    },
    upsertPlayer: (position: string, tier: 'first' | 'second' | 'youth', player: Player) => {
      set((state) => {
        const depthChart = { ...state.plan.depthChart };
        if (!depthChart[position]) {
          depthChart[position] = {};
        }
        depthChart[position] = {
          ...depthChart[position],
          [tier]: player,
        };

        const newPlan: SquadPlan = {
          ...state.plan,
          depthChart,
          updatedAt: new Date().toISOString(),
        };
        
        savePlan(newPlan);
        return { plan: newPlan };
      });
    },
    removePlayer: (position: string, tier: 'first' | 'second' | 'youth') => {
      set((state) => {
        const depthChart = { ...state.plan.depthChart };
        if (depthChart[position]) {
          const slot = { ...depthChart[position] };
          delete slot[tier];
          depthChart[position] = slot;
        }

        const newPlan: SquadPlan = {
          ...state.plan,
          depthChart,
          updatedAt: new Date().toISOString(),
        };
        
        savePlan(newPlan);
        return { plan: newPlan };
      });
    },
    swapPlayers: (
      fromPosition: string,
      fromTier: 'first' | 'second' | 'youth',
      toPosition: string,
      toTier: 'first' | 'second' | 'youth'
    ) => {
      set((state) => {
        const depthChart = { ...state.plan.depthChart };
        
        // Ensure positions exist
        if (!depthChart[fromPosition]) depthChart[fromPosition] = {};
        if (!depthChart[toPosition]) depthChart[toPosition] = {};
        
        const fromPlayer = depthChart[fromPosition][fromTier];
        const toPlayer = depthChart[toPosition][toTier];
        
        // Swap the players
        if (fromPlayer) {
          depthChart[toPosition] = {
            ...depthChart[toPosition],
            [toTier]: fromPlayer,
          };
        } else {
          // If source is empty, just delete the target
          const toSlot = { ...depthChart[toPosition] };
          delete toSlot[toTier];
          depthChart[toPosition] = toSlot;
        }
        
        if (toPlayer) {
          depthChart[fromPosition] = {
            ...depthChart[fromPosition],
            [fromTier]: toPlayer,
          };
        } else {
          // If target is empty, just delete the source
          const fromSlot = { ...depthChart[fromPosition] };
          delete fromSlot[fromTier];
          depthChart[fromPosition] = fromSlot;
        }

        const newPlan: SquadPlan = {
          ...state.plan,
          depthChart,
          updatedAt: new Date().toISOString(),
        };
        
        savePlan(newPlan);
        return { plan: newPlan };
      });
    },
    reset: () => {
      clearPlan();
      const newPlan = createInitialPlan();
      savePlan(newPlan);
      set({ plan: newPlan });
    },
    import: (json: string) => {
      try {
        const imported = JSON.parse(json) as SquadPlan;
        // Validate structure
        if (imported.formation && imported.depthChart) {
          // Ensure all positions from formation exist in depthChart
          const positions = getPositionsForFormation(imported.formation);
          const depthChart = { ...imported.depthChart };
          positions.forEach(pos => {
            if (!depthChart[pos]) {
              depthChart[pos] = {};
            }
          });
          
          const newPlan: SquadPlan = {
            ...imported,
            formation: imported.formation,
            depthChart,
            updatedAt: new Date().toISOString(),
          };
          savePlan(newPlan);
          set({ plan: newPlan });
        } else {
          throw new Error('Invalid plan structure');
        }
      } catch (error) {
        console.error('Failed to import plan:', error);
        throw error;
      }
    },
    export: () => {
      return JSON.stringify(get().plan, null, 2);
    },
  };

  return store;
});

