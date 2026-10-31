/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Printer, RefreshCw, Hash, Users, CreditCard, CheckCircle2 } from 'lucide-react';
import { Student, InstituteSettings } from '../../types';

interface SeatNumbersModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  instituteSettings: InstituteSettings;
  onUpdateStudents: (updatedStudents: Student[]) => Promise<void>;
}

export const SeatNumbersModal: React.FC<SeatNumbersModalProps> = ({
  isOpen,
  onClose,
  students,
  instituteSettings,
  onUpdateStudents,
}) => {
  const [printMode, setPrintMode] = useState<'cards' | 'roster'>('cards');
  const [startNumber, setStartNumber] = useState<number>(1000);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<string>('all');

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleAutoGenerate = async () => {
    setIsGenerating(true);
    let currentSeat = Number(startNumber) || 1000;
    
    // Sort students by stage, grade, then name for official committee ordering
    const sortedStudents = [...students].sort((a, b) => {
      if (a.stage !== b.stage) return a.stage === 'secondary' ? 1 : -1;
      if (a.grade !== b.grade) return a.grade.localeCompare(b.grade);
      return a.fullName.localeCompare(b.fullName, 'ar');
    });

    const updated = sortedStudents.map((st) => {
      const seat = currentSeat++;
      return {
        ...st,
        seatNumber: seat,
      };
    });

    await onUpdateStudents(updated);
    setIsGenerating(false);
  };

  const displayedStudents = selectedGrade === 'all'
    ? students
    : students.filter(s => s.grade === selectedGrade);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-900/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-stone-300 w-full max-w-5xl max-h-[96vh] flex flex-col overflow-hidden text-right">
        
        {/* Modal Controls */}
        <div className="no-print flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 px-6 py-3.5 bg-emerald-950 text-white shrink-0">
          <div className="flex items-center gap-2">
            <Hash className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-sm">
                نظام إصدار أرقام الجلوس وطباعة كروت المقاعد وكشوف اللجان
              </h3>
              <p className="text-[11px] text-emerald-200">
                ترقيم تلقائي يبدأ من 1000 إلى ما لا نهاية وفقاً لضوابط كنترول قطاع المعاهد الأزهرية
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{printMode === 'cards' ? 'طباعة كروت المقاعد A4' : 'طباعة كشف اللجان A4'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-300 hover:text-white rounded-lg hover:bg-emerald-900 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action & Filter Toolbar */}
        <div className="no-print bg-stone-100 p-3 px-6 border-b border-stone-300 flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* Generation Button */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-700">البدء من رقم:</span>
            <input
              type="number"
              value={startNumber}
              onChange={(e) => setStartNumber(Number(e.target.value))}
              className="w-20 px-2 py-1 bg-white border border-stone-300 rounded font-mono font-bold text-center text-xs"
            />
            
            <button
              onClick={handleAutoGenerate}
              disabled={isGenerating}
              className="flex items-center gap-1.5 px-3 py-1 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded border border-emerald-900 shadow-2xs cursor-pointer transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>إصدار وتحديث أرقام الجلوس تلقائياً</span>
            </button>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPrintMode('cards')}
              className={`flex items-center gap-1 px-3 py-1 rounded border font-bold cursor-pointer transition-colors ${
                printMode === 'cards'
                  ? 'bg-amber-500 text-stone-950 border-amber-600'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>كروت أرقام الجلوس (للمقاعد)</span>
            </button>

            <button
              onClick={() => setPrintMode('roster')}
              className={`flex items-center gap-1 px-3 py-1 rounded border font-bold cursor-pointer transition-colors ${
                printMode === 'roster'
                  ? 'bg-amber-500 text-stone-950 border-amber-600'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>كشف لجان الامتحانات A4</span>
            </button>
          </div>

        </div>

        {/* Printable Area */}
        <div className="p-6 overflow-y-auto bg-stone-200/60 flex justify-center">
          
          {/* ========================================================= */}
          {/* PRINT MODE 1: كروت أرقام الجلوس للصق على أدراج الامتحانات */}
          {/* ========================================================= */}
          {printMode === 'cards' && (
            <div className="w-[210mm] min-h-[297mm] bg-white text-stone-900 p-6 shadow-lg border border-stone-300 font-sans text-right">
              
              {/* Header */}
              <div className="text-center pb-3 border-b-2 border-stone-800 mb-4">
                <span className="text-xs text-stone-600">قطاع المعاهد الأزهرية · {instituteSettings.regionName}</span>
                <h2 className="text-base font-bold text-emerald-950 font-amiri">
                  {instituteSettings.instituteName} - بطاقات أرقام جلوس لجان الامتحانات ({instituteSettings.academicYear})
                </h2>
                <span className="text-[10px] text-stone-500">
                  تُقص هذه البطاقات وتُلصق على المقاعد المخصصة للطلاب داخل قاعات ولجان الامتحانات
                </span>
              </div>

              {/* Grid of Desk Cards (2 columns x 3 rows per sheet) */}
              <div className="grid grid-cols-2 gap-4">
                {displayedStudents.map((st) => (
                  <div
                    key={st.id}
                    className="border-2 border-dashed border-stone-400 p-3 rounded-lg bg-stone-50/70 flex flex-col justify-between relative shadow-2xs"
                  >
                    {/* Card Top */}
                    <div className="flex items-start justify-between border-b border-stone-300 pb-1.5 mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full border border-stone-300 overflow-hidden shrink-0">
                          <img src={instituteSettings.logoUrl} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <strong className="text-[10px] text-emerald-950 block font-amiri">
                            {instituteSettings.instituteName}
                          </strong>
                          <span className="text-[8px] text-stone-500 block">
                            كنترول الامتحانات ({instituteSettings.academicYear})
                          </span>
                        </div>
                      </div>

                      {/* Seat Number Stamp */}
                      <div className="bg-emerald-950 text-amber-300 border-2 border-amber-400 px-3 py-0.5 rounded text-center">
                        <span className="text-[8px] block font-semibold">رقم الجلوس</span>
                        <strong className="text-base font-mono font-bold block leading-none">
                          {st.seatNumber || st.recordNumber + 1000}
                        </strong>
                      </div>
                    </div>

                    {/* Card Body: Photo & Bio */}
                    <div className="flex items-center gap-3 my-1">
                      <div className="w-14 h-16 border border-stone-400 rounded overflow-hidden bg-white shrink-0 shadow-2xs relative">
                        {st.photoUrl ? (
                          <img src={st.photoUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[7px] text-stone-400">صورة</div>
                        )}
                        <div className="absolute -bottom-1 -left-1 w-5 h-5 opacity-70">
                          <img src={instituteSettings.sealUrl} alt="" className="w-full h-full object-contain" />
                        </div>
                      </div>

                      <div className="space-y-0.5 text-[9px] flex-1">
                        <div>
                          <span className="text-stone-500">اسم الطالب:</span>{' '}
                          <strong className="text-stone-950 text-[10.5px] font-bold block leading-tight">
                            {st.fullName}
                          </strong>
                        </div>
                        <div className="flex items-center gap-3 pt-0.5">
                          <span className="bg-amber-100 text-amber-950 px-1 rounded font-bold text-[8px] border border-amber-300">
                            رقم السجل: <span className="font-mono">{st.recordNumber}</span>
                          </span>
                          <span className="text-stone-600 font-mono text-[8.5px]">
                            كود: {st.studentCode}
                          </span>
                        </div>
                        <div>
                          <span className="text-stone-500">الصف / الفصل:</span>{' '}
                          <strong className="text-stone-800">{st.className}</strong>
                        </div>
                        <div>
                          <span className="text-stone-500">المذهب:</span>{' '}
                          <strong className="text-emerald-900">{st.internationalDetails?.madhhab || 'شافعي'}</strong>
                          <span className="text-stone-400 mr-2">| اللجنة: قاعة 1</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="border-t border-stone-300 pt-1 flex items-center justify-between text-[7.5px] text-stone-500">
                      <span>رئيس الكنترول: {instituteSettings.controlHead}</span>
                      <span>يعتمد، ناظر المعهد: {instituteSettings.headmasterName}</span>
                    </div>

                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* PRINT MODE 2: كشف لجان الامتحانات وأرقام الجلوس الرسمي A4 */}
          {/* ========================================================= */}
          {printMode === 'roster' && (
            <div className="w-[210mm] min-h-[297mm] bg-white text-stone-900 p-8 shadow-lg border border-stone-300 flex flex-col justify-between font-sans text-right text-xs leading-relaxed">
              
              <div>
                {/* Official Header */}
                <div className="flex items-start justify-between pb-3 border-b-2 border-stone-800 mb-4">
                  <div className="w-14 h-14">
                    <img src={instituteSettings.logoUrl} alt="" className="w-full h-full object-contain" />
                  </div>

                  <div className="text-center">
                    <span className="text-xs text-stone-600 block">قطاع المعاهد الأزهرية · {instituteSettings.regionName}</span>
                    <h1 className="text-lg font-bold text-emerald-950 font-amiri tracking-wide mt-0.5">
                      كَشْفُ أَرْقَامِ الجُلُوسِ وَتَوْزِيعِ لِجَانِ الامْتِحَانَاتِ
                    </h1>
                    <span className="text-xs font-bold text-stone-800 block mt-0.5">
                      للعام الدراسي {instituteSettings.academicYear} · لجنة النظام والمراقبة
                    </span>
                  </div>

                  <div className="text-right space-y-0.5 text-[11px]">
                    <strong className="block text-emerald-950 font-bold font-amiri">الأزهر الشريف</strong>
                    <strong className="block text-stone-900 font-bold">{instituteSettings.instituteName}</strong>
                    <span className="block text-stone-500 text-[10px]">مكتب شؤون الطلاب والكنترول</span>
                  </div>
                </div>

                {/* Table */}
                <table className="w-full border-2 border-stone-900 text-center text-xs divide-y divide-stone-900">
                  <thead className="bg-stone-100 font-bold text-[11px]">
                    <tr>
                      <th className="py-2.5 px-3 border-l border-stone-900 w-12">م</th>
                      <th className="py-2.5 px-3 border-l border-stone-900 bg-amber-50 text-amber-950">رقم الجلوس</th>
                      <th className="py-2.5 px-3 border-l border-stone-900">رقم السجل</th>
                      <th className="py-2.5 px-4 border-l border-stone-900 text-right">اسم الطالب</th>
                      <th className="py-2.5 px-3 border-l border-stone-900">الصف والفصل</th>
                      <th className="py-2.5 px-3 border-l border-stone-900">المذهب الفقهي</th>
                      <th className="py-2.5 px-3 border-l border-stone-900">الجنسية</th>
                      <th className="py-2.5 px-3">ملاحظات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800">
                    {displayedStudents.map((st, idx) => (
                      <tr key={st.id} className="hover:bg-stone-50">
                        <td className="py-2 px-3 border-l border-stone-900 font-mono text-stone-500">
                          {idx + 1}
                        </td>
                        <td className="py-2 px-3 border-l border-stone-900 font-mono font-bold text-emerald-950 bg-emerald-50/50 text-sm">
                          {st.seatNumber || st.recordNumber + 1000}
                        </td>
                        <td className="py-2 px-3 border-l border-stone-900 font-mono font-bold text-amber-900 bg-amber-50/30">
                          {st.recordNumber}
                        </td>
                        <td className="py-2 px-4 border-l border-stone-900 text-right font-semibold text-stone-900">
                          {st.fullName}
                        </td>
                        <td className="py-2 px-3 border-l border-stone-900 text-[11px]">
                          {st.className}
                        </td>
                        <td className="py-2 px-3 border-l border-stone-900 font-medium text-emerald-900">
                          {st.internationalDetails?.madhhab || 'شافعي'}
                        </td>
                        <td className="py-2 px-3 border-l border-stone-900">
                          {st.isInternational ? st.internationalDetails?.nationality : 'مصري'}
                        </td>
                        <td className="py-2 px-3 text-[10px] text-stone-500">
                          {st.isInternational ? 'وافد مسجل' : 'نظامي'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Signatures & Seal */}
              <div className="pt-4 border-t-2 border-stone-800 relative mt-6">
                <div className="grid grid-cols-3 items-center text-center text-xs">
                  <div>
                    <span className="block font-bold text-stone-800">مسؤول شؤون الطلاب</span>
                    <span className="block text-stone-700 mt-4">{instituteSettings.studentAffairsHead}</span>
                  </div>

                  <div className="relative">
                    <span className="block font-bold text-stone-900">رئيس الكنترول وشيخ المعهد</span>
                    <strong className="block text-stone-950 font-bold mt-4 font-amiri">
                      {instituteSettings.headmasterName}
                    </strong>
                    {/* Stamp */}
                    <div className="absolute top-1 left-1/2 -translate-x-1/2 w-20 h-20 opacity-80 pointer-events-none">
                      <img src={instituteSettings.sealUrl} alt="" className="w-full h-full object-contain" />
                    </div>
                  </div>

                  <div>
                    <span className="block font-bold text-stone-800">خاتم الكنترول المعتمد</span>
                    <span className="block text-[10px] text-stone-500 mt-4">(بصمة الختم الحي)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[9px] text-stone-500 pt-3">
                  <span>تاريخ الطباعة: {new Date().toLocaleDateString('ar-EG')}</span>
                  <span>معهد عبد الرؤوف الإعدادي والثانوي الأزهري بنين</span>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
