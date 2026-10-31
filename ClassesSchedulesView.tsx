/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CalendarDays, Plus, Clock, Users, School, BookOpen, Printer } from 'lucide-react';
import { ClassRoom, TimetablePeriod, Subject, StaffMember } from '../../types';

interface ClassesSchedulesViewProps {
  classes: ClassRoom[];
  schedules: TimetablePeriod[];
  subjects: Subject[];
  staff: StaffMember[];
  onSaveSchedule: (entry: Partial<TimetablePeriod>) => Promise<void>;
  onPrintRoster: (cls: ClassRoom) => void;
  onPrintClassTimetable: () => void;
  onPrintTeacherTimetable: () => void;
}

export const ClassesSchedulesView: React.FC<ClassesSchedulesViewProps> = ({
  classes,
  schedules,
  subjects,
  staff,
  onSaveSchedule,
  onPrintRoster,
  onPrintClassTimetable,
  onPrintTeacherTimetable,
}) => {
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  const [showAddPeriodModal, setShowAddModal] = useState(false);

  // Form states
  const [day, setDay] = useState<TimetablePeriod['day']>('الأحد');
  const [periodNumber, setPeriodNumber] = useState(1);
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || '');
  const [teacherId, setTeacherId] = useState(staff[0]?.id || '');
  const [timeSlot, setTimeSlot] = useState('08:00 - 08:45');

  const selectedClass = classes.find(c => c.id === selectedClassId) || classes[0];
  const classSchedules = schedules.filter(s => s.classId === selectedClassId);

  const days: TimetablePeriod['day'][] = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];
  const periods = [1, 2, 3, 4, 5, 6, 7];

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const sub = subjects.find(s => s.id === subjectId);
    const tch = staff.find(t => t.id === teacherId);

    await onSaveSchedule({
      classId: selectedClassId,
      day,
      periodNumber,
      subjectId,
      subjectName: sub?.name || 'مادة أزهرية',
      teacherId,
      teacherName: tch?.name || 'معلم أزهري',
      timeSlot,
    });

    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 text-right">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-emerald-800" />
            <h2 className="text-lg font-bold text-stone-900">
              الفصول الدراسية والجداول الأسبوعية
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            خريطة الحصص الدراسية وتوزيع المواد الشرعية والعربية والعلمية على فصول المرحلة الإعدادية والثانوية.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onPrintClassTimetable}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold rounded-lg transition-colors cursor-pointer"
            title="طباعة جدول حصص الفصل A4"
          >
            <Printer className="w-4 h-4 text-emerald-700" />
            <span>طباعة جدول الفصل A4</span>
          </button>

          <button
            onClick={onPrintTeacherTimetable}
            className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold rounded-lg transition-colors cursor-pointer"
            title="طباعة جدول حصص المعلم A4"
          >
            <Printer className="w-4 h-4 text-amber-700" />
            <span>طباعة جدول المعلم A4</span>
          </button>

          {selectedClass && (
            <button
              onClick={() => onPrintRoster(selectedClass)}
              className="flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-stone-500" />
              <span>كشف مناداة</span>
            </button>
          )}

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة حصة</span>
          </button>
        </div>
      </div>

      {/* Class Selector Pills */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs space-y-3">
        <span className="text-xs font-bold text-stone-700 block">
          اختر الفصل الدراسي لعرض جدوله وقاعته:
        </span>
        <div className="flex flex-wrap gap-2">
          {classes.map((cls) => {
            const isSelected = cls.id === selectedClassId;
            return (
              <button
                key={cls.id}
                onClick={() => setSelectedClassId(cls.id)}
                className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? 'bg-emerald-800 text-white font-bold shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <span>{cls.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${isSelected ? 'bg-emerald-900 text-amber-200' : 'bg-stone-200 text-stone-600'}`}>
                  {cls.studentsCount} طالب
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Class Info Card */}
      {selectedClass && (
        <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-stone-500 block text-[10px]">القاعة المخصصة:</span>
            <strong className="text-stone-900 font-semibold">{selectedClass.roomNumber}</strong>
          </div>
          <div>
            <span className="text-stone-500 block text-[10px]">الكثافة الطلابية:</span>
            <strong className="text-stone-900 font-mono">{selectedClass.studentsCount} / {selectedClass.capacity} طالباً</strong>
          </div>
          <div>
            <span className="text-stone-500 block text-[10px]">رائد الفصل الأزهري:</span>
            <strong className="text-emerald-950 font-semibold">{selectedClass.supervisorTeacherName || 'الشيخ مصطفى عثمان'}</strong>
          </div>
          <div>
            <span className="text-stone-500 block text-[10px]">المرحلة والمسار:</span>
            <strong className="text-stone-900">
              {selectedClass.stage === 'preparatory' ? 'المرحلة الإعدادية' : `المرحلة الثانوية (${selectedClass.track === 'scientific' ? 'علمي' : 'أدبي'})`}
            </strong>
          </div>
        </div>
      )}

      {/* Weekly Timetable Grid */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-stone-200 bg-stone-50/60 flex items-center justify-between">
          <h3 className="font-bold text-sm text-stone-900">
            الجدول المدرسي الأسبوعي المعتمد - {selectedClass?.name}
          </h3>
          <span className="text-xs text-stone-500">
            أيام الدراسة: من الأحد إلى الخميس
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-center border-collapse border border-stone-200">
            <thead>
              <tr className="bg-emerald-950 text-white text-[11px]">
                <th className="border border-stone-300 py-3 px-3 w-28">اليوم / الحصة</th>
                {periods.map(p => (
                  <th key={p} className="border border-stone-300 py-3 px-2">
                    <span>الحصة {p}</span>
                    <span className="block text-[9px] text-emerald-200 font-normal font-mono">
                      {p === 1 && '08:00 - 08:45'}
                      {p === 2 && '08:45 - 09:30'}
                      {p === 3 && '09:45 - 10:30'}
                      {p === 4 && '10:30 - 11:15'}
                      {p === 5 && '11:45 - 12:30'}
                      {p === 6 && '12:30 - 01:15'}
                      {p === 7 && '01:15 - 02:00'}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {days.map((d, dIdx) => (
                <tr key={d} className={dIdx % 2 === 0 ? 'bg-white' : 'bg-stone-50/40'}>
                  <td className="border border-stone-300 py-3 px-2 font-bold text-stone-900 bg-stone-100/70">
                    {d}
                  </td>
                  {periods.map(p => {
                    const entry = classSchedules.find(s => s.day === d && s.periodNumber === p);
                    return (
                      <td key={p} className="border border-stone-300 py-2.5 px-2 align-middle">
                        {entry ? (
                          <div className="bg-emerald-50 border border-emerald-200/80 p-2 rounded text-right space-y-0.5">
                            <strong className="block text-emerald-950 text-[11px] leading-tight">
                              {entry.subjectName}
                            </strong>
                            <span className="block text-[10px] text-stone-500 truncate">
                              {entry.teacherName}
                            </span>
                          </div>
                        ) : (
                          <div className="text-stone-300 text-[11px] py-2">
                            {p === 3 ? 'الفسحة والأذكار' : '-'}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Schedule Modal */}
      {showAddPeriodModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-stone-200 w-full max-w-md p-6 space-y-4 text-right text-xs">
            <h3 className="font-bold text-sm text-stone-900 border-b border-stone-200 pb-2">
              إضافة حصة دراسية لجدول {selectedClass?.name}
            </h3>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-800 mb-1">اليوم *</label>
                  <select
                    value={day}
                    onChange={(e) => setDay(e.target.value as any)}
                    className="w-full px-3 py-1.5 border border-stone-300 rounded bg-white"
                  >
                    {days.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-800 mb-1">رقم الحصة *</label>
                  <select
                    value={periodNumber}
                    onChange={(e) => setPeriodNumber(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-stone-300 rounded bg-white font-mono"
                  >
                    {periods.map(p => (
                      <option key={p} value={p}>الحصة {p}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">المادة الدراسية المقررة *</label>
                <select
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                  className="w-full px-3 py-1.5 border border-stone-300 rounded bg-white"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.category})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">معلم المادة *</label>
                <select
                  value={teacherId}
                  onChange={(e) => setTeacherId(e.target.value)}
                  className="w-full px-3 py-1.5 border border-stone-300 rounded bg-white"
                >
                  {staff.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.specialization})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">التوقيت الزمني للحصة</label>
                <input
                  type="text"
                  dir="ltr"
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  placeholder="08:00 - 08:45"
                  className="w-full px-3 py-1.5 border border-stone-300 rounded font-mono text-center"
                />
              </div>

              <div className="flex justify-between pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-1.5 bg-stone-100 hover:bg-stone-200 rounded font-semibold text-stone-700 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded font-bold cursor-pointer"
                >
                  إدراج في الجدول
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
