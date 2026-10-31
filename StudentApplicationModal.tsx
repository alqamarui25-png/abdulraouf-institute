/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { X, Printer, FileText } from 'lucide-react';
import { Student, InstituteSettings } from '../../types';

interface StudentApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  instituteSettings: InstituteSettings;
}

export const StudentApplicationModal: React.FC<StudentApplicationModalProps> = ({
  isOpen,
  onClose,
  student,
  instituteSettings,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !student) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-stone-300 w-full max-w-4xl max-h-[96vh] flex flex-col overflow-hidden text-right">
        
        {/* Controls */}
        <div className="no-print flex items-center justify-between px-6 py-3.5 bg-stone-800 text-white shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-sm">
              طباعة استمارة قيد وقبول طالب (A4) - {student.fullName}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة الاستمارة الرسمية (A4)</span>
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
            className="w-full max-w-[210mm] bg-white text-stone-900 p-8 sm:p-10 shadow-lg border-2 border-stone-800 relative rounded-sm font-sans"
            style={{ minHeight: '297mm' }}
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b-2 border-emerald-950 pb-4">
              <div className="text-right text-xs space-y-0.5">
                <p className="font-bold text-stone-700">جمهورية مصر العربية</p>
                <p className="font-bold text-emerald-950 font-amiri text-sm">{instituteSettings.sectorName}</p>
                <p>{instituteSettings.regionName} · {instituteSettings.administrationName}</p>
                <p className="font-bold text-emerald-900 text-xs">{instituteSettings.instituteName}</p>
              </div>

              <div className="w-20 h-20 rounded-full border border-amber-600 overflow-hidden shrink-0">
                <img src={instituteSettings.logoUrl} alt="" className="w-full h-full object-cover" />
              </div>

              <div className="flex flex-col items-center">
                <div className="w-20 h-24 border-2 border-stone-700 bg-stone-50 overflow-hidden shadow-xs relative">
                  {student.photoUrl ? (
                    <img src={student.photoUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[9px] text-stone-400">صورة 4×6</div>
                  )}
                  <div className="absolute -bottom-2 -left-2 w-8 h-8 opacity-75">
                    <img src={instituteSettings.sealUrl} alt="" className="w-full h-full object-contain" />
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold mt-1">كود: {student.studentCode}</span>
              </div>
            </div>

            {/* Title */}
            <div className="text-center my-4">
              <h2 className="text-xl font-bold text-emerald-950 font-amiri">
                استمارة قيد والتحاق طالب بالتعليم الأزهري
              </h2>
              <p className="text-xs text-stone-600 mt-0.5">
                للعام الدراسي {instituteSettings.academicYear} · {instituteSettings.stageDescription}
              </p>
            </div>

            {/* Student Personal Data Section */}
            <div className="border border-stone-300 rounded p-4 text-xs space-y-2 mb-4 bg-stone-50/50">
              <h3 className="font-bold text-emerald-950 border-b border-stone-200 pb-1 text-sm">
                أولاً: البيانات الأساسية والشخصية للطالب
              </h3>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div><span>الاسم الرباعي:</span> <strong className="text-stone-900 mr-1">{student.fullName}</strong></div>
                <div><span>الرقم القومي / الجواز:</span> <strong className="font-mono text-stone-900 mr-1">{student.nationalId}</strong></div>
                <div><span>تاريخ ومحل الميلاد:</span> <strong className="text-stone-900 mr-1">{student.birthDate} - {student.birthPlace}</strong></div>
                <div><span>الجنسية:</span> <strong className="text-stone-900 mr-1">{student.isInternational ? student.internationalDetails?.nationality : 'مصري'}</strong></div>
                <div><span>المذهب الفقهي:</span> <strong className="text-emerald-900 mr-1">المذهب ال{student.internationalDetails?.madhhab || 'شافعي'}</strong></div>
                <div><span>الصف والفصل المقيد به:</span> <strong className="text-stone-900 mr-1">{student.className}</strong></div>
                {student.isInternational && (
                  <>
                    <div><span>رقم الإقامة بمصر:</span> <strong className="font-mono mr-1">{student.internationalDetails?.residenceNumber}</strong></div>
                    <div><span>تاريخ انتهاء الإقامة:</span> <strong className="font-mono mr-1">{student.internationalDetails?.residenceExpiry}</strong></div>
                    <div className="col-span-2"><span>الملحقية / جهة الضمان:</span> <strong className="mr-1">{student.internationalDetails?.embassyContact}</strong></div>
                  </>
                )}
              </div>
            </div>

            {/* Guardian Data */}
            <div className="border border-stone-300 rounded p-4 text-xs space-y-2 mb-4 bg-stone-50/50">
              <h3 className="font-bold text-emerald-950 border-b border-stone-200 pb-1 text-sm">
                ثانياً: بيانات ولي الأمر ومحل الإقامة
              </h3>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div><span>اسم ولي الأمر:</span> <strong className="text-stone-900 mr-1">{student.guardianName}</strong></div>
                <div><span>صلة القرابة:</span> <strong className="text-stone-900 mr-1">{student.guardianRelation}</strong></div>
                <div><span>المهنة والوظيفة:</span> <strong className="text-stone-900 mr-1">{student.guardianJob || 'حر'}</strong></div>
                <div><span>رقم الهاتف المحمول:</span> <strong className="font-mono mr-1" dir="ltr">{student.guardianPhone}</strong></div>
                <div className="col-span-2"><span>العنوان الحالي بمصر:</span> <strong className="text-stone-900 mr-1">{student.address} - {student.governorate}</strong></div>
              </div>
            </div>

            {/* Guardian Declaration */}
            <div className="border border-stone-300 rounded p-4 text-xs space-y-1 mb-6 leading-relaxed">
              <h3 className="font-bold text-stone-900 border-b border-stone-200 pb-1">
                ثالثاً: إقرار وتعهد ولي الأمر
              </h3>
              <p className="text-stone-700 pt-1">
                أقر أنا ولي أمر الطالب المذكور أعلاه بصحة كافة البيانات المدونة بهذه الاستمارة، وأتعهد بالتزام نجلي باللوائح والتعليمات الأزهرية المقررة، ومواظبته على الصلوات وحفظ القرآن الكريم والمظهر الأزهري اللائق، وسداد المصروفات والرسوم المقررة في المواعيد المحددة.
              </p>
              <div className="flex justify-between pt-3">
                <span>توقيع ولي الأمر: .......................................</span>
                <span>الرقم القومي لولي الأمر: .......................................</span>
              </div>
            </div>

            {/* Approvals Footer */}
            <div className="grid grid-cols-3 gap-6 pt-4 text-center text-xs items-end">
              <div>
                <span className="font-bold">مسؤول شؤون الطلاب</span>
                <p className="text-[11px] text-stone-600 mt-4">{instituteSettings.studentAffairsHead}</p>
              </div>

              <div className="flex flex-col items-center">
                <span className="font-bold mb-1">خاتم قيد المعهد</span>
                <div className="w-20 h-20 opacity-85">
                  <img src={instituteSettings.sealUrl} alt="" className="w-full h-full object-contain" />
                </div>
              </div>

              <div>
                <span className="font-bold">يعتمد، ناظر المعهد الأزهري</span>
                <p className="text-[11px] text-stone-600 mt-4">{instituteSettings.headmasterName}</p>
              </div>
            </div>

            <div className="border-t border-stone-300 mt-6 pt-2 flex justify-between text-[10px] text-stone-400 font-mono">
              <span>تحريراً في: {new Date().toLocaleDateString('ar-EG')} م</span>
              <span>{instituteSettings.instituteName}</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
