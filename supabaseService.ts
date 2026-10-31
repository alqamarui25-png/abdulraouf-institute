/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { getSupabase } from './supabaseClient';
import {
  INITIAL_STUDENTS,
  INITIAL_STAFF,
  INITIAL_CLASSES,
  INITIAL_SUBJECTS,
  INITIAL_SCHEDULES,
  INITIAL_ATTENDANCE,
  INITIAL_EXAM_RESULTS,
  INITIAL_FEES,
  INITIAL_ACADEMIC_HISTORY,
} from './mockData';
import {
  Student,
  StaffMember,
  ClassRoom,
  Subject,
  TimetablePeriod,
  AttendanceRecord,
  ExamResult,
  FeeRecord,
  AcademicHistoryRecord,
  UserProfile,
  StaffRole,
} from '../types';

// Storage keys for local resilience
const STORAGE_PREFIX = 'abdelraouf_';

function getStored<T>(key: string, defaultValue: T): T {
  try {
    const val = localStorage.getItem(STORAGE_PREFIX + key);
    if (!val) return defaultValue;
    return JSON.parse(val);
  } catch (e) {
    console.error(`Error loading ${key} from storage:`, e);
    return defaultValue;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to storage:`, e);
  }
}

// -----------------------------------------------------------------------------
// Authentication Service (Supabase Auth with local guest fallback)
// -----------------------------------------------------------------------------

export const authService = {
  async getCurrentUser(): Promise<UserProfile | null> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          return {
            id: session.user.id,
            email: session.user.email || '',
            fullName: profile?.full_name || session.user.user_metadata?.full_name || 'مستخدم النظام',
            role: (profile?.role as StaffRole) || (session.user.user_metadata?.role as StaffRole) || 'headmaster',
            avatarUrl: profile?.avatar_url,
          };
        }
      } catch (err) {
        console.warn('Supabase auth session fetch error:', err);
      }
    }

    // Local session fallback
    const localUser = localStorage.getItem(STORAGE_PREFIX + 'current_user');
    if (localUser) {
      try {
        return JSON.parse(localUser);
      } catch {
        return null;
      }
    }

    // Default admin user for immediate seamless access to the dashboard
    return {
      id: 'local-admin-1',
      email: 'admin@abdelraouf-azhar.edu.eg',
      fullName: 'الشيخ د. عبد الحميد رضوان (ناظر المعهد)',
      role: 'headmaster',
      phone: '01001234567',
    };
  },

  async signInWithPassword(email: string, password: string): Promise<{ user: UserProfile | null; error?: string }> {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        return { user: null, error: error.message };
      }
      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        const user: UserProfile = {
          id: data.user.id,
          email: data.user.email || email,
          fullName: profile?.full_name || data.user.user_metadata?.full_name || 'مستخدم معتمد',
          role: (profile?.role as StaffRole) || 'headmaster',
        };
        localStorage.setItem(STORAGE_PREFIX + 'current_user', JSON.stringify(user));
        return { user };
      }
    }

    // Local simulated auth if Supabase isn't active
    if (!password || password.length < 6) {
      return { user: null, error: 'كلمة المرور يجب ألا تقل عن 6 أحرف' };
    }

    const localUser: UserProfile = {
      id: 'usr-' + Date.now(),
      email,
      fullName: email.includes('admin') || email.includes('director')
        ? 'الشيخ د. عبد الحميد رضوان (ناظر المعهد)'
        : 'أستاذ / مسؤول النظام الأزهري',
      role: email.includes('admin') ? 'headmaster' : 'student_affairs',
    };
    localStorage.setItem(STORAGE_PREFIX + 'current_user', JSON.stringify(localUser));
    return { user: localUser };
  },

  async signUp(email: string, password: string, fullName: string, role: StaffRole = 'teacher'): Promise<{ user: UserProfile | null; error?: string }> {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role,
          },
        },
      });
      if (error) {
        return { user: null, error: error.message };
      }
      if (data.user) {
        const user: UserProfile = {
          id: data.user.id,
          email: data.user.email || email,
          fullName,
          role,
        };
        localStorage.setItem(STORAGE_PREFIX + 'current_user', JSON.stringify(user));
        return { user };
      }
    }

    // Local fallback
    const newUser: UserProfile = {
      id: 'usr-' + Date.now(),
      email,
      fullName,
      role,
    };
    localStorage.setItem(STORAGE_PREFIX + 'current_user', JSON.stringify(newUser));
    return { user: newUser };
  },

  async signOut(): Promise<void> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error('Sign out error:', err);
      }
    }
    localStorage.removeItem(STORAGE_PREFIX + 'current_user');
  },
};

// -----------------------------------------------------------------------------
// Students Service
// -----------------------------------------------------------------------------

export const studentService = {
  async getAll(): Promise<Student[]> {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase.from('students').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map((item: any, index: number) => ({
          id: item.id,
          studentCode: item.student_code,
          recordNumber: item.record_number || (index + 1),
          seatNumber: item.seat_number,
          fullName: item.full_name,
          nationalId: item.national_id,
          birthDate: item.birth_date,
          birthPlace: item.birth_place,
          stage: item.stage,
          grade: item.grade,
          track: item.track,
          classId: item.class_id,
          className: item.class_name,
          isInternational: item.is_international,
          internationalDetails: item.is_international ? {
            nationality: item.nationality,
            passportNumber: item.passport_number,
            passportExpiryDate: item.passport_expiry_date,
            residenceNumber: item.residence_number,
            residenceExpiry: item.residence_expiry,
            madhhab: item.madhhab,
            nativeLanguage: item.native_language,
            embassyContact: item.embassy_contact,
            whatsappNumber: item.whatsapp_number,
            azharEnrollmentDate: item.azhar_enrollment_date,
            scholarshipStatus: item.scholarship_status,
          } : undefined,
          guardianName: item.guardian_name,
          guardianRelation: item.guardian_relation,
          guardianPhone: item.guardian_phone,
          guardianJob: item.guardian_job,
          address: item.address,
          governorate: item.governorate,
          enrollmentDate: item.enrollment_date,
          status: item.status,
          photoUrl: item.photo_url || '',
          notes: item.notes,
        }));
      }
    }
    return getStored<Student[]>('students', INITIAL_STUDENTS);
  },

  async save(student: Partial<Student>): Promise<Student> {
    const students = await this.getAll();
    const isNew = !student.id;
    const now = new Date().toISOString();

    const studentRecord: Student = {
      id: student.id || `std-${Date.now()}`,
      studentCode: student.studentCode || `AZ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      recordNumber: student.recordNumber || (students.length > 0 ? Math.max(...students.map(s => s.recordNumber || 0)) + 1 : 1),
      seatNumber: student.seatNumber,
      fullName: student.fullName || '',
      nationalId: student.nationalId || '',
      birthDate: student.birthDate || '2010-01-01',
      birthPlace: student.birthPlace || 'مصر',
      stage: student.stage || 'preparatory',
      grade: student.grade || 'prep_1',
      track: student.track,
      classId: student.classId || 'cls-prep-1-1',
      className: student.className || 'الصف الأول الإعدادي (1/1)',
      isInternational: Boolean(student.isInternational),
      internationalDetails: student.isInternational ? student.internationalDetails : undefined,
      guardianName: student.guardianName || '',
      guardianRelation: student.guardianRelation || 'أب',
      guardianPhone: student.guardianPhone || '',
      guardianJob: student.guardianJob || '',
      address: student.address || '',
      governorate: student.governorate || 'القاهرة',
      enrollmentDate: student.enrollmentDate || new Date().toISOString().split('T')[0],
      status: student.status || 'active',
      photoUrl: student.photoUrl || '',
      notes: student.notes || '',
      createdAt: student.createdAt || now,
    };

    // Supabase sync
    const supabase = getSupabase();
    if (supabase) {
      try {
        const payload = {
          student_code: studentRecord.studentCode,
          full_name: studentRecord.fullName,
          national_id: studentRecord.nationalId,
          birth_date: studentRecord.birthDate,
          birth_place: studentRecord.birthPlace,
          stage: studentRecord.stage,
          grade: studentRecord.grade,
          track: studentRecord.track || 'general',
          class_name: studentRecord.className,
          is_international: studentRecord.isInternational,
          nationality: studentRecord.internationalDetails?.nationality || 'مصري',
          passport_number: studentRecord.internationalDetails?.passportNumber,
          residence_number: studentRecord.internationalDetails?.residenceNumber,
          residence_expiry: studentRecord.internationalDetails?.residenceExpiry,
          madhhab: studentRecord.internationalDetails?.madhhab,
          native_language: studentRecord.internationalDetails?.nativeLanguage,
          embassy_contact: studentRecord.internationalDetails?.embassyContact,
          guardian_name: studentRecord.guardianName,
          guardian_relation: studentRecord.guardianRelation,
          guardian_phone: studentRecord.guardianPhone,
          guardian_job: studentRecord.guardianJob,
          address: studentRecord.address,
          governorate: studentRecord.governorate,
          enrollment_date: studentRecord.enrollmentDate,
          status: studentRecord.status,
          photo_url: studentRecord.photoUrl,
          notes: studentRecord.notes,
        };

        if (isNew) {
          await supabase.from('students').insert([payload]);
        } else {
          await supabase.from('students').update(payload).eq('id', studentRecord.id);
        }
      } catch (err) {
        console.warn('Could not write to Supabase table, saving locally:', err);
      }
    }

    // Always update local cache
    const updated = isNew
      ? [studentRecord, ...students]
      : students.map(s => s.id === studentRecord.id ? studentRecord : s);
    setStored('students', updated);

    return studentRecord;
  },

  async delete(id: string): Promise<void> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('students').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete error:', err);
      }
    }
    const students = getStored<Student[]>('students', INITIAL_STUDENTS);
    const filtered = students.filter(s => s.id !== id);
    setStored('students', filtered);
  },
};

