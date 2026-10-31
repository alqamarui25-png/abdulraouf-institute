/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Globe2,
  Briefcase,
  CalendarDays,
  Library,
  UserCheck,
  FileCheck2,
  Receipt,
  Printer,
  Shield,
  Database,
  History,
  School,
  Stamp,
} from 'lucide-react';

export type NavSection =
  | 'dashboard'
  | 'students'
  | 'academic-history'
  | 'prep-stage'
  | 'sec-stage'
  | 'international'
  | 'staff'
  | 'classes-schedules'
  | 'subjects'
  | 'attendance'
  | 'exams'
  | 'fees'
  | 'reports'
  | 'users'
  | 'institute-settings'
  | 'official-letter'
  | 'supabase-settings';

interface SidebarProps {
  currentSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  counts?: {
    totalStudents: number;
    internationalStudents: number;
    staffCount: number;
    prepCount: number;
    secCount: number;
  };
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentSection,
  onSelectSection,
  counts,
  isOpenMobile,
  onCloseMobile,
}) => {
  const navItems = [
    {
      id: 'dashboard' as NavSection,
      label: '1. لوحة التحكم والإحصائيات',
      icon: LayoutDashboard,
      badge: undefined,
    },
    {
      id: 'students' as NavSection,
      label: '2. شؤون الطلاب وبياناتهم',
      icon: Users,
      badge: counts?.totalStudents,
    },
    {
      id: 'academic-history' as NavSection,
      label: '3. التدرج الدراسي والسجل التاريخي',
      icon: History,
      badge: undefined,
    },
    {
      id: 'prep-stage' as NavSection,
      label: '4. المرحلة الإعدادية (1ع - 2ع - 3ع)',
      icon: School,
      badge: counts?.prepCount,
    },
    {
      id: 'sec-stage' as NavSection,
      label: '5. المرحلة الثانوية (علمي وأدبي)',
      icon: GraduationCap,
      badge: counts?.secCount,
    },
    {
      id: 'international' as NavSection,
      label: '6. شؤون الطلاب الوافدين',
      icon: Globe2,
      badge: counts?.internationalStudents,
      highlight: true,
    },
    {
      id: 'staff' as NavSection,
      label: '7. المدرسون والموظفون',
      icon: Briefcase,
      badge: counts?.staffCount,
    },
    {
      id: 'classes-schedules' as NavSection,
      label: '8. الفصول والجداول الدراسية',
      icon: CalendarDays,
      badge: undefined,
    },
    {
      id: 'subjects' as NavSection,
      label: '9. المقررات والمناهج الأزهرية',
      icon: Library,
      badge: undefined,
    },
    {
      id: 'attendance' as NavSection,
      label: '10. الحضور والغياب اليومي',
      icon: UserCheck,
      badge: undefined,
    },
    {
      id: 'exams' as NavSection,
      label: '11. الامتحانات والدرجات والنتائج',
      icon: FileCheck2,
      badge: undefined,
    },
    {
      id: 'fees' as NavSection,
      label: '12. المصروفات والإيصالات المالية',
      icon: Receipt,
      badge: undefined,
    },
    {
      id: 'reports' as NavSection,
      label: '13. التقارير والشهادات والكشوف A4',
      icon: Printer,
      badge: undefined,
    },
    {
      id: 'institute-settings' as NavSection,
      label: 'تعديل الشعار والختم والمسمى',
      icon: Stamp,
      special: true,
      badge: 'هوية المعهد',
    },
    {
      id: 'official-letter' as NavSection,
      label: 'طباعة أي ورقة أو خطاب A4',
      icon: Printer,
      special: true,
      badge: 'محرر A4',
    },
    {
      id: 'supabase-settings' as NavSection,
      label: 'ربط قاعدة بيانات Supabase',
      icon: Database,
      badge: 'SQL/RLS',
      special: true,
    },
  ];

  const handleSelect = (id: NavSection) => {
    onSelectSection(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-stone-900/60 z-40 lg:hidden backdrop-blur-xs"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-20 z-40 h-[calc(100vh-5rem)] w-72 bg-white border-l border-stone-200 flex flex-col transition-transform duration-200 ease-in-out shrink-0 overflow-hidden ${
          isOpenMobile ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-3 border-b border-stone-100 bg-stone-50/70">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
            أقسام النظام الأزهري
          </span>
        </div>

        {/* Scrollable Navigation Items */}
        <nav className="flex-1 overflow-y-auto p-2.5 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all text-right cursor-pointer ${
                  isActive
                    ? 'bg-emerald-800 text-white shadow-xs font-semibold'
                    : item.special
                    ? 'text-stone-700 bg-amber-50/80 hover:bg-amber-100 border border-amber-200/80'
                    : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive
                        ? 'text-amber-300'
                        : item.special
                        ? 'text-amber-700'
                        : 'text-stone-500'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-mono tabular-nums shrink-0 ${
                      isActive
                        ? 'bg-emerald-900 text-amber-200'
                        : item.highlight
                        ? 'bg-emerald-100 text-emerald-800 font-bold'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer info in sidebar */}
        <div className="p-3 border-t border-stone-200 bg-stone-50 text-[11px] text-stone-500 flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-stone-700">معهد عبد الرؤوف</span>
            <span className="font-mono text-[10px] text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
              الإصدار الأزهر 2026
            </span>
          </div>
          <span className="text-[10px] text-stone-400">
            العام الدراسي 1447 - 1448 هـ / 2025 - 2026 م
          </span>
        </div>
      </aside>
    </>
  );
};
