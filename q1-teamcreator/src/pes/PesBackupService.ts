import { BackupSnapshot, TeamData } from '../types';
import { IPesDatabase } from './IPesDatabase';

export class PesBackupService {
  private db: IPesDatabase;

  constructor(db: IPesDatabase) {
    this.db = db;
  }

  public setDatabaseProvider(db: IPesDatabase) {
    this.db = db;
  }

  public async createSnapshot(teamData: TeamData, description: string = 'Snapshot de equipo'): Promise<BackupSnapshot> {
    return this.db.createBackup(description, teamData);
  }

  public async getHistory(): Promise<BackupSnapshot[]> {
    return this.db.readBackups();
  }

  public async restore(backupId: string): Promise<TeamData | null> {
    return this.db.restoreBackup(backupId);
  }

  /**
   * Export backup snapshot to a downloadable JSON file
   */
  public exportBackupToFile(snapshot: BackupSnapshot) {
    const jsonStr = JSON.stringify(snapshot, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `q1_team_backup_${snapshot.timestamp.replace(/[:.]/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