// -----------------------------------------------------------------------------
// Staff Service
// -----------------------------------------------------------------------------

export const staffService = {
  async getAll(): Promise<StaffMember[]> {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase.from('staff').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map((item: any) => ({
          id: item.id,
          staffCode: item.staff_code,
          name: item.name,
          nationalId: item.national_id,
          role: item.role,
          specialization: item.specialization,
          stage: item.stage,
          phone: item.phone,
          email: item.email || '',
          qualification: item.qualification,
          hiringDate: item.hiring_date,
          weeklyQuota: item.weekly_quota,
          status: item.status,
        }));
      }
    }
    return getStored<StaffMember[]>('staff', INITIAL_STAFF);
  },

  async save(member: Partial<StaffMember>): Promise<StaffMember> {
    const staffList = await this.getAll();
    const isNew = !member.id;

    const record: StaffMember = {
      id: member.id || `stf-${Date.now()}`,
      staffCode: member.staffCode || `ST-${Math.floor(100 + Math.random() * 900)}`,
      name: member.name || '',
      nationalId: member.nationalId || '',
      role: member.role || 'teacher',
      specialization: member.specialization || '',
      stage: member.stage || 'both',
      phone: member.phone || '',
      email: member.email || '',
      qualification: member.qualification || 'ليسانس جامعة الأزهر',
      hiringDate: member.hiringDate || new Date().toISOString().split('T')[0],
      weeklyQuota: Number(member.weeklyQuota) || 18,
      status: member.status || 'active',
    };

    const supabase = getSupabase();
    if (supabase) {
      try {
        const payload = {
          staff_code: record.staffCode,
          name: record.name,
          national_id: record.nationalId,
          role: record.role,
          specialization: record.specialization,
          stage: record.stage,
          phone: record.phone,
          email: record.email,
          qualification: record.qualification,
          hiring_date: record.hiringDate,
          weekly_quota: record.weeklyQuota,
          status: record.status,
        };
        if (isNew) {
          await supabase.from('staff').insert([payload]);
        } else {
          await supabase.from('staff').update(payload).eq('id', record.id);
        }
      } catch (err) {
        console.warn('Supabase staff save error:', err);
      }
    }

    const updated = isNew
      ? [record, ...staffList]
      : staffList.map(s => s.id === record.id ? record : s);
    setStored('staff', updated);
    return record;
  },

  async delete(id: string): Promise<void> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('staff').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase staff delete error:', err);
      }
    }
    const staffList = getStored<StaffMember[]>('staff', INITIAL_STAFF);
    setStored('staff', staffList.filter(s => s.id !== id));
  },
};

