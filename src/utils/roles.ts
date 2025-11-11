import rolesData from '../data/roles.fm26.json';

export type Role = {
  id: string;
  name: string;
  positions: string[];
};

type RolesData = {
  roles: Array<Record<string, string[]>>;
};

// Map position codes to position names
const POSITION_CODE_TO_NAME: Record<string, string[]> = {
  GK: ['Goalkeeper'],
  RCB: ['Centre-Back', 'Wide CB'],
  CB: ['Centre-Back'],
  LCB: ['Centre-Back', 'Wide CB'],
  RB: ['Full-Back'],
  LB: ['Full-Back'],
  RWB: ['Wing-Back'],
  LWB: ['Wing-Back'],
  DM: ['Defensive Midfield'],
  DMR: ['Defensive Midfield', 'Wide Midfield'],
  DML: ['Defensive Midfield', 'Wide Midfield'],
  CM: ['Central Midfield'],
  RCM: ['Central Midfield', 'Wide Midfield'],
  LCM: ['Central Midfield', 'Wide Midfield'],
  RM: ['Wide Midfield'],
  LM: ['Wide Midfield'],
  AMC: ['Attacking Midfield'],
  AMR: ['Attacking Midfield', 'Winger'],
  AML: ['Attacking Midfield', 'Winger'],
  RW: ['Winger'],
  LW: ['Winger'],
  ST: ['Striker'],
  RST: ['Striker'],
  LST: ['Striker'],
};

function loadRolesData(): Role[] {
  const data = rolesData as RolesData;
  const roles: Role[] = [];
  
  // Transform the nested structure into flat Role objects
  data.roles.forEach((positionGroup) => {
    Object.entries(positionGroup).forEach(([positionName, roleNames]) => {
      roleNames.forEach((roleName) => {
        // Create a unique ID from role name
        const roleId = roleName.toLowerCase().replace(/\s+/g, '-');
        
        // Find existing role or create new one
        let role = roles.find(r => r.id === roleId);
        if (!role) {
          role = {
            id: roleId,
            name: roleName,
            positions: [],
          };
          roles.push(role);
        }
        
        // Add position to role's positions array if not already present
        if (!role.positions.includes(positionName)) {
          role.positions.push(positionName);
        }
      });
    });
  });
  
  return roles;
}

export function loadRoles(): Role[] {
  return loadRolesData();
}

export function getRolesForPosition(positionCode: string): Role[] {
  const allRoles = loadRoles();
  const positionNames = POSITION_CODE_TO_NAME[positionCode] || [];
  
  if (positionNames.length === 0) {
    return [];
  }
  
  // Filter roles that match any of the position names for this code
  return allRoles.filter(role => 
    role.positions.some(pos => positionNames.includes(pos))
  );
}

