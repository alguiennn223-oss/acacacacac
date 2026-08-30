import { Player, TeamData, BackupSnapshot, TeamPreset } from '../types';

/**
 * IPesDatabase
 * 
 * Future-proof interface for PES 2021 database providers.
 * Both MockPesDatabase (v0.1) and RealPesDatabase (v1.0) implement this interface.
 * The UI layer strictly consumes IPesDatabase and does not need to know the underlying implementation.
 */
export interface IPesDatabase {
  /**
   * Reads available players list
   */
  readPlayers(): Promise<Player[]>;

  /**
   * Search players by query string
   */
  searchPlayers(query: string): Promise<Player[]>;

  /**
   * Gets a player by unique ID
   */
  getPlayerById(id: number): Promise<Player | null>;

  /**
   * Reads saved team presets
   */
  readSavedPresets(): Promise<TeamPreset[]>;

  /**
   * Saves team data into local preset/storage
   */
  saveTeam(presetName: string, teamData: TeamData, description?: string): Promise<TeamPreset>;

  /**
   * Deletes a preset by ID
   */
  deletePreset(id: string): Promise<boolean>;

  /**
   * Backups management
   */
  createBackup(description: string, teamData: TeamData): Promise<BackupSnapshot>;
  readBackups(): Promise<BackupSnapshot[]>;
  restoreBackup(backupId: string): Promise<TeamData | null>;

  /**
   * Provider identifier & metadata
   */
  getProviderName(): string;
  isRealPesConnected(): boolean;
}
