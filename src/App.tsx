import { useState } from 'react';
import { useSquadStore } from './store/squadStore';
import { AppLayout } from './components/layout/AppLayout';
import { DepthChart } from './components/depth/DepthChart';
import { PlayerEditorModal } from './components/player/PlayerEditorModal';
import type { Player } from './types';

function App() {
  const upsertPlayer = useSquadStore((state) => state.upsertPlayer);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    position: string;
    tier: 'first' | 'second' | 'youth';
    player?: Player;
  }>({
    isOpen: false,
    position: '',
    tier: 'first',
  });

  const handlePositionClick = (position: string, tier: 'first' | 'second' | 'youth' = 'first') => {
    const depthChart = useSquadStore.getState().plan.depthChart;
    const slot = depthChart[position];
    const player = tier === 'first' ? slot?.first : tier === 'second' ? slot?.second : slot?.youth;

    setModalState({
      isOpen: true,
      position,
      tier,
      player,
    });
  };

  const handleSavePlayer = (player: Player) => {
    upsertPlayer(modalState.position, modalState.tier, player);
  };

  const handleCloseModal = () => {
    setModalState({ ...modalState, isOpen: false });
  };

  return (
    <AppLayout>
      <DepthChart onPositionClick={handlePositionClick} />

      <PlayerEditorModal
        key={`${modalState.position}-${modalState.tier}-${modalState.isOpen}`}
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        onSave={handleSavePlayer}
        position={modalState.position}
        player={modalState.player}
        tier={modalState.tier}
      />
    </AppLayout>
  );
}

export default App;

