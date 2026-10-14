import React, { useState } from 'react';
import {
  Eye,
  Key,
  CheckCircle2,
  Lock,
  Sparkles,
} from 'lucide-react';
import { DifferencePoint } from '../../types/game';
import { sound } from '../../utils/sound';

interface SleepingRoomProps {
  onEarnKey: () => void;
  isCompleted: boolean;
  showNotification: (msg: string) => void;
}

const SUBTLE_DIFFERENCES: DifferencePoint[] = [
  {
    id: 1,
    title: 'Wall Clock Hands Position',
    xPercent: 65,
    yPercent: 17,
    radiusPercent: 6.5,
    description: 'Clock hands set to 10:10 in Picture 1 vs 4:20 in Picture 2',
  },
  {
    id: 2,
    title: 'Desk Plant Flowering Buds',
    xPercent: 36,
    yPercent: 64,
    radiusPercent: 7,
    description: 'Plain foliage in Picture 1 vs Small delicate blooming buds in Picture 2',
  },
  {
    id: 3,
    title: 'Coffee Mug Emblem',
    xPercent: 75,
    yPercent: 80,
    radiusPercent: 5.5,
    description: 'Plain text mug in Picture 1 vs Subtle heart logo emblem in Picture 2',
  },
  {
    id: 4,
    title: 'Left Monitor Sidebar Tab',
    xPercent: 41,
    yPercent: 44,
    radiusPercent: 8,
    description: 'Standard channel active in Picture 1 vs Highlighted blue tab in Picture 2',
  },
  {
    id: 5,
    title: 'Right Monitor Syntax Highlight',
    xPercent: 68,
    yPercent: 44,
    radiusPercent: 8,
    description: 'Standard code in Picture 1 vs Subtle highlighted code block in Picture 2',
  },
  {
    id: 6,
    title: 'Cork Board Pin Note',
    xPercent: 88,
    yPercent: 15,
    radiusPercent: 5.5,
    description: 'Yellow note in Picture 1 vs Subtle pale mint sticky note in Picture 2',
  },
  {
    id: 7,
    title: 'Smartphone Notification LED',
    xPercent: 84,
    yPercent: 92,
    radiusPercent: 5,
    description: 'Dark screen in Picture 1 vs Subtle illuminated notification bar in Picture 2',
  },
  {
    id: 8,
    title: 'Stationery Cup Extra Pen',
    xPercent: 91,
    yPercent: 76,
    radiusPercent: 5.5,
    description: 'Standard pens in Picture 1 vs Extra stylus pen in Picture 2',
  },
  {
    id: 9,
    title: 'Open Notebook Pencil',
    xPercent: 18,
    yPercent: 75,
    radiusPercent: 7,
    description: 'Open journal pages in Picture 1 vs Fine pencil resting on the crease in Picture 2',
  },
  {
    id: 10,
    title: 'Overhead LED Lamp Warmth',
    xPercent: 52,
    yPercent: 7,
    radiusPercent: 7,
    description: 'Neutral white light in Picture 1 vs Subtle warm ambient glow in Picture 2',
  },
];

