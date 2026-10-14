import React, { useState } from 'react';
import {
  Pin,
  Sparkles,
  Key,
  CheckCircle2,
  Tv,
  HelpCircle,
  Undo2,
  X,
} from 'lucide-react';
import { InventoryItem, StickyNote } from '../../types/game';
import { sound } from '../../utils/sound';

interface LivingAreaProps {
  onEarnKey: () => void;
  isCompleted: boolean;
  inventory: InventoryItem[];
  selectedItem: 'hammer' | 'scissors' | 'water' | null;
  onSelectItem: (id: 'hammer' | 'scissors' | 'water' | null) => void;
  onAddItem: (item: InventoryItem) => void;
  showNotification: (msg: string) => void;
}

export const LivingArea: React.FC<LivingAreaProps> = ({
  onEarnKey,
  isCompleted,
  inventory,
  selectedItem,
  onSelectItem,
  onAddItem,
  showNotification,
}) => {
  // State for interactive scene items
  const [boxOpened, setBoxOpened] = useState(false);
  const [tableSmashed, setTableSmashed] = useState(false);
  const [chairMoved, setChairMoved] = useState(false);
  const [pillowCut, setPillowCut] = useState(false);
  const [centerpieceMoved, setCenterpieceMoved] = useState(false);
  const [cabinetOpened, setCabinetOpened] = useState(false);
  const [potWatered, setPotWatered] = useState(false);
  const [ceramicPotSmashed, setCeramicPotSmashed] = useState(false);
  const [paintingCut, setPaintingCut] = useState(false);
  const [tvOn, setTvOn] = useState(false);
  const [windowRolled, setWindowRolled] = useState(false);
  const [lampOn, setLampOn] = useState(false);
  const [doorUnlocked, setDoorUnlocked] = useState(isCompleted);

  // Selected sticky note in player's pouch waiting to be placed on board
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  // 8 Sticky notes spelling C - R - E - D - I - B - L - E
  const [stickyNotes, setStickyNotes] = useState<StickyNote[]>([
    {
      id: 'yellow',
      colorName: 'Yellow',
      letter: 'C',
      colorHex: '#FDE047',
      pinColorHex: '#EAB308',
      found: false,
      pinned: false,
      source: 'Flower Pot (Bloomed)',
    },
    {
      id: 'green',
      colorName: 'Green',
      letter: 'R',
      colorHex: '#86EFAC',
      pinColorHex: '#22C55E',
      found: false,
      pinned: false,
      source: 'Sliding Window Blinds',
    },
    {
      id: 'orange',
      colorName: 'Orange',
      letter: 'E1',
      colorHex: '#FDBA74',
      pinColorHex: '#F97316',
      found: false,
      pinned: false,
      source: 'Floor Lamp Glow',
    },
    {
      id: 'blue',
      colorName: 'Blue',
      letter: 'D',
      colorHex: '#9AD9EA',
      pinColorHex: '#3B82F6',
      found: false,
      pinned: false,
      source: 'Pillow Seam',
    },
    {
      id: 'red',
      colorName: 'Red',
      letter: 'I',
      colorHex: '#FCA5A5',
      pinColorHex: '#EF4444',
      found: false,
      pinned: false,
      source: 'Wall Painting Backing',
    },
    {
      id: 'pink',
      colorName: 'Pink',
      letter: 'B',
      colorHex: '#FEAEC9',
      pinColorHex: '#EC4899',
      found: false,
      pinned: false,
      source: 'Main Table Base',
    },
    {
      id: 'violet',
      colorName: 'Violet',
      letter: 'L',
      colorHex: '#C7BFE8',
      pinColorHex: '#8B5CF6',
      found: false,
      pinned: false,
      source: 'Ceramic Pot',
    },
    {
      id: 'brown',
      colorName: 'Brown',
      letter: 'E2',
      colorHex: '#C49A70',
      pinColorHex: '#92400E',
      found: false,
      pinned: false,
      source: 'Behind Office Chair',
    },
  ]);

  // Bulletin Board 8 Manual Letter Slots: Slot 0 to 7 (Target: C-R-E-D-I-B-L-E)
  // Each slot holds a stickyNoteId or null
  const [boardSlots, setBoardSlots] = useState<(string | null)[]>(
    isCompleted
      ? ['yellow', 'green', 'orange', 'blue', 'red', 'pink', 'violet', 'brown']
      : [null, null, null, null, null, null, null, null]
  );

  const markNoteDiscovered = (noteId: string) => {
    sound.itemFound();
    setStickyNotes((prev) =>
      prev.map((n) => (n.id === noteId ? { ...n, found: true } : n))
    );
  };

  // --- Click Handlers on the 1 Picture ---

  // 1. Sliding Window
  const handleClickWindow = () => {
    sound.click();
    if (!windowRolled) {
      setWindowRolled(true);
      markNoteDiscovered('green');
      showNotification('Rolled up the sliding window blinds! You found a Green Sticky Note [R]!');
    } else {
      showNotification('The sliding window blinds are rolled up. Bright sunlight streams through.');
    }
  };

  // 2. Wall Painting
  const handleClickPainting = () => {
    sound.click();
    if (!paintingCut) {
      if (selectedItem === 'scissors') {
        sound.cut();
        setPaintingCut(true);
        markNoteDiscovered('red');
        showNotification('Slices canvas backing with scissors! Found Red Sticky Note [I]!');
      } else {
        showNotification('An office abstract canvas. Feels like something is hidden behind the backing.');
      }
    } else {
      showNotification('The painting canvas is already cut. Red sticky note retrieved.');
    }
  };

  // 3. Office Smart TV
  const handleClickTV = () => {
    sound.click();
    if (!tvOn) {
      sound.correct();
      setTvOn(true);
      showNotification('Turned on the Smart TV! Screen flashes: "CREDIBLE"!');
    } else {
      showNotification('Smart TV screen displays the employee characteristic: CREDIBLE');
    }
  };

  // 4. Locked Box on Main Table
  const handleClickLockedBox = () => {
    sound.click();
    if (!boxOpened) {
      sound.itemFound();
      setBoxOpened(true);
      onAddItem({
        id: 'hammer',
        name: 'Hammer',
        icon: 'hammer',
        description: 'Heavy metal hammer to smash sturdy objects',
      });
      showNotification('Opened the box on the table! Found item: Hammer!');
    } else {
      showNotification('The tabletop box is open and empty.');
    }
  };

  // 5. Centerpiece on Main Table
  const handleClickCenterpiece = () => {
    sound.click();
    if (!centerpieceMoved) {
      sound.itemFound();
      setCenterpieceMoved(true);
      onAddItem({
        id: 'scissors',
        name: 'Scissors',
        icon: 'scissors',
        description: 'Sharp office shears to cut fabrics and canvas',
      });
      showNotification('Shifted the centerpiece! Found item: Scissors!');
    } else {
      showNotification('Centerpiece flower vase already moved.');
    }
  };

  // 6. Main Table
  const handleClickTable = () => {
    sound.click();
    if (!tableSmashed) {
      if (selectedItem === 'hammer') {
        sound.smash();
        setTableSmashed(true);
        markNoteDiscovered('pink');
        showNotification('Smashed the table base with hammer! Found Pink Sticky Note [B]!');
      } else {
        showNotification('A solid oak table. You cannot break the bottom base with your bare hands.');
      }
    } else {
      showNotification('Table bottom already cracked open. Pink sticky note retrieved.');
    }
  };

  // 7. Office Chair
  const handleClickChair = () => {
    sound.click();
    if (!chairMoved) {
      setChairMoved(true);
      markNoteDiscovered('brown');
      showNotification('Moved the office armchair aside! Behind it you found a Brown Sticky Note [E]!');
    } else {
      showNotification('The armchair has already been shifted.');
    }
  };

  // 8. Pillow on Chair
  const handleClickPillow = () => {
    sound.click();
    if (!pillowCut) {
      if (selectedItem === 'scissors') {
        sound.cut();
        setPillowCut(true);
        markNoteDiscovered('blue');
        showNotification('Cut open pillow seam with scissors! Inside is Blue Sticky Note [D]!');
      } else {
        showNotification('A plush throw pillow. You can feel a stiff piece of paper inside the stitch.');
      }
    } else {
      showNotification('Pillow already cut open. Blue note retrieved.');
    }
  };

  // 9. Side Cabinet
  const handleClickCabinet = () => {
    sound.click();
    if (!cabinetOpened) {
      sound.itemFound();
      setCabinetOpened(true);
      onAddItem({
        id: 'water',
        name: 'Water',
        icon: 'water',
        description: 'Bottle of pure spring water to hydrate plants',
      });
      showNotification('Opened side cabinet drawer! Found item: Fresh Water bottle!');
    } else {
      showNotification('Cabinet drawer is open and empty.');
    }
  };

  // 10. Flower Pot
  const handleClickFlowerPot = () => {
    sound.click();
    if (!potWatered) {
      if (selectedItem === 'water') {
        sound.water();
        setPotWatered(true);
        markNoteDiscovered('yellow');
        showNotification('Poured water onto the soil! The flower buds bloomed, revealing Yellow Sticky Note [C]!');
      } else {
        showNotification('The soil is dry and parched. The flower buds need water to bloom.');
      }
    } else {
      showNotification('The flowers are in full bloom. Yellow note retrieved.');
    }
  };

  // 11. Floor Lamp
  const handleClickFloorLamp = () => {
    sound.click();
    if (!lampOn) {
      setLampOn(true);
      markNoteDiscovered('orange');
      showNotification('Switched on the floor lamp! Illuminated inside the shade is Orange Sticky Note [E]!');
    } else {
      showNotification('Floor lamp is glowing warmly.');
    }
  };

  // 12. Ceramic Pot
  const handleClickCeramicPot = () => {
    sound.click();
    if (!ceramicPotSmashed) {
      if (selectedItem === 'hammer') {
        sound.smash();
        setCeramicPotSmashed(true);
        markNoteDiscovered('violet');
        showNotification('Smashed the ceramic clay pot with hammer! Found Violet Sticky Note [L]!');
      } else {
        showNotification('A brittle ceramic clay pot. A strong impact could break it open.');
      }
    } else {
      showNotification('Ceramic pot is in shards. Violet note retrieved.');
    }
  };

  // 13. Bag Behind the Chair
  const handleClickBag = () => {
    sound.click();
    showNotification('Searched the leather bag... Found a dry protein bar wrapper and paperclip. Not useful here.');
  };

  // 14. Coffee Mug
  const handleClickCoffeeMug = () => {
    sound.click();
    showNotification('A ceramic office coffee mug. Lukewarm green tea inside - not useful.');
  };

  // 15. Wall Clock
  const handleClickWallClock = () => {
    sound.click();
    showNotification('Office clock ticking at 3:15 PM.');
  };

  // 16. Carpet
  const handleClickCarpet = () => {
    sound.click();
    showNotification('You inspect the pastel patterned rug. Clean floor underneath - nothing found here.');
  };

  // 17. Waste Bin
  const handleClickWasteBin = () => {
    sound.click();
    showNotification('Waste paper basket contains recycled meeting agendas. Not useful here.');
  };

  // --- Manual Bulletin Board Placement ---

  const handleSelectNoteFromPouch = (noteId: string) => {
    sound.click();
    setSelectedNoteId(selectedNoteId === noteId ? null : noteId);
  };

  const handlePlaceNoteOnSlot = (slotIdx: number) => {
    sound.click();
    if (!selectedNoteId) {
      showNotification('First select a sticky note from your pouch below, then click a slot!');
      return;
    }

    const newSlots = [...boardSlots];

    // If this note is already in another slot, remove it from there
    const prevIdx = newSlots.indexOf(selectedNoteId);
    if (prevIdx !== -1) {
      newSlots[prevIdx] = null;
    }

    newSlots[slotIdx] = selectedNoteId;
    setBoardSlots(newSlots);
    setSelectedNoteId(null);

    // Check if board spells CREDIBLE
    checkBoardCompletion(newSlots);
  };

  const handleRemoveFromSlot = (slotIdx: number) => {
    sound.click();
    const newSlots = [...boardSlots];
    newSlots[slotIdx] = null;
    setBoardSlots(newSlots);
  };

  const checkBoardCompletion = (slots: (string | null)[]) => {
    // Target letter sequence for slots 0..7: C, R, E, D, I, B, L, E
    // Note mapping:
    // yellow = C
    // green = R
    // orange or brown = E
    // blue = D
    // red = I
    // pink = B
    // violet = L
    const letters = slots.map((id) => {
      if (!id) return '';
      const note = stickyNotes.find((n) => n.id === id);
      return note ? note.letter.replace(/[0-9]/g, '') : '';
    });

    const spelled = letters.join('');
    if (spelled === 'CREDIBLE' && !doorUnlocked) {
      sound.victoryFanfare();
      sound.keyUnlocked();
      setDoorUnlocked(true);
      onEarnKey();
      showNotification('🎉 BULLETIN BOARD SOLVED: Spelled "CREDIBLE"! Living Area Key Granted!');
    }
  };

  const foundNotes = stickyNotes.filter((n) => n.found);
  const unpinnedNotes = stickyNotes.filter(
    (n) => n.found && !boardSlots.includes(n.id)
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 pb-28">
      {/* Room Header */}
      <div className="bg-white/90 border-2 border-[#C7BFE8] rounded-2xl p-5 mb-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#FEAEC9]/30 text-xs font-bold text-[#251B35] mb-1 border border-[#FEAEC9]">
            <Sparkles className="w-3.5 h-3.5 text-purple-700" />
            <span>ROOM 1: LIVING AREA</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#251B35]">
            Great Characteristic of an Employee
          </h2>
          <p className="text-xs sm:text-sm text-[#251B35]/70 mt-0.5">
            Click directly on objects in the living area picture. Discover tools, find 8 sticky notes, and manually arrange them on the Bulletin Board to reveal the hidden word.
          </p>
        </div>

        {/* Status */}
        <div className="flex items-center gap-3">
          <div className="bg-[#E8E0EE] px-3 py-2 rounded-xl border border-[#C7BFE8] text-center">
            <div className="text-[10px] uppercase font-bold text-[#251B35]/60">Notes Found</div>
            <div className="text-base font-black text-[#251B35]">
              {foundNotes.length} / 8
            </div>
          </div>
          {doorUnlocked ? (
            <div className="bg-emerald-100 text-emerald-800 px-3 py-2 rounded-xl border border-emerald-300 flex items-center gap-1.5 font-bold text-xs animate-bounce">
              <Key className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span>Door Unlocked!</span>
            </div>
          ) : (
            <div className="bg-amber-50 text-amber-900 px-3 py-2 rounded-xl border border-amber-300 flex items-center gap-1.5 font-bold text-xs">
              <Pin className="w-4 h-4 text-amber-600" />
              <span>Arrange on Board</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: The 1 Clickable Picture Scene (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border-4 border-[#C7BFE8] p-4 shadow-lg">
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
            <span className="text-xs font-black uppercase text-[#251B35] tracking-wider">
              Living Area Scene (Interactive 1 Picture)
            </span>
            <span className="text-[11px] text-[#251B35]/60 font-medium">
              Click objects to inspect or use equipped tools
            </span>
          </div>

          {/* THE 1 PICTURE CONTAINER WITH PRECISE CLICKABLE ZONES */}
          <div className="relative w-full aspect-16/9 rounded-2xl overflow-hidden border-2 border-[#C7BFE8] shadow-inner select-none bg-slate-900 group">
            {/* The Real Living Room Scene Image */}
            <img
              src="/rooms/living_room.jpg"
              alt="CARECOR Living Area"
              className="w-full h-full object-cover pointer-events-none"
            />

            {/* Smart TV Overlay if Powered On */}
            {tvOn && (
              <div
                className="absolute bg-slate-950/95 border-2 border-[#9AD9EA] flex flex-col items-center justify-center text-center p-1 shadow-lg pointer-events-none z-10"
                style={{ left: '60.5%', top: '30.5%', width: '18.5%', height: '19%' }}
              >
                <div className="text-[8px] font-mono text-slate-400">CHARACTERISTIC:</div>
                <div className="text-xs sm:text-sm font-black tracking-widest text-[#9AD9EA] animate-pulse">
                  CREDIBLE
                </div>
              </div>
            )}

            {/* --- Clickable Hotspots (No Spoiler Clues) --- */}

            {/* 1. Sliding Window (left side blinds) */}
            <div
              onClick={handleClickWindow}
              title="Sliding Window Blinds"
              className="absolute cursor-pointer hover:bg-white/20 transition-all rounded-xs"
              style={{ left: '0%', top: '0%', width: '28%', height: '95%' }}
            />

            {/* 2. Floor Lamp (tall white shade lamp near window) */}
            <div
              onClick={handleClickFloorLamp}
              title="Floor Lamp"
              className="absolute cursor-pointer hover:bg-amber-400/20 transition-all rounded-full"
              style={{ left: '26%', top: '28%', width: '12%', height: '55%' }}
            />

            {/* 3. Wall Painting (abstract canvas) */}
            <div
              onClick={handleClickPainting}
              title="Wall Painting"
              className="absolute cursor-pointer hover:bg-purple-400/20 transition-all rounded-md"
              style={{ left: '41.5%', top: '14%', width: '14.5%', height: '31%' }}
            />

            {/* 4. Office Smart TV (flat screen on wall) */}
            <div
              onClick={handleClickTV}
              title="Office Smart TV"
              className="absolute cursor-pointer hover:bg-sky-400/20 transition-all rounded-md"
              style={{ left: '60.5%', top: '30.5%', width: '18.5%', height: '19%' }}
            />

            {/* 5. Wall Clock (represented near corner shelf) */}
            <div
              onClick={handleClickWallClock}
              title="Wall Clock"
              className="absolute cursor-pointer hover:bg-white/20 transition-all rounded-full"
              style={{ left: '88%', top: '8%', width: '8%', height: '14%' }}
            />

            {/* 6. Office Armchair (pink lounge chair) */}
            <div
              onClick={handleClickChair}
              title="Office Armchair"
              className="absolute cursor-pointer hover:bg-pink-400/20 transition-all rounded-xl"
              style={{ left: '32%', top: '55%', width: '22%', height: '38%' }}
            />

            {/* 7. Pillow (striped pillow on the armchair) */}
            <div
              onClick={handleClickPillow}
              title="Pillow on Chair"
              className="absolute cursor-pointer hover:bg-sky-400/30 transition-all rounded-lg z-10"
              style={{ left: '38%', top: '57%', width: '11%', height: '15%' }}
            />

            {/* 8. Bag Behind the Chair */}
            <div
              onClick={handleClickBag}
              title="Bag behind chair"
              className="absolute cursor-pointer hover:bg-amber-600/20 transition-all rounded-md"
              style={{ left: '29%', top: '68%', width: '8%', height: '14%' }}
            />

            {/* 9. Side Cabinet / Credenza (wooden console under TV) */}
            <div
              onClick={handleClickCabinet}
              title="Side Cabinet"
              className="absolute cursor-pointer hover:bg-amber-300/20 transition-all rounded-md"
              style={{ left: '61%', top: '63%', width: '22%', height: '16%' }}
            />

            {/* 10. Flower Pot (tall green snake plant / ficus pot) */}
            <div
              onClick={handleClickFlowerPot}
              title="Flower Pot"
              className="absolute cursor-pointer hover:bg-emerald-400/20 transition-all rounded-full"
              style={{ left: '26%', top: '25%', width: '14%', height: '40%' }}
            />

            {/* 11. Ceramic Pot (indoor planter near credenza) */}
            <div
              onClick={handleClickCeramicPot}
              title="Ceramic Pot"
              className="absolute cursor-pointer hover:bg-emerald-600/20 transition-all rounded-md"
              style={{ left: '82%', top: '42%', width: '7%', height: '32%' }}
            />

            {/* 12. Main Table (round wooden coffee table) */}
            <div
              onClick={handleClickTable}
              title="Main Table"
              className="absolute cursor-pointer hover:bg-amber-500/20 transition-all rounded-full"
              style={{ left: '48%', top: '78%', width: '30%', height: '22%' }}
            />

            {/* 13. Centerpiece (vase with colorful flowers on table) */}
            <div
              onClick={handleClickCenterpiece}
              title="Centerpiece"
              className="absolute cursor-pointer hover:bg-pink-500/30 transition-all rounded-lg z-10"
              style={{ left: '54%', top: '54%', width: '13%', height: '32%' }}
            />

            {/* 14. Locked Box on Main Table (beside centerpiece) */}
            <div
              onClick={handleClickLockedBox}
              title="Box on Table"
              className="absolute cursor-pointer hover:bg-purple-500/30 transition-all rounded-md z-10"
              style={{ left: '55%', top: '82%', width: '11%', height: '9%' }}
            />

            {/* 15. Coffee Mug (green succulent cup / mug on table) */}
            <div
              onClick={handleClickCoffeeMug}
              title="Coffee Mug"
              className="absolute cursor-pointer hover:bg-teal-400/30 transition-all rounded-sm z-10"
              style={{ left: '65%', top: '78%', width: '6%', height: '11%' }}
            />

            {/* 16. Carpet (geometric pastel rug on floor) */}
            <div
              onClick={handleClickCarpet}
              title="Carpet"
              className="absolute cursor-pointer hover:bg-indigo-300/15 transition-all"
              style={{ left: '25%', top: '88%', width: '75%', height: '12%' }}
            />

            {/* 17. Waste Bin (near the desk / side shelf corner) */}
            <div
              onClick={handleClickWasteBin}
              title="Waste Bin"
              className="absolute cursor-pointer hover:bg-slate-500/20 transition-all rounded-xs"
              style={{ left: '92%', top: '72%', width: '8%', height: '18%' }}
            />
          </div>

          {/* Player's Sticky Notes Pouch / Tray */}
          <div className="mt-4 p-4 rounded-2xl bg-[#E8E0EE]/50 border-2 border-[#C7BFE8]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase text-[#251B35] tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#FEAEC9]" />
                Sticky Notes Found ({foundNotes.length} / 8 Collected)
              </span>
              <span className="text-[10px] text-[#251B35]/60">
                Click a note, then click a slot on the board to pin it!
              </span>
            </div>

            {foundNotes.length === 0 ? (
              <div className="text-xs text-slate-500 italic py-2 text-center">
                Search the room picture above to uncover sticky notes...
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {foundNotes.map((note) => {
                  const isSelected = selectedNoteId === note.id;
                  const isAlreadyOnBoard = boardSlots.includes(note.id);
                  const displayLetter = note.letter.replace(/[0-9]/g, '');

                  return (
                    <button
                      key={note.id}
                      onClick={() => handleSelectNoteFromPouch(note.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-xs border-2 ${
                        isSelected
                          ? 'border-[#251B35] scale-105 ring-2 ring-[#FEAEC9]'
                          : 'border-white/80 hover:scale-102'
                      } ${isAlreadyOnBoard ? 'opacity-50' : 'opacity-100'}`}
                      style={{ backgroundColor: note.colorHex, color: '#251B35' }}
                    >
                      <span className="w-2.5 h-2.5 rounded-full border border-white shadow-2xs" style={{ backgroundColor: note.pinColorHex }} />
                      <span>Note [{displayLetter}]</span>
                      {isAlreadyOnBoard && (
                        <span className="text-[9px] font-normal text-slate-700">(On Board)</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: The Manual Bulletin Board (5 Cols) */}
        <div className="lg:col-span-5 bg-gradient-to-b from-amber-50 to-orange-50/50 rounded-3xl border-4 border-amber-300 p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b-2 border-amber-200 mb-4">
              <div className="flex items-center gap-2">
                <Pin className="w-5 h-5 text-amber-700" />
                <h3 className="text-base font-black text-[#251B35]">
                  Office Cork Bulletin Board
                </h3>
              </div>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-200/70 px-2 py-0.5 rounded-full">
                Manual Pinning
              </span>
            </div>

            <p className="text-xs text-[#251B35]/80 mb-4 leading-relaxed">
              Arrange your sticky notes on the 8 pin positions below to spell out the core employee characteristic.
            </p>

            {/* 8 Cork Board Slots: Target spells C - R - E - D - I - B - L - E */}
            <div className="grid grid-cols-4 gap-2.5 mb-4">
              {boardSlots.map((assignedNoteId, idx) => {
                const assignedNote = stickyNotes.find((n) => n.id === assignedNoteId);
                const displayLetter = assignedNote ? assignedNote.letter.replace(/[0-9]/g, '') : null;

                return (
                  <div
                    key={idx}
                    onClick={() => handlePlaceNoteOnSlot(idx)}
                    className={`relative aspect-square rounded-2xl border-2 flex flex-col items-center justify-between p-2 cursor-pointer transition-all shadow-xs ${
                      assignedNote
                        ? 'border-amber-400'
                        : selectedNoteId
                        ? 'border-dashed border-amber-500 bg-amber-100/50 hover:bg-amber-200/60'
                        : 'border-dashed border-amber-300 bg-white/70'
                    }`}
                    style={
                      assignedNote
                        ? { backgroundColor: assignedNote.colorHex }
                        : undefined
                    }
                  >
                    {/* Pin Head at top */}
                    <div
                      className="w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs"
                      style={{
                        backgroundColor: assignedNote ? assignedNote.pinColorHex : '#D97706',
                      }}
                    />

                    {/* Letter Display */}
                    <div className="text-xl font-black text-[#251B35]">
                      {displayLetter || (
                        <span className="text-xs font-bold text-amber-900/40">
                          Slot {idx + 1}
                        </span>
                      )}
                    </div>

                    {/* Remove button if note is present */}
                    {assignedNote && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFromSlot(idx);
                        }}
                        className="text-[9px] text-rose-700 hover:text-rose-900 font-bold underline cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                    {!assignedNote && (
                      <span className="text-[9px] text-amber-800 font-semibold">
                        {selectedNoteId ? 'Pin Here' : 'Empty'}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Spelled Word Preview */}
            <div className="p-3 rounded-xl bg-white/90 border border-amber-200 text-center mb-4">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                Current Word on Board:
              </span>
              <span className="text-lg font-black tracking-widest text-[#251B35]">
                {boardSlots
                  .map((id) => {
                    const n = stickyNotes.find((note) => note.id === id);
                    return n ? n.letter.replace(/[0-9]/g, '') : '_';
                  })
                  .join(' ')}
              </span>
            </div>
          </div>

          {/* Living Area Door Lock / Key Vault */}
          <div className="pt-3 border-t-2 border-amber-200">
            {doorUnlocked ? (
              <div className="p-4 rounded-2xl bg-emerald-100 border-2 border-emerald-400 text-center shadow-md animate-bounce">
                <div className="flex items-center justify-center gap-2 text-emerald-900 font-black text-sm mb-1">
                  <Key className="w-5 h-5 text-amber-500 fill-amber-400" />
                  <span>LIVING AREA KEY UNLOCKED!</span>
                </div>
                <p className="text-xs text-emerald-800">
                  Secret compartment opened! Characteristic: <strong>CREDIBLE</strong>
                </p>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-white/80 border border-amber-300 text-center">
                <div className="text-xs font-bold text-[#251B35] mb-1">
                  🔒 Living Room Exit Locked
                </div>
                <p className="text-[11px] text-[#251B35]/70">
                  Arrange sticky notes to spell the 8-letter characteristic <strong>CREDIBLE</strong> to reveal the key!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
