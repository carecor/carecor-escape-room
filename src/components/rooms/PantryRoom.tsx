import React, { useState } from 'react';
import {
  Coffee,
  CheckCircle2,
  Sparkles,
  Key,
  HelpCircle,
  AlertCircle,
  Refrigerator,
  Microwave,
  Utensils,
  Maximize2,
  Lock,
} from 'lucide-react';
import { PantryQuestion } from '../../types/game';
import { sound } from '../../utils/sound';

interface PantryRoomProps {
  onEarnKey: () => void;
  isCompleted: boolean;
  showNotification: (msg: string) => void;
}

const PANTRY_QUESTIONS: PantryQuestion[] = [
  {
    id: 1,
    item: 'Refrigerator',
    question: 'What attitude is shown when an employee helps coworkers without expecting anything in return?',
    answer: 'KINDNESS',
    keyNumber: 3,
    clue: 'Synonyms: Benevolence, generosity, warm-hearted goodwill',
    icon: 'refrigerator',
  },
  {
    id: 2,
    item: 'Microwave',
    question: 'What do you call an employee who always tells the truth, even when nobody is watching?',
    answer: 'HONESTY',
    keyNumber: 8,
    clue: 'Synonyms: Truthfulness, integrity, sincere uprightness',
    icon: 'microwave',
  },
  {
    id: 3,
    item: 'Pantry Table',
    question: 'What is missing when an employee constantly interrupts others during meetings?',
    answer: 'RESPECT',
    keyNumber: 2,
    clue: 'Synonyms: Courtesy, deference, esteem, consideration',
    icon: 'table',
  },
  {
    id: 4,
    item: 'Dining Chair',
    question: 'You speak politely even when you disagree with someone. What attitude is this?',
    answer: 'PROFESSIONALISM',
    keyNumber: 9,
    clue: 'Synonyms: Workplace etiquette, composure, diplomatic conduct',
    icon: 'chair',
  },
  {
    id: 5,
    item: 'Kitchen Sink',
    question: 'You accept the result of your actions instead of blaming others. What quality is this?',
    answer: 'ACCOUNTABILITY',
    keyNumber: 1,
    clue: 'Synonyms: Answerability, ownership, accepting responsibility',
    icon: 'sink',
  },
  {
    id: 6,
    item: 'Potted Herb Plants',
    question: 'You complete your work carefully and correctly. What quality is this?',
    answer: 'ACCURACY',
    keyNumber: 10,
    clue: 'Synonyms: Precision, exactness, meticulous correctness',
    icon: 'plant',
  },
  {
    id: 7,
    item: 'Silverware Utensils',
    question: 'You accept corrections without getting angry. What attitude is this?',
    answer: 'OPENNESS',
    keyNumber: 5,
    clue: 'Synonyms: Receptiveness, teachability, open-mindedness',
    icon: 'utensils',
  },
  {
    id: 8,
    item: 'Snack Cabinet',
    question: 'You finish your assigned task without being reminded. What quality is this?',
    answer: 'RESPONSIBILITY',
    keyNumber: 7,
    clue: 'Synonyms: Diligence, dependability, taking charge of duty',
    icon: 'cabinet',
  },
  {
    id: 9,
    item: 'Wall Photo Frame',
    question: 'Your coworker needs help and you assist them. What attitude is this?',
    answer: 'TEAMWORK',
    keyNumber: 4,
    clue: 'Synonyms: Collaboration, solidarity, joint partnership',
    icon: 'frame',
  },
  {
    id: 10,
    item: 'Espresso Coffee Machine',
    question: 'You stay calm when work becomes stressful. What quality is this?',
    answer: 'PATIENCE',
    keyNumber: 6,
    clue: 'Synonyms: Composure, endurance, serenity under pressure',
    icon: 'coffee',
  },
];

