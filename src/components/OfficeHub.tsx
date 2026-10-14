import React from 'react';
import {
  Lock,
  CheckCircle2,
  Sparkles,
  Coffee,
  Briefcase,
  Users,
  Award,
  Camera,
  Eye,
  Heart,
  DoorOpen,
  Key,
} from 'lucide-react';
import { RoomId, RoomInfo } from '../types/game';
import { sound } from '../utils/sound';

interface OfficeHubProps {
  completedRooms: RoomId[];
  onSelectRoom: (roomId: RoomId) => void;
  activeRoom: RoomId | null;
}

export const ROOMS_CONFIG: RoomInfo[] = [
  {
    id: 'living_area',
    number: 1,
    name: 'Living Area',
    subtitle: 'Great Characteristic of an Employee',
    theme: 'Finding Sticky Notes & Tools',
    icon: 'briefcase',
    description: 'Explore the room scene, collect tools, uncover 8 sticky notes & pin them to spell the hidden word.',
    isCompleted: false,
    keyName: 'Characteristic Key',
    imageUrl: '/rooms/living_room.jpg',
  },
  {
    id: 'pantry_room',
    number: 2,
    name: 'Pantry Room',
    subtitle: 'Attitude of an Employee',
    theme: 'Logical Questions & 10 Keys',
    icon: 'coffee',
    description: 'Answer 10 workplace attitude questions hidden in kitchen appliances to collect 10 keys.',
    isCompleted: false,
    keyName: 'Pantry Key (10 Keys)',
    imageUrl: '/rooms/pantry_room.jpg',
  },
  {
    id: 'meeting_room',
    number: 3,
    name: 'Meeting Room',
    subtitle: 'Responsibility of an Employee',
    theme: '10 Picture Rebuses & Final Responsibility',
    icon: 'users',
    description: 'Decipher tricky visual rebuses and declare your core employee responsibility.',
    isCompleted: false,
    keyName: 'Responsibility Key',
    imageUrl: '/rooms/meeting_room.jpg',
  },
  {
    id: 'ceo_office',
    number: 4,
    name: 'CEO Office',
    subtitle: 'Excellence of Employee',
    theme: 'Employee Recognition Awards',
    icon: 'award',
    description: 'Honor your coworkers by awarding excellence certificates to unlock the executive door.',
    isCompleted: false,
    keyName: 'Executive Gold Key',
    imageUrl: '/rooms/ceo_office.jpg',
  },
  {
    id: 'break_room',
    number: 5,
    name: 'Break Room',
    subtitle: 'Cooperation',
    theme: 'QR Code & Team Pose Synergy',
    icon: 'camera',
    description: 'Scan the team QR code, match the energetic celebration pose with your camera to unlock.',
    isCompleted: false,
    keyName: 'Synergy Key',
    imageUrl: '/rooms/break_room.jpg',
  },
  {
    id: 'sleeping_room',
    number: 6,
    name: 'Sleeping Room',
    subtitle: 'Observation',
    theme: 'Spot the 10 Differences',
    icon: 'eye',
    description: 'Carefully compare the office workstation scenes to locate all 10 hidden differences.',
    isCompleted: false,
    keyName: 'Observation Key',
    imageUrl: '/rooms/sleeping_room.jpg',
  },
  {
    id: 'special_room',
    number: 7,
    name: 'Special Room',
    subtitle: 'Relationship',
    theme: '8 Teammates Sharing (20s Each)',
    icon: 'heart',
    description: '8 team members share authentic appreciation for 20 seconds each to open the vault.',
    isCompleted: false,
    keyName: 'Harmony Key',
    imageUrl: '/rooms/special_room.jpg',
  },
  {
    id: 'main_door',
    number: 8,
    name: 'Main Vault Exit',
    subtitle: 'Office Code & Final Escape',
    theme: 'Master Code Verification',
    icon: 'doorOpen',
    description: 'Assemble all clues gathered from the office, enter the final master passcode, and escape!',
    isCompleted: false,
    keyName: 'Master Exit Clearance',
    imageUrl: '/rooms/main_vault.jpg',
  },
];

