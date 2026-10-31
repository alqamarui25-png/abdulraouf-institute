/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Lock, Mail, User, Shield, CheckCircle2, AlertCircle } from 'lucide-react';
import { authService } from '../../lib/supabaseService';
import { StaffRole, UserProfile } from '../../types';
import emblemImg from '../../assets/images/institute_emblem_1793449692786.jpg';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  onOpenSupabaseSettings: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onOpenSupabaseSettings,
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<StaffRole>('teacher');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      if (isSignUp) {
        if (!fullName.trim()) {
          setErrorMsg('يرجى إدخال الاسم كاملاً');
          setLoading(false);
          return;
        }
        const res = await authService.signUp(email, password, fullName, role);
        if (res.error) {
          setErrorMsg(res.error);
        } else if (res.user) {
          onLoginSuccess(res.user);
          onClose();
        }
      } else {
        const res = await authService.signInWithPassword(email, password);
        if (res.error) {
          setErrorMsg(res.error);
        } else if (res.user) {
          onLoginSuccess(res.user);
          onClose();
        }
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'حدث خطأ غير متوقع أثناء تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  // Quick preset accounts for demonstration / easy testing
  const handleQuickLogin = (demoEmail: string, demoName: string, demoRole: StaffRole) => {
    const user: UserProfile = {
      id: 'demo-' + demoRole,
      email: demoEmail,
      fullName: demoName,
      role: demoRole,
    };
    localStorage.setItem('abdelraouf_current_user', JSON.stringify(user));
    onLoginSuccess(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/65 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-stone-200 w-full max-w-md overflow-hidden text-right">
        
        {/* Header */}
        <div className="bg-emerald-950 p-6 text-white text-center relative border-b-2 border-amber-600">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-1 text-emerald-300 hover:text-white rounded-lg hover:bg-emerald-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 mx-auto rounded-full border-2 border-amber-500 overflow-hidden shadow-xs mb-2">
            <img src={emblemImg} alt="" className="w-full h-full object-cover" />
          </div>

          <h3 className="text-base font-bold text-amber-200">
            معهد عبد الرؤوف الإعدادي والثانوي الأزهري
          </h3>
          <p className="text-xs text-stone-300 mt-0.5">
            بوابة تسجيل دخول الكادر التعليمي والإداري (Supabase Auth)
          </p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {isSignUp && (
              <>
                <div>
                  <label className="block font-bold text-stone-800 mb-1">الاسم الكامل *</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="مثال: الشيخ مصطفى عثمان"
                      className="w-full px-3 py-2 pr-8 border border-stone-300 rounded-lg focus:outline-hidden focus:border-emerald-700"
                    />
                    <User className="w-4 h-4 text-stone-400 absolute right-2.5 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-800 mb-1">الصفة والصلاحية *</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as StaffRole)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white"
                  >
                    <option value="headmaster">ناظر المعهد (مدير عام)</option>
                    <option value="student_affairs">مسؤول شؤون الطلاب</option>
                    <option value="control">مسؤول الكنترول والامتحانات</option>
                    <option value="accountant">المسؤول المالي والخزينة</option>
                    <option value="teacher">معلم أزهري</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block font-bold text-stone-800 mb-1">البريد الإلكتروني *</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  dir="ltr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@abdelraouf-azhar.edu.eg"
                  className="w-full px-3 py-2 pr-8 border border-stone-300 rounded-lg focus:outline-hidden focus:border-emerald-700 text-left font-mono"
                />
                <Mail className="w-4 h-4 text-stone-400 absolute right-2.5 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block font-bold text-stone-800 mb-1">كلمة المرور *</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  dir="ltr"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 pr-8 border border-stone-300 rounded-lg focus:outline-hidden focus:border-emerald-700 text-left font-mono"
                />
                <Lock className="w-4 h-4 text-stone-400 absolute right-2.5 top-2.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg shadow-sm transition-colors cursor-pointer disabled:opacity-50 mt-2"
            >
              {loading ? 'جارٍ التحقق...' : isSignUp ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
            </button>
          </form>

          {/* Switch Login / SignUp */}
          <div className="text-center pt-1">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setErrorMsg(null);
              }}
              className="text-emerald-800 hover:underline font-semibold cursor-pointer"
            >
              {isSignUp
                ? 'لديك حساب بالفعل؟ تسجيل الدخول'
                : 'ليس لديك حساب بعد؟ إنشاء حساب جديد'}
            </button>
          </div>

          {/* Quick Access Roles */}
          <div className="border-t border-stone-200 pt-3">
            <span className="block text-[11px] text-stone-500 font-bold mb-2">
              دخول سريع حسب الأدوار الإدارية (للتجربة الفورية):
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button
                onClick={() => handleQuickLogin('director@azhar.eg', 'الشيخ د. عبد الحميد رضوان', 'headmaster')}
                className="p-1.5 bg-stone-50 hover:bg-emerald-50 border border-stone-200 hover:border-emerald-300 rounded text-stone-700 text-right cursor-pointer"
              >
                <strong>ناظر المعهد</strong>
                <span className="block text-[10px] text-stone-500">صلاحيات كاملة</span>
              </button>
              <button
                onClick={() => handleQuickLogin('students@azhar.eg', 'أ. عادل جاد الحق القاضي', 'student_affairs')}
                className="p-1.5 bg-stone-50 hover:bg-emerald-50 border border-stone-200 hover:border-emerald-300 rounded text-stone-700 text-right cursor-pointer"
              >
                <strong>شؤون الطلاب</strong>
                <span className="block text-[10px] text-stone-500">قيد وتعديل</span>
              </button>
              <button
                onClick={() => handleQuickLogin('control@azhar.eg', 'الشيخ إبراهيم النجار', 'control')}
                className="p-1.5 bg-stone-50 hover:bg-emerald-50 border border-stone-200 hover:border-emerald-300 rounded text-stone-700 text-right cursor-pointer"
              >
                <strong>الكنترول</strong>
                <span className="block text-[10px] text-stone-500">رصد وشهادات</span>
              </button>
              <button
                onClick={() => handleQuickLogin('finance@azhar.eg', 'أ. فريد شاكر المنياوي', 'accountant')}
                className="p-1.5 bg-stone-50 hover:bg-emerald-50 border border-stone-200 hover:border-emerald-300 rounded text-stone-700 text-right cursor-pointer"
              >
                <strong>الخزينة</strong>
                <span className="block text-[10px] text-stone-500">مصروفات وإيصالات</span>
              </button>
            </div>
          </div>

          <div className="text-center pt-2 border-t border-stone-200">
            <button
              onClick={() => {
                onClose();
                onOpenSupabaseSettings();
              }}
              className="text-[11px] text-stone-500 hover:text-emerald-800 transition-colors cursor-pointer"
            >
              فحص إعدادات Supabase وتفعيل RLS
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
