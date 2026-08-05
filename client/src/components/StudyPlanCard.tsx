import React, { useState } from 'react';
import { Calendar, CheckSquare, Square, BookOpen, Dumbbell, Clock } from 'lucide-react';
import { StudyPlan } from '../types';

interface StudyPlanCardProps {
  studyPlan: StudyPlan;
}

export const StudyPlanCard: React.FC<StudyPlanCardProps> = ({ studyPlan }) => {
  const [completedDays, setCompletedDays] = useState<Record<number, boolean>>({});
  const [activeDay, setActiveDay] = useState<number>(1);

  const days = studyPlan.plan_content?.days || [];

  const toggleDayCompletion = (dayNum: number) => {
    setCompletedDays((prev) => ({
      ...prev,
      [dayNum]: !prev[dayNum],
    }));
  };

  const selectedDayData = days.find((d) => d.day === activeDay) || days[0];

  return (
    <div className="rounded-2xl glass-card border border-slate-800 p-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block mb-1">
            Custom Preparation Roadmap
          </span>
          <h2 className="text-xl font-extrabold text-white tracking-tight">
            {studyPlan.plan_title}
          </h2>
        </div>
        <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-indigo-400" />
          Generated for 7 Days
        </div>
      </div>

      {/* Days Tabs (Day 1 - Day 7) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {days.map((dayItem) => {
          const isDone = completedDays[dayItem.day];
          const isActive = activeDay === dayItem.day;

          return (
            <button
              key={dayItem.day}
              onClick={() => setActiveDay(dayItem.day)}
              className={`px-4 py-2.5 rounded-xl font-semibold text-xs transition-all duration-200 shrink-0 flex items-center gap-2 border ${
                isActive
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20'
                  : isDone
                  ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <span>Day {dayItem.day}</span>
              {isDone && <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />}
            </button>
          );
        })}
      </div>

      {/* Selected Day Content */}
      {selectedDayData && (
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5 text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-sm">
                D{selectedDayData.day}
              </span>
              <div>
                <h3 className="text-base font-bold text-white">{selectedDayData.topic}</h3>
                <p className="text-xs text-slate-400">{selectedDayData.objective}</p>
              </div>
            </div>

            <button
              onClick={() => toggleDayCompletion(selectedDayData.day)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                completedDays[selectedDayData.day]
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              {completedDays[selectedDayData.day] ? (
                <>
                  <CheckSquare className="w-4 h-4 text-emerald-400" />
                  <span>Completed</span>
                </>
              ) : (
                <>
                  <Square className="w-4 h-4 text-slate-400" />
                  <span>Mark Complete</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Learning Activity */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                Learning Activity
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedDayData.learning_activity}
              </p>
            </div>

            {/* Practice Activity */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
                <Dumbbell className="w-4 h-4 text-cyan-400" />
                Practice Activity
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedDayData.practice_activity}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium pt-1">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Estimated Duration: <strong>{selectedDayData.duration_minutes} minutes</strong></span>
          </div>
        </div>
      )}
    </div>
  );
};
