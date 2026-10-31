/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type StageType = 'preparatory' | 'secondary';

export type PrepGradeType = 'prep_1' | 'prep_2' | 'prep_3';
export type SecGradeType = 'sec_1' | 'sec_2' | 'sec_3';
export type GradeType = PrepGradeType | SecGradeType;

export type TrackType = 'general' | 'scientific' | 'literary';

export type MadhhabType = 'شافعي' | 'حنفي' | 'مالكي' | 'حنبلي';

export type StudentStatus = 'active' | 'transferred' | 'graduated' | 'suspended';

export interface InternationalDetails {
  nationality: string;
  passportNumber: string;
  passportExpiryDate?: string; // تاريخ انتهاء جواز السفر
  residenceNumber: string;
  residenceExpiry: string;
  madhhab: MadhhabType;
  nativeLanguage: string;
  embassyContact: string;
  whatsappNumber?: string;
  azharEnrollmentDate?: string; // تاريخ الالتحاق بالأزهر
  scholarshipStatus?: string; // على منح الأزهر / نفقة خاصة
}

export interface Student {
  id: string;
  recordNumber: number; // رقم السجل (يبدأ من 1 إلى ما لا نهاية، وهو رقم الطالب على البطاقة)
  seatNumber?: number; // رقم الجلوس (يبدأ من 1000 إلى ما لا نهاية ويتم إصداره تلقائياً)
  studentCode: string; // كود الطالب الأزهري
  fullName: string;
  nationalId: string; // الرقم القومي أو رقم الجواز
  birthDate: string;
  birthPlace: string;
  stage: StageType;
  grade: GradeType;
  track?: TrackType; // للثانوي فقط
  classId: string;
  className: string;
  isInternational: boolean; // وافد
  internationalDetails?: InternationalDetails;
  guardianName: string;
  guardianRelation: string;
  guardianPhone: string;
  guardianJob: string;
  address: string;
  governorate: string;
  enrollmentDate: string;
  status: StudentStatus;
  photoUrl: string;
  notes?: string;
  createdAt?: string;
}

export interface ExamScheduleItem {
  id: string;
  stage: StageType;
  grade: GradeType;
  track?: TrackType;
  term: 'الفصل الدراسي الأول' | 'الفصل الدراسي الثاني' | 'الدور الثاني';
  day: string;
  date: string;
  periodNumber: number;
  subjectName: string;
  duration: string;
  startTime: string;
  endTime: string;
  notes?: string;
}

export type ProgressionDocType = 'international_azhar' | 'general_all';

export interface AcademicHistoryRecord {
  id: string;
  studentId: string;
  studentName?: string;
  schoolYear: string; // e.g. 2024/2025
  stage: StageType;
  grade: GradeType;
  track?: TrackType;
  term1Score: number;
  term2Score: number;
  totalScore: number;
  maxScore: number;
  percentage: number;
  evaluation: 'ممتاز' | 'جيد جداً' | 'جيد' | 'مقبول' | 'دور ثان';
  rankInClass?: number;
  conduct: string; // حسن السير والسلوك
  notes?: string;
}

export type StaffRole = 
  | 'headmaster'       // ناظر المعهد
  | 'teacher'          // معلم أزهري
  | 'student_affairs'  // مسؤول شؤون الطلاب
  | 'control'          // مسؤول الكنترول
  | 'accountant'       // مسؤول الخزينة والحسابات
  | 'admin_staff';     // إداري

export interface StaffMember {
  id: string;
  staffCode: string;
  name: string;
  nationalId: string;
  role: StaffRole;
  isTeachingStaff?: boolean; // هل هو عضو هيئة تدريس يشرح حصصاً (الإداريون لا يشرحون حصص)
  specialization: string; // e.g. فقه شافعي، نحو وصرف، قرآن كريم، رياضيات
  stage: 'preparatory' | 'secondary' | 'both';
  phone: string;
  email: string;
  qualification: string; // المؤهل الدراسي e.g. ليسانس أصول دين، دراسات إسلامية
  hiringDate: string;
  weeklyQuota: number; // النصاب الأسبوعي (عدد الحصص) - الإداري نصابه 0
  status: 'active' | 'on_leave';
  photoUrl?: string;
}

export interface ClassRoom {
  id: string;
  name: string; // e.g. 1/1 إعدادي، 2/1 ثانوي علمي
  stage: StageType;
  grade: GradeType;
  track?: TrackType;
  roomNumber: string;
  capacity: number;
  studentsCount: number;
  supervisorTeacherId?: string;
  supervisorTeacherName?: string;
}

export interface TimetablePeriod {
  id: string;
  classId: string;
  day: 'الأحد' | 'الاثنين' | 'الثلاثاء' | 'الأربعاء' | 'الخميس';
  periodNumber: number; // 1 to 7
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  timeSlot: string;
}

export type SubjectCategory = 'sharia' | 'arabic' | 'cultural' | 'scientific';

export interface Subject {
  id: string;
  code: string;
  name: string;
  category: SubjectCategory; // شرعية، عربية، ثقافية، علمية
  stage: 'preparatory' | 'secondary' | 'both';
  grade: GradeType | 'all';
  track?: TrackType | 'all';
  maxGrade: number; // الدرجة العظمى
  minPassingGrade: number; // درجة النجاح
  weeklyHours: number; // عدد الحصص أسبوعياً
  description?: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  classId: string;
  date: string; // YYYY-MM-DD
  status: 'present' | 'absent' | 'excused' | 'late';
  notes?: string;
}

export interface ExamResult {
  id: string;
  studentId: string;
  studentName: string;
  classId: string;
  schoolYear: string;
  term: 'الفصل الدراسي الأول' | 'الفصل الدراسي الثاني';
  subjectId: string;
  subjectName: string;
  subjectCategory: SubjectCategory;
  courseworkScore: number; // أعمال السنة
  oralScore: number;       // الشفهي والقرآن الكريم
  writtenScore: number;    // التحريري
  totalScore: number;
  maxScore: number;
  isPassed: boolean;
}

export type FeeStatus = 'paid' | 'partial' | 'unpaid';

export interface FeeRecord {
  id: string;
  receiptNumber: string; // رقم الإيصال المالي
  studentId: string;
  studentName: string;
  grade: GradeType;
  schoolYear: string;
  feeType: 'مصروفات دراسية' | 'كتب أزهرية' | 'أنشطة ورعاية وافدين' | 'اشتراك حافلة' | 'استمارة الشهادة';
  amount: number;
  paidAmount: number;
  remainingAmount: number;
  paymentDate: string;
  paymentMethod: 'نقدي' | 'فوري' | 'بريد مصري' | 'حوالة بنكية';
  status: FeeStatus;
  collectorName: string;
  notes?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: StaffRole;
  phone?: string;
  avatarUrl?: string;
  lastLogin?: string;
}

export interface InstituteSettings {
  instituteName: string;
  stageDescription: string;
  sectorName: string;
  regionName: string;
  administrationName: string;
  instituteCode: string;
  establishedYear: string;
  academicYear: string;
  logoUrl: string;
  sealUrl: string;
  headmasterName: string;
  studentAffairsHead: string;
  controlHead: string;
  financialHead: string;
  address: string;
  phone: string;
}
