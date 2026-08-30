import React, { useState } from 'react';
import { SlotItem } from '../types';
import { Shield, Sparkles, Globe, UserCheck, Users, User, ListOrdered, Award } from 'lucide-react';

interface PitchVisualizerProps {
  teamName: string;
  shortName: string;
  startingSlots: SlotItem[];
  benchSlots: SlotItem[];
  focusedSlotIndex?: number;
  currentTab?: 'STARTING_XI' | 'BENCH';
  onSelectSlot?: (tab: 'STARTING_XI' | 'BENCH', index: number) => void;
}

export const PitchVisualizer: React.FC<PitchVisualizerProps> = ({
  teamName,
  shortName,
  startingSlots,
  benchSlots,
}) => {
  // Filter for viewing Starting XI, Bench, or All in the read-only overview
  const [listFilter, setListFilter] = useState<'STARTING' | 'BENCH' | 'ALL'>('STARTING');

  // Stats calculation
  const filledStarting = startingSlots.filter((s) => s.player !== null);
  const filledBench = benchSlots.filter((s) => s.player !== null);
  const allFilled = [...filledStarting, ...filledBench];

  const avgOvr = filledStarting.length
    ? Math.round(filledStarting.reduce((sum, s) => sum + (s.player?.overallRating || 0), 0) / filledStarting.length)
    : 0;

  const totalAvgOvr = allFilled.length
    ? Math.round(allFilled.reduce((sum, s) => sum + (s.player?.overallRating || 0), 0) / allFilled.length)
    : 0;

  const nationalities = Array.from(new Set(allFilled.map((s) => s.player?.nationality).filter(Boolean)));
  const legendCount = allFilled.filter((s) => s.player?.isLegend).length;

  // Determine which list items to display based on filter
  const itemsToDisplay =
    listFilter === 'STARTING'
      ? startingSlots.map((slot, index) => ({ slot, tab: 'STARTING_XI' as const, index, displayNum: slot.slotNumber }))
      : listFilter === 'BENCH'
      ? benchSlots.map((slot, index) => ({ slot, tab: 'BENCH' as const, index, displayNum: 11 + slot.slotNumber }))
      : [
          ...startingSlots.map((slot, index) => ({ slot, tab: 'STARTING_XI' as const, index, displayNum: slot.slotNumber })),
          ...benchSlots.map((slot, index) => ({ slot, tab: 'BENCH' as const, index, displayNum: 11 + slot.slotNumber })),
        ];

  return (
    <div className="flex flex-col h-full w-full bg-[#151518] overflow-hidden select-none">
      {/* Top Header of Team Sheet List */}
      <div className="flex items-center justify-between p-4 border-b border-[#2c2c32] bg-[#151518] flex-shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-md bg-[#00ff88]/10 border border-[#00ff88]/30 flex items-center justify-center text-[#00ff88] flex-shrink-0">
            <Shield className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 truncate">
              <h2 className="font-display font-bold text-xs tracking-wide text-white uppercase truncate">
                {teamName || 'Custom Team'}
              </h2>
              <span className="font-mono-code text-[10px] px-1.5 py-0.2 bg-[#1e1e22] text-[#00ff88] font-bold rounded border border-[#2c2c32] flex-shrink-0">
                [{shortName || 'CST'}]
              </span>
            </div>
            <p className="text-[10px] text-[#8e8e93] flex items-center gap-1 mt-0.5">
              <ListOrdered className="w-3 h-3 text-[#00ff88]" />
              <span className="text-[#8e8e93] uppercase font-mono-code tracking-wider">
                Planilla de Jugadores
              </span>
            </p>
          </div>
        </div>

        {/* Quick OVR Tag */}
        <div className="flex flex-col items-end flex-shrink-0">
          <span className="text-[9px] uppercase tracking-wider text-[#8e8e93] font-mono-code">Media XI</span>
          <div className="flex items-center gap-1">
            <span className="font-display text-base font-black text-[#00ff88] leading-none">
              {avgOvr || '--'}
            </span>
            <span className="text-[9px] text-[#8e8e93] font-mono-code font-bold">OVR</span>
          </div>
        </div>
      </div>

      {/* Filter Switcher for List View (Titulares / Suplentes / Todo) */}
      <div className="flex items-center justify-between gap-1 p-3 border-b border-[#2c2c32] bg-[#1e1e22]/50 flex-shrink-0 text-xs font-semibold">
        <button
          onClick={() => setListFilter('STARTING')}
          className={`flex-1 py-1.5 px-1.5 rounded text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-1 ${
            listFilter === 'STARTING'
              ? 'bg-[#00ff88] text-[#0a0a0c] font-bold shadow-sm'
              : 'text-[#8e8e93] hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <span>Titulares</span>
          <span
            className={`font-mono-code text-[9px] px-1 py-0.2 rounded font-bold ${
              listFilter === 'STARTING' ? 'bg-[#0a0a0c]/20 text-[#0a0a0c]' : 'bg-[#2c2c32] text-[#8e8e93]'
            }`}
          >
            {filledStarting.length}/11
          </span>
        </button>

        <button
          onClick={() => setListFilter('BENCH')}
          className={`flex-1 py-1.5 px-1.5 rounded text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-1 ${
            listFilter === 'BENCH'
              ? 'bg-[#00ff88] text-[#0a0a0c] font-bold shadow-sm'
              : 'text-[#8e8e93] hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <span>Suplentes</span>
          <span
            className={`font-mono-code text-[9px] px-1 py-0.2 rounded font-bold ${
              listFilter === 'BENCH' ? 'bg-[#0a0a0c]/20 text-[#0a0a0c]' : 'bg-[#2c2c32] text-[#8e8e93]'
            }`}
          >
            {filledBench.length}/15
          </span>
        </button>

        <button
          onClick={() => setListFilter('ALL')}
          className={`flex-1 py-1.5 px-1.5 rounded text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-1 ${
            listFilter === 'ALL'
              ? 'bg-[#00ff88] text-[#0a0a0c] font-bold shadow-sm'
              : 'text-[#8e8e93] hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <span>Total</span>
          <span
            className={`font-mono-code text-[9px] px-1 py-0.2 rounded font-bold ${
              listFilter === 'ALL' ? 'bg-[#0a0a0c]/20 text-[#0a0a0c]' : 'bg-[#2c2c32] text-[#8e8e93]'
            }`}
          >
            {allFilled.length}/26
          </span>
        </button>
      </div>

      {/* Read-Only Roster List Container (NO TOCABLE) */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5 bg-[#0a0a0c]/60">
        {itemsToDisplay.map(({ slot, tab, displayNum }) => {
          const player = slot.player;
          const formattedNum = displayNum < 10 ? `0${displayNum}` : `${displayNum}`;

          return (
            <div
              key={`${tab}-${slot.slotNumber}`}
              className={`flex items-center justify-between p-2 rounded-lg border transition-colors ${
                player
                  ? 'border-[#2c2c32] bg-[#1e1e22]/90'
                  : 'border-dashed border-[#2c2c32]/50 bg-white/[0.01] opacity-60'
              }`}
            >
              {/* Left: Slot Number, Face & Player Details */}
              <div className="flex items-center gap-2 min-w-0">
                {/* Slot index badge */}
                <div
                  className={`w-6 h-6 rounded flex items-center justify-center font-mono-code text-[11px] font-black flex-shrink-0 ${
                    player
                      ? 'bg-[#151518] text-[#00ff88] border border-[#2c2c32]'
                      : 'bg-[#151518] text-[#8e8e93] border border-[#2c2c32]/40'
                  }`}
                >
                  {formattedNum}
                </div>

                {/* Player Face Thumbnail */}
                <div className="relative w-7 h-7 rounded bg-[#2c2c32] border border-[#2c2c32] overflow-hidden flex items-center justify-center flex-shrink-0">
                  {player?.faceUrl ? (
                    <img
                      src={player.faceUrl}
                      alt={player.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <User className="w-3.5 h-3.5 text-[#8e8e93]" />
                  )}
                </div>

                {/* Player Information / Empty state text */}
                <div className="flex flex-col min-w-0">
                  {player ? (
                    <>
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-[11px] text-white uppercase truncate">
                          {player.name}
                        </span>
                        {player.isLegend && (
                          <span title="Leyenda PES" className="text-[#00ff88] flex-shrink-0">
                            <Sparkles className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-[9px] text-[#8e8e93] font-mono-code">
                        <span>{player.nationalityCode}</span>
                        <span>•</span>
                        <span>{player.year}</span>
                        <span>•</span>
                        <span className="text-white/80">{player.preferredPosition}</span>
                      </div>
                    </>
                  ) : (
                    <span className="text-[11px] font-medium text-[#8e8e93]/80 italic">
                      [Sin asignar]
                    </span>
                  )}
                </div>
              </div>

              {/* Right: Overall Rating badge */}
              {player && (
                <div
                  className={`font-display font-black text-[11px] px-1.5 py-0.2 rounded leading-tight flex-shrink-0 ${
                    player.overallRating >= 95
                      ? 'bg-[#00ff88]/20 text-[#00ff88] border border-[#00ff88]/40'
                      : 'bg-[#2c2c32] text-white'
                  }`}
                >
                  {player.overallRating}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Summary Bar with Squad Metadata */}
      <div className="p-3 border-t border-[#2c2c32] bg-[#151518] flex-shrink-0 space-y-2">
        <div className="grid grid-cols-3 gap-1.5">
          <div className="bg-[#1e1e22] border border-[#2c2c32] rounded p-1.5 flex flex-col items-center text-center">
            <span className="text-[8px] text-[#8e8e93] uppercase font-mono-code">Titulares</span>
            <span className="text-xs font-bold text-white mt-0.5">
              {filledStarting.length}/11
            </span>
          </div>

          <div className="bg-[#1e1e22] border border-[#2c2c32] rounded p-1.5 flex flex-col items-center text-center">
            <span className="text-[8px] text-[#8e8e93] uppercase font-mono-code">Suplentes</span>
            <span className="text-xs font-bold text-white mt-0.5">
              {filledBench.length}/15
            </span>
          </div>

          <div className="bg-[#1e1e22] border border-[#2c2c32] rounded p-1.5 flex flex-col items-center text-center">
            <span className="text-[8px] text-[#8e8e93] uppercase font-mono-code">Naciones</span>
            <span className="text-xs font-bold text-white mt-0.5">
              {nationalities.length}
            </span>
          </div>
        </div>

        {legendCount > 0 && (
          <div className="flex items-center justify-between px-2 py-1 rounded bg-[#00ff88]/10 border border-[#00ff88]/30 text-[10px]">
            <span className="flex items-center gap-1 text-[#00ff88] font-bold uppercase">
              <Award className="w-3 h-3" /> Clásicos / Leyendas
            </span>
            <span className="font-mono-code font-black text-[#00ff88]">
              {legendCount}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

