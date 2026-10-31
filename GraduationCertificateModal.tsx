/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Printer, Award, CheckCircle2, Star } from 'lucide-react';
import { Student, InstituteSettings } from '../../types';

interface GraduationCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  instituteSettings: InstituteSettings;
}

export const GraduationCertificateModal: React.FC<GraduationCertificateModalProps> = ({
  isOpen,
  onClose,
  student,
  instituteSettings,
}) => {
  const [stageName, setStageName] = useState<'secondary' | 'prep'>(
    student?.stage === 'secondary' ? 'secondary' : 'prep'
  );
  const [trackName, setTrackName] = useState<string>(
    student?.track === 'scientific' ? 'القسم العلمي' : student?.track === 'literary' ? 'القسم الأدبي' : 'القسم العام'
  );
  const [totalScore, setTotalScore] = useState(628);
  const [maxScore, setMaxScore] = useState(650);
  const [percentage, setPercentage] = useState('96.6%');
  const [gradeRank, setGradeRank] = useState('الأول على المعهد');
  const [appreciation, setAppreciation] = useState('ممتاز مع مرتبة الشرف');
  const [examSession, setExamSession] = useState('الدور الأول - مايو');

  if (!isOpen || !student) return null;

  const handlePrint = () => {
    // Add landscape class to body temporarily or print
    document.body.classList.add('print-landscape');
    window.print();
    setTimeout(() => {
      document.body.classList.remove('print-landscape');
    }, 1000);
  };

  const todayStr = new Date().toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-900/80 backdrop-blur-xs overflow-y-auto">
      <style>{`
        @media print {
          @page {
            size: A4 landscape !important;
            margin: 6mm !important;
          }
        }
      `}</style>

      <div className="bg-white rounded-xl shadow-2xl border border-stone-300 w-full max-w-6xl max-h-[96vh] flex flex-col overflow-hidden text-right">
        
        {/* Controls Bar (No-Print) */}
        <div className="no-print flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 px-6 py-3.5 bg-amber-950 text-white shrink-0">
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-400" />
            <div>
              <h3 className="font-bold text-sm">
                شهادة تخرج وإتمام مرحلة دراسية أزهرية (تصميم عرضي فخم A4 Landscape)
              </h3>
              <p className="text-[11px] text-amber-200">
                شهادة التخرج الرسمية المعتمدة للطلاب الخريجين والمتفوقين
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-5 py-2 bg-amber-400 hover:bg-amber-500 text-stone-950 text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة الشهادة بالعرض (A4 Landscape)</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-300 hover:text-white rounded-lg hover:bg-amber-900 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Options Toolbar (No-Print) */}
        <div className="no-print bg-stone-100 p-3 px-6 border-b border-stone-300 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-bold text-stone-700">نوع الشهادة:</span>
            <select
              value={stageName}
              onChange={(e) => setStageName(e.target.value as any)}
              className="px-2.5 py-1 bg-white border border-stone-300 rounded text-xs font-semibold"
            >
              <option value="secondary">شهادة الثانوية الأزهرية</option>
              <option value="prep">شهادة إتمام المرحلة الإعدادية الأزهرية</option>
            </select>

            <select
              value={trackName}
              onChange={(e) => setTrackName(e.target.value)}
              className="px-2.5 py-1 bg-white border border-stone-300 rounded text-xs font-semibold"
            >
              <option value="القسم العلمي">القسم العلمي</option>
              <option value="القسم الأدبي">القسم الأدبي</option>
              <option value="القسم العام">القسم العام</option>
            </select>

            <select
              value={appreciation}
              onChange={(e) => setAppreciation(e.target.value)}
              className="px-2.5 py-1 bg-white border border-stone-300 rounded text-xs font-semibold text-emerald-950 font-bold"
            >
              <option value="ممتاز مع مرتبة الشرف">ممتاز مع مرتبة الشرف</option>
              <option value="ممتاز">ممتاز</option>
              <option value="جيد جداً">جيد جداً</option>
              <option value="جيد">جيد</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-600">النسبة:</span>
            <input
              type="text"
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
              className="w-16 px-2 py-1 bg-white border border-stone-300 rounded text-xs text-center font-bold font-mono"
            />
            <span className="font-semibold text-stone-600">الترتيب:</span>
            <input
              type="text"
              value={gradeRank}
              onChange={(e) => setGradeRank(e.target.value)}
              className="w-28 px-2 py-1 bg-white border border-stone-300 rounded text-xs text-center font-bold"
            />
          </div>
        </div>

        {/* PRINTABLE A4 LANDSCAPE CONTAINER */}
        <div className="p-4 sm:p-6 overflow-x-auto bg-stone-300 flex justify-center">
          
          <div className="w-[297mm] h-[210mm] max-h-[210mm] bg-amber-50/30 text-stone-900 p-6 shadow-2xl border-8 border-double border-emerald-900 rounded-sm flex flex-col justify-between font-sans relative overflow-hidden select-none">
            
            {/* Background Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04]">
              <img src={instituteSettings.logoUrl} alt="" className="w-96 h-96 object-contain" />
            </div>

            {/* Inner Golden Border Frame */}
            <div className="absolute inset-2 border-2 border-amber-600/60 rounded-xs pointer-events-none" />
            <div className="absolute inset-3 border border-emerald-800/40 rounded-xs pointer-events-none" />

            {/* Corner Decorative Motifs */}
            <div className="absolute top-4 right-4 text-amber-700/80 text-xl font-serif">❖</div>
            <div className="absolute top-4 left-4 text-amber-700/80 text-xl font-serif">❖</div>
            <div className="absolute bottom-4 right-4 text-amber-700/80 text-xl font-serif">❖</div>
            <div className="absolute bottom-4 left-4 text-amber-700/80 text-xl font-serif">❖</div>

            <div>
              {/* Header Grid: Right Azhar, Center Emblem & Title, Left Photo */}
              <div className="grid grid-cols-4 items-center pb-2 border-b-2 border-amber-800/40 relative">
                
                {/* Right Column: Ministry & Azhar */}
                <div className="text-right space-y-0.5 text-xs font-semibold">
                  <span className="block text-stone-700 font-bold">جمهورية مصر العربية</span>
                  <strong className="block text-emerald-950 font-bold text-sm font-amiri">الأزهر الشريف</strong>
                  <span className="block text-stone-700">قطاع المعاهد الأزهرية</span>
                  <span className="block text-stone-700">{instituteSettings.regionName}</span>
                  <strong className="block text-emerald-900 font-bold font-amiri text-xs">{instituteSettings.instituteName}</strong>
                </div>

                {/* Center Column: Emblem & Certificate Title (Spans 2 cols) */}
                <div className="col-span-2 flex flex-col items-center text-center">
                  <div className="w-14 h-14 mb-1">
                    <img src={instituteSettings.logoUrl} alt="" className="w-full h-full object-contain" />
                  </div>

                  <span className="text-stone-700 font-amiri text-xs font-bold">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
                  
                  <div className="my-1 px-8 py-1 bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 text-amber-300 rounded shadow-sm border border-amber-400/80">
                    <h1 className="text-xl font-bold tracking-wider font-amiri leading-normal">
                      {stageName === 'secondary'
                        ? 'شَهَادَةُ إِتْمَامِ المَرْحَلَةِ الثَّانَوِيَّةِ الأَزْهَرِيَّةِ'
                        : 'شَهَادَةُ إِتْمَامِ المَرْحَلَةِ الإِعْدَادِيَّةِ الأَزْهَرِيَّةِ'}
                    </h1>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-bold text-stone-800">
                    <span>{trackName}</span>
                    <span>·</span>
                    <span>العام الدراسي {instituteSettings.academicYear}</span>
                    <span>·</span>
                    <span>{examSession}</span>
                  </div>
                </div>

                {/* Left Column: Student Photo in Gold Frame */}
                <div className="flex flex-col items-center justify-end">
                  <div className="w-24 h-28 border-2 border-amber-600 rounded p-1 bg-white shadow-md relative">
                    {student.photoUrl ? (
                      <img src={student.photoUrl} alt="" className="w-full h-full object-cover rounded-xs" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-stone-400">صورة الطالب</div>
                    )}
                    {/* Golden Star badge */}
                    <div className="absolute -top-2 -right-2 bg-amber-500 text-white rounded-full p-0.5 shadow">
                      <Star className="w-3.5 h-3.5 fill-current" />
                    </div>
                  </div>
                  
                  <div className="mt-1 flex items-center gap-1.5 text-[10px] font-mono">
                    <span className="bg-amber-100 text-amber-950 px-1 rounded font-bold border border-amber-300">
                      سجل: {student.recordNumber}
                    </span>
                    <span className="bg-emerald-100 text-emerald-950 px-1 rounded font-bold border border-emerald-300">
                      جلوس: {student.seatNumber || student.recordNumber + 1000}
                    </span>
                  </div>
                </div>

              </div>

              {/* Main Certificate Statement */}
              <div className="mt-3 text-center px-6 leading-loose text-stone-800">
                <p className="text-sm font-medium">
                  يَشْهَدُ قِطَاعُ المَعَاهِدِ الأَزْهَرِيَّةِ بِأَنَّ الطَّالِبَ النَّجِيبَ:{' '}
                  <strong className="text-xl font-bold text-emerald-950 font-amiri border-b-2 border-dotted border-amber-700 px-3">
                    {student.fullName}
                  </strong>
                </p>

                <div className="flex items-center justify-center gap-6 mt-1 text-xs">
                  <div>
                    <span className="text-stone-600 font-bold">الجنسية:</span>{' '}
                    <strong>{student.isInternational ? student.internationalDetails?.nationality : 'مصري'}</strong>
                  </div>
                  <div>
                    <span className="text-stone-600 font-bold">
                      {student.isInternational ? 'رقم جواز السفر:' : 'الرقم القومي:'}
                    </span>{' '}
                    <strong className="font-mono">{student.nationalId}</strong>
                  </div>
                  <div>
                    <span className="text-stone-600 font-bold">المذهب الفقهي:</span>{' '}
                    <strong className="text-emerald-900">{student.internationalDetails?.madhhab || 'شافعي'}</strong>
                  </div>
                  <div>
                    <span className="text-stone-600 font-bold">رقم القيد الأزهرى:</span>{' '}
                    <strong className="font-mono text-emerald-950">{student.studentCode}</strong>
                  </div>
                </div>

                <p className="mt-2 text-xs font-medium">
                  قَدْ أَتَمَّ دِرَاسَةَ المُقَرَّرَاتِ الشَّرْعِيَّةِ وَالعَرَبِيَّةِ وَالثَّقَافِيَّةِ بِالمَعْهَدِ، وَاجْتَازَ امْتِحَانَاتِ النِّهَايَةِ بِنَجَاحٍ وَتَفَوُّقٍ، وَحَصَلَ عَلَى تَقْدِيرِ:
                </p>

                {/* Big Honors Badge */}
                <div className="my-2 inline-flex items-center gap-3 px-6 py-1 bg-amber-100/80 border-2 border-amber-600 rounded-full shadow-inner">
                  <span className="text-base font-bold text-emerald-950 font-amiri">
                    ★ {appreciation} ★
                  </span>
                  <span className="text-sm font-mono font-bold text-amber-950 bg-white px-2 py-0.5 rounded border border-amber-400">
                    بنسبة: {percentage} ({totalScore} / {maxScore})
                  </span>
                  <span className="text-xs font-bold text-emerald-900">
                    ({gradeRank})
                  </span>
                </div>
              </div>

              {/* Subject Domains Ribbon */}
              <div className="grid grid-cols-4 gap-2 text-center text-[10px] my-1 px-8">
                <div className="bg-white p-1 rounded border border-stone-300 shadow-2xs">
                  <strong className="block text-emerald-950 font-bold">العلوم الشرعية</strong>
                  <span className="text-stone-600">القرآن والتجويد، الفقه، أصول الدين</span>
                </div>
                <div className="bg-white p-1 rounded border border-stone-300 shadow-2xs">
                  <strong className="block text-emerald-950 font-bold">العلوم العربية</strong>
                  <span className="text-stone-600">النحو، الصرف، البلاغة، الأدب والمطالعة</span>
                </div>
                <div className="bg-white p-1 rounded border border-stone-300 shadow-2xs">
                  <strong className="block text-emerald-950 font-bold">المواد العلمية</strong>
                  <span className="text-stone-600">الرياضيات، الفيزياء، الكيمياء، الأحياء</span>
                </div>
                <div className="bg-white p-1 rounded border border-stone-300 shadow-2xs">
                  <strong className="block text-emerald-950 font-bold">المواد الثقافية</strong>
                  <span className="text-stone-600">اللغة الأجنبية، الدراسات، الحاسب الآلي</span>
                </div>
              </div>

            </div>

            {/* Official Signatures & Seal (4 Columns Layout) */}
            <div className="pt-2 border-t-2 border-amber-800/40 relative">
              <div className="grid grid-cols-4 items-center text-center text-xs">
                
                <div>
                  <span className="block font-bold text-stone-800">رئيس لجنة النظام والمراقبة</span>
                  <span className="block text-[11px] text-stone-600 mt-3">{instituteSettings.controlHead}</span>
                </div>

                <div>
                  <span className="block font-bold text-stone-800">وكيل المعهد لشؤون التعليم</span>
                  <span className="block text-[11px] text-stone-600 mt-3">{instituteSettings.studentAffairsHead}</span>
                </div>

                <div className="relative">
                  <span className="block font-bold text-stone-900">شيخ المعهد</span>
                  <strong className="block text-xs text-emerald-950 font-bold mt-3 font-amiri">
                    {instituteSettings.headmasterName}
                  </strong>
                  
                  {/* Official Blue Rubber Stamp centered on Headmaster */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-24 opacity-85 pointer-events-none">
                    <img src={instituteSettings.sealUrl} alt="" className="w-full h-full object-contain" />
                  </div>
                </div>

                <div>
                  <span className="block font-bold text-stone-800">يُعتمد، رئيس الإدارة المركزية</span>
                  <span className="block text-[11px] text-stone-600 mt-3">منطقة القاهرة الأزهرية</span>
                </div>

              </div>

              {/* Bottom line: Issue Date & Verification */}
              <div className="flex items-center justify-between text-[9px] text-stone-500 pt-2 px-4">
                <span>تحريراً في: {todayStr}</span>
                <span>رقم مسلسل الشهادة: AZ-GRAD-{student.recordNumber}-2026</span>
                <span>أي كشط أو تعديل يلغي هذه الشهادة ولا تصح إلا بالختم الحي</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
