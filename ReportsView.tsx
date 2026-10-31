/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Printer,
  FileText,
  Award,
  Users,
  Globe2,
  Receipt,
  Search,
  CreditCard,
  Briefcase,
  FileEdit,
  Send,
  Building,
} from 'lucide-react';
import { Student, ClassRoom, FeeRecord, StaffMember, InstituteSettings } from '../../types';

interface ReportsViewProps {
  students: Student[];
  classes: ClassRoom[];
  fees: FeeRecord[];
  staff: StaffMember[];
  instituteSettings: InstituteSettings;
  onPrintCertificate: (student: Student) => void;
  onPrintRoster: (cls: ClassRoom) => void;
  onPrintIdCard: (student: Student) => void;
  onPrintApplication: (student: Student) => void;
  onOpenOfficialLetter: (student?: Student) => void;
  onOpenInstituteSettings: () => void;
  onPrintProgression?: (student: Student) => void;
  onPrintGraduationCertificate?: (student: Student) => void;
  onOpenSeatNumbers?: () => void;
  onOpenExamSchedule?: () => void;
  onPrintClassTimetable?: () => void;
  onPrintTeacherTimetable?: () => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  students,
  classes,
  fees,
  staff,
  instituteSettings,
  onPrintCertificate,
  onPrintRoster,
  onPrintIdCard,
  onPrintApplication,
  onOpenOfficialLetter,
  onOpenInstituteSettings,
  onPrintProgression,
  onPrintGraduationCertificate,
  onOpenSeatNumbers,
  onOpenExamSchedule,
  onPrintClassTimetable,
  onPrintTeacherTimetable,
}) => {
  const [activeTab, setActiveTab] = useState<
    'certificates' | 'idCards' | 'applications' | 'rosters' | 'expats' | 'staffRoster' | 'letters'
  >('certificates');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = students.filter(s =>
    s.fullName.includes(searchTerm) || s.studentCode.includes(searchTerm) || s.className.includes(searchTerm)
  );

  const expats = students.filter(s => s.isInternational);

  return (
    <div className="space-y-6 text-right">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-emerald-800" />
            <h2 className="text-lg font-bold text-stone-900">
              مركز الطباعة الشامل وكافة المستندات والأوراق الرسمية (A4)
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            إصدار وطباعة أي ورقة: التدرج الدراسي، شهادات التخرج العرضية، جداول الامتحانات والحصص، كروت أرقام الجلوس، والكارنيهات بالرقم القومي أو السجل.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => onOpenOfficialLetter()}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-850 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <FileEdit className="w-4 h-4 text-amber-300" />
            <span>كتابة وطباعة ورقة مخصصة A4</span>
          </button>

          <button
            onClick={onOpenInstituteSettings}
            className="flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold border border-stone-300 transition-colors cursor-pointer"
          >
            <Building className="w-4 h-4 text-stone-600" />
            <span>تعديل اللوجو والختم والمسمى</span>
          </button>
        </div>
      </div>

      {/* Quick Launch Print Bar */}
      <div className="bg-emerald-900/5 border border-emerald-900/20 p-4 rounded-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-700 animate-pulse"></span>
          <span className="text-xs font-bold text-emerald-950">
            نماذج ومطبوعات أزهرية متخصصة جاهزة فوراً للطباعة A4:
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {onOpenExamSchedule && (
            <button
              onClick={onOpenExamSchedule}
              className="px-3 py-1.5 bg-white hover:bg-emerald-50 text-emerald-900 text-xs font-bold rounded-lg border border-emerald-300 shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>جدول الامتحانات A4</span>
            </button>
          )}
          {onOpenSeatNumbers && (
            <button
              onClick={onOpenSeatNumbers}
              className="px-3 py-1.5 bg-white hover:bg-emerald-50 text-emerald-900 text-xs font-bold rounded-lg border border-emerald-300 shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>كروت وكشف أرقام الجلوس (من 1000)</span>
            </button>
          )}
          {onPrintClassTimetable && (
            <button
              onClick={onPrintClassTimetable}
              className="px-3 py-1.5 bg-white hover:bg-emerald-50 text-emerald-900 text-xs font-bold rounded-lg border border-emerald-300 shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>جدول الفصل الأسبوعي A4</span>
            </button>
          )}
          {onPrintTeacherTimetable && (
            <button
              onClick={onPrintTeacherTimetable}
              className="px-3 py-1.5 bg-white hover:bg-emerald-50 text-emerald-900 text-xs font-bold rounded-lg border border-emerald-300 shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>جدول المعلم الأسبوعي A4</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs for All 7 Document Types */}
      <div className="flex flex-wrap border-b border-stone-200 bg-white rounded-t-xl px-4 pt-2 gap-1 text-xs">
        
        <button
          onClick={() => setActiveTab('certificates')}
          className={`pb-3 px-3.5 font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'certificates'
              ? 'border-emerald-800 text-emerald-950'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>1. شهادات بيان النجاح A4</span>
        </button>

        <button
          onClick={() => setActiveTab('idCards')}
          className={`pb-3 px-3.5 font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'idCards'
              ? 'border-emerald-800 text-emerald-950'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>2. بطاقات قيد وكارنيهات الطلاب</span>
        </button>

        <button
          onClick={() => setActiveTab('applications')}
          className={`pb-3 px-3.5 font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'applications'
              ? 'border-emerald-800 text-emerald-950'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>3. استمارات القيد والقبول A4</span>
        </button>

        <button
          onClick={() => setActiveTab('rosters')}
          className={`pb-3 px-3.5 font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'rosters'
              ? 'border-emerald-800 text-emerald-950'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>4. كشوف مناداة الفصول A4</span>
        </button>

        <button
          onClick={() => setActiveTab('expats')}
          className={`pb-3 px-3.5 font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'expats'
              ? 'border-emerald-800 text-emerald-950'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Globe2 className="w-4 h-4" />
          <span>5. كشف الطلاب الوافدين والجوازات</span>
        </button>

        <button
          onClick={() => setActiveTab('staffRoster')}
          className={`pb-3 px-3.5 font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'staffRoster'
              ? 'border-emerald-800 text-emerald-950'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>6. كشف هيئة التدريس والأنصبة</span>
        </button>

        <button
          onClick={() => setActiveTab('letters')}
          className={`pb-3 px-3.5 font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'letters'
              ? 'border-emerald-800 text-emerald-950'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>7. خطابات رسمية وإفادات قيد</span>
        </button>

      </div>

      {/* Main Tab Content */}
      <div className="bg-white p-6 rounded-b-xl border border-stone-200 border-t-0 shadow-2xs space-y-4">
        
        {/* Search Bar for student-based tabs */}
        {(activeTab === 'certificates' || activeTab === 'idCards' || activeTab === 'applications' || activeTab === 'letters') && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-2 border-b border-stone-100">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="بحث باسم الطالب أو رقم القيد..."
                className="w-full px-3 py-2 pr-8 border border-stone-300 rounded-lg text-xs"
              />
              <Search className="w-4 h-4 text-stone-400 absolute right-2.5 top-2.5" />
            </div>
            <span className="text-xs text-stone-500">
              كافة المطبوعات تحمل تلقائياً: {instituteSettings.instituteName} والشعار والختم المعتمد
            </span>
          </div>
        )}

        {/* 1. Certificates */}
        {activeTab === 'certificates' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                className="p-4 bg-stone-50 rounded-xl border border-stone-200 hover:border-emerald-600 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-14 border border-stone-300 rounded overflow-hidden bg-white shrink-0">
                    {student.photoUrl && (
                      <img src={student.photoUrl} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div>
                    <strong className="block text-xs text-stone-900">{student.fullName}</strong>
                    <span className="text-[10px] text-stone-500 font-mono block">{student.studentCode}</span>
                    <span className="text-[11px] text-emerald-800 font-medium">{student.className}</span>
                  </div>
                </div>

                <button
                  onClick={() => onPrintCertificate(student)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded text-xs font-bold transition-colors cursor-pointer shrink-0"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>شهادة A4</span>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* 2. ID Cards */}
        {activeTab === 'idCards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                className="p-4 bg-stone-50 rounded-xl border border-stone-200 hover:border-blue-600 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border border-stone-300 overflow-hidden bg-white shrink-0">
                    {student.photoUrl && (
                      <img src={student.photoUrl} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div>
                    <strong className="block text-xs text-stone-900">{student.fullName}</strong>
                    <span className="text-[10px] text-stone-500 font-mono block">كود: {student.studentCode}</span>
                    <span className="text-[11px] text-stone-600 font-medium">{student.className}</span>
                  </div>
                </div>

                <button
                  onClick={() => onPrintIdCard(student)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded text-xs font-bold transition-colors cursor-pointer shrink-0"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>طباعة الكارنيه</span>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* 3. Enrollment Applications */}
        {activeTab === 'applications' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                className="p-4 bg-stone-50 rounded-xl border border-stone-200 hover:border-amber-600 transition-all flex items-center justify-between"
              >
                <div>
                  <strong className="block text-xs text-stone-900">{student.fullName}</strong>
                  <span className="text-[10px] text-stone-500 font-mono block">الرقم القومي: {student.nationalId}</span>
                  <span className="text-[11px] text-stone-600">{student.className}</span>
                </div>

                <button
                  onClick={() => onPrintApplication(student)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-bold transition-colors cursor-pointer shrink-0"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>استمارة قيد A4</span>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* 4. Class Rosters */}
        {activeTab === 'rosters' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {classes.map((cls) => {
              const count = students.filter(s => s.classId === cls.id || s.className === cls.name).length;
              return (
                <div
                  key={cls.id}
                  className="p-4 bg-stone-50 rounded-xl border border-stone-200 hover:border-emerald-600 transition-all flex items-center justify-between"
                >
                  <div>
                    <strong className="block text-xs text-stone-900">{cls.name}</strong>
                    <span className="text-[11px] text-stone-500">القاعة: {cls.roomNumber}</span>
                    <span className="text-[10px] font-mono block text-emerald-900 font-bold mt-0.5">
                      {count} طالباً مقيداً
                    </span>
                  </div>

                  <button
                    onClick={() => onPrintRoster(cls)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-semibold transition-colors cursor-pointer shrink-0"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>كشف مناداة A4</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* 5. Expats List */}
        {activeTab === 'expats' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h3 className="font-bold text-xs text-stone-800">
                كشف إحصائي معتمد للطلاب الوافدين لتقديمه لقطاع المعاهد ومصلحة الجوازات
              </h3>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded text-xs font-semibold cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>طباعة الكشف A4</span>
              </button>
            </div>

            <table className="w-full text-xs text-right border-collapse border border-stone-300">
              <thead>
                <tr className="bg-stone-100 text-stone-800 text-[11px]">
                  <th className="border border-stone-300 py-2 px-2">م</th>
                  <th className="border border-stone-300 py-2 px-3">الاسم كاملاً</th>
                  <th className="border border-stone-300 py-2 px-2">الجنسية</th>
                  <th className="border border-stone-300 py-2 px-2">رقم الجواز</th>
                  <th className="border border-stone-300 py-2 px-2">المذهب</th>
                  <th className="border border-stone-300 py-2 px-2">الصف الدراسي</th>
                  <th className="border border-stone-300 py-2 px-2">انتهاء الإقامة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {expats.map((exp, idx) => (
                  <tr key={exp.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-stone-50'}>
                    <td className="border border-stone-300 py-1.5 px-2 font-mono text-center">{idx + 1}</td>
                    <td className="border border-stone-300 py-1.5 px-3 font-semibold text-stone-900">{exp.fullName}</td>
                    <td className="border border-stone-300 py-1.5 px-2 font-bold text-amber-900">{exp.internationalDetails?.nationality}</td>
                    <td className="border border-stone-300 py-1.5 px-2 font-mono">{exp.internationalDetails?.passportNumber}</td>
                    <td className="border border-stone-300 py-1.5 px-2">{exp.internationalDetails?.madhhab}</td>
                    <td className="border border-stone-300 py-1.5 px-2">{exp.className}</td>
                    <td className="border border-stone-300 py-1.5 px-2 font-mono">{exp.internationalDetails?.residenceExpiry}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 6. Staff Roster */}
        {activeTab === 'staffRoster' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h3 className="font-bold text-xs text-stone-800">
                كشف هيئة التدريس والأنصبة الأسبوعية للحصص المعتمدة
              </h3>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded text-xs font-semibold cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>طباعة كشف المعلمين A4</span>
              </button>
            </div>

            <table className="w-full text-xs text-right border-collapse border border-stone-300">
              <thead>
                <tr className="bg-stone-100 text-stone-800 text-[11px]">
                  <th className="border border-stone-300 py-2 px-2">م</th>
                  <th className="border border-stone-300 py-2 px-3">الاسم كاملاً</th>
                  <th className="border border-stone-300 py-2 px-2">المسؤولية</th>
                  <th className="border border-stone-300 py-2 px-3">التخصص الدراسي</th>
                  <th className="border border-stone-300 py-2 px-2">المؤهل</th>
                  <th className="border border-stone-300 py-2 px-2 font-mono">الهاتف</th>
                  <th className="border border-stone-300 py-2 px-2 text-center">النصاب (حصص)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {staff.map((m, idx) => (
                  <tr key={m.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-stone-50'}>
                    <td className="border border-stone-300 py-1.5 px-2 font-mono text-center">{idx + 1}</td>
                    <td className="border border-stone-300 py-1.5 px-3 font-semibold text-stone-900">{m.name}</td>
                    <td className="border border-stone-300 py-1.5 px-2 font-medium">{m.role}</td>
                    <td className="border border-stone-300 py-1.5 px-3 text-emerald-950 font-bold">{m.specialization}</td>
                    <td className="border border-stone-300 py-1.5 px-2">{m.qualification}</td>
                    <td className="border border-stone-300 py-1.5 px-2 font-mono" dir="ltr">{m.phone}</td>
                    <td className="border border-stone-300 py-1.5 px-2 font-mono text-center font-bold">{m.weeklyQuota}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 7. Official Letters & Customizable Documents */}
        {activeTab === 'letters' && (
          <div className="space-y-4">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-emerald-950">
                  محرر الخطابات الرسمية والإفادات والشهادات المخصصة A4
                </h4>
                <p className="text-xs text-emerald-800 mt-0.5">
                  يتيح لك كتابة أي خطاب أو إفادة قيد رسمية وتخصيص نصها بالكامل مع الختم وشعار المعهد وطباعتها بحجم A4.
                </p>
              </div>

              <button
                onClick={() => onOpenOfficialLetter()}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0"
              >
                فتح محرر المستندات الرسمي
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredStudents.map((student) => (
                <div
                  key={student.id}
                  className="p-4 bg-stone-50 rounded-xl border border-stone-200 hover:border-emerald-600 transition-all flex items-center justify-between"
                >
                  <div>
                    <strong className="block text-xs text-stone-900">{student.fullName}</strong>
                    <span className="text-[11px] text-stone-500 font-mono">{student.studentCode}</span>
                    <span className="text-[11px] text-stone-600 block">{student.className}</span>
                  </div>

                  <button
                    onClick={() => onOpenOfficialLetter(student)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-semibold transition-colors cursor-pointer shrink-0"
                  >
                    <Send className="w-3.5 h-3.5 text-amber-300" />
                    <span>إصدار خطاب A4</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
