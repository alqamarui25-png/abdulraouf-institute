/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { X, Printer, CreditCard } from 'lucide-react';
import { Student, InstituteSettings } from '../../types';

interface StudentIdCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  instituteSettings: InstituteSettings;
}

export const StudentIdCardModal: React.FC<StudentIdCardModalProps> = ({
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-stone-300 w-full max-w-2xl max-h-[96vh] flex flex-col overflow-hidden text-right">
        
        {/* Controls */}
        <div className="no-print flex items-center justify-between px-6 py-3.5 bg-stone-800 text-white shrink-0">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-sm">
              طباعة بطاقة قيد / كارنيه الطالب المدرسي - {student.fullName}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة الكارنيه الرسمي</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-300 hover:text-white rounded-lg hover:bg-stone-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Preview Area */}
        <div className="p-6 overflow-y-auto bg-stone-100 flex flex-col items-center gap-6 justify-center">
          
          <div ref={printRef} className="space-y-6 flex flex-col items-center">
            
            {/* FRONT OF CARD */}
            <div className="w-[85.6mm] h-[54mm] bg-white rounded-xl shadow-md border-2 border-emerald-900 overflow-hidden relative flex flex-col justify-between p-3 select-none text-right font-sans">
              
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-emerald-900/30 pb-1.5">
                <div className="space-y-0.2">
                  <span className="text-[7px] text-stone-600 font-bold block">
                    {instituteSettings.sectorName}
                  </span>
                  <strong className="text-[9px] text-emerald-950 font-bold block leading-tight font-amiri">
                    {instituteSettings.instituteName}
                  </strong>
                  <span className="text-[7px] text-stone-500 block">
                    بطاقة إثبات قيد طالب أزهري ({instituteSettings.academicYear})
                  </span>
                </div>
                <div className="w-10 h-10 rounded-full border border-amber-500 overflow-hidden shrink-0 bg-white">
                  <img src={instituteSettings.logoUrl} alt="" className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Card Center: Photo & Bio */}
              <div className="flex items-center gap-3 my-auto">
                <div className="w-16 h-20 border border-stone-400 rounded overflow-hidden bg-stone-50 shrink-0 shadow-2xs relative">
                  {student.photoUrl ? (
                    <img src={student.photoUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[8px] text-stone-400">صورة</div>
                  )}
                  {/* Photo mini seal */}
                  <div className="absolute -bottom-1 -left-1 w-6 h-6 opacity-75">
                    <img src={instituteSettings.sealUrl} alt="" className="w-full h-full object-contain" />
                  </div>
                </div>

                <div className="space-y-0.8 text-[8px] flex-1">
                  <div>
                    <span className="text-stone-500">الاسم:</span>{' '}
                    <strong className="text-stone-900 text-[9.5px]">{student.fullName}</strong>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-amber-100 text-amber-950 font-bold px-1.5 py-0.5 rounded text-[8px] border border-amber-300">
                      رقم السجل: <span className="font-mono">{student.recordNumber}</span>
                    </span>
                    {student.seatNumber && (
                      <span className="bg-emerald-50 text-emerald-900 font-bold px-1.5 py-0.5 rounded text-[7.5px] border border-emerald-200">
                        رقم الجلوس: <span className="font-mono">{student.seatNumber}</span>
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="text-stone-500">كود الطالب:</span>{' '}
                    <strong className="font-mono text-emerald-950 font-bold">{student.studentCode}</strong>
                  </div>
                  <div>
                    <span className="text-stone-500">
                      {student.isInternational ? 'الجواز:' : 'الرقم القومي:'}
                    </span>{' '}
                    <strong className="font-mono">{student.nationalId}</strong>
                    {student.isInternational && student.internationalDetails?.passportExpiryDate && (
                      <span className="text-[6.5px] text-stone-500 mr-1 font-mono">
                        (انتهاء: {student.internationalDetails.passportExpiryDate})
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="text-stone-500">الصف:</span>{' '}
                    <strong className="text-stone-800">{student.className}</strong>
                  </div>
                  <div>
                    <span className="text-stone-500">الجنسية:</span>{' '}
                    <strong>{student.isInternational ? student.internationalDetails?.nationality : 'مصري'}</strong>
                    {student.internationalDetails?.madhhab && (
                      <span className="mr-1 text-emerald-800">· مذهب {student.internationalDetails.madhhab}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="border-t border-stone-200 pt-1 flex items-center justify-between text-[7px] text-stone-600">
                <div className="w-24 h-4 bg-stone-900 text-white font-mono text-[6px] flex items-center justify-center tracking-widest">
                  ||| REC#{student.recordNumber} - {student.studentCode} |||
                </div>
                <div>
                  يعتمد، ناظر المعهد: <strong className="text-stone-900">{instituteSettings.headmasterName}</strong>
                </div>
              </div>

            </div>

            {/* BACK OF CARD */}
            <div className="w-[85.6mm] h-[54mm] bg-stone-50 rounded-xl shadow-md border-2 border-stone-400 overflow-hidden relative flex flex-col justify-between p-3 select-none text-right font-sans text-[7.5px] leading-relaxed">
              <div>
                <strong className="block text-emerald-950 text-[8px] font-bold border-b border-stone-200 pb-1 mb-1">
                  تعليمات وضوابط استخدام البطاقة المدرسية:
                </strong>
                <ol className="list-decimal list-inside space-y-0.5 text-stone-700">
                  <li>هذه البطاقة شخصية وتعتبر وثيقة رسمية لإثبات قيد الطالب بالمعهد.</li>
                  <li>يجب إبرازها عند دخول لجان الامتحانات وبوابة المعهد واستعارة الكتب.</li>
                  <li>في حال فقدان البطاقة يرجى إخطار إدارة شؤون الطلاب فوراً.</li>
                  <li>صالحة للعام الدراسي الموضح فقط ومختومة بخاتم المعهد المعتمد.</li>
                </ol>
              </div>

              <div className="flex items-center justify-between border-t border-stone-200 pt-1">
                <div className="space-y-0.2">
                  <p>العنوان: {instituteSettings.address}</p>
                  <p>هاتف المعهد: {instituteSettings.phone}</p>
                </div>
                <div className="w-10 h-10 opacity-80">
                  <img src={instituteSettings.sealUrl} alt="" className="w-full h-full object-contain" />
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
