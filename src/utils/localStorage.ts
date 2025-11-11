import type { SquadPlan } from '../types';

const STORAGE_KEY = 'fm-squad-planner-v1';

export function savePlan(plan: SquadPlan): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
  } catch (error) {
    console.error('Failed to save plan to localStorage:', error);
  }
}

export function loadPlan(): SquadPlan | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as SquadPlan;
  } catch (error) {
    console.error('Failed to load plan from localStorage:', error);
    return null;
  }
}

export function clearPlan(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear plan from localStorage:', error);
  }
}

