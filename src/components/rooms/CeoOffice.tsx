import React, { useState } from 'react';
import {
  Award,
  Sparkles,
  Key,
  CheckCircle2,
  Crown,
  Heart,
  Star,
  Users,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { EMPLOYEES, AWARDS, EmployeeAwardRecord } from '../../types/game';
import { sound } from '../../utils/sound';

interface CeoOfficeProps {
  onEarnKey: () => void;
  isCompleted: boolean;
  showNotification: (msg: string) => void;
}

export const CeoOffice: React.FC<CeoOfficeProps> = ({
  onEarnKey,
  isCompleted,
  showNotification,
}) => {
  const REQUIRED_AWARDS = 8;

  const [selectedEmployee, setSelectedEmployee] = useState<string>(EMPLOYEES[0]);
  const [selectedAward, setSelectedAward] = useState<string>(AWARDS[0]);
  const [personalMessage, setPersonalMessage] = useState<string>('');
  const [awardHistory, setAwardHistory] = useState<EmployeeAwardRecord[]>([]);
  const [activeCertificate, setActiveCertificate] = useState<EmployeeAwardRecord | null>(null);
  const [doorUnlocked, setDoorUnlocked] = useState(isCompleted);

  const awardedEmployeeNames = awardHistory.map((a) => a.employee);

  const handleGrantAward = (e: React.FormEvent) => {
    e.preventDefault();
    sound.click();

    // Check if employee already awarded
    if (awardedEmployeeNames.includes(selectedEmployee)) {
      showNotification(`${selectedEmployee} has already received an excellence award! Please pick another colleague.`);
      return;
    }

    sound.itemFound();

    const newRecord: EmployeeAwardRecord = {
      employee: selectedEmployee,
      award: selectedAward,
      message:
        personalMessage.trim() ||
        `Recognized for exemplary demonstration of the ${selectedAward} spirit at CARECOR!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const nextHistory = [newRecord, ...awardHistory];
    setAwardHistory(nextHistory);
    setActiveCertificate(newRecord);

    const count = nextHistory.length;

    // Pick next unawarded employee automatically for convenience
    const nextUnawarded = EMPLOYEES.find((emp) => !nextHistory.some((a) => a.employee === emp));
    if (nextUnawarded) {
      setSelectedEmployee(nextUnawarded);
    }

    if (count >= REQUIRED_AWARDS && !doorUnlocked) {
      sound.victoryFanfare();
      sound.keyUnlocked();

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FEAEC9', '#9AD9EA', '#C7BFE8', '#F59E0B'],
      });

      setDoorUnlocked(true);
      onEarnKey();
      showNotification(
        `🎉 8 EMPLOYEES RECOGNIZED! Official CEO Golden Key Unlocked! Executive Suite open!`
      );
    } else {
      showNotification(
        `Award granted to ${selectedEmployee} (${count}/${REQUIRED_AWARDS} Employees Recognized)!`
      );
    }

    setPersonalMessage('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 pb-28">
      {/* Room Header */}
      <div className="bg-white/90 border-2 border-[#C7BFE8] rounded-2xl p-5 mb-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#FEAEC9]/30 text-xs font-bold text-[#251B35] mb-1 border border-[#FEAEC9]">
            <Crown className="w-3.5 h-3.5 text-amber-600" />
            <span>ROOM 4: CEO EXECUTIVE SUITE</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#251B35]">
            Excellence of Employee: Recognize 8 Coworkers
          </h2>
          <p className="text-xs sm:text-sm text-[#251B35]/70 mt-0.5">
            To unlock the CEO Office door, bestow official excellence awards upon <strong>8 distinct coworkers</strong> from the CARECOR roster.
          </p>
        </div>

        {/* Status */}
        <div className="flex items-center gap-3">
          <div className="bg-[#E8E0EE] px-3 py-2 rounded-xl border border-[#C7BFE8] text-center">
            <div className="text-[10px] uppercase font-bold text-[#251B35]/60">Awards Bestowed</div>
            <div className="text-base font-black text-[#251B35]">
              {Math.min(REQUIRED_AWARDS, awardHistory.length)} / 8
            </div>
          </div>

          {doorUnlocked ? (
            <div className="bg-emerald-100 text-emerald-800 px-3 py-2 rounded-xl border border-emerald-300 flex items-center gap-1.5 font-bold text-xs animate-bounce">
              <Key className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span>CEO Key Unlocked!</span>
            </div>
          ) : (
            <div className="bg-amber-50 text-amber-900 px-3 py-2 rounded-xl border border-amber-300 flex items-center gap-1.5 font-bold text-xs">
              <Award className="w-4 h-4 text-amber-600" />
              <span>{Math.max(0, REQUIRED_AWARDS - awardHistory.length)} More Needed</span>
            </div>
          )}
        </div>
      </div>

      {/* 8-Slot Awards Tracker Bar */}
      <div className="bg-white/90 border-2 border-[#C7BFE8] rounded-2xl p-4 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-black uppercase text-[#251B35] tracking-wider">
            8-Employee Excellence Roster Tracker:
          </span>
          <span className="text-xs font-bold text-purple-700">
            {awardHistory.length >= REQUIRED_AWARDS
              ? '8 / 8 Awards Granted!'
              : `${REQUIRED_AWARDS - awardHistory.length} more colleagues to honor`}
          </span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {Array.from({ length: REQUIRED_AWARDS }).map((_, idx) => {
            const record = awardHistory[awardHistory.length - 1 - idx] || awardHistory[idx];
            const isAwarded = idx < awardHistory.length;

            return (
              <div
                key={idx}
                className={`p-2 rounded-xl border-2 text-center transition-all ${
                  isAwarded
                    ? 'bg-amber-50 border-amber-400 text-amber-950 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                <div className="text-[10px] uppercase font-bold">Award #{idx + 1}</div>
                <div className="text-xs font-black truncate mt-0.5">
                  {isAwarded ? (awardHistory[idx]?.employee || '★ Honored') : 'Pending'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: The Interactive Award Creator Form (7 Cols) */}
        <div className="lg:col-span-7 bg-white/95 rounded-3xl border-4 border-[#C7BFE8] p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-700" />
              <h3 className="text-base font-black text-[#251B35]">
                Nominate Colleague #{awardHistory.length + 1} of 8
              </h3>
            </div>
            <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
              {8 - awardHistory.length > 0 ? `${8 - awardHistory.length} Remaining` : 'Completed'}
            </span>
          </div>

          <form onSubmit={handleGrantAward} className="space-y-4">
            {/* 1. Pick Coworker */}
            <div>
              <label className="block text-xs font-bold text-[#251B35] uppercase mb-1.5 flex items-center justify-between">
                <span>1. Select Coworker ({EMPLOYEES.length} CARECOR Team Members):</span>
                <span className="text-[10px] font-normal text-slate-500">Pick an unawarded member</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-44 overflow-y-auto p-1 bg-slate-50 rounded-2xl border border-slate-200">
                {EMPLOYEES.map((name) => {
                  const isSelected = selectedEmployee === name;
                  const isAlreadyAwarded = awardedEmployeeNames.includes(name);

                  return (
                    <button
                      type="button"
                      key={name}
                      onClick={() => {
                        sound.click();
                        setSelectedEmployee(name);
                      }}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all text-left truncate flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-[#FEAEC9] text-[#251B35] shadow-xs border-2 border-[#251B35]'
                          : isAlreadyAwarded
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 opacity-60'
                          : 'bg-white hover:bg-slate-100 text-[#251B35]/80 border border-slate-200'
                      }`}
                    >
                      <span className="truncate">{name}</span>
                      {isAlreadyAwarded ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 ml-1" />
                      ) : isSelected ? (
                        <Star className="w-3 h-3 text-[#251B35] fill-[#251B35] shrink-0 ml-1" />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Pick Award */}
            <div>
              <label className="block text-xs font-bold text-[#251B35] uppercase mb-1.5">
                2. Select Award Category (20 Excellence Attributes):
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-1 bg-slate-50 rounded-2xl border border-slate-200">
                {AWARDS.map((awardName) => {
                  const isSelected = selectedAward === awardName;
                  return (
                    <button
                      type="button"
                      key={awardName}
                      onClick={() => {
                        sound.click();
                        setSelectedAward(awardName);
                      }}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#9AD9EA] text-[#251B35] shadow-xs border-2 border-[#251B35]'
                          : 'bg-white hover:bg-slate-100 text-[#251B35]/70 border border-slate-200'
                      }`}
                    >
                      {awardName}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Personalized Message */}
            <div>
              <label className="block text-xs font-bold text-[#251B35] uppercase mb-1">
                3. Appreciation Tribute Note:
              </label>
              <textarea
                rows={2}
                value={personalMessage}
                onChange={(e) => setPersonalMessage(e.target.value)}
                placeholder={`Why does ${selectedEmployee} deserve the "${selectedAward}" award?`}
                className="w-full px-4 py-2 rounded-xl border-2 border-[#C7BFE8] focus:border-[#FEAEC9] focus:outline-hidden text-xs text-[#251B35] bg-white shadow-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#FEAEC9] via-[#C7BFE8] to-[#9AD9EA] text-[#251B35] font-black text-xs uppercase tracking-wider hover:opacity-95 shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Award className="w-4 h-4 text-purple-800" />
              <span>
                {awardHistory.length >= REQUIRED_AWARDS
                  ? `Grant Additional Award to ${selectedEmployee}`
                  : `Bestow Award #${awardHistory.length + 1} upon ${selectedEmployee}`}
              </span>
            </button>
          </form>
        </div>

        {/* Right Column: Official Certificate Showcase Preview (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Certificate Frame */}
          <div className="bg-gradient-to-b from-amber-50 to-orange-50/40 rounded-3xl border-4 border-amber-300 p-6 shadow-xl relative overflow-hidden text-center flex flex-col justify-between min-h-[360px]">
            {/* Top Certificate Corner Badges */}
            <div className="flex items-center justify-between border-b-2 border-amber-200/80 pb-3">
              <Crown className="w-5 h-5 text-amber-600" />
              <span className="font-serif font-black tracking-widest text-[11px] text-amber-900 uppercase">
                CARECOR OFFICE • CERTIFICATE OF EXCELLENCE
              </span>
              <Crown className="w-5 h-5 text-amber-600" />
            </div>

            <div className="my-4 space-y-2">
              <p className="font-serif italic text-xs text-amber-800">
                This honor is proudly awarded to
              </p>
              <h3 className="font-serif text-2xl sm:text-3xl font-black text-[#251B35] tracking-wide">
                {activeCertificate ? activeCertificate.employee : selectedEmployee}
              </h3>
              <p className="font-serif italic text-xs text-amber-800">
                in recognition of outstanding
              </p>
              <div className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-[#FEAEC9] to-[#9AD9EA] border border-amber-400 font-black text-sm tracking-wider text-[#251B35] shadow-xs">
                ★ {activeCertificate ? activeCertificate.award : selectedAward} ★
              </div>
              <p className="text-xs text-slate-600 max-w-xs mx-auto italic mt-2">
                "{activeCertificate ? activeCertificate.message : personalMessage || 'Exemplary dedication, leadership, and camaraderie.'}"
              </p>
            </div>

            {/* Bottom Official Seals */}
            <div className="pt-3 border-t-2 border-amber-200/80 flex items-center justify-between text-[10px] text-amber-900">
              <div className="text-left font-serif">
                <div>DATE: {activeCertificate ? activeCertificate.timestamp : 'TODAY'}</div>
                <div>OFFICIAL RECORD</div>
              </div>
              <div className="w-12 h-12 rounded-full border-2 border-amber-500 bg-amber-400/20 flex items-center justify-center font-bold text-[9px] uppercase shadow-xs">
                CARECOR
                <br />SEAL
              </div>
              <div className="text-right font-serif">
                <div>EXECUTIVE OFFICE</div>
                <div>APPROVED ★</div>
              </div>
            </div>
          </div>

          {/* Wall of Honorees */}
          <div className="bg-white/95 rounded-2xl border-2 border-[#C7BFE8] p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2 pb-1 border-b border-slate-100">
              <div className="flex items-center gap-1.5 text-xs font-black uppercase text-[#251B35]">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-400" />
                <span>Honorees Hall ({awardHistory.length} / 8 Required)</span>
              </div>
              {doorUnlocked && (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  All 8 Granted!
                </span>
              )}
            </div>

            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {awardHistory.length === 0 ? (
                <div className="text-xs text-slate-400 italic text-center py-4">
                  Granted awards will appear here...
                </div>
              ) : (
                awardHistory.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <strong className="text-[#251B35]">#{idx + 1} {item.employee}</strong>
                      <span className="text-slate-500"> — {item.award}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">{item.timestamp}</span>
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
