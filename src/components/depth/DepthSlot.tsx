import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import type { Player } from '../../types';
import { StarRating } from '../ui/StarRating';
import { ConfirmDialog } from '../ui/ConfirmDialog';

interface DepthSlotProps {
  player?: Player;
  tier: 'first' | 'second' | 'youth';
  position: string;
  onEdit: () => void;
  onRemove: () => void;
  onDrop?: (fromPosition: string, fromTier: 'first' | 'second' | 'youth') => void;
  isDragging?: boolean;
  isDragOver?: boolean;
}

const TIER_LABELS = {
  first: '1st Choice',
  second: '2nd Choice',
  youth: 'Youth Prospect',
};

export function DepthSlot({
  player,
  tier,
  position,
  onEdit,
  onRemove,
  onDrop,
  isDragging = false,
  isDragOver = false,
}: DepthSlotProps) {
  const [isDraggedOver, setIsDraggedOver] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    if (!player) {
      e.preventDefault();
      return;
    }
    // Don't start drag if clicking on delete button
    const target = e.target as HTMLElement;
    if (target.closest('button[title="Remove player"]')) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', JSON.stringify({ position, tier }));
    e.currentTarget.style.opacity = '0.5';
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.style.opacity = '1';
    setIsDraggedOver(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDraggedOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggedOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggedOver(false);
    
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      const fromPosition = data.position;
      const fromTier = data.tier;
      
      // Only swap if it's a different slot
      if (fromPosition !== position || fromTier !== tier) {
        onDrop?.(fromPosition, fromTier);
      }
    } catch (error) {
      console.error('Failed to parse drag data:', error);
    }
  };

  const dragOverClass = isDragOver || isDraggedOver 
    ? 'border-blue-500 dark:border-blue-400 bg-blue-100 dark:bg-blue-900/30' 
    : '';

  if (!player) {
    return (
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors ${dragOverClass}`}
      >
        <button
          onClick={onEdit}
          className="w-full text-left"
        >
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {TIER_LABELS[tier]} - Add Player
          </div>
        </button>
      </div>
    );
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-colors cursor-move ${isDragging ? 'opacity-50' : ''} ${dragOverClass}`}
    >
      <div className="flex items-start justify-between gap-2">
        <button
          onClick={onEdit}
          className="flex-1 text-left hover:opacity-80 transition-opacity"
        >
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="font-semibold text-gray-900 dark:text-white">{player.name}</h3>
            <span className="text-xs text-gray-500 dark:text-gray-400">({player.nationality})</span>
            {player.loanStatus && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  player.loanStatus === 'on-loan'
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : player.loanStatus === 'loaned-out'
                    ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                    : ''
                }`}
                title={
                  player.loanStatus === 'on-loan'
                    ? 'On loan from another club'
                    : 'Loaned out to another club'
                }
              >
                {player.loanStatus === 'on-loan' ? '📥 On Loan' : '📤 Loaned Out'}
              </span>
            )}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
            Age: {player.age}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-600 dark:text-gray-400">CA:</span>
              <StarRating value={player.currentAbility} />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-600 dark:text-gray-400">PA:</span>
              <StarRating value={player.potentialAbility} />
            </div>
          </div>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowConfirmDialog(true);
          }}
          onMouseDown={(e) => e.stopPropagation()}
          className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-600 dark:text-red-400 transition-colors"
          title="Remove player"
        >
          <Trash2 size={16} />
        </button>
      </div>
      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={onRemove}
        title="Remove Player"
        message={`Are you sure you want to remove ${player.name} from ${position} (${TIER_LABELS[tier]})?`}
        confirmText="Remove"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}

