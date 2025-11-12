import { ChevronDown, ChevronUp, Users, Calendar, Star, AlertCircle, TrendingUp } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useSquadStore } from '../../store/squadStore';
import { getPositionsForFormation } from '../../data/formations';
import { Card } from '../ui/Card';

export function SquadStatistics() {
  const formation = useSquadStore((state) => state.plan.formation);
  const depthChart = useSquadStore((state) => state.plan.depthChart);
  const positions = getPositionsForFormation(formation);
  const [isExpanded, setIsExpanded] = useState(true);

  const stats = useMemo(() => {
    let totalPlayers = 0;
    let totalAge = 0;
    let totalCA = 0;
    let totalPA = 0;
    const positionsWithIssues: string[] = [];
    const loanStatusCount = {
      owned: 0,
      'on-loan': 0,
      'loaned-out': 0,
    };
    
    // Position groups
    const positionGroups = {
      GK: 0,
      Defenders: 0,
      Midfielders: 0,
      Attackers: 0,
    };

    positions.forEach((position) => {
      const slot = depthChart[position] || {};
      const players = [slot.first, slot.second, slot.youth].filter(Boolean);
      const playerCount = players.length;
      
      if (playerCount < 2) {
        positionsWithIssues.push(position);
      }

      players.forEach((player) => {
        totalPlayers++;
        totalAge += player.age;
        totalCA += player.currentAbility;
        totalPA += player.potentialAbility;
        
        if (player.loanStatus) {
          loanStatusCount[player.loanStatus]++;
        }

        // Categorize by position
        if (position === 'GK') {
          positionGroups.GK++;
        } else if (['RB', 'RCB', 'CB', 'LCB', 'LB', 'RWB', 'LWB'].includes(position)) {
          positionGroups.Defenders++;
        } else if (['DM', 'DMR', 'DML', 'CM', 'RCM', 'LCM', 'RM', 'LM', 'AMC', 'AMR', 'AML'].includes(position)) {
          positionGroups.Midfielders++;
        } else if (['RW', 'LW', 'ST', 'RST', 'LST'].includes(position)) {
          positionGroups.Attackers++;
        }
      });
    });

    return {
      totalPlayers,
      averageAge: totalPlayers > 0 ? totalAge / totalPlayers : 0,
      averageCA: totalPlayers > 0 ? totalCA / totalPlayers : 0,
      averagePA: totalPlayers > 0 ? totalPA / totalPlayers : 0,
      positionsWithIssues: positionsWithIssues.length,
      loanStatusCount,
      positionGroups,
    };
  }, [positions, depthChart]);

  return (
    <Card>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between mb-3 hover:opacity-80 transition-opacity"
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Squad Statistics
        </h2>
        {isExpanded ? (
          <ChevronUp size={20} className="text-gray-500 dark:text-gray-400" />
        ) : (
          <ChevronDown size={20} className="text-gray-500 dark:text-gray-400" />
        )}
      </button>
      
      {isExpanded && (
        <div className="space-y-4">
          {/* Main Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                <Users size={16} />
                <span>Total Players</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalPlayers}
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                <Calendar size={16} />
                <span>Avg Age</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.averageAge > 0 ? stats.averageAge.toFixed(1) : '—'}
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                <Star size={16} />
                <span>Avg CA</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.averageCA > 0 ? stats.averageCA.toFixed(1) : '—'}
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                <TrendingUp size={16} />
                <span>Avg PA</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.averagePA > 0 ? stats.averagePA.toFixed(1) : '—'}
              </div>
            </div>
          </div>

          {/* Position Groups */}
          <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Players by Position Group
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Goalkeepers</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {stats.positionGroups.GK}
                </div>
              </div>
              <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Defenders</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {stats.positionGroups.Defenders}
                </div>
              </div>
              <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Midfielders</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {stats.positionGroups.Midfielders}
                </div>
              </div>
              <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Attackers</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {stats.positionGroups.Attackers}
                </div>
              </div>
            </div>
          </div>

          {/* Issues and Loan Status */}
          <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Positions with Issues */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Squad Health
                </h3>
                <div className="flex items-center gap-2">
                  {stats.positionsWithIssues > 0 ? (
                    <>
                      <AlertCircle size={16} className="text-amber-600 dark:text-amber-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-semibold text-amber-600 dark:text-amber-400">
                          {stats.positionsWithIssues}
                        </span>{' '}
                        position{stats.positionsWithIssues !== 1 ? 's' : ''} need{stats.positionsWithIssues === 1 ? 's' : ''} more players
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        All positions have sufficient depth
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Loan Status */}
              {(stats.loanStatusCount['on-loan'] > 0 || stats.loanStatusCount['loaned-out'] > 0) && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Loan Status
                  </h3>
                  <div className="space-y-1">
                    {stats.loanStatusCount['on-loan'] > 0 && (
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-medium">📥 On Loan:</span>{' '}
                        {stats.loanStatusCount['on-loan']} player{stats.loanStatusCount['on-loan'] !== 1 ? 's' : ''}
                      </div>
                    )}
                    {stats.loanStatusCount['loaned-out'] > 0 && (
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-medium">📤 Loaned Out:</span>{' '}
                        {stats.loanStatusCount['loaned-out']} player{stats.loanStatusCount['loaned-out'] !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

