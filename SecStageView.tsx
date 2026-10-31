/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GraduationCap, Users, Printer, Plus, Search, Atom, BookOpen } from 'lucide-react';
import { Student, ClassRoom } from '../../types';

interface SecStageViewProps {
  students: Student[];
  classes: ClassRoom[];
  onAddStudent: () => void;
  onEditStudent: (student: Student) => void;
  onPrintCertificate: (student: Student) => void;
  onPrintRoster: (cls: ClassRoom) => void;
}

export const SecStageView: React.FC<SecStageViewProps> = ({
  students,
  classes,
  onAddStudent,
  onEditStudent,
  onPrintCertificate,
  onPrintRoster,
}) => {
  const [selectedGrade, setSelectedGrade] = useState<'all' | 'sec_1' | 'sec_2' | 'sec_3'>('all');
  const [selectedTrack, setSelectedTrack] = useState<'all' | 'scientific' | 'literary'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const secStudents = students.filter(s => s.stage === 'secondary');
  const secClasses = classes.filter(c => c.stage === 'secondary');

  const filteredStudents = secStudents.filter(s => {
    if (selectedGrade !== 'all' && s.grade !== selectedGrade) return false;
    if (selectedTrack !== 'all' && s.track !== selectedTrack) return false;
    if (searchTerm && !s.fullName.includes(searchTerm) && !s.studentCode.includes(searchTerm)) return false;
    return true;
  });

  const countSci = secStudents.filter(s => s.track === 'scientific').length;
  const countLit = secStudents.filter(s => s.track === 'literary').length;
  const countSec1 = secStudents.filter(s => s.grade === 'sec_1').length;
  const countSec3 = secStudents.filter(s => s.grade === 'sec_3').length;

  return (
    <div className="space-y-6 text-right">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-emerald-800" />
            <h2 className="text-lg font-bold text-stone-900">
              المرحلة الثانوية الأزهرية (بنين)
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            إدارة الصف الأول الثانوي، والصفين الثاني والثالث الثانوي مع التخصيص الدقيق للقسم العلمي والقسم الأدبي، والشهادة الثانوية الأزهرية.
          </p>
        </div>

        <button
          onClick={onAddStudent}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>تسجيل طالب ثانوي</span>
        </button>
      </div>

      {/* Track & Grade Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        
        {/* All Secondary */}
        <div
          onClick={() => { setSelectedGrade('all'); setSelectedTrack('all'); }}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            selectedGrade === 'all' && selectedTrack === 'all'
              ? 'bg-emerald-800 text-white border-emerald-900 shadow-sm'
              : 'bg-white border-stone-200 hover:border-emerald-600'
          }`}
        >
          <span className="text-xs block opacity-80">إجمالي طلاب الثانوي</span>
          <strong className="text-xl font-bold font-mono tabular-nums block mt-1">
            {secStudents.length}
          </strong>
          <span className="text-[11px] opacity-75 mt-0.5 block">1ث · 2ث · 3ث</span>
        </div>

        {/* Scientific Division */}
        <div
          onClick={() => { setSelectedTrack('scientific'); }}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            selectedTrack === 'scientific'
              ? 'bg-emerald-800 text-white border-emerald-900 shadow-sm'
              : 'bg-white border-stone-200 hover:border-emerald-600'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs block opacity-80">القسم العلمي</span>
            <Atom className="w-4 h-4 opacity-75" />
          </div>
          <strong className="text-xl font-bold font-mono tabular-nums block mt-1">
            {countSci}
          </strong>
          <span className="text-[11px] opacity-75 mt-0.5 block">رياضيات وفيزياء وأحياء</span>
        </div>

        {/* Literary Division */}
        <div
          onClick={() => { setSelectedTrack('literary'); }}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            selectedTrack === 'literary'
              ? 'bg-emerald-800 text-white border-emerald-900 shadow-sm'
              : 'bg-white border-stone-200 hover:border-emerald-600'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs block opacity-80">القسم الأدبي</span>
            <BookOpen className="w-4 h-4 opacity-75" />
          </div>
          <strong className="text-xl font-bold font-mono tabular-nums block mt-1">
            {countLit}
          </strong>
          <span className="text-[11px] opacity-75 mt-0.5 block">أدب ونصوص وتاريخ ومنطق</span>
        </div>

        {/* 3rd Secondary (Al-Azhar Baccalaureate) */}
        <div
          onClick={() => { setSelectedGrade('sec_3'); setSelectedTrack('all'); }}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            selectedGrade === 'sec_3'
              ? 'bg-amber-600 text-white border-amber-700 shadow-sm'
              : 'bg-white border-amber-200 text-stone-800 hover:border-amber-500'
          }`}
        >
          <span className="text-xs block opacity-80">الشهادة الثانوية الأزهرية</span>
          <strong className="text-xl font-bold font-mono tabular-nums block mt-1">
            {countSec3}
          </strong>
          <span className="text-[11px] opacity-75 mt-0.5 block">الصف الثالث الثانوي</span>
        </div>

      </div>

      {/* Track & Grade Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-bold text-stone-700">تصفية حسب الصف:</span>
          <button
            onClick={() => setSelectedGrade('all')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
              selectedGrade === 'all' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            الكل
          </button>
          <button
            onClick={() => setSelectedGrade('sec_1')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
              selectedGrade === 'sec_1' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            الأول الثانوي (عام)
          </button>
          <button
            onClick={() => setSelectedGrade('sec_2')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
              selectedGrade === 'sec_2' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            الثاني الثانوي
          </button>
          <button
            onClick={() => setSelectedGrade('sec_3')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
              selectedGrade === 'sec_3' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            الثالث الثانوي (الشهادة)
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-bold text-stone-700">القسم:</span>
          <button
            onClick={() => setSelectedTrack('all')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
              selectedTrack === 'all' ? 'bg-emerald-800 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            الكل
          </button>
          <button
            onClick={() => setSelectedTrack('scientific')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
              selectedTrack === 'scientific' ? 'bg-emerald-800 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            علمي
          </button>
          <button
            onClick={() => setSelectedTrack('literary')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
              selectedTrack === 'literary' ? 'bg-emerald-800 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            أدبي
          </button>
        </div>
      </div>

      {/* Class Rosters Shortcuts */}
      <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="font-bold text-stone-800">
          كشوف مناداة فصول المرحلة الثانوية (A4):
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {secClasses.map(cls => (
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
              placeholder="بحث في طلاب الثانوي..."
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
                <th className="py-3 px-3">الصف والتخصص</th>
                <th className="py-3 px-3">الفصل</th>
                <th className="py-3 px-3">الجنسية</th>
                <th className="py-3 px-3">المذهب</th>
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
                  <td className="py-2.5 px-3">
                    <span className="font-semibold text-stone-800">
                      {student.grade === 'sec_1' && 'الأول الثانوي'}
                      {student.grade === 'sec_2' && 'الثاني الثانوي'}
                      {student.grade === 'sec_3' && 'الثالث الثانوي (الشهادة)'}
                    </span>
                    {student.track && (
                      <span className={`inline-block mr-1 text-[10px] px-1.5 py-0.2 rounded font-bold ${
                        student.track === 'scientific' ? 'bg-blue-100 text-blue-900' : 'bg-purple-100 text-purple-900'
                      }`}>
                        {student.track === 'scientific' ? 'علمي' : 'أدبي'}
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-stone-700">{student.className}</td>
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
                        <span>الشهادة A4</span>
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
