/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Users,
  GraduationCap,
  Globe2,
  Briefcase,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  UserCheck,
  Plus,
  Printer,
  ChevronLeft,
  Calendar,
  School,
  BookOpen,
} from 'lucide-react';
import { Student, StaffMember, ClassRoom, FeeRecord } from '../../types';

interface DashboardViewProps {
  students: Student[];
  staff: StaffMember[];
  classes: ClassRoom[];
  fees: FeeRecord[];
  onOpenNewStudent: () => void;
  onOpenCertificate: (student: Student) => void;
  onOpenRoster: (cls: ClassRoom) => void;
  onNavigateSection: (section: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  students,
  staff,
  classes,
  fees,
  onOpenNewStudent,
  onOpenCertificate,
  onOpenRoster,
  onNavigateSection,
}) => {
  const prepStudents = students.filter(s => s.stage === 'preparatory');
  const secStudents = students.filter(s => s.stage === 'secondary');
  const internationalStudents = students.filter(s => s.isInternational);
  
  // Total fees collected
  const totalDue = fees.reduce((acc, f) => acc + f.amount, 0);
  const totalPaid = fees.reduce((acc, f) => acc + f.paidAmount, 0);
  const feeRate = totalDue > 0 ? Math.round((totalPaid / totalDue) * 100) : 100;

  // Madhhab distribution
  const madhhabCounts = {
    شافعي: students.filter(s => s.internationalDetails?.madhhab === 'شافعي' || (!s.isInternational && !s.internationalDetails?.madhhab)).length,
    حنفي: students.filter(s => s.internationalDetails?.madhhab === 'حنفي').length,
    مالكي: students.filter(s => s.internationalDetails?.madhhab === 'مالكي').length,
    حنبلي: students.filter(s => s.internationalDetails?.madhhab === 'حنبلي').length,
  };

  // International nationalities
  const nationalityMap = internationalStudents.reduce((acc, s) => {
    const nat = s.internationalDetails?.nationality || 'غير محدد';
    acc[nat] = (acc[nat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Expiring residencies (within next 18 months for alert)
  const expiringResidencies = internationalStudents.filter(s => {
    if (!s.internationalDetails?.residenceExpiry) return false;
    const expiry = new Date(s.internationalDetails.residenceExpiry);
    const now = new Date();
    const diffMonths = (expiry.getFullYear() - now.getFullYear()) * 12 + (expiry.getMonth() - now.getMonth());
    return diffMonths <= 12;
  });

  return (
    <div className="space-y-6 text-right">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-l from-emerald-900 to-emerald-850 text-white rounded-xl p-6 shadow-sm border border-emerald-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold mb-1">
            <School className="w-4 h-4" />
            <span>نظام الإدارة الشاملة · معهد عبد الرؤوف الأزهري (بنين)</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold font-amiri leading-relaxed">
            أهلاً بكم في المنظومة الرقمية لمعهد عبد الرؤوف الإعدادي والثانوي
          </h2>
          <p className="text-xs text-emerald-100 max-w-2xl mt-1 leading-relaxed">
            متابعة شاملة لشؤون الطلاب المصريين والوافدين، التدرج الدراسي، شؤون التدريس، الكنترول والشهادات الرسمية A4، والمصروفات.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenNewStudent}
            className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>تسجيل طالب جديد</span>
          </button>
          <button
            onClick={() => onNavigateSection('reports')}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-medium text-xs rounded-lg border border-emerald-600 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة الشهادات A4</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Grid (60-30-10 palette, tabular numerals) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        
        {/* Total Students */}
        <div
          onClick={() => onNavigateSection('students')}
          className="bg-white p-4 rounded-xl border border-stone-200 hover:border-emerald-600 transition-all cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-stone-500">إجمالي الطلاب</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center group-hover:bg-emerald-800 group-hover:text-white transition-colors">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-stone-900 font-mono tabular-nums">
            {students.length}
          </div>
          <span className="text-[11px] text-stone-400 mt-0.5 block">طالباً مقيداً</span>
        </div>

        {/* Prep Students */}
        <div
          onClick={() => onNavigateSection('prep-stage')}
          className="bg-white p-4 rounded-xl border border-stone-200 hover:border-emerald-600 transition-all cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-stone-500">المرحلة الإعدادية</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center group-hover:bg-emerald-800 group-hover:text-white transition-colors">
              <School className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-stone-900 font-mono tabular-nums">
            {prepStudents.length}
          </div>
          <span className="text-[11px] text-stone-400 mt-0.5 block">1ع · 2ع · 3ع</span>
        </div>

        {/* Secondary Students */}
        <div
          onClick={() => onNavigateSection('sec-stage')}
          className="bg-white p-4 rounded-xl border border-stone-200 hover:border-emerald-600 transition-all cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-stone-500">المرحلة الثانوية</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center group-hover:bg-emerald-800 group-hover:text-white transition-colors">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-stone-900 font-mono tabular-nums">
            {secStudents.length}
          </div>
          <span className="text-[11px] text-stone-400 mt-0.5 block">علمي وأدبي</span>
        </div>

        {/* International Students */}
        <div
          onClick={() => onNavigateSection('international')}
          className="bg-white p-4 rounded-xl border border-amber-200 hover:border-amber-500 transition-all cursor-pointer shadow-2xs group bg-amber-50/20"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-amber-900">الطلاب الوافدون</span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Globe2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-stone-900 font-mono tabular-nums">
            {internationalStudents.length}
          </div>
          <span className="text-[11px] text-amber-700 mt-0.5 block">من عدة دول</span>
        </div>

        {/* Staff Members */}
        <div
          onClick={() => onNavigateSection('staff')}
          className="bg-white p-4 rounded-xl border border-stone-200 hover:border-emerald-600 transition-all cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-stone-500">المدرسون والموظفون</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center group-hover:bg-emerald-800 group-hover:text-white transition-colors">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-stone-900 font-mono tabular-nums">
            {staff.length}
          </div>
          <span className="text-[11px] text-stone-400 mt-0.5 block">كادر أزهري معتمد</span>
        </div>

        {/* Tuition Collection Rate */}
        <div
          onClick={() => onNavigateSection('fees')}
          className="bg-white p-4 rounded-xl border border-stone-200 hover:border-emerald-600 transition-all cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-stone-500">تحصيل المصروفات</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center group-hover:bg-emerald-800 group-hover:text-white transition-colors">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-950 font-mono tabular-nums">
            {feeRate}%
          </div>
          <span className="text-[11px] text-stone-400 mt-0.5 block font-mono">
            {totalPaid} ج.م مسدد
          </span>
        </div>

      </div>

      {/* Middle Row: International & Madhhab Insights + Residency Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Madhhab Distribution in Al-Azhar */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-3.5">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
            <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-800" />
              <span>توزيع المذاهب الفقهية بالمعهد</span>
            </h3>
            <span className="text-[11px] text-stone-500">الفقه الأزهري</span>
          </div>

          <div className="space-y-3 text-xs">
            {Object.entries(madhhabCounts).map(([mName, count]) => {
              const pct = students.length > 0 ? Math.round((count / students.length) * 100) : 0;
              return (
                <div key={mName} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-stone-800">المذهب ال{mName}</span>
                    <span className="font-mono text-stone-500 tabular-nums">
                      {count} طالباً ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-800 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(pct, 5)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* International Student Nationalities */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-3.5">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
            <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-amber-700" />
              <span>جنسيات الطلاب الوافدين</span>
            </h3>
            <button
              onClick={() => onNavigateSection('international')}
              className="text-xs text-emerald-800 hover:underline font-medium"
            >
              عرض الكل ({internationalStudents.length})
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {Object.entries(nationalityMap).map(([country, count]) => (
              <div
                key={country}
                className="p-2.5 bg-stone-50 rounded-lg border border-stone-100 flex items-center justify-between"
              >
                <span className="font-medium text-stone-800">{country}</span>
                <span className="font-mono font-bold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                  {count}
                </span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-stone-500 mt-2">
            يدرس الطلاب الوافدون بمعهد عبد الرؤوف بموجب منح الأزهر الشريف والإدارة العامة للوافدين.
          </p>
        </div>

        {/* Residency Expirations / Action Alert */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-3.5">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
            <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>متابعة إقامات الوافدين والجوازات</span>
            </h3>
            <span className="text-[11px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-bold">
              تنبيه هام
            </span>
          </div>

          {expiringResidencies.length > 0 ? (
            <div className="space-y-2 text-xs">
              {expiringResidencies.slice(0, 3).map(s => (
                <div
                  key={s.id}
                  className="p-2.5 bg-amber-50/70 border border-amber-200/80 rounded-lg flex items-center justify-between"
                >
                  <div>
                    <strong className="block text-stone-900 text-[11px]">{s.fullName}</strong>
                    <span className="text-[10px] text-stone-500 font-mono">
                      جواز: {s.internationalDetails?.passportNumber} · {s.internationalDetails?.nationality}
                    </span>
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] text-amber-800 font-mono block">
                      تنتهي: {s.internationalDetails?.residenceExpiry}
                    </span>
                    <span className="text-[9px] text-emerald-800 font-bold">
                      جاهز للتجديد
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-emerald-50 rounded-lg text-emerald-900 text-xs text-center">
              كافة إقامات الطلاب الوافدين سارية المفعول حالياً.
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={() => onNavigateSection('international')}
              className="w-full py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center block"
            >
              فتح سجل إقامات وجوازات الوافدين
            </button>
          </div>
        </div>

      </div>

      {/* Recent Students Table with Quick Actions */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-stone-900">
              أحدث الطلاب المسجلين بمعهد عبد الرؤوف
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              قاعدة بيانات الطلاب المقيدين في العام الدراسي 2025/2026
            </p>
          </div>
          <button
            onClick={() => onNavigateSection('students')}
            className="flex items-center gap-1 text-xs text-emerald-800 hover:underline font-semibold cursor-pointer"
          >
            <span>عرض كافة الطلاب</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right divide-y divide-stone-200">
            <thead className="bg-stone-50 text-stone-700 font-semibold text-[11px]">
              <tr>
                <th className="py-3 px-4">الطالب</th>
                <th className="py-3 px-3">رقم القيد الأزهري</th>
                <th className="py-3 px-3">المرحلة والصف</th>
                <th className="py-3 px-3">الفصل</th>
                <th className="py-3 px-3">الجنسية والنوع</th>
                <th className="py-3 px-3">المذهب</th>
                <th className="py-3 px-3">حالة القيد</th>
                <th className="py-3 px-4 text-center">إجراءات سريعة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {students.slice(0, 6).map((student) => (
                <tr key={student.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-2.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full border border-stone-200 overflow-hidden shrink-0 bg-stone-100">
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
                        <span className="text-[10px] text-stone-400 font-mono">
                          {student.isInternational ? student.internationalDetails?.passportNumber : student.nationalId}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-stone-600 text-[11px]">
                    {student.studentCode}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="text-stone-800 font-medium">
                      {student.stage === 'preparatory' ? 'إعدادي' : 'ثانوي'}
                    </span>
                    <span className="text-stone-400 mx-1">·</span>
                    <span className="text-stone-600">
                      {student.grade.replace('prep_', '').replace('sec_', '')} {student.track && `(${student.track === 'scientific' ? 'علمي' : 'أدبي'})`}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-stone-700">
                    {student.className}
                  </td>
                  <td className="py-2.5 px-3">
                    {student.isInternational ? (
                      <span className="inline-flex items-center gap-1 text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-[11px] font-semibold">
                        <Globe2 className="w-3 h-3" />
                        <span>{student.internationalDetails?.nationality} (وافد)</span>
                      </span>
                    ) : (
                      <span className="text-stone-600 text-[11px]">مصري</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-stone-700">
                    {student.internationalDetails?.madhhab || 'شافعي'}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-semibold">
                      منتظم ومقيد
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onOpenCertificate(student)}
                        title="طباعة شهادة تقدير وبيان درجات A4"
                        className="px-2.5 py-1 bg-stone-100 hover:bg-emerald-50 hover:text-emerald-800 text-stone-700 rounded text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Printer className="w-3 h-3" />
                        <span>الشهادة A4</span>
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
