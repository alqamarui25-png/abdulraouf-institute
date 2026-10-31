/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { X, Printer, Award, ShieldCheck, Download } from 'lucide-react';
import { Student, ExamResult, Subject, InstituteSettings } from '../../types';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  examResults?: ExamResult[];
  subjects?: Subject[];
  instituteSettings: InstituteSettings;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  student,
  examResults = [],
  subjects = [],
  instituteSettings,
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !student) return null;

  const handlePrint = () => {
    window.print();
  };

  // Grade and Stage labels in Arabic
  const getGradeArabic = (grade: string) => {
    switch (grade) {
      case 'prep_1': return 'الصف الأول الإعدادي';
      case 'prep_2': return 'الصف الثاني الإعدادي';
      case 'prep_3': return 'الصف الثالث الإعدادي (الشهادة الإعدادية)';
      case 'sec_1': return 'الصف الأول الثانوي';
      case 'sec_2': return 'الصف الثاني الثانوي';
      case 'sec_3': return 'الصف الثالث الثانوي (الشهادة الثانوية)';
      default: return grade;
    }
  };

  const getStageArabic = (stage: string) => {
    return stage === 'preparatory' ? 'المرحلة الإعدادية' : 'المرحلة الثانوية';
  };

  const getTrackArabic = (track?: string) => {
    if (track === 'scientific') return 'القسم العلمي';
    if (track === 'literary') return 'القسم الأدبي';
    return 'القسم العام';
  };

  const sampleMarks = [
    { name: 'القرآن الكريم والتجويد', category: 'مواد شرعية', max: 50, oral: 15, written: 23, total: 48, pass: true },
    { name: student.internationalDetails?.madhhab === 'حنفي' ? 'الفقه الحنفي' : student.internationalDetails?.madhhab === 'مالكي' ? 'الفقه المالكي' : 'الفقه الشافعي', category: 'مواد شرعية', max: 40, oral: 10, written: 28, total: 38, pass: true },
    { name: 'أصول الدين (التفسير والحديث والتوحيد والسيرة)', category: 'مواد شرعية', max: 100, oral: 20, written: 75, total: 95, pass: true },
    { name: 'النحو والصرف', category: 'مواد عربية', max: 40, oral: 10, written: 27, total: 37, pass: true },
    { name: 'البلاغة والأدب والنصوص والمطالعة', category: 'مواد عربية', max: 40, oral: 10, written: 26, total: 36, pass: true },
    { name: 'اللغة الإنجليزية', category: 'مواد ثقافية', max: 40, oral: 8, written: 28, total: 36, pass: true },
    { name: 'الدراسات الاجتماعية / التاريخ والجغرافيا', category: 'مواد ثقافية', max: 40, oral: 8, written: 29, total: 37, pass: true },
    { name: 'الرياضيات والعلوم', category: 'مواد علمية', max: 60, oral: 10, written: 46, total: 56, pass: true },
  ];

  const totalMax = sampleMarks.reduce((acc, curr) => acc + curr.max, 0);
  const totalScore = sampleMarks.reduce((acc, curr) => acc + curr.total, 0);
  const percentage = Math.round((totalScore / totalMax) * 1000) / 10;

  const getEvaluation = (pct: number) => {
    if (pct >= 85) return 'ممتاز مع مرتبة الشرف';
    if (pct >= 75) return 'جيد جداً';
    if (pct >= 65) return 'جيد';
    if (pct >= 50) return 'مقبول';
    return 'دور ثان';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-900/70 backdrop-blur-xs overflow-y-auto">
      
      {/* Outer Wrapper */}
      <div className="bg-white rounded-xl shadow-2xl border border-stone-300 w-full max-w-4xl max-h-[96vh] flex flex-col overflow-hidden text-right">
        
        {/* Modal Controls Bar (Hidden in Print) */}
        <div className="no-print flex items-center justify-between px-6 py-3.5 bg-stone-800 text-white shrink-0">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-sm">
              معاينة وطباعة الشهادة الرسمية A4 - {instituteSettings.instituteName}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة الشهادة الرسمية (A4)</span>
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
        <div className="p-4 sm:p-8 overflow-y-auto bg-stone-100/70 flex justify-center">
          
          {/* Printable A4 Certificate Container */}
          <div
            ref={certificateRef}
            className="w-full max-w-[210mm] bg-white text-stone-900 p-8 sm:p-10 shadow-lg border-8 border-double border-emerald-900 relative rounded-sm font-sans"
            style={{ minHeight: '297mm' }}
          >
            {/* Watermark in background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.035] overflow-hidden">
              <img
                src={instituteSettings.logoUrl}
                alt=""
                className="w-[140mm] h-[140mm] object-contain"
              />
            </div>

            {/* Azhar Official Header */}
            <div className="flex items-start justify-between border-b-2 border-emerald-900 pb-5">
              
              {/* Official Institute Info (Right) */}
              <div className="text-right space-y-0.5">
                <p className="text-xs font-bold text-stone-700">جمهورية مصر العربية</p>
                <p className="text-sm font-black text-emerald-950 font-amiri">{instituteSettings.sectorName}</p>
                <p className="text-xs text-stone-600">{instituteSettings.regionName} · {instituteSettings.administrationName}</p>
                <p className="text-xs font-bold text-emerald-900">
                  {instituteSettings.instituteName}
                </p>
                <p className="text-[10px] text-stone-500 font-mono">كود المعهد: {instituteSettings.instituteCode}</p>
              </div>

              {/* Official Crest (Center) */}
              <div className="flex flex-col items-center justify-center px-4">
                <div className="w-24 h-24 rounded-full border-2 border-amber-600 p-0.5 shadow-xs bg-white">
                  <img
                    src={instituteSettings.logoUrl}
                    alt="شعار المعهد"
                    className="w-full h-full object-cover rounded-full"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="text-[10px] font-bold text-emerald-950 mt-1">
                  {instituteSettings.establishedYear}
                </span>
              </div>

              {/* Student Photo & Official Box (Left) */}
              <div className="flex flex-col items-center text-center">
                <div className="w-22 h-28 border-2 border-stone-800 bg-stone-50 overflow-hidden shadow-xs relative">
                  {student.photoUrl ? (
                    <img
                      src={student.photoUrl}
                      alt={student.fullName}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-stone-400">
                      صورة الطالب 4×6
                    </div>
                  )}
                  {/* Photo Stamp */}
                  <div className="absolute -bottom-2 -left-2 w-10 h-10 opacity-75 pointer-events-none">
                    <img src={instituteSettings.sealUrl} alt="" className="w-full h-full object-contain" />
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-stone-700 mt-1">
                  رقم القيد: {student.studentCode}
                </span>
              </div>

            </div>

            {/* Certificate Title */}
            <div className="text-center my-6">
              <span className="text-xs font-semibold text-emerald-800 tracking-wider">
                بسم الله الرحمن الرحيم
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-emerald-950 font-amiri mt-1 border-b-2 border-amber-600 inline-block px-8 pb-1">
                شهـــــادة بيـــــان درجـــــات وتقديـــــر نجـــــاح
              </h2>
              <p className="text-xs text-stone-600 mt-1">
                للعام الدراسي {instituteSettings.academicYear} (الدور الأول)
              </p>
            </div>

            {/* Student Bio Strip */}
            <div className="bg-stone-50 border border-stone-300 rounded p-4 text-xs space-y-2 mb-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-stone-500">اسم الطالب الرباعي:</span>{' '}
                  <strong className="text-stone-900 text-sm">{student.fullName}</strong>
                </div>
                <div>
                  <span className="text-stone-500">
                    {student.isInternational ? 'رقم جواز السفر:' : 'الرقم القومي:'}
                  </span>{' '}
                  <strong className="font-mono text-stone-900">{student.nationalId}</strong>
                </div>
                <div>
                  <span className="text-stone-500">الجنسية:</span>{' '}
                  <strong className="text-stone-900">
                    {student.isInternational ? student.internationalDetails?.nationality : 'مصري'}
                  </strong>
                </div>
                <div>
                  <span className="text-stone-500">المرحلة الدراسية:</span>{' '}
                  <strong className="text-stone-900">{getStageArabic(student.stage)}</strong>
                </div>
                <div>
                  <span className="text-stone-500">الصف الدراسي:</span>{' '}
                  <strong className="text-stone-900">{getGradeArabic(student.grade)}</strong>
                </div>
                <div>
                  <span className="text-stone-500">الفصل والتخصص:</span>{' '}
                  <strong className="text-stone-900">
                    {student.className} {student.stage === 'secondary' && `(${getTrackArabic(student.track)})`}
                  </strong>
                </div>
                {student.internationalDetails?.madhhab && (
                  <div>
                    <span className="text-stone-500">المذهب الفقهي:</span>{' '}
                    <strong className="text-emerald-900">
                      المذهب ال{student.internationalDetails.madhhab}
                    </strong>
                  </div>
                )}
                <div>
                  <span className="text-stone-500">محل وتاريخ الميلاد:</span>{' '}
                  <strong className="text-stone-900">{student.birthPlace} - {student.birthDate}</strong>
                </div>
                <div>
                  <span className="text-stone-500">حالة القيد:</span>{' '}
                  <strong className="text-emerald-800">مقيد ومنتظم بالدراسة</strong>
                </div>
              </div>
            </div>

            {/* Official Grades Table */}
            <div className="mb-6">
              <h3 className="text-xs font-bold text-stone-800 mb-2 flex items-center justify-between">
                <span>بيان تفصيلي بدرجات المواد المقررة والتقييمات الأزهرية:</span>
                <span className="text-[11px] text-stone-500 font-normal">النهاية الكبرى والصغرى معتمدة من قطاع المعاهد</span>
              </h3>

              <table className="w-full border-collapse border border-stone-300 text-xs text-center">
                <thead>
                  <tr className="bg-emerald-900 text-white text-[11px]">
                    <th className="border border-stone-300 py-2 px-1 w-10">م</th>
                    <th className="border border-stone-300 py-2 px-3 text-right">المادة الدراسية المقررة</th>
                    <th className="border border-stone-300 py-2 px-2">التصنيف</th>
                    <th className="border border-stone-300 py-2 px-2">النهاية العظمى</th>
                    <th className="border border-stone-300 py-2 px-2">الشفهي / القرآن</th>
                    <th className="border border-stone-300 py-2 px-2">التحريري</th>
                    <th className="border border-stone-300 py-2 px-2">مجموع الدرجات</th>
                    <th className="border border-stone-300 py-2 px-2">النتيجة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {sampleMarks.map((m, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-stone-50/50'}>
                      <td className="border border-stone-300 py-1.5 font-mono">{idx + 1}</td>
                      <td className="border border-stone-300 py-1.5 px-3 text-right font-medium text-stone-900">{m.name}</td>
                      <td className="border border-stone-300 py-1.5 text-stone-500 text-[11px]">{m.category}</td>
                      <td className="border border-stone-300 py-1.5 font-mono tabular-nums">{m.max}</td>
                      <td className="border border-stone-300 py-1.5 font-mono tabular-nums">{m.oral}</td>
                      <td className="border border-stone-300 py-1.5 font-mono tabular-nums">{m.written}</td>
                      <td className="border border-stone-300 py-1.5 font-mono font-bold text-emerald-950 tabular-nums">{m.total}</td>
                      <td className="border border-stone-300 py-1.5 font-semibold text-emerald-800 text-[11px]">ناجح</td>
                    </tr>
                  ))}
                  
                  {/* Total Row */}
                  <tr className="bg-emerald-50/80 font-bold text-stone-900 border-t-2 border-emerald-900">
                    <td colSpan={3} className="border border-stone-300 py-2 px-3 text-right">
                      المجمــــوع الكلــــي للدرجــــات والنسبــــة المئويــــة:
                    </td>
                    <td className="border border-stone-300 py-2 font-mono tabular-nums">{totalMax}</td>
                    <td colSpan={2} className="border border-stone-300 py-2 text-stone-500 text-[11px]">
                      النسبة: {percentage}%
                    </td>
                    <td className="border border-stone-300 py-2 font-mono text-sm text-emerald-950 tabular-nums">
                      {totalScore}
                    </td>
                    <td className="border border-stone-300 py-2 text-emerald-900 text-[11px]">
                      {getEvaluation(percentage)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Testimonial & Conduct */}
            <div className="p-3 bg-stone-50 border border-stone-200 rounded text-xs text-stone-700 leading-relaxed mb-8">
              <p>
                <strong>إقرار رسمي:</strong> يشهد {instituteSettings.instituteName} بأن الطالب المذكور أعلاه قد اجتاز بنجاح المقررات الشرعية والعربية والعلمية للعام الدراسي الموضح، وقد عُرف عنه حسن السير والسلوك والمواظبة في أداء الصلوات وحفظ كتاب الله العزيز.
                أُعطيت له هذه الشهادة بناءً على طلبه لتقديمها إلى من يهمه الأمر دون أدنى مسؤولية على المعهد تجاه حقوق الغير.
              </p>
            </div>

            {/* Signatures & Stamps Footer */}
            <div className="grid grid-cols-3 gap-6 pt-4 items-end text-center text-xs">
              
              {/* Control */}
              <div className="space-y-6">
                <span className="font-bold text-stone-800">
                  رئيس لجنة النظام والمراقبة (الكنترول)
                </span>
                <div className="text-[11px] text-stone-600">
                  {instituteSettings.controlHead}
                  <div className="mt-2 text-stone-400 font-serif italic text-sm">{instituteSettings.controlHead.split(' ').slice(0, 2).join(' ')}</div>
                </div>
              </div>

              {/* Student Affairs & Seal */}
              <div className="flex flex-col items-center relative">
                <span className="font-bold text-stone-800 mb-2">
                  مدير شؤون الطلاب والوافدين
                </span>
                <div className="text-[11px] text-stone-600 mb-2">
                  {instituteSettings.studentAffairsHead}
                </div>
                {/* Official Rubber Seal Stamp */}
                <div className="w-28 h-28 my-[-10px] transform rotate-[-6deg] opacity-90">
                  <img
                    src={instituteSettings.sealUrl}
                    alt="خاتم شعار المعهد"
                    className="w-full h-full object-contain filter contrast-125"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="text-[9px] text-stone-400 mt-1 font-mono">
                  خاتم شعار المعهد المعتمد
                </span>
              </div>

              {/* Headmaster */}
              <div className="space-y-6">
                <span className="font-bold text-stone-900">
                  يعتمد، ناظر المعهد الأزهري
                </span>
                <div className="text-[11px] text-stone-800 font-semibold">
                  {instituteSettings.headmasterName}
                  <div className="mt-2 text-emerald-950 font-serif italic text-base">{instituteSettings.headmasterName.split(' ').slice(1, 3).join(' ')}</div>
                </div>
              </div>

            </div>

            {/* Security barcode and date */}
            <div className="border-t border-stone-200 mt-8 pt-3 flex items-center justify-between text-[10px] text-stone-400 font-mono">
              <span>تحريراً في: {new Date().toLocaleDateString('ar-EG')} م</span>
              <span>رقم التحقق الإلكتروني: AZ-CERT-2026-981240</span>
              <span>{instituteSettings.instituteName}</span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
