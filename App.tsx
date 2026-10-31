/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Header } from './components/Header';
import { Sidebar, NavSection } from './components/Sidebar';
import { DashboardView } from './components/views/DashboardView';
import { StudentsView } from './components/views/StudentsView';
import { AcademicHistoryView } from './components/views/AcademicHistoryView';
import { PrepStageView } from './components/views/PrepStageView';
import { SecStageView } from './components/views/SecStageView';
import { InternationalStudentsView } from './components/views/InternationalStudentsView';
import { StaffView } from './components/views/StaffView';
import { ClassesSchedulesView } from './components/views/ClassesSchedulesView';
import { SubjectsView } from './components/views/SubjectsView';
import { AttendanceView } from './components/views/AttendanceView';
import { ExamsView } from './components/views/ExamsView';
import { FeesView } from './components/views/FeesView';
import { ReportsView } from './components/views/ReportsView';
import { UsersView } from './components/views/UsersView';

// Modals
import { StudentModal } from './components/modals/StudentModal';
import { CertificateModal } from './components/modals/CertificateModal';
import { RosterPrintModal } from './components/modals/RosterPrintModal';
import { ReceiptPrintModal } from './components/modals/ReceiptPrintModal';
import { SupabaseSettingsModal } from './components/modals/SupabaseSettingsModal';
import { LoginModal } from './components/modals/LoginModal';
import { InstituteSettingsModal } from './components/modals/InstituteSettingsModal';
import { StudentIdCardModal } from './components/modals/StudentIdCardModal';
import { StudentApplicationModal } from './components/modals/StudentApplicationModal';
import { OfficialLetterModal } from './components/modals/OfficialLetterModal';
import { AcademicProgressionModal } from './components/modals/AcademicProgressionModal';
import { GraduationCertificateModal } from './components/modals/GraduationCertificateModal';
import { ExamSchedulePrintModal } from './components/modals/ExamSchedulePrintModal';
import { SeatNumbersModal } from './components/modals/SeatNumbersModal';
import { TimetablePrintModal } from './components/modals/TimetablePrintModal';
import { INITIAL_EXAM_SCHEDULES } from './lib/mockData';

// Services & Branding
import {
  studentService,
  staffService,
  classService,
  subjectService,
  scheduleService,
  attendanceService,
  examService,
  feeService,
  historyService,
  authService,
} from './lib/supabaseService';
import { testSupabaseConnection, ConnectionTestResult } from './lib/supabaseClient';
import {
  getInstituteSettings,
  saveInstituteSettings,
  DEFAULT_INSTITUTE_SETTINGS,
} from './lib/instituteSettings';
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
  InstituteSettings,
} from './types';