export const PantryRoom: React.FC<PantryRoomProps> = ({
  onEarnKey,
  isCompleted,
  showNotification,
}) => {
  const [activeQuestion, setActiveQuestion] = useState<PantryQuestion | null>(null);
  const [inputValues, setInputValues] = useState<{ [id: number]: string }>({});
  const [solvedIds, setSolvedIds] = useState<number[]>(
    isCompleted ? PANTRY_QUESTIONS.map((q) => q.id) : []
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [doorUnlocked, setDoorUnlocked] = useState(isCompleted);

  const handleOpenItem = (q: PantryQuestion) => {
    sound.click();
    setActiveQuestion(q);
    setErrorMsg(null);
  };

  const handleSubmitAnswer = (q: PantryQuestion) => {
    const raw = (inputValues[q.id] || '').trim().toUpperCase();
    if (raw === q.answer) {
      sound.correct();
      sound.keyUnlocked();
      setErrorMsg(null);
      const nextSolved = [...solvedIds, q.id];
      setSolvedIds(nextSolved);
      showNotification(`Correct! Answer: "${q.answer}" rewarded Key #${q.keyNumber}!`);

      if (nextSolved.length === PANTRY_QUESTIONS.length && !doorUnlocked) {
        setDoorUnlocked(true);
        onEarnKey();
        showNotification('🎉 All 10 Pantry Keys Collected! Pantry Door is now unlocked!');
      }
      setActiveQuestion(null);
    } else {
      sound.error();
      setErrorMsg(`Incorrect answer. Check the letter blanks (_ _ _) and synonyms clue!`);
    }
  };

  // Check key slots (1 to 10)
  const keySlots = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const isKeyOwned = (keyNum: number) => {
    const question = PANTRY_QUESTIONS.find((q) => q.keyNumber === keyNum);
    return question ? solvedIds.includes(question.id) : false;
  };

  const getItemEmoji = (item: string) => {
    switch (item) {
      case 'Refrigerator':
        return '🧊';
      case 'Microwave':
        return '📻';
      case 'Pantry Table':
        return '🍽️';
      case 'Dining Chair':
        return '🪑';
      case 'Kitchen Sink':
        return '🚰';
      case 'Potted Herb Plants':
        return '🪴';
      case 'Silverware Utensils':
        return '🍴';
      case 'Snack Cabinet':
        return '🍪';
      case 'Wall Photo Frame':
        return '🖼️';
      case 'Espresso Coffee Machine':
        return '☕';
      default:
        return '📦';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 pb-28">
      {/* Room Header */}
      <div className="bg-white/90 border-2 border-[#C7BFE8] rounded-2xl p-5 mb-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#9AD9EA]/30 text-xs font-bold text-[#251B35] mb-1 border border-[#9AD9EA]">
            <Sparkles className="w-3.5 h-3.5 text-blue-700" />
            <span>ROOM 2: PANTRY ROOM</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#251B35]">
            Attitude of an Employee
          </h2>
          <p className="text-xs sm:text-sm text-[#251B35]/70 mt-0.5">
            Click pantry appliances to answer logical questions about essential workplace attitudes and gather Keys #1 through #10.
          </p>
        </div>

        {/* Solved Progress Counter */}
        <div className="flex items-center gap-3">
          <div className="bg-[#E8E0EE] px-3 py-2 rounded-xl border border-[#C7BFE8] text-center">
            <div className="text-[10px] uppercase font-bold text-[#251B35]/60">Keys Collected</div>
            <div className="text-base font-black text-[#251B35]">
              {solvedIds.length} / 10
            </div>
          </div>
          {doorUnlocked && (
            <div className="bg-emerald-100 text-emerald-800 px-3 py-2 rounded-xl border border-emerald-300 flex items-center gap-1.5 font-bold text-xs animate-bounce">
              <Key className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span>Pantry Unlocked!</span>
            </div>
          )}
        </div>
      </div>

      {/* The 10-Key Rack Slot Board */}
      <div className="bg-white/95 rounded-2xl border-2 border-[#C7BFE8] p-4 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-amber-500 fill-amber-400" />
            <h3 className="text-xs font-black uppercase text-[#251B35] tracking-wider">
              Pantry Key Board (Keys #1 through #10)
            </h3>
          </div>
          <span className="text-xs text-[#251B35]/60 font-medium">
            Insert all 10 keys to unlock the pantry door
          </span>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {keySlots.map((num) => {
            const owned = isKeyOwned(num);
            return (
              <div
                key={num}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all ${
                  owned
                    ? 'bg-amber-50 border-amber-400 shadow-sm'
                    : 'bg-[#E8E0EE]/50 border-slate-200 opacity-60'
                }`}
              >
                <Key
                  className={`w-5 h-5 mb-1 ${
                    owned ? 'text-amber-500 fill-amber-400 animate-pulse' : 'text-slate-400'
                  }`}
                />
                <span className="text-[11px] font-extrabold text-[#251B35]">Key #{num}</span>
                <span className="text-[9px] text-[#251B35]/60">
                  {owned ? 'Inserted' : 'Missing'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Pantry Scene Appliances Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {PANTRY_QUESTIONS.map((q) => {
          const isSolved = solvedIds.includes(q.id);

          return (
            <div
              key={q.id}
              onClick={() => handleOpenItem(q)}
              className={`group cursor-pointer rounded-2xl border-2 p-4 transition-all duration-300 flex flex-col justify-between ${
                isSolved
                  ? 'bg-emerald-50/50 border-emerald-300 shadow-xs'
                  : 'bg-white hover:border-[#FEAEC9] border-[#C7BFE8] hover:shadow-lg hover:-translate-y-1'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{getItemEmoji(q.item)}</span>
                  {isSolved ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Key #{q.keyNumber}
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                      Key #{q.keyNumber}
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-extrabold text-[#251B35] mb-1">
                  {q.item}
                </h4>
                <p className="text-xs text-[#251B35]/70 line-clamp-2 leading-relaxed">
                  {q.question}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                {isSolved ? (
                  <span className="text-emerald-700 font-mono text-[11px]">
                    Answer: {q.answer}
                  </span>
                ) : (
                  <span className="text-[#251B35] group-hover:text-purple-700 flex items-center gap-1">
                    <span>Solve Appliance</span> &rarr;
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Question Modal Dialog */}
      {activeQuestion && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl border-4 border-[#C7BFE8] max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4 border-b border-[#C7BFE8] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getItemEmoji(activeQuestion.item)}</span>
                <div>
                  <h3 className="text-lg font-black text-[#251B35]">
                    {activeQuestion.item}
                  </h3>
                  <span className="text-xs text-amber-600 font-bold">
                    Reward: Key #{activeQuestion.keyNumber}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveQuestion(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Question description */}
            <div className="bg-[#E8E0EE]/50 rounded-2xl p-4 mb-4 border border-[#C7BFE8]">
              <p className="text-sm font-medium text-[#251B35] leading-relaxed">
                {activeQuestion.question}
              </p>
            </div>

            {/* Underscore blanks */}
            <div className="mb-4">
              <div className="text-xs font-bold text-[#251B35]/70 uppercase mb-1">
                Letter Blanks ({activeQuestion.answer.length} Letters):
              </div>
              <div className="flex flex-wrap items-center gap-1.5 justify-center py-2 bg-slate-50 rounded-xl border border-slate-200 font-mono font-bold text-sm text-[#251B35]">
                {activeQuestion.answer.split('').map((char, idx) => {
                  const typedChar = (inputValues[activeQuestion.id] || '')[idx];
                  return (
                    <span
                      key={idx}
                      className="w-7 h-8 border-b-2 border-[#251B35] flex items-center justify-center bg-white shadow-2xs rounded-xs"
                    >
                      {typedChar ? typedChar.toUpperCase() : '_'}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Extra Clue */}
            <div className="mb-4 bg-[#9AD9EA]/20 border border-[#9AD9EA] p-3 rounded-xl flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
              <div className="text-xs text-[#251B35]/80">
                <strong className="text-blue-900">Synonyms & Clue: </strong>
                {activeQuestion.clue}
              </div>
            </div>

            {/* Input field */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmitAnswer(activeQuestion);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-[#251B35] uppercase mb-1">
                  Your Answer:
                </label>
                <input
                  type="text"
                  autoFocus
                  maxLength={activeQuestion.answer.length + 5}
                  value={inputValues[activeQuestion.id] || ''}
                  onChange={(e) =>
                    setInputValues({
                      ...inputValues,
                      [activeQuestion.id]: e.target.value.toUpperCase(),
                    })
                  }
                  placeholder={`Type the ${activeQuestion.answer.length}-letter word...`}
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
                  onClick={() => setActiveQuestion(null)}
                  className="w-1/3 py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#FEAEC9] to-[#C7BFE8] text-[#251B35] font-black text-xs uppercase tracking-wider hover:opacity-95 shadow-md active:scale-98 cursor-pointer"
                >
                  Submit & Collect Key #{activeQuestion.keyNumber}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
