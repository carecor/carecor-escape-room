import React from 'react';
import { Volume2, VolumeX, Key, RotateCcw, HelpCircle, ArrowLeft } from 'lucide-react';
import { RoomId } from '../types/game';

interface HeaderProps {
  elapsedSeconds: number;
  currentRoom: RoomId | null;
  completedRooms: RoomId[];
  isMuted: boolean;
  isGameOver?: boolean;
  onToggleSound: () => void;
  onReset: () => void;
  onReturnToHub: () => void;
  onOpenHelp: () => void;
  onExitGame?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  elapsedSeconds,
  currentRoom,
  completedRooms,
  isMuted,
  isGameOver = false,
  onToggleSound,
  onReset,
  onReturnToHub,
  onOpenHelp,
  onExitGame,
}) => {
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getRoomTitle = (id: RoomId | null) => {
    switch (id) {
      case 'living_area':
        return 'Room 1: Living Area (Great Characteristic)';
      case 'pantry_room':
        return 'Room 2: Pantry Room (Attitude of an Employee)';
      case 'meeting_room':
        return 'Room 3: Meeting Room (Responsibility of an Employee)';
      case 'ceo_office':
        return 'Room 4: CEO Office (Excellence of Employee)';
      case 'break_room':
        return 'Room 5: Break Room (Cooperation)';
      case 'sleeping_room':
        return 'Room 6: Sleeping Room (Observation)';
      case 'special_room':
        return 'Room 7: Special Room (Relationship)';
      case 'main_door':
        return 'Final Exit: Main Vault Door';
      default:
        return 'Office Hallway';
    }
  };

  const isCurrentRoomCompleted = currentRoom && completedRooms.includes(currentRoom);

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-[#C7BFE8] px-4 py-3 sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Room Title */}
        <div className="flex items-center gap-3">
          {currentRoom && (
            <button
              onClick={onReturnToHub}
              className={`p-2 rounded-lg border text-sm font-medium transition flex items-center gap-1.5 ${
                isCurrentRoomCompleted
                  ? 'bg-[#9AD9EA]/20 hover:bg-[#9AD9EA]/40 text-[#251B35] border-[#9AD9EA]'
                  : 'bg-white hover:bg-slate-100 text-[#251B35]/70 border-[#C7BFE8]'
              }`}
              title={isCurrentRoomCompleted ? 'Return to Hallway' : 'Hallway (Room not completed yet)'}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Hallway</span>
            </button>
          )}

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-wider text-sm sm:text-base text-[#251B35]">
                CARECOR OFFICE
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#FEAEC9] text-[#251B35] font-semibold">
                ESCAPE CHALLENGE
              </span>
            </div>
            <div className="text-xs text-[#251B35]/70 font-medium">
              {getRoomTitle(currentRoom)}
            </div>
          </div>
        </div>

        {/* Status Tracker & Tools */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Keys Progress */}
          <div className="flex items-center gap-1.5 bg-[#E8E0EE] px-3 py-1.5 rounded-lg border border-[#C7BFE8]">
            <Key className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span className="text-xs font-bold text-[#251B35]">
              {completedRooms.length} / 7
            </span>
            <span className="text-xs text-[#251B35]/60 hidden md:inline">Keys</span>
          </div>

          {/* Master Timer */}
          <div className="flex items-center gap-1.5 bg-[#9AD9EA]/25 px-3 py-1.5 rounded-lg border border-[#9AD9EA] font-mono font-bold text-sm text-[#251B35]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{formatTime(elapsedSeconds)}</span>
          </div>

          {/* Audio toggle */}
          <button
            onClick={onToggleSound}
            className="p-2 rounded-lg bg-white hover:bg-[#E8E0EE] text-[#251B35] border border-[#C7BFE8] transition"
            aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}
            title={isMuted ? 'Sound Muted' : 'Sound Enabled'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4 text-[#251B35]" />}
          </button>

          {/* Instructions Help */}
          <button
            onClick={onOpenHelp}
            className="p-2 rounded-lg bg-white hover:bg-[#E8E0EE] text-[#251B35] border border-[#C7BFE8] transition"
            title="Game Instructions & Rules"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Reset */}
          <button
            onClick={onReset}
            className="p-2 rounded-lg bg-white hover:bg-rose-50 text-rose-600 border border-[#FEAEC9] transition"
            title="Reset Game"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Exit Game Button (Visible if game completed or requested) */}
          {onExitGame && (
            <button
              onClick={onExitGame}
              className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                isGameOver
                  ? 'bg-rose-500 hover:bg-rose-600 text-white border-rose-600 shadow-sm animate-pulse'
                  : 'bg-white hover:bg-rose-50 text-rose-700 border-rose-300'
              }`}
              title="Exit Game & Sign Out"
            >
              <span>🚪 Exit</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
