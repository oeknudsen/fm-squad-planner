export const FORMATION_POSITIONS: Record<string, string[]> = {
  "4-2-3-1": ["GK", "RB", "RCB", "LCB", "LB", "DMR", "DML", "AMR", "AMC", "AML", "ST"],
  "4-3-3": ["GK", "RB", "RCB", "LCB", "LB", "DM", "RCM", "LCM", "AMR", "AMC", "ST"],
  "4-4-2": ["GK", "RB", "RCB", "LCB", "LB", "RM", "RCM", "LCM", "LM", "RST", "LST"],
  "3-4-3": ["GK", "RCB", "CB", "LCB", "RWB", "RCM", "LCM", "LWB", "AMR", "AML", "ST"],
  "3-5-2": ["GK", "RCB", "CB", "LCB", "RWB", "RCM", "CM", "LCM", "LWB", "RST", "LST"],
  "5-2-3": ["GK", "RB", "RCB", "CB", "LCB", "LB", "RCM", "LCM", "RW", "ST", "LW"],
  "4-1-4-1": ["GK", "RB", "RCB", "LCB", "LB", "DM", "RM", "RCM", "LCM", "LM", "ST"],
};

export const FORMATIONS = Object.keys(FORMATION_POSITIONS);

export function getPositionsForFormation(formation: string): string[] {
  return FORMATION_POSITIONS[formation] || [];
}

