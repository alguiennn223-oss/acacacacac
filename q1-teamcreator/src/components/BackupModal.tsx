import React, { useState, useEffect } from 'react';
import { BackupSnapshot, TeamData } from '../types';
import { PesBackupService } from '../pes/PesBackupService';
import { History, Shield, RotateCcw, Plus, Download, X, Clock, Check } from 'lucide-react';

interface BackupModalProps {
  isOpen: boolean;
  backupService: PesBackupService;
  currentTeamData: TeamData;
  onRestoreTeam: (data: TeamData) => void;
  onClose: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  backupService,
  currentTeamData,
  onRestoreTeam,
  onClose,
}) => {
  const [backups, setBackups] = useState<BackupSnapshot[]>([]);
  const [newDesc, setNewDesc] = useState<string>('');
  const [createdSuccess, setCreatedSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      loadBackups();
    }
  }, [isOpen]);

  const loadBackups = async () => {
    const list = await backupService.getHistory();
    setBackups(list);
  };

  const handleCreateSnapshot = async (e: React.FormEvent) => {
    e.preventDefault();
    await backupService.createSnapshot(
      currentTeamData,
      newDesc.trim() || `Snapshot Manual (${new Date().toLocaleTimeString()})`
    );
    setNewDesc('');
    setCreatedSuccess(true);
    await loadBackups();
    setTimeout(() => setCreatedSuccess(false), 2000);
  };

  const handleRestore = async (backup: BackupSnapshot) => {
    if (window.confirm(`¿Deseas restaurar el backup "${backup.description}"? Los cambios no guardados se sobreescribirán.`)) {
      const data = await backupService.restore(backup.id);
      if (data) {
        onRestoreTeam(data);
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-[#151518] border border-[#2c2c32] rounded-xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#2c2c32] bg-[#151518]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-[#00ff88]/10 border border-[#00ff88]/30 flex items-center justify-center text-[#00ff88]">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm text-white uppercase tracking-wide">
                BACKUPS & HISTORIAL (PES 2021)
              </h3>
              <p className="text-[11px] text-[#8e8e93]">
                Puntos de restauración y copias de seguridad de plantillas
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

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Create new snapshot form */}
          <form onSubmit={handleCreateSnapshot} className="bg-[#1e1e22] border border-[#2c2c32] rounded-lg p-3.5 space-y-2.5">
            <span className="text-[11px] font-semibold text-white uppercase tracking-wider font-mono-code flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-[#00ff88]" /> Crear Snapshot Inmediato
            </span>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Descripción (ej: Previo al torneo, Prueba táctica...)"
                className="flex-1 px-3.5 py-1.5 bg-[#0a0a0c] border border-[#2c2c32] focus:border-[#00ff88] rounded-lg text-white text-xs outline-none"
              />
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-[#00ff88] hover:bg-[#00ff88]/90 text-[#0a0a0c] font-display font-bold text-xs rounded-lg transition-all shadow-[0_0_12px_rgba(0,255,136,0.25)] whitespace-nowrap uppercase tracking-wider"
              >
                CREAR SNAPSHOT
              </button>
            </div>

            {createdSuccess && (
              <div className="flex items-center gap-1.5 text-[#00ff88] text-[11px] font-mono-code">
                <Check className="w-3.5 h-3.5" /> Punto de restauración creado con éxito.
              </div>
            )}
          </form>

          {/* Backups List */}
          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-[#8e8e93] uppercase tracking-wider font-mono-code">
              Snapshots Guardados ({backups.length})
            </span>

            {backups.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-[#2c2c32] rounded-lg bg-[#0a0a0c]/40">
                <Clock className="w-6 h-6 text-[#8e8e93] mx-auto mb-1.5" />
                <p className="text-xs text-white">No hay copias de seguridad todavía.</p>
                <p className="text-[10px] text-[#8e8e93] mt-0.5">Crea tu primer snapshot con el formulario superior.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                {backups.map((snap) => (
                  <div
                    key={snap.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-[#1e1e22] border border-[#2c2c32] hover:border-[#8e8e93]/50 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-[#0a0a0c] border border-[#2c2c32] flex items-center justify-center text-[#00ff88]">
                        <Shield className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-white uppercase">{snap.description}</h4>
                        <div className="flex items-center gap-2 text-[10px] text-[#8e8e93] font-mono-code mt-0.5">
                          <span>{new Date(snap.timestamp).toLocaleString()}</span>
                          <span>•</span>
                          <span>{snap.teamData.name} ({snap.teamData.shortName})</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => backupService.exportBackupToFile(snap)}
                        title="Exportar archivo de backup"
                        className="p-1.5 text-[#8e8e93] hover:text-[#00ff88] hover:bg-[#2c2c32] rounded transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleRestore(snap)}
                        className="flex items-center gap-1 px-3 py-1 bg-[#00ff88]/10 hover:bg-[#00ff88] text-[#00ff88] hover:text-[#0a0a0c] font-display font-bold text-xs rounded border border-[#00ff88]/30 transition-all uppercase tracking-wider"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>RESTAURAR</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-[#2c2c32] bg-[#151518] text-xs text-[#8e8e93] font-mono-code">
          <span className="text-[10px]">Preparado para backups físicos de EDIT00000000</span>
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
