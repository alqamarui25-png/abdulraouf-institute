/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { X, Printer, Send, FileEdit, Stamp, Building, Sparkles } from 'lucide-react';
import { Student, InstituteSettings } from '../../types';

interface OfficialLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  initialStudent?: Student | null;
  instituteSettings: InstituteSettings;
}

export const OfficialLetterModal: React.FC<OfficialLetterModalProps> = ({
  isOpen,
  onClose,
  students,
  initialStudent,
  instituteSettings,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    initialStudent?.id || students[0]?.id || ''
  );
  const [templateType, setTemplateType] = useState<string>('enrollment_proof');

  // Letter editable fields
  const [documentTitle, setDocumentTitle] = useState('إفــــــــادة قيــــــــد رسـميــــــــة');
  const [recipient, setRecipient] = useState('إلى من يهمه الأمر');
  const [bodyText, setBodyText] = useState('');
  const [referenceNumber, setReferenceNumber] = useState(`REF-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`);
  const [signatoryRole, setSignatoryRole] = useState<'headmaster' | 'studentAffairs' | 'both'>('both');

  const printRef = useRef<HTMLDivElement>(null);

  const selectedStudent = students.find(s => s.id === selectedStudentId);

  // When template or student changes, update defaults
  React.useEffect(() => {
    if (!selectedStudent) return;

    if (templateType === 'enrollment_proof') {
      setDocumentTitle('إفــــــــادة قيــــــــد رسـميــــــــة');
      setRecipient('إلى من يهمه الأمر');
      setBodyText(
        `يشهد ${instituteSettings.instituteName} بأن الطالب: ${selectedStudent.fullName}، المقيد برقم قيد (${selectedStudent.studentCode})، والحامل ${selectedStudent.isInternational ? `لجواز سفر رقم (${selectedStudent.internationalDetails?.passportNumber}) جنسية (${selectedStudent.internationalDetails?.nationality})` : `للرقم القومي (${selectedStudent.nationalId})`}، مقيد ومنتظم بالدراسة بالصف (${selectedStudent.className}) للعام الدراسي (${instituteSettings.academicYear})، ولم ينقطع عن الدراسة حتى تاريخه.\nوقد أُعطيت له هذه الإفادة الرسمية بناءً على طلبه لتقديمها إلى جهة الاختصاص دون أدنى مسؤولية على المعهد.`
      );
    } else if (templateType === 'residence_renewal') {
      setDocumentTitle('خطاب موجه لمصلحة الجوازات والهجرة والجنسية');
      setRecipient('السيد الأستاذ / مدير مصلحة الجوازات والهجرة والجنسية بمجمع التحرير / العباسية');
      setBodyText(
        `تحية طيبة وبعد،،،\nيرجى التكرم بالموافقة على تجديد بطاقة الإقامة بجمهورية مصر العربية للطالب الوافد:\nالاسم: ${selectedStudent.fullName}\nالجنسية: ${selectedStudent.internationalDetails?.nationality || 'وافد'}\nرقم جواز السفر: ${selectedStudent.internationalDetails?.passportNumber || '-'}\nالمقيد بالدراسة لدينا بمعهد عبد الرؤوف الأزهري بالصف: ${selectedStudent.className}.\nنحيط سيادتكم علماً بأن الطالب مقيد ومنتظم بالدراسة للعام الدراسي (${instituteSettings.academicYear}) بموجب منحة الأزهر الشريف، ولا مانع لدى المعهد من مد إقامته الدراسية.\nوتفضلوا بقبول فائق الاحترام والتقدير،،،`
      );
    } else if (templateType === 'guardian_notice') {
      setDocumentTitle('إخطار رسمي لولي أمر الطالب');
      setRecipient(`السيد المحترم ولي أمر الطالب / ${selectedStudent.fullName}`);
      setBodyText(
        `السلام عليكم ورحمة الله وبركاته،،،\nنحيط سيادتكم علماً بضرورة الحضور إلى إدارة المعهد (مكتب شؤون الطلاب) أو التنبيه المشدد على نجلكم الطالب بالصف (${selectedStudent.className}) بشأن الالتزام بالمواظبة وعدم الغياب، وحرصاً على مستواه العلمي والأزهري وحفظ القرآن الكريم.\nشاكرين حسن تعاونكم الدائم معنا لما فيه مصلحة نجلكم الكريم.`
      );
    } else if (templateType === 'custom') {
      setDocumentTitle('خطاب رسمي / مستند معتمد');
      setRecipient('إلى السادة المحترمين / .................................');
      setBodyText(
        `نص المستند أو الخطاب الرسمي:\n.......................................................................................................\n.......................................................................................................`
      );
    }
  }, [templateType, selectedStudentId, instituteSettings]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-stone-300 w-full max-w-5xl max-h-[96vh] flex flex-col overflow-hidden text-right">
        
        {/* Controls Bar */}
        <div className="no-print flex items-center justify-between px-6 py-3.5 bg-stone-800 text-white shrink-0">
          <div className="flex items-center gap-2">
            <FileEdit className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-sm">
              محرر وطباعة أي ورقة أو خطاب رسمي معتمد A4
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة هذه الورقة الرسمية (A4)</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-300 hover:text-white rounded-lg hover:bg-stone-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Workspace: Left Editor, Right Live A4 Preview */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          
          {/* Editor Sidebar (Hidden in print) */}
          <div className="no-print w-full lg:w-80 bg-stone-50 border-l border-stone-200 p-4 overflow-y-auto space-y-3.5 text-xs">
            
            <div>
              <label className="block font-bold text-stone-800 mb-1">نوع المستند / النموذج الجاهز:</label>
              <select
                value={templateType}
                onChange={(e) => setTemplateType(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-stone-300 rounded bg-white font-medium"
              >
                <option value="enrollment_proof">إفادة قيد رسمية لمن يهمه الأمر</option>
                <option value="residence_renewal">خطاب للجوازات لتجديد إقامة وافد</option>
                <option value="guardian_notice">إخطار رسمي لولي الأمر</option>
                <option value="custom">ورقة / خطاب مخصص بالكامل (حر)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-800 mb-1">اختر الطالب المستهدف:</label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-stone-300 rounded bg-white"
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.fullName} ({s.className})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-800 mb-1">عنوان الوثيقة أو الورقة:</label>
              <input
                type="text"
                value={documentTitle}
                onChange={(e) => setDocumentTitle(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-stone-300 rounded font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-800 mb-1">الجهة الموجه إليها الخطاب:</label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-stone-300 rounded"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-800 mb-1">نص المستند أو الخطاب الرسمي:</label>
              <textarea
                rows={8}
                value={bodyText}
                onChange={(e) => setBodyText(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-stone-300 rounded leading-relaxed font-sans"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-800 mb-1">رقم الصادر / الإشارة:</label>
              <input
                type="text"
                dir="ltr"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                className="w-full px-2.5 py-1.5 font-mono border border-stone-300 rounded"
              />
            </div>

            <p className="text-[11px] text-stone-500 pt-2 border-t border-stone-200">
              تتم طباعة هذه الورقة فورياً بترويسة المعهد الرسمية والشعار والختم الأزهرى المعتمد بحجم A4.
            </p>
          </div>

          {/* Printable A4 Preview Container */}
          <div className="flex-1 p-4 sm:p-8 overflow-y-auto bg-stone-200/70 flex justify-center">
            
            <div
              ref={printRef}
              className="w-full max-w-[210mm] bg-white text-stone-900 p-8 sm:p-12 shadow-xl border border-stone-300 relative rounded-sm font-sans flex flex-col justify-between"
              style={{ minHeight: '297mm' }}
            >
              
              {/* Header */}
              <div>
                <div className="flex items-start justify-between border-b-2 border-emerald-950 pb-5">
                  <div className="text-right text-xs space-y-0.5">
                    <p className="font-bold text-stone-700">جمهورية مصر العربية</p>
                    <p className="font-bold text-emerald-950 font-amiri text-sm">{instituteSettings.sectorName}</p>
                    <p>{instituteSettings.regionName} · {instituteSettings.administrationName}</p>
                    <p className="font-bold text-emerald-900 text-xs">{instituteSettings.instituteName}</p>
                    <p className="text-[10px] text-stone-400 font-mono">كود المعهد: {instituteSettings.instituteCode}</p>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full border border-amber-600 overflow-hidden shrink-0 shadow-2xs">
                      <img src={instituteSettings.logoUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                  </div>

                  <div className="text-left text-xs space-y-1 font-mono">
                    <p className="font-bold text-stone-800">التاريخ: {new Date().toLocaleDateString('ar-EG')} م</p>
                    <p className="text-stone-500">رقم الصادر: {referenceNumber}</p>
                    <p className="text-[10px] text-stone-400">{instituteSettings.academicYear}</p>
                  </div>
                </div>

                {/* Basmalah */}
                <div className="text-center my-6">
                  <span className="text-xs font-semibold text-emerald-800">
                    بسم الله الرحمن الرحيم
                  </span>
                  <h2 className="text-xl font-black text-emerald-950 font-amiri mt-2 border-b-2 border-amber-600 inline-block px-8 pb-1">
                    {documentTitle}
                  </h2>
                </div>

                {/* Recipient */}
                <div className="mb-6">
                  <strong className="text-sm text-stone-900 block font-bold">
                    {recipient}
                  </strong>
                </div>

                {/* Body Text */}
                <div className="text-sm text-stone-800 leading-loose whitespace-pre-line text-justify min-h-[250px] p-2">
                  {bodyText}
                </div>
              </div>

              {/* Signatures & Seal Footer */}
              <div>
                <div className="grid grid-cols-3 gap-6 pt-10 text-center text-xs items-end">
                  
                  <div>
                    <span className="font-bold text-stone-800">مدير إدارة شؤون الطلاب</span>
                    <p className="text-[11px] text-stone-600 mt-6">{instituteSettings.studentAffairsHead}</p>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="font-bold text-stone-800 mb-1">خاتم شعار المعهد</span>
                    <div className="w-24 h-24 opacity-85">
                      <img src={instituteSettings.sealUrl} alt="" className="w-full h-full object-contain filter contrast-125" />
                    </div>
                  </div>

                  <div>
                    <span className="font-bold text-stone-900">يعتمد، ناظر المعهد الأزهري</span>
                    <p className="text-[11px] text-stone-800 font-semibold mt-6">{instituteSettings.headmasterName}</p>
                  </div>

                </div>

                <div className="border-t border-stone-200 mt-8 pt-3 flex items-center justify-between text-[10px] text-stone-400 font-mono">
                  <span>{instituteSettings.address} · هاتف: {instituteSettings.phone}</span>
                  <span>وثيقة صادرة ومعتمدة رسمياً</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
