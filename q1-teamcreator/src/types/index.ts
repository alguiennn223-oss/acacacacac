/**
 * Q1 Team Creator - Types & Interfaces
 * Designed for PES 2021 Team & Player Management
 */

export interface Player {
  id: number;
  name: string;
  year: number;
  nationality: string;
  nationalityCode: string;
  overallRating: number;
  preferredPosition: string; // purely metadata/informational, not enforced
  faceUrl?: string;
  heightCm?: number;
  strongFoot?: 'Right' | 'Left' | 'Both';
  isLegend?: boolean;
}

export interface SlotItem {
  slotNumber: number; // 1 to 11 for Starting XI, 1 to 15 for Bench
  player: Player | null;
}

export type TabMode = 'STARTING_XI' | 'BENCH';

export interface TeamData {
  id?: string;
  name: string;
  shortName: string;
  managerName?: string;
  stadiumName?: string;
  startingXI: (number | null)[]; // Array of player IDs (length 11)
  bench: (number | null)[]; // Array of player IDs (length 15)
  savedAt?: string;
  version?: string;
}

export interface TeamPreset {
  id: string;
  name: string;
  description: string;
  startingXI: number[];
  bench: number[];
  createdAt: string;
}

export interface BackupSnapshot {
  id: string;
  timestamp: string;
  description: string;
  teamData: TeamData;
  author?: string;
}

export interface NavigationState {
  currentTab: TabMode;
  startingXICursorIndex: number; // 0 to 10
  benchCursorIndex: number; // 0 to 14
  isModalOpen: boolean;
  activeModal: 'PLAYER_SELECTOR' | 'SAVE_LOAD' | 'BACKUP' | 'CSHARP_CODE' | 'HELP' | null;
  selectedSlotIndex: number | null;
  selectedSlotTab: TabMode | null;
}

export interface GamepadButtonState {
  connected: boolean;
  gamepadId: string;
  lastButtonPressed: string | null;
}