// -----------------------------------------------------------------------------
// Classes & Schedules Service
// -----------------------------------------------------------------------------

export const classService = {
  async getAll(): Promise<ClassRoom[]> {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase.from('classes').select('*');
      if (!error && data && data.length > 0) {
        return data.map((item: any) => ({
          id: item.id,
          name: item.name,
          stage: item.stage,
          grade: item.grade,
          track: item.track,
          roomNumber: item.room_number,
          capacity: item.capacity,
          studentsCount: item.capacity ? Math.min(item.capacity - 5, 28) : 25,
          supervisorTeacherName: item.supervisor_teacher_name,
        }));
      }
    }
    return getStored<ClassRoom[]>('classes', INITIAL_CLASSES);
  },

  async save(cls: Partial<ClassRoom>): Promise<ClassRoom> {
    const classes = await this.getAll();
    const isNew = !cls.id;
    const record: ClassRoom = {
      id: cls.id || `cls-${Date.now()}`,
      name: cls.name || '',
      stage: cls.stage || 'preparatory',
      grade: cls.grade || 'prep_1',
      track: cls.track || 'general',
      roomNumber: cls.roomNumber || '',
      capacity: Number(cls.capacity) || 35,
      studentsCount: cls.studentsCount || 0,
      supervisorTeacherName: cls.supervisorTeacherName || '',
    };

    const supabase = getSupabase();
    if (supabase) {
      try {
        const payload = {
          name: record.name,
          stage: record.stage,
          grade: record.grade,
          track: record.track,
          room_number: record.roomNumber,
          capacity: record.capacity,
          supervisor_teacher_name: record.supervisorTeacherName,
        };
        if (isNew) {
          await supabase.from('classes').insert([payload]);
        } else {
          await supabase.from('classes').update(payload).eq('id', record.id);
        }
      } catch (err) {
        console.warn('Supabase class save error:', err);
      }
    }

    const updated = isNew
      ? [...classes, record]
      : classes.map(c => c.id === record.id ? record : c);
    setStored('classes', updated);
    return record;
  },
};

