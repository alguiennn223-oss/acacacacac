import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Player, SlotItem, TabMode, TeamData, TeamPreset } from './types';
import { TeamModel } from './core/TeamModel';
import { MockPesDatabase } from './pes/MockPesDatabase';
import { PesBackupService } from './pes/PesBackupService';
import { useGamepad } from './hooks/useGamepad';

import { Header } from './components/Header';
import { PitchVisualizer } from './components/PitchVisualizer';
import { SquadGrid } from './components/SquadGrid';
import { PlayerSelectorModal } from './components/PlayerSelectorModal';
import { SaveLoadModal } from './components/SaveLoadModal';
import { BackupModal } from './components/BackupModal';
import { DotNetArchitectureViewer } from './components/DotNetArchitectureViewer';
import { GamepadHelpBar } from './components/GamepadHelpBar';
import { Sparkles, Shield, Info, HelpCircle } from 'lucide-react';

export default function App() {
  // Initialize PES Database & Services
  const pesDatabase = useMemo(() => new MockPesDatabase(), []);
  const backupService = useMemo(() => new PesBackupService(pesDatabase), [pesDatabase]);

  // Core Team instance
  const [teamModel] = useState<TeamModel>(() => new TeamModel('PES Legends XI', 'LEG'));
  const [teamVersion, setTeamVersion] = useState<number>(0); // Triggers re-render on team mutations

  // Database players state
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Navigation State
  const [currentTab, setCurrentTab] = useState<TabMode>('STARTING_XI');
  const [startingCursorIndex, setStartingCursorIndex] = useState<number>(0); // 0 to 10
  const [benchCursorIndex, setBenchCursorIndex] = useState<number>(0); // 0 to 14

  // Modals state
  const [isPlayerSelectorOpen, setIsPlayerSelectorOpen] = useState<boolean>(false);
  const [selectorTargetSlot, setSelectorTargetSlot] = useState<{ tab: TabMode; index: number }>({
    tab: 'STARTING_XI',
    index: 0,
  });

  const [saveLoadModalState, setSaveLoadModalState] = useState<{ isOpen: boolean; mode: 'SAVE' | 'LOAD' }>({
    isOpen: false,
    mode: 'SAVE',
  });
  const [isBackupModalOpen, setIsBackupModalOpen] = useState<boolean>(false);
  const [isCSharpModalOpen, setIsCSharpModalOpen] = useState<boolean>(false);
  const [isF1HelpOpen, setIsF1HelpOpen] = useState<boolean>(false);

  // Load players and initial default preset
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const players = await pesDatabase.readPlayers();
      setAllPlayers(players);

      const presets = await pesDatabase.readSavedPresets();
      if (presets.length > 0) {
        teamModel.loadFromJSON(
          {
            name: presets[0].name,
            shortName: 'LEG',
            startingXI: presets[0].startingXI,
            bench: presets[0].bench,
          },
          players
        );
        setTeamVersion((v) => v + 1);
      }
      setIsLoading(false);
    }
    loadData();
  }, [pesDatabase, teamModel]);

  // Grid Navigation Functions
  const currentCursorIndex = currentTab === 'STARTING_XI' ? startingCursorIndex : benchCursorIndex;

  const handleMoveCursor = useCallback(
    (direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
      // If modal is open, don't move background cursor
      if (
        isPlayerSelectorOpen ||
        saveLoadModalState.isOpen ||
        isBackupModalOpen ||
        isCSharpModalOpen ||
        isF1HelpOpen
      ) {
        return;
      }

      if (currentTab === 'STARTING_XI') {
        const cols = 3;
        const total = 11; // 11 starting slots

        setStartingCursorIndex((prev) => {
          let next = prev;
          if (direction === 'UP' && prev - cols >= 0) next = prev - cols;
          else if (direction === 'DOWN' && prev + cols < total) next = prev + cols;
          else if (direction === 'LEFT' && prev > 0) next = prev - 1;
          else if (direction === 'RIGHT' && prev < total - 1) next = prev + 1;
          return next;
        });
      } else {
        const cols = 4;
        const total = 15; // 15 bench slots

        setBenchCursorIndex((prev) => {
          let next = prev;
          if (direction === 'UP' && prev - cols >= 0) next = prev - cols;
          else if (direction === 'DOWN' && prev + cols < total) next = prev + cols;
          else if (direction === 'LEFT' && prev > 0) next = prev - 1;
          else if (direction === 'RIGHT' && prev < total - 1) next = prev + 1;
          return next;
        });
      }
    },
    [
      currentTab,
      isPlayerSelectorOpen,
      saveLoadModalState.isOpen,
      isBackupModalOpen,
      isCSharpModalOpen,
      isF1HelpOpen,
    ]
  );

  const handleOpenSlotSelector = useCallback(
    (tab: TabMode, index: number) => {
      setSelectorTargetSlot({ tab, index });
      setIsPlayerSelectorOpen(true);
    },
    []
  );

  const handleSelectCurrentSlot = useCallback(() => {
    if (
      saveLoadModalState.isOpen ||
      isBackupModalOpen ||
      isCSharpModalOpen ||
      isF1HelpOpen
    ) {
      return;
    }
    if (isPlayerSelectorOpen) {
      // Player selection handled inside modal
      return;
    }
    handleOpenSlotSelector(currentTab, currentCursorIndex);
  }, [
    currentTab,
    currentCursorIndex,
    isPlayerSelectorOpen,
    saveLoadModalState.isOpen,
    isBackupModalOpen,
    isCSharpModalOpen,
    isF1HelpOpen,
    handleOpenSlotSelector,
  ]);

  const handleRemoveCurrentSlotPlayer = useCallback(() => {
    if (isPlayerSelectorOpen) return;
    teamModel.removePlayer(currentTab, currentCursorIndex);
    setTeamVersion((v) => v + 1);
  }, [currentTab, currentCursorIndex, isPlayerSelectorOpen, teamModel]);

  const handleToggleTab = useCallback(() => {
    if (isPlayerSelectorOpen) return;
    setCurrentTab((prev) => (prev === 'STARTING_XI' ? 'BENCH' : 'STARTING_XI'));
  }, [isPlayerSelectorOpen]);

  const handleBack = useCallback(() => {
    if (isPlayerSelectorOpen) {
      setIsPlayerSelectorOpen(false);
    } else if (saveLoadModalState.isOpen) {
      setSaveLoadModalState({ isOpen: false, mode: 'SAVE' });
    } else if (isBackupModalOpen) {
      setIsBackupModalOpen(false);
    } else if (isCSharpModalOpen) {
      setIsCSharpModalOpen(false);
    } else if (isF1HelpOpen) {
      setIsF1HelpOpen(false);
    }
  }, [
    isPlayerSelectorOpen,
    saveLoadModalState.isOpen,
    isBackupModalOpen,
    isCSharpModalOpen,
    isF1HelpOpen,
  ]);

  const handleToggleF1 = useCallback(() => {
    setIsF1HelpOpen((prev) => !prev);
  }, []);

  // Hook up Gamepad and Keyboard Controller
  const { gamepadConnected, gamepadName, lastAction } = useGamepad({
    onUp: () => handleMoveCursor('UP'),
    onDown: () => handleMoveCursor('DOWN'),
    onLeft: () => handleMoveCursor('LEFT'),
    onRight: () => handleMoveCursor('RIGHT'),
    onSelectSlot: handleSelectCurrentSlot,
    onBack: handleBack,
    onToggleTab: handleToggleTab,
    onToggleTabNext: handleToggleTab,
    onToggleF1: handleToggleF1,
    onDeleteSlot: handleRemoveCurrentSlotPlayer,
  });

  // Assign Player to Slot
  const handleAssignPlayer = (player: Player) => {
    const { tab, index } = selectorTargetSlot;
    if (tab === 'STARTING_XI') {
      teamModel.setStartingXIPlayer(index, player);
    } else {
      teamModel.setBenchPlayer(index, player);
    }
    setTeamVersion((v) => v + 1);
    setIsPlayerSelectorOpen(false);
  };

  // Remove Player directly
  const handleRemovePlayer = (tab: TabMode, index: number) => {
    teamModel.removePlayer(tab, index);
    setTeamVersion((v) => v + 1);
  };

  // Clear all players
  const handleClearAll = () => {
    if (window.confirm('¿Seguro que deseas vaciar todos los slots de Titulares y Suplentes?')) {
      teamModel.clearAll();
      setTeamVersion((v) => v + 1);
    }
  };

  // Save Team Handler
  const handleSaveTeam = async (name: string, shortName: string) => {
    teamModel.name = name;
    teamModel.shortName = shortName;
    const teamJSON = teamModel.toJSON();
    await pesDatabase.saveTeam(name, teamJSON, `Plantilla Q1 (${new Date().toLocaleDateString()})`);
    await backupService.createSnapshot(teamJSON, `Autobackup al guardar: ${name}`);
    setTeamVersion((v) => v + 1);
  };

  // Load Preset Handler
  const handleLoadPreset = (preset: TeamPreset) => {
    teamModel.loadFromJSON(
      {
        name: preset.name,
        shortName: teamModel.shortName,
        startingXI: preset.startingXI,
        bench: preset.bench,
      },
      allPlayers
    );
    setTeamVersion((v) => v + 1);
  };

  // Load from uploaded JSON
  const handleLoadFromFile = (data: TeamData) => {
    teamModel.loadFromJSON(data, allPlayers);
    setTeamVersion((v) => v + 1);
  };

  // Restore backup
  const handleRestoreTeam = (data: TeamData) => {
    teamModel.loadFromJSON(data, allPlayers);
    setTeamVersion((v) => v + 1);
  };

  // Memoized slot states
  const startingSlots: SlotItem[] = useMemo(() => {
    // teamVersion dependency ensures freshness
    return teamModel.startingXISlots;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamModel, teamVersion]);

  const benchSlots: SlotItem[] = useMemo(() => {
    return teamModel.benchSlots;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamModel, teamVersion]);

  const usedPlayerIds = useMemo(() => {
    return teamModel.usedPlayerIds;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamModel, teamVersion]);

  const getPlayerSlotInfo = useCallback(
    (playerId: number) => {
      return teamModel.getPlayerSlotInfo(playerId);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [teamModel, teamVersion]
  );

  return (
    <div className="h-screen w-full flex flex-col bg-[#0a0a0c] text-white overflow-hidden">
      {/* Top Header with PES 2021 indicator & controls */}
      <Header
        gamepadConnected={gamepadConnected}
        gamepadName={gamepadName}
        onOpenSave={() => setSaveLoadModalState({ isOpen: true, mode: 'SAVE' })}
        onOpenLoad={() => setSaveLoadModalState({ isOpen: true, mode: 'LOAD' })}
        onOpenBackup={() => setIsBackupModalOpen(true)}
        onOpenCSharp={() => setIsCSharpModalOpen(true)}
        onToggleF1={handleToggleF1}
      />

      {/* Main Unified Full-Screen Workspace */}
      <main className="flex-1 flex flex-col lg:flex-row w-full overflow-hidden">
        {/* LEFT PANEL: Read-Only Roster Overview Sheet (320px-380px fixed width) */}
        <aside className="w-full lg:w-80 xl:w-96 flex-shrink-0 border-b lg:border-b-0 lg:border-r border-[#2c2c32] bg-[#151518] flex flex-col h-[260px] lg:h-full overflow-hidden">
          <PitchVisualizer
            teamName={teamModel.name}
            shortName={teamModel.shortName}
            startingSlots={startingSlots}
            benchSlots={benchSlots}
          />
        </aside>

        {/* RIGHT PANEL: Tactical Pitch Canvas with Interactive Compact Squad Slots */}
        <section className="flex-1 h-full flex flex-col bg-[#0a0a0c] overflow-hidden relative">
          <SquadGrid
            currentTab={currentTab}
            startingSlots={startingSlots}
            benchSlots={benchSlots}
            focusedSlotIndex={currentCursorIndex}
            onTabChange={(tab) => {
              setCurrentTab(tab);
            }}
            onSlotClick={(index) => {
              if (currentTab === 'STARTING_XI') setStartingCursorIndex(index);
              else setBenchCursorIndex(index);
              handleOpenSlotSelector(currentTab, index);
            }}
            onRemovePlayer={handleRemovePlayer}
            onClearAll={handleClearAll}
          />
        </section>
      </main>

      {/* F1 Quick Help / Overlay Drawer */}
      {isF1HelpOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-[#151518] border border-[#2c2c32] rounded-xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#2c2c32]">
              <div className="flex items-center gap-2">
                <span className="font-mono-code text-[11px] px-2 py-0.5 rounded bg-[#00ff88] text-[#0a0a0c] font-bold">
                  [F1]
                </span>
                <h3 className="font-display font-bold text-sm text-white uppercase tracking-wide">
                  GUÍA DE NAVEGACIÓN Q1
                </h3>
              </div>
              <button
                onClick={() => setIsF1HelpOpen(false)}
                className="text-[#8e8e93] hover:text-white text-xs font-semibold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs text-white">
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#1e1e22] border border-[#2c2c32]">
                <span className="font-bold text-[#00ff88]">L1 / R1 (o teclas Q / E)</span>
                <span className="text-[#8e8e93] text-[11px]">Alternar entre Titulares y Suplentes</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#1e1e22] border border-[#2c2c32]">
                <span className="font-bold text-[#00ff88]">Flechas / D-Pad (↑↓←→)</span>
                <span className="text-[#8e8e93] text-[11px]">Mover cursor en la grilla</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#1e1e22] border border-[#2c2c32]">
                <span className="font-bold text-[#00ff88]">Enter / Tecla X / Botón [A/✕]</span>
                <span className="text-[#8e8e93] text-[11px]">Abrir selector de jugadores</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#1e1e22] border border-[#2c2c32]">
                <span className="font-bold text-[#00ff88]">Escape / Tecla O / Botón [B/◯]</span>
                <span className="text-[#8e8e93] text-[11px]">Cerrar modales o volver</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#1e1e22] border border-[#2c2c32]">
                <span className="font-bold text-[#00ff88]">Delete / Backspace / Botón [X/▢]</span>
                <span className="text-[#8e8e93] text-[11px]">Quitar jugador del slot</span>
              </div>
            </div>

            <div className="pt-2 text-[10px] text-[#8e8e93] border-t border-[#2c2c32] flex justify-between items-center font-mono-code">
              <span>Q1 Team Creator v0.1 • PES 2021 Tool</span>
              <button
                onClick={() => setIsF1HelpOpen(false)}
                className="px-3 py-1 bg-[#00ff88] text-[#0a0a0c] font-bold rounded text-xs uppercase"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <PlayerSelectorModal
        isOpen={isPlayerSelectorOpen}
        targetTab={selectorTargetSlot.tab}
        targetSlotIndex={selectorTargetSlot.index}
        players={allPlayers}
        usedPlayerIds={usedPlayerIds}
        getPlayerSlotInfo={getPlayerSlotInfo}
        onSelectPlayer={handleAssignPlayer}
        onClose={() => setIsPlayerSelectorOpen(false)}
      />

      <SaveLoadModal
        isOpen={saveLoadModalState.isOpen}
        mode={saveLoadModalState.mode}
        teamName={teamModel.name}
        shortName={teamModel.shortName}
        teamData={teamModel.toJSON()}
        pesDatabase={pesDatabase}
        onSaveTeam={handleSaveTeam}
        onLoadPreset={handleLoadPreset}
        onLoadFromFile={handleLoadFromFile}
        onClose={() => setSaveLoadModalState({ isOpen: false, mode: 'SAVE' })}
      />

      <BackupModal
        isOpen={isBackupModalOpen}
        backupService={backupService}
        currentTeamData={teamModel.toJSON()}
        onRestoreTeam={handleRestoreTeam}
        onClose={() => setIsBackupModalOpen(false)}
      />

      <DotNetArchitectureViewer
        isOpen={isCSharpModalOpen}
        onClose={() => setIsCSharpModalOpen(false)}
      />

      {/* Bottom Controller Help Bar */}
      <GamepadHelpBar lastAction={lastAction} gamepadConnected={gamepadConnected} />
    </div>
  );
}
