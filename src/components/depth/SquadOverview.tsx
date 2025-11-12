import { AlertCircle } from 'lucide-react';
import { useMemo } from 'react';
import { useSquadStore } from '../../store/squadStore';
import { getPositionsForFormation } from '../../data/formations';
import { loadRoles } from '../../utils/roles';
import { Card } from '../ui/Card';
import { StarRating } from '../ui/StarRating';

export function SquadOverview() {
  const formation = useSquadStore((state) => state.plan.formation);
  const depthChart = useSquadStore((state) => state.plan.depthChart);
  const positions = getPositionsForFormation(formation);

  const positionData = useMemo(() => {
    const allRoles = loadRoles();
    
    return positions.map((position) => {
      const slot = depthChart[position] || {};
      const players = [slot.first, slot.second, slot.youth].filter(Boolean);
      const playerCount = players.length;
      const hasIssue = playerCount < 2;
      
      // Get role name from role ID
      let roleName = null;
      if (slot.role) {
        const role = allRoles.find(r => r.id === slot.role);
        roleName = role?.name || slot.role;
      }
      
      return {
        position,
        playerCount,
        hasIssue,
        role: roleName,
        first: slot.first,
        second: slot.second,
        youth: slot.youth,
      };
    });
  }, [positions, depthChart]);

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Squad Overview
        </h2>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {formation}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {positionData.map(({ position, playerCount, hasIssue, role, first, second, youth }) => (
          <div
            key={position}
            className={`
              p-3 rounded-lg border transition-colors
              ${
                hasIssue
                  ? 'border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-900/10'
                  : 'border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50'
              }
            `}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {position}
                </span>
                {hasIssue && (
                  <AlertCircle
                    size={14}
                    className="text-amber-600 dark:text-amber-400 flex-shrink-0"
                  />
                )}
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {playerCount}/3
              </span>
            </div>
            
            {role && (
              <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                {role}
              </div>
            )}

            <div className="space-y-2">
              {/* 1st Choice */}
              <div className="text-xs">
                <div className="text-gray-500 dark:text-gray-400 mb-1">1st Choice:</div>
                {first ? (
                  <div className="pl-2 space-y-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {first.name}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Age {first.age}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">CA:</span>
                        <StarRating value={first.currentAbility} />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">PA:</span>
                        <StarRating value={first.potentialAbility} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="pl-2 text-xs text-gray-400 dark:text-gray-500 italic">
                    Empty
                  </div>
                )}
              </div>

              {/* 2nd Choice */}
              <div className="text-xs">
                <div className="text-gray-500 dark:text-gray-400 mb-1">2nd Choice:</div>
                {second ? (
                  <div className="pl-2 space-y-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {second.name}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Age {second.age}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">CA:</span>
                        <StarRating value={second.currentAbility} />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">PA:</span>
                        <StarRating value={second.potentialAbility} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="pl-2 text-xs text-gray-400 dark:text-gray-500 italic">
                    Empty
                  </div>
                )}
              </div>

              {/* Youth Prospect */}
              <div className="text-xs">
                <div className="text-gray-500 dark:text-gray-400 mb-1">Youth:</div>
                {youth ? (
                  <div className="pl-2 space-y-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {youth.name}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Age {youth.age}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">CA:</span>
                        <StarRating value={youth.currentAbility} />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">PA:</span>
                        <StarRating value={youth.potentialAbility} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="pl-2 text-xs text-gray-400 dark:text-gray-500 italic">
                    Empty
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

