/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Globe2,
  Search,
  Filter,
  Plus,
  Printer,
  Edit2,
  Calendar,
  AlertCircle,
  FileCheck2,
  CheckCircle2,
} from 'lucide-react';
import { Student } from '../../types';

interface InternationalStudentsViewProps {
  students: Student[];
  onAddStudent: () => void;
  onEditStudent: (student: Student) => void;
  onPrintCertificate: (student: Student) => void;
  onPrintProgression: (student: Student) => void;
}

export const InternationalStudentsView: React.FC<InternationalStudentsViewProps> = ({
  students,
  onAddStudent,
  onEditStudent,
  onPrintCertificate,
  onPrintProgression,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [nationalityFilter, setNationalityFilter] = useState('all');
  const [madhhabFilter, setMadhhabFilter] = useState('all');

  const internationalStudents = students.filter(s => s.isInternational);

  const nationalities = Array.from(
    new Set(internationalStudents.map(s => s.internationalDetails?.nationality).filter(Boolean))
  ) as string[];

  const filtered = internationalStudents.filter(s => {
    if (nationalityFilter !== 'all' && s.internationalDetails?.nationality !== nationalityFilter) return false;
    if (madhhabFilter !== 'all' && s.internationalDetails?.madhhab !== madhhabFilter) return false;
    if (searchTerm) {
      const match =
        s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.studentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.internationalDetails?.passportNumber && s.internationalDetails.passportNumber.includes(searchTerm));
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 text-right">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <Globe2 className="w-5 h-5 text-amber-700" />
            <h2 className="text-lg font-bold text-stone-900">
              إدارة شؤون الطلاب الوافدين (الدراسات الإسلامية والعربية)
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            سجل الطلاب الوافدين من مختلف دول العالم الإسلامي، متابعة جوازات السفر، الإقامات الرسمية، المذاهب الفقهية، واللغات الأم.
          </p>
        </div>

        <button
          onClick={onAddStudent}
          className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>تسجيل طالب وافد جديد</span>
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <span className="text-xs text-stone-500 block">إجمالي الطلاب الوافدين</span>
          <strong className="text-2xl font-bold font-mono text-emerald-950 tabular-nums block mt-1">
            {internationalStudents.length}
          </strong>
          <span className="text-[11px] text-stone-400 mt-0.5 block">منحة الأزهر الشريف</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <span className="text-xs text-stone-500 block">عدد الدول الممثلة</span>
          <strong className="text-2xl font-bold font-mono text-stone-900 tabular-nums block mt-1">
            {nationalities.length}
          </strong>
          <span className="text-[11px] text-stone-400 mt-0.5 block">دول آسيا وإفريقيا وأوروبا</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <span className="text-xs text-stone-500 block">المذهب الشافعي (الأكثر طلباً)</span>
          <strong className="text-2xl font-bold font-mono text-stone-900 tabular-nums block mt-1">
            {internationalStudents.filter(s => s.internationalDetails?.madhhab === 'شافعي').length}
          </strong>
          <span className="text-[11px] text-stone-400 mt-0.5 block">جنوب شرق آسيا</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <span className="text-xs text-stone-500 block">المذهب المالكي والحنفي</span>
          <strong className="text-2xl font-bold font-mono text-stone-900 tabular-nums block mt-1">
            {internationalStudents.filter(s => s.internationalDetails?.madhhab === 'مالكي' || s.internationalDetails?.madhhab === 'حنفي').length}
          </strong>
          <span className="text-[11px] text-stone-400 mt-0.5 block">غرب إفريقيا وتركيا</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="بحث بالاسم أو رقم الجواز..."
            className="w-full px-3 py-2 pr-8 border border-stone-300 rounded-lg"
          />
          <Search className="w-4 h-4 text-stone-400 absolute right-2.5 top-2.5" />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={nationalityFilter}
            onChange={(e) => setNationalityFilter(e.target.value)}
            className="px-3 py-2 border border-stone-300 rounded-lg bg-white"
          >
            <option value="all">كافة الجنسيات</option>
            {nationalities.map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>

          <select
            value={madhhabFilter}
            onChange={(e) => setMadhhabFilter(e.target.value)}
            className="px-3 py-2 border border-stone-300 rounded-lg bg-white font-medium"
          >
            <option value="all">كافة المذاهب</option>
            <option value="شافعي">المذهب الشافعي</option>
            <option value="حنفي">المذهب الحنفي</option>
            <option value="مالكي">المذهب المالكي</option>
            <option value="حنبلي">المذهب الحنبلي</option>
          </select>
        </div>
      </div>

      {/* Detailed Expat Student Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right divide-y divide-stone-200">
            <thead className="bg-stone-50 text-stone-700 font-bold text-[11px]">
              <tr>
                <th className="py-3 px-4">الطالب والصورة</th>
                <th className="py-3 px-3">الجنسية والدولة</th>
                <th className="py-3 px-3">رقم جواز السفر</th>
                <th className="py-3 px-3">المذهب الفقهي</th>
                <th className="py-3 px-3">اللغة الأم</th>
                <th className="py-3 px-3">الصف والفصل</th>
                <th className="py-3 px-3">انتهاء الإقامة</th>
                <th className="py-3 px-3">الملحقية / السفارة</th>
                <th className="py-3 px-4 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((student) => (
                <tr key={student.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full border border-stone-200 overflow-hidden shrink-0 bg-stone-100">
                        {student.photoUrl && (
                          <img src={student.photoUrl} alt="" className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div>
                        <strong className="block text-stone-900">{student.fullName}</strong>
                        <span className="text-[10px] text-stone-500 font-mono">
                          كود: {student.studentCode}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <span className="font-bold text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200 text-[11px]">
                      {student.internationalDetails?.nationality}
                    </span>
                  </td>

                  <td className="py-3 px-3 font-mono">
                    <div className="font-bold text-stone-900">
                      {student.internationalDetails?.passportNumber}
                    </div>
                    {student.internationalDetails?.passportExpiryDate && (
                      <div className="text-[10px] text-rose-700 font-semibold mt-0.5">
                        ينتهي: {student.internationalDetails.passportExpiryDate}
                      </div>
                    )}
                  </td>

                  <td className="py-3 px-3">
                    <span className="text-emerald-900 font-semibold">
                      المذهب ال{student.internationalDetails?.madhhab}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-stone-600">
                    {student.internationalDetails?.nativeLanguage}
                  </td>

                  <td className="py-3 px-3 text-stone-800">
                    {student.className}
                  </td>

                  <td className="py-3 px-3">
                    <span className="font-mono text-stone-800 text-[11px] block">
                      {student.internationalDetails?.residenceExpiry}
                    </span>
                    <span className="text-[10px] text-emerald-700">سارية</span>
                  </td>

                  <td className="py-3 px-3 text-stone-500 text-[11px]">
                    {student.internationalDetails?.embassyContact || 'مدينة البعوث الإسلامية'}
                  </td>

                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => onPrintProgression(student)}
                        title="إثبات قيد وتدرج دراسي للوافدين (مجمع البحوث الإسلامية) A4"
                        className="px-2 py-1 bg-emerald-800 hover:bg-emerald-900 text-white rounded text-[10.5px] font-bold shadow-2xs transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <FileCheck2 className="w-3.5 h-3.5 text-amber-300" />
                        <span>إثبات قيد وتدرج A4</span>
                      </button>

                      <button
                        onClick={() => onPrintCertificate(student)}
                        title="طباعة شهادة تقدير معتمدة A4"
                        className="p-1.5 text-emerald-800 hover:bg-emerald-50 rounded transition-colors cursor-pointer"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEditStudent(student)}
                        title="تعديل بيانات الطالب الوافد"
                        className="p-1.5 text-stone-600 hover:bg-stone-100 rounded transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
