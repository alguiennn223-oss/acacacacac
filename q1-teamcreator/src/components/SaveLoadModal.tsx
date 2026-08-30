import React, { useState, useEffect, useRef } from 'react';
import { TeamData, TeamPreset, Player } from '../types';
import { IPesDatabase } from '../pes/IPesDatabase';
import { Save, FolderOpen, Download, Upload, Check, Trash2, Shield, Calendar, Users, FileJson, X } from 'lucide-react';

interface SaveLoadModalProps {
  isOpen: boolean;
  mode: 'SAVE' | 'LOAD';
  teamName: string;
  shortName: string;
  teamData: TeamData;
  pesDatabase: IPesDatabase;
  onSaveTeam: (name: string, shortName: string) => Promise<void>;
  onLoadPreset: (preset: TeamPreset) => void;
  onLoadFromFile: (data: TeamData) => void;
  onClose: () => void;
}

export const SaveLoadModal: React.FC<SaveLoadModalProps> = ({
  isOpen,
  mode,
  teamName,
  shortName,
  teamData,
  pesDatabase,
  onSaveTeam,
  onLoadPreset,
  onLoadFromFile,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'SAVE' | 'LOAD'>(mode);
  const [inputName, setInputName] = useState<string>(teamName);
  const [inputShortName, setInputShortName] = useState<string>(shortName);
  const [presets, setPresets] = useState<TeamPreset[]>([]);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(mode);
      setInputName(teamName);
      setInputShortName(shortName);
      setSaveSuccess(false);
      loadPresets();
    }
  }, [isOpen, mode, teamName, shortName]);

  const loadPresets = async () => {
    const list = await pesDatabase.readSavedPresets();
    setPresets(list);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputName.trim()) return;
    await onSaveTeam(inputName, inputShortName);
    setSaveSuccess(true);
    await loadPresets();
    setTimeout(() => {
      setSaveSuccess(false);
    }, 2500);
  };

  const handleExportJSON = () => {
    const payload = {
      name: inputName || teamName,
      shortName: inputShortName || shortName,
      startingXI: teamData.startingXI.filter((id): id is number => id !== null),
      bench: teamData.bench.filter((id): id is number => id !== null),
      version: '0.1.0-q1',
      exportedAt: new Date().toISOString(),
    };

    const jsonString = JSON.stringify(payload, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `q1_team_${(inputShortName || 'CST').toLowerCase()}_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target?.result as string);
        if (parsed.startingXI || parsed.bench) {
          onLoadFromFile(parsed);
          onClose();
        } else {
          alert('El archivo JSON no tiene un formato válido de Q1 Team.');
        }
      } catch (err) {
        alert('Error al leer el archivo JSON: ' + (err as Error).message);
      }
    };
    reader.readAsText(file);
  };

  const handleDeletePreset = async (presetId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('¿Seguro que deseas eliminar este equipo guardado?')) {
      await pesDatabase.deletePreset(presetId);
      await loadPresets();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-[#151518] border border-[#2c2c32] rounded-xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#2c2c32] bg-[#151518]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-[#00ff88]/10 border border-[#00ff88]/30 flex items-center justify-center text-[#00ff88]">
              {activeTab === 'SAVE' ? <Save className="w-4 h-4" /> : <FolderOpen className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="font-display font-bold text-sm text-white uppercase tracking-wide">
                {activeTab === 'SAVE' ? 'SAVE TEAM (Guardar)' : 'LOAD TEAM (Cargar)'}
              </h3>
              <p className="text-[11px] text-[#8e8e93]">
                Gestión de plantillas y exportación JSON para Q1 PES 2021
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Mode switch pills */}
            <div className="flex bg-[#1e1e22] border border-[#2c2c32] p-0.5 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setActiveTab('SAVE')}
                className={`px-3 py-1 rounded transition-all text-xs ${
                  activeTab === 'SAVE' ? 'bg-[#00ff88] text-[#0a0a0c] font-bold' : 'text-[#8e8e93] hover:text-white'
                }`}
              >
                Guardar
              </button>
              <button
                onClick={() => setActiveTab('LOAD')}
                className={`px-3 py-1 rounded transition-all text-xs ${
                  activeTab === 'LOAD' ? 'bg-[#00ff88] text-[#0a0a0c] font-bold' : 'text-[#8e8e93] hover:text-white'
                }`}
              >
                Cargar
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-[#8e8e93] hover:text-white hover:bg-[#2c2c32] rounded-md transition-colors ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {activeTab === 'SAVE' ? (
            /* SAVE TEAM TAB */
            <div className="space-y-4">
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2 space-y-1.5">
                    <label className="block text-[11px] font-semibold text-[#8e8e93] uppercase tracking-wider font-mono-code">
                      Nombre del Equipo
                    </label>
                    <input
                      type="text"
                      value={inputName}
                      onChange={(e) => setInputName(e.target.value)}
                      placeholder="Ej: Dream Team 90s, Argentina Histórica..."
                      className="w-full px-3.5 py-2 bg-[#0a0a0c] border border-[#2c2c32] focus:border-[#00ff88] rounded-lg text-white text-xs outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-semibold text-[#8e8e93] uppercase tracking-wider font-mono-code">
                      Abreviatura
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      value={inputShortName}
                      onChange={(e) => setInputShortName(e.target.value.toUpperCase())}
                      placeholder="Ej: CLS"
                      className="w-full px-3.5 py-2 bg-[#0a0a0c] border border-[#2c2c32] focus:border-[#00ff88] rounded-lg text-white text-xs uppercase font-mono-code outline-none text-center"
                    />
                  </div>
                </div>

                {/* Team summary preview */}
                <div className="bg-[#1e1e22] border border-[#2c2c32] rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-[#00ff88]/10 border border-[#00ff88]/30 flex items-center justify-center text-[#00ff88]">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-[#8e8e93] font-mono-code">Resumen de slots:</span>
                      <div className="flex items-center gap-3 text-xs font-semibold text-white mt-0.5">
                        <span>Titulares: {teamData.startingXI.filter(Boolean).length}/11</span>
                        <span>•</span>
                        <span>Suplentes: {teamData.bench.filter(Boolean).length}/15</span>
                      </div>
                    </div>
                  </div>

                  {saveSuccess && (
                    <div className="flex items-center gap-1.5 text-[#00ff88] text-[11px] font-mono-code bg-[#00ff88]/10 border border-[#00ff88]/30 px-2.5 py-1 rounded">
                      <Check className="w-3.5 h-3.5" />
                      <span>¡Guardado con éxito!</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-[#00ff88] hover:bg-[#00ff88]/90 text-[#0a0a0c] font-display font-bold text-xs rounded-lg transition-all shadow-[0_0_15px_rgba(0,255,136,0.3)] uppercase tracking-wider"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>GUARDAR PRESET LOCAL</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleExportJSON}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1e1e22] hover:bg-[#2c2c32] text-white font-display font-bold text-xs rounded-lg border border-[#2c2c32] transition-all uppercase tracking-wider"
                  >
                    <Download className="w-3.5 h-3.5 text-[#00ff88]" />
                    <span>DESCARGAR .JSON</span>
                  </button>
                </div>
              </form>

              {/* JSON preview snippet */}
              <div className="mt-4 pt-3 border-t border-[#2c2c32]">
                <div className="flex items-center justify-between text-xs text-[#8e8e93] mb-1.5 font-mono-code text-[10px]">
                  <span className="flex items-center gap-1.5">
                    <FileJson className="w-3 h-3 text-[#00ff88]" /> Formato de guardado (v0.1):
                  </span>
                  <span className="text-[#8e8e93]">Compatible con lector/escritor PES BIN</span>
                </div>
                <pre className="p-3 bg-[#0a0a0c] border border-[#2c2c32] rounded-lg text-[10px] font-mono-code text-[#00ff88]/80 overflow-x-auto max-h-24">
                  {JSON.stringify(
                    {
                      startingXI: teamData.startingXI.filter((id): id is number => id !== null).slice(0, 5),
                      bench: teamData.bench.filter((id): id is number => id !== null).slice(0, 4),
                      "...": "más jugadores..."
                    },
                    null,
                    2
                  )}
                </pre>
              </div>
            </div>
          ) : (
            /* LOAD TEAM TAB */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[#8e8e93] uppercase tracking-wider font-mono-code">
                  Equipos Disponibles y Presets ({presets.length})
                </span>

                {/* Import file button */}
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1e1e22] hover:bg-[#2c2c32] text-white rounded text-xs font-semibold border border-[#2c2c32] transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#00ff88]" />
                    <span>Importar archivo .JSON</span>
                  </button>
                </div>
              </div>

              {/* Preset Cards List */}
              <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                {presets.map((preset) => (
                  <div
                    key={preset.id}
                    onClick={() => {
                      onLoadPreset(preset);
                      onClose();
                    }}
                    className="group flex items-center justify-between p-3 rounded-lg bg-[#1e1e22] border border-[#2c2c32] hover:border-[#00ff88] transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded bg-[#0a0a0c] border border-[#2c2c32] group-hover:border-[#00ff88]/50 flex items-center justify-center text-[#00ff88] transition-colors">
                        <Shield className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xs text-white group-hover:text-[#00ff88] transition-colors uppercase">
                            {preset.name}
                          </h4>
                          {preset.id.startsWith('preset-legends') && (
                            <span className="text-[9px] font-mono-code px-1.5 py-0.2 bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/30 rounded">
                              OFICIAL
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#8e8e93] mt-0.5">{preset.description}</p>
                        <div className="flex items-center gap-3 text-[10px] text-[#8e8e93] font-mono-code mt-1">
                          <span>Titulares: {preset.startingXI.length}/11</span>
                          <span>•</span>
                          <span>Suplentes: {preset.bench.length}/15</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          onLoadPreset(preset);
                          onClose();
                        }}
                        className="px-3 py-1 bg-[#00ff88]/10 hover:bg-[#00ff88] text-[#00ff88] hover:text-[#0a0a0c] font-display font-bold text-[11px] rounded border border-[#00ff88]/30 transition-all uppercase tracking-wider"
                      >
                        CARGAR
                      </button>

                      {!preset.id.startsWith('preset-legends') && !preset.id.startsWith('preset-south') && !preset.id.startsWith('preset-blank') && (
                        <button
                          onClick={(e) => handleDeletePreset(preset.id, e)}
                          title="Eliminar plantilla"
                          className="p-1.5 text-[#8e8e93] hover:text-red-400 hover:bg-red-950/20 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-[#2c2c32] bg-[#151518] text-xs text-[#8e8e93] font-mono-code">
          <span className="text-[10px]">Presiona [Esc / O] para volver</span>
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
