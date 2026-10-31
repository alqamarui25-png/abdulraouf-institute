/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Shield, UserPlus, Check, X, Lock, Key } from 'lucide-react';
import { UserProfile, StaffRole } from '../../types';

interface UsersViewProps {
  currentUser: UserProfile | null;
  onOpenLoginModal: () => void;
  onOpenSupabaseModal: () => void;
}

export const UsersView: React.FC<UsersViewProps> = ({
  currentUser,
  onOpenLoginModal,
  onOpenSupabaseModal,
}) => {
  const rolesPermissions = [
    {
      role: 'headmaster' as StaffRole,
      title: 'ناظر المعهد (مدير عام)',
      desc: 'صلاحيات كاملة على كافة أقسام النظام والبيانات والاعتمادات الرسمية وإعدادات Supabase.',
      perms: ['كافة الصلاحيات', 'اعتماد الشهادات A4', 'إدارة المستخدمين', 'ربط Supabase', 'التقارير المالية والكنترول'],
    },
    {
      role: 'student_affairs' as StaffRole,
      title: 'مسؤول شؤون الطلاب والوافدين',
      desc: 'قيد وتعديل بيانات الطلاب، إقامات الوافدين، كشوف المناداة، وحالات القيد والتدرج.',
      perms: ['إضافة وتعديل الطلاب', 'متابعة الوافدين', 'كشوف المناداة', 'التدرج الدراسي'],
    },
    {
      role: 'control' as StaffRole,
      title: 'رئيس لجنة النظام والمراقبة (الكنترول)',
      desc: 'رصد درجات أعمال السنة والتحريري، حساب النسب والترتيب، وطباعة شهادات بيان النجاح.',
      perms: ['رصد الدرجات', 'طباعة الشهادات A4', 'نتائج الامتحانات', 'أوائل الطلاب'],
    },
    {
      role: 'accountant' as StaffRole,
      title: 'المسؤول المالي والخزينة',
      desc: 'تحصيل المصروفات الأزهرية، إصدار الإيصالات الرسمية المعتمدة، ومتابعة الأقساط.',
      perms: ['تحصيل المصروفات', 'طباعة الإيصالات', 'تقارير الخزينة', 'متابعة المتأخرات'],
    },
    {
      role: 'teacher' as StaffRole,
      title: 'معلم أزهري',
      desc: 'تسجيل الحضور والغياب اليومي لطلاب فصوله، ومتابعة الجدول الأسبوعي والمناهج.',
      perms: ['تسجيل الحضور اليومي', 'معاينة الجدول', 'مناهج مواده', 'قوائم فصوله'],
    },
  ];

  const defaultUsers: UserProfile[] = [
    {
      id: 'usr-1',
      email: 'headmaster@abdelraouf-azhar.edu.eg',
      fullName: 'الشيخ د. عبد الحميد رضوان',
      role: 'headmaster',
      phone: '01001234567',
    },
    {
      id: 'usr-2',
      email: 'students@abdelraouf-azhar.edu.eg',
      fullName: 'أ. عادل جاد الحق القاضي',
      role: 'student_affairs',
      phone: '01288990011',
    },
    {
      id: 'usr-3',
      email: 'control@abdelraouf-azhar.edu.eg',
      fullName: 'الشيخ إبراهيم عبد السلام النجار',
      role: 'control',
      phone: '01155667788',
    },
    {
      id: 'usr-4',
      email: 'finance@abdelraouf-azhar.edu.eg',
      fullName: 'أ. فريد شاكر المنياوي',
      role: 'accountant',
      phone: '01011223344',
    },
    {
      id: 'usr-5',
      email: 'm.desouky@abdelraouf-azhar.edu.eg',
      fullName: 'الشيخ مصطفى عثمان الدسوقي',
      role: 'teacher',
      phone: '01112345678',
    },
  ];

  return (
    <div className="space-y-6 text-right">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-800" />
            <h2 className="text-lg font-bold text-stone-900">
              إدارة المستخدمين والصلاحيات والأدوار (RBAC)
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            تنظيم صلاحيات الوصول لنظام معهد عبد الرؤوف الأزهري وفق هيكلية قطاع المعاهد الأزهرية المعتمدة.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenLoginModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>تسجيل حساب موظف جديد</span>
          </button>
        </div>
      </div>

      {/* Current Active Session */}
      <div className="bg-emerald-900 text-white p-5 rounded-xl border border-emerald-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] text-amber-300 font-bold block mb-1">
            الجلسة الحالية النشطة
          </span>
          <h3 className="text-base font-bold">
            {currentUser?.fullName || 'ناظر المعهد الأزهري'}
          </h3>
          <p className="text-xs text-emerald-100 mt-0.5 font-mono">
            البريد: {currentUser?.email || 'admin@abdelraouf-azhar.edu.eg'} · الدور: {currentUser?.role || 'headmaster'}
          </p>
        </div>

        <button
          onClick={onOpenSupabaseModal}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold rounded-lg transition-colors cursor-pointer shrink-0"
        >
          فحص أمان سياسات Supabase RLS
        </button>
      </div>

      {/* Role Definitions Matrix */}
      <div className="space-y-3">
        <h3 className="font-bold text-sm text-stone-900">
          مستويات الصلاحيات والأدوار الإدارية بالمعهد:
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rolesPermissions.map((rp) => (
            <div
              key={rp.role}
              className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-3"
            >
              <div>
                <span className="text-xs font-bold text-emerald-900 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                  {rp.title}
                </span>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  {rp.desc}
                </p>
              </div>

              <div className="border-t border-stone-100 pt-2.5 space-y-1">
                <span className="text-[10px] font-bold text-stone-400 block mb-1">
                  الصلاحيات المخولة:
                </span>
                {rp.perms.map((p, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs text-stone-700">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active System Accounts Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-stone-200 bg-stone-50">
          <h3 className="font-bold text-sm text-stone-900">
            حسابات مسؤولي النظام المعتمدة (Supabase Auth / Profiles)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right divide-y divide-stone-200">
            <thead className="bg-stone-50 text-stone-700 font-bold text-[11px]">
              <tr>
                <th className="py-3 px-4">الموظف / المسؤول</th>
                <th className="py-3 px-3">البريد الإلكتروني</th>
                <th className="py-3 px-3">الدور الإداري</th>
                <th className="py-3 px-3">رقم الهاتف</th>
                <th className="py-3 px-3">حالة الحساب</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {defaultUsers.map((u) => (
                <tr key={u.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-3 px-4 font-semibold text-stone-900">
                    {u.fullName}
                  </td>
                  <td className="py-3 px-3 font-mono text-stone-600" dir="ltr">
                    {u.email}
                  </td>
                  <td className="py-3 px-3">
                    <span className="bg-stone-100 text-stone-800 px-2 py-0.5 rounded text-[11px] font-medium">
                      {rolesPermissions.find(r => r.role === u.role)?.title || u.role}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-stone-600" dir="ltr">
                    {u.phone}
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-bold text-[10px]">
                      نشط ومفعل
                    </span>
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
