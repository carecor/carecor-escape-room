/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { WelcomeDoor } from './components/WelcomeDoor';
import { Header } from './components/Header';
import { OfficeHub } from './components/OfficeHub';
import { InventoryBar } from './components/InventoryBar';
import { HelpModal } from './components/HelpModal';
import { LivingArea } from './components/rooms/LivingArea';
import { PantryRoom } from './components/rooms/PantryRoom';
import { MeetingRoom } from './components/rooms/MeetingRoom';
import { CeoOffice } from './components/rooms/CeoOffice';
import { BreakRoom } from './components/rooms/BreakRoom';
import { SleepingRoom } from './components/rooms/SleepingRoom';
import { SpecialRoom } from './components/rooms/SpecialRoom';
import { MainDoorExit } from './components/rooms/MainDoorExit';
import { RoomId, InventoryItem } from './types/game';
import { sound } from './utils/sound';
import { CheckCircle2, Clock, Key, RotateCcw, Sparkles, Trophy } from 'lucide-react';

export default function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [hasExited, setHasExited] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<RoomId | null>(null);
  const [completedRooms, setCompletedRooms] = useState<RoomId[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<'hammer' | 'scissors' | 'water' | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [notificationTimeout, setNotificationTimeout] = useState<NodeJS.Timeout | null>(null);

  // Global game timer (starts automatically when entering the welcome door)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const showNotification = (msg: string) => {
    if (notificationTimeout) {
      clearTimeout(notificationTimeout);
    }
    setNotification(msg);
    const timeout = setTimeout(() => {
      setNotification(null);
    }, 4500);
    setNotificationTimeout(timeout);
  };

  const handleStartGame = () => {
    setGameStarted(true);
    setHasExited(false);
    setIsTimerRunning(true);
    showNotification('Welcome to CARECOR OFFICE! The escape clock is ticking! Choose your first door.');
  };

  const handleSelectRoom = (roomId: RoomId) => {
    if (roomId === 'main_door') {
      const preliminaryCount = completedRooms.filter((r) => r !== 'main_door').length;
      if (preliminaryCount < 7) {
        showNotification(`The Main Vault requires all 7 room keys first (${preliminaryCount}/7 completed).`);
        return;
      }
    }

    setCurrentRoom(roomId);
    showNotification(`Entered ${roomId.replace('_', ' ').toUpperCase()}! Solve the room to claim its key.`);
  };

  const handleReturnToHub = () => {
    sound.click();
    if (!currentRoom) return;

    const isFinished = completedRooms.includes(currentRoom);
    if (!isFinished) {
      const confirmLeave = window.confirm(
        'Rule: You must complete the room before selecting a new door! Are you sure you want to step back to the hallway?'
      );
      if (!confirmLeave) return;
    }
    setCurrentRoom(null);
  };

  const handleCompleteRoom = (roomId: RoomId) => {
    if (!completedRooms.includes(roomId)) {
      setCompletedRooms((prev) => [...prev, roomId]);
    }
  };

  const handleAddItem = (item: InventoryItem) => {
    if (!inventory.some((i) => i.id === item.id)) {
      setInventory((prev) => [...prev, item]);
    }
  };

  const handleToggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const handleResetGame = () => {
    const confirmReset = window.confirm('Are you sure you want to restart the CARECOR Office Escape Room?');
    if (confirmReset) {
      window.location.reload();
    }
  };

  const handleExitGame = () => {
    sound.click();
    setIsTimerRunning(false);
    setHasExited(true);
  };

  const handleVictory = () => {
    setIsTimerRunning(false);
    handleCompleteRoom('main_door');
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}m ${s}s`;
  };

  // 1. Exit Screen if player chose to exit
  if (hasExited) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#E8E0EE] via-[#C7BFE8]/40 to-[#9AD9EA]/30 flex flex-col items-center justify-center p-6 text-center select-none">
        <div className="max-w-xl w-full bg-white/95 rounded-3xl border-4 border-[#FEAEC9] p-8 shadow-2xl animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-2xl bg-[#FEAEC9] flex items-center justify-center mx-auto mb-3 shadow-md">
            <Trophy className="w-8 h-8 text-[#251B35]" />
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs mb-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>OFFICIALLY SIGNED OUT & ESCAPED</span>
          </div>

          <h2 className="text-3xl font-black text-[#251B35] tracking-tight">
            Thank You, CARECOR Team!
          </h2>
          <p className="text-xs sm:text-sm text-[#251B35]/70 max-w-md mx-auto mt-2">
            You have successfully escaped the CARECOR office lockdown. The weekend party awaits!
          </p>

          <div className="my-6 rounded-2xl overflow-hidden border-2 border-[#C7BFE8] shadow-md max-w-sm mx-auto">
            <img
              src="/carecor_team.jpg"
              alt="CARECOR Team Celebration"
              className="w-full h-auto object-cover max-h-56"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto mb-6 text-xs">
            <div className="bg-[#E8E0EE] p-3 rounded-xl border border-[#C7BFE8]">
              <Clock className="w-4 h-4 text-purple-700 mx-auto mb-1" />
              <div className="font-bold text-[#251B35]/60 uppercase text-[10px]">Total Time</div>
              <div className="font-black text-sm text-[#251B35]">{formatTime(elapsedSeconds)}</div>
            </div>
            <div className="bg-[#9AD9EA]/25 p-3 rounded-xl border border-[#9AD9EA]">
              <Key className="w-4 h-4 text-amber-500 fill-amber-400 mx-auto mb-1" />
              <div className="font-bold text-[#251B35]/60 uppercase text-[10px]">Keys Unlocked</div>
              <div className="font-black text-sm text-[#251B35]">{completedRooms.length} / 8</div>
            </div>
          </div>

          <button
            onClick={() => {
              sound.click();
              window.location.reload();
            }}
            className="py-3 px-8 rounded-xl bg-gradient-to-r from-[#FEAEC9] via-[#C7BFE8] to-[#9AD9EA] text-[#251B35] font-black text-xs uppercase tracking-wider hover:opacity-95 shadow-md flex items-center justify-center gap-2 mx-auto cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Return to Welcome Door / Play Again</span>
          </button>
        </div>
      </div>
    );
  }

  // 2. Initial State: The Grand Main Door Welcome Screen
  if (!gameStarted) {
    return <WelcomeDoor onEnter={handleStartGame} />;
  }

  const isGameOver = completedRooms.includes('main_door');

  // 3. Active Game Screen with Top Header and Navigation
  return (
    <div className="min-h-screen bg-[#E8E0EE] text-[#251B35] flex flex-col font-sans select-none">
      {/* Universal Escape Header */}
      <Header
        elapsedSeconds={elapsedSeconds}
        currentRoom={currentRoom}
        completedRooms={completedRooms}
        isMuted={isMuted}
        isGameOver={isGameOver}
        onToggleSound={handleToggleSound}
        onReset={handleResetGame}
        onReturnToHub={handleReturnToHub}
        onOpenHelp={() => setIsHelpOpen(true)}
        onExitGame={handleExitGame}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentRoom === null && (
          <OfficeHub
            completedRooms={completedRooms}
            onSelectRoom={handleSelectRoom}
            activeRoom={currentRoom}
          />
        )}

        {currentRoom === 'living_area' && (
          <LivingArea
            onEarnKey={() => handleCompleteRoom('living_area')}
            isCompleted={completedRooms.includes('living_area')}
            inventory={inventory}
            selectedItem={selectedItem}
            onSelectItem={setSelectedItem}
            onAddItem={handleAddItem}
            showNotification={showNotification}
          />
        )}

        {currentRoom === 'pantry_room' && (
          <PantryRoom
            onEarnKey={() => handleCompleteRoom('pantry_room')}
            isCompleted={completedRooms.includes('pantry_room')}
            showNotification={showNotification}
          />
        )}

        {currentRoom === 'meeting_room' && (
          <MeetingRoom
            onEarnKey={() => handleCompleteRoom('meeting_room')}
            isCompleted={completedRooms.includes('meeting_room')}
            showNotification={showNotification}
          />
        )}

        {currentRoom === 'ceo_office' && (
          <CeoOffice
            onEarnKey={() => handleCompleteRoom('ceo_office')}
            isCompleted={completedRooms.includes('ceo_office')}
            showNotification={showNotification}
          />
        )}

        {currentRoom === 'break_room' && (
          <BreakRoom
            onEarnKey={() => handleCompleteRoom('break_room')}
            isCompleted={completedRooms.includes('break_room')}
            showNotification={showNotification}
          />
        )}

        {currentRoom === 'sleeping_room' && (
          <SleepingRoom
            onEarnKey={() => handleCompleteRoom('sleeping_room')}
            isCompleted={completedRooms.includes('sleeping_room')}
            showNotification={showNotification}
          />
        )}

        {currentRoom === 'special_room' && (
          <SpecialRoom
            onEarnKey={() => handleCompleteRoom('special_room')}
            isCompleted={completedRooms.includes('special_room')}
            showNotification={showNotification}
          />
        )}

        {currentRoom === 'main_door' && (
          <MainDoorExit
            completedRooms={completedRooms}
            elapsedSeconds={elapsedSeconds}
            onVictory={handleVictory}
            onExitGame={handleExitGame}
            showNotification={showNotification}
          />
        )}
      </main>

      {/* Global Bottom Inventory & Tool Dock */}
      <InventoryBar
        items={inventory}
        selectedItem={selectedItem}
        onSelectItem={setSelectedItem}
        completedRooms={completedRooms}
        notification={notification}
      />

      {/* Help Modal */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}
