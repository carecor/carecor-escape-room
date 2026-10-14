import React, { useState } from 'react';
import {
  CheckCircle2,
  Sparkles,
  Key,
  HelpCircle,
  AlertCircle,
  FileQuestion,
  Users,
  Send,
  Award,
} from 'lucide-react';
import { RebusPuzzle } from '../../types/game';
import { sound } from '../../utils/sound';

interface MeetingRoomProps {
  onEarnKey: () => void;
  isCompleted: boolean;
  showNotification: (msg: string) => void;
}

const REBUS_PUZZLES: RebusPuzzle[] = [
  {
    id: 1,
    title: 'Rebus #1',
    answer: 'PUNCTUALITY',
    visualClues: [
      { emoji: '🥊', label: 'PUNCH (minus H)' },
      { emoji: '➕', label: 'plus' },
      { emoji: '⏰', label: 'TICK / TUA' },
      { emoji: '➕', label: 'plus' },
      { emoji: '☕', label: 'TEA (LITY)' },
    ],
    hint: 'Arriving and beginning work right on time every day.',
  },
  {
    id: 2,
    title: 'Rebus #2',
    answer: 'TIME MANAGEMENT',
    visualClues: [
      { emoji: '⏳', label: 'TIME' },
      { emoji: '➕', label: 'plus' },
      { emoji: '👨‍💼', label: 'MAN' },
      { emoji: '➕', label: 'plus' },
      { emoji: '🎂', label: 'AGE' },
      { emoji: '➕', label: 'plus' },
      { emoji: '⛺', label: 'MENT' },
    ],
    hint: 'Planning and executing your day efficiently without rushing.',
  },
  {
    id: 3,
    title: 'Rebus #3',
    answer: 'COOPERATION',
    visualClues: [
      { emoji: '🐔', label: 'COOP' },
      { emoji: '➕', label: 'plus' },
      { emoji: '⚙️', label: 'OPERATION' },
    ],
    hint: 'Working harmoniously with peers to accomplish team milestones.',
  },
  {
    id: 4,
    title: 'Rebus #4',
    answer: 'INITIATIVE',
    visualClues: [
      { emoji: '💡', label: 'IN' },
      { emoji: '➕', label: 'plus' },
      { emoji: '👁️', label: 'I' },
      { emoji: '➕', label: 'plus' },
      { emoji: '🏃', label: 'TIATIVE' },
    ],
    hint: 'Taking proactive action and solving problems before being asked.',
  },
  {
    id: 5,
    title: 'Rebus #5',
    answer: 'CLEANLINESS',
    visualClues: [
      { emoji: '🧼', label: 'CLEAN' },
      { emoji: '➕', label: 'plus' },
      { emoji: '🦁', label: 'LI' },
      { emoji: '➕', label: 'plus' },
      { emoji: '🎯', label: 'NESS' },
    ],
    hint: 'Keeping your desk and shared workspace neat, hygienic, and organized.',
  },
  {
    id: 6,
    title: 'Rebus #6',
    answer: 'HELPFULNESS',
    visualClues: [
      { emoji: '🛟', label: 'HELP' },
      { emoji: '➕', label: 'plus' },
      { emoji: '🌕', label: 'FULL' },
      { emoji: '➕', label: 'plus' },
      { emoji: '🦕', label: 'NESS' },
    ],
    hint: 'Readily offering assistance to colleagues who are facing challenges.',
  },
  {
    id: 7,
    title: 'Rebus #7',
    answer: 'RELIABLE',
    visualClues: [
      { emoji: '🔁', label: 'RE' },
      { emoji: '➕', label: 'plus' },
      { emoji: '🤥', label: 'LIE' },
      { emoji: '➕', label: 'plus' },
      { emoji: '🐂', label: 'ABLE / BULL' },
    ],
    hint: 'Being consistently dependable in high-pressure situations.',
  },
  {
    id: 8,
    title: 'Rebus #8',
    answer: 'EMPATHY',
    visualClues: [
      { emoji: 'Ⓜ️', label: 'M' },
      { emoji: '➕', label: 'plus' },
      { emoji: '🛣️', label: 'PATH' },
      { emoji: '➕', label: 'plus' },
      { emoji: '🍵', label: 'TEA / Y' },
    ],
    hint: 'Actively listening and understanding what teammates are going through.',
  },
  {
    id: 9,
    title: 'Rebus #9',
    answer: 'TEAMWORK',
    visualClues: [
      { emoji: '👥', label: 'TEAM' },
      { emoji: '➕', label: 'plus' },
      { emoji: '🔨', label: 'WORK' },
    ],
    hint: 'Combining diverse skills together to achieve what one cannot alone.',
  },
  {
    id: 10,
    title: 'Rebus #10',
    answer: 'KINDNESS',
    visualClues: [
      { emoji: '👑', label: 'KIN (G)' },
      { emoji: '➕', label: 'plus' },
      { emoji: '🦌', label: 'D (EER)' },
      { emoji: '➕', label: 'plus' },
      { emoji: '🕸️', label: 'NESS' },
    ],
    hint: 'Approaching every interaction with warmth, respect, and care.',
  },
];