export const SleepingRoom: React.FC<SleepingRoomProps> = ({
  onEarnKey,
  isCompleted,
  showNotification,
}) => {
  const [foundIds, setFoundIds] = useState<number[]>(
    isCompleted ? SUBTLE_DIFFERENCES.map((d) => d.id) : []
  );
  const [boxOpened, setBoxOpened] = useState(isCompleted);
  const [doorUnlocked, setDoorUnlocked] = useState(isCompleted);

  const handleSceneClick = (
    e: React.MouseEvent<HTMLDivElement>,
    sceneLabel: string
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    let hitFound = false;
    for (const diff of SUBTLE_DIFFERENCES) {
      const dist = Math.hypot(clickX - diff.xPercent, clickY - diff.yPercent);
      if (dist <= diff.radiusPercent + 3) {
        hitFound = true;
        if (!foundIds.includes(diff.id)) {
          sound.correct();
          sound.itemFound();
          const next = [...foundIds, diff.id];
          setFoundIds(next);
          showNotification(
            `Spotted difference #${diff.id}: ${diff.title}!`
          );

          if (next.length === SUBTLE_DIFFERENCES.length) {
            sound.victoryFanfare();
            sound.keyUnlocked();
            setBoxOpened(true);
            setDoorUnlocked(true);
            onEarnKey();
            showNotification(
              '🎉 All 10 Differences Discovered! Mystery Observation Box unlocked! Observation Key acquired!'
            );
          }
        } else {
          showNotification(`Already discovered: ${diff.title}`);
        }
        break;
      }
    }

    if (!hitFound) {
      sound.click();
      showNotification(
        `No difference at that spot in ${sceneLabel}. Compare the clock, plant, mug, notebook, phone, cup, and screens closely!`
      );
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 pb-28">
      {/* Room Header */}
      <div className="bg-white/90 border-2 border-[#C7BFE8] rounded-2xl p-5 mb-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#FEAEC9]/30 text-xs font-bold text-[#251B35] mb-1 border border-[#FEAEC9]">
            <Eye className="w-3.5 h-3.5 text-purple-700" />
            <span>ROOM 6: SLEEPING & REST ROOM</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#251B35]">
            Observation: Spot the 10 Differences
          </h2>
          <p className="text-xs sm:text-sm text-[#251B35]/70 mt-0.5">
            Inspect Picture 1 (Original) and Picture 2 (Altered). Find and click the 10 subtle differences between them.
          </p>
        </div>

        {/* Counter */}
        <div className="flex items-center gap-3">
          <div className="bg-[#E8E0EE] px-3 py-2 rounded-xl border border-[#C7BFE8] text-center">
            <div className="text-[10px] uppercase font-bold text-[#251B35]/60">Differences</div>
            <div className="text-base font-black text-[#251B35]">
              {foundIds.length} / 10
            </div>
          </div>

          {doorUnlocked ? (
            <div className="bg-emerald-100 text-emerald-800 px-3 py-2 rounded-xl border border-emerald-300 flex items-center gap-1.5 font-bold text-xs animate-bounce">
              <Key className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span>Door Unlocked!</span>
            </div>
          ) : (
            <div className="bg-amber-50 text-amber-900 px-3 py-2 rounded-xl border border-amber-300 flex items-center gap-1.5 font-bold text-xs">
              <Lock className="w-4 h-4 text-amber-600" />
              <span>Box Locked</span>
            </div>
          )}
        </div>
      </div>

      {/* Side-by-Side Visual Comparison Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        {/* PICTURE 1: ORIGINAL (Clean, unaltered baseline) */}
        <div className="bg-white rounded-3xl border-4 border-[#C7BFE8] p-4 shadow-md">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-100">
            <span className="text-xs font-black uppercase text-[#251B35] tracking-wider flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              Picture 1: Original Workstation Picture
            </span>
            <span className="text-[10px] text-slate-500 font-semibold">Reference Image</span>
          </div>

          <div
            onClick={(e) => handleSceneClick(e, 'Picture 1')}
            className="relative w-full aspect-4/3 rounded-2xl overflow-hidden border-2 border-[#C7BFE8] cursor-crosshair bg-slate-900 select-none shadow-inner"
          >
            <img
              src="/rooms/workstation_a.jpg"
              alt="Workstation Picture 1 (Original)"
              className="w-full h-full object-cover pointer-events-none"
            />

            {/* Found Markers on Picture 1 (Only visible after clicking/discovering) */}
            {foundIds.map((id) => {
              const diff = SUBTLE_DIFFERENCES.find((d) => d.id === id)!;
              return (
                <div
                  key={id}
                  className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-emerald-400 bg-emerald-400/20 animate-pulse flex items-center justify-center shadow-md z-30"
                  style={{
                    left: `${diff.xPercent}%`,
                    top: `${diff.yPercent}%`,
                    width: `${diff.radiusPercent * 2}%`,
                    height: `${diff.radiusPercent * 2}%`,
                  }}
                >
                  <span className="text-[9px] font-black text-emerald-950 bg-white/95 rounded-full px-1 shadow-xs">
                    {diff.id}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* PICTURE 2: ALTERED WITH REALISTIC, SEAMLESS DIFFERENCES */}
        <div className="bg-white rounded-3xl border-4 border-[#9AD9EA] p-4 shadow-md">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-100">
            <span className="text-xs font-black uppercase text-[#251B35] tracking-wider flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              Picture 2: Altered Workstation Picture
            </span>
            <span className="text-[10px] text-purple-700 font-bold">10 Changed Items to Spot</span>
          </div>

          <div
            onClick={(e) => handleSceneClick(e, 'Picture 2')}
            className="relative w-full aspect-4/3 rounded-2xl overflow-hidden border-2 border-[#9AD9EA] cursor-crosshair bg-slate-900 select-none shadow-inner"
          >
            <img
              src="/rooms/workstation_b.jpg"
              alt="Workstation Picture 2 (Altered Items)"
              className="w-full h-full object-cover pointer-events-none"
            />

            {/* === 10 REALISTIC, NATURAL VISUAL CHANGES ON PICTURE 2 === */}

            {/* 1. Subtle Clock Hands adjusted to 4:20 (Natural dark metal hands, no cartoon dial) */}
            <div
              className="absolute pointer-events-none z-10 flex items-center justify-center"
              style={{ left: '63.2%', top: '15.5%', width: '4%', height: '5%' }}
            >
              {/* Center pivot and natural dark hands at 4:20 */}
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-900 shadow-2xs" />
                {/* Minute hand pointing right-down toward 4 */}
                <div className="absolute w-3.5 h-0.5 bg-slate-800 rounded-full origin-left rotate-35 translate-x-1" />
                {/* Hour hand pointing right-down toward 4:20 */}
                <div className="absolute w-2.5 h-0.5 bg-slate-800 rounded-full origin-left rotate-115 -translate-x-1" />
              </div>
            </div>

            {/* 2. Desk Plant: Natural subtle small pastel blossom buds on leaves */}
            <div
              className="absolute pointer-events-none z-10"
              style={{ left: '33%', top: '59%', width: '8%', height: '10%' }}
            >
              <div className="relative w-full h-full">
                <div className="w-2 h-2 rounded-full bg-pink-300/90 shadow-xs absolute top-1 left-2 border border-white/60" />
                <div className="w-1.5 h-1.5 rounded-full bg-sky-200/90 shadow-xs absolute top-4 right-1 border border-white/60" />
                <div className="w-2 h-2 rounded-full bg-rose-300/90 shadow-xs absolute bottom-1 left-4 border border-white/60" />
              </div>
            </div>

            {/* 3. Coffee Mug: Subtle small red heart logo alongside text */}
            <div
              className="absolute pointer-events-none z-10"
              style={{ left: '74%', top: '80%', width: '4%', height: '4%' }}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80 shadow-2xs flex items-center justify-center text-[7px] text-white font-bold">
                ♥
              </div>
            </div>

            {/* 4. Left Monitor: Subtle cyan highlighted active tab in sidebar */}
            <div
              className="absolute pointer-events-none z-10 bg-sky-400/35 rounded-xs"
              style={{ left: '34.5%', top: '40%', width: '3.5%', height: '2.5%' }}
            />

            {/* 5. Right Monitor: Subtle violet syntax keyword block */}
            <div
              className="absolute pointer-events-none z-10 bg-purple-400/35 rounded-xs"
              style={{ left: '63.5%', top: '42%', width: '5%', height: '1.5%' }}
            />

            {/* 6. Cork Board: Subtle mint green post-it note replacing yellow */}
            <div
              className="absolute pointer-events-none z-10 bg-emerald-200/85 rounded-xs shadow-2xs border border-emerald-300/50"
              style={{ left: '87.5%', top: '13.5%', width: '3.8%', height: '4.5%' }}
            />

            {/* 7. Smartphone on desk: Subtle glowing blue notification pill on screen */}
            <div
              className="absolute pointer-events-none z-10 bg-sky-400/90 rounded-full shadow-[0_0_6px_rgba(56,189,248,0.8)]"
              style={{ left: '83.5%', top: '91%', width: '3%', height: '1.2%' }}
            />

            {/* 8. Stationery Cup: An extra fine silver stylus pen inside the cup */}
            <div
              className="absolute pointer-events-none z-10"
              style={{ left: '89.5%', top: '71%', width: '2%', height: '6%' }}
            >
              <div className="w-0.5 h-5 bg-purple-400/90 rounded-full -rotate-15 shadow-2xs" />
            </div>

            {/* 9. Open Notebook: A slender wooden pencil resting neatly on the page crease */}
            <div
              className="absolute pointer-events-none z-10"
              style={{ left: '16%', top: '74%', width: '5%', height: '2%' }}
            >
              <div className="w-4 h-0.5 bg-amber-600/90 rounded-full rotate-25 shadow-2xs border-r border-slate-900" />
            </div>

            {/* 10. Overhead LED Fixture: Gentle warm ambient warmth along the center fixture */}
            <div
              className="absolute pointer-events-none z-10 bg-amber-300/40 rounded-full blur-xs"
              style={{ left: '36%', top: '5%', width: '32%', height: '3%' }}
            />

            {/* Found Markers on Picture 2 (Only visible after clicking/discovering) */}
            {foundIds.map((id) => {
              const diff = SUBTLE_DIFFERENCES.find((d) => d.id === id)!;
              return (
                <div
                  key={id}
                  className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-emerald-400 bg-emerald-400/20 animate-pulse flex items-center justify-center shadow-md z-30"
                  style={{
                    left: `${diff.xPercent}%`,
                    top: `${diff.yPercent}%`,
                    width: `${diff.radiusPercent * 2}%`,
                    height: `${diff.radiusPercent * 2}%`,
                  }}
                >
                  <span className="text-[9px] font-black text-emerald-950 bg-white/95 rounded-full px-1 shadow-xs">
                    {diff.id}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Checklist & Mystery Chest */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Discovered Differences Checklist (2 Cols) */}
        <div className="md:col-span-2 bg-white/95 rounded-2xl border-2 border-[#C7BFE8] p-4 shadow-sm">
          <div className="text-xs font-black uppercase text-[#251B35] tracking-wider mb-2">
            Discrepancies Discovered ({foundIds.length} / 10):
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
            {SUBTLE_DIFFERENCES.map((diff) => {
              const isFound = foundIds.includes(diff.id);
              return (
                <div
                  key={diff.id}
                  className={`p-2.5 rounded-xl border flex items-center gap-2.5 text-xs transition-all ${
                    isFound
                      ? 'bg-emerald-50 border-emerald-300 font-bold text-emerald-900 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                      isFound ? 'bg-emerald-600 text-white' : 'bg-white border text-slate-400'
                    }`}
                  >
                    {isFound ? '✓' : diff.id}
                  </span>
                  <div className="truncate">
                    <div>{isFound ? diff.title : 'Hidden Difference'}</div>
                    <div className="text-[10px] text-slate-500 font-normal truncate">
                      {isFound ? diff.description : 'Inspect Picture 1 and Picture 2 closely'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 10-Item Reward Box (1 Col) */}
        <div className="bg-white/95 rounded-2xl border-2 border-[#C7BFE8] p-4 shadow-sm flex flex-col justify-between text-center">
          <div>
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#E8E0EE] flex items-center justify-center text-3xl mb-2 shadow-xs border border-[#C7BFE8]">
              {boxOpened ? '🎁' : '🧰'}
            </div>
            <h4 className="text-sm font-black text-[#251B35]">
              Observation Mystery Chest
            </h4>
            <p className="text-xs text-[#251B35]/70 mt-1">
              {boxOpened
                ? 'All 10 differences spotted! The chest clicked open!'
                : `Find ${10 - foundIds.length} more differences to unlock the Observation Key.`}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            {doorUnlocked ? (
              <div className="bg-emerald-100 text-emerald-800 p-2.5 rounded-xl border border-emerald-300 flex items-center justify-center gap-2 text-xs font-black">
                <Key className="w-4 h-4 text-amber-500 fill-amber-400" />
                <span>Observation Key Collected!</span>
              </div>
            ) : (
              <div className="bg-slate-100 text-slate-500 p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                <span>LOCKED ({foundIds.length}/10)</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
