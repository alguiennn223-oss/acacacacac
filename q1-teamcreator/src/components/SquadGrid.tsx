import React from 'react';
import { SlotItem, TabMode } from '../types';
import { PlayerCard } from './PlayerCard';
import { Trash2 } from 'lucide-react';

interface SquadGridProps {
  currentTab: TabMode;
  startingSlots: SlotItem[];
  benchSlots: SlotItem[];
  focusedSlotIndex: number;
  onTabChange: (tab: TabMode) => void;
  onSlotClick: (index: number) => void;
  onRemovePlayer: (tab: TabMode, index: number) => void;
  onClearAll: () => void;
}

export const SquadGrid: React.FC<SquadGridProps> = ({
  currentTab,
  startingSlots,
  benchSlots,
  focusedSlotIndex,
  onTabChange,
  onSlotClick,
  onRemovePlayer,
  onClearAll,
}) => {
  const isStarting = currentTab === 'STARTING_XI';
  const activeSlots = isStarting ? startingSlots : benchSlots;
  const filledCount = activeSlots.filter((s) => s.player !== null).length;
  const maxSlots = isStarting ? 11 : 15;

  const startingFilled = startingSlots.filter((s) => s.player !== null);
  const squadOvr = startingFilled.length
    ? Math.round(startingFilled.reduce((acc, s) => acc + (s.player?.overallRating || 0), 0) / startingFilled.length)
    : 0;

  return (
    <div className="flex flex-col h-full w-full bg-[#0a0a0c] overflow-hidden relative">
      {/* Top Controls: Sleek Tabs + Clear Button */}
      <div className="flex items-center justify-between border-b border-[#2c2c32] bg-[#151518] px-4 flex-shrink-0 z-10">
        {/* Sleek Tabs matching design */}
        <div className="flex -mb-[1px]">
          {/* Tab 1: STARTING XI */}
          <button
            id="tab-starting-xi"
            onClick={() => onTabChange('STARTING_XI')}
            className={`px-5 py-2.5 text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-2 border-b-2 ${
              isStarting
                ? 'text-[#00ff88] border-[#00ff88] bg-[#00ff88]/10'
                : 'text-[#8e8e93] hover:text-white border-transparent hover:bg-white/[0.02]'
            }`}
          >
            <span>STARTING XI</span>
            <span className="text-[10px] font-mono-code opacity-60 ml-1">L1</span>
            <span
              className={`text-[10px] font-mono-code px-1.5 py-0.2 rounded font-bold ml-1 ${
                isStarting ? 'bg-[#00ff88] text-[#0a0a0c]' : 'bg-[#2c2c32] text-[#8e8e93]'
              }`}
            >
              {startingFilled.length}/11
            </span>
          </button>

          {/* Tab 2: BENCH */}
          <button
            id="tab-bench"
            onClick={() => onTabChange('BENCH')}
            className={`px-5 py-2.5 text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-2 border-b-2 ${
              !isStarting
                ? 'text-[#00ff88] border-[#00ff88] bg-[#00ff88]/10'
                : 'text-[#8e8e93] hover:text-white border-transparent hover:bg-white/[0.02]'
            }`}
          >
            <span>BENCH (Suplentes)</span>
            <span className="text-[10px] font-mono-code opacity-60 ml-1">R1</span>
            <span
              className={`text-[10px] font-mono-code px-1.5 py-0.2 rounded font-bold ml-1 ${
                !isStarting ? 'bg-[#00ff88] text-[#0a0a0c]' : 'bg-[#2c2c32] text-[#8e8e93]'
              }`}
            >
              {benchSlots.filter((s) => s.player !== null).length}/15
            </span>
          </button>
        </div>

        {/* Action button: Clear current tab or squad */}
        <div className="flex items-center gap-2">
          <button
            onClick={onClearAll}
            title="Vaciar todos los slots"
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-[#8e8e93] hover:text-red-400 hover:bg-red-950/20 border border-[#2c2c32] hover:border-red-900/40 rounded transition-colors"
          >
            <Trash2 className="w-3 h-3" />
            <span className="text-[10px] uppercase font-semibold hidden sm:inline">Vaciar Slots</span>
          </button>
        </div>
      </div>

      {/* Grid Subheader Info */}
      <div className="flex items-center justify-between text-xs text-[#8e8e93] px-5 py-2 border-b border-[#2c2c32]/50 bg-[#151518]/60 flex-shrink-0 z-10 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white text-[11px] uppercase tracking-wider">
            {isStarting ? 'Slots Titulares (01 – 11)' : 'Slots Suplentes (01 – 15)'}
          </span>
          <span className="text-[10px] text-[#00ff88]/80 font-mono-code">
            [Cancha Táctica • Slots Libres]
          </span>
        </div>
        <div className="text-[11px] font-mono-code text-[#00ff88]">
          Cursor activo: Slot {(focusedSlotIndex + 1) < 10 ? `0${focusedSlotIndex + 1}` : focusedSlotIndex + 1}
        </div>
      </div>

      {/* Main Pitch Container with Football Pitch Background & Markings */}
      <div className="relative flex-1 overflow-y-auto p-4 sm:p-5 bg-[radial-gradient(ellipse_at_center,#0d2015_0%,#09130d_55%,#0a0a0c_100%)]">
        {/* Faint PES 2021 Tactical Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <div className="text-[110px] font-black text-white opacity-[0.025] rotate-[-25deg] tracking-widest font-display">
            PES 2021
          </div>
        </div>

        {/* Soccer Pitch Markings Lines Overlay */}
        <div className="absolute inset-3 border-2 border-[#00ff88]/10 rounded pointer-events-none">
          {/* Halfway line */}
          <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-[#00ff88]/10" />

          {/* Center Circle & Center Spot */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-2 border-[#00ff88]/10" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#00ff88]/30" />

          {/* Top Penalty Box */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-64 h-24 border-b-2 border-l-2 border-r-2 border-[#00ff88]/10">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-10 border-b-2 border-l-2 border-r-2 border-[#00ff88]/10" />
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#00ff88]/20" />
          </div>

          {/* Bottom Penalty Box */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-64 h-24 border-t-2 border-l-2 border-r-2 border-[#00ff88]/10">
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-10 border-t-2 border-l-2 border-r-2 border-[#00ff88]/10" />
            <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#00ff88]/20" />
          </div>
        </div>

        {/* Tactical Grid Cards filling the full tactical pitch area */}
        <div className="relative z-10 h-full w-full flex flex-col">
          {isStarting ? (
            /* STARTING XI: 4 columns × 3 rows grid that spans the entire pitch canvas */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 grid-rows-3 h-full gap-3 sm:gap-4">
              {startingSlots.map((slot, index) => (
                <PlayerCard
                  key={slot.slotNumber}
                  slotNumber={slot.slotNumber}
                  player={slot.player}
                  isFocused={focusedSlotIndex === index}
                  onClick={() => onSlotClick(index)}
                  onRemove={slot.player ? () => onRemovePlayer('STARTING_XI', index) : undefined}
                />
              ))}

              {/* Symmetry placeholder slot (Empty 12th space to complete 4x3 grid) */}
              <div
                aria-hidden="true"
                className="flex flex-col items-center justify-center p-3 rounded-xl border border-dashed border-[#2c2c32]/40 bg-white/[0.01] opacity-25 select-none h-full w-full"
              >
                <span className="font-mono-code text-[10px] text-[#8e8e93] tracking-wider uppercase">
                  [11 Titulares]
                </span>
                <span className="text-[9px] text-[#8e8e93]/60 mt-1 font-mono-code">
                  Formación Libre
                </span>
              </div>
            </div>
          ) : (
            /* BENCH: 4 columns × 4 rows grid that spans the entire pitch canvas */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 grid-rows-4 h-full gap-2.5 sm:gap-3">
              {benchSlots.map((slot, index) => (
                <PlayerCard
                  key={slot.slotNumber}
                  slotNumber={slot.slotNumber}
                  player={slot.player}
                  isFocused={focusedSlotIndex === index}
                  onClick={() => onSlotClick(index)}
                  onRemove={slot.player ? () => onRemovePlayer('BENCH', index) : undefined}
                />
              ))}

              {/* Symmetry placeholder slot (Empty 16th space to complete 4x4 grid) */}
              <div
                aria-hidden="true"
                className="flex flex-col items-center justify-center p-2 rounded-xl border border-dashed border-[#2c2c32]/40 bg-white/[0.01] opacity-25 select-none h-full w-full"
              >
                <span className="font-mono-code text-[10px] text-[#8e8e93] tracking-wider uppercase">
                  [15 Suplentes]
                </span>
                <span className="text-[9px] text-[#8e8e93]/60 mt-1 font-mono-code">
                  Banco Libre
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sleek Grid Footer */}
      <div className="flex-shrink-0 px-5 py-2.5 border-t border-[#2c2c32] bg-[#151518] flex flex-wrap items-center justify-between gap-3 text-xs z-10">
        <div className="flex items-center gap-6">
          <div className="text-left">
            <div className="text-[10px] text-[#8e8e93] uppercase font-mono-code">MEDIA TITULARES</div>
            <div className="text-sm font-bold text-white leading-tight">
              {squadOvr ? `${squadOvr} OVR` : '-- OVR'}
            </div>
          </div>

          <div className="text-left">
            <div className="text-[10px] text-[#8e8e93] uppercase font-mono-code">OCUPACIÓN</div>
            <div className="text-sm font-bold text-[#00ff88] leading-tight">
              {filledCount} / {maxSlots}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[10px] text-[#8e8e93] font-mono-code">
          <span><kbd className="px-1.5 py-0.5 bg-[#2c2c32] text-white rounded font-bold">[↑↓←→]</kbd> Navegar</span>
          <span><kbd className="px-1.5 py-0.5 bg-[#2c2c32] text-white rounded font-bold">[Enter/X]</kbd> Seleccionar</span>
          <span><kbd className="px-1.5 py-0.5 bg-[#2c2c32] text-white rounded font-bold">[Del]</kbd> Quitar</span>
        </div>
      </div>
    </div>
  );
};