export const MeetingRoom: React.FC<MeetingRoomProps> = ({
  onEarnKey,
  isCompleted,
  showNotification,
}) => {
  const [solvedIds, setSolvedIds] = useState<number[]>(
    isCompleted ? REBUS_PUZZLES.map((p) => p.id) : []
  );
  const [activeRebus, setActiveRebus] = useState<RebusPuzzle | null>(null);
  const [inputValues, setInputValues] = useState<{ [id: number]: string }>({});
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Final Question state
  const [showFinalModal, setShowFinalModal] = useState(false);
  const [responsibilityPledge, setResponsibilityPledge] = useState(
    isCompleted ? 'Always deliver quality work with integrity, support my colleagues, and uphold CARECOR values.' : ''
  );
  const [doorUnlocked, setDoorUnlocked] = useState(isCompleted);

  const handleOpenRebus = (puzzle: RebusPuzzle) => {
    sound.click();
    setActiveRebus(puzzle);
    setErrorMsg(null);
  };

  const normalize = (str: string) => str.trim().toUpperCase().replace(/[^A-Z]/g, '');

  const handleSubmitRebus = (puzzle: RebusPuzzle) => {
    const raw = normalize(inputValues[puzzle.id] || '');
    const target = normalize(puzzle.answer);

    const isMatch =
      raw === target ||
      (puzzle.id === 2 &&
        (raw === 'TIMEMANAGEMENT' ||
          raw === 'TIMEMANAGE' ||
          raw === 'TIMEMANAGMENT' ||
          raw === 'TIME'));

    if (isMatch) {
      sound.correct();
      sound.itemFound();
      setErrorMsg(null);
      const nextSolved = [...solvedIds, puzzle.id];
      setSolvedIds(nextSolved);
      showNotification(`Brilliant! Rebus solved: "${puzzle.answer}"!`);
      setActiveRebus(null);

      // If all 10 rebuses are finished, prompt final question popup!
      if (nextSolved.length === REBUS_PUZZLES.length) {
        setTimeout(() => {
          setShowFinalModal(true);
        }, 400);
      }
    } else {
      sound.error();
      setErrorMsg('Not quite! Check the visual clues and hint carefully.');
    }
  };

  const handleFinalQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!responsibilityPledge.trim()) {
      showNotification('Please share your thoughts on an employee responsibility.');
      return;
    }
    sound.victoryFanfare();
    sound.keyUnlocked();
    setShowFinalModal(false);
    setDoorUnlocked(true);
    onEarnKey();
    showNotification('🎉 Awesome! Your employee responsibility pledge was accepted! Responsibility Key granted!');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 pb-28">
      {/* Room Header */}
      <div className="bg-white/90 border-2 border-[#C7BFE8] rounded-2xl p-5 mb-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#FEAEC9]/30 text-xs font-bold text-[#251B35] mb-1 border border-[#FEAEC9]">
            <Sparkles className="w-3.5 h-3.5 text-purple-700" />
            <span>ROOM 3: MEETING ROOM</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#251B35]">
            Responsibility of an Employee
          </h2>
          <p className="text-xs sm:text-sm text-[#251B35]/70 mt-0.5">
            Decipher the 10 visual Picture Rebuses, then answer the final question to unlock the Meeting Room Key.
          </p>
        </div>

        {/* Progress Counter */}
        <div className="flex items-center gap-3">
          <div className="bg-[#E8E0EE] px-3 py-2 rounded-xl border border-[#C7BFE8] text-center">
            <div className="text-[10px] uppercase font-bold text-[#251B35]/60">Rebuses Solved</div>
            <div className="text-base font-black text-[#251B35]">
              {solvedIds.length} / 10
            </div>
          </div>
          {doorUnlocked ? (
            <div className="bg-emerald-100 text-emerald-800 px-3 py-2 rounded-xl border border-emerald-300 flex items-center gap-1.5 font-bold text-xs animate-bounce">
              <Key className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span>Door Unlocked!</span>
            </div>
          ) : solvedIds.length === 10 ? (
            <button
              onClick={() => setShowFinalModal(true)}
              className="bg-amber-100 hover:bg-amber-200 text-amber-900 px-3 py-2 rounded-xl border border-amber-300 flex items-center gap-1.5 font-bold text-xs animate-pulse cursor-pointer"
            >
              <FileQuestion className="w-4 h-4 text-amber-600" />
              <span>Answer Final Question!</span>
            </button>
          ) : null}
        </div>
      </div>

      {/* Meeting Room Whiteboard displaying pledged responsibility if submitted */}
      {responsibilityPledge && doorUnlocked && (
        <div className="mb-6 bg-white/95 border-2 border-emerald-300 rounded-2xl p-4 shadow-sm flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black shrink-0">
            📌
          </div>
          <div className="flex-1">
            <span className="text-xs font-black uppercase text-emerald-800 tracking-wider">
              Meeting Whiteboard • Your Employee Responsibility Statement:
            </span>
            <p className="text-sm font-medium text-[#251B35] italic mt-1">
              "{responsibilityPledge}"
            </p>
          </div>
        </div>
      )}

      {/* 10 Picture Rebuses Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {REBUS_PUZZLES.map((puzzle) => {
          const isSolved = solvedIds.includes(puzzle.id);

          return (
            <div
              key={puzzle.id}
              onClick={() => handleOpenRebus(puzzle)}
              className={`group cursor-pointer rounded-2xl border-2 p-4 transition-all duration-300 flex flex-col justify-between ${
                isSolved
                  ? 'bg-emerald-50/50 border-emerald-300 shadow-xs'
                  : 'bg-white hover:border-[#FEAEC9] border-[#C7BFE8] hover:shadow-lg hover:-translate-y-1'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-extrabold text-[#251B35]/70">
                    {puzzle.title}
                  </span>
                  {isSolved ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Solved
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-[#251B35]/60 bg-[#9AD9EA]/25 px-2 py-0.5 rounded-full">
                      Click to Solve
                    </span>
                  )}
                </div>

                {/* Rebus visual preview */}
                <div className="bg-[#E8E0EE]/50 rounded-xl p-3 mb-3 border border-[#C7BFE8] flex flex-wrap items-center justify-center gap-1.5 min-h-[70px]">
                  {puzzle.visualClues.map((c, i) => (
                    <span key={i} className="text-lg sm:text-xl" title={c.label}>
                      {c.emoji}
                    </span>
                  ))}
                </div>

                <p className="text-xs text-[#251B35]/70 line-clamp-2 leading-relaxed">
                  {puzzle.hint}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                {isSolved ? (
                  <span className="text-emerald-700 font-mono text-xs">
                    {puzzle.answer}
                  </span>
                ) : (
                  <span className="text-[#251B35] group-hover:text-purple-700 flex items-center gap-1">
                    <span>Solve Rebus</span> &rarr;
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Individual Rebus Modal */}
      {activeRebus && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl border-4 border-[#C7BFE8] max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4 border-b border-[#C7BFE8] pb-3">
              <div>
                <h3 className="text-lg font-black text-[#251B35]">
                  Picture Rebus: {activeRebus.title}
                </h3>
                <span className="text-xs text-[#251B35]/70">
                  Combine the emoji symbols to discover the workplace responsibility.
                </span>
              </div>
              <button
                onClick={() => setActiveRebus(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Visual Rebus Equation */}
            <div className="bg-gradient-to-r from-[#FEAEC9]/20 via-[#C7BFE8]/30 to-[#9AD9EA]/20 rounded-2xl p-5 mb-4 border-2 border-[#C7BFE8] flex flex-wrap items-center justify-center gap-3">
              {activeRebus.visualClues.map((clue, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center bg-white/90 px-3 py-2 rounded-xl shadow-xs border border-white"
                >
                  <span className="text-3xl sm:text-4xl">{clue.emoji}</span>
                  <span className="text-[10px] font-bold text-[#251B35]/70 mt-1 uppercase">
                    {clue.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Hint & Spaces */}
            <div className="mb-4 bg-sky-50 border border-sky-200 p-3 rounded-xl flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
              <div className="text-xs text-sky-900">
                <strong>Clue: </strong>
                {activeRebus.hint}
              </div>
            </div>

            {/* Letter Count & Blanks */}
            <div className="mb-4 text-center">
              <span className="text-xs font-bold text-[#251B35]/70 uppercase block mb-1">
                Letter Count: {activeRebus.answer.replace(/\s+/g, '').length} Characters
              </span>
              <div className="flex flex-wrap items-center justify-center gap-3 font-mono text-sm font-bold text-[#251B35]">
                {(() => {
                  let charCounter = 0;
                  const rawTyped = (inputValues[activeRebus.id] || '').replace(/[^A-Za-z0-9]/g, '');
                  return activeRebus.answer.split(' ').map((word, wordIdx) => (
                    <div key={wordIdx} className="flex items-center gap-1 bg-white/70 px-2 py-1 rounded-lg border border-slate-200 shadow-2xs">
                      {word.split('').map((_, cIdx) => {
                        const currentCharIndex = charCounter++;
                        const typedChar = rawTyped[currentCharIndex];
                        return (
                          <span
                            key={cIdx}
                            className="w-7 h-8 border-b-2 border-[#251B35] flex items-center justify-center bg-slate-50 rounded-xs"
                          >
                            {typedChar ? typedChar.toUpperCase() : '_'}
                          </span>
                        );
                      })}
                    </div>
                  ));
                })()}
              </div>
            </div>

            {/* Answer Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmitRebus(activeRebus);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-[#251B35] uppercase mb-1">
                  Enter Your Guess:
                </label>
                <input
                  type="text"
                  autoFocus
                  value={inputValues[activeRebus.id] || ''}
                  onChange={(e) =>
                    setInputValues({
                      ...inputValues,
                      [activeRebus.id]: e.target.value.toUpperCase(),
                    })
                  }
                  placeholder="Type the word or phrase..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#C7BFE8] focus:border-[#FEAEC9] focus:outline-hidden font-bold tracking-wider uppercase text-[#251B35] bg-white shadow-xs"
                />
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-700 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveRebus(null)}
                  className="w-1/3 py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#FEAEC9] to-[#C7BFE8] text-[#251B35] font-black text-xs uppercase tracking-wider hover:opacity-95 shadow-md active:scale-98 cursor-pointer"
                >
                  Verify Rebus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Final Question Popup Modal */}
      {showFinalModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl border-4 border-[#FEAEC9] max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95">
            <div className="text-center mb-5">
              <div className="w-12 h-12 rounded-2xl bg-[#FEAEC9]/40 text-[#251B35] mx-auto flex items-center justify-center mb-2 shadow-xs">
                <Award className="w-6 h-6 text-purple-700" />
              </div>
              <h3 className="text-xl font-black text-[#251B35]">
                Final Challenge: Employee Pledge
              </h3>
              <p className="text-xs text-[#251B35]/70 mt-1">
                You solved all 10 Picture Rebuses! Now answer the final prompt to claim the Responsibility Room Key:
              </p>
            </div>

            <div className="bg-[#E8E0EE]/60 rounded-2xl p-4 mb-4 border border-[#C7BFE8] text-center">
              <h4 className="text-base font-black text-[#251B35]">
                "As an employee, what is your responsibility?"
              </h4>
              <p className="text-[11px] text-[#251B35]/60 mt-1">
                (Share your authentic reflection. Whatever you submit will be honored!)
              </p>
            </div>

            <form onSubmit={handleFinalQuestionSubmit} className="space-y-4">
              <div>
                <textarea
                  rows={3}
                  required
                  autoFocus
                  value={responsibilityPledge}
                  onChange={(e) => setResponsibilityPledge(e.target.value)}
                  placeholder="e.g. To do my best with sincerity, collaborate openly with my team, and bring positive energy..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#C7BFE8] focus:border-[#FEAEC9] focus:outline-hidden text-sm font-medium text-[#251B35] bg-white shadow-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-[#FEAEC9] via-[#C7BFE8] to-[#9AD9EA] text-[#251B35] font-black text-sm uppercase tracking-wider hover:opacity-95 shadow-lg active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Key className="w-4 h-4 text-amber-600 fill-amber-500" />
                <span>Submit & Unlock Meeting Room Door</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
