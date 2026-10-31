/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Database,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  RefreshCw,
  UploadCloud,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import {
  getSupabaseConfig,
  saveCustomSupabaseConfig,
  clearCustomSupabaseConfig,
  testSupabaseConnection,
  ConnectionTestResult,
} from '../../lib/supabaseClient';
import { uploadLocalDataToSupabase } from '../../lib/supabaseService';

interface SupabaseSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectionUpdated?: () => void;
}

export const SupabaseSettingsModal: React.FC<SupabaseSettingsModalProps> = ({
  isOpen,
  onClose,
  onConnectionUpdated,
}) => {
  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [configSource, setConfigSource] = useState<'env' | 'custom' | 'none'>('none');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<ConnectionTestResult | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'connection' | 'schema'>('connection');
  const [copiedSchema, setCopiedSchema] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const cfg = getSupabaseConfig();
      setUrl(cfg.url);
      setAnonKey(cfg.anonKey);
      setConfigSource(cfg.source);
      handleTestConnection();
    }
  }, [isOpen]);

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await testSupabaseConnection();
      setTestResult(res);
      if (onConnectionUpdated) onConnectionUpdated();
    } catch (err: any) {
      setTestResult({
        ok: false,
        message: err?.message || 'حدث خطأ أثناء فحص الاتصال',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveCredentials = () => {
    if (!url.trim() || !anonKey.trim()) {
      alert('يرجى ملء حقلي الرابط والمفتاح العام (Anon Key).');
      return;
    }
    if (anonKey.includes('service_role')) {
      alert('تحذير أمني خطير: لا تضع مفتاح service_role في المتصفح! استخدم فقط مفتاح anon العام.');
      return;
    }
    saveCustomSupabaseConfig(url, anonKey);
    setConfigSource('custom');
    handleTestConnection();
  };

  const handleResetToEnv = () => {
    clearCustomSupabaseConfig();
    const cfg = getSupabaseConfig();
    setUrl(cfg.url);
    setAnonKey(cfg.anonKey);
    setConfigSource(cfg.source);
    handleTestConnection();
  };

  const handleSyncData = async () => {
    setIsSyncing(true);
    setSyncStatus(null);
    const result = await uploadLocalDataToSupabase();
    setIsSyncing(false);
    if (result.ok) {
      setSyncStatus(`تمت مزامنة ورفع ${result.count} سجل طلاب إلى قاعدة بيانات Supabase بنجاح!`);
    } else {
      setSyncStatus(`فشلت المزامنة: ${result.error}`);
    }
  };

  const sampleSqlSchema = `-- معهد عبد الرؤوف الأزهري (بنين)
-- نفّذ هذا الكود في Supabase SQL Editor:

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_code TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    national_id TEXT NOT NULL,
    birth_date DATE NOT NULL,
    birth_place TEXT NOT NULL,
    stage TEXT NOT NULL,
    grade TEXT NOT NULL,
    track TEXT DEFAULT 'general',
    class_name TEXT NOT NULL,
    is_international BOOLEAN DEFAULT FALSE,
    nationality TEXT DEFAULT 'مصري',
    passport_number TEXT,
    residence_number TEXT,
    residence_expiry DATE,
    madhhab TEXT,
    native_language TEXT DEFAULT 'العربية',
    embassy_contact TEXT,
    guardian_name TEXT NOT NULL,
    guardian_relation TEXT NOT NULL,
    guardian_phone TEXT NOT NULL,
    guardian_job TEXT,
    address TEXT NOT NULL,
    governorate TEXT NOT NULL,
    enrollment_date DATE DEFAULT CURRENT_DATE,
    status TEXT DEFAULT 'active',
    photo_url TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read students" ON public.students FOR SELECT USING (true);
CREATE POLICY "Allow authenticated manage students" ON public.students FOR ALL USING (true);`;

  const handleCopySchema = () => {
    navigator.clipboard.writeText(sampleSqlSchema);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl border border-stone-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden text-right">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-emerald-900 text-white">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-amber-300" />
            <div>
              <h3 className="font-bold text-base">إعدادات الاتصال بقاعدة بيانات Supabase</h3>
              <p className="text-xs text-emerald-200">
                معهد عبد الرؤوف الإعدادي والثانوي الأزهري (بنين)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-stone-200 bg-stone-50 px-6 pt-2">
          <button
            onClick={() => setActiveTab('connection')}
            className={`pb-2 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'connection'
                ? 'border-emerald-800 text-emerald-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            حالة الاتصال والبيانات
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`pb-2 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'schema'
                ? 'border-emerald-800 text-emerald-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            كود مخطط الجداول (SQL Schema)
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {activeTab === 'connection' ? (
            <>
              {/* Security Guideline Notice */}
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold">ضوابط أمان Supabase:</span>
                  <p className="text-amber-800 leading-relaxed">
                    يستخدم هذا التطبيق حصرياً المفتاح العام <strong>Anon / Publishable Key</strong> المقترن بسياسات الحماية RLS، ولا يستخدم مفتاح service_role مطلقاً داخل المتصفح لضمان أمان البيانات وفق المتطلبات.
                  </p>
                </div>
              </div>

              {/* Live Connection Test Banner */}
              <div className="border border-stone-200 rounded-lg p-4 bg-stone-50/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-800">
                    نتيجة الفحص الفعلي للاتصال:
                  </span>
                  <button
                    onClick={handleTestConnection}
                    disabled={isTesting}
                    className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-stone-100 border border-stone-300 rounded text-xs text-stone-700 font-medium transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                    <span>{isTesting ? 'جارٍ الفحص...' : 'إعادة اختبار الاتصال'}</span>
                  </button>
                </div>

                {testResult ? (
                  <div
                    className={`p-3 rounded-lg text-xs flex items-start gap-2.5 ${
                      testResult.ok
                        ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                        : 'bg-rose-50 text-rose-900 border border-rose-200'
                    }`}
                  >
                    {testResult.ok ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className="font-semibold">{testResult.message}</span>
                      {testResult.latencyMs !== undefined && (
                        <div className="text-[11px] opacity-80 mt-1 font-mono">
                          زمن الاستجابة: {testResult.latencyMs}ms
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-stone-500 py-2">
                    اضغط على زر إعادة اختبار الاتصال للتحقق الفعلي من خوادم Supabase.
                  </div>
                )}
              </div>

              {/* Credentials Form */}
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-800">
                    رابط مشروع Supabase (Project URL):
                  </label>
                  <span className="text-[11px] text-stone-500">
                    المصدر الحالي: {configSource === 'env' ? 'متغيرات البيئة (.env)' : configSource === 'custom' ? 'إعداد يدوي مخصص' : 'غير معين'}
                  </span>
                </div>
                <input
                  type="text"
                  dir="ltr"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://xyzcompany.supabase.co"
                  className="w-full px-3 py-2 text-xs font-mono border border-stone-300 rounded-lg focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />

                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-800">
                    المفتاح العام (Anon / Publishable API Key):
                  </label>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    مفتاح عام آمن للمتصفح
                  </span>
                </div>
                <input
                  type="password"
                  dir="ltr"
                  value={anonKey}
                  onChange={(e) => setAnonKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="w-full px-3 py-2 text-xs font-mono border border-stone-300 rounded-lg focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={handleSaveCredentials}
                    className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    حفظ واختبار بيانات الاتصال
                  </button>

                  {configSource === 'custom' && (
                    <button
                      onClick={handleResetToEnv}
                      className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
                    >
                      استعادة الإعداد من ملف .env
                    </button>
                  )}
                </div>
              </div>

              {/* Sync Section */}
              <div className="border-t border-stone-200 pt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-stone-800">
                      مزامنة البيانات الحالية مع Supabase
                    </h4>
                    <p className="text-[11px] text-stone-500">
                      رفع بيانات معهد عبد الرؤوف إلى جداول Supabase الخاصة بك بنقرة واحدة.
                    </p>
                  </div>
                  <button
                    onClick={handleSyncData}
                    disabled={isSyncing || !testResult?.ok}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer disabled:opacity-40"
                  >
                    <UploadCloud className={`w-3.5 h-3.5 ${isSyncing ? 'animate-bounce' : ''}`} />
                    <span>{isSyncing ? 'جارٍ الرفع...' : 'رفع البيانات لـ Supabase'}</span>
                  </button>
                </div>

                {syncStatus && (
                  <div className="p-2.5 bg-stone-100 rounded text-xs text-stone-800 font-medium mt-2">
                    {syncStatus}
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Schema Tab */
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-stone-800">
                    مخطط الجداول وسياسات الحماية (SQL Editor):
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    انسخ هذا الكود والصقه في نافذة SQL Editor داخل لوحة تحكم Supabase لإنشاء كافة جداول معهد عبد الرؤوف.
                  </p>
                </div>
                <button
                  onClick={handleCopySchema}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
                >
                  {copiedSchema ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSchema ? 'تم النسخ!' : 'نسخ كود SQL'}</span>
                </button>
              </div>

              <pre className="p-3 bg-stone-900 text-emerald-300 rounded-lg text-[11px] font-mono overflow-x-auto max-h-72 leading-relaxed" dir="ltr">
                {sampleSqlSchema}
              </pre>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
          <span className="text-[11px] text-stone-500">
            معهد عبد الرؤوف الإعدادي والثانوي الأزهري (بنين)
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            إغلاق النافذة
          </button>
        </div>

      </div>
    </div>
  );
};
