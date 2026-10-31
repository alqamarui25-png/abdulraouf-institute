/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Printer,
  Edit2,
  Trash2,
  Globe2,
  BookOpen,
  Eye,
  FileText,
  CreditCard,
  Send,
  Hash,
  Award,
} from 'lucide-react';
import { Student, ClassRoom } from '../../types';

interface StudentsViewProps {
  students: Student[];
  classes: ClassRoom[];
  onAddStudent: () => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  onPrintCertificate: (student: Student) => void;
  onPrintIdCard: (student: Student) => void;
  onPrintApplication: (student: Student) => void;
  onPrintOfficialLetter: (student: Student) => void;
  onPrintProgression: (student: Student) => void;
  onPrintGraduationCertificate: (student: Student) => void;
  onOpenSeatNumbers: () => void;
  onViewHistory: (student: Student) => void;
}

export const StudentsView: React.FC<StudentsViewProps> = ({
  students,
  classes,
  onAddStudent,
  onEditStudent,
  onDeleteStudent,
  onPrintCertificate,
  onPrintIdCard,
  onPrintApplication,
  onPrintOfficialLetter,
  onPrintProgression,
  onPrintGraduationCertificate,
  onOpenSeatNumbers,
  onViewHistory,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState<'all' | 'preparatory' | 'secondary'>('all');
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const [internationalFilter, setInternationalFilter] = useState<'all' | 'egyptian' | 'international'>('all');
  const [madhhabFilter, setMadhhabFilter] = useState<string>('all');

  const filteredStudents = students.filter(s => {
    // Search
    const searchMatch =
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.studentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nationalId.includes(searchTerm) ||
      (s.internationalDetails?.passportNumber && s.internationalDetails.passportNumber.toLowerCase().includes(searchTerm.toLowerCase()));

    // Stage
    if (stageFilter !== 'all' && s.stage !== stageFilter) return false;

    // Grade
    if (gradeFilter !== 'all' && s.grade !== gradeFilter) return false;

    // International
    if (internationalFilter === 'egyptian' && s.isInternational) return false;
    if (internationalFilter === 'international' && !s.isInternational) return false;

    // Madhhab
    if (madhhabFilter !== 'all') {
      const studentMadhhab = s.internationalDetails?.madhhab || 'شافعي';
      if (studentMadhhab !== madhhabFilter) return false;
    }

    return searchMatch;
  });

  return (
    <div className="space-y-5 text-right">
      
      {/* Header & Main Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
        <div>
          <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-800" />
            <span>سجل شؤون الطلاب وقيد الدارسين والمطبوعات</span>
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            إدارة الطلاب، طباعة الشهادات، بطاقات القيد (الكارنيه)، استمارات القبول، وإفادات القيد الرسمية A4.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={onOpenSeatNumbers}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-950 hover:bg-stone-900 text-amber-300 text-xs font-bold rounded-lg border border-amber-400/50 shadow-xs transition-colors cursor-pointer"
            title="إصدار أرقام الجلوس تلقائياً من 1000 وطباعة كروت المقاعد"
          >
            <Hash className="w-4 h-4 text-amber-400" />
            <span>إصدار أرقام الجلوس (من 1000)</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg border border-stone-300 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-stone-600" />
            <span>طباعة كشف الطلاب A4</span>
          </button>

          <button
            onClick={onAddStudent}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة طالب جديد</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          
          {/* Search Input */}
          <div className="relative sm:col-span-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="بحث بالاسم، رقم القيد، الرقم القومي أو الجواز..."
              className="w-full px-3 py-2 pr-8 border border-stone-300 rounded-lg focus:outline-hidden focus:border-emerald-700"
            />
            <Search className="w-4 h-4 text-stone-400 absolute right-2.5 top-2.5" />
          </div>

          {/* Stage Filter */}
          <div>
            <select
              value={stageFilter}
              onChange={(e) => {
                setStageFilter(e.target.value as any);
                setGradeFilter('all');
              }}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white"
            >
              <option value="all">كافة المراحل (إعدادي وثانوي)</option>
              <option value="preparatory">المرحلة الإعدادية</option>
              <option value="secondary">المرحلة الثانوية</option>
            </select>
          </div>

          {/* Origin Filter */}
          <div>
            <select
              value={internationalFilter}
              onChange={(e) => setInternationalFilter(e.target.value as any)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white"
            >
              <option value="all">الكل (المصريين والوافدين)</option>
              <option value="egyptian">الطلاب المصريين فقط</option>
              <option value="international">الطلاب الوافدين فقط</option>
            </select>
          </div>

          {/* Madhhab Filter */}
          <div>
            <select
              value={madhhabFilter}
              onChange={(e) => setMadhhabFilter(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white"
            >
              <option value="all">كافة المذاهب الفقهية</option>
              <option value="شافعي">المذهب الشافعي</option>
              <option value="حنفي">المذهب الحنفي</option>
              <option value="مالكي">المذهب المالكي</option>
              <option value="حنبلي">المذهب الحنبلي</option>
            </select>
          </div>

        </div>

        {/* Results count counter */}
        <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
          <span>
            عدد نتائج البحث: <strong className="text-stone-900 font-mono">{filteredStudents.length}</strong> من أصل {students.length} طالب
          </span>
          {(searchTerm || stageFilter !== 'all' || internationalFilter !== 'all' || madhhabFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStageFilter('all');
                setGradeFilter('all');
                setInternationalFilter('all');
                setMadhhabFilter('all');
              }}
              className="text-xs text-emerald-800 hover:underline cursor-pointer"
            >
              إلغاء جميع الفلاتر
            </button>
          )}
        </div>
      </div>

      {/* Students Data Grid */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right divide-y divide-stone-200">
            <thead className="bg-stone-50 text-stone-700 font-bold text-[11px]">
              <tr>
                <th className="py-3 px-4">الطالب والصورة</th>
                <th className="py-3 px-3 bg-emerald-50/50 text-emerald-950">رقم السجل والجلوس</th>
                <th className="py-3 px-3">رقم القيد</th>
                <th className="py-3 px-3">المرحلة والصف</th>
                <th className="py-3 px-3">الفصل</th>
                <th className="py-3 px-3">الجنسية والمذهب</th>
                <th className="py-3 px-3">ولي الأمر</th>
                <th className="py-3 px-4 text-center">طباعة المستندات والأوراق الرسمية A4</th>
                <th className="py-3 px-3 text-center">إدارة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-stone-50/80 transition-colors">
                    
                    {/* Photo & Name */}
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full border border-stone-200 overflow-hidden shrink-0 bg-stone-100">
                          {student.photoUrl ? (
                            <img
                              src={student.photoUrl}
                              alt=""
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-stone-400">
                              أزهر
                            </div>
                          )}
                        </div>
                        <div>
                          <strong className="block text-stone-900">{student.fullName}</strong>
                          <span className="text-[10px] text-stone-500 font-mono">
                            {student.isInternational 
                              ? `جواز: ${student.internationalDetails?.passportNumber || student.nationalId}` 
                              : `ق: ${student.nationalId}`}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Official Record Number (1 to infinity) & Seat Number (1000 to infinity) */}
                    <td className="py-2.5 px-3">
                      <div className="space-y-1">
                        <span className="font-mono font-bold text-emerald-950 bg-emerald-100/80 border border-emerald-300 px-2 py-0.5 rounded text-[11px] block w-fit shadow-2xs">
                          سجل: {student.recordNumber}
                        </span>
                        {student.seatNumber && (
                          <span className="font-mono font-bold text-amber-950 bg-amber-100 border border-amber-300 px-1.5 py-0.5 rounded text-[10px] block w-fit">
                            جلوس: {student.seatNumber}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Student Code */}
                    <td className="py-2.5 px-3 font-mono text-stone-700">
                      {student.studentCode}
                    </td>

                    {/* Stage & Grade */}
                    <td className="py-2.5 px-3">
                      <span className="font-semibold text-stone-800">
                        {student.stage === 'preparatory' ? 'إعدادي' : 'ثانوي'}
                      </span>
                      <div className="text-[11px] text-stone-500">
                        {student.grade === 'prep_1' && 'الأول الإعدادي'}
                        {student.grade === 'prep_2' && 'الثاني الإعدادي'}
                        {student.grade === 'prep_3' && 'الثالث الإعدادي'}
                        {student.grade === 'sec_1' && 'الأول الثانوي'}
                        {student.grade === 'sec_2' && `الثاني الثانوي (${student.track === 'scientific' ? 'علمي' : 'أدبي'})`}
                        {student.grade === 'sec_3' && `الثالث الثانوي (${student.track === 'scientific' ? 'علمي' : 'أدبي'})`}
                      </div>
                    </td>

                    {/* Class Name */}
                    <td className="py-2.5 px-3 text-stone-700">
                      {student.className}
                    </td>

                    {/* Nationality & Madhhab & Passport Expiry */}
                    <td className="py-2.5 px-3">
                      <div>
                        {student.isInternational ? (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1 text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-[11px] font-semibold">
                              <Globe2 className="w-3 h-3" />
                              <span>{student.internationalDetails?.nationality}</span>
                            </span>
                            {student.internationalDetails?.passportExpiryDate && (
                              <span className="block text-[9.5px] text-rose-700 font-mono">
                                انتهاء الجواز: {student.internationalDetails.passportExpiryDate}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-stone-600 text-[11px]">مصري</span>
                        )}
                        <span className="text-emerald-900 text-[11px] font-medium block mt-0.5">
                          مذهب {student.internationalDetails?.madhhab || 'شافعي'}
                        </span>
                      </div>
                    </td>

                    {/* Guardian */}
                    <td className="py-2.5 px-3">
                      <span className="block text-stone-800">{student.guardianName}</span>
                      <span className="font-mono text-[10px] text-stone-500" dir="ltr">
                        {student.guardianPhone}
                      </span>
                    </td>

                    {/* Printing Actions (Full Suite A4) */}
                    <td className="py-2.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1 flex-wrap max-w-sm mx-auto">
                        
                        {/* 1. Academic Progression (Matching Images 1 & 2) */}
                        <button
                          onClick={() => onPrintProgression(student)}
                          title="طباعة إثبات قيد وتدرج دراسي أزهري معتمد A4"
                          className="px-2 py-1 bg-emerald-800 hover:bg-emerald-900 text-white rounded text-[10.5px] font-bold shadow-2xs transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <BookOpen className="w-3 h-3 text-amber-300" />
                          <span>التدرج الدراسي A4</span>
                        </button>

                        {/* 2. Graduation Certificate (Landscape A4) */}
                        <button
                          onClick={() => onPrintGraduationCertificate(student)}
                          title="طباعة شهادة تخرج وإتمام مرحلة دراسية (تصميم عرضي فخم A4)"
                          className="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 rounded text-[10.5px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Award className="w-3 h-3 text-amber-700" />
                          <span>شهادة تخرج (عرضي)</span>
                        </button>

                        {/* 3. Success / Grades Certificate */}
                        <button
                          onClick={() => onPrintCertificate(student)}
                          title="طباعة بيان درجات وشهادة نجاح A4"
                          className="px-1.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded text-[10px] font-semibold transition-colors cursor-pointer"
                        >
                          بيان درجات
                        </button>

                        {/* 4. ID Card */}
                        <button
                          onClick={() => onPrintIdCard(student)}
                          title="طباعة بطاقة قيد / كارنيه الطالب المدرسي"
                          className="px-1.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 rounded text-[10px] font-semibold transition-colors cursor-pointer"
                        >
                          كارنيه
                        </button>

                        {/* 5. Official Letter */}
                        <button
                          onClick={() => onPrintOfficialLetter(student)}
                          title="إفادة قيد رسمية / خطاب للجوازات والسفارة A4"
                          className="px-1.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 rounded text-[10px] font-semibold transition-colors cursor-pointer"
                        >
                          خطاب رسمي
                        </button>

                      </div>
                    </td>

                    {/* Manage actions */}
                    <td className="py-2.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onViewHistory(student)}
                          title="عرض السجل التاريخي والتدرج"
                          className="p-1 text-stone-500 hover:text-blue-700 cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEditStudent(student)}
                          title="تعديل بيانات الطالب"
                          className="p-1 text-stone-500 hover:text-amber-800 cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`هل أنت متأكد من حذف قيد الطالب "${student.fullName}"؟`)) {
                              onDeleteStudent(student.id);
                            }
                          }}
                          title="حذف القيد"
                          className="p-1 text-stone-400 hover:text-rose-600 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-stone-400">
                    لا يوجد طلاب مطابقين لمعايير البحث الحالية.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
