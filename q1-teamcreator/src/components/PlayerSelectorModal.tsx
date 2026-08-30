import React, { useState, useEffect, useRef } from 'react';
import { Player, TabMode } from '../types';
import { Search, X, User, Check, ShieldAlert, Sparkles, Filter } from 'lucide-react';

interface PlayerSelectorModalProps {
  isOpen: boolean;
  targetTab: TabMode;
  targetSlotIndex: number;
  players: Player[];
  usedPlayerIds: Set<number>;
  getPlayerSlotInfo: (playerId: number) => { tab: TabMode; slotNumber: number } | null;
  onSelectPlayer: (player: Player) => void;
  onClose: () => void;
}

export const PlayerSelectorModal: React.FC<PlayerSelectorModalProps> = ({
  isOpen,
  targetTab,
  targetSlotIndex,
  players,
  usedPlayerIds,
  getPlayerSlotInfo,
  onSelectPlayer,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');
  const [highlightedIndex, setHighlightedIndex] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);

  // Auto-focus input on open
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setHighlightedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Filter players
  const filteredPlayers = players.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.nationality.toLowerCase().includes(q) ||
      p.nationalityCode.toLowerCase().includes(q) ||
      p.year.toString().includes(q) ||
      p.preferredPosition.toLowerCase().includes(q);

    if (!matchesSearch) return false;

    if (selectedFilter === 'LEGENDS') return p.isLegend;
    if (selectedFilter === '95+') return p.overallRating >= 95;
    if (selectedFilter === 'ATT') return ['CF', 'SS', 'LWF', 'RWF'].includes(p.preferredPosition);
    if (selectedFilter === 'MID') return ['AMF', 'CMF', 'DMF', 'LMF', 'RMF'].includes(p.preferredPosition);
    if (selectedFilter === 'DEF') return ['CB', 'LB', 'RB'].includes(p.preferredPosition);
    if (selectedFilter === 'GK') return p.preferredPosition === 'GK';

    return true;
  });

  // Handle keyboard navigation in list
  useEffect(() => {
    if (!isOpen) return;

    const handleModalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedIndex((prev) => Math.min(prev + 1, filteredPlayers.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const candidate = filteredPlayers[highlightedIndex];
        if (candidate) {
          const isUsed = usedPlayerIds.has(candidate.id);
          const currentSlotInfo = getPlayerSlotInfo(candidate.id);
          const isCurrentSlot =
            currentSlotInfo?.tab === targetTab && currentSlotInfo.slotNumber === targetSlotIndex + 1;

          if (!isUsed || isCurrentSlot) {
            onSelectPlayer(candidate);
          }
        }
      }
    };

    window.addEventListener('keydown', handleModalKeyDown);
    return () => window.removeEventListener('keydown', handleModalKeyDown);
  }, [isOpen, filteredPlayers, highlightedIndex, usedPlayerIds, targetTab, targetSlotIndex, getPlayerSlotInfo, onSelectPlayer]);

  if (!isOpen) return null;

  const targetSlotFormatted = targetSlotIndex + 1 < 10 ? `0${targetSlotIndex + 1}` : `${targetSlotIndex + 1}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        id="player-selector-dialog"
        className="relative w-full max-w-2xl bg-[#151518] border border-[#2c2c32] rounded-xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#2c2c32] bg-[#151518]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-[#00ff88]/10 border border-[#00ff88]/30 flex items-center justify-center text-[#00ff88]">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-sm text-white tracking-wide uppercase">
                  SEARCH PLAYER
                </h3>
                <span className="font-mono-code text-[10px] px-2 py-0.5 rounded bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/30 font-bold">
                  Slot {targetSlotFormatted} ({targetTab === 'STARTING_XI' ? 'Titular' : 'Suplente'})
                </span>
              </div>
              <p className="text-[11px] text-[#8e8e93] mt-0.5">
                Selecciona un jugador disponible de la base de datos PES 2021
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#8e8e93] hover:text-white hover:bg-[#2c2c32] rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search input bar */}
        <div className="p-4 border-b border-[#2c2c32] bg-[#151518] space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8e8e93]" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setHighlightedIndex(0);
              }}
              placeholder="Buscar por nombre, país, año, media (ej: Maradona, Messi, Brasil, 1986)..."
              className="w-full pl-10 pr-4 py-2 bg-[#0a0a0c] border border-[#2c2c32] focus:border-[#00ff88] rounded-lg text-white placeholder-[#8e8e93] text-xs font-sans outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8e8e93] hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[#8e8e93] text-[10px] uppercase font-mono-code mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3 text-[#00ff88]" /> Filtro:
            </span>
            {[
              { id: 'ALL', label: 'Todos' },
              { id: 'LEGENDS', label: '★ Leyendas' },
              { id: '95+', label: 'Rating 95+' },
              { id: 'ATT', label: 'Delanteros' },
              { id: 'MID', label: 'Centrocampistas' },
              { id: 'DEF', label: 'Defensores' },
              { id: 'GK', label: 'Porteros' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setSelectedFilter(tab.id);
                  setHighlightedIndex(0);
                }}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
                  selectedFilter === tab.id
                    ? 'bg-[#00ff88] text-[#0a0a0c] font-bold'
                    : 'bg-[#1e1e22] text-[#8e8e93] hover:text-white border border-[#2c2c32]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Players List */}
        <div ref={listContainerRef} className="flex-1 overflow-y-auto p-3 space-y-1.5 max-h-[380px]">
          {filteredPlayers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <User className="w-8 h-8 text-[#8e8e93] mb-2" />
              <p className="text-xs font-semibold text-white">No se encontraron jugadores</p>
              <p className="text-[10px] text-[#8e8e93] mt-0.5">Prueba buscando con otro término o filtro</p>
            </div>
          ) : (
            filteredPlayers.map((player, index) => {
              const isUsed = usedPlayerIds.has(player.id);
              const slotInfo = getPlayerSlotInfo(player.id);
              const isCurrentSlot =
                slotInfo?.tab === targetTab && slotInfo.slotNumber === targetSlotIndex + 1;
              const isHighlighted = highlightedIndex === index;

              return (
                <div
                  key={player.id}
                  onClick={() => {
                    if (!isUsed || isCurrentSlot) {
                      onSelectPlayer(player);
                    }
                  }}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`flex items-center justify-between p-2.5 rounded-lg border transition-all cursor-pointer ${
                    isUsed && !isCurrentSlot
                      ? 'opacity-40 bg-[#0a0a0c] border-[#2c2c32] cursor-not-allowed'
                      : isHighlighted
                      ? 'bg-[#1e1e22] border-[#00ff88] scale-[1.01]'
                      : 'bg-[#1e1e22]/50 border-[#2c2c32] hover:bg-[#1e1e22] hover:border-[#8e8e93]/50'
                  }`}
                >
                  {/* Left: Avatar & Info */}
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative w-9 h-9 rounded-md bg-[#2c2c32] border border-[#2c2c32] overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {player.faceUrl ? (
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
                        <User className="w-4 h-4 text-[#8e8e93]" />
                      )}
                    </div>

                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-white truncate uppercase">
                          {player.name}
                        </span>
                        {player.isLegend && (
                          <span className="flex items-center gap-0.5 text-[9px] text-[#00ff88] font-mono-code bg-[#00ff88]/10 px-1 py-0.2 rounded border border-[#00ff88]/20">
                            <Sparkles className="w-2.5 h-2.5" /> LEGEND
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-[10px] text-[#8e8e93] mt-0.5 font-mono-code">
                        <span>{player.year}</span>
                        <span>•</span>
                        <span>{player.nationality} ({player.nationalityCode})</span>
                        <span>•</span>
                        <span className="text-white font-semibold">{player.preferredPosition}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: OVR & Status */}
                  <div className="flex items-center gap-3">
                    {isUsed && !isCurrentSlot ? (
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-950/40 text-red-400 border border-red-900/40 text-[10px] font-mono-code">
                        <ShieldAlert className="w-3 h-3 text-red-400" />
                        <span>
                          En uso en {slotInfo?.tab === 'STARTING_XI' ? 'Titular' : 'Suplente'} {slotInfo?.slotNumber < 10 ? `0${slotInfo?.slotNumber}` : slotInfo?.slotNumber}
                        </span>
                      </div>
                    ) : isCurrentSlot ? (
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/30 text-[10px] font-mono-code">
                        <Check className="w-3 h-3 text-[#00ff88]" />
                        <span>Asignado a este slot</span>
                      </div>
                    ) : null}

                    {/* Overall Rating Badge */}
                    <div
                      className={`font-display font-bold text-xs px-2 py-0.5 rounded ${
                        player.overallRating >= 95
                          ? 'bg-[#00ff88]/20 text-[#00ff88] border border-[#00ff88]/40'
                          : 'bg-[#2c2c32] text-white'
                      }`}
                    >
                      {player.overallRating}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-[#2c2c32] bg-[#151518] text-xs text-[#8e8e93] font-mono-code">
          <div className="flex items-center gap-3 text-[10px]">
            <span>[↑↓] Navegar</span>
            <span>[Enter] Asignar</span>
            <span>[Esc] Cerrar</span>
          </div>

          <button
            onClick={onClose}
            className="px-3.5 py-1 bg-[#2c2c32] hover:bg-[#383840] text-white rounded transition-colors font-sans text-xs font-semibold"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
