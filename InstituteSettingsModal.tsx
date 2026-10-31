/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Building,
  Upload,
  Image,
  Stamp,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { InstituteSettings } from '../../types';
import {
  getInstituteSettings,
  saveInstituteSettings,
  resetInstituteSettings,
  DEFAULT_INSTITUTE_SETTINGS,
} from '../../lib/instituteSettings';

interface InstituteSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdated: (settings: InstituteSettings) => void;
}

export const InstituteSettingsModal: React.FC<InstituteSettingsModalProps> = ({
  isOpen,
  onClose,
  onUpdated,
}) => {
  const [settings, setSettings] = useState<InstituteSettings>(DEFAULT_INSTITUTE_SETTINGS);
  const [successMsg, setSuccessMsg] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSettings(getInstituteSettings());
      setSuccessMsg(false);
    }
  }, [isOpen]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'logoUrl' | 'sealUrl') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 2 ميجابايت.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSettings(prev => ({
            ...prev,
            [field]: event.target!.result as string,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings.instituteName.trim()) {
      alert('يرجى كتابة اسم المعهد.');
      return;
    }
    saveInstituteSettings(settings);
    onUpdated(settings);
    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
      onClose();
    }, 1200);
  };

  const handleReset = () => {
    if (confirm('هل ترغب في استعادة شعار وختم واسم المعهد الافتراضي؟')) {
      const def = resetInstituteSettings();
      setSettings(def);
      onUpdated(def);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/65 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-stone-200 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden text-right">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-emerald-950 text-white border-b-2 border-amber-600">
          <div className="flex items-center gap-2.5">
            <Building className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-base">
                تعديل وتخصيص هوية المعهد (اللوجو، الختم، والاسم الرسمي)
              </h3>
              <p className="text-xs text-stone-300">
                تنعكس هذه التعديلات فورياً على كافة شاشات النظام، الشهادات، الكشوف، والمطبوعات الرسمية.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-lg flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-bold">تم حفظ وتحديث هوية المعهد واللوجو والختم بنجاح في كامل النظام!</span>
            </div>
          )}

          {/* Section 1: Visual Identity (Logo & Seal) */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-stone-900 border-b border-stone-200 pb-1.5 flex items-center gap-2">
              <Stamp className="w-4 h-4 text-emerald-800" />
              <span>شعار المعهد (اللوجو) والختم الرسمي</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Logo customizer */}
              <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-800">شعار المعهد (اللوجو):</span>
                  <span className="text-[10px] text-stone-500">يظهر في الهيدر والشهادات</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-full border-2 border-amber-500 overflow-hidden bg-white shrink-0 shadow-xs">
                    <img
                      src={settings.logoUrl}
                      alt="معاينة اللوجو"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <label className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white hover:bg-stone-100 border border-stone-300 rounded text-xs font-semibold text-stone-800 cursor-pointer shadow-2xs">
                      <Upload className="w-3.5 h-3.5 text-stone-500" />
                      <span>رفع لوجو من جهازك</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, 'logoUrl')}
                      />
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      value={settings.logoUrl.startsWith('data:') ? 'تم رفع صورة مخصصة' : settings.logoUrl}
                      onChange={(e) => setSettings(prev => ({ ...prev, logoUrl: e.target.value }))}
                      placeholder="أو ضع رابط URL للشعار"
                      className="w-full px-2 py-1 border border-stone-300 rounded text-[11px] font-mono text-left"
                    />
                  </div>
                </div>
              </div>

              {/* Seal customizer */}
              <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-800">الختم الأزهرى المعتمد:</span>
                  <span className="text-[10px] text-stone-500">يظهر على الشهادات والإيصالات</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-full border border-stone-300 overflow-hidden bg-white shrink-0 shadow-xs p-0.5">
                    <img
                      src={settings.sealUrl}
                      alt="معاينة الختم"
                      className="w-full h-full object-contain filter contrast-125"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <label className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white hover:bg-stone-100 border border-stone-300 rounded text-xs font-semibold text-stone-800 cursor-pointer shadow-2xs">
                      <Upload className="w-3.5 h-3.5 text-stone-500" />
                      <span>رفع صورة ختم رسمي</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, 'sealUrl')}
                      />
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      value={settings.sealUrl.startsWith('data:') ? 'تم رفع صورة ختم مخصصة' : settings.sealUrl}
                      onChange={(e) => setSettings(prev => ({ ...prev, sealUrl: e.target.value }))}
                      placeholder="أو ضع رابط URL للختم"
                      className="w-full px-2 py-1 border border-stone-300 rounded text-[11px] font-mono text-left"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Section 2: Institute Name & Administration */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-stone-900 border-b border-stone-200 pb-1.5 flex items-center gap-2">
              <Building className="w-4 h-4 text-emerald-800" />
              <span>البيانات الرسمية للمعهد والمقر</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="block font-bold text-stone-800 mb-1">
                  اسم المعهد الرسمي (كما يظهر في كافة الشهادات والأوراق الرسمية) *
                </label>
                <input
                  type="text"
                  required
                  value={settings.instituteName}
                  onChange={(e) => setSettings(prev => ({ ...prev, instituteName: e.target.value }))}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm font-bold text-emerald-950 focus:outline-hidden focus:border-emerald-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">وصف المراحل</label>
                <input
                  type="text"
                  value={settings.stageDescription}
                  onChange={(e) => setSettings(prev => ({ ...prev, stageDescription: e.target.value }))}
                  className="w-full px-3 py-1.5 border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">القطاع والتبعية</label>
                <input
                  type="text"
                  value={settings.sectorName}
                  onChange={(e) => setSettings(prev => ({ ...prev, sectorName: e.target.value }))}
                  className="w-full px-3 py-1.5 border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">المنطقة الأزهرية</label>
                <input
                  type="text"
                  value={settings.regionName}
                  onChange={(e) => setSettings(prev => ({ ...prev, regionName: e.target.value }))}
                  className="w-full px-3 py-1.5 border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">الإدارة التعليمية</label>
                <input
                  type="text"
                  value={settings.administrationName}
                  onChange={(e) => setSettings(prev => ({ ...prev, administrationName: e.target.value }))}
                  className="w-full px-3 py-1.5 border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">كود المعهد الأزهري</label>
                <input
                  type="text"
                  value={settings.instituteCode}
                  onChange={(e) => setSettings(prev => ({ ...prev, instituteCode: e.target.value }))}
                  className="w-full px-3 py-1.5 font-mono border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">العام الدراسي الحالي</label>
                <input
                  type="text"
                  value={settings.academicYear}
                  onChange={(e) => setSettings(prev => ({ ...prev, academicYear: e.target.value }))}
                  className="w-full px-3 py-1.5 border border-stone-300 rounded-lg"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-stone-700 mb-1">عنوان المعهد ورقم الهاتف</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={settings.address}
                    onChange={(e) => setSettings(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="العنوان"
                    className="w-full px-3 py-1.5 border border-stone-300 rounded-lg"
                  />
                  <input
                    type="text"
                    dir="ltr"
                    value={settings.phone}
                    onChange={(e) => setSettings(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="الهاتف"
                    className="w-full px-3 py-1.5 font-mono border border-stone-300 rounded-lg text-left"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Official Signatures */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-stone-900 border-b border-stone-200 pb-1.5">
              أسماء المسؤولين وتوقيعات الاعتماد (تظهر أسفل الشهادات والإيصالات)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">ناظر المعهد الأزهري</label>
                <input
                  type="text"
                  value={settings.headmasterName}
                  onChange={(e) => setSettings(prev => ({ ...prev, headmasterName: e.target.value }))}
                  className="w-full px-3 py-1.5 border border-stone-300 rounded-lg font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">مدير شؤون الطلاب والوافدين</label>
                <input
                  type="text"
                  value={settings.studentAffairsHead}
                  onChange={(e) => setSettings(prev => ({ ...prev, studentAffairsHead: e.target.value }))}
                  className="w-full px-3 py-1.5 border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">رئيس لجنة النظام والمراقبة (الكنترول)</label>
                <input
                  type="text"
                  value={settings.controlHead}
                  onChange={(e) => setSettings(prev => ({ ...prev, controlHead: e.target.value }))}
                  className="w-full px-3 py-1.5 border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">المسؤول المالي والخزينة</label>
                <input
                  type="text"
                  value={settings.financialHead}
                  onChange={(e) => setSettings(prev => ({ ...prev, financialHead: e.target.value }))}
                  className="w-full px-3 py-1.5 border border-stone-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Modal Footer actions */}
          <div className="flex items-center justify-between pt-4 border-t border-stone-200">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 text-stone-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>استعادة الإعدادات الأصلية</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg font-semibold transition-colors cursor-pointer text-xs"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-bold shadow-xs transition-colors cursor-pointer text-xs"
              >
                حفظ واعتماد التعديلات
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
