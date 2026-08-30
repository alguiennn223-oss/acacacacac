import { Player, SlotItem, TeamData } from '../types';

export class TeamModel {
  public static readonly STARTING_XI_SIZE = 11;
  public static readonly BENCH_SIZE = 15;

  private _name: string = 'Custom PES Team';
  private _shortName: string = 'CST';
  private _startingXI: (Player | null)[] = Array(TeamModel.STARTING_XI_SIZE).fill(null);
  private _bench: (Player | null)[] = Array(TeamModel.BENCH_SIZE).fill(null);

  constructor(name: string = 'Custom PES Team', shortName: string = 'CST') {
    this._name = name;
    this._shortName = shortName;
  }

  public get name(): string {
    return this._name;
  }

  public set name(value: string) {
    this._name = value.trim() || 'Custom PES Team';
  }

  public get shortName(): string {
    return this._shortName;
  }

  public set shortName(value: string) {
    this._shortName = value.trim().substring(0, 4).toUpperCase() || 'CST';
  }

  public get startingXISlots(): SlotItem[] {
    return this._startingXI.map((player, index) => ({
      slotNumber: index + 1,
      player,
    }));
  }

  public get benchSlots(): SlotItem[] {
    return this._bench.map((player, index) => ({
      slotNumber: index + 1,
      player,
    }));
  }

  public get allPlayers(): Player[] {
    const list: Player[] = [];
    for (const p of this._startingXI) {
      if (p) list.push(p);
    }
    for (const p of this._bench) {
      if (p) list.push(p);
    }
    return list;
  }

  public get usedPlayerIds(): Set<number> {
    const ids = new Set<number>();
    for (const p of this.allPlayers) {
      ids.add(p.id);
    }
    return ids;
  }

  public isPlayerUsed(playerId: number): boolean {
    return this.usedPlayerIds.has(playerId);
  }

  public getPlayerSlotInfo(playerId: number): { tab: 'STARTING_XI' | 'BENCH'; slotNumber: number } | null {
    const startingIndex = this._startingXI.findIndex((p) => p && p.id === playerId);
    if (startingIndex !== -1) {
      return { tab: 'STARTING_XI', slotNumber: startingIndex + 1 };
    }
    const benchIndex = this._bench.findIndex((p) => p && p.id === playerId);
    if (benchIndex !== -1) {
      return { tab: 'BENCH', slotNumber: benchIndex + 1 };
    }
    return null;
  }

  /**
   * Set or replace player in Starting XI
   * @param slotIndex 0-indexed (0 to 10)
   * @param player Player object or null to remove
   */
  public setStartingXIPlayer(slotIndex: number, player: Player | null): boolean {
    if (slotIndex < 0 || slotIndex >= TeamModel.STARTING_XI_SIZE) {
      return false;
    }

    if (player) {
      // Check if already used in another slot
      const existingInfo = this.getPlayerSlotInfo(player.id);
      if (existingInfo && !(existingInfo.tab === 'STARTING_XI' && existingInfo.slotNumber === slotIndex + 1)) {
        return false; // Prevent duplicate
      }
    }

    this._startingXI[slotIndex] = player;
    return true;
  }

  /**
   * Set or replace player in Bench
   * @param slotIndex 0-indexed (0 to 14)
   * @param player Player object or null to remove
   */
  public setBenchPlayer(slotIndex: number, player: Player | null): boolean {
    if (slotIndex < 0 || slotIndex >= TeamModel.BENCH_SIZE) {
      return false;
    }

    if (player) {
      const existingInfo = this.getPlayerSlotInfo(player.id);
      if (existingInfo && !(existingInfo.tab === 'BENCH' && existingInfo.slotNumber === slotIndex + 1)) {
        return false; // Prevent duplicate
      }
    }

    this._bench[slotIndex] = player;
    return true;
  }

  /**
   * Remove player by slot index
   */
  public removePlayer(tab: 'STARTING_XI' | 'BENCH', slotIndex: number): void {
    if (tab === 'STARTING_XI' && slotIndex >= 0 && slotIndex < TeamModel.STARTING_XI_SIZE) {
      this._startingXI[slotIndex] = null;
    } else if (tab === 'BENCH' && slotIndex >= 0 && slotIndex < TeamModel.BENCH_SIZE) {
      this._bench[slotIndex] = null;
    }
  }

  /**
   * Clears all players from Starting XI and Bench
   */
  public clearAll(): void {
    this._startingXI = Array(TeamModel.STARTING_XI_SIZE).fill(null);
    this._bench = Array(TeamModel.BENCH_SIZE).fill(null);
  }

  /**
   * Export to standard Q1 PES format JSON
   */
  public toJSON(): TeamData {
    return {
      name: this._name,
      shortName: this._shortName,
      startingXI: this._startingXI.map((p) => (p ? p.id : null)),
      bench: this._bench.map((p) => (p ? p.id : null)),
      savedAt: new Date().toISOString(),
      version: '0.1.0-q1',
    };
  }

  /**
   * Populate team from player database and JSON data
   */
  public loadFromJSON(data: TeamData, playerDatabase: Player[]): void {
    if (data.name) this._name = data.name;
    if (data.shortName) this._shortName = data.shortName;

    const playerMap = new Map<number, Player>();
    playerDatabase.forEach((p) => playerMap.set(p.id, p));

    this._startingXI = Array(TeamModel.STARTING_XI_SIZE).fill(null);
    if (Array.isArray(data.startingXI)) {
      data.startingXI.slice(0, TeamModel.STARTING_XI_SIZE).forEach((id, idx) => {
        if (id && playerMap.has(id)) {
          this._startingXI[idx] = playerMap.get(id)!;
        }
      });
    }

    this._bench = Array(TeamModel.BENCH_SIZE).fill(null);
    if (Array.isArray(data.bench)) {
      data.bench.slice(0, TeamModel.BENCH_SIZE).forEach((id, idx) => {
        if (id && playerMap.has(id)) {
          this._bench[idx] = playerMap.get(id)!;
        }
      });
    }
  }

  /**
   * Computed team statistics
   */
  public getStats() {
    const startingPlayers = this._startingXI.filter((p): p is Player => p !== null);
    const benchPlayers = this._bench.filter((p): p is Player => p !== null);
    const totalCount = startingPlayers.length + benchPlayers.length;

    const startingAvg = startingPlayers.length
      ? Math.round(startingPlayers.reduce((acc, p) => acc + p.overallRating, 0) / startingPlayers.length)
      : 0;

    const totalAvg = totalCount
      ? Math.round((startingPlayers.concat(benchPlayers)).reduce((acc, p) => acc + p.overallRating, 0) / totalCount)
      : 0;

    const nationalities = new Set<string>();
    this.allPlayers.forEach((p) => nationalities.add(p.nationality));

    return {
      startingCount: startingPlayers.length,
      benchCount: benchPlayers.length,
      totalCount,
      startingAvg,
      totalAvg,
      nationalitiesCount: nationalities.size,
      isStartingComplete: startingPlayers.length === TeamModel.STARTING_XI_SIZE,
      isBenchComplete: benchPlayers.length === TeamModel.BENCH_SIZE,
    };
  }
}
