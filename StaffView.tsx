/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Briefcase, Plus, Search, Phone, Mail, BookOpen, Shield, Trash2, Edit2, Printer } from 'lucide-react';
import { StaffMember, StaffRole } from '../../types';

interface StaffViewProps {
  staff: StaffMember[];
  onSaveStaff: (member: Partial<StaffMember>) => Promise<void>;
  onDeleteStaff: (id: string) => Promise<void>;
}

export const StaffView: React.FC<StaffViewProps> = ({
  staff,
  onSaveStaff,
  onDeleteStaff,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [role, setRole] = useState<StaffRole>('teacher');
  const [specialization, setSpecialization] = useState('فقه شافعي وقرآن كريم');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [qualification, setQualification] = useState('ليسانس كلية الشريعة والقانون');
  const [weeklyQuota, setWeeklyQuota] = useState(18);

  const getRoleBadge = (r: StaffRole) => {
    switch (r) {
      case 'headmaster': return { label: 'ناظر المعهد', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
      case 'student_affairs': return { label: 'شؤون الطلاب', color: 'bg-blue-100 text-blue-900 border-blue-300' };
      case 'control': return { label: 'رئيس الكنترول', color: 'bg-purple-100 text-purple-900 border-purple-300' };
      case 'accountant': return { label: 'الخزينة والحسابات', color: 'bg-amber-100 text-amber-900 border-amber-300' };
      default: return { label: 'معلم أزهري', color: 'bg-stone-100 text-stone-800 border-stone-200' };
    }
  };

  const filteredStaff = staff.filter(s => {
    if (roleFilter !== 'all' && s.role !== roleFilter) return false;
    if (searchTerm && !s.name.includes(searchTerm) && !s.specialization.includes(searchTerm)) return false;
    return true;
  });

  const handleOpenAdd = () => {
    setEditingStaff(null);
    setName('');
    setNationalId('');
    setRole('teacher');
    setSpecialization('فقه وقرآن كريم');
    setPhone('');
    setEmail('');
    setQualification('ليسانس جامعة الأزهر');
    setWeeklyQuota(18);
    setShowAddModal(true);
  };

  const handleOpenEdit = (m: StaffMember) => {
    setEditingStaff(m);
    setName(m.name);
    setNationalId(m.nationalId);
    setRole(m.role);
    setSpecialization(m.specialization);
    setPhone(m.phone);
    setEmail(m.email);
    setQualification(m.qualification);
    setWeeklyQuota(m.weeklyQuota);
    setShowAddModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveStaff({
      ...(editingStaff ? { id: editingStaff.id, staffCode: editingStaff.staffCode } : {}),
      name,
      nationalId,
      role,
      specialization,
      phone,
      email,
      qualification,
      weeklyQuota: Number(weeklyQuota),
      stage: 'both',
      status: 'active',
    });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 text-right">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-emerald-800" />
            <h2 className="text-lg font-bold text-stone-900">
              هيئة التدريس والموظفون بمعهد عبد الرؤوف الأزهري
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            إدارة المشايخ والأساتذة، التخصصات الشرعية والعربية والعلمية، النصاب الأسبوعي للحصص، والمسؤوليات الإدارية.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg border border-stone-300 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-stone-600" />
            <span>طباعة كشف المعلمين A4</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة مدرس / موظف</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="بحث بالاسم أو التخصص..."
            className="w-full px-3 py-2 pr-8 border border-stone-300 rounded-lg text-xs"
          />
          <Search className="w-4 h-4 text-stone-400 absolute right-2.5 top-2.5" />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 border border-stone-300 rounded-lg bg-white"
          >
            <option value="all">كافة الأدوار الإدارية والتعليمية</option>
            <option value="headmaster">ناظر المعهد</option>
            <option value="teacher">معلمون</option>
            <option value="control">الكنترول والامتحانات</option>
            <option value="student_affairs">شؤون الطلاب</option>
            <option value="accountant">الخزينة والحسابات</option>
          </select>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStaff.map((member) => {
          const badge = getRoleBadge(member.role);
          return (
            <div
              key={member.id}
              className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-3 relative hover:border-emerald-600 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded border ${badge.color}`}>
                    {badge.label}
                  </span>
                  <h3 className="font-bold text-sm text-stone-900 mt-1.5">{member.name}</h3>
                  <span className="text-[11px] text-emerald-800 font-semibold block">
                    {member.specialization}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(member)}
                    className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  {member.role !== 'headmaster' && (
                    <button
                      onClick={() => {
                        if (confirm(`هل أنت متأكد من حذف ${member.name}؟`)) {
                          onDeleteStaff(member.id);
                        }
                      }}
                      className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-stone-600 border-t border-stone-100 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">المؤهل:</span>
                  <span className="font-medium text-stone-800">{member.qualification}</span>
                </div>
                <div className="flex items-center justify-between font-mono">
                  <span className="text-stone-400 font-sans">الهاتف:</span>
                  <span className="text-stone-700" dir="ltr">{member.phone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">النصاب الأسبوعي:</span>
                  <span className="font-mono font-bold text-stone-900">{member.weeklyQuota} حصة</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-stone-400">تاريخ التعيين:</span>
                  <span className="font-mono text-stone-500">{member.hiringDate}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-stone-200 w-full max-w-lg p-6 space-y-4 text-right text-xs">
            <h3 className="font-bold text-sm text-stone-900 border-b border-stone-200 pb-2">
              {editingStaff ? 'تعديل بيانات عضو هيئة التدريس' : 'إضافة مدرس أو موظف جديد'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block font-bold text-stone-800 mb-1">الاسم الكامل *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: الشيخ مصطفى عثمان"
                  className="w-full px-3 py-1.5 border border-stone-300 rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-800 mb-1">الدور والمسؤولية *</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as StaffRole)}
                    className="w-full px-3 py-1.5 border border-stone-300 rounded bg-white"
                  >
                    <option value="teacher">معلم أزهري</option>
                    <option value="headmaster">ناظر المعهد</option>
                    <option value="control">مسؤول الكنترول والامتحانات</option>
                    <option value="student_affairs">مسؤول شؤون الطلاب</option>
                    <option value="accountant">مسؤول الخزينة والحسابات</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-800 mb-1">التخصص أو المادة *</label>
                  <input
                    type="text"
                    required
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    placeholder="فقه شافعي / نحو وصرف / رياضيات..."
                    className="w-full px-3 py-1.5 border border-stone-300 rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-800 mb-1">الرقم القومي</label>
                  <input
                    type="text"
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value)}
                    placeholder="14 رقماً"
                    className="w-full px-3 py-1.5 border border-stone-300 rounded font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-800 mb-1">رقم الهاتف</label>
                  <input
                    type="tel"
                    dir="ltr"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01xxxxxxxxx"
                    className="w-full px-3 py-1.5 border border-stone-300 rounded font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-800 mb-1">المؤهل الدراسي</label>
                  <input
                    type="text"
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    placeholder="ليسانس أصول دين..."
                    className="w-full px-3 py-1.5 border border-stone-300 rounded"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-800 mb-1">النصاب الأسبوعي (حصص)</label>
                  <input
                    type="number"
                    value={weeklyQuota}
                    onChange={(e) => setWeeklyQuota(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-stone-300 rounded font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-1.5 bg-stone-100 hover:bg-stone-200 rounded font-semibold text-stone-700 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded font-bold cursor-pointer"
                >
                  حفظ البيانات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
