import React, { useState } from 'react';
import {
  DoorOpen,
  Lock,
  Unlock,
  Sparkles,
  Key,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Trophy,
  Clock,
  RotateCcw,
  BookOpen,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { RoomId } from '../../types/game';
import { sound } from '../../utils/sound';

interface MainDoorExitProps {
  completedRooms: RoomId[];
  elapsedSeconds: number;
  onVictory: () => void;
  onExitGame: () => void;
  showNotification: (msg: string) => void;
}

export const MainDoorExit: React.FC<MainDoorExitProps> = ({
  completedRooms,
  elapsedSeconds,
  onVictory,
  onExitGame,
  showNotification,
}) => {
  const VAULT_WORD_LENGTH = 7;
  const TARGET_WORD = 'CARECOR';

  const [passcode, setPasscode] = useState<string>('');
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showClueBook, setShowClueBook] = useState<boolean>(false);
  const [showVictoryModal, setShowVictoryModal] = useState<boolean>(false);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}m ${s}s`;
  };

  const handleKeyPress = (letter: string) => {
    sound.click();
    setErrorMsg(null);
    if (letter === 'CLEAR') {
      setPasscode('');
    } else if (letter === 'BACK') {
      setPasscode((prev) => prev.slice(0, -1));
    } else {
      if (passcode.length < VAULT_WORD_LENGTH) {
        const next = (passcode + letter).toUpperCase();
        setPasscode(next);
        if (next.length === VAULT_WORD_LENGTH) {
          checkVaultCode(next);
        }
      }
    }
  };

  const checkVaultCode = (code: string) => {
    const normalized = code.trim().toUpperCase().replace(/[^A-Z]/g, '');

    if (normalized === TARGET_WORD) {
      sound.victoryFanfare();
      sound.keyUnlocked();
      setIsUnlocked(true);
      setShowVictoryModal(true);
      setErrorMsg(null);

      confetti({
        particleCount: 160,
        spread: 110,
        origin: { y: 0.5 },
        colors: ['#FEAEC9', '#9AD9EA', '#C7BFE8', '#F59E0B', '#10B981'],
      });

      onVictory();
      showNotification('🎉 7-LETTER CIPHER SOLVED! "CARECOR" UNLOCKED THE MAIN VAULT!');
    } else {
      sound.error();
      setErrorMsg(`"${normalized}" is incorrect. The clue is a 7-letter word!`);
    }
  };

  const handleDirectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.length === VAULT_WORD_LENGTH) {
      checkVaultCode(passcode);
    } else {
      setErrorMsg(`Please enter exactly 7 letters (${passcode.length}/7 entered).`);
    }
  };

  const preliminaryRoomsDone = completedRooms.filter((r) => r !== 'main_door').length;

  const alphabetRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['CLEAR', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACK'],
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 pb-28">
      {/* Room Header */}
      <div className="bg-white/90 border-2 border-[#C7BFE8] rounded-2xl p-5 mb-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#FEAEC9]/30 text-xs font-bold text-[#251B35] mb-1 border border-[#FEAEC9]">
            <DoorOpen className="w-3.5 h-3.5 text-amber-600" />
            <span>FINAL EXIT: MAIN VAULT DOOR</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#251B35]">
            7-Letter Word Cipher & Office Escape
          </h2>
          <p className="text-xs sm:text-sm text-[#251B35]/70 mt-0.5">
            The security vault lock is set to letters. Enter the 7-letter master word to disarm the alarm and escape the building!
          </p>
        </div>

        {/* Clue button */}
        <button
          onClick={() => {
            sound.click();
            setShowClueBook(!showClueBook);
          }}
          className="bg-white hover:bg-[#E8E0EE] text-[#251B35] px-3.5 py-2 rounded-xl border border-[#C7BFE8] flex items-center gap-2 text-xs font-bold transition shadow-xs cursor-pointer"
        >
          <BookOpen className="w-4 h-4 text-purple-700" />
          <span>{showClueBook ? 'Hide 7-Letter Clue' : 'Show 7-Letter Clue'}</span>
        </button>
      </div>

      {/* Clue Panel */}
      {showClueBook && (
        <div className="mb-6 bg-white/95 rounded-2xl border-2 border-[#FEAEC9] p-5 shadow-md animate-in fade-in">
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
            <span className="text-xs font-black uppercase text-[#251B35] tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-700" />
              Master 7-Letter Vault Clue
            </span>
            <span className="text-xs text-emerald-700 font-bold">
              {preliminaryRoomsDone}/7 Rooms Cleared
            </span>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-r from-pink-50 via-purple-50 to-sky-50 border border-purple-200 text-xs text-[#251B35] leading-relaxed">
            <div className="font-extrabold text-sm text-purple-900 mb-1">
              "The 7-Letter Clue:"
            </div>
            <p>
              A 7-letter word that represents this workplace and unites all 8 departments.
              Think of the building you are standing in right now.
            </p>
            <div className="mt-2 font-mono font-bold text-purple-800 text-xs">
              Letters: _ _ _ _ _ _ _ (7 Letters)
            </div>
          </div>
        </div>
      )}

      {/* Main Vault Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Vault Door Graphic (6 Cols) */}
        <div className="lg:col-span-6 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 rounded-3xl border-4 border-[#C7BFE8] p-6 shadow-2xl text-white flex flex-col justify-between min-h-[460px]">
          <div>
            <div className="flex items-center justify-between border-b border-slate-700 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    isUnlocked ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'
                  }`}
                />
                <span className="text-xs font-mono tracking-widest uppercase text-slate-300">
                  CARECOR SECURITY • 7-LETTER CIPHER
                </span>
              </div>
              <span className="text-xs font-mono text-[#9AD9EA]">
                {isUnlocked ? 'VAULT OPEN' : 'VAULT SEALED'}
              </span>
            </div>

            {/* Heavy Vault Wheel */}
            <div className="relative h-60 w-full bg-slate-950 rounded-2xl border-2 border-slate-700 flex items-center justify-center overflow-hidden mb-4">
              <div
                className={`relative w-44 h-44 rounded-full border-8 transition-transform duration-1000 flex items-center justify-center ${
                  isUnlocked
                    ? 'border-emerald-400 rotate-180 shadow-[0_0_40px_rgba(52,211,153,0.6)]'
                    : 'border-slate-600 shadow-inner'
                }`}
              >
                <div className="absolute w-full h-3 bg-slate-700" />
                <div className="absolute h-full w-3 bg-slate-700" />
                <div className="absolute w-full h-3 bg-slate-700 rotate-45" />
                <div className="absolute w-full h-3 bg-slate-700 -rotate-45" />

                <div className="w-16 h-16 rounded-full bg-slate-800 border-4 border-slate-500 flex items-center justify-center z-10 shadow-lg">
                  {isUnlocked ? (
                    <Unlock className="w-8 h-8 text-emerald-400" />
                  ) : (
                    <Lock className="w-8 h-8 text-rose-400" />
                  )}
                </div>
              </div>

              <div className="absolute bottom-2 inset-x-4 text-center">
                <span
                  className={`text-[11px] font-mono font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                    isUnlocked
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500'
                  }`}
                >
                  {isUnlocked ? 'DOOR DISARMED — READY TO EXIT' : '7 LETTERS REQUIRED TO ESCAPE'}
                </span>
              </div>
            </div>

            {/* 7-Letter Vault Tumbler Display on Door */}
            <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-700 text-center">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">
                Vault Tumblers (7 Letters)
              </div>
              <div className="flex items-center justify-center gap-1.5">
                {Array.from({ length: VAULT_WORD_LENGTH }).map((_, i) => {
                  const letter = passcode[i];
                  return (
                    <div
                      key={i}
                      className={`w-9 h-11 rounded-lg border-2 flex items-center justify-center font-mono text-lg font-black transition-all ${
                        isUnlocked
                          ? 'bg-emerald-950 border-emerald-400 text-emerald-300 shadow-[0_0_10px_rgba(52,211,153,0.5)]'
                          : letter
                          ? 'bg-slate-800 border-[#9AD9EA] text-[#9AD9EA]'
                          : 'bg-slate-900 border-slate-700 text-slate-600'
                      }`}
                    >
                      {letter || '_'}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>ESCAPE TIMER: {formatTime(elapsedSeconds)}</span>
            <span>LETTERS: {passcode.length} / 7</span>
          </div>
        </div>

        {/* Right Column: Letters Alphabet Keypad (6 Cols) */}
        <div className="lg:col-span-6 bg-white/95 rounded-3xl border-4 border-[#C7BFE8] p-6 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-purple-700" />
                <span className="text-xs font-black uppercase text-[#251B35] tracking-wider">
                  Letter Keypad Terminal
                </span>
              </div>
              <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                7 Letters Clue
              </span>
            </div>

            {/* Input Blanks Display */}
            <div className="bg-slate-950 rounded-2xl p-4 mb-4 border-2 border-slate-800 text-center font-mono">
              <div className="text-[10px] uppercase text-slate-400 mb-1 tracking-widest">
                ENTER 7-LETTER WORD:
              </div>
              <div className="flex items-center justify-center gap-2 min-h-[38px]">
                {Array.from({ length: 7 }).map((_, idx) => (
                  <span
                    key={idx}
                    className={`w-8 h-9 border-b-2 flex items-center justify-center text-lg font-black ${
                      passcode[idx]
                        ? 'text-[#9AD9EA] border-[#9AD9EA] bg-slate-900 rounded-xs'
                        : 'text-slate-600 border-slate-700'
                    }`}
                  >
                    {passcode[idx] || '_'}
                  </span>
                ))}
              </div>
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-700 text-xs font-semibold flex items-center gap-2 mb-3">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Direct input for keyboard users */}
            <form onSubmit={handleDirectSubmit} className="mb-3">
              <input
                type="text"
                maxLength={7}
                value={passcode}
                onChange={(e) => {
                  const cleaned = e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 7);
                  setPasscode(cleaned);
                  if (cleaned.length === 7) {
                    checkVaultCode(cleaned);
                  }
                }}
                placeholder="Type 7-letter word here..."
                className="w-full px-3 py-2 rounded-xl border-2 border-[#C7BFE8] text-xs font-mono font-black tracking-widest text-center uppercase bg-white focus:outline-hidden focus:border-[#FEAEC9]"
              />
            </form>

            {/* On-Screen Letter Alphabet Keyboard */}
            <div className="space-y-1.5">
              {alphabetRows.map((row, rIdx) => (
                <div key={rIdx} className="flex justify-center gap-1 sm:gap-1.5">
                  {row.map((btn) => (
                    <button
                      key={btn}
                      type="button"
                      onClick={() => handleKeyPress(btn)}
                      className={`h-10 rounded-lg text-xs font-black transition-all flex items-center justify-center cursor-pointer ${
                        btn === 'CLEAR'
                          ? 'px-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                          : btn === 'BACK'
                          ? 'px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
                          : 'w-7 sm:w-9 bg-white hover:bg-[#E8E0EE] text-[#251B35] border border-[#C7BFE8] shadow-2xs active:scale-95'
                      }`}
                    >
                      {btn}
                    </button>
                  ))}
                </div>
              ))}
            </div>


          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={() => checkVaultCode(passcode)}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#FEAEC9] via-[#C7BFE8] to-[#9AD9EA] text-[#251B35] font-black text-xs uppercase tracking-wider hover:opacity-95 shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Unlock className="w-4 h-4 text-emerald-800" />
              <span>Verify 7-Letter Passcode & Open Vault</span>
            </button>
          </div>
        </div>
      </div>

      {/* GRAND CONGRATULATIONS VICTORY POPUP MODAL */}
      {showVictoryModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl border-4 border-[#FEAEC9] max-w-2xl w-full p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 max-h-[92vh] overflow-y-auto text-center">
            {/* Crown & Trophy */}
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#FEAEC9] to-[#9AD9EA] flex items-center justify-center mx-auto mb-3 shadow-lg border-2 border-white animate-bounce">
              <Trophy className="w-8 h-8 text-[#251B35]" />
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>OFFICE ESCAPE MISSION ACCOMPLISHED!</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-[#251B35] tracking-tight">
              Congratulations, CARECOR Team!
            </h2>
            <p className="text-xs sm:text-sm text-[#251B35]/70 max-w-lg mx-auto mt-2">
              You cracked the 7-letter vault passcode <strong>"CARECOR"</strong>, honored 8 coworkers, snapped the actual team pose, and escaped the office lockdown!
            </p>

            {/* Team Photo Highlight */}
            <div className="my-5 rounded-2xl overflow-hidden border-4 border-[#C7BFE8] bg-slate-100 shadow-md max-w-md mx-auto">
              <img
                src="/carecor_team.jpg"
                alt="CARECOR Team Celebration"
                className="w-full h-auto max-h-[260px] object-cover"
              />
              <div className="p-2.5 bg-gradient-to-r from-[#FEAEC9]/50 via-[#C7BFE8]/50 to-[#9AD9EA]/50 text-xs font-black text-[#251B35]">
                🎉 CARECOR OFFICE ESCAPE CHAMPIONS 🎉
              </div>
            </div>

            {/* Escape Stats Summary */}
            <div className="grid grid-cols-3 gap-3 mb-6 max-w-lg mx-auto">
              <div className="bg-[#E8E0EE] p-3 rounded-2xl border border-[#C7BFE8]">
                <Clock className="w-4 h-4 text-purple-700 mx-auto mb-1" />
                <div className="text-[10px] uppercase font-bold text-[#251B35]/60">Total Time</div>
                <div className="text-base font-black text-[#251B35]">{formatTime(elapsedSeconds)}</div>
              </div>

              <div className="bg-[#9AD9EA]/25 p-3 rounded-2xl border border-[#9AD9EA]">
                <Key className="w-4 h-4 text-amber-500 fill-amber-400 mx-auto mb-1" />
                <div className="text-[10px] uppercase font-bold text-[#251B35]/60">Keys Found</div>
                <div className="text-base font-black text-[#251B35]">8 / 8 Keys</div>
              </div>

              <div className="bg-[#FEAEC9]/25 p-3 rounded-2xl border border-[#FEAEC9]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                <div className="text-[10px] uppercase font-bold text-[#251B35]/60">Synergy Rate</div>
                <div className="text-base font-black text-[#251B35]">100%</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  sound.click();
                  setShowVictoryModal(false);
                }}
                className="w-full sm:w-auto py-3 px-5 rounded-xl border border-slate-300 font-bold text-xs text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Inspect Vault Door
              </button>
              <button
                onClick={() => {
                  sound.click();
                  window.location.reload();
                }}
                className="w-full sm:w-auto py-3 px-6 rounded-xl bg-gradient-to-r from-[#FEAEC9] via-[#C7BFE8] to-[#9AD9EA] text-[#251B35] font-black text-xs uppercase tracking-wider hover:opacity-95 shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Play Again</span>
              </button>
              <button
                onClick={() => {
                  sound.click();
                  onExitGame();
                }}
                className="w-full sm:w-auto py-3 px-6 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 cursor-pointer transition"
              >
                <span>🚪 Exit Office & Finish</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
