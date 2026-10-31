/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ClassRoom, StaffMember, Subject, TimetablePeriod } from '../types';

export interface SubjectQuotaAnalysis {
  subjectName: string;
  category: string;
  requiredHours: number;
  availableHours: number;
  deficit: number; // positive = shortage / negative = surplus
  status: 'deficit' | 'balanced' | 'surplus';
  assignedTeachers: string[];
}

export interface TimetableDistributionReport {
  totalRequiredPeriods: number;
  totalAvailablePeriods: number;
  overallDeficit: number;
  subjectAnalyses: SubjectQuotaAnalysis[];
  teachingStaffCount: number;
  adminStaffCount: number;
}

const DAYS: TimetablePeriod['day'][] = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];
const PERIOD_TIME_SLOTS: Record<number, string> = {
  1: '08:00 - 08:45',
  2: '08:45 - 09:30',
  3: '09:45 - 10:30',
  4: '10:30 - 11:15',
  5: '11:45 - 12:30',
  6: '12:30 - 01:15',
  7: '01:15 - 02:00',
};

/**
 * Check and calculate teacher deficits and load across all subjects and classes.
 */
export function analyzeTeacherQuotas(
  classes: ClassRoom[],
  subjects: Subject[],
  staff: StaffMember[]
): TimetableDistributionReport {
  // Only teaching staff count toward available teaching hours!
  // Administrators do NOT teach (النصاب 0)
  const teachers = staff.filter((s) => s.isTeachingStaff !== false && s.role === 'teacher');
  const administrators = staff.filter((s) => s.isTeachingStaff === false || s.role !== 'teacher');

  // Calculate required hours per subject
  const subjectRequiredMap: Record<string, { subject: Subject; requiredHours: number }> = {};
  
  classes.forEach((cls) => {
    // find subjects applicable to this class
    const applicableSubjects = subjects.filter((s) => {
      if (s.stage !== 'both' && s.stage !== cls.stage) return false;
      if (s.grade !== 'all' && s.grade !== cls.grade) return false;
      if (s.track && s.track !== 'all' && cls.track && s.track !== cls.track) return false;
      return true;
    });

    applicableSubjects.forEach((sub) => {
      if (!subjectRequiredMap[sub.name]) {
        subjectRequiredMap[sub.name] = { subject: sub, requiredHours: 0 };
      }
      subjectRequiredMap[sub.name].requiredHours += sub.weeklyHours || 3;
    });
  });

  // Calculate available hours from teachers by specialization
  const analyses: SubjectQuotaAnalysis[] = [];
  let totalRequired = 0;
  let totalAvailable = 0;

  Object.values(subjectRequiredMap).forEach(({ subject, requiredHours }) => {
    totalRequired += requiredHours;

    // Find teachers whose specialization matches this subject
    const matchingTeachers = teachers.filter((t) => {
      const spec = t.specialization.toLowerCase();
      const sName = subject.name.toLowerCase();
      return (
        spec.includes(sName) ||
        sName.includes(spec) ||
        (sName.includes('قرآن') && spec.includes('قرآن')) ||
        (sName.includes('فقه') && spec.includes('فقه')) ||
        (sName.includes('أصول') && spec.includes('أصول')) ||
        (sName.includes('نحو') && spec.includes('عربي')) ||
        (sName.includes('رياضيات') && spec.includes('رياضيات')) ||
        (sName.includes('فيزياء') && (spec.includes('فيزياء') || spec.includes('علوم'))) ||
        (sName.includes('كيمياء') && (spec.includes('كيمياء') || spec.includes('علوم'))) ||
        (sName.includes('أحياء') && (spec.includes('أحياء') || spec.includes('علوم'))) ||
        (sName.includes('إنجليز') && spec.includes('إنجليز')) ||
        (sName.includes('تاريخ') && (spec.includes('تاريخ') || spec.includes('دراسات'))) ||
        (sName.includes('جغرافيا') && (spec.includes('جغرافيا') || spec.includes('دراسات'))) ||
        (sName.includes('حاسب') && spec.includes('حاسب'))
      );
    });

    const teacherCapacity = matchingTeachers.reduce((sum, t) => sum + (t.weeklyQuota || 0), 0);
    totalAvailable += teacherCapacity;

    const deficit = requiredHours - teacherCapacity;

    analyses.push({
      subjectName: subject.name,
      category: subject.category,
      requiredHours,
      availableHours: teacherCapacity,
      deficit,
      status: deficit > 0 ? 'deficit' : deficit === 0 ? 'balanced' : 'surplus',
      assignedTeachers: matchingTeachers.map((t) => t.name),
    });
  });

  return {
    totalRequiredPeriods: totalRequired,
    totalAvailablePeriods: totalAvailable,
    overallDeficit: totalRequired - totalAvailable,
    subjectAnalyses: analyses.sort((a, b) => b.deficit - a.deficit),
    teachingStaffCount: teachers.length,
    adminStaffCount: administrators.length,
  };
}