export const scheduleService = {
  async getAll(classId?: string): Promise<TimetablePeriod[]> {
    const all = getStored<TimetablePeriod[]>('schedules', INITIAL_SCHEDULES);
    if (classId) {
      return all.filter(s => s.classId === classId);
    }
    return all;
  },

  async save(entry: Partial<TimetablePeriod>): Promise<TimetablePeriod> {
    const all = await this.getAll();
    const isNew = !entry.id;
    const record: TimetablePeriod = {
      id: entry.id || `sch-${Date.now()}`,
      classId: entry.classId || 'cls-sec-2-sci',
      day: entry.day || 'الأحد',
      periodNumber: entry.periodNumber || 1,
      subjectId: entry.subjectId || 'sbj-01',
      subjectName: entry.subjectName || 'القرآن الكريم والتجويد',
      teacherId: entry.teacherId || 'stf-02',
      teacherName: entry.teacherName || 'الشيخ مصطفى عثمان',
      timeSlot: entry.timeSlot || '08:00 - 08:45',
    };
    const updated = isNew
      ? [...all, record]
      : all.map(s => s.id === record.id ? record : s);
    setStored('schedules', updated);
    return record;
  },

  async delete(id: string): Promise<void> {
    const all = await this.getAll();
    setStored('schedules', all.filter(s => s.id !== id));
  },
};

// -----------------------------------------------------------------------------
// Subjects Service
// -----------------------------------------------------------------------------

export const subjectService = {
  async getAll(): Promise<Subject[]> {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase.from('subjects').select('*');
      if (!error && data && data.length > 0) {
        return data.map((item: any) => ({
          id: item.id,
          code: item.code,
          name: item.name,
          category: item.category,
          stage: item.stage,
          grade: item.grade,
          track: item.track,
          maxGrade: Number(item.max_grade),
          minPassingGrade: Number(item.min_passing_grade),
          weeklyHours: Number(item.weekly_hours),
          description: item.description,
        }));
      }
    }
    return getStored<Subject[]>('subjects', INITIAL_SUBJECTS);
  },

  async save(subject: Partial<Subject>): Promise<Subject> {
    const subjects = await this.getAll();
    const isNew = !subject.id;
    const record: Subject = {
      id: subject.id || `sbj-${Date.now()}`,
      code: subject.code || `SUB-${Math.floor(10 + Math.random() * 90)}`,
      name: subject.name || '',
      category: subject.category || 'sharia',
      stage: subject.stage || 'both',
      grade: subject.grade || 'all',
      track: subject.track || 'all',
      maxGrade: Number(subject.maxGrade) || 50,
      minPassingGrade: Number(subject.minPassingGrade) || 25,
      weeklyHours: Number(subject.weeklyHours) || 3,
      description: subject.description || '',
    };
    const updated = isNew
      ? [...subjects, record]
      : subjects.map(s => s.id === record.id ? record : s);
    setStored('subjects', updated);
    return record;
  },
};

