import React from 'react';
import { Player } from '../types';
import { User, X, Sparkles, Plus } from 'lucide-react';

interface PlayerCardProps {
  slotNumber: number;
  player: Player | null;
  isFocused: boolean;
  isSelected?: boolean;
  onClick: () => void;
  onRemove?: () => void;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  slotNumber,
  player,
  isFocused,
  isSelected,
  onClick,
  onRemove,
}) => {
  const formattedSlot = slotNumber < 10 ? `0${slotNumber}` : `${slotNumber}`;

  if (!player) {
    return (
      <div
        id={`slot-${slotNumber}`}
        onClick={onClick}
        className={`group relative flex flex-col justify-between p-3 rounded-xl cursor-pointer transition-all duration-150 h-full w-full border backdrop-blur-md ${
          isFocused
            ? 'border-[#00ff88] bg-[#00ff88]/[0.12] shadow-[0_0_18px_rgba(0,255,136,0.35)] scale-[1.02] z-10 ring-1 ring-[#00ff88]'
            : 'bg-[#151518]/75 border-dashed border-[#2c2c32] hover:border-[#8e8e93]/60 hover:bg-[#1e1e22]/90 text-[#8e8e93]'
        }`}
      >
        {/* Top header: Slot number */}
        <div className="flex items-center justify-between w-full">
          <span
            className={`font-mono-code text-[11px] font-black tracking-wider ${
              isFocused ? 'text-[#00ff88]' : 'text-white/40'
            }`}
          >
            #{formattedSlot}
          </span>
          <span className="text-[9px] font-mono-code text-[#8e8e93]/60 uppercase">
            Libre
          </span>
        </div>

        {/* Centered plus and add icon */}
        <div className="flex flex-col items-center justify-center my-auto text-center py-1">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all duration-150 ${
              isFocused
                ? 'border-[#00ff88] text-[#00ff88] bg-[#00ff88]/20 shadow-[0_0_10px_rgba(0,255,136,0.4)]'
                : 'border-[#2c2c32] bg-[#0a0a0c]/60 text-[#8e8e93] group-hover:border-[#00ff88]/50 group-hover:text-[#00ff88]'
            }`}
          >
            <Plus className="w-4 h-4 font-bold" />
          </div>
          <span
            className={`text-[11px] mt-1.5 font-bold uppercase tracking-wider ${
              isFocused ? 'text-[#00ff88]' : 'text-[#8e8e93] group-hover:text-white'
            }`}
          >
            Slot {formattedSlot}
          </span>
        </div>

        {/* Bottom hint */}
        <div className="flex items-center justify-center text-[9px] font-mono-code text-[#8e8e93]/60 pt-1 border-t border-white/[0.04]">
          <span>[Enter] para asignar</span>
        </div>
      </div>
    );
  }

  // Card with assigned player
  return (
    <div
      id={`slot-${slotNumber}`}
      onClick={onClick}
      className={`group relative flex flex-col justify-between p-3 rounded-xl cursor-pointer transition-all duration-150 h-full w-full border overflow-hidden backdrop-blur-md ${
        isFocused
          ? 'border-[#00ff88] bg-[#1e1e22] shadow-[0_0_20px_rgba(0,255,136,0.45)] scale-[1.02] z-10 ring-1 ring-[#00ff88]'
          : isSelected
          ? 'bg-[#1e1e22]/95 border-[#00ff88]/70 shadow-md'
          : 'bg-[#151518]/90 border-[#2c2c32] hover:border-[#8e8e93]/60 hover:bg-[#1e1e22]'
      }`}
    >
      {/* Top row: Slot number, Country & OVR Badge */}
      <div className="flex items-center justify-between gap-1 z-10 w-full">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-mono-code text-[11px] font-black ${
              isFocused ? 'text-[#00ff88]' : 'text-white/60'
            }`}
          >
            #{formattedSlot}
          </span>
          <span className="text-[10px] font-mono-code text-[#8e8e93] font-bold">
            {player.nationalityCode}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {player.isLegend && (
            <span title="PES Classic Legend" className="text-[#00ff88]">
              <Sparkles className="w-3 h-3" />
            </span>
          )}
          <span
            className={`font-display font-black text-xs px-2 py-0.5 rounded leading-none ${
              player.overallRating >= 95
                ? 'bg-[#00ff88]/20 text-[#00ff88] border border-[#00ff88]/50 shadow-[0_0_8px_rgba(0,255,136,0.3)]'
                : 'bg-[#2c2c32] text-white border border-[#3c3c44]'
            }`}
          >
            {player.overallRating}
          </span>

          {/* Quick remove button */}
          {onRemove && (
            <button
              title="Quitar jugador (Del)"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="opacity-0 group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-400 text-[#8e8e93] p-0.5 rounded transition-all ml-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main card info: Player face & Name */}
      <div className="flex items-center gap-2.5 my-auto py-1 z-10">
        <div className="relative flex-shrink-0 w-10 h-10 rounded-lg bg-[#2c2c32] border border-[#3c3c44] overflow-hidden flex items-center justify-center shadow-inner">
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
            <User className="w-5 h-5 text-[#8e8e93]" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-xs sm:text-sm text-white uppercase tracking-tight truncate leading-tight group-hover:text-[#00ff88] transition-colors">
            {player.name}
          </h4>
          <div className="flex items-center gap-1.5 text-[10px] text-[#8e8e93] font-mono-code mt-1">
            <span>{player.year}</span>
            <span>•</span>
            <span className="text-white/90 font-bold bg-[#2c2c32] px-1 py-0.2 rounded text-[9px]">
              {player.preferredPosition}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-[9px] text-[#8e8e93] pt-1.5 border-t border-[#2c2c32]/80 z-10 font-mono-code w-full">
        <span className="truncate">{player.nationality}</span>
        <span className="opacity-60">ID: {player.id}</span>
      </div>
    </div>
  );
};