export const OfficeHub: React.FC<OfficeHubProps> = ({
  completedRooms,
  onSelectRoom,
}) => {
  const getRoomIcon = (iconName: string) => {
    switch (iconName) {
      case 'briefcase':
        return <Briefcase className="w-4 h-4 text-[#251B35]" />;
      case 'coffee':
        return <Coffee className="w-4 h-4 text-[#251B35]" />;
      case 'users':
        return <Users className="w-4 h-4 text-[#251B35]" />;
      case 'award':
        return <Award className="w-4 h-4 text-[#251B35]" />;
      case 'camera':
        return <Camera className="w-4 h-4 text-[#251B35]" />;
      case 'eye':
        return <Eye className="w-4 h-4 text-[#251B35]" />;
      case 'heart':
        return <Heart className="w-4 h-4 text-[#FEAEC9] fill-[#FEAEC9]" />;
      case 'doorOpen':
        return <DoorOpen className="w-4 h-4 text-amber-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-[#251B35]" />;
    }
  };

  const handleRoomClick = (roomId: RoomId) => {
    sound.click();
    onSelectRoom(roomId);
  };

  const allPreliminaryDone = completedRooms.filter((r) => r !== 'main_door').length >= 7;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hallway Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#9AD9EA]/30 text-xs font-bold text-[#251B35] mb-2 border border-[#9AD9EA]">
          <Sparkles className="w-3.5 h-3.5 text-[#FEAEC9]" />
          <span>CARECOR OFFICE HALLWAY</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-[#251B35]">
          Select an Office Door to Enter
        </h2>
        <p className="text-sm text-[#251B35]/70 max-w-xl mx-auto mt-1 font-medium">
          Choose any room to begin. <strong>Rule:</strong> Once you enter a room, you must complete it to earn its key before selecting another door!
        </p>
      </div>

      {/* Progress meter */}
      <div className="bg-white/90 backdrop-blur-sm border-2 border-[#C7BFE8] rounded-2xl p-4 mb-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FEAEC9] flex items-center justify-center font-black text-[#251B35] shadow-sm">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-[#251B35]">
              Escape Keys Collected: {completedRooms.length} / 7
            </div>
            <div className="text-xs text-[#251B35]/60">
              {allPreliminaryDone
                ? 'All 7 Room Keys Unlocked! The Main Exit Door is ready!'
                : 'Solve preliminary rooms to uncover clues for the Master Exit Door'}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full sm:w-64 bg-[#E8E0EE] h-3 rounded-full overflow-hidden border border-[#C7BFE8]">
          <div
            className="h-full bg-gradient-to-r from-[#FEAEC9] via-[#C7BFE8] to-[#9AD9EA] transition-all duration-500"
            style={{ width: `${Math.min(100, (completedRooms.length / 7) * 100)}%` }}
          />
        </div>
      </div>

      {/* Doors Grid with Room Images */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {ROOMS_CONFIG.map((room) => {
          const isCompleted = completedRooms.includes(room.id);
          const isMainDoor = room.id === 'main_door';
          const canAccessMainDoor = allPreliminaryDone;

          return (
            <div
              key={room.id}
              onClick={() => handleRoomClick(room.id)}
              className={`group cursor-pointer relative bg-white rounded-3xl border-2 transition-all duration-300 p-4 flex flex-col justify-between shadow-sm hover:shadow-xl overflow-hidden ${
                isCompleted
                  ? 'border-emerald-300 bg-emerald-50/30'
                  : isMainDoor
                  ? canAccessMainDoor
                    ? 'border-amber-400 bg-amber-50/30 hover:border-amber-500 hover:-translate-y-1 ring-2 ring-amber-300/50'
                    : 'border-slate-300 bg-slate-50/70 hover:border-slate-400'
                  : 'border-[#C7BFE8] hover:border-[#FEAEC9] hover:-translate-y-1'
              }`}
            >
              <div>
                {/* Header status bar */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#E8E0EE] flex items-center justify-center font-bold text-xs text-[#251B35] border border-[#C7BFE8]">
                    #{room.number}
                  </div>
                  {isCompleted ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Completed
                    </span>
                  ) : isMainDoor && !canAccessMainDoor ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
                      <Lock className="w-3 h-3" />
                      Locked
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-[#251B35]/70 bg-[#9AD9EA]/25 px-2.5 py-0.5 rounded-full border border-[#9AD9EA]/40">
                      Available
                    </span>
                  )}
                </div>

                {/* Real Room Image Preview */}
                <div className="relative h-36 w-full rounded-2xl overflow-hidden border border-[#C7BFE8] mb-3 group-hover:border-[#FEAEC9] transition-all shadow-xs">
                  {room.imageUrl ? (
                    <img
                      src={room.imageUrl}
                      alt={room.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : null}

                  {/* Gradient Overlay & Room Badge */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#251B35]/80 via-transparent to-transparent flex flex-col justify-between p-2.5">
                    <div className="self-start p-1.5 rounded-lg bg-white/90 backdrop-blur-xs shadow-xs">
                      {getRoomIcon(room.icon)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-white tracking-wide uppercase drop-shadow-sm">
                        {room.name}
                      </span>
                      {isCompleted && (
                        <Key className="w-4 h-4 text-amber-400 fill-amber-300 animate-bounce" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-[11px] font-bold text-purple-700 mb-0.5 uppercase tracking-wider">
                  {room.subtitle}
                </div>
                <div className="text-xs font-extrabold text-[#251B35] mb-1">
                  {room.theme}
                </div>
                <p className="text-[11px] text-[#251B35]/70 leading-relaxed line-clamp-2">
                  {room.description}
                </p>
              </div>

              {/* Action Button at bottom */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-[#251B35] group-hover:text-purple-700 transition-colors flex items-center gap-1">
                  {isCompleted ? 'Re-inspect' : 'Enter Door'} &rarr;
                </span>
                {isCompleted && (
                  <span className="text-[10px] font-semibold text-emerald-700">
                    Key Unlocked
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
