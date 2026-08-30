import { IPesDatabase } from './IPesDatabase';
import { Player, TeamData, TeamPreset, BackupSnapshot } from '../types';
import { MOCK_PLAYERS, INITIAL_PRESETS } from '../data/mockPlayers';

const PRESETS_STORAGE_KEY = 'q1_pes2021_team_presets_v1';
const BACKUPS_STORAGE_KEY = 'q1_pes2021_backups_v1';

export class MockPesDatabase implements IPesDatabase {
  private players: Player[] = [...MOCK_PLAYERS];

  constructor() {
    this.initStorage();
  }

  private initStorage() {
    if (typeof window !== 'undefined' && window.localStorage) {
      if (!localStorage.getItem(PRESETS_STORAGE_KEY)) {
        const initialWithTimestamps: TeamPreset[] = INITIAL_PRESETS.map((p) => ({
          ...p,
          createdAt: new Date().toISOString(),
        }));
        localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(initialWithTimestamps));
      }
      if (!localStorage.getItem(BACKUPS_STORAGE_KEY)) {
        localStorage.setItem(BACKUPS_STORAGE_KEY, JSON.stringify([]));
      }
    }
  }

  public async readPlayers(): Promise<Player[]> {
    // Simulate brief asynchronous DB fetch
    return new Promise((resolve) => {
      setTimeout(() => resolve([...this.players]), 50);
    });
  }

  public async searchPlayers(query: string): Promise<Player[]> {
    const q = query.trim().toLowerCase();
    if (!q) return this.readPlayers();

    return this.players.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.nationality.toLowerCase().includes(q) ||
        p.nationalityCode.toLowerCase().includes(q) ||
        p.preferredPosition.toLowerCase().includes(q) ||
        p.year.toString().includes(q) ||
        p.overallRating.toString().includes(q)
    );
  }

  public async getPlayerById(id: number): Promise<Player | null> {
    const found = this.players.find((p) => p.id === id);
    return found || null;
  }

  public async readSavedPresets(): Promise<TeamPreset[]> {
    try {
      const stored = localStorage.getItem(PRESETS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback
    }
    return INITIAL_PRESETS.map((p) => ({ ...p, createdAt: new Date().toISOString() }));
  }

  public async saveTeam(presetName: string, teamData: TeamData, description: string = 'Guardado desde Q1'): Promise<TeamPreset> {
    const presets = await this.readSavedPresets();
    const newPreset: TeamPreset = {
      id: 'preset-' + Date.now(),
      name: presetName.trim() || 'Equipo Personalizado',
      description,
      startingXI: teamData.startingXI.filter((id): id is number => id !== null),
      bench: teamData.bench.filter((id): id is number => id !== null),
      createdAt: new Date().toISOString(),
    };

    presets.unshift(newPreset);
    try {
      localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(presets));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }

    return newPreset;
  }

  public async deletePreset(id: string): Promise<boolean> {
    const presets = await this.readSavedPresets();
    const filtered = presets.filter((p) => p.id !== id);
    try {
      localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(filtered));
      return true;
    } catch {
      return false;
    }
  }

  public async createBackup(description: string, teamData: TeamData): Promise<BackupSnapshot> {
    const backups = await this.readBackups();
    const snapshot: BackupSnapshot = {
      id: 'backup-' + Date.now(),
      timestamp: new Date().toISOString(),
      description: description || `Backup de equipo (${new Date().toLocaleTimeString()})`,
      teamData: JSON.parse(JSON.stringify(teamData)),
      author: 'Q1 User',
    };

    backups.unshift(snapshot);
    if (backups.length > 20) {
      backups.splice(20); // Keep last 20 backups
    }

    try {
      localStorage.setItem(BACKUPS_STORAGE_KEY, JSON.stringify(backups));
    } catch (e) {
      console.warn('LocalStorage backup error:', e);
    }

    return snapshot;
  }

  public async readBackups(): Promise<BackupSnapshot[]> {
    try {
      const stored = localStorage.getItem(BACKUPS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback
    }
    return [];
  }

  public async restoreBackup(backupId: string): Promise<TeamData | null> {
    const backups = await this.readBackups();
    const found = backups.find((b) => b.id === backupId);
    return found ? found.teamData : null;
  }

  public getProviderName(): string {
    return 'MockPesDatabase (Simulación v0.1)';
  }

  public isRealPesConnected(): boolean {
    return false;
  }
}
