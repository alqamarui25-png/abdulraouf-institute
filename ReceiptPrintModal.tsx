/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { X, Printer, Receipt, CheckCircle2 } from 'lucide-react';
import { FeeRecord, InstituteSettings } from '../../types';

interface ReceiptPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  feeRecord: FeeRecord | null;
  instituteSettings: InstituteSettings;
}

export const ReceiptPrintModal: React.FC<ReceiptPrintModalProps> = ({
  isOpen,
  onClose,
  feeRecord,
  instituteSettings,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !feeRecord) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-stone-300 w-full max-w-2xl max-h-[96vh] flex flex-col overflow-hidden text-right">
        
        {/* Controls */}
        <div className="no-print flex items-center justify-between px-6 py-3.5 bg-stone-800 text-white shrink-0">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-sm">
              طباعة إيصال سداد معتمد - رقم {feeRecord.receiptNumber}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة الإيصال الرسمي</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-300 hover:text-white rounded-lg hover:bg-stone-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Preview Area */}
        <div className="p-4 sm:p-6 overflow-y-auto bg-stone-100 flex justify-center">
          <div
            ref={printRef}
            className="w-full bg-white text-stone-900 p-6 sm:p-8 shadow border-2 border-dashed border-stone-400 relative rounded-sm font-sans space-y-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b-2 border-emerald-900 pb-3">
              <div className="text-right text-xs space-y-0.5">
                <p className="font-bold text-stone-700">{instituteSettings.sectorName}</p>
                <p className="font-bold text-emerald-950 font-amiri text-sm">
                  {instituteSettings.instituteName}
                </p>
                <p className="text-[11px] text-stone-500">{instituteSettings.regionName} · إدارة الشؤون المالية</p>
              </div>

              <div className="w-14 h-14 rounded-full border border-stone-200 overflow-hidden">
                <img src={instituteSettings.logoUrl} alt="" className="w-full h-full object-cover" />
              </div>

              <div className="text-left text-xs space-y-0.5">
                <span className="inline-block bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-mono font-bold text-xs">
                  {feeRecord.receiptNumber}
                </span>
                <p className="text-[10px] text-stone-500">التاريخ: {feeRecord.paymentDate}</p>
                <p className="text-[10px] text-stone-500">العام: {instituteSettings.academicYear}</p>
              </div>
            </div>

            {/* Title */}
            <div className="text-center py-1">
              <h3 className="text-base font-bold text-stone-900 font-amiri">
                إيصال استلام نقدية / سداد مصروفات أزهرية
              </h3>
              <p className="text-xs text-stone-500">
                (أصل لولي الأمر / صورة المعهد)
              </p>
            </div>

            {/* Details */}
            <div className="bg-stone-50 p-4 rounded border border-stone-200 text-xs space-y-2.5">
              <div className="flex justify-between border-b border-stone-200 pb-2">
                <span className="text-stone-600">وصلنا من الطالب / ولي أمره:</span>
                <strong className="text-stone-900 text-sm">{feeRecord.studentName}</strong>
              </div>

              <div className="flex justify-between border-b border-stone-200 pb-2">
                <span className="text-stone-600">بند السداد:</span>
                <strong className="text-emerald-950 font-bold">{feeRecord.feeType}</strong>
              </div>

              <div className="grid grid-cols-3 gap-2 py-1 text-center font-mono">
                <div className="bg-white p-2 rounded border border-stone-200">
                  <span className="text-[10px] text-stone-500 block">المبلغ الإجمالي</span>
                  <strong className="text-xs text-stone-900">{feeRecord.amount} ج.م</strong>
                </div>
                <div className="bg-emerald-50 p-2 rounded border border-emerald-200">
                  <span className="text-[10px] text-emerald-700 block">المبلغ المسدد</span>
                  <strong className="text-xs text-emerald-950">{feeRecord.paidAmount} ج.م</strong>
                </div>
                <div className="bg-white p-2 rounded border border-stone-200">
                  <span className="text-[10px] text-stone-500 block">المتبقي</span>
                  <strong className="text-xs text-rose-700">{feeRecord.remainingAmount} ج.م</strong>
                </div>
              </div>

              <div className="flex justify-between pt-1">
                <span className="text-stone-600">طريقة الدفع:</span>
                <span className="font-medium text-stone-800">{feeRecord.paymentMethod}</span>
              </div>

              {feeRecord.notes && (
                <div className="text-[11px] text-stone-500 pt-1">
                  ملاحظات: {feeRecord.notes}
                </div>
              )}
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-2 gap-8 pt-4 items-end text-center text-xs">
              <div className="space-y-4">
                <span className="font-bold text-stone-800">أمين الخزينة / المسؤول المالي</span>
                <p className="text-[11px] text-stone-600">{instituteSettings.financialHead}</p>
              </div>

              <div className="flex flex-col items-center">
                <span className="font-bold text-stone-800 mb-1">خاتم الإدارة المالية المعتمد</span>
                <div className="w-16 h-16 opacity-85">
                  <img src={instituteSettings.sealUrl} alt="" className="w-full h-full object-contain" />
                </div>
              </div>
            </div>

            <div className="text-[10px] text-stone-400 text-center border-t border-stone-200 pt-2">
              لا يعتد بهذا الإيصال إلا بخاتم المعهد وتوقيع أمين الخزينة المعتمد.
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
