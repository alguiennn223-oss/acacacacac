import React, { useState } from 'react';
import { Code2, Copy, Check, FileCode, Layers, ShieldCheck, Terminal, FolderTree, X } from 'lucide-react';

interface DotNetArchitectureViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DotNetArchitectureViewer: React.FC<DotNetArchitectureViewerProps> = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<string>('IPesDatabase.cs');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const filesCode: { [key: string]: { path: string; language: string; content: string; desc: string } } = {
    'IPesDatabase.cs': {
      path: 'Q1.Pes/Interfaces/IPesDatabase.cs',
      language: 'csharp',
      desc: 'Interfaz abstracta que desacopla completamente la UI y el Core de los datos de PES 2021.',
      content: `namespace Q1.Pes.Interfaces
{
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using Q1.Core.Models;

    /// <summary>
    /// Contrato universal de acceso a base de datos de PES 2021.
    /// Tanto MockPesDatabase como RealPesDatabase implementan esta interfaz.
    /// </summary>
    public interface IPesDatabase
    {
        Task<IReadOnlyList<Player>> ReadPlayersAsync();
        Task<IReadOnlyList<Player>> SearchPlayersAsync(string query);
        Task<Player?> GetPlayerByIdAsync(int id);
        Task<IReadOnlyList<TeamPreset>> ReadSavedPresetsAsync();
        Task<TeamPreset> SaveTeamAsync(string name, TeamData teamData, string description = "");
        Task<bool> DeletePresetAsync(string presetId);
        
        // Sistema de Backups
        Task<BackupSnapshot> CreateBackupAsync(string description, TeamData teamData);
        Task<IReadOnlyList<BackupSnapshot>> ReadBackupsAsync();
        Task<TeamData?> RestoreBackupAsync(string backupId);
        
        string ProviderName { get; }
        bool IsRealPesConnected { get; }
    }
}`
    },
    'RealPesDatabase.cs': {
      path: 'Q1.Pes/RealPesDatabase.cs',
      language: 'csharp',
      desc: 'Capa futura para lectura y escritura binaria de Team.bin, Player.bin y EDIT00000000 de PES 2021.',
      content: `namespace Q1.Pes
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Threading.Tasks;
    using Q1.Core.Models;
    using Q1.Pes.Interfaces;

    /// <summary>
    /// Capa de integración real con eFootball PES 2021 (v1.0).
    /// Aquí se implementará la deserialización binaria de TeamX.bin y EDIT00000000.
    /// </summary>
    public class RealPesDatabase : IPesDatabase
    {
        private readonly string _pesPath;
        private readonly string _editFilePath;

        public RealPesDatabase(string? customPesPath = null, string? customEditPath = null)
        {
            _pesPath = customPesPath ?? @"C:\\Program Files (x86)\\Steam\\steamapps\\common\\eFootball PES 2021";
            _editFilePath = customEditPath ?? Path.Combine(
                Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments),
                @"KONAMI\\eFootball PES 2021 SEASON UPDATE\\Save\\EDIT00000000"
            );
        }

        public string ProviderName => "Real PES 2021 Engine (Binary Reader/Writer)";
        public bool IsRealPesConnected => File.Exists(_editFilePath);

        public async Task<IReadOnlyList<Player>> ReadPlayersAsync()
        {
            // TODO v1.0: Deserializar Player.bin / EDIT00000000 usando bloques de 116 bytes (zlib Little-Endian)
            throw new NotImplementedException("RealPesDatabase conectará los BIN en la fase v1.0.");
        }

        public async Task<IReadOnlyList<Player>> SearchPlayersAsync(string query)
        {
            throw new NotImplementedException();
        }

        public async Task<Player?> GetPlayerByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<IReadOnlyList<TeamPreset>> ReadSavedPresetsAsync()
        {
            throw new NotImplementedException();
        }

        public async Task<TeamPreset> SaveTeamAsync(string name, TeamData teamData, string description = "")
        {
            // TODO v1.0: Escribir la estructura binaria en Team.bin y regenerar punteros en EDIT00000000
            throw new NotImplementedException("Escritura en Team.bin protegida en v0.1.");
        }

        public async Task<bool> DeletePresetAsync(string presetId) => false;

        public async Task<BackupSnapshot> CreateBackupAsync(string description, TeamData teamData)
        {
            throw new NotImplementedException();
        }

        public async Task<IReadOnlyList<BackupSnapshot>> ReadBackupsAsync() => Array.Empty<BackupSnapshot>();
        public async Task<TeamData?> RestoreBackupAsync(string backupId) => null;
    }
}`
    },
    'TeamModel.cs': {
      path: 'Q1.Core/Models/TeamModel.cs',
      language: 'csharp',
      desc: 'Lógica central del equipo: Starting XI (11 slots 3x3x3x2) y Bench (15 slots 4x4x4x3), validación de unicidad.',
      content: `namespace Q1.Core.Models
{
    using System;
    using System.Collections.Generic;
    using System.Linq;

    public class TeamModel
    {
        public const int StartingXiSize = 11;
        public const int BenchSize = 15;

        public string Name { get; set; } = "Custom PES Team";
        public string ShortName { get; set; } = "CST";

        private readonly Player?[] _startingXI = new Player?[StartingXiSize];
        private readonly Player?[] _bench = new Player?[BenchSize];

        public IReadOnlyList<Player?> StartingXI => _startingXI;
        public IReadOnlyList<Player?> Bench => _bench;

        public bool SetStartingXIPlayer(int slotIndex, Player? player)
        {
            if (slotIndex < 0 || slotIndex >= StartingXiSize) return false;
            
            if (player != null && IsPlayerUsed(player.Id, out var tab, out var slot))
            {
                if (!(tab == "STARTING_XI" && slot == slotIndex + 1))
                    return false; // Evita duplicados
            }

            _startingXI[slotIndex] = player;
            return true;
        }

        public bool SetBenchPlayer(int slotIndex, Player? player)
        {
            if (slotIndex < 0 || slotIndex >= BenchSize) return false;

            if (player != null && IsPlayerUsed(player.Id, out var tab, out var slot))
            {
                if (!(tab == "BENCH" && slot == slotIndex + 1))
                    return false; // Evita duplicados
            }

            _bench[slotIndex] = player;
            return true;
        }

        public bool IsPlayerUsed(int playerId, out string? tab, out int slotNumber)
        {
            for (int i = 0; i < _startingXI.Length; i++)
            {
                if (_startingXI[i]?.Id == playerId)
                {
                    tab = "STARTING_XI";
                    slotNumber = i + 1;
                    return true;
                }
            }
            for (int i = 0; i < _bench.Length; i++)
            {
                if (_bench[i]?.Id == playerId)
                {
                    tab = "BENCH";
                    slotNumber = i + 1;
                    return true;
                }
            }
            tab = null;
            slotNumber = -1;
            return false;
        }

        public void RemovePlayer(string tab, int slotIndex)
        {
            if (tab == "STARTING_XI" && slotIndex >= 0 && slotIndex < StartingXiSize)
                _startingXI[slotIndex] = null;
            else if (tab == "BENCH" && slotIndex >= 0 && slotIndex < BenchSize)
                _bench[slotIndex] = null;
        }
    }
}`
    },
    'MainWindowViewModel.cs': {
      path: 'Q1.UI/ViewModels/MainWindowViewModel.cs',
      language: 'csharp',
      desc: 'ViewModel MVVM con comandos para Gamepad/Teclado (Flechas, Enter/X, Esc/O, L1/R1, F1).',
      content: `namespace Q1.UI.ViewModels
{
    using System.Collections.ObjectModel;
    using System.Windows.Input;
    using CommunityToolkit.Mvvm.ComponentModel;
    using CommunityToolkit.Mvvm.Input;
    using Q1.Core.Models;
    using Q1.Pes.Interfaces;

    public partial class MainWindowViewModel : ObservableObject
    {
        private readonly IPesDatabase _database;
        private readonly TeamModel _team = new();

        [ObservableProperty]
        private string _currentTab = "STARTING_XI"; // "STARTING_XI" or "BENCH"

        [ObservableProperty]
        private int _cursorIndex = 0;

        [ObservableProperty]
        private bool _isPlayerSelectorOpen = false;

        public MainWindowViewModel(IPesDatabase database)
        {
            _database = database;
        }

        [RelayCommand]
        public void ToggleTab()
        {
            CurrentTab = CurrentTab == "STARTING_XI" ? "BENCH" : "STARTING_XI";
            CursorIndex = 0;
        }

        [RelayCommand]
        public void MoveCursor(string direction)
        {
            int cols = CurrentTab == "STARTING_XI" ? 3 : 4;
            int max = CurrentTab == "STARTING_XI" ? 11 : 15;
            
            switch (direction)
            {
                case "Up" when CursorIndex - cols >= 0: CursorIndex -= cols; break;
                case "Down" when CursorIndex + cols < max: CursorIndex += cols; break;
                case "Left" when CursorIndex > 0: CursorIndex--; break;
                case "Right" when CursorIndex < max - 1: CursorIndex++; break;
            }
        }

        [RelayCommand]
        public void SelectSlot()
        {
            IsPlayerSelectorOpen = true;
        }
    }
}`
    }
  };

  const handleCopy = () => {
    const code = filesCode[selectedFile]?.content || '';
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl bg-[#151518] border border-[#2c2c32] rounded-xl shadow-2xl flex flex-col max-h-[88vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#2c2c32] bg-[#151518]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-[#00ff88]/10 border border-[#00ff88]/30 flex items-center justify-center text-[#00ff88]">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-sm text-white uppercase tracking-wide">
                  ARQUITECTURA .NET / C# / WPF PARA COMPILACIÓN A .EXE
                </h3>
                <span className="text-[9px] font-mono-code px-1.5 py-0.5 rounded bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/30">
                  MVVM & Clean Arch
                </span>
              </div>
              <p className="text-[11px] text-[#8e8e93]">
                Estructura modular dividida en Core, Data, Pes e Interfaces para exportar a Visual Studio
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

        {/* Main Content Layout */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* File selector sidebar */}
          <div className="w-full md:w-60 bg-[#151518] border-r border-[#2c2c32] p-3 space-y-1.5 overflow-y-auto">
            <span className="text-[10px] font-semibold text-[#8e8e93] uppercase tracking-wider font-mono-code flex items-center gap-1.5 px-1 mb-2">
              <FolderTree className="w-3 h-3 text-[#00ff88]" /> Módulos C#
            </span>

            {Object.keys(filesCode).map((fileName) => (
              <button
                key={fileName}
                onClick={() => setSelectedFile(fileName)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono-code flex items-center gap-2 transition-all ${
                  selectedFile === fileName
                    ? 'bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/40 shadow-sm font-bold'
                    : 'text-[#8e8e93] hover:bg-[#1e1e22] hover:text-white border border-transparent'
                }`}
              >
                <FileCode className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{fileName}</span>
              </button>
            ))}

            <div className="mt-4 pt-3 border-t border-[#2c2c32] px-1 space-y-1.5 text-[10px] text-[#8e8e93] font-mono-code">
              <div className="flex items-center gap-1 text-white font-bold">
                <Terminal className="w-3 h-3 text-[#00ff88]" /> Compilación .EXE:
              </div>
              <p className="leading-relaxed">
                <code>dotnet build -c Release</code> genera el ejecutable nativo <code>Q1.exe</code> sin dependencias.
              </p>
            </div>
          </div>

          {/* Code Viewer Area */}
          <div className="flex-1 flex flex-col bg-[#0a0a0c] overflow-hidden">
            {/* Top file meta */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#1e1e22] border-b border-[#2c2c32] text-xs font-mono-code">
              <div className="flex items-center gap-2 text-white text-[11px]">
                <FileCode className="w-3.5 h-3.5 text-[#00ff88]" />
                <span className="font-semibold">{filesCode[selectedFile]?.path}</span>
              </div>

              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-[#2c2c32] hover:bg-[#383840] text-white rounded text-xs font-sans font-medium transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-[#00ff88]" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? '¡Copiado!' : 'Copiar Código'}</span>
              </button>
            </div>

            {/* Description callout */}
            <div className="px-4 py-1.5 bg-[#151518] border-b border-[#2c2c32] text-[11px] text-[#8e8e93]">
              {filesCode[selectedFile]?.desc}
            </div>

            {/* Code editor body */}
            <div className="flex-1 overflow-auto p-4 bg-[#0a0a0c] font-mono-code text-[11px] leading-relaxed text-white">
              <pre className="text-[#00ff88]/90 whitespace-pre">
                {filesCode[selectedFile]?.content}
              </pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-[#2c2c32] bg-[#151518] text-xs text-[#8e8e93] font-mono-code">
          <span className="text-[10px]">Q1 Architecture • Modular Clean Design</span>
          <button
            onClick={onClose}
            className="px-3.5 py-1 bg-[#2c2c32] hover:bg-[#383840] text-white rounded text-xs font-semibold transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