// -----------------------------------------------------------------------------
// Attendance Service
// -----------------------------------------------------------------------------

export const attendanceService = {
  async getRecords(classId?: string, date?: string): Promise<AttendanceRecord[]> {
    let records = getStored<AttendanceRecord[]>('attendance', INITIAL_ATTENDANCE);
    if (classId) {
      records = records.filter(r => r.classId === classId);
    }
    if (date) {
      records = records.filter(r => r.date === date);
    }
    return records;
  },

  async markAttendance(recordsToSave: AttendanceRecord[]): Promise<void> {
    const existing = getStored<AttendanceRecord[]>('attendance', INITIAL_ATTENDANCE);
    const existingMap = new Map(existing.map(r => [`${r.studentId}_${r.date}`, r]));

    for (const rec of recordsToSave) {
      existingMap.set(`${rec.studentId}_${rec.date}`, rec);
    }

    const updated = Array.from(existingMap.values());
    setStored('attendance', updated);

    const supabase = getSupabase();
    if (supabase) {
      try {
        const payload = recordsToSave.map(r => ({
          student_id: r.studentId,
          student_name: r.studentName,
          class_id: r.classId,
          date: r.date,
          status: r.status,
          notes: r.notes || '',
        }));
        await supabase.from('attendance').upsert(payload, { onConflict: 'student_id,date' });
      } catch (err) {
        console.warn('Supabase attendance sync error:', err);
      }
    }
  },
};

// -----------------------------------------------------------------------------
// Exam Results & Control Service
// -----------------------------------------------------------------------------

export const examService = {
  async getResults(studentId?: string, classId?: string): Promise<ExamResult[]> {
    let results = getStored<ExamResult[]>('exam_results', INITIAL_EXAM_RESULTS);
    if (studentId) {
      results = results.filter(r => r.studentId === studentId);
    }
    if (classId) {
      results = results.filter(r => r.classId === classId);
    }
    return results;
  },

  async saveResult(result: Partial<ExamResult>): Promise<ExamResult> {
    const all = await this.getResults();
    const isNew = !result.id;
    const total = (Number(result.courseworkScore) || 0) + (Number(result.oralScore) || 0) + (Number(result.writtenScore) || 0);
    const max = Number(result.maxScore) || 50;

    const record: ExamResult = {
      id: result.id || `res-${Date.now()}`,
      studentId: result.studentId || '',
      studentName: result.studentName || '',
      classId: result.classId || '',
      schoolYear: result.schoolYear || '2025/2026',
      term: result.term || 'الفصل الدراسي الأول',
      subjectId: result.subjectId || '',
      subjectName: result.subjectName || '',
      subjectCategory: result.subjectCategory || 'sharia',
      courseworkScore: Number(result.courseworkScore) || 0,
      oralScore: Number(result.oralScore) || 0,
      writtenScore: Number(result.writtenScore) || 0,
      totalScore: total,
      maxScore: max,
      isPassed: total >= (max / 2),
    };

    const updated = isNew
      ? [...all, record]
      : all.map(r => r.id === record.id ? record : r);
    setStored('exam_results', updated);
    return record;
  },
};

// -----------------------------------------------------------------------------
// Financial Fees & Receipts Service
// -----------------------------------------------------------------------------

