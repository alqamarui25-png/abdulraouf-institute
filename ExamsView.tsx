/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FileCheck2, Plus, Search, Award, Printer, CheckCircle2, XCircle, Calendar, Hash } from 'lucide-react';
import { Student, ClassRoom, Subject, ExamResult } from '../../types';

interface ExamsViewProps {
  students: Student[];
  classes: ClassRoom[];
  subjects: Subject[];
  examResults: ExamResult[];
  onSaveResult: (result: Partial<ExamResult>) => Promise<void>;
  onPrintCertificate: (student: Student) => void;
  onOpenExamSchedule: () => void;
  onOpenSeatNumbers: () => void;
}

export const ExamsView: React.FC<ExamsViewProps> = ({
  students,
  classes,
  subjects,
  examResults,
  onSaveResult,
  onPrintCertificate,
  onOpenExamSchedule,
  onOpenSeatNumbers,
}) => {
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || '');
  const [selectedTerm, setSelectedTerm] = useState<'الفصل الدراسي الأول' | 'الفصل الدراسي الثاني'>('الفصل الدراسي الأول');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [targetStudentId, setTargetStudentId] = useState<string>(students[0]?.id || '');
  const [courseworkScore, setCourseworkScore] = useState(10);
  const [oralScore, setOralScore] = useState(10);
  const [writtenScore, setWrittenScore] = useState(25);
  const [maxScore, setMaxScore] = useState(50);

  const selectedClass = classes.find(c => c.id === selectedClassId) || classes[0];
  const classStudents = students.filter(s => s.classId === selectedClassId || s.className === selectedClass?.name);
  const selectedSubject = subjects.find(s => s.id === selectedSubjectId) || subjects[0];

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find(s => s.id === targetStudentId);
    if (!st || !selectedSubject) return;

    await onSaveResult({
      studentId: st.id,
      studentName: st.fullName,
      classId: st.classId,
      schoolYear: '2025/2026',
      term: selectedTerm,
      subjectId: selectedSubject.id,
      subjectName: selectedSubject.name,
      subjectCategory: selectedSubject.category,
      courseworkScore: Number(courseworkScore),
      oralScore: Number(oralScore),
      writtenScore: Number(writtenScore),
      maxScore: Number(maxScore),
    });

    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 text-right">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-emerald-800" />
            <h2 className="text-lg font-bold text-stone-900">
              كنترول الامتحانات ورصد الدرجات والنتائج
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            لجنة النظام والمراقبة: رصد درجات أعمال السنة، الشفهي والقرآن، والتحريري وحساب النسب والتقديرات والترتيب.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenExamSchedule}
            className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 text-xs font-bold rounded-lg transition-colors cursor-pointer"
            title="عرض وطباعة جدول الامتحانات الرسمية A4"
          >
            <Calendar className="w-4 h-4 text-amber-700" />
            <span>جدول الامتحانات A4</span>
          </button>

          <button
            onClick={onOpenSeatNumbers}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-950 hover:bg-stone-900 text-amber-300 text-xs font-bold rounded-lg border border-amber-400/40 shadow-xs transition-colors cursor-pointer"
            title="إصدار أرقام الجلوس تلقائياً من 1000 وطباعة كروت المقاعد"
          >
            <Hash className="w-4 h-4 text-amber-400" />
            <span>أرقام الجلوس (من 1000)</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg border border-stone-300 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-stone-600" />
            <span>شيت الكنترول A4</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>رصد درجة</span>
          </button>
        </div>
      </div>

      {/* Filter Matrix */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div>
          <label className="block font-bold text-stone-700 mb-1">الفصل الدراسي:</label>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="w-full px-3 py-1.5 border border-stone-300 rounded-lg bg-white"
          >
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-bold text-stone-700 mb-1">المادة الدراسية:</label>
          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="w-full px-3 py-1.5 border border-stone-300 rounded-lg bg-white"
          >
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.name} ({s.category})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-bold text-stone-700 mb-1">الفصل / الترم:</label>
          <select
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value as any)}
            className="w-full px-3 py-1.5 border border-stone-300 rounded-lg bg-white font-medium"
          >
            <option value="الفصل الدراسي الأول">الفصل الدراسي الأول</option>
            <option value="الفصل الدراسي الثاني">الفصل الدراسي الثاني</option>
          </select>
        </div>
      </div>

      {/* Control Results Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <h3 className="font-bold text-sm text-stone-900">
            كشف رصد درجات مادة: {selectedSubject?.name} · {selectedClass?.name}
          </h3>
          <span className="text-xs text-emerald-900 font-mono">
            النهاية العظمى للمادة: {selectedSubject?.maxGrade} درجة
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right divide-y divide-stone-200">
            <thead className="bg-stone-50 text-stone-700 font-bold text-[11px]">
              <tr>
                <th className="py-3 px-3 w-10">م</th>
                <th className="py-3 px-4">الطالب</th>
                <th className="py-3 px-3">رقم القيد</th>
                <th className="py-3 px-3 text-center">أعمال السنة</th>
                <th className="py-3 px-3 text-center">الشفهي / القرآن</th>
                <th className="py-3 px-3 text-center">التحريري</th>
                <th className="py-3 px-3 text-center">المجموع الكلي</th>
                <th className="py-3 px-3 text-center">النتيجة</th>
                <th className="py-3 px-4 text-center">طباعة الشهادة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {classStudents.map((student, idx) => {
                const recorded = examResults.find(
                  r => r.studentId === student.id && r.subjectId === selectedSubjectId && r.term === selectedTerm
                );
                const cw = recorded ? recorded.courseworkScore : 10;
                const or = recorded ? recorded.oralScore : 12;
                const wr = recorded ? recorded.writtenScore : 24;
                const tot = recorded ? recorded.totalScore : (cw + or + wr);
                const max = selectedSubject?.maxGrade || 50;
                const passed = tot >= (max / 2);

                return (
                  <tr key={student.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3 px-3 font-mono text-stone-400">{idx + 1}</td>
                    
                    <td className="py-3 px-4 font-semibold text-stone-900">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-stone-200 overflow-hidden shrink-0">
                          {student.photoUrl && (
                            <img src={student.photoUrl} alt="" className="w-full h-full object-cover" />
                          )}
                        </div>
                        <span>{student.fullName}</span>
                      </div>
                    </td>

                    <td className="py-3 px-3 font-mono text-stone-600">{student.studentCode}</td>
                    
                    <td className="py-3 px-3 font-mono text-center text-stone-800">{cw}</td>
                    <td className="py-3 px-3 font-mono text-center text-stone-800">{or}</td>
                    <td className="py-3 px-3 font-mono text-center text-stone-800">{wr}</td>
                    <td className="py-3 px-3 font-mono font-bold text-center text-emerald-950 text-sm">
                      {tot} / {max}
                    </td>

                    <td className="py-3 px-3 text-center">
                      {passed ? (
                        <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-bold text-[10px]">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>ناجح</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-800 bg-rose-50 px-2 py-0.5 rounded font-bold text-[10px]">
                          <XCircle className="w-3 h-3 text-rose-600" />
                          <span>دور ثان</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onPrintCertificate(student)}
                        className="px-2.5 py-1 bg-stone-100 hover:bg-emerald-50 hover:text-emerald-900 rounded font-semibold transition-colors cursor-pointer text-[11px] inline-flex items-center gap-1"
                      >
                        <Printer className="w-3 h-3" />
                        <span>الشهادة A4</span>
                      </button>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Marks Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-stone-200 w-full max-w-md p-6 space-y-4 text-right text-xs">
            <h3 className="font-bold text-sm text-stone-900 border-b border-stone-200 pb-2">
              رصد درجة مادة أزهرية للطالب
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
                <label className="block font-bold text-stone-800 mb-1">المادة الدراسية المقررة *</label>
                <select
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                  className="w-full px-3 py-1.5 border border-stone-300 rounded bg-white"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.category})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-stone-800 mb-1">أعمال السنة</label>
                  <input
                    type="number"
                    value={courseworkScore}
                    onChange={(e) => setCourseworkScore(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-stone-300 rounded font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-800 mb-1">الشفهي / القرآن</label>
                  <input
                    type="number"
                    value={oralScore}
                    onChange={(e) => setOralScore(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-stone-300 rounded font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-800 mb-1">التحريري</label>
                  <input
                    type="number"
                    value={writtenScore}
                    onChange={(e) => setWrittenScore(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-stone-300 rounded font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">النهاية العظمى للمادة</label>
                <input
                  type="number"
                  value={maxScore}
                  onChange={(e) => setMaxScore(Number(e.target.value))}
                  className="w-full px-3 py-1.5 border border-stone-300 rounded font-mono"
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
                  اعتماد ورصد الدرجة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
