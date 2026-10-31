/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Receipt, Plus, Search, Printer, CheckCircle2, AlertTriangle, CreditCard, DollarSign } from 'lucide-react';
import { Student, FeeRecord } from '../../types';

interface FeesViewProps {
  students: Student[];
  fees: FeeRecord[];
  onSaveFee: (fee: Partial<FeeRecord>) => Promise<void>;
  onPrintReceipt: (fee: FeeRecord) => void;
}

export const FeesView: React.FC<FeesViewProps> = ({
  students,
  fees,
  onSaveFee,
  onPrintReceipt,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [targetStudentId, setTargetStudentId] = useState<string>(students[0]?.id || '');
  const [feeType, setFeeType] = useState<FeeRecord['feeType']>('مصروفات دراسية');
  const [amount, setAmount] = useState(1250);
  const [paidAmount, setPaidAmount] = useState(1250);
  const [paymentMethod, setPaymentMethod] = useState<FeeRecord['paymentMethod']>('نقدي');
  const [notes, setNotes] = useState('');

  const filteredFees = fees.filter(f => {
    if (statusFilter !== 'all' && f.status !== statusFilter) return false;
    if (searchTerm && !f.studentName.includes(searchTerm) && !f.receiptNumber.includes(searchTerm)) return false;
    return true;
  });

  const totalDue = fees.reduce((acc, f) => acc + f.amount, 0);
  const totalPaid = fees.reduce((acc, f) => acc + f.paidAmount, 0);
  const totalRemaining = fees.reduce((acc, f) => acc + f.remainingAmount, 0);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find(s => s.id === targetStudentId);
    if (!st) return;

    await onSaveFee({
      studentId: st.id,
      studentName: st.fullName,
      grade: st.grade,
      schoolYear: '2025/2026',
      feeType,
      amount: Number(amount),
      paidAmount: Number(paidAmount),
      paymentMethod,
      notes,
    });

    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 text-right">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-emerald-800" />
            <h2 className="text-lg font-bold text-stone-900">
              الشؤون المالية والخزينة والمصروفات الأزهرية
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            إدارة تحصيل المصروفات الدراسية، الكتب، أنشطة رعاية الوافدين، وإصدار إيصالات السداد المعتمدة.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-lg border border-stone-300 transition-colors cursor-pointer"
            title="طباعة كشف الخزينة والمصروفات A4"
          >
            <Printer className="w-4 h-4 text-emerald-800" />
            <span>طباعة كشف الخزينة A4</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>تحصيل وإصدار إيصال جديد</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <span className="text-xs text-stone-500 block">إجمالي المبالغ المستحقة</span>
          <strong className="text-2xl font-bold font-mono text-stone-900 tabular-nums block mt-1">
            {totalDue.toLocaleString()} ج.م
          </strong>
          <span className="text-[11px] text-stone-400 mt-0.5 block">العام الدراسي 2025/2026</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-2xs bg-emerald-50/20">
          <span className="text-xs text-emerald-900 font-semibold block">المبالغ المحصلة فعلياً</span>
          <strong className="text-2xl font-bold font-mono text-emerald-950 tabular-nums block mt-1">
            {totalPaid.toLocaleString()} ج.م
          </strong>
          <span className="text-[11px] text-emerald-700 mt-0.5 block font-mono">
            نسبة التحصيل: {totalDue > 0 ? Math.round((totalPaid / totalDue) * 100) : 100}%
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <span className="text-xs text-rose-700 font-semibold block">المتبقي قيد السداد</span>
          <strong className="text-2xl font-bold font-mono text-rose-700 tabular-nums block mt-1">
            {totalRemaining.toLocaleString()} ج.م
          </strong>
          <span className="text-[11px] text-stone-400 mt-0.5 block">أقساط مستحقة</span>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="بحث باسم الطالب أو رقم الإيصال..."
            className="w-full px-3 py-2 pr-8 border border-stone-300 rounded-lg text-xs"
          />
          <Search className="w-4 h-4 text-stone-400 absolute right-2.5 top-2.5" />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-stone-300 rounded-lg bg-white"
          >
            <option value="all">كافة حالات السداد</option>
            <option value="paid">مسدد بالكامل</option>
            <option value="partial">سداد جزئي (قسط أول)</option>
            <option value="unpaid">غير مسدد</option>
          </select>
        </div>
      </div>

      {/* Fees Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right divide-y divide-stone-200">
            <thead className="bg-stone-50 text-stone-700 font-bold text-[11px]">
              <tr>
                <th className="py-3 px-4">رقم الإيصال</th>
                <th className="py-3 px-4">اسم الطالب</th>
                <th className="py-3 px-3">بند المصروفات</th>
                <th className="py-3 px-3 font-mono">المبلغ المطلوب</th>
                <th className="py-3 px-3 font-mono">المسدد</th>
                <th className="py-3 px-3 font-mono">المتبقي</th>
                <th className="py-3 px-3">تاريخ الدفع</th>
                <th className="py-3 px-3">حالة السداد</th>
                <th className="py-3 px-4 text-center">طباعة الإيصال</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredFees.map((fee) => (
                <tr key={fee.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-emerald-950">
                    {fee.receiptNumber}
                  </td>
                  <td className="py-3 px-4 font-semibold text-stone-900">
                    {fee.studentName}
                  </td>
                  <td className="py-3 px-3 text-stone-700">
                    {fee.feeType}
                  </td>
                  <td className="py-3 px-3 font-mono text-stone-900">
                    {fee.amount} ج.م
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-emerald-950">
                    {fee.paidAmount} ج.م
                  </td>
                  <td className="py-3 px-3 font-mono text-rose-700">
                    {fee.remainingAmount > 0 ? `${fee.remainingAmount} ج.م` : '-'}
                  </td>
                  <td className="py-3 px-3 font-mono text-stone-500">
                    {fee.paymentDate}
                  </td>
                  <td className="py-3 px-3">
                    {fee.status === 'paid' ? (
                      <span className="text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-bold text-[10px]">
                        مسدد بالكامل
                      </span>
                    ) : (
                      <span className="text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-bold text-[10px]">
                        سداد جزئي
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => onPrintReceipt(fee)}
                      className="px-2.5 py-1 bg-stone-100 hover:bg-emerald-50 hover:text-emerald-900 rounded font-semibold transition-colors cursor-pointer text-[11px] inline-flex items-center gap-1"
                    >
                      <Printer className="w-3 h-3" />
                      <span>إيصال معتمد</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Fee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-stone-200 w-full max-w-md p-6 space-y-4 text-right text-xs">
            <h3 className="font-bold text-sm text-stone-900 border-b border-stone-200 pb-2">
              تحصيل مالي وإصدار إيصال خزينة معتمد
            </h3>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="block font-bold text-stone-800 mb-1">اسم الطالب *</label>
                <select
                  value={targetStudentId}
                  onChange={(e) => setTargetStudentId(e.target.value)}
                  className="w-full px-3 py-1.5 border border-stone-300 rounded bg-white"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.fullName} ({s.className})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">بند السداد *</label>
                <select
                  value={feeType}
                  onChange={(e) => setFeeType(e.target.value as any)}
                  className="w-full px-3 py-1.5 border border-stone-300 rounded bg-white"
                >
                  <option value="مصروفات دراسية">مصروفات دراسية</option>
                  <option value="كتب أزهرية">كتب ومقررات أزهرية</option>
                  <option value="أنشطة ورعاية وافدين">أنشطة ورعاية وافدين</option>
                  <option value="اشتراك حافلة">اشتراك حافلة المدرسة</option>
                  <option value="استمارة الشهادة">استمارة الشهادة العامة</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-800 mb-1">المبلغ المطلوب (ج.م) *</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setAmount(val);
                      setPaidAmount(val);
                    }}
                    className="w-full px-3 py-1.5 border border-stone-300 rounded font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-800 mb-1">المبلغ المسدد الآن (ج.م) *</label>
                  <input
                    type="number"
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-stone-300 rounded font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">طريقة الدفع *</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full px-3 py-1.5 border border-stone-300 rounded bg-white"
                >
                  <option value="نقدي">نقدي في الخزينة</option>
                  <option value="فوري">فوري (Fawry)</option>
                  <option value="بريد مصري">هيئة البريد المصري</option>
                  <option value="حوالة بنكية">حوالة بنكية معتمدة</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">ملاحظات الإيصال</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="رقم العملية أو ملاحظة..."
                  className="w-full px-3 py-1.5 border border-stone-300 rounded"
                />
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
                  إصدار الإيصال وحفظ السداد
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
