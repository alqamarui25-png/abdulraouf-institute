/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { History, Search, Plus, Award, CheckCircle, Calendar, GraduationCap } from 'lucide-react';
import { Student, AcademicHistoryRecord } from '../../types';

interface AcademicHistoryViewProps {
  students: Student[];
  records: AcademicHistoryRecord[];
  onSaveRecord: (record: Partial<AcademicHistoryRecord>) => Promise<void>;
  onPrintCertificate: (student: Student) => void;
  onPrintProgression?: (student: Student) => void;
  onPrintGraduationCertificate?: (student: Student) => void;
}

export const AcademicHistoryView: React.FC<AcademicHistoryViewProps> = ({
  students,
  records,
  onSaveRecord,
  onPrintCertificate,
  onPrintProgression,
  onPrintGraduationCertificate,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [showAddModal, setShowAddModal] = useState(false);

  // New record form
  const [schoolYear, setSchoolYear] = useState('2024/2025');
  const [term1Score, setTerm1Score] = useState(280);
  const [term2Score, setTerm2Score] = useState(285);
  const [maxScore, setMaxScore] = useState(600);
  const [evaluation, setEvaluation] = useState<'ممتاز' | 'جيد جداً' | 'جيد' | 'مقبول' | 'دور ثان'>('ممتاز');
  const [conduct, setConduct] = useState('ممتاز - حسن السير والسلوك');
  const [notes, setNotes] = useState('انتقل إلى الصف الأعلى بتفوق');

  const selectedStudent = students.find(s => s.id === selectedStudentId);
  const studentHistory = records.filter(r => r.studentId === selectedStudentId);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    await onSaveRecord({
      studentId: selectedStudent.id,
      studentName: selectedStudent.fullName,
      schoolYear,
      stage: selectedStudent.stage,
      grade: selectedStudent.grade,
      track: selectedStudent.track,
      term1Score: Number(term1Score),
      term2Score: Number(term2Score),
      maxScore: Number(maxScore),
      evaluation,
      conduct,
      notes,
    });

    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 text-right">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
        <div>
          <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-800" />
            <span>التدرج الدراسي والسجل التاريخي للطلاب</span>
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            سجل الانتقال بين الصفوف والمراحل، نتائج الأعوام السابقة، وتقييم السلوك والمواظبة.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          disabled={!selectedStudent}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer shrink-0 disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة سجل عام دراسي جديد</span>
        </button>
      </div>

      {/* Main Grid: Student Selector on Left, Timeline on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Student Selection Sidebar */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs space-y-3">
          <label className="block text-xs font-bold text-stone-800">
            اختر الطالب لعرض سجله التاريخي:
          </label>
          <div className="space-y-1.5 max-h-[500px] overflow-y-auto">
            {students.map((student) => {
              const isSelected = student.id === selectedStudentId;
              const hasRecords = records.some(r => r.studentId === student.id);

              return (
                <button
                  key={student.id}
                  onClick={() => setSelectedStudentId(student.id)}
                  className={`w-full text-right p-3 rounded-lg border text-xs transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold shadow-2xs'
                      : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <div className="w-7 h-7 rounded-full bg-stone-200 overflow-hidden shrink-0">
                      {student.photoUrl && (
                        <img src={student.photoUrl} alt="" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="truncate">
                      <strong className="block truncate">{student.fullName}</strong>
                      <span className="text-[10px] text-stone-500 font-mono">
                        {student.studentCode} · {student.className}
                      </span>
                    </div>
                  </div>

                  {hasRecords && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-900 px-1.5 py-0.5 rounded font-mono shrink-0">
                      سجل موثق
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Student Timeline & Record Cards */}
        <div className="lg:col-span-2 space-y-4">
          {selectedStudent ? (
            <>
              {/* Profile Bar */}
              <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full border-2 border-emerald-800 overflow-hidden bg-stone-100 shrink-0">
                    {selectedStudent.photoUrl ? (
                      <img src={selectedStudent.photoUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs">أزهر</div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-900 text-sm">{selectedStudent.fullName}</h3>
                    <div className="text-xs text-stone-500 space-x-2 space-x-reverse">
                      <span>كود الطالب: <strong className="font-mono text-stone-800">{selectedStudent.studentCode}</strong></span>
                      <span>·</span>
                      <span>{selectedStudent.className}</span>
                      <span>·</span>
                      <span>{selectedStudent.isInternational ? `وافد (${selectedStudent.internationalDetails?.nationality})` : 'مصري'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {onPrintProgression && (
                    <button
                      onClick={() => onPrintProgression(selectedStudent)}
                      className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-lg shadow-2xs transition-colors cursor-pointer"
                    >
                      إثبات قيد وتدرج دراسي A4
                    </button>
                  )}
                  {onPrintGraduationCertificate && (
                    <button
                      onClick={() => onPrintGraduationCertificate(selectedStudent)}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-2xs transition-colors cursor-pointer"
                    >
                      شهادة تخرج عرضي A4
                    </button>
                  )}
                  <button
                    onClick={() => onPrintCertificate(selectedStudent)}
                    className="px-3 py-1.5 bg-stone-100 hover:bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-lg border border-stone-200 hover:border-emerald-300 transition-colors cursor-pointer"
                  >
                    طباعة بيان الدرجات A4
                  </button>
                </div>
              </div>

              {/* History Timeline */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-800" />
                  <span>تدرج الأعوام الدراسية والشهادات السابقة</span>
                </h4>

                {studentHistory.length > 0 ? (
                  studentHistory.map((rec) => (
                    <div
                      key={rec.id}
                      className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-3 relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-1.5 h-full bg-emerald-800" />

                      <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-stone-900">
                            العام الدراسي: {rec.schoolYear}
                          </span>
                          <span className="text-xs text-stone-500 font-mono">
                            ({rec.stage === 'preparatory' ? 'إعدادي' : 'ثانوي'} - {rec.grade})
                          </span>
                        </div>
                        <span className="text-xs font-bold text-emerald-900 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          {rec.evaluation} ({rec.percentage}%)
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div className="bg-stone-50 p-2 rounded">
                          <span className="text-stone-500 block text-[10px]">درجة الفصل الأول</span>
                          <strong className="font-mono text-stone-900">{rec.term1Score}</strong>
                        </div>
                        <div className="bg-stone-50 p-2 rounded">
                          <span className="text-stone-500 block text-[10px]">درجة الفصل الثاني</span>
                          <strong className="font-mono text-stone-900">{rec.term2Score}</strong>
                        </div>
                        <div className="bg-emerald-50 p-2 rounded">
                          <span className="text-emerald-800 block text-[10px]">المجموع الكلي</span>
                          <strong className="font-mono text-emerald-950 font-bold">{rec.totalScore} / {rec.maxScore}</strong>
                        </div>
                        <div className="bg-stone-50 p-2 rounded">
                          <span className="text-stone-500 block text-[10px]">الترتيب على الفصل</span>
                          <strong className="font-mono text-stone-900">المركز {rec.rankInClass || 1}</strong>
                        </div>
                      </div>

                      <div className="text-xs space-y-1 pt-1">
                        <div className="text-stone-700">
                          <strong>السلوك والمواظبة:</strong> {rec.conduct}
                        </div>
                        {rec.notes && (
                          <div className="text-stone-500 text-[11px]">
                            <strong>قرار لجنة الكنترول:</strong> {rec.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white p-8 rounded-xl border border-stone-200 text-center text-stone-400 text-xs">
                    لا يوجد سجل تاريخي مسجل لهذا الطالب بعد. اضغط على زر "إضافة سجل عام دراسي جديد" لتوثيق نتائج الأعوام السابقة.
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-white p-12 rounded-xl border border-stone-200 text-center text-stone-400 text-xs">
              يرجى اختيار طالب من القائمة الجانبية.
            </div>
          )}
        </div>

      </div>

      {/* Add Record Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-stone-200 w-full max-w-lg p-6 space-y-4 text-right text-xs">
            <h3 className="font-bold text-sm text-stone-900 border-b border-stone-200 pb-2">
              إضافة سجل تاريخي للعام الدراسي: {selectedStudent?.fullName}
            </h3>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="block font-bold text-stone-800 mb-1">العام الدراسي</label>
                <input
                  type="text"
                  value={schoolYear}
                  onChange={(e) => setSchoolYear(e.target.value)}
                  placeholder="2024/2025"
                  className="w-full px-3 py-1.5 border border-stone-300 rounded font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-800 mb-1">مجموع الترم الأول</label>
                  <input
                    type="number"
                    value={term1Score}
                    onChange={(e) => setTerm1Score(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-stone-300 rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-800 mb-1">مجموع الترم الثاني</label>
                  <input
                    type="number"
                    value={term2Score}
                    onChange={(e) => setTerm2Score(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-stone-300 rounded font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-800 mb-1">النهاية الكبرى للمجموع</label>
                  <input
                    type="number"
                    value={maxScore}
                    onChange={(e) => setMaxScore(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-stone-300 rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-800 mb-1">التقدير العام</label>
                  <select
                    value={evaluation}
                    onChange={(e) => setEvaluation(e.target.value as any)}
                    className="w-full px-3 py-1.5 border border-stone-300 rounded bg-white"
                  >
                    <option value="ممتاز">ممتاز</option>
                    <option value="جيد جداً">جيد جداً</option>
                    <option value="جيد">جيد</option>
                    <option value="مقبول">مقبول</option>
                    <option value="دور ثان">دور ثان</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">السلوك والمواظبة</label>
                <input
                  type="text"
                  value={conduct}
                  onChange={(e) => setConduct(e.target.value)}
                  className="w-full px-3 py-1.5 border border-stone-300 rounded"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">ملاحظات وقرار الكنترول</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
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
                  حفظ السجل
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
