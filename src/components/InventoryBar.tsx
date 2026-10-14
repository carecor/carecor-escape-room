import React from 'react';
import { Hammer, Scissors, Droplets, Key, Sparkles, CheckCircle2 } from 'lucide-react';
import { InventoryItem, RoomId } from '../types/game';

interface InventoryBarProps {
  items: InventoryItem[];
  selectedItem: string | null;
  onSelectItem: (id: 'hammer' | 'scissors' | 'water' | null) => void;
  completedRooms: RoomId[];
  notification: string | null;
}

export const InventoryBar: React.FC<InventoryBarProps> = ({
  items,
  selectedItem,
  onSelectItem,
  completedRooms,
  notification,
}) => {
  const getItemIcon = (id: string) => {
    switch (id) {
      case 'hammer':
        return <Hammer className="w-5 h-5 text-amber-600" />;
      case 'scissors':
        return <Scissors className="w-5 h-5 text-rose-500" />;
      case 'water':
        return <Droplets className="w-5 h-5 text-sky-500" />;
      default:
        return <Sparkles className="w-5 h-5 text-indigo-500" />;
    }
  };

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 max-w-2xl w-[94%] pointer-events-none">
      {/* Toast Notification Alert */}
      {notification && (
        <div className="pointer-events-auto mb-2 mx-auto max-w-md bg-[#251B35] text-white px-4 py-2.5 rounded-xl shadow-xl border border-[#FEAEC9] flex items-center gap-2.5 animate-bounce text-xs sm:text-sm font-semibold">
          <Sparkles className="w-4 h-4 text-[#FEAEC9] shrink-0" />
          <span className="flex-1">{notification}</span>
        </div>
      )}

      {/* Main Inventory Dock */}
      <div className="pointer-events-auto bg-white/95 backdrop-blur-md border-2 border-[#C7BFE8] shadow-2xl rounded-2xl px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Tool Inventory */}
        <div className="flex items-center gap-2">
          <div className="text-[11px] font-bold text-[#251B35]/70 uppercase tracking-wider hidden sm:block">
            Tools:
          </div>
          {items.length === 0 ? (
            <div className="text-xs text-[#251B35]/50 italic px-2 py-1">
              Search the room to find tools...
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              {items.map((item) => {
                const isSelected = selectedItem === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectItem(isSelected ? null : item.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-[#FEAEC9] border-[#251B35] shadow-md scale-105 font-bold text-[#251B35]'
                        : 'bg-[#E8E0EE]/60 hover:bg-[#E8E0EE] border-[#C7BFE8] text-[#251B35]'
                    }`}
                    title={`${item.name} (${item.description}) - Click to equip`}
                  >
                    {getItemIcon(item.id)}
                    <span className="text-xs font-semibold capitalize hidden md:inline">
                      {item.name}
                    </span>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected Tool Helper */}
        {selectedItem && (
          <div className="hidden lg:flex items-center gap-1.5 text-xs bg-[#FEAEC9]/30 text-[#251B35] px-2.5 py-1 rounded-lg border border-[#FEAEC9] font-medium">
            <span>Equipped: <strong>{selectedItem}</strong> (Click targets to use)</span>
          </div>
        )}

        {/* Room Keys Bag */}
        <div className="flex items-center gap-1.5 border-l border-[#C7BFE8] pl-3">
          <div className="flex items-center gap-1 text-xs font-bold text-[#251B35]">
            <Key className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span className="hidden sm:inline">Keys:</span>
            <span>{completedRooms.length}</span>
          </div>
          {completedRooms.length >= 7 ? (
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> All Keys!
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
};
