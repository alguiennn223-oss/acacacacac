import React from 'react';
import { Gamepad2, Save, FolderOpen, History, Code2, HelpCircle, Shield, Gamepad } from 'lucide-react';

interface HeaderProps {
  gamepadConnected: boolean;
  gamepadName: string;
  onOpenSave: () => void;
  onOpenLoad: () => void;
  onOpenBackup: () => void;
  onOpenCSharp: () => void;
  onToggleF1: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  gamepadConnected,
  gamepadName,
  onOpenSave,
  onOpenLoad,
  onOpenBackup,
  onOpenCSharp,
  onToggleF1,
}) => {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 px-6 py-3.5 bg-[#0a0a0c]/95 border-b border-[#2c2c32] backdrop-blur-md sticky top-0 z-30 shadow-lg">
      {/* Left: Branding & PES 2021 Indicator matching Sleek Interface */}
      <div className="flex items-center gap-3.5">
        <div className="flex items-center gap-3">
          <div className="bg-[#00ff88] text-[#0a0a0c] font-black px-2.5 py-1 rounded text-sm tracking-wider font-display shadow-[0_0_15px_rgba(0,255,136,0.35)] flex items-center justify-center">
            Q1
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-white uppercase font-display">
                TEAM CREATOR
              </span>
              <span className="text-[10px] font-mono-code px-1.5 py-0.5 rounded bg-[#1e1e22] text-[#00ff88] border border-[#2c2c32] font-semibold">
                v0.1
              </span>
            </div>
            <span className="text-[10px] text-[#00ff88] opacity-80 uppercase tracking-wide font-semibold">
              COMPATIBLE WITH PES 2021
            </span>
          </div>
        </div>

        <div className="hidden xl:flex items-center gap-4 text-[11px] text-[#8e8e93] uppercase tracking-wider font-mono-code ml-4 pl-4 border-l border-[#2c2c32]">
          <span>
            DB STATUS: <span className="text-[#00ff88] font-bold">MOCK DATA</span>
          </span>
          <span>REGION: GLOBAL</span>
        </div>
      </div>

      {/* Middle/Right: Gamepad Status Indicator & Quick Action Buttons */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Gamepad Connection Badge */}
        <div
          title={gamepadConnected ? `Gamepad conectado: ${gamepadName}` : 'Gamepad no detectado (usa teclado o conecta un mando)'}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono-code transition-all ${
            gamepadConnected
              ? 'bg-[#00ff88]/10 border-[#00ff88]/50 text-[#00ff88] shadow-[0_0_12px_rgba(0,255,136,0.2)]'
              : 'bg-[#151518] border-[#2c2c32] text-[#8e8e93]'
          }`}
        >
          <Gamepad2 className={`w-4 h-4 ${gamepadConnected ? 'text-[#00ff88] animate-pulse' : 'text-[#8e8e93]'}`} />
          <span className="hidden sm:inline font-semibold">
            {gamepadConnected ? 'GAMEPAD ACTIVO' : 'TECLADO / MANDO'}
          </span>
        </div>

        {/* Secondary buttons */}
        <button
          id="btn-load-team"
          onClick={onOpenLoad}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#1e1e22] hover:bg-[#2c2c32] text-white font-semibold text-xs rounded-md border border-[#2c2c32] transition-all uppercase tracking-wide"
        >
          <FolderOpen className="w-3.5 h-3.5 text-[#00ff88]" />
          <span>LOAD TEAM</span>
        </button>

        {/* Primary Save button */}
        <button
          id="btn-save-team"
          onClick={onOpenSave}
          className="flex items-center gap-1.5 px-4 py-1.5 bg-[#00ff88] hover:bg-[#00e67a] text-[#0a0a0c] font-display font-bold text-xs rounded-md transition-all shadow-[0_0_15px_rgba(0,255,136,0.35)] uppercase tracking-wide"
        >
          <Save className="w-3.5 h-3.5 text-[#0a0a0c]" />
          <span>SAVE TEAM</span>
        </button>

        <button
          id="btn-backup"
          onClick={onOpenBackup}
          title="Historial de Backups"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#151518] hover:bg-[#1e1e22] text-[#8e8e93] hover:text-white font-medium text-xs rounded-md border border-[#2c2c32] transition-all"
        >
          <History className="w-3.5 h-3.5 text-[#00ff88]" />
          <span className="hidden md:inline">BACKUP</span>
        </button>

        <button
          id="btn-csharp-architecture"
          onClick={onOpenCSharp}
          title="Arquitectura C# / WPF para Compilación .exe"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#151518] hover:bg-[#1e1e22] text-[#8e8e93] hover:text-white font-medium text-xs rounded-md border border-[#2c2c32] transition-all"
        >
          <Code2 className="w-3.5 h-3.5 text-[#00ff88]" />
          <span className="hidden lg:inline">.NET C#</span>
        </button>

        <button
          id="btn-f1-toggle"
          onClick={onToggleF1}
          title="Presiona F1 para alternar HUD y Ayuda"
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#151518] hover:bg-[#1e1e22] text-[#8e8e93] hover:text-[#00ff88] rounded-md border border-[#2c2c32] transition-all"
        >
          <span className="font-mono-code text-[11px] font-bold px-1.5 py-0.5 bg-[#2c2c32] text-white rounded">
            F1
          </span>
        </button>
      </div>
    </header>
  );
};
