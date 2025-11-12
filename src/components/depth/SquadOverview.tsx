import { AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useSquadStore } from '../../store/squadStore';
import { getPositionsForFormation } from '../../data/formations';
import { loadRoles } from '../../utils/roles';
import { Card } from '../ui/Card';
import { StarRating } from '../ui/StarRating';

export function SquadOverview() {
  const formation = useSquadStore((state) => state.plan.formation);
  const depthChart = useSquadStore((state) => state.plan.depthChart);
  const positions = getPositionsForFormation(formation);
  const [isOverviewExpanded, setIsOverviewExpanded] = useState(true);
  const [expandedPositions, setExpandedPositions] = useState<Set<string>>(
    new Set(positions)
  );

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
      <button
        onClick={() => setIsOverviewExpanded(!isOverviewExpanded)}
        className="w-full flex items-center justify-between mb-3 hover:opacity-80 transition-opacity"
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Squad Overview
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formation}
          </span>
          {isOverviewExpanded ? (
            <ChevronUp size={20} className="text-gray-500 dark:text-gray-400" />
          ) : (
            <ChevronDown size={20} className="text-gray-500 dark:text-gray-400" />
          )}
        </div>
      </button>
      {isOverviewExpanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {positionData.map(({ position, playerCount, hasIssue, role, first, second, youth }) => {
          const isExpanded = expandedPositions.has(position);
          
          return (
            <div
              key={position}
              className={`
                rounded-lg border transition-colors overflow-hidden
                ${
                  hasIssue
                    ? 'border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-900/10'
                    : 'border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50'
                }
              `}
            >
              <button
                onClick={() => togglePosition(position)}
                className="w-full p-3 flex items-center justify-between hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors"
              >
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
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {playerCount}/3
                  </span>
                  {isExpanded ? (
                    <ChevronUp size={16} className="text-gray-500 dark:text-gray-400" />
                  ) : (
                    <ChevronDown size={16} className="text-gray-500 dark:text-gray-400" />
                  )}
                </div>
              </button>
              
              {isExpanded && (
                <div className="px-3 pb-3 space-y-2">
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
              )}
            </div>
          );
        })}
        </div>
      )}
    </Card>
  );
}

