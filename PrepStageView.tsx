/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { School, Users, Printer, Plus, Search, BookOpen, GraduationCap } from 'lucide-react';
import { Student, ClassRoom } from '../../types';

interface PrepStageViewProps {
  students: Student[];
  classes: ClassRoom[];
  onAddStudent: () => void;
  onEditStudent: (student: Student) => void;
  onPrintCertificate: (student: Student) => void;
  onPrintRoster: (cls: ClassRoom) => void;
}

export const PrepStageView: React.FC<PrepStageViewProps> = ({
  students,
  classes,
  onAddStudent,
  onEditStudent,
  onPrintCertificate,
  onPrintRoster,
}) => {
  const [selectedGrade, setSelectedGrade] = useState<'all' | 'prep_1' | 'prep_2' | 'prep_3'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const prepStudents = students.filter(s => s.stage === 'preparatory');
  const prepClasses = classes.filter(c => c.stage === 'preparatory');

  const filteredStudents = prepStudents.filter(s => {
    if (selectedGrade !== 'all' && s.grade !== selectedGrade) return false;
    if (searchTerm && !s.fullName.includes(searchTerm) && !s.studentCode.includes(searchTerm)) return false;
    return true;
  });

  const countP1 = prepStudents.filter(s => s.grade === 'prep_1').length;
  const countP2 = prepStudents.filter(s => s.grade === 'prep_2').length;
  const countP3 = prepStudents.filter(s => s.grade === 'prep_3').length;

  return (
    <div className="space-y-6 text-right">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <School className="w-5 h-5 text-emerald-800" />
            <h2 className="text-lg font-bold text-stone-900">
              المرحلة الإعدادية الأزهرية (بنين)
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            إدارة الصف الأول الإعدادي، الثاني الإعدادي، والصف الثالث الإعدادي (الشهادة الإعدادية الأزهرية).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onAddStudent}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>تسجيل طالب إعدادي</span>
          </button>
        </div>
      </div>

      {/* Grade Selector Tabs / Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setSelectedGrade('all')}
          className={`p-4 rounded-xl border text-right transition-all cursor-pointer ${
            selectedGrade === 'all'
              ? 'bg-emerald-800 text-white border-emerald-900 shadow-sm'
              : 'bg-white border-stone-200 text-stone-800 hover:border-emerald-600'
          }`}
        >
          <span className="text-xs block opacity-80">كافة طلاب المرحلة</span>
          <strong className="text-xl font-bold font-mono tabular-nums block mt-1">
            {prepStudents.length}
          </strong>
          <span className="text-[11px] opacity-75 mt-0.5 block">إجمالي الإعدادي</span>
        </button>

        <button
          onClick={() => setSelectedGrade('prep_1')}
          className={`p-4 rounded-xl border text-right transition-all cursor-pointer ${
            selectedGrade === 'prep_1'
              ? 'bg-emerald-800 text-white border-emerald-900 shadow-sm'
              : 'bg-white border-stone-200 text-stone-800 hover:border-emerald-600'
          }`}
        >
          <span className="text-xs block opacity-80">الصف الأول الإعدادي</span>
          <strong className="text-xl font-bold font-mono tabular-nums block mt-1">
            {countP1}
          </strong>
          <span className="text-[11px] opacity-75 mt-0.5 block">فصول 1/1 و 1/2</span>
        </button>

        <button
          onClick={() => setSelectedGrade('prep_2')}
          className={`p-4 rounded-xl border text-right transition-all cursor-pointer ${
            selectedGrade === 'prep_2'
              ? 'bg-emerald-800 text-white border-emerald-900 shadow-sm'
              : 'bg-white border-stone-200 text-stone-800 hover:border-emerald-600'
          }`}
        >
          <span className="text-xs block opacity-80">الصف الثاني الإعدادي</span>
          <strong className="text-xl font-bold font-mono tabular-nums block mt-1">
            {countP2}
          </strong>
          <span className="text-[11px] opacity-75 mt-0.5 block">فصول 2/1</span>
        </button>

        <button
          onClick={() => setSelectedGrade('prep_3')}
          className={`p-4 rounded-xl border text-right transition-all cursor-pointer ${
            selectedGrade === 'prep_3'
              ? 'bg-emerald-800 text-white border-emerald-900 shadow-sm'
              : 'bg-white border-stone-200 text-stone-800 hover:border-emerald-600'
          }`}
        >
          <span className="text-xs block opacity-80">الشهادة الإعدادية (3ع)</span>
          <strong className="text-xl font-bold font-mono tabular-nums block mt-1">
            {countP3}
          </strong>
          <span className="text-[11px] opacity-75 mt-0.5 block">امتحانات الشهادة</span>
        </button>
      </div>

      {/* Classes Roll-Call shortcuts */}
      <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="font-bold text-stone-800">
          كشوف مناداة فصول المرحلة الإعدادية المعتمدة (A4):
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {prepClasses.map(cls => (
            <button
              key={cls.id}
              onClick={() => onPrintRoster(cls)}
              className="px-3 py-1.5 bg-white border border-stone-300 hover:border-emerald-600 hover:bg-emerald-50 text-stone-700 hover:text-emerald-900 rounded font-medium transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5 text-stone-400" />
              <span>كشف {cls.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-stone-200 flex items-center justify-between">
          <div className="relative w-72">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="بحث في طلاب الإعدادي..."
              className="w-full px-3 py-1.5 pr-8 border border-stone-300 rounded-lg text-xs"
            />
            <Search className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-2.5" />
          </div>
          <span className="text-xs text-stone-500 font-mono">
            المعروض: {filteredStudents.length} طالب
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right divide-y divide-stone-200">
            <thead className="bg-stone-50 text-stone-700 font-bold text-[11px]">
              <tr>
                <th className="py-3 px-4">الطالب</th>
                <th className="py-3 px-3">رقم القيد الأزهري</th>
                <th className="py-3 px-3">الصف والفصل</th>
                <th className="py-3 px-3">الجنسية</th>
                <th className="py-3 px-3">المذهب الفقهي</th>
                <th className="py-3 px-3">هاتف ولي الأمر</th>
                <th className="py-3 px-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-2.5 px-4 font-semibold text-stone-900">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-stone-200 overflow-hidden shrink-0">
                        {student.photoUrl && (
                          <img src={student.photoUrl} alt="" className="w-full h-full object-cover" />
                        )}
                      </div>
                      <span>{student.fullName}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-stone-600">{student.studentCode}</td>
                  <td className="py-2.5 px-3 text-stone-800">{student.className}</td>
                  <td className="py-2.5 px-3">
                    {student.isInternational ? (
                      <span className="text-amber-800 font-medium">وافد ({student.internationalDetails?.nationality})</span>
                    ) : (
                      <span className="text-stone-600">مصري</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-stone-700">{student.internationalDetails?.madhhab || 'شافعي'}</td>
                  <td className="py-2.5 px-3 font-mono text-stone-600" dir="ltr">{student.guardianPhone}</td>
                  <td className="py-2.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onPrintCertificate(student)}
                        className="px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded font-semibold hover:bg-emerald-100 transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
                      >
                        <Printer className="w-3 h-3" />
                        <span>شهادة A4</span>
                      </button>
                      <button
                        onClick={() => onEditStudent(student)}
                        className="p-1 text-stone-500 hover:text-stone-900 cursor-pointer"
                      >
                        تعديل
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
