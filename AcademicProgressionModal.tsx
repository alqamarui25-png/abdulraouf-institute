/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Printer, FileText, CheckCircle2, Globe, Building2 } from 'lucide-react';
import { Student, InstituteSettings, AcademicHistoryRecord } from '../../types';

interface AcademicProgressionModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  academicHistory: AcademicHistoryRecord[];
  instituteSettings: InstituteSettings;
}

export const AcademicProgressionModal: React.FC<AcademicProgressionModalProps> = ({
  isOpen,
  onClose,
  student,
  academicHistory,
  instituteSettings,
}) => {
  const [docType, setDocType] = useState<'international' | 'general'>(
    student?.isInternational ? 'international' : 'general'
  );
  const [destination, setDestination] = useState('المنحة');
  const [customNotes, setCustomNotes] = useState('');

  if (!isOpen || !student) return null;

  const handlePrint = () => {
    window.print();
  };

  const todayStr = new Date().toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  // Academic progression years for Image 1 template (8 years progression)
  const progressionYears = [
    { year: '2019 - 2020 م', status: 'غير موجود' },
    { year: '2020 - 2021 م', status: 'غير موجود' },
    { year: '2021 - 2022 م', status: 'غير موجود' },
    { year: '2022 - 2023 م', status: 'غير موجود' },
    { year: '2023 - 2024 م', status: student.stage === 'secondary' ? 'ثاني إعدادي ناجح' : 'غير موجود' },
    { year: '2024 - 2025 م', status: student.stage === 'secondary' ? 'ثالث إعدادي مستجد' : 'أول إعدادي مستجد' },
    { year: '2025 - 2026 م', status: student.className },
    { year: '2026 - 2027 م', status: student.status === 'graduated' ? 'خريج ناجح' : 'مقيد بالصف التالي' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-900/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-stone-300 w-full max-w-4xl max-h-[96vh] flex flex-col overflow-hidden text-right">
        
        {/* Header Controls (No-Print) */}
        <div className="no-print flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 px-6 py-3.5 bg-emerald-950 text-white shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-sm">
                بيان التدرج الدراسي وإثبات القيد الرسمي الأزهرى - {student.fullName}
              </h3>
              <p className="text-[11px] text-emerald-200">
                نماذج رسمية معتمدة من قطاع المعاهد الأزهرية ومجمع البحوث الإسلامية (أصلية A4)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة المستند A4</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-300 hover:text-white rounded-lg hover:bg-emerald-900 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar & Options (No-Print) */}
        <div className="no-print bg-stone-100 p-3 px-6 border-b border-stone-300 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-700">اختر نموذج التدرج:</span>
            
            <button
              onClick={() => setDocType('international')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border font-semibold cursor-pointer transition-colors ${
                docType === 'international'
                  ? 'bg-emerald-800 text-white border-emerald-900 shadow-2xs'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>نموذج الوافدين (مجمع البحوث الإسلامية)</span>
            </button>

            <button
              onClick={() => setDocType('general')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border font-semibold cursor-pointer transition-colors ${
                docType === 'general'
                  ? 'bg-emerald-800 text-white border-emerald-900 shadow-2xs'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>نموذج عام (قطاع المعاهد وشؤون الطلاب)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <label className="font-semibold text-stone-700">جهة التقديم:</label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="مثال: المنحة / تجديد الإقامة / السفارة"
              className="px-2.5 py-1 bg-white border border-stone-300 rounded text-xs w-48 font-medium"
            />
          </div>
        </div>

        {/* PRINTABLE A4 CONTAINER */}
        <div className="p-4 sm:p-8 overflow-y-auto bg-stone-200/50 flex justify-center">
          
          {/* ============================================================== */}
          {/* TEMPLATE 1: إثبات قيد وتدرج دراسي (للوافدين - مجمع البحوث الإسلامية) */}
          {/* مطابق للصورة IMG_20261031_0003_57c26011.jpg */}
          {/* ============================================================== */}
          {docType === 'international' && (
            <div className="w-[210mm] min-h-[297mm] bg-white text-black p-8 sm:p-10 shadow-lg border border-stone-300 flex flex-col justify-between font-sans relative text-right text-[12px] leading-relaxed">
              
              <div>
                {/* Official Header */}
                <div className="grid grid-cols-3 items-start pb-2 border-b-2 border-stone-900">
                  
                  {/* Left: Student Photo */}
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-28 border border-stone-800 rounded overflow-hidden bg-stone-50 flex items-center justify-center shadow-xs">
                      {student.photoUrl ? (
                        <img src={student.photoUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] text-stone-400">صورة الطالب</span>
                      )}
                    </div>
                    <span className="text-[10px] font-bold mt-1 text-center font-mono">
                      {student.fullName.split(' ').slice(0, 3).join(' ')}
                    </span>
                    <span className="text-[9px] font-mono text-stone-600">
                      {student.nationalId}
                    </span>
                  </div>

                  {/* Center: Emblem and Record Number Box */}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-14 h-14 mb-1">
                      <img src={instituteSettings.logoUrl} alt="" className="w-full h-full object-contain" />
                    </div>
                    
                    <div className="border-2 border-stone-900 px-5 py-1 rounded bg-stone-50 text-stone-900 font-bold">
                      <span className="text-[11px] block">رقم سجل الطالب:</span>
                      <strong className="text-base font-mono block tracking-wider">
                        {student.recordNumber}
                      </strong>
                    </div>
                  </div>

                  {/* Right: Azhar Hierarchy */}
                  <div className="text-right space-y-0.5 text-[11px] font-semibold">
                    <strong className="text-[13px] font-bold block text-emerald-950 font-amiri">الأزهر الشريف</strong>
                    <span className="block">قطاع المعاهد الأزهرية</span>
                    <span className="block">الإدارة العامة للتعليم النوعي</span>
                    <strong className="block text-stone-900 font-bold">{instituteSettings.instituteName}</strong>
                    <span className="text-[10px] text-stone-600 block">{instituteSettings.stageDescription}</span>
                  </div>
                </div>

                {/* Title */}
                <div className="text-center my-3">
                  <h1 className="text-xl font-bold tracking-wide text-stone-950 underline decoration-2 underline-offset-8 font-amiri">
                    إثبـــات قيـــد وتــــدرج دراســــي
                  </h1>
                </div>

                {/* Student Bio Grid (Matching Image 1 fields exactly) */}
                <div className="border border-stone-800 p-3 rounded-lg bg-stone-50/50 mb-3 text-[11.5px] leading-loose">
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                    <div>
                      <span className="font-bold">يفيد معهد {instituteSettings.instituteName} بأن الطالب:</span>{' '}
                      <strong className="text-stone-950 border-b border-dotted border-stone-600 px-1 font-bold">
                        {student.fullName}
                      </strong>
                    </div>

                    <div>
                      <span className="font-bold">الجنسية:</span>{' '}
                      <strong className="border-b border-dotted border-stone-600 px-1 font-bold">
                        {student.internationalDetails?.nationality || 'مصري'}
                      </strong>
                    </div>

                    <div>
                      <span className="font-bold">مقيد بالمعهد بالصف:</span>{' '}
                      <strong className="border-b border-dotted border-stone-600 px-1 font-bold">
                        {student.className}
                      </strong>
                    </div>

                    <div>
                      <span className="font-bold">للعام الدراسي:</span>{' '}
                      <strong className="font-mono border-b border-dotted border-stone-600 px-1">
                        {instituteSettings.academicYear}
                      </strong>
                    </div>

                    <div>
                      <span className="font-bold">رقم الجواز / القومي:</span>{' '}
                      <strong className="font-mono border-b border-dotted border-stone-600 px-1">
                        {student.nationalId}
                      </strong>
                      {student.internationalDetails?.passportExpiryDate && (
                        <span className="text-[10px] text-stone-600 mr-2 font-mono">
                          (صالح حتى: {student.internationalDetails.passportExpiryDate})
                        </span>
                      )}
                    </div>

                    <div>
                      <span className="font-bold">رقم الطالب / السجل:</span>{' '}
                      <strong className="font-mono text-emerald-950 font-bold border-b border-dotted border-stone-600 px-1">
                        {student.recordNumber}
                      </strong>
                    </div>

                    <div>
                      <span className="font-bold">الفصل:</span>{' '}
                      <strong className="border-b border-dotted border-stone-600 px-1">
                        {student.className}
                      </strong>
                    </div>

                    <div>
                      <span className="font-bold">تاريخ الإلتحاق بالأزهر:</span>{' '}
                      <strong className="font-mono border-b border-dotted border-stone-600 px-1">
                        {student.internationalDetails?.azharEnrollmentDate || student.enrollmentDate}
                      </strong>
                    </div>

                    <div>
                      <span className="font-bold">تاريخ الإلتحاق بالمعهد:</span>{' '}
                      <strong className="font-mono border-b border-dotted border-stone-600 px-1">
                        {student.enrollmentDate}
                      </strong>
                    </div>

                    <div>
                      <span className="font-bold">تاريخ الفصل الأول:</span>{' '}
                      <span className="font-mono">-</span>
                    </div>

                    <div>
                      <span className="font-bold">تاريخ إعادة القيد الأولى:</span>{' '}
                      <span className="font-mono">-</span>
                    </div>

                    <div>
                      <span className="font-bold">تاريخ الفصل الثاني:</span>{' '}
                      <span className="font-mono">-</span>
                    </div>

                    <div>
                      <span className="font-bold">رقم الواتس:</span>{' '}
                      <strong className="font-mono border-b border-dotted border-stone-600 px-1">
                        {student.internationalDetails?.whatsappNumber || student.guardianPhone}
                      </strong>
                    </div>

                    <div>
                      <span className="font-bold">رقم الهاتف:</span>{' '}
                      <strong className="font-mono border-b border-dotted border-stone-600 px-1">
                        {student.guardianPhone}
                      </strong>
                    </div>

                    <div className="col-span-2">
                      <span className="font-bold">العنوان:</span>{' '}
                      <span className="border-b border-dotted border-stone-600 px-1">
                        {student.address}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Academic Progression Table (Matching Image 1: 4 columns x 4 rows) */}
                <div className="mb-3">
                  <h3 className="font-bold text-center text-[12px] mb-1 font-amiri text-stone-900 underline">
                    وتــــدرجـــه الــــدراســـي كـــالآتـــي:-
                  </h3>

                  <table className="w-full border-2 border-stone-900 text-center text-[11px] divide-y divide-stone-900">
                    <thead className="bg-stone-100 font-bold">
                      <tr>
                        <th className="py-1 px-2 border-l border-stone-900 w-1/4">العام الدراسي</th>
                        <th className="py-1 px-2 border-l-2 border-stone-900 w-1/4">حالة الطالب</th>
                        <th className="py-1 px-2 border-l border-stone-900 w-1/4">العام الدراسي</th>
                        <th className="py-1 px-2 w-1/4">حالة الطالب</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800">
                      <tr>
                        <td className="py-1 px-2 border-l border-stone-900 font-mono">2019 - 2020 م</td>
                        <td className="py-1 px-2 border-l-2 border-stone-900 font-medium">غير موجود</td>
                        <td className="py-1 px-2 border-l border-stone-900 font-mono">2023 - 2024 م</td>
                        <td className="py-1 px-2 font-medium">غير موجود</td>
                      </tr>
                      <tr>
                        <td className="py-1 px-2 border-l border-stone-900 font-mono">2020 - 2021 م</td>
                        <td className="py-1 px-2 border-l-2 border-stone-900 font-medium">غير موجود</td>
                        <td className="py-1 px-2 border-l border-stone-900 font-mono">2024 - 2025 م</td>
                        <td className="py-1 px-2 font-medium">
                          {student.stage === 'secondary' ? 'ثالث إعدادي مستجد' : 'أول إعدادي مستجد'}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1 px-2 border-l border-stone-900 font-mono">2021 - 2022 م</td>
                        <td className="py-1 px-2 border-l-2 border-stone-900 font-medium">غير موجود</td>
                        <td className="py-1 px-2 border-l border-stone-900 font-mono">2025 - 2026 م</td>
                        <td className="py-1 px-2 font-bold text-stone-950">
                          {student.className}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1 px-2 border-l border-stone-900 font-mono">2022 - 2023 م</td>
                        <td className="py-1 px-2 border-l-2 border-stone-900 font-medium">غير موجود</td>
                        <td className="py-1 px-2 border-l border-stone-900 font-mono">2026 - 2027 م</td>
                        <td className="py-1 px-2 font-medium">
                          {student.status === 'graduated' ? 'خريج ناجح' : 'مقيد بالصف التالي'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Certification Statement */}
                <div className="text-[11.5px] leading-relaxed my-2 space-y-1">
                  <p>
                    وقد أُعطي له هذا الإثبات بناءً على طلبه وذلك لتقديمه إلى:{' '}
                    <strong className="underline decoration-1 font-bold text-stone-950">
                      ({destination || 'المنحة / الإقامة'})
                    </strong>.
                  </p>
                  <p className="text-[10px] text-stone-700">
                    ولا يجوز تقديمه إلى جهة أخرى دون أدنى مسئولية على المعهد والمنطقة وقطاع المعاهد الأزهرية عما ورد به من بيانات بالنسبة لحقوق الغير.
                  </p>
                  <div className="flex items-center justify-between pt-1">
                    <span>
                      تحريراً في:{' '}
                      <strong className="font-mono">{todayStr}</strong>
                    </span>
                    <strong className="text-emerald-950 font-bold">
                      الطالب المذكور مقيد بسجلات الوافدين
                    </strong>
                  </div>
                </div>

                {/* Institute Signatures & Seal (Image 1 layout) */}
                <div className="grid grid-cols-4 items-center text-center text-[10.5px] pt-3 pb-2 border-b border-dashed border-stone-400 relative">
                  <div>
                    <span className="block font-bold">شئون الطلاب</span>
                    <span className="block mt-4 text-stone-700">{instituteSettings.studentAffairsHead}</span>
                  </div>

                  <div>
                    <span className="block font-bold">المراجع</span>
                    <span className="block mt-4 text-stone-700">أحمد رجب</span>
                  </div>

                  <div className="relative">
                    <span className="block font-bold">شيخ المعهد</span>
                    <span className="block mt-4 text-stone-900 font-bold">{instituteSettings.headmasterName}</span>
                    {/* Official Blue Rubber Stamp */}
                    <div className="absolute top-1 left-1/2 -translate-x-1/2 w-20 h-20 opacity-80 pointer-events-none">
                      <img src={instituteSettings.sealUrl} alt="" className="w-full h-full object-contain" />
                    </div>
                  </div>

                  <div>
                    <span className="block font-bold">يعتمد</span>
                    <span className="block text-[9.5px]">مدير عام الطلاب الوافدين</span>
                    <span className="block mt-2 font-mono text-stone-600">...........</span>
                  </div>
                </div>

                {/* Lower Official Endorsement: مجمع البحوث الإسلامية (Image 1) */}
                <div className="mt-2 p-3 border border-stone-800 rounded bg-stone-50/70 text-[11px] leading-relaxed">
                  <div className="text-center font-bold font-amiri text-[12px] mb-1">
                    الأزهر الشريف · مجمع البحوث الإسلامية · الإدارة العامة للطلاب الوافدين
                  </div>
                  
                  <div className="flex items-center justify-between text-[11px]">
                    <div>
                      <span>الطالب المذكور:</span>{' '}
                      <strong className="font-bold">{student.fullName}</strong>
                    </div>
                    <div>
                      <span>وجنسيته:</span>{' '}
                      <strong className="font-bold">{student.internationalDetails?.nationality || 'مصري'}</strong>
                    </div>
                  </div>

                  <p className="mt-1">
                    والذي يحمل جواز سفر رقم:{' '}
                    <strong className="font-mono font-bold">{student.nationalId}</strong>{' '}
                    (مقيد) على منح الأزهر للعام الدراسي:{' '}
                    <strong className="font-mono font-bold">{instituteSettings.academicYear}</strong>
                  </p>
                  <p className="text-[10px] text-stone-600 mt-0.5">
                    وذلك دون أدنى مسئولية على الإدارة عما ورد من بيانات في هذا الإثبات.
                  </p>

                  <div className="flex items-center justify-between pt-3 text-[10px] font-bold">
                    <span>تحريراً في: <span className="font-mono">{todayStr}</span></span>
                    <span>إدارة المنح والإقامة: ....................</span>
                    <span>مدير عام الطلاب الوافدين: ....................</span>
                  </div>
                </div>

              </div>

              {/* Bottom Instructions / Notes (Image 1) */}
              <div className="border-t border-stone-800 pt-1 text-[9.5px] text-stone-700 leading-tight">
                <strong>ملاحظات هامة:</strong>
                <ol className="list-decimal list-inside space-y-0.5 mt-0.5">
                  <li>أي كشط أو شطب في البيانات لهذا الإثبات يلغيه، ولا يعتد بأي صورة ضوئية منه.</li>
                  <li>على الجهة المقدم إليها الإثبات التأكد والتحقق من شخصية صاحبه.</li>
                </ol>
              </div>

            </div>
          )}

          {/* ============================================================== */}
          {/* TEMPLATE 2: بيان حالة قيد طالب (عام للمصريين والوافدين) */}
          {/* مطابق للصورة SDF_f6686ae9.jpg */}
          {/* ============================================================== */}
          {docType === 'general' && (
            <div className="w-[210mm] min-h-[297mm] bg-white text-black p-8 sm:p-10 shadow-lg border border-stone-300 flex flex-col justify-between font-sans relative text-right text-[12px] leading-relaxed">
              
              <div>
                {/* Header matching Image 2 */}
                <div className="flex items-start justify-between pb-3 border-b-2 border-stone-800">
                  <div className="w-14 h-14">
                    <img src={instituteSettings.logoUrl} alt="" className="w-full h-full object-contain" />
                  </div>

                  <div className="text-center">
                    <div className="border-2 border-stone-900 px-6 py-1.5 rounded-sm bg-stone-50 font-bold text-lg font-amiri tracking-wider shadow-2xs">
                      بيــــان حـــالـــة قيــــد طـــالـــب
                    </div>
                    <span className="text-[10px] text-stone-600 font-mono mt-1 block">
                      رقم السجل: {student.recordNumber} · العام الدراسي {instituteSettings.academicYear}
                    </span>
                  </div>

                  <div className="text-right space-y-0.5 text-[11px] font-semibold">
                    <strong className="text-[13px] font-bold block text-emerald-950 font-amiri">الأزهر الشريف</strong>
                    <span className="block">قطاع المعاهد الأزهرية</span>
                    <span className="block">الإدارة المركزية للامتحانات</span>
                    <span className="block">الإدارة العامة لشئون الطلاب</span>
                  </div>
                </div>

                {/* Form Body Statement matching Image 2 */}
                <div className="my-5 p-4 border border-stone-800 rounded bg-stone-50/40 space-y-3 text-[12px] leading-loose">
                  <p>
                    يفيد معهد{' '}
                    <strong className="underline font-bold px-1">{instituteSettings.instituteName}</strong>{' '}
                    التابع لمنطقة{' '}
                    <strong className="underline font-bold px-1">{instituteSettings.regionName}</strong> بأن:
                  </p>

                  <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                    <div>
                      <span>الطالب /</span>{' '}
                      <strong className="text-stone-950 font-bold text-[13px] underline px-1">
                        {student.fullName}
                      </strong>
                    </div>

                    <div>
                      <span>مقيد بالمعهد للعام الدراسي /</span>{' '}
                      <strong className="font-mono font-bold underline px-1">
                        {instituteSettings.academicYear}
                      </strong>
                    </div>

                    <div>
                      <span>بالصف /</span>{' '}
                      <strong className="underline font-bold px-1">{student.className}</strong>
                    </div>

                    <div>
                      <span>من المرحلة /</span>{' '}
                      <strong className="underline font-bold px-1">
                        {student.stage === 'secondary' ? 'الثانوية' : 'الإعدادية'}
                      </strong>
                      {student.track && (
                        <span>
                          {' '}بالقسم:{' '}
                          <strong className="underline font-bold px-1">
                            {student.track === 'scientific' ? 'العلمي' : student.track === 'literary' ? 'الأدبي' : 'العام'}
                          </strong>
                        </span>
                      )}
                    </div>

                    <div>
                      <span>الرقم القومي / الجواز للطالب:</span>{' '}
                      <strong className="font-mono font-bold underline px-1">{student.nationalId}</strong>
                    </div>

                    <div>
                      <span>حالة القيد /</span>{' '}
                      <strong className="underline font-bold px-1">
                        {student.status === 'graduated' ? 'خريج ناجح' : 'مقيد مستجد'}
                      </strong>
                    </div>

                    <div>
                      <span>بلد الجنسية /</span>{' '}
                      <strong className="underline font-bold px-1">
                        {student.isInternational ? student.internationalDetails?.nationality : 'جمهورية مصر العربية'}
                      </strong>
                    </div>

                    <div>
                      <span>النوع /</span>{' '}
                      <strong className="underline font-bold px-1">ذكر</strong>
                      <span className="mr-3">حالة الإبصار /</span>{' '}
                      <strong className="underline font-bold px-1">مبصر</strong>
                    </div>

                    <div>
                      <span>المذهب الفقهي /</span>{' '}
                      <strong className="underline font-bold px-1 text-emerald-950">
                        {student.internationalDetails?.madhhab || 'شافعي'}
                      </strong>
                    </div>

                    <div>
                      <span>نوع الدراسة /</span>{' '}
                      <strong className="underline font-bold px-1">عادي</strong>
                    </div>
                  </div>
                </div>

                {/* Progression Table matching Image 2 */}
                <div className="my-4">
                  <h3 className="font-bold text-center text-sm mb-2 font-amiri text-stone-950 underline">
                    التـــدرج الـــدراســـي للـــطالـــب
                  </h3>

                  <table className="w-full border-2 border-stone-900 text-center text-xs divide-y divide-stone-900">
                    <thead className="bg-stone-100 font-bold">
                      <tr>
                        <th className="py-2 px-3 border-l border-stone-900 w-1/3">العام الدراسي</th>
                        <th className="py-2 px-3 border-l border-stone-900 w-1/3">الصف الدراسي</th>
                        <th className="py-2 px-3 w-1/3">حالة القيد</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800">
                      {academicHistory.filter(h => h.studentId === student.id).length > 0 ? (
                        academicHistory
                          .filter(h => h.studentId === student.id)
                          .map((hist, idx) => (
                            <tr key={idx}>
                              <td className="py-2 px-3 border-l border-stone-900 font-mono font-bold">
                                {hist.schoolYear}
                              </td>
                              <td className="py-2 px-3 border-l border-stone-900">
                                {hist.grade === 'sec_1' ? 'الأول الثانوي' : hist.grade === 'sec_2' ? 'الثاني الثانوي' : hist.grade === 'sec_3' ? 'الثالث الثانوي' : 'المرحلة الإعدادية'}
                              </td>
                              <td className="py-2 px-3 font-semibold text-emerald-950">
                                {hist.evaluation === 'ممتاز' ? 'ناجح بتفوق (مستجد)' : 'ناجح ومنقول'}
                              </td>
                            </tr>
                          ))
                      ) : (
                        <>
                          <tr>
                            <td className="py-2 px-3 border-l border-stone-900 font-mono">2024 / 2025</td>
                            <td className="py-2 px-3 border-l border-stone-900">الصف السابق المعتمد</td>
                            <td className="py-2 px-3">ناجح ومنقول</td>
                          </tr>
                          <tr>
                            <td className="py-2 px-3 border-l border-stone-900 font-mono font-bold">
                              {instituteSettings.academicYear}
                            </td>
                            <td className="py-2 px-3 border-l border-stone-900 font-bold">
                              {student.className}
                            </td>
                            <td className="py-2 px-3 font-bold text-emerald-950">
                              {student.status === 'graduated' ? 'خريج ناجح' : 'مقيد مستجد'}
                            </td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Institute Accreditation Section (اعتماد المعهد) */}
                <div className="mt-4 p-3 border border-stone-800 rounded bg-stone-50/50 text-[11.5px] leading-relaxed relative">
                  <h4 className="font-bold underline text-stone-950 mb-1">اعتماد المعهد:</h4>
                  <p>
                    البيانات أعلاه صحيحة ومطابقة للسجلات، وقد تم إصدار هذا البيان بناءً على الطلب المقدم من السيد/{' '}
                    <strong className="underline font-bold">{student.guardianName}</strong> ولي أمر الطالب ورقمه القومي/{' '}
                    <strong className="font-mono">{student.guardianPhone}</strong> بعد التأكد من صحة ولايته التعليمية لتقديمه إلى:{' '}
                    <strong className="underline font-bold text-stone-950">({destination || 'المنحة'})</strong>.
                  </p>

                  <div className="flex items-center justify-between pt-2">
                    <span>
                      تاريخ تحرير الطلب:{' '}
                      <strong className="font-mono">{todayStr}</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-3 items-center text-center text-[11px] pt-4">
                    <div>
                      <span className="block font-bold">شئون طلاب المعهد</span>
                      <span className="block mt-4 text-stone-700">{instituteSettings.studentAffairsHead}</span>
                    </div>

                    <div className="relative">
                      <span className="block font-bold">شيخ المعهد</span>
                      <span className="block mt-4 text-stone-900 font-bold">{instituteSettings.headmasterName}</span>
                      
                      {/* Official Stamp */}
                      <div className="absolute top-1 left-1/2 -translate-x-1/2 w-20 h-20 opacity-80 pointer-events-none">
                        <img src={instituteSettings.sealUrl} alt="" className="w-full h-full object-contain" />
                      </div>
                    </div>

                    <div>
                      <span className="block font-bold">خاتم المعهد</span>
                      <span className="block text-[10px] text-stone-500 mt-4">(بصمة الختم الرسمي)</span>
                    </div>
                  </div>
                </div>

                {/* Region Accreditation Section (اعتماد المنطقة الأزهرية) */}
                <div className="mt-3 p-3 border border-stone-800 rounded bg-stone-50/30 text-[11px] leading-relaxed">
                  <div className="text-center font-bold font-amiri text-sm mb-1">
                    اعتمــــاد المنطقــــة الأزهـــريـــة ({instituteSettings.regionName})
                  </div>
                  <p className="text-center font-semibold text-[11.5px]">
                    يُعتمد بيان حالة قيد الطالب رسميًا بموجب سجلات المنطقة.
                  </p>

                  <div className="grid grid-cols-3 items-center text-center pt-4 text-[10.5px]">
                    <div>
                      <span className="block font-bold">المختص بالمنطقة</span>
                      <span className="block mt-4 text-stone-600">....................</span>
                    </div>

                    <div>
                      <span className="block font-bold">مدير إدارة الامتحانات</span>
                      <span className="block mt-4 text-stone-600">....................</span>
                    </div>

                    <div>
                      <span className="block font-bold">رئيس الإدارة المركزية للمنطقة</span>
                      <span className="block mt-4 text-stone-900 font-bold">أ. د. رئيس منطقة القاهرة الأزهرية</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Footer Notice */}
              <div className="border-t border-stone-800 pt-1 text-[9.5px] text-stone-500 text-center">
                معهد عبد الرؤوف الإعدادي والثانوي الأزهري بنين · الإدارة المركزية للامتحانات · لا يعتد بهذا البيان بدون الختم الحي
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
