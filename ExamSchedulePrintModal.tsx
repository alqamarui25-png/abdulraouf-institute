/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Printer, Calendar, Clock, AlertCircle } from 'lucide-react';
import { InstituteSettings, ExamScheduleItem, StageType, GradeType } from '../../types';

interface ExamSchedulePrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  instituteSettings: InstituteSettings;
  schedules: ExamScheduleItem[];
}

export const ExamSchedulePrintModal: React.FC<ExamSchedulePrintModalProps> = ({
  isOpen,
  onClose,
  instituteSettings,
  schedules,
}) => {
  const [selectedStage, setSelectedStage] = useState<StageType>('secondary');
  const [selectedGrade, setSelectedGrade] = useState<GradeType>('sec_3');
  const [selectedTerm, setSelectedTerm] = useState('الفصل الدراسي الأول');

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const filtered = schedules.filter(
    s => s.stage === selectedStage && s.grade === selectedGrade && s.term === selectedTerm
  );

  const gradeLabels: Record<string, string> = {
    prep_1: 'الصف الأول الإعدادي',
    prep_2: 'الصف الثاني الإعدادي',
    prep_3: 'الصف الثالث الإعدادي (الشهادة الإعدادية العامة)',
    sec_1: 'الصف الأول الثانوي (النقل)',
    sec_2: 'الصف الثاني الثانوي (علمي وأدبي)',
    sec_3: 'الصف الثالث الثانوي (الشهادة الثانوية الأزهرية - علمي)',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-stone-300 w-full max-w-4xl max-h-[96vh] flex flex-col overflow-hidden text-right">
        
        {/* Modal Controls */}
        <div className="no-print flex items-center justify-between px-6 py-3.5 bg-emerald-950 text-white shrink-0">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm">
              طباعة جدول الامتحانات الرسمية بحجم A4
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

        {/* Filter bar */}
        <div className="no-print bg-stone-100 p-3 px-6 border-b border-stone-300 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-700">المرحلة:</span>
            <select
              value={selectedStage}
              onChange={(e) => {
                const st = e.target.value as StageType;
                setSelectedStage(st);
                setSelectedGrade(st === 'preparatory' ? 'prep_3' : 'sec_3');
              }}
              className="px-2.5 py-1 bg-white border border-stone-300 rounded font-semibold text-xs"
            >
              <option value="preparatory">المرحلة الإعدادية</option>
              <option value="secondary">المرحلة الثانوية</option>
            </select>

            <span className="font-bold text-stone-700 mr-2">الصف:</span>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value as GradeType)}
              className="px-2.5 py-1 bg-white border border-stone-300 rounded font-semibold text-xs"
            >
              {selectedStage === 'preparatory' ? (
                <>
                  <option value="prep_1">الأول الإعدادي</option>
                  <option value="prep_2">الثاني الإعدادي</option>
                  <option value="prep_3">الثالث الإعدادي (الشهادة)</option>
                </>
              ) : (
                <>
                  <option value="sec_1">الأول الثانوي</option>
                  <option value="sec_2">الثاني الثانوي</option>
                  <option value="sec_3">الثالث الثانوي (الشهادة)</option>
                </>
              )}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-700">الدور / الترم:</span>
            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              className="px-2.5 py-1 bg-white border border-stone-300 rounded font-semibold text-xs"
            >
              <option value="الفصل الدراسي الأول">امتحانات الفصل الدراسي الأول</option>
              <option value="الفصل الدراسي الثاني">امتحانات الفصل الدراسي الثاني</option>
              <option value="الدور الثاني">امتحانات الدور الثاني</option>
            </select>
          </div>
        </div>

        {/* Printable A4 Body */}
        <div className="p-6 overflow-y-auto bg-stone-200/50 flex justify-center">
          <div className="w-[210mm] min-h-[297mm] bg-white text-stone-900 p-8 shadow-lg border border-stone-300 flex flex-col justify-between font-sans text-right text-xs leading-relaxed">
            
            <div>
              {/* Header */}
              <div className="flex items-start justify-between pb-3 border-b-2 border-stone-800">
                <div className="w-14 h-14">
                  <img src={instituteSettings.logoUrl} alt="" className="w-full h-full object-contain" />
                </div>

                <div className="text-center">
                  <span className="text-[11px] text-stone-600 block">جمهورية مصر العربية · الأزهر الشريف</span>
                  <h1 className="text-lg font-bold text-emerald-950 font-amiri tracking-wide mt-0.5">
                    جَدْوَلُ امْتِحَانَاتِ {selectedTerm.toUpperCase()}
                  </h1>
                  <span className="text-xs font-bold text-stone-800 block mt-0.5">
                    لـ {gradeLabels[selectedGrade] || selectedGrade} · للعام الدراسي {instituteSettings.academicYear}
                  </span>
                </div>

                <div className="text-right space-y-0.5 text-[11px]">
                  <strong className="block text-emerald-950 font-bold font-amiri">قطاع المعاهد الأزهرية</strong>
                  <span className="block text-stone-700">{instituteSettings.regionName}</span>
                  <strong className="block text-stone-900 font-bold">{instituteSettings.instituteName}</strong>
                  <span className="block text-stone-500 text-[10px]">لجنة النظام والمراقبة (الكنترول)</span>
                </div>
              </div>

              {/* Table of exam days */}
              <div className="my-5">
                <table className="w-full border-2 border-stone-900 text-center text-xs divide-y divide-stone-900">
                  <thead className="bg-stone-100 font-bold text-[11px]">
                    <tr>
                      <th className="py-2.5 px-3 border-l border-stone-900">اليوم والتاريخ</th>
                      <th className="py-2.5 px-2 border-l border-stone-900 w-16">الفترة</th>
                      <th className="py-2.5 px-3 border-l border-stone-900">المادة الدراسية المقررة</th>
                      <th className="py-2.5 px-2 border-l border-stone-900">زمن الإجابة</th>
                      <th className="py-2.5 px-3 border-l border-stone-900">توقيت اللجنة</th>
                      <th className="py-2.5 px-3">ملاحظات وتعليمات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800">
                    {filtered.length > 0 ? (
                      filtered.map((item, idx) => (
                        <tr key={item.id || idx} className="hover:bg-stone-50">
                          <td className="py-2.5 px-3 border-l border-stone-900 font-bold text-stone-900">
                            <div>{item.day}</div>
                            <div className="font-mono text-[10px] text-stone-600">{item.date}</div>
                          </td>
                          <td className="py-2.5 px-2 border-l border-stone-900 font-bold text-emerald-950">
                            {item.periodNumber === 1 ? 'الأولى' : 'الثانية'}
                          </td>
                          <td className="py-2.5 px-3 border-l border-stone-900 font-bold text-stone-900">
                            {item.subjectName}
                          </td>
                          <td className="py-2.5 px-2 border-l border-stone-900 font-mono">
                            {item.duration}
                          </td>
                          <td className="py-2.5 px-3 border-l border-stone-900 font-mono text-[11px] font-bold text-stone-800">
                            من {item.startTime} إلى {item.endTime}
                          </td>
                          <td className="py-2.5 px-3 text-[10.5px] text-stone-600">
                            {item.notes || '-'}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-6 text-center text-stone-500 font-semibold">
                          لا توجد مواد مضافة لجدول هذا الصف حالياً.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Instructions Box */}
              <div className="p-3 border border-stone-800 rounded bg-stone-50/70 text-[11px] leading-relaxed space-y-1">
                <strong className="block font-bold text-stone-950 underline mb-0.5">
                  تعليمات وضوابط هامة للطلاب والملاحظين:
                </strong>
                <ul className="list-disc list-inside space-y-0.5 text-stone-700">
                  <li>التواجد بمقر لجان المعهد قبل بدء الامتحان بنصف ساعة على الأقل.</li>
                  <li>حمل بطاقة رقم الجلوس الرسمية وإبرازها للملاحظين عند الطلب.</li>
                  <li>يمنع تماماً اصطحاب الهاتف المحمول أو أي أجهزة إلكترونية أو كتب داخل قاعات الامتحان.</li>
                  <li>الامتحان الشفهي للقرآن الكريم والحديث النبوي يعقد بالتوازي مع الامتحانات التحريرية وفقاً لجدول الكنترول.</li>
                </ul>
              </div>

            </div>

            {/* Signatures & Seal */}
            <div className="pt-4 border-t-2 border-stone-800 relative">
              <div className="grid grid-cols-3 items-center text-center text-xs">
                <div>
                  <span className="block font-bold text-stone-800">رئيس لجنة النظام والمراقبة (الكنترول)</span>
                  <span className="block text-stone-700 mt-4">{instituteSettings.controlHead}</span>
                </div>

                <div className="relative">
                  <span className="block font-bold text-stone-900">يعتمد، شيخ المعهد</span>
                  <strong className="block text-stone-950 font-bold mt-4 font-amiri">
                    {instituteSettings.headmasterName}
                  </strong>
                  {/* Official Stamp */}
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
                <span>تاريخ إصدار الجدول: {new Date().toLocaleDateString('ar-EG')}</span>
                <span>معهد عبد الرؤوف الإعدادي والثانوي الأزهري بنين</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
