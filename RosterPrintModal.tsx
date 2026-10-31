/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { X, Printer, Users } from 'lucide-react';
import { Student, ClassRoom, InstituteSettings } from '../../types';

interface RosterPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedClass: ClassRoom | null;
  students: Student[];
  instituteSettings: InstituteSettings;
}

export const RosterPrintModal: React.FC<RosterPrintModalProps> = ({
  isOpen,
  onClose,
  selectedClass,
  students,
  instituteSettings,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !selectedClass) return null;

  const classStudents = students.filter(s => s.classId === selectedClass.id || s.className === selectedClass.name);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-stone-300 w-full max-w-4xl max-h-[96vh] flex flex-col overflow-hidden text-right">
        
        {/* Controls Bar */}
        <div className="no-print flex items-center justify-between px-6 py-3.5 bg-stone-800 text-white shrink-0">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-sm">
              طباعة كشف المناداة الأزهري الرسمي (A4) - {selectedClass.name}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة الكشف الرسمي (A4)</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-300 hover:text-white rounded-lg hover:bg-stone-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Preview Area */}
        <div className="p-4 sm:p-8 overflow-y-auto bg-stone-100 flex justify-center">
          <div
            ref={printRef}
            className="w-full max-w-[210mm] bg-white text-stone-900 p-8 sm:p-10 shadow-lg border border-stone-300 relative rounded-sm font-sans"
            style={{ minHeight: '297mm' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b-2 border-stone-800 pb-4">
              <div className="text-right text-xs space-y-0.5">
                <p className="font-bold">جمهورية مصر العربية</p>
                <p className="font-bold text-emerald-950 font-amiri text-sm">{instituteSettings.sectorName}</p>
                <p>{instituteSettings.regionName} · {instituteSettings.administrationName}</p>
                <p className="font-bold text-emerald-900">{instituteSettings.instituteName}</p>
              </div>

              <div className="w-16 h-16 rounded-full border border-stone-300 overflow-hidden">
                <img src={instituteSettings.logoUrl} alt="" className="w-full h-full object-cover" />
              </div>

              <div className="text-left text-xs space-y-0.5">
                <p className="font-bold">كشف مناداة أزهري معتمد</p>
                <p className="font-mono text-stone-600 font-bold">{selectedClass.name}</p>
                <p className="text-stone-500">العام: {instituteSettings.academicYear}</p>
                <p className="text-[10px] text-stone-400">القاعة: {selectedClass.roomNumber}</p>
              </div>
            </div>

            {/* Title */}
            <div className="text-center my-4">
              <h2 className="text-lg font-bold text-stone-900 font-amiri">
                كشف قيد وحضور الطلاب (المصريين والوافدين)
              </h2>
              <p className="text-xs text-stone-500">
                إجمالي المقيدين بالفصل: {classStudents.length} طالباً · رائد الفصل: {selectedClass.supervisorTeacherName || 'الشيخ مصطفى عثمان'}
              </p>
            </div>

            {/* Table */}
            <table className="w-full border-collapse border border-stone-400 text-xs text-center mb-6">
              <thead>
                <tr className="bg-stone-100 font-bold text-[11px] text-stone-800">
                  <th className="border border-stone-400 py-1.5 px-1 w-8">م</th>
                  <th className="border border-stone-400 py-1.5 px-2 w-20">كود الطالب</th>
                  <th className="border border-stone-400 py-1.5 px-3 text-right">الاسم الرباعي للطالب</th>
                  <th className="border border-stone-400 py-1.5 px-2">الجنسية</th>
                  <th className="border border-stone-400 py-1.5 px-2">المذهب الفقهي</th>
                  <th className="border border-stone-400 py-1.5 px-2">الرقم القومي / الجواز</th>
                  <th className="border border-stone-400 py-1.5 px-2 w-24">توقيع الطالب / الحضور</th>
                  <th className="border border-stone-400 py-1.5 px-2">ملاحظات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-300">
                {classStudents.map((s, idx) => (
                  <tr key={s.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-stone-50/50'}>
                    <td className="border border-stone-400 py-1.5 font-mono">{idx + 1}</td>
                    <td className="border border-stone-400 py-1.5 font-mono text-[10px]">{s.studentCode}</td>
                    <td className="border border-stone-400 py-1.5 px-3 text-right font-medium text-stone-900">{s.fullName}</td>
                    <td className="border border-stone-400 py-1.5 text-[11px]">
                      {s.isInternational ? s.internationalDetails?.nationality : 'مصري'}
                    </td>
                    <td className="border border-stone-400 py-1.5 text-[11px]">
                      {s.internationalDetails?.madhhab || 'شافعي'}
                    </td>
                    <td className="border border-stone-400 py-1.5 font-mono text-[10px]">{s.nationalId}</td>
                    <td className="border border-stone-400 py-1.5"></td>
                    <td className="border border-stone-400 py-1.5 text-[10px] text-stone-500">{s.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Footer */}
            <div className="grid grid-cols-3 gap-6 pt-6 text-center text-xs mt-10">
              <div>
                <span className="font-bold">رائد الفصل الأزهري</span>
                <p className="text-[11px] text-stone-600 mt-6">{selectedClass.supervisorTeacherName || 'الشيخ مصطفى عثمان'}</p>
              </div>

              <div className="flex flex-col items-center">
                <span className="font-bold">مسؤول شؤون الطلاب</span>
                <p className="text-[11px] text-stone-600 mt-2">{instituteSettings.studentAffairsHead}</p>
                <div className="w-20 h-20 opacity-80 mt-1">
                  <img src={instituteSettings.sealUrl} alt="" className="w-full h-full object-contain" />
                </div>
              </div>

              <div>
                <span className="font-bold">يعتمد، ناظر المعهد</span>
                <p className="text-[11px] text-stone-600 mt-6">{instituteSettings.headmasterName}</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
