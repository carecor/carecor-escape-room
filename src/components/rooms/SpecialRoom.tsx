import React, { useState, useEffect } from 'react';
import {
  Heart,
  Sparkles,
  Key,
  CheckCircle2,
  Clock,
  Play,
  Users,
  UserCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { EMPLOYEES, AppreciationRecord } from '../../types/game';
import { sound } from '../../utils/sound';

interface SpecialRoomProps {
  onEarnKey: () => void;
  isCompleted: boolean;
  showNotification: (msg: string) => void;
}

export const SpecialRoom: React.FC<SpecialRoomProps> = ({
  onEarnKey,
  isCompleted,
  showNotification,
}) => {
  const TOTAL_PERSONS_REQUIRED = 8;
  const TIMER_SECONDS_PER_PERSON = 20;

  const [currentPersonIndex, setCurrentPersonIndex] = useState<number>(isCompleted ? 8 : 0);
  const [speakerName, setSpeakerName] = useState<string>(EMPLOYEES[0] || 'Teammate 1');
  const [recipient, setRecipient] = useState<string>('Entire CARECOR Team');
  const [message, setMessage] = useState<string>('');
  const [secondsLeft, setSecondsLeft] = useState<number>(TIMER_SECONDS_PER_PERSON);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [appreciationList, setAppreciationList] = useState<AppreciationRecord[]>([]);
  const [doorUnlocked, setDoorUnlocked] = useState<boolean>(isCompleted);

  // Default suggested heartfelt messages
  const defaultPrompts = [
    'Thank you for always lending a helping hand whenever deadlines get tight!',
    'Your cheerful smile and positive energy lift our entire department every single morning.',
    'I truly admire your high standard of work, precision, and dedication to our clients.',
    'Thank you for being so patient and explaining complex workflows with such kindness.',
    'Your creative ideas in our brainstorms always inspire me to think outside the box!',
    'I appreciate how calm and dependable you stay when unexpected work challenges arise.',
    'Thank you for actively listening to everyone’s input and making everyone feel valued.',
    'I am so grateful to share this workplace journey with such an outstanding team!',
  ];

  // Prepopulate message prompt based on current index
  useEffect(() => {
    if (!message && currentPersonIndex < TOTAL_PERSONS_REQUIRED) {
      setMessage(defaultPrompts[currentPersonIndex % defaultPrompts.length]);
      setSpeakerName(EMPLOYEES[currentPersonIndex % EMPLOYEES.length]);
    }
  }, [currentPersonIndex]);

  // 20-Second Countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimerRunning && secondsLeft > 0) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsTimerRunning(false);
            handleFinishPersonTurn();
            return 0;
          }
          sound.tick();
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, secondsLeft]);

  const handleStartPersonTimer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      showNotification('Please enter your appreciation message before starting the timer.');
      return;
    }
    sound.click();
    setSecondsLeft(TIMER_SECONDS_PER_PERSON);
    setIsTimerRunning(true);
    showNotification(
      `Person ${currentPersonIndex + 1} of 8 started their 20-second appreciation turn!`
    );
  };

  const handleFinishPersonTurn = () => {
    sound.correct();
    sound.itemFound();

    const newRecord: AppreciationRecord = {
      recipient: `${speakerName} &rarr; ${recipient}`,
      message,
      secondsElapsed: TIMER_SECONDS_PER_PERSON,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const nextList = [newRecord, ...appreciationList];
    setAppreciationList(nextList);

    const nextIndex = currentPersonIndex + 1;
    setCurrentPersonIndex(nextIndex);
    setSecondsLeft(TIMER_SECONDS_PER_PERSON);
    setMessage('');

    if (nextIndex >= TOTAL_PERSONS_REQUIRED) {
      // All 8 people finished!
      sound.victoryFanfare();
      sound.keyUnlocked();

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FEAEC9', '#9AD9EA', '#C7BFE8', '#F43F5E'],
      });

      setDoorUnlocked(true);
      onEarnKey();
      showNotification(
        '🎉 ALL 8 TEAM APPRECIATIONS COMPLETE! The Appreciation Vault opened! Relationship Key granted!'
      );
    } else {
      showNotification(
        `Person ${nextIndex} done! Ready for Person ${nextIndex + 1} of 8!`
      );
    }
  };

  const recipientOptions = ['Entire CARECOR Team', ...EMPLOYEES];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 pb-28">
      {/* Room Header */}
      <div className="bg-white/90 border-2 border-[#C7BFE8] rounded-2xl p-5 mb-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#FEAEC9]/30 text-xs font-bold text-[#251B35] mb-1 border border-[#FEAEC9]">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>ROOM 7: SPECIAL RELATIONSHIP ROOM</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#251B35]">
            Team Bond & Appreciation Sharing (8 People • 20s Each)
          </h2>
          <p className="text-xs sm:text-sm text-[#251B35]/70 mt-0.5">
            8 coworkers must each share words of genuine appreciation and complete their 20-second speaking session to unlock the door.
          </p>
        </div>

        {/* Counter */}
        <div className="flex items-center gap-3">
          <div className="bg-[#E8E0EE] px-3 py-2 rounded-xl border border-[#C7BFE8] text-center">
            <div className="text-[10px] uppercase font-bold text-[#251B35]/60">People Shared</div>
            <div className="text-base font-black text-[#251B35]">
              {Math.min(TOTAL_PERSONS_REQUIRED, currentPersonIndex)} / 8
            </div>
          </div>

          {doorUnlocked ? (
            <div className="bg-emerald-100 text-emerald-800 px-3 py-2 rounded-xl border border-emerald-300 flex items-center gap-1.5 font-bold text-xs animate-bounce">
              <Key className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span>Door Unlocked!</span>
            </div>
          ) : (
            <div className="bg-amber-50 text-amber-900 px-3 py-2 rounded-xl border border-amber-300 flex items-center gap-1.5 font-bold text-xs">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>{TOTAL_PERSONS_REQUIRED - currentPersonIndex} People Remaining</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress Dots Bar for 8 People */}
      <div className="bg-white/90 border-2 border-[#C7BFE8] rounded-2xl p-4 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-black uppercase text-[#251B35] tracking-wider">
            8-Person Turn Tracker:
          </span>
          <span className="text-xs font-bold text-purple-700">
            {currentPersonIndex >= TOTAL_PERSONS_REQUIRED
              ? 'All 8 turns satisfied! (100%)'
              : `Active Turn: Person ${currentPersonIndex + 1} of 8`}
          </span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {Array.from({ length: TOTAL_PERSONS_REQUIRED }).map((_, idx) => {
            const isCompletedPerson = idx < currentPersonIndex;
            const isCurrentPerson = idx === currentPersonIndex && !doorUnlocked;

            return (
              <div
                key={idx}
                className={`p-2 rounded-xl border-2 text-center transition-all ${
                  isCompletedPerson
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-800 font-bold'
                    : isCurrentPerson
                    ? 'bg-[#FEAEC9]/30 border-[#FEAEC9] font-black text-[#251B35] ring-2 ring-[#FEAEC9]'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                <div className="text-[10px] uppercase font-bold">Person #{idx + 1}</div>
                <div className="text-xs font-black mt-0.5">
                  {isCompletedPerson ? '✓ 20s Done' : isCurrentPerson ? 'Speaking' : 'Waiting'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form & 20-Second Countdown (7 Cols) */}
        <div className="lg:col-span-7 bg-white/95 rounded-3xl border-4 border-[#C7BFE8] p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-400" />
              <h3 className="text-base font-black text-[#251B35]">
                {currentPersonIndex >= TOTAL_PERSONS_REQUIRED
                  ? 'All 8 Members Have Shared Gratitude!'
                  : `Person #${currentPersonIndex + 1} of 8: Share Appreciation`}
              </h3>
            </div>
            <span className="text-xs font-bold text-slate-500">20 Seconds</span>
          </div>

          {currentPersonIndex < TOTAL_PERSONS_REQUIRED ? (
            <form onSubmit={handleStartPersonTimer} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Person Speaking */}
                <div>
                  <label className="block text-xs font-bold text-[#251B35] uppercase mb-1">
                    Person Speaking:
                  </label>
                  <select
                    value={speakerName}
                    disabled={isTimerRunning}
                    onChange={(e) => setSpeakerName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border-2 border-[#C7BFE8] focus:border-[#FEAEC9] focus:outline-hidden text-xs font-bold text-[#251B35] bg-white cursor-pointer"
                  >
                    {EMPLOYEES.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Recipient select */}
                <div>
                  <label className="block text-xs font-bold text-[#251B35] uppercase mb-1">
                    Appreciation Recipient:
                  </label>
                  <select
                    value={recipient}
                    disabled={isTimerRunning}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border-2 border-[#C7BFE8] focus:border-[#FEAEC9] focus:outline-hidden text-xs font-bold text-[#251B35] bg-white cursor-pointer"
                  >
                    {recipientOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-bold text-[#251B35] uppercase mb-1">
                  Words of Appreciation:
                </label>
                <textarea
                  rows={2}
                  required
                  disabled={isTimerRunning}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share what makes them an invaluable colleague..."
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-[#C7BFE8] focus:border-[#FEAEC9] focus:outline-hidden text-xs text-[#251B35] bg-white shadow-xs"
                />
              </div>

              {/* 20-Second Countdown Visual Ring */}
              <div className="bg-gradient-to-r from-[#FEAEC9]/20 via-[#C7BFE8]/25 to-[#9AD9EA]/20 rounded-2xl p-5 border-2 border-[#C7BFE8] text-center my-3">
                <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#E8E0EE"
                      strokeWidth="8"
                      fill="transparent"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke={secondsLeft <= 5 ? '#F43F5E' : '#9AD9EA'}
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={251}
                      strokeDashoffset={251 - (251 * (TIMER_SECONDS_PER_PERSON - secondsLeft)) / TIMER_SECONDS_PER_PERSON}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-linear"
                    />
                  </svg>

                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-mono text-2xl font-black text-[#251B35]">
                      {secondsLeft}s
                    </span>
                    <span className="text-[9px] uppercase font-bold text-[#251B35]/60">
                      {isTimerRunning ? 'Speaking' : 'Ready'}
                    </span>
                  </div>
                </div>

                <p className="text-xs font-bold text-[#251B35] mt-2">
                  {isTimerRunning
                    ? `${speakerName} is sharing appreciation to ${recipient}...`
                    : `Click below to start Person ${currentPersonIndex + 1}'s 20-second session`}
                </p>
              </div>

              {/* Action */}
              <div>
                {!isTimerRunning ? (
                  <button
                    type="submit"
                    className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-[#FEAEC9] via-[#C7BFE8] to-[#9AD9EA] text-[#251B35] font-black text-xs uppercase tracking-wider hover:opacity-95 shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Start 20s Sharing Timer (Person {currentPersonIndex + 1} of 8)</span>
                  </button>
                ) : (
                  <div className="w-full py-3 px-6 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 font-black text-xs uppercase tracking-wider text-center animate-pulse">
                    Person {currentPersonIndex + 1} speaking ({secondsLeft}s left)... Please listen attentively!
                  </div>
                )}
              </div>
            </form>
          ) : (
            <div className="p-6 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
              <h4 className="text-lg font-black text-[#251B35]">
                Full Team Synergy Accomplished!
              </h4>
              <p className="text-xs text-[#251B35]/70 mt-1">
                All 8 teammates completed their 20 seconds of appreciation. The Relationship Key is yours!
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Appreciation Vault & Gratitude Wall (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Treasure Box */}
          <div
            className={`rounded-3xl border-4 p-5 text-center transition-all ${
              doorUnlocked
                ? 'bg-gradient-to-b from-amber-50 to-orange-50 border-amber-400 shadow-xl'
                : 'bg-white border-[#C7BFE8] shadow-md'
            }`}
          >
            <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center text-3xl mb-2 bg-[#E8E0EE] border border-[#C7BFE8]">
              {doorUnlocked ? '🎁✨' : '📦🔒'}
            </div>

            <h4 className="text-sm font-black text-[#251B35]">
              {doorUnlocked
                ? 'Appreciation Vault Popped Open!'
                : 'Appreciation Vault (Requires 8 People)'}
            </h4>
            <p className="text-xs text-[#251B35]/70 mt-1">
              {doorUnlocked
                ? 'Team harmony achieved! Relationship Key revealed!'
                : `${TOTAL_PERSONS_REQUIRED - currentPersonIndex} more team members must complete their 20 seconds.`}
            </p>

            {doorUnlocked && (
              <div className="mt-3 pt-3 border-t border-amber-200">
                <div className="bg-emerald-100 text-emerald-800 p-2.5 rounded-xl border border-emerald-300 flex items-center justify-center gap-2 text-xs font-black">
                  <Key className="w-4 h-4 text-amber-500 fill-amber-400" />
                  <span>RELATIONSHIP KEY UNLOCKED!</span>
                </div>
              </div>
            )}
          </div>

          {/* Wall of Shared Appreciations */}
          <div className="bg-white/95 rounded-2xl border-2 border-[#C7BFE8] p-4 shadow-sm">
            <div className="flex items-center gap-1.5 text-xs font-black uppercase text-[#251B35] mb-2 pb-1 border-b border-slate-100">
              <Users className="w-3.5 h-3.5 text-purple-700" />
              <span>CARECOR Gratitude Wall ({appreciationList.length})</span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {appreciationList.length === 0 ? (
                <div className="text-xs text-[#251B35]/50 italic text-center py-4">
                  Shared appreciations will appear here after each 20s turn...
                </div>
              ) : (
                appreciationList.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-pink-50/60 border border-pink-200 text-xs"
                  >
                    <div className="flex items-center justify-between font-bold text-[#251B35] mb-0.5">
                      <span className="text-purple-900 font-extrabold">{item.recipient}</span>
                      <span className="text-[10px] text-slate-400">{item.timestamp}</span>
                    </div>
                    <p className="text-slate-700 italic text-[11px]">"{item.message}"</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