/**
 * Automate electronic generation of schedules for all classes.
 * Strictly adheres to rule: Administrators do NOT teach classes!
 */
export function generateElectronicTimetable(
  classes: ClassRoom[],
  subjects: Subject[],
  staff: StaffMember[]
): TimetablePeriod[] {
  // Only teaching staff can be scheduled!
  const teachingStaff = staff.filter((s) => s.isTeachingStaff !== false && s.role === 'teacher');
  const newSchedules: TimetablePeriod[] = [];

  // Track busy slots for each teacher: teacherId -> Set of "day-period"
  const teacherBusy = new Map<string, Set<string>>();
  teachingStaff.forEach((t) => teacherBusy.set(t.id, new Set()));

  // Track current weekly load assigned to each teacher: teacherId -> count
  const teacherLoad = new Map<string, number>();
  teachingStaff.forEach((t) => teacherLoad.set(t.id, 0));

  classes.forEach((cls) => {
    // Find relevant subjects for this class
    const classSubjects = subjects.filter((s) => {
      if (s.stage !== 'both' && s.stage !== cls.stage) return false;
      if (s.grade !== 'all' && s.grade !== cls.grade) return false;
      if (s.track && s.track !== 'all' && cls.track && s.track !== cls.track) return false;
      return true;
    });

    // Create a pool of lessons to allocate (up to 30 periods per week for the class)
    const lessonsPool: Array<{ subject: Subject }> = [];
    classSubjects.forEach((sub) => {
      const count = Math.min(sub.weeklyHours || 3, 5);
      for (let i = 0; i < count; i++) {
        lessonsPool.push({ subject: sub });
      }
    });

    let lessonIndex = 0;

    // Distribute across 5 days, periods 1 through 6
    DAYS.forEach((day) => {
      for (let period = 1; period <= 6; period++) {
        if (lessonIndex >= lessonsPool.length) break;

        const currentSubject = lessonsPool[lessonIndex].subject;
        const slotKey = `${day}-${period}`;

        // Find an eligible teacher
        const availableTeacher = teachingStaff.find((tch) => {
          // Must not be already teaching another class at this day and period
          const isBusyAtSlot = teacherBusy.get(tch.id)?.has(slotKey);
          if (isBusyAtSlot) return false;

          // Check if specialization matches
          const spec = tch.specialization.toLowerCase();
          const sName = currentSubject.name.toLowerCase();
          const matches =
            spec.includes(sName) ||
            sName.includes(spec) ||
            (sName.includes('قرآن') && spec.includes('قرآن')) ||
            (sName.includes('فقه') && spec.includes('فقه')) ||
            (sName.includes('أصول') && spec.includes('أصول')) ||
            (sName.includes('نحو') && spec.includes('عربي')) ||
            (sName.includes('رياضيات') && spec.includes('رياضيات')) ||
            (sName.includes('علوم') && spec.includes('علوم')) ||
            (sName.includes('إنجليز') && spec.includes('إنجليز')) ||
            (sName.includes('دراسات') && spec.includes('دراسات'));

          return matches;
        }) || teachingStaff[lessonIndex % teachingStaff.length]; // fallback to next available teacher

        if (availableTeacher) {
          teacherBusy.get(availableTeacher.id)?.add(slotKey);
          teacherLoad.set(availableTeacher.id, (teacherLoad.get(availableTeacher.id) || 0) + 1);

          newSchedules.push({
            id: `sch-${cls.id}-${day}-${period}`,
            classId: cls.id,
            day,
            periodNumber: period,
            subjectId: currentSubject.id,
            subjectName: currentSubject.name,
            teacherId: availableTeacher.id,
            teacherName: availableTeacher.name,
            timeSlot: PERIOD_TIME_SLOTS[period] || '08:00 - 08:45',
          });
        }

        lessonIndex++;
      }
    });
  });

  return newSchedules;
}
