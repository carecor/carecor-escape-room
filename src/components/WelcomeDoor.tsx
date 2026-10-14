import React, { useState } from 'react';
import { DoorClosed, Sparkles, Clock, ShieldCheck, Users, BookOpen, ArrowRight, Heart, Smile } from 'lucide-react';
import { sound } from '../utils/sound';

interface WelcomeDoorProps {
  onEnter: () => void;
}

export const WelcomeDoor: React.FC<WelcomeDoorProps> = ({ onEnter }) => {
  const [isOpening, setIsOpening] = useState(false);
  const [showStoryModal, setShowStoryModal] = useState(false);

  const handleDoorClick = () => {
    sound.click();
    sound.keyUnlocked();
    setIsOpening(true);
    setTimeout(() => {
      onEnter();
    }, 900);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E8E0EE] via-[#C7BFE8]/30 to-[#9AD9EA]/30 flex flex-col items-center justify-center p-4 sm:p-6 select-none relative overflow-hidden">
      {/* Background Decorative energetic pastel circles */}
      <div className="absolute top-10 left-10 w-80 h-80 rounded-full bg-[#FEAEC9]/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-[#9AD9EA]/35 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-72 h-72 rounded-full bg-[#C7BFE8]/35 blur-3xl pointer-events-none" />

      {/* Main Glass Facade Frame */}
      <div className="relative z-10 max-w-2xl w-full text-center">
        {/* Top Story Teaser Button */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <button
            onClick={() => {
              sound.click();
              setShowStoryModal(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 border-2 border-[#FEAEC9] shadow-sm text-xs font-black text-[#251B35] hover:bg-[#FEAEC9]/20 transition cursor-pointer hover:scale-105"
          >
            <BookOpen className="w-3.5 h-3.5 text-purple-700" />
            <span>📖 Read Mission Story Briefing</span>
          </button>
        </div>

        {/* The Grand Office Door Card */}
        <div
          onClick={handleDoorClick}
          className={`cursor-pointer group relative bg-white/95 backdrop-blur-xl border-4 border-[#C7BFE8] rounded-3xl p-5 sm:p-7 shadow-2xl transition-all duration-700 hover:shadow-[#FEAEC9]/50 hover:border-[#FEAEC9] ${
            isOpening ? 'scale-105 opacity-90' : 'hover:-translate-y-1'
          }`}
        >
          {/* Main Door Header Sign */}
          <div className="border-b-2 border-dashed border-[#C7BFE8] pb-4 mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FEAEC9]/30 text-xs font-extrabold text-[#251B35] mb-2 border border-[#FEAEC9]">
              <Sparkles className="w-3.5 h-3.5 text-purple-700" />
              <span>OFFICIAL TEAM BUILDING CHALLENGE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-wider text-[#251B35] uppercase drop-shadow-xs">
              Welcome to
            </h1>
            <div className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-[#FEAEC9] via-[#C7BFE8] to-[#9AD9EA] bg-clip-text text-transparent mt-0.5">
              CARECOR OFFICE
            </div>
            <p className="text-xs sm:text-sm font-medium text-[#251B35]/70 mt-1.5 max-w-md mx-auto">
              Crack riddles, find sticky notes, honor coworkers, and escape the office together!
            </p>
          </div>



          {/* Interactive Double Door Push Graphic */}
          <div className="relative h-44 sm:h-48 w-full max-w-md mx-auto bg-gradient-to-b from-[#E8E0EE] to-[#C7BFE8]/40 rounded-2xl border-2 border-[#C7BFE8] overflow-hidden flex shadow-inner">
            {/* Left Door Leaf */}
            <div
              className={`w-1/2 h-full bg-[#E8E0EE] border-r-2 border-[#C7BFE8] flex flex-col justify-between p-3 transition-transform duration-700 origin-left relative ${
                isOpening ? '-rotate-y-90 opacity-40' : ''
              }`}
            >
              <div className="w-full h-20 rounded-lg bg-white/70 border border-[#C7BFE8] shadow-xs flex items-center justify-center">
                <span className="text-xs font-bold tracking-widest text-[#251B35]/50 uppercase">
                  CARE
                </span>
              </div>
              <div className="self-end w-3 h-10 rounded-full bg-[#FEAEC9] shadow-md border border-white"></div>
            </div>

            {/* Right Door Leaf */}
            <div
              className={`w-1/2 h-full bg-[#E8E0EE] flex flex-col justify-between p-3 transition-transform duration-700 origin-right relative ${
                isOpening ? 'rotate-y-90 opacity-40' : ''
              }`}
            >
              <div className="w-full h-20 rounded-lg bg-white/70 border border-[#C7BFE8] shadow-xs flex items-center justify-center">
                <span className="text-xs font-bold tracking-widest text-[#251B35]/50 uppercase">
                  COR
                </span>
              </div>
              <div className="self-start w-3 h-10 rounded-full bg-[#9AD9EA] shadow-md border border-white"></div>
            </div>

            {/* Center Lock Badge */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/95 border-2 border-[#FEAEC9] px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 group-hover:scale-110 transition-transform">
              <DoorClosed className="w-5 h-5 text-[#FEAEC9]" />
              <span className="text-xs font-black tracking-wide text-[#251B35]">
                {isOpening ? 'ENTERING...' : 'PUSH TO ENTER'}
              </span>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDoorClick();
              }}
              className="w-full py-3.5 px-6 rounded-xl font-black text-sm tracking-wide uppercase transition-all duration-300 shadow-md bg-gradient-to-r from-[#FEAEC9] via-[#C7BFE8] to-[#9AD9EA] text-[#251B35] hover:opacity-95 hover:shadow-lg active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Step Inside & Start Escape Game</span>
            </button>
            <p className="text-[11px] text-[#251B35]/60 mt-1.5 font-medium">
              Timer starts automatically the moment you push the door!
            </p>
          </div>
        </div>

        {/* Feature Badges */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-white/75 backdrop-blur-sm p-2.5 rounded-xl border border-[#C7BFE8] flex flex-col items-center text-center">
            <Clock className="w-4 h-4 text-[#9AD9EA] mb-0.5" />
            <span className="text-xs font-bold text-[#251B35]">Live Timer</span>
            <span className="text-[10px] text-[#251B35]/60">Track escape pace</span>
          </div>
          <div className="bg-white/75 backdrop-blur-sm p-2.5 rounded-xl border border-[#C7BFE8] flex flex-col items-center text-center">
            <ShieldCheck className="w-4 h-4 text-[#C7BFE8] mb-0.5" />
            <span className="text-xs font-bold text-[#251B35]">8 Themed Zones</span>
            <span className="text-[10px] text-[#251B35]/60">Puzzles & keys</span>
          </div>
          <div className="bg-white/75 backdrop-blur-sm p-2.5 rounded-xl border border-[#C7BFE8] flex flex-col items-center text-center">
            <Users className="w-4 h-4 text-[#FEAEC9] mb-0.5" />
            <span className="text-xs font-bold text-[#251B35]">Team Spirit</span>
            <span className="text-[10px] text-[#251B35]/60">Honor coworkers</span>
          </div>
        </div>
      </div>

      {/* Short Story Modal */}
      {showStoryModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl border-4 border-[#FEAEC9] max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 border-b border-[#C7BFE8] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#FEAEC9] flex items-center justify-center text-[#251B35] font-black">
                  🏢
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#251B35]">
                    The CARECOR Lockdown Story
                  </h3>
                  <span className="text-xs text-[#251B35]/70">
                    Operation: Ultimate Team Synergy
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowStoryModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-[#251B35]/85 leading-relaxed text-left">
              <div className="p-3.5 rounded-2xl bg-[#E8E0EE]/70 border border-[#C7BFE8]">
                <p className="font-semibold text-[#251B35]">
                  It was 5:00 PM on a Friday at <strong>CARECOR Headquarters</strong>. Just as everyone was getting ready to celebrate another productive week, a pleasant chime echoed across the building:
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 font-medium">
                <span className="font-black text-amber-900 block mb-1">
                  🚨 "ATTENTION CARECOR TEAM:"
                </span>
                "The Executive Office Synergy Protocol has been triggered! All exterior security doors have been securely locked. To exit the building and kick off the weekend party, your squad must prove the core strengths of CARECOR culture:
                <ul className="list-disc pl-5 mt-2 space-y-0.5 text-xs font-semibold">
                  <li>Living Area: Uncover the hidden employee characteristic ("CREDIBLE")</li>
                  <li>Pantry: Solve 10 logical workplace attitude questions</li>
                  <li>Meeting Room: Decipher 10 picture rebuses & pledge responsibility</li>
                  <li>CEO Suite: Honor 8 coworkers with excellence awards</li>
                  <li>Break Room: Replicate the iconic team cooperation pose with live camera</li>
                  <li>Sleeping Lounge: Spot 10 subtle workstation differences</li>
                  <li>Special Room: Share heartfelt teammate appreciation (8 members, 20s each)</li>
                  <li>Main Vault Exit: Enter the 7-letter master code to escape!</li>
                </ul>
              </div>

              <p className="text-xs text-[#251B35]/70 italic">
                The clock starts ticking the very instant you step through the main entrance. Work together, think sharp, and unlock the doors!
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-[#C7BFE8] flex items-center gap-3">
              <button
                onClick={() => {
                  sound.click();
                  setShowStoryModal(false);
                }}
                className="w-1/3 py-2.5 px-4 rounded-xl border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowStoryModal(false);
                  handleDoorClick();
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#FEAEC9] to-[#9AD9EA] text-[#251B35] font-black text-xs uppercase tracking-wider hover:opacity-95 shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Accept Mission & Enter</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
