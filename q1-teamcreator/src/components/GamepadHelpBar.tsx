import React from 'react';
import { Gamepad2, Keyboard, Compass } from 'lucide-react';

interface GamepadHelpBarProps {
  lastAction?: string;
  gamepadConnected: boolean;
}

export const GamepadHelpBar: React.FC<GamepadHelpBarProps> = ({ lastAction, gamepadConnected }) => {
  return (
    <footer className="bg-[#151518] border-t border-[#2c2c32] px-6 py-2 flex flex-wrap items-center justify-between gap-3 text-xs font-mono-code text-[#8e8e93] z-20">
      {/* Controller / Keyboard Key glyphs */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Navigation */}
        <div className="flex items-center gap-1.5">
          <span className="px-1.5 py-0.5 bg-[#1e1e22] border border-[#2c2c32] text-white rounded text-[10px] font-bold">
            ↑ ↓ ← →
          </span>
          <span className="text-[10px] text-[#8e8e93]">Mover Cursor</span>
        </div>

        {/* Tab Switcher L1 / R1 */}
        <div className="flex items-center gap-1.5">
          <div className="flex gap-1">
            <span className="px-1.5 py-0.5 bg-[#1e1e22] border border-[#2c2c32] text-[#00ff88] rounded text-[10px] font-bold">
              L1 / Q
            </span>
            <span className="px-1.5 py-0.5 bg-[#1e1e22] border border-[#2c2c32] text-[#00ff88] rounded text-[10px] font-bold">
              R1 / E
            </span>
          </div>
          <span className="text-[10px] text-[#8e8e93]">Titulares ⇄ Suplentes</span>
        </div>

        {/* Select / Enter */}
        <div className="flex items-center gap-1.5">
          <span className="px-1.5 py-0.5 bg-[#00ff88]/10 border border-[#00ff88]/40 text-[#00ff88] rounded text-[10px] font-bold">
            [Enter / X]
          </span>
          <span className="text-[10px] text-[#8e8e93]">Seleccionar</span>
        </div>

        {/* Back / Esc */}
        <div className="flex items-center gap-1.5">
          <span className="px-1.5 py-0.5 bg-[#1e1e22] border border-[#2c2c32] text-[#8e8e93] rounded text-[10px] font-bold">
            [Esc / O]
          </span>
          <span className="text-[10px] text-[#8e8e93]">Volver</span>
        </div>

        {/* Delete */}
        <div className="flex items-center gap-1.5 hidden md:flex">
          <span className="px-1.5 py-0.5 bg-red-950/30 border border-red-900/40 text-red-400 rounded text-[10px] font-bold">
            [Del / ▢]
          </span>
          <span className="text-[10px] text-[#8e8e93]">Quitar</span>
        </div>

        {/* F1 */}
        <div className="flex items-center gap-1.5">
          <span className="px-1.5 py-0.5 bg-[#1e1e22] border border-[#2c2c32] text-amber-400 rounded text-[10px] font-bold">
            [F1]
          </span>
          <span className="text-[10px] text-[#8e8e93]">Toggle HUD</span>
        </div>
      </div>

      {/* Right side: Input telemetry indicator */}
      <div className="flex items-center gap-3">
        {lastAction && (
          <div className="flex items-center gap-1.5 text-[#00ff88] text-[10px] bg-[#00ff88]/10 border border-[#00ff88]/30 px-2 py-0.5 rounded">
            <Compass className="w-3 h-3" />
            <span>{lastAction}</span>
          </div>
        )}
        <div className="text-[10px] text-[#8e8e93] hidden sm:block">
          Q1 v0.1 • PES 2021 Engine
        </div>
      </div>
    </footer>
  );
};