export const feeService = {
  async getAll(): Promise<FeeRecord[]> {
    return getStored<FeeRecord[]>('fees', INITIAL_FEES);
  },

  async save(fee: Partial<FeeRecord>): Promise<FeeRecord> {
    const all = await this.getAll();
    const isNew = !fee.id;
    const amount = Number(fee.amount) || 0;
    const paid = Number(fee.paidAmount) || 0;
    const remaining = Math.max(0, amount - paid);

    const record: FeeRecord = {
      id: fee.id || `fee-${Date.now()}`,
      receiptNumber: fee.receiptNumber || `REC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
      studentId: fee.studentId || '',
      studentName: fee.studentName || '',
      grade: fee.grade || 'prep_1',
      schoolYear: fee.schoolYear || '2025/2026',
      feeType: fee.feeType || 'مصروفات دراسية',
      amount,
      paidAmount: paid,
      remainingAmount: remaining,
      paymentDate: fee.paymentDate || new Date().toISOString().split('T')[0],
      paymentMethod: fee.paymentMethod || 'نقدي',
      status: remaining === 0 ? 'paid' : (paid > 0 ? 'partial' : 'unpaid'),
      collectorName: fee.collectorName || 'أ. فريد شاكر المنياوي',
      notes: fee.notes || '',
    };

    const updated = isNew
      ? [record, ...all]
      : all.map(f => f.id === record.id ? record : f);
    setStored('fees', updated);
    return record;
  },
};

// -----------------------------------------------------------------------------
// Academic History Service
// -----------------------------------------------------------------------------

export const historyService = {
  async getByStudentId(studentId: string): Promise<AcademicHistoryRecord[]> {
    const all = getStored<AcademicHistoryRecord[]>('academic_history', INITIAL_ACADEMIC_HISTORY);
    return all.filter(h => h.studentId === studentId);
  },

  async getAll(): Promise<AcademicHistoryRecord[]> {
    return getStored<AcademicHistoryRecord[]>('academic_history', INITIAL_ACADEMIC_HISTORY);
  },

  async save(record: Partial<AcademicHistoryRecord>): Promise<AcademicHistoryRecord> {
    const all = await this.getAll();
    const isNew = !record.id;
    const total = (Number(record.term1Score) || 0) + (Number(record.term2Score) || 0);
    const max = Number(record.maxScore) || 600;
    const pct = Math.round((total / max) * 1000) / 10;

    let evalText: AcademicHistoryRecord['evaluation'] = 'مقبول';
    if (pct >= 85) evalText = 'ممتاز';
    else if (pct >= 75) evalText = 'جيد جداً';
    else if (pct >= 65) evalText = 'جيد';
    else if (pct < 50) evalText = 'دور ثان';

    const item: AcademicHistoryRecord = {
      id: record.id || `hist-${Date.now()}`,
      studentId: record.studentId || '',
      studentName: record.studentName || '',
      schoolYear: record.schoolYear || '2024/2025',
      stage: record.stage || 'secondary',
      grade: record.grade || 'sec_1',
      track: record.track || 'general',
      term1Score: Number(record.term1Score) || 0,
      term2Score: Number(record.term2Score) || 0,
      totalScore: total,
      maxScore: max,
      percentage: pct,
      evaluation: record.evaluation || evalText,
      rankInClass: record.rankInClass,
      conduct: record.conduct || 'حسن السير والسلوك',
      notes: record.notes || '',
    };

    const updated = isNew
      ? [item, ...all]
      : all.map(h => h.id === item.id ? item : h);
    setStored('academic_history', updated);
    return item;
  },
};

// -----------------------------------------------------------------------------
// Batch Sync to Supabase helper
// -----------------------------------------------------------------------------

export async function uploadLocalDataToSupabase(): Promise<{ ok: boolean; count: number; error?: string }> {
  const supabase = getSupabase();
  if (!supabase) {
    return { ok: false, count: 0, error: 'الاتصال بقاعدة بيانات Supabase غير متاح حالياً.' };
  }

  try {
    const students = getStored<Student[]>('students', INITIAL_STUDENTS);
    let inserted = 0;

    for (const s of students) {
      const payload = {
        student_code: s.studentCode,
        full_name: s.fullName,
        national_id: s.nationalId,
        birth_date: s.birthDate,
        birth_place: s.birthPlace,
        stage: s.stage,
        grade: s.grade,
        track: s.track || 'general',
        class_name: s.className,
        is_international: s.isInternational,
        nationality: s.internationalDetails?.nationality || 'مصري',
        passport_number: s.internationalDetails?.passportNumber || null,
        residence_number: s.internationalDetails?.residenceNumber || null,
        residence_expiry: s.internationalDetails?.residenceExpiry || null,
        madhhab: s.internationalDetails?.madhhab || null,
        native_language: s.internationalDetails?.nativeLanguage || null,
        embassy_contact: s.internationalDetails?.embassyContact || null,
        guardian_name: s.guardianName,
        guardian_relation: s.guardianRelation,
        guardian_phone: s.guardianPhone,
        guardian_job: s.guardianJob,
        address: s.address,
        governorate: s.governorate,
        enrollment_date: s.enrollmentDate,
        status: s.status,
        photo_url: s.photoUrl,
        notes: s.notes,
      };

      const { error } = await supabase.from('students').upsert(payload, { onConflict: 'student_code' });
      if (!error) inserted++;
    }

    return { ok: true, count: inserted };
  } catch (err: any) {
    return { ok: false, count: 0, error: err?.message || 'خطأ أثناء رفع البيانات إلى Supabase' };
  }
}
