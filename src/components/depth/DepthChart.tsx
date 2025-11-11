import { ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useSquadStore } from '../../store/squadStore';
import { getPositionsForFormation } from '../../data/formations';
import { getRolesForPosition } from '../../utils/roles';
import { DepthSlot } from './DepthSlot';
import { Card } from '../ui/Card';
import { Select } from '../ui/Select';
import { Tooltip } from '../ui/Tooltip';

interface DepthChartProps {
  onPositionClick: (position: string, tier: 'first' | 'second' | 'youth') => void;
}

export function DepthChart({ onPositionClick }: DepthChartProps) {
  const formation = useSquadStore((state) => state.plan.formation);
  const depthChart = useSquadStore((state) => state.plan.depthChart);
  const removePlayer = useSquadStore((state) => state.removePlayer);
  const swapPlayers = useSquadStore((state) => state.swapPlayers);
  const setPositionRole = useSquadStore((state) => state.setPositionRole);
  const positions = getPositionsForFormation(formation);
  const [expandedPositions, setExpandedPositions] = useState<Set<string>>(
    new Set(positions)
  );

  const handleDrop = (toPosition: string, toTier: 'first' | 'second' | 'youth') => {
    return (fromPosition: string, fromTier: 'first' | 'second' | 'youth') => {
      swapPlayers(fromPosition, fromTier, toPosition, toTier);
    };
  };

  const togglePosition = (position: string) => {
    setExpandedPositions((prev) => {
      const next = new Set(prev);
      if (next.has(position)) {
        next.delete(position);
      } else {
        next.add(position);
      }
      return next;
    });
  };

  // Calculate total players, average age, and positions with issues
  const { totalPlayers, averageAge, positionsWithIssues } = useMemo(() => {
    let total = 0;
    let totalAge = 0;
    const issues: string[] = [];

    positions.forEach((position) => {
      const slot = depthChart[position] || {};
      const players = [slot.first, slot.second, slot.youth].filter(Boolean);
      const playerCount = players.length;
      total += playerCount;
      
      // Sum ages for average calculation
      players.forEach(player => {
        if (player) {
          totalAge += player.age;
        }
      });
      
      if (playerCount < 2) {
        issues.push(position);
      }
    });

    const avgAge = total > 0 ? totalAge / total : 0;

    return { 
      totalPlayers: total, 
      averageAge: avgAge,
      positionsWithIssues: issues 
    };
  }, [positions, depthChart]);

  return (
    <Card className="mt-6">
      <div className="mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Depth Chart</h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            {positionsWithIssues.length > 0 && (
              <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                <Tooltip
                  content={
                    <div className="space-y-1">
                      <div className="font-semibold mb-1.5">Positions needing more players:</div>
                      <div className="space-y-0.5">
                        {positionsWithIssues.map((pos) => {
                          const slot = depthChart[pos] || {};
                          const playerCount = [slot.first, slot.second, slot.youth].filter(Boolean).length;
                          return (
                            <div key={pos} className="text-xs">
                              • {pos} ({playerCount} player{playerCount !== 1 ? 's' : ''})
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  }
                  position="bottom"
                >
                  <AlertCircle size={16} className="cursor-help" />
                </Tooltip>
                <span className="text-sm font-medium">
                  {positionsWithIssues.length} position{positionsWithIssues.length !== 1 ? 's' : ''} need{positionsWithIssues.length === 1 ? 's' : ''} more players
                </span>
              </div>
            )}
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-semibold text-gray-900 dark:text-white">{totalPlayers}</span> total players
              </div>
              {totalPlayers > 0 && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Avg age: <span className="font-semibold text-gray-900 dark:text-white">{averageAge.toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        {positions.map((position) => {
          const slot = depthChart[position] || {};
          const isExpanded = expandedPositions.has(position);
          const playerCount = [slot.first, slot.second, slot.youth].filter(Boolean).length;
          const hasIssue = playerCount < 2;

          return (
            <div 
              key={position} 
              className={`border rounded-lg overflow-hidden ${
                hasIssue 
                  ? 'border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-900/10' 
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <button
                onClick={() => togglePosition(position)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 dark:text-white">{position}</span>
                  {hasIssue && (
                    <AlertCircle 
                      size={16} 
                      className="text-amber-600 dark:text-amber-400" 
                      title={`Only ${playerCount} player${playerCount !== 1 ? 's' : ''} - needs at least 2`}
                    />
                  )}
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    ({playerCount} player{playerCount !== 1 ? 's' : ''})
                  </span>
                </div>
                {isExpanded ? (
                  <ChevronUp size={20} className="text-gray-500 dark:text-gray-400" />
                ) : (
                  <ChevronDown size={20} className="text-gray-500 dark:text-gray-400" />
                )}
              </button>
              {isExpanded && (
                <div className="p-4 bg-white dark:bg-gray-800 space-y-4">
                  <div>
                    <Select
                      label="Role"
                      value={slot.role || ''}
                      onChange={(e) => setPositionRole(position, e.target.value)}
                    >
                      <option value="">No role selected</option>
                      {getRolesForPosition(position).map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <DepthSlot
                      player={slot.first}
                      tier="first"
                      position={position}
                      onEdit={() => onPositionClick(position, 'first')}
                      onRemove={() => removePlayer(position, 'first')}
                      onDrop={handleDrop(position, 'first')}
                    />
                    <DepthSlot
                      player={slot.second}
                      tier="second"
                      position={position}
                      onEdit={() => onPositionClick(position, 'second')}
                      onRemove={() => removePlayer(position, 'second')}
                      onDrop={handleDrop(position, 'second')}
                    />
                    <DepthSlot
                      player={slot.youth}
                      tier="youth"
                      position={position}
                      onEdit={() => onPositionClick(position, 'youth')}
                      onRemove={() => removePlayer(position, 'youth')}
                      onDrop={handleDrop(position, 'youth')}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

