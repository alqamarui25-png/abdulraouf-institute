/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Database, LogOut, User, CheckCircle2, AlertTriangle, Stamp, Printer, Building } from 'lucide-react';
import { UserProfile, InstituteSettings } from '../types';

interface HeaderProps {
  currentUser: UserProfile | null;
  supabaseStatus: { ok: boolean; message: string; hasTables?: boolean } | null;
  instituteSettings: InstituteSettings;
  onOpenSupabaseModal: () => void;
  onOpenInstituteSettingsModal: () => void;
  onOpenOfficialLetterModal: () => void;
  onOpenLoginModal: () => void;
  onLogout: () => void;
  currentSectionTitle: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  supabaseStatus,
  instituteSettings,
  onOpenSupabaseModal,
  onOpenInstituteSettingsModal,
  onOpenOfficialLetterModal,
  onOpenLoginModal,
  onLogout,
  currentSectionTitle,
}) => {
  // Current date in Arabic
  const today = new Intl.DateTimeFormat('ar-EG', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case 'headmaster': return 'ناظر المعهد (مدير عام)';
      case 'student_affairs': return 'مسؤول شؤون الطلاب';
      case 'control': return 'رئيس الكنترول والامتحانات';
      case 'accountant': return 'المسؤول المالي والخزينة';
      case 'teacher': return 'معلم أزهري';
      default: return 'مستخدم النظام';
    }
  };

  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Zone 1: Dynamic Brand, Logo & Customization */}
          <div className="flex items-center gap-3.5 shrink-0">
            <div
              onClick={onOpenInstituteSettingsModal}
              title="انقر لتعديل اللوجو والشعار والختم واسم المعهد"
              className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-amber-500 shadow-sm shrink-0 bg-stone-100 cursor-pointer group"
            >
              <img
                src={instituteSettings.logoUrl}
                alt={instituteSettings.instituteName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <Stamp className="w-4 h-4 text-amber-300" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-emerald-800 tracking-wide">
                  {instituteSettings.sectorName}
                </span>
                <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                <span className="hidden sm:inline-block text-xs text-stone-500">
                  {instituteSettings.regionName}
                </span>
              </div>
              <h1 className="text-lg md:text-xl font-bold text-stone-900 leading-tight">
                {instituteSettings.instituteName}
              </h1>
            </div>
          </div>

          {/* Zone 2: Section Breadcrumb & Date */}
          <div className="hidden xl:flex flex-col items-center justify-center text-center">
            <span className="text-xs text-stone-500">{today}</span>
            <span className="text-sm font-semibold text-emerald-950 mt-0.5">
              {currentSectionTitle}
            </span>
          </div>

          {/* Zone 3: Quick Print + Customize Logo/Seal + Supabase Status + User */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Quick Print Any Document / Letter Button */}
            <button
              onClick={onOpenOfficialLetterModal}
              title="طباعة أي ورقة أو خطاب رسمي أو إفادة قيد A4"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-850 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-amber-300" />
              <span>طباعة ورقة رسمية A4</span>
            </button>

            {/* Customize Logo & Seal Button */}
            <button
              onClick={onOpenInstituteSettingsModal}
              title="تعديل الشعار والختم واسم المعهد"
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold border border-stone-300 transition-colors cursor-pointer"
            >
              <Stamp className="w-3.5 h-3.5 text-amber-700" />
              <span className="hidden sm:inline">تعديل اللوجو والختم</span>
            </button>

            {/* Supabase Connection Indicator Button */}
            <button
              onClick={onOpenSupabaseModal}
              title="إعدادات واختبار الاتصال بقاعدة بيانات Supabase"
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                supabaseStatus?.ok
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Supabase:</span>
              <span className="font-semibold hidden sm:inline">
                {supabaseStatus?.ok ? 'متصل ومفحوص' : 'تجهيز الربط'}
              </span>
              {supabaseStatus?.ok ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              )}
            </button>

            {/* User Profile or Login */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <div className="hidden md:flex flex-col text-left">
                  <span className="text-xs font-bold text-stone-800 truncate max-w-[130px]">
                    {currentUser.fullName}
                  </span>
                  <span className="text-[10px] text-stone-500">
                    {getRoleLabel(currentUser.role)}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-emerald-800 text-amber-300 flex items-center justify-center font-bold text-sm shadow-xs border border-emerald-900">
                  {currentUser.fullName.charAt(0) || 'أ'}
                </div>
                <button
                  onClick={onLogout}
                  title="تسجيل الخروج"
                  className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLoginModal}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-medium rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>تسجيل الدخول</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
