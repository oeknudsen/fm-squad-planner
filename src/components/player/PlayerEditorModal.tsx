import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Player, Ability, LoanStatus } from '../../types';
import { StarRating } from '../ui/StarRating';
import { Select } from '../ui/Select';
import { Card } from '../ui/Card';

interface PlayerEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (player: Player) => void;
  position: string;
  player?: Player;
  tier: 'first' | 'second' | 'youth';
}

const ABILITY_VALUES: Ability[] = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

export function PlayerEditorModal({
  isOpen,
  onClose,
  onSave,
  position,
  player,
  tier,
}: PlayerEditorModalProps) {
  const [name, setName] = useState('');
  const [nationality, setNationality] = useState('');
  const [age, setAge] = useState(25);
  const [currentAbility, setCurrentAbility] = useState<Ability>(3);
  const [potentialAbility, setPotentialAbility] = useState<Ability>(3.5);
  const [loanStatus, setLoanStatus] = useState<LoanStatus>('owned');

  useEffect(() => {
    if (player) {
      setName(player.name);
      setNationality(player.nationality);
      setAge(player.age);
      setCurrentAbility(player.currentAbility);
      setPotentialAbility(player.potentialAbility);
      setLoanStatus(player.loanStatus || 'owned');
    } else {
      setName('');
      setNationality('');
      setAge(25);
      setCurrentAbility(3);
      setPotentialAbility(3.5);
      setLoanStatus('owned');
    }
  }, [player, position, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPlayer: Player = {
      id: player?.id || `${position}-${tier}-${Date.now()}`,
      name,
      nationality,
      age,
      position,
      currentAbility,
      potentialAbility,
      loanStatus: loanStatus === 'owned' ? undefined : loanStatus,
    };
    onSave(newPlayer);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={(e) => {
        // Close modal when clicking backdrop
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <Card 
        className="w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {player ? 'Edit Player' : 'Add Player'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-900 dark:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nationality
            </label>
            <input
              type="text"
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Age
            </label>
            <input
              type="number"
              min="16"
              max="45"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Position
            </label>
            <input
              type="text"
              value={position}
              disabled
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
            />
          </div>

          <div>
            <Select
              label="Loan Status"
              value={loanStatus}
              onChange={(e) => setLoanStatus(e.target.value as LoanStatus)}
            >
              <option value="owned">Owned by Club</option>
              <option value="on-loan">On Loan (from another club)</option>
              <option value="loaned-out">Loaned Out (to another club)</option>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Current Ability
            </label>
            <Select
              value={currentAbility}
              onChange={(e) => setCurrentAbility(Number(e.target.value) as Ability)}
            >
              {ABILITY_VALUES.map((val) => (
                <option key={val} value={val}>
                  {val} {val === 0 ? 'star' : val === 5 ? 'stars' : 'stars'}
                </option>
              ))}
            </Select>
            <div className="mt-2">
              <StarRating value={currentAbility} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Potential Ability
            </label>
            <Select
              value={potentialAbility}
              onChange={(e) => setPotentialAbility(Number(e.target.value) as Ability)}
            >
              {ABILITY_VALUES.map((val) => (
                <option key={val} value={val}>
                  {val} {val === 0 ? 'star' : val === 5 ? 'stars' : 'stars'}
                </option>
              ))}
            </Select>
            <div className="mt-2">
              <StarRating value={potentialAbility} />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}

