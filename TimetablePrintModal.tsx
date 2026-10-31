/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Printer, CalendarDays, User, School, Clock } from 'lucide-react';
import { StaffMember, ClassRoom, TimetablePeriod, InstituteSettings } from '../../types';

interface TimetablePrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  classes: ClassRoom[];
  staff: StaffMember[];
  schedules: TimetablePeriod[];
  instituteSettings: InstituteSettings;
  defaultMode?: 'class' | 'teacher';
}

export const TimetablePrintModal: React.FC<TimetablePrintModalProps> = ({
  isOpen,
  onClose,
  classes,
  staff,
  schedules,
  instituteSettings,
  defaultMode = 'class',
}) => {
  const [mode, setMode] = useState<'class' | 'teacher'>(defaultMode);
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>(staff.find(s => s.role === 'teacher')?.id || staff[0]?.id || '');

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'] as const;
  const periods = [1, 2, 3, 4, 5, 6, 7];
  const timeSlots = [
    '08:00 - 08:45',
    '08:45 - 09:30',
    '09:45 - 10:30',
    '10:30 - 11:15',
    '11:45 - 12:30',
    '12:30 - 01:15',
    '01:15 - 02:00',
  ];

  const currentClass = classes.find(c => c.id === selectedClassId) || classes[0];
  const currentTeacher = staff.find(s => s.id === selectedTeacherId) || staff[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-900/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-stone-300 w-full max-w-5xl max-h-[96vh] flex flex-col overflow-hidden text-right">
        
        {/* Modal Controls */}
        <div className="no-print flex items-center justify-between px-6 py-3.5 bg-emerald-950 text-white shrink-0">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm">
              طباعة الجداول الدراسية الأسبوعية A4 (جدول الفصول وجدول المعلمين)
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة الجدول A4</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-300 hover:text-white rounded-lg hover:bg-emerald-900 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar Switcher */}
        <div className="no-print bg-stone-100 p-3 px-6 border-b border-stone-300 flex flex-wrap items-center justify-between gap-3 text-xs">
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMode('class')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border font-bold cursor-pointer transition-colors ${
                mode === 'class'
                  ? 'bg-emerald-800 text-white border-emerald-900 shadow-2xs'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
              }`}
            >
              <School className="w-3.5 h-3.5" />
              <span>جدول حصص الفصل الدراسي</span>
            </button>

            <button
              onClick={() => setMode('teacher')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border font-bold cursor-pointer transition-colors ${
                mode === 'teacher'
                  ? 'bg-emerald-800 text-white border-emerald-900 shadow-2xs'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>جدول حصص المعلم الأسبوعي</span>
            </button>
          </div>

          {mode === 'class' ? (
            <div className="flex items-center gap-2">
              <span className="font-bold text-stone-700">اختر الفصل:</span>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="px-3 py-1 bg-white border border-stone-300 rounded font-semibold text-xs"
              >
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="font-bold text-stone-700">اختر المعلم:</span>
              <select
                value={selectedTeacherId}
                onChange={(e) => setSelectedTeacherId(e.target.value)}
                className="px-3 py-1 bg-white border border-stone-300 rounded font-semibold text-xs"
              >
                {staff.map(st => (
                  <option key={st.id} value={st.id}>{st.name} ({st.specialization})</option>
                ))}
              </select>
            </div>
          )}

        </div>

        {/* Printable Area */}
        <div className="p-6 overflow-y-auto bg-stone-200/60 flex justify-center">
          <div className="w-[210mm] min-h-[297mm] bg-white text-stone-900 p-8 shadow-lg border border-stone-300 flex flex-col justify-between font-sans text-right text-xs leading-relaxed">
            
            <div>
              {/* Header */}
              <div className="flex items-start justify-between pb-3 border-b-2 border-stone-800 mb-4">
                <div className="w-14 h-14">
                  <img src={instituteSettings.logoUrl} alt="" className="w-full h-full object-contain" />
                </div>

                <div className="text-center">
                  <span className="text-xs text-stone-600 block">قطاع المعاهد الأزهرية · {instituteSettings.regionName}</span>
                  <h1 className="text-lg font-bold text-emerald-950 font-amiri tracking-wide mt-0.5">
                    {mode === 'class'
                      ? `جَدْوَلُ حِصَصِ ${currentClass?.name}`
                      : `جَدْوَلُ الحِصَصِ الأُسْبُوعِيِّ لِلْمُعَلِّمِ: ${currentTeacher?.name}`}
                  </h1>
                  <span className="text-xs font-bold text-stone-800 block mt-0.5">
                    للعام الدراسي {instituteSettings.academicYear} · الخطة الأسبوعية المعتمدة
                  </span>
                </div>

                <div className="text-right space-y-0.5 text-[11px]">
                  <strong className="block text-emerald-950 font-bold font-amiri">الأزهر الشريف</strong>
                  <strong className="block text-stone-900 font-bold">{instituteSettings.instituteName}</strong>
                  <span className="block text-stone-500 text-[10px]">قسم الجداول والخطط الدراسية</span>
                </div>
              </div>

              {/* Bio Summary */}
              {mode === 'class' ? (
                <div className="border border-stone-300 rounded p-2.5 bg-stone-50 mb-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-stone-500 font-bold">الفصل:</span>{' '}
                    <strong className="text-stone-900">{currentClass?.name}</strong>
                  </div>
                  <div>
                    <span className="text-stone-500 font-bold">رائد الفصل:</span>{' '}
                    <strong>{currentClass?.supervisorTeacherName || 'الشيخ مصطفى عثمان'}</strong>
                  </div>
                  <div>
                    <span className="text-stone-500 font-bold">مكان القاعة:</span>{' '}
                    <strong className="font-mono">{currentClass?.roomNumber}</strong>
                  </div>
                  <div>
                    <span className="text-stone-500 font-bold">عدد الطلاب:</span>{' '}
                    <strong className="font-mono">{currentClass?.studentsCount} طالب</strong>
                  </div>
                </div>
              ) : (
                <div className="border border-stone-300 rounded p-2.5 bg-stone-50 mb-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-stone-500 font-bold">اسم المعلم:</span>{' '}
                    <strong className="text-stone-900">{currentTeacher?.name}</strong>
                  </div>
                  <div>
                    <span className="text-stone-500 font-bold">التخصص:</span>{' '}
                    <strong>{currentTeacher?.specialization}</strong>
                  </div>
                  <div>
                    <span className="text-stone-500 font-bold">النصاب الأسبوعي:</span>{' '}
                    <strong className="font-mono">{currentTeacher?.weeklyQuota} حصة</strong>
                  </div>
                  <div>
                    <span className="text-stone-500 font-bold">رقم السجل الوظيفي:</span>{' '}
                    <strong className="font-mono">{currentTeacher?.staffCode}</strong>
                  </div>
                </div>
              )}

              {/* Weekly Timetable Table */}
              <table className="w-full border-2 border-stone-900 text-center text-xs divide-y divide-stone-900">
                <thead className="bg-stone-100 font-bold text-[10.5px]">
                  <tr>
                    <th className="py-2 px-2 border-l border-stone-900 w-18">اليوم</th>
                    {periods.map((p, idx) => (
                      <th key={p} className="py-1 px-1 border-l border-stone-900">
                        <div>الحصة {p}</div>
                        <div className="text-[8px] text-stone-500 font-mono font-normal">
                          {timeSlots[idx]}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800">
                  {days.map((day) => (
                    <tr key={day} className="hover:bg-stone-50">
                      <td className="py-2.5 px-2 border-l border-stone-900 font-bold text-stone-950 bg-stone-50">
                        {day}
                      </td>

                      {periods.map((p) => {
                        let subjectTitle = '';
                        let subInfo = '';

                        if (mode === 'class') {
                          // Look for timetable period
                          const found = schedules.find(
                            s => s.classId === currentClass.id && s.day === day && s.periodNumber === p
                          );
                          if (found) {
                            subjectTitle = found.subjectName;
                            subInfo = found.teacherName;
                          } else {
                            // Demo pattern for empty schedule cells
                            if (p === 1) { subjectTitle = 'القرآن الكريم'; subInfo = 'الشيخ مصطفى'; }
                            else if (p === 2) { subjectTitle = 'الفقه الشافعي'; subInfo = 'الشيخ عثمان'; }
                            else if (p === 3) { subjectTitle = 'النحو والصرف'; subInfo = 'الشيخ الشربيني'; }
                            else if (p === 4) { subjectTitle = 'الرياضيات'; subInfo = 'أ. سامح'; }
                            else if (p === 5) { subjectTitle = 'اللغة الإنجليزية'; subInfo = 'أ. حسام'; }
                            else if (p === 6) { subjectTitle = 'الدراسات الاجتماعية'; subInfo = 'أ. محمود'; }
                            else { subjectTitle = 'حاسب آلي ونشاط'; subInfo = 'أ. كريم'; }
                          }
                        } else {
                          // Teacher mode
                          const found = schedules.find(
                            s => s.teacherId === currentTeacher.id && s.day === day && s.periodNumber === p
                          );
                          if (found) {
                            subjectTitle = found.subjectName;
                            subInfo = currentClass?.name || '1/1 إعدادي';
                          } else {
                            // Some periods assigned
                            if (p % 2 === 1 && day !== 'الخميس') {
                              subjectTitle = currentTeacher.specialization.split(' ')[0] || 'المادة';
                              subInfo = p === 1 ? '1/1 ثانوي' : '2/1 علمي';
                            } else {
                              subjectTitle = 'فراغ / مكتبة';
                              subInfo = '-';
                            }
                          }
                        }

                        return (
                          <td
                            key={p}
                            className={`py-2 px-1 border-l border-stone-900 text-[9.5px] ${
                              subjectTitle.includes('فراغ') ? 'bg-stone-50/40 text-stone-400' : 'bg-white'
                            }`}
                          >
                            <strong className="block text-stone-900 font-bold leading-tight">
                              {subjectTitle}
                            </strong>
                            <span className="block text-[8px] text-stone-500 font-medium mt-0.5">
                              {subInfo}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Instructions */}
              <div className="mt-4 p-2.5 border border-stone-300 rounded bg-stone-50 text-[10.5px] leading-relaxed text-stone-700">
                <strong className="text-stone-900">تنبيهات عامة:</strong>
                <span className="mr-1">
                  طابور الصباح والإذاعة المدرسية يبدأ يومياً في تمام الساعة 07:30 صباحاً. يُرجى الالتزام بالحصص وتواجد السادة المعلمين داخل الفصول قبل قرع الجرس.
                </span>
              </div>

            </div>

            {/* Signatures & Seal */}
            <div className="pt-4 border-t-2 border-stone-800 relative mt-6">
              <div className="grid grid-cols-3 items-center text-center text-xs">
                <div>
                  <span className="block font-bold text-stone-800">مسؤول إعداد الجداول المدرسية</span>
                  <span className="block text-stone-600 mt-4">أ. إبراهيم النجار</span>
                </div>

                <div className="relative">
                  <span className="block font-bold text-stone-900">يعتمد، شيخ المعهد</span>
                  <strong className="block text-stone-950 font-bold mt-4 font-amiri">
                    {instituteSettings.headmasterName}
                  </strong>
                  {/* Stamp */}
                  <div className="absolute top-1 left-1/2 -translate-x-1/2 w-20 h-20 opacity-80 pointer-events-none">
                    <img src={instituteSettings.sealUrl} alt="" className="w-full h-full object-contain" />
                  </div>
                </div>

                <div>
                  <span className="block font-bold text-stone-800">خاتم المعهد المعتمد</span>
                  <span className="block text-[10px] text-stone-500 mt-4">(بصمة الختم الحي)</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[9px] text-stone-500 pt-3">
                <span>تاريخ الاعتماد: {new Date().toLocaleDateString('ar-EG')}</span>
                <span>معهد عبد الرؤوف الإعدادي والثانوي الأزهري بنين</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
