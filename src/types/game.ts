export type RoomId =
  | 'living_area'
  | 'pantry_room'
  | 'meeting_room'
  | 'ceo_office'
  | 'break_room'
  | 'sleeping_room'
  | 'special_room'
  | 'main_door';

export interface RoomInfo {
  id: RoomId;
  number: number;
  name: string;
  subtitle: string;
  theme: string;
  icon: string;
  description: string;
  isCompleted: boolean;
  keyName: string;
  imageUrl?: string;
}

export interface InventoryItem {
  id: 'hammer' | 'scissors' | 'water';
  name: string;
  icon: string;
  description: string;
}

export interface StickyNote {
  id: string;
  colorName: string;
  letter: string;
  colorHex: string;
  pinColorHex: string;
  found: boolean;
  pinned: boolean;
  source: string;
}

export interface PantryQuestion {
  id: number;
  item: string;
  question: string;
  answer: string;
  keyNumber: number;
  clue: string;
  icon: string;
}

export interface RebusPuzzle {
  id: number;
  title: string;
  answer: string;
  visualClues: {
    emoji: string;
    label: string;
  }[];
  hint: string;
}

export interface DifferencePoint {
  id: number;
  title: string;
  xPercent: number; // 0 - 100
  yPercent: number; // 0 - 100
  radiusPercent: number;
  description: string;
}

export interface EmployeeAwardRecord {
  employee: string;
  award: string;
  message: string;
  timestamp: string;
}

export interface AppreciationRecord {
  recipient: string;
  message: string;
  secondsElapsed: number;
  timestamp: string;
}

export const EMPLOYEES = [
  'Evan',
  'Jane',
  'Lew',
  'Kay',
  'Jessamin',
  'Ian',
  'Nikko',
  'Jessa',
  'Zay',
  'Krisha',
  'Catherine',
  'Honna',
  'Tem',
  'Brenth',
  'Geanna',
  'Klien',
  'John Andrei',
] as const;

export const AWARDS = [
  'Reliable',
  'Helpful',
  'Cheerful',
  'Responsible',
  'Punctual',
  'Hardworking',
  'Honest',
  'Creative',
  'Patient',
  'Respectful',
  'Dedicated',
  'Friendly',
  'Empathetic',
  'Efficient',
  'Cooperative',
  'Organized',
  'Motivated',
  'Trustworthy',
  'Optimistic',
  'Outstanding',
] as const;
