/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserCheck, Calendar, CheckCircle2, XCircle, Clock, AlertCircle, Save, Printer } from 'lucide-react';
import { Student, ClassRoom, AttendanceRecord } from '../../types';

interface AttendanceViewProps {
  students: Student[];
  classes: ClassRoom[];
  attendanceRecords: AttendanceRecord[];
  onSaveAttendance: (records: AttendanceRecord[]) => Promise<void>;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  students,
  classes,
  attendanceRecords,
  onSaveAttendance,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  const [currentAttendance, setCurrentAttendance] = useState<Record<string, { status: AttendanceRecord['status']; notes?: string }>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const selectedClass = classes.find(c => c.id === selectedClassId) || classes[0];
  const classStudents = students.filter(s => s.classId === selectedClassId || s.className === selectedClass?.name);

  // Load existing records for this class & date
  useEffect(() => {
    const map: Record<string, { status: AttendanceRecord['status']; notes?: string }> = {};
    for (const s of classStudents) {
      const existing = attendanceRecords.find(r => r.studentId === s.id && r.date === selectedDate);
      map[s.id] = {
        status: existing ? existing.status : 'present', // default present
        notes: existing?.notes,
      };
    }
    setCurrentAttendance(map);
  }, [selectedClassId, selectedDate, classStudents.length, attendanceRecords]);

  const handleStatusChange = (studentId: string, status: AttendanceRecord['status']) => {
    setCurrentAttendance(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
      },
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    const recordsToSave: AttendanceRecord[] = classStudents.map(s => {
      const current = currentAttendance[s.id] || { status: 'present' };
      return {
        id: `att-${s.id}-${selectedDate}`,
        studentId: s.id,
        studentName: s.fullName,
        classId: selectedClassId,
        date: selectedDate,
        status: current.status,
        notes: current.notes,
      };
    });

    try {
      await onSaveAttendance(recordsToSave);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      alert(`حدث خطأ أثناء حفظ الحضور: ${err?.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Stats
  const presentCount = Object.values(currentAttendance).filter(v => v.status === 'present').length;
  const absentCount = Object.values(currentAttendance).filter(v => v.status === 'absent').length;
  const lateCount = Object.values(currentAttendance).filter(v => v.status === 'late').length;
  const excusedCount = Object.values(currentAttendance).filter(v => v.status === 'excused').length;
  const attendanceRate = classStudents.length > 0 ? Math.round((presentCount / classStudents.length) * 100) : 100;

  return (
    <div className="space-y-6 text-right">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-emerald-800" />
            <h2 className="text-lg font-bold text-stone-900">
              دفتر الحضور والغياب اليومي للطلاب
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            تسجيل الحضور والغياب والتأخير والأعذار المقبولة يومياً لكافة فصول المعهد.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg border border-stone-300 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-stone-600" />
            <span>طباعة كشف الحضور A4</span>
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'جارٍ الحفظ...' : 'اعتماد وحفظ الحضور اليومي'}</span>
          </button>
        </div>
      </div>

      {/* Date & Class Selector Strip */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block font-bold text-stone-700 mb-1">تاريخ اليوم:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-1.5 border border-stone-300 rounded-lg font-mono text-stone-900 bg-white"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">الفصل الدراسي:</label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="px-3 py-1.5 border border-stone-300 rounded-lg bg-white font-medium text-stone-900"
            >
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Attendance Rates */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="bg-emerald-50 text-emerald-900 px-3 py-1.5 rounded-lg border border-emerald-200">
            حاضر: <strong>{presentCount}</strong>
          </div>
          <div className="bg-rose-50 text-rose-900 px-3 py-1.5 rounded-lg border border-rose-200">
            غائب: <strong>{absentCount}</strong>
          </div>
          <div className="bg-amber-50 text-amber-900 px-3 py-1.5 rounded-lg border border-amber-200">
            متأخر: <strong>{lateCount}</strong>
          </div>
          <div className="bg-blue-50 text-blue-900 px-3 py-1.5 rounded-lg border border-blue-200">
            بعذر: <strong>{excusedCount}</strong>
          </div>
          <div className="bg-stone-100 text-stone-800 px-3 py-1.5 rounded-lg font-bold">
            نسبة الحضور: {attendanceRate}%
          </div>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-lg text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>تم حفظ واعتماد كشف الحضور بنجاح في قاعدة البيانات!</span>
        </div>
      )}

      {/* Roster Attendance Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right divide-y divide-stone-200">
            <thead className="bg-stone-50 text-stone-700 font-bold text-[11px]">
              <tr>
                <th className="py-3 px-3 w-10">م</th>
                <th className="py-3 px-4">الطالب</th>
                <th className="py-3 px-3">رقم القيد</th>
                <th className="py-3 px-3">الجنسية</th>
                <th className="py-3 px-6 text-center">حالة الحضور اليوم</th>
                <th className="py-3 px-4">ملاحظات العذر / التأخير</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {classStudents.map((student, idx) => {
                const current = currentAttendance[student.id] || { status: 'present' };
                return (
                  <tr key={student.id} className="hover:bg-stone-50/70 transition-colors">
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
                    
                    <td className="py-3 px-3">
                      {student.isInternational ? (
                        <span className="text-amber-800 text-[11px] font-medium">وافد ({student.internationalDetails?.nationality})</span>
                      ) : (
                        <span className="text-stone-500 text-[11px]">مصري</span>
                      )}
                    </td>

                    {/* Radio/Button Status selector */}
                    <td className="py-3 px-6 text-center">
                      <div className="inline-flex items-center gap-1 bg-stone-100 p-1 rounded-lg">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, 'present')}
                          className={`px-3 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                            current.status === 'present'
                              ? 'bg-emerald-700 text-white shadow-xs'
                              : 'text-stone-600 hover:text-stone-900'
                          }`}
                        >
                          حاضر
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, 'absent')}
                          className={`px-3 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                            current.status === 'absent'
                              ? 'bg-rose-700 text-white shadow-xs'
                              : 'text-stone-600 hover:text-stone-900'
                          }`}
                        >
                          غائب
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, 'late')}
                          className={`px-3 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                            current.status === 'late'
                              ? 'bg-amber-600 text-white shadow-xs'
                              : 'text-stone-600 hover:text-stone-900'
                          }`}
                        >
                          متأخر
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, 'excused')}
                          className={`px-3 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                            current.status === 'excused'
                              ? 'bg-blue-700 text-white shadow-xs'
                              : 'text-stone-600 hover:text-stone-900'
                          }`}
                        >
                          بعذر
                        </button>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <input
                        type="text"
                        value={current.notes || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCurrentAttendance(prev => ({
                            ...prev,
                            [student.id]: {
                              ...prev[student.id],
                              notes: val,
                            },
                          }));
                        }}
                        placeholder="سبب التأخير أو رقم إذن الغياب..."
                        className="w-full px-2 py-1 border border-stone-200 rounded text-xs"
                      />
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