export default function App() {
  const [currentSection, setCurrentSection] = useState<NavSection>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Core Data Collections
  const [students, setStudents] = useState<Student[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [schedules, setSchedules] = useState<TimetablePeriod[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [examResults, setExamResults] = useState<ExamResult[]>([]);
  const [fees, setFees] = useState<FeeRecord[]>([]);
  const [academicHistory, setAcademicHistory] = useState<AcademicHistoryRecord[]>([]);

  // Institute Branding & Customization
  const [instituteSettings, setInstituteSettings] = useState<InstituteSettings>(DEFAULT_INSTITUTE_SETTINGS);

  // Auth & Connection
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [supabaseStatus, setSupabaseStatus] = useState<ConnectionTestResult | null>(null);

  // Modal States
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [certificateStudent, setCertificateStudent] = useState<Student | null>(null);

  const [isRosterModalOpen, setIsRosterModalOpen] = useState(false);
  const [rosterClass, setRosterClass] = useState<ClassRoom | null>(null);

  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [receiptFee, setReceiptFee] = useState<FeeRecord | null>(null);

  const [isIdCardModalOpen, setIsIdCardModalOpen] = useState(false);
  const [idCardStudent, setIdCardStudent] = useState<Student | null>(null);

  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [applicationStudent, setApplicationStudent] = useState<Student | null>(null);

  const [isOfficialLetterModalOpen, setIsOfficialLetterModalOpen] = useState(false);
  const [officialLetterStudent, setOfficialLetterStudent] = useState<Student | null>(null);

  // Additional Azharite Document & Print Modals
  const [isProgressionModalOpen, setIsProgressionModalOpen] = useState(false);
  const [progressionStudent, setProgressionStudent] = useState<Student | null>(null);

  const [isGraduationModalOpen, setIsGraduationModalOpen] = useState(false);
  const [graduationStudent, setGraduationStudent] = useState<Student | null>(null);

  const [isExamScheduleModalOpen, setIsExamScheduleModalOpen] = useState(false);
  const [isSeatNumbersModalOpen, setIsSeatNumbersModalOpen] = useState(false);

  const [isTimetableModalOpen, setIsTimetableModalOpen] = useState(false);
  const [timetableMode, setTimetableMode] = useState<'class' | 'teacher'>('class');

  const [isInstituteSettingsModalOpen, setIsInstituteSettingsModalOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Initial Load
  useEffect(() => {
    loadAllData();
    checkConnection();
    checkAuth();
    setInstituteSettings(getInstituteSettings());

    const handleSettingsUpdated = () => {
      setInstituteSettings(getInstituteSettings());
    };
    window.addEventListener('institute-settings-updated', handleSettingsUpdated);
    return () => window.removeEventListener('institute-settings-updated', handleSettingsUpdated);
  }, []);

  const loadAllData = async () => {
    try {
      const [stds, stf, cls, subs, sch, att, exm, fe, hist] = await Promise.all([
        studentService.getAll(),
        staffService.getAll(),
        classService.getAll(),
        subjectService.getAll(),
        scheduleService.getAll(),
        attendanceService.getRecords(),
        examService.getResults(),
        feeService.getAll(),
        historyService.getAll(),
      ]);

      setStudents(stds);
      setStaff(stf);
      setClasses(cls);
      setSubjects(subs);
      setSchedules(sch);
      setAttendanceRecords(att);
      setExamResults(exm);
      setFees(fe);
      setAcademicHistory(hist);
    } catch (e) {
      console.error('Failed to load application data:', e);
    }
  };

  const checkConnection = async () => {
    try {
      const res = await testSupabaseConnection();
      setSupabaseStatus(res);
    } catch {
      setSupabaseStatus({ ok: false, message: 'تعذر الاتصال بـ Supabase' });
    }
  };

  const checkAuth = async () => {
    const user = await authService.getCurrentUser();
    setCurrentUser(user);
  };

  // Section title mapper
  const getSectionTitle = () => {
    switch (currentSection) {
      case 'dashboard': return 'لوحة التحكم والإحصائيات الرئيسية';
      case 'students': return 'شؤون الطلاب وقيد الدارسين والمطبوعات';
      case 'academic-history': return 'التدرج الدراسي والسجل التاريخي';
      case 'prep-stage': return 'المرحلة الإعدادية الأزهرية';
      case 'sec-stage': return 'المرحلة الثانوية الأزهرية (علمي وأدبي)';
      case 'international': return 'شؤون الطلاب الوافدين';
      case 'staff': return 'هيئة التدريس والموظفون';
      case 'classes-schedules': return 'الفصول والجداول الدراسية الأسبوعية';
      case 'subjects': return 'المناهج والمقررات الأزهرية';
      case 'attendance': return 'الحضور والغياب اليومي';
      case 'exams': return 'كنترول الامتحانات والدرجات';
      case 'fees': return 'الشؤون المالية والمصروفات والإيصالات';
      case 'reports': return 'مركز الطباعة الشامل وكافة الأوراق A4';
      case 'users': return 'إدارة المستخدمين والصلاحيات';
      case 'institute-settings': return 'تعديل الشعار والختم واسم المعهد';
      case 'official-letter': return 'محرر وطباعة أي ورقة أو خطاب رسمي A4';
      case 'supabase-settings': return 'إعدادات ربط قاعدة بيانات Supabase';
      default: return instituteSettings.instituteName;
    }
  };

  // Student CRUD
  const handleSaveStudent = async (studentData: Partial<Student>) => {
    await studentService.save(studentData);
    const updated = await studentService.getAll();
    setStudents(updated);
    setIsStudentModalOpen(false);
  };

  const handleDeleteStudent = async (id: string) => {
    await studentService.delete(id);
    const updated = await studentService.getAll();
    setStudents(updated);
  };

  // Staff CRUD
  const handleSaveStaff = async (memberData: Partial<StaffMember>) => {
    await staffService.save(memberData);
    const updated = await staffService.getAll();
    setStaff(updated);
  };

  const handleDeleteStaff = async (id: string) => {
    await staffService.delete(id);
    const updated = await staffService.getAll();
    setStaff(updated);
  };

  // Schedule CRUD
  const handleSaveSchedule = async (entry: Partial<TimetablePeriod>) => {
    await scheduleService.save(entry);
    const updated = await scheduleService.getAll();
    setSchedules(updated);
  };

  // Subject CRUD
  const handleSaveSubject = async (sub: Partial<Subject>) => {
    await subjectService.save(sub);
    const updated = await subjectService.getAll();
    setSubjects(updated);
  };

  // Attendance
  const handleSaveAttendance = async (records: AttendanceRecord[]) => {
    await attendanceService.markAttendance(records);
    const updated = await attendanceService.getRecords();
    setAttendanceRecords(updated);
  };

  // Exams
  const handleSaveExamResult = async (res: Partial<ExamResult>) => {
    await examService.saveResult(res);
    const updated = await examService.getResults();
    setExamResults(updated);
  };

  // Fees
  const handleSaveFee = async (fee: Partial<FeeRecord>) => {
    await feeService.save(fee);
    const updated = await feeService.getAll();
    setFees(updated);
  };

  // Academic History
  const handleSaveAcademicHistory = async (rec: Partial<AcademicHistoryRecord>) => {
    await historyService.save(rec);
    const updated = await historyService.getAll();
    setAcademicHistory(updated);
  };

  // Modal triggers
  const handleOpenCertificate = (student: Student) => {
    setCertificateStudent(student);
    setIsCertificateModalOpen(true);
  };

  const handleOpenIdCard = (student: Student) => {
    setIdCardStudent(student);
    setIsIdCardModalOpen(true);
  };

  const handleOpenApplication = (student: Student) => {
    setApplicationStudent(student);
    setIsApplicationModalOpen(true);
  };

  const handleOpenOfficialLetter = (student?: Student) => {
    setOfficialLetterStudent(student || null);
    setIsOfficialLetterModalOpen(true);
  };

  const handleOpenRoster = (cls: ClassRoom) => {
    setRosterClass(cls);
    setIsRosterModalOpen(true);
  };

  const handleOpenReceipt = (fee: FeeRecord) => {
    setReceiptFee(fee);
    setIsReceiptModalOpen(true);
  };

  const handleOpenNewStudent = () => {
    setEditingStudent(null);
    setIsStudentModalOpen(true);
  };

  const handleOpenEditStudent = (student: Student) => {
    setEditingStudent(student);
    setIsStudentModalOpen(true);
  };

  const handleOpenProgression = (student: Student) => {
    setProgressionStudent(student);
    setIsProgressionModalOpen(true);
  };

  const handleOpenGraduation = (student: Student) => {
    setGraduationStudent(student);
    setIsGraduationModalOpen(true);
  };

  const handleOpenExamSchedule = () => {
    setIsExamScheduleModalOpen(true);
  };

  const handleOpenSeatNumbers = () => {
    setIsSeatNumbersModalOpen(true);
  };

  const handleOpenClassTimetable = () => {
    setTimetableMode('class');
    setIsTimetableModalOpen(true);
  };

  const handleOpenTeacherTimetable = () => {
    setTimetableMode('teacher');
    setIsTimetableModalOpen(true);
  };

  const handleUpdateStudents = async (updatedStudents: Student[]) => {
    setStudents(updatedStudents);
  };

  const handleLogout = async () => {
    await authService.signOut();
    setCurrentUser(null);
  };

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 flex flex-col font-sans selection:bg-emerald-800 selection:text-amber-100">
      
      {/* Top Header */}
      <Header
        currentUser={currentUser}
        supabaseStatus={supabaseStatus}
        instituteSettings={instituteSettings}
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
        onOpenInstituteSettingsModal={() => setIsInstituteSettingsModalOpen(true)}
        onOpenOfficialLetterModal={() => handleOpenOfficialLetter()}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
        currentSectionTitle={getSectionTitle()}
      />

      {/* Mobile Bar for toggling sidebar */}
      <div className="lg:hidden bg-white border-b border-stone-200 px-4 py-2.5 flex items-center justify-between no-print sticky top-20 z-20">
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="flex items-center gap-2 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-lg cursor-pointer"
        >
          {isMobileSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          <span>أقسام النظام الأزهري</span>
        </button>

        <span className="text-xs font-bold text-emerald-900 truncate max-w-[200px]">
          {getSectionTitle()}
        </span>
      </div>

      {/* Main Layout Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-row">
        
        {/* Navigation Sidebar */}
        <Sidebar
          currentSection={currentSection}
          onSelectSection={(sec) => {
            if (sec === 'supabase-settings') {
              setIsSupabaseModalOpen(true);
            } else if (sec === 'institute-settings') {
              setIsInstituteSettingsModalOpen(true);
            } else if (sec === 'official-letter') {
              handleOpenOfficialLetter();
            } else {
              setCurrentSection(sec);
            }
          }}
          counts={{
            totalStudents: students.length,
            internationalStudents: students.filter(s => s.isInternational).length,
            staffCount: staff.length,
            prepCount: students.filter(s => s.stage === 'preparatory').length,
            secCount: students.filter(s => s.stage === 'secondary').length,
          }}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          {currentSection === 'dashboard' && (
            <DashboardView
              students={students}
              staff={staff}
              classes={classes}
              fees={fees}
              onOpenNewStudent={handleOpenNewStudent}
              onOpenCertificate={handleOpenCertificate}
              onOpenRoster={handleOpenRoster}
              onNavigateSection={(sec) => setCurrentSection(sec)}
            />
          )}

          {currentSection === 'students' && (
            <StudentsView
              students={students}
              classes={classes}
              onAddStudent={handleOpenNewStudent}
              onEditStudent={handleOpenEditStudent}
              onDeleteStudent={handleDeleteStudent}
              onPrintCertificate={handleOpenCertificate}
              onPrintIdCard={handleOpenIdCard}
              onPrintApplication={handleOpenApplication}
              onPrintOfficialLetter={handleOpenOfficialLetter}
              onPrintProgression={handleOpenProgression}
              onPrintGraduationCertificate={handleOpenGraduation}
              onOpenSeatNumbers={handleOpenSeatNumbers}
              onViewHistory={(s) => setCurrentSection('academic-history')}
            />
          )}

          {currentSection === 'academic-history' && (
            <AcademicHistoryView
              students={students}
              records={academicHistory}
              onSaveRecord={handleSaveAcademicHistory}
              onPrintCertificate={handleOpenCertificate}
              onPrintProgression={handleOpenProgression}
              onPrintGraduationCertificate={handleOpenGraduation}
            />
          )}

          {currentSection === 'prep-stage' && (
            <PrepStageView
              students={students}
              classes={classes}
              onAddStudent={handleOpenNewStudent}
              onEditStudent={handleOpenEditStudent}
              onPrintCertificate={handleOpenCertificate}
              onPrintRoster={handleOpenRoster}
            />
          )}

          {currentSection === 'sec-stage' && (
            <SecStageView
              students={students}
              classes={classes}
              onAddStudent={handleOpenNewStudent}
              onEditStudent={handleOpenEditStudent}
              onPrintCertificate={handleOpenCertificate}
              onPrintRoster={handleOpenRoster}
            />
          )}

          {currentSection === 'international' && (
            <InternationalStudentsView
              students={students}
              onAddStudent={handleOpenNewStudent}
              onEditStudent={handleOpenEditStudent}
              onPrintCertificate={handleOpenCertificate}
              onPrintProgression={handleOpenProgression}
            />
          )}

          {currentSection === 'staff' && (
            <StaffView
              staff={staff}
              onSaveStaff={handleSaveStaff}
              onDeleteStaff={handleDeleteStaff}
            />
          )}

          {currentSection === 'classes-schedules' && (
            <ClassesSchedulesView
              classes={classes}
              schedules={schedules}
              subjects={subjects}
              staff={staff}
              onSaveSchedule={handleSaveSchedule}
              onPrintRoster={handleOpenRoster}
              onPrintClassTimetable={handleOpenClassTimetable}
              onPrintTeacherTimetable={handleOpenTeacherTimetable}
            />
          )}

          {currentSection === 'subjects' && (
            <SubjectsView
              subjects={subjects}
              onSaveSubject={handleSaveSubject}
            />
          )}

          {currentSection === 'attendance' && (
            <AttendanceView
              students={students}
              classes={classes}
              attendanceRecords={attendanceRecords}
              onSaveAttendance={handleSaveAttendance}
            />
          )}

          {currentSection === 'exams' && (
            <ExamsView
              students={students}
              classes={classes}
              subjects={subjects}
              examResults={examResults}
              onSaveResult={handleSaveExamResult}
              onPrintCertificate={handleOpenCertificate}
              onOpenExamSchedule={handleOpenExamSchedule}
              onOpenSeatNumbers={handleOpenSeatNumbers}
            />
          )}

          {currentSection === 'fees' && (
            <FeesView
              students={students}
              fees={fees}
              onSaveFee={handleSaveFee}
              onPrintReceipt={handleOpenReceipt}
            />
          )}

          {currentSection === 'reports' && (
            <ReportsView
              students={students}
              classes={classes}
              fees={fees}
              staff={staff}
              instituteSettings={instituteSettings}
              onPrintCertificate={handleOpenCertificate}
              onPrintRoster={handleOpenRoster}
              onPrintIdCard={handleOpenIdCard}
              onPrintApplication={handleOpenApplication}
              onOpenOfficialLetter={handleOpenOfficialLetter}
              onOpenInstituteSettings={() => setIsInstituteSettingsModalOpen(true)}
              onPrintProgression={handleOpenProgression}
              onPrintGraduationCertificate={handleOpenGraduation}
              onOpenSeatNumbers={handleOpenSeatNumbers}
              onOpenExamSchedule={handleOpenExamSchedule}
              onPrintClassTimetable={handleOpenClassTimetable}
              onPrintTeacherTimetable={handleOpenTeacherTimetable}
            />
          )}

          {currentSection === 'users' && (
            <UsersView
              currentUser={currentUser}
              onOpenLoginModal={() => setIsLoginModalOpen(true)}
              onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
            />
          )}
        </main>

      </div>

      {/* All Print & Settings Modals */}
      <StudentModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        onSave={handleSaveStudent}
        initialStudent={editingStudent}
        classes={classes}
      />

      <CertificateModal
        isOpen={isCertificateModalOpen}
        onClose={() => setIsCertificateModalOpen(false)}
        student={certificateStudent}
        examResults={examResults}
        subjects={subjects}
        instituteSettings={instituteSettings}
      />

      <StudentIdCardModal
        isOpen={isIdCardModalOpen}
        onClose={() => setIsIdCardModalOpen(false)}
        student={idCardStudent}
        instituteSettings={instituteSettings}
      />

      <StudentApplicationModal
        isOpen={isApplicationModalOpen}
        onClose={() => setIsApplicationModalOpen(false)}
        student={applicationStudent}
        instituteSettings={instituteSettings}
      />

      <OfficialLetterModal
        isOpen={isOfficialLetterModalOpen}
        onClose={() => setIsOfficialLetterModalOpen(false)}
        students={students}
        initialStudent={officialLetterStudent}
        instituteSettings={instituteSettings}
      />

      <RosterPrintModal
        isOpen={isRosterModalOpen}
        onClose={() => setIsRosterModalOpen(false)}
        selectedClass={rosterClass}
        students={students}
        instituteSettings={instituteSettings}
      />

      <ReceiptPrintModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        feeRecord={receiptFee}
        instituteSettings={instituteSettings}
      />

      <InstituteSettingsModal
        isOpen={isInstituteSettingsModalOpen}
        onClose={() => setIsInstituteSettingsModalOpen(false)}
        onUpdated={(updated) => setInstituteSettings(updated)}
      />

      <SupabaseSettingsModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        onConnectionUpdated={() => {
          checkConnection();
          loadAllData();
        }}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={(u) => {
          setCurrentUser(u);
          loadAllData();
        }}
        onOpenSupabaseSettings={() => setIsSupabaseModalOpen(true)}
      />

      <AcademicProgressionModal
        isOpen={isProgressionModalOpen}
        onClose={() => setIsProgressionModalOpen(false)}
        student={progressionStudent}
        academicHistory={academicHistory}
        instituteSettings={instituteSettings}
      />

      <GraduationCertificateModal
        isOpen={isGraduationModalOpen}
        onClose={() => setIsGraduationModalOpen(false)}
        student={graduationStudent}
        instituteSettings={instituteSettings}
      />

      <ExamSchedulePrintModal
        isOpen={isExamScheduleModalOpen}
        onClose={() => setIsExamScheduleModalOpen(false)}
        schedules={INITIAL_EXAM_SCHEDULES}
        instituteSettings={instituteSettings}
      />

      <SeatNumbersModal
        isOpen={isSeatNumbersModalOpen}
        onClose={() => setIsSeatNumbersModalOpen(false)}
        students={students}
        instituteSettings={instituteSettings}
        onUpdateStudents={handleUpdateStudents}
      />

      <TimetablePrintModal
        isOpen={isTimetableModalOpen}
        onClose={() => setIsTimetableModalOpen(false)}
        defaultMode={timetableMode}
        classes={classes}
        staff={staff}
        schedules={schedules}
        instituteSettings={instituteSettings}
      />

    </div>
  );
}
