/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Globe2,
  BookOpen,
  Calendar,
  Phone,
  MapPin,
  Camera,
  CheckCircle,
} from 'lucide-react';
import {
  Student,
  StageType,
  GradeType,
  TrackType,
  MadhhabType,
  StudentStatus,
  ClassRoom,
} from '../../types';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (student: Partial<Student>) => Promise<void>;
  initialStudent?: Student | null;
  classes: ClassRoom[];
}

export const StudentModal: React.FC<StudentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialStudent,
  classes,
}) => {
  const [fullName, setFullName] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [birthDate, setBirthDate] = useState('2010-01-01');
  const [birthPlace, setBirthPlace] = useState('القاهرة');
  const [stage, setStage] = useState<StageType>('preparatory');
  const [grade, setGrade] = useState<GradeType>('prep_1');
  const [track, setTrack] = useState<TrackType>('general');
  const [classId, setClassId] = useState('');
  const [className, setClassName] = useState('');
  const [isInternational, setIsInternational] = useState(false);
  
  // Official Azhar Numbers
  const [recordNumber, setRecordNumber] = useState<number>(1);
  const [seatNumber, setSeatNumber] = useState<number | undefined>(undefined);

  // International details
  const [nationality, setNationality] = useState('ماليزي');
  const [passportNumber, setPassportNumber] = useState('');
  const [passportExpiryDate, setPassportExpiryDate] = useState('2028-06-30');
  const [residenceNumber, setResidenceNumber] = useState('');
  const [residenceExpiry, setResidenceExpiry] = useState('2027-09-30');
  const [madhhab, setMadhhab] = useState<MadhhabType>('شافعي');
  const [nativeLanguage, setNativeLanguage] = useState('الملايوية');
  const [embassyContact, setEmbassyContact] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [azharEnrollmentDate, setAzharEnrollmentDate] = useState('2025-09-01');

  // Guardian
  const [guardianName, setGuardianName] = useState('');
  const [guardianRelation, setGuardianRelation] = useState('أب');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [guardianJob, setGuardianJob] = useState('');

  // Address
  const [address, setAddress] = useState('');
  const [governorate, setGovernorate] = useState('القاهرة');
  const [photoUrl, setPhotoUrl] = useState('');
  const [status, setStatus] = useState<StudentStatus>('active');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialStudent) {
      setFullName(initialStudent.fullName);
      setRecordNumber(initialStudent.recordNumber || 1);
      setSeatNumber(initialStudent.seatNumber);
      setNationalId(initialStudent.nationalId);
      setBirthDate(initialStudent.birthDate);
      setBirthPlace(initialStudent.birthPlace);
      setStage(initialStudent.stage);
      setGrade(initialStudent.grade);
      setTrack(initialStudent.track || 'general');
      setClassId(initialStudent.classId);
      setClassName(initialStudent.className);
      setIsInternational(initialStudent.isInternational);
      if (initialStudent.internationalDetails) {
        setNationality(initialStudent.internationalDetails.nationality);
        setPassportNumber(initialStudent.internationalDetails.passportNumber);
        setPassportExpiryDate(initialStudent.internationalDetails.passportExpiryDate || '2028-06-30');
        setResidenceNumber(initialStudent.internationalDetails.residenceNumber);
        setResidenceExpiry(initialStudent.internationalDetails.residenceExpiry);
        setMadhhab(initialStudent.internationalDetails.madhhab);
        setNativeLanguage(initialStudent.internationalDetails.nativeLanguage);
        setEmbassyContact(initialStudent.internationalDetails.embassyContact);
        setWhatsappNumber(initialStudent.internationalDetails.whatsappNumber || '');
        setAzharEnrollmentDate(initialStudent.internationalDetails.azharEnrollmentDate || '');
      }
      setGuardianName(initialStudent.guardianName);
      setGuardianRelation(initialStudent.guardianRelation);
      setGuardianPhone(initialStudent.guardianPhone);
      setGuardianJob(initialStudent.guardianJob);
      setAddress(initialStudent.address);
      setGovernorate(initialStudent.governorate);
      setPhotoUrl(initialStudent.photoUrl);
      setStatus(initialStudent.status);
      setNotes(initialStudent.notes || '');
    } else {
      // Defaults for new student
      setFullName('');
      setRecordNumber(classes.length > 0 ? 11 : 1);
      setSeatNumber(undefined);
      setNationalId('');
      setBirthDate('2010-01-01');
      setBirthPlace('القاهرة');
      setStage('preparatory');
      setGrade('prep_1');
      setTrack('general');
      setClassId(classes[0]?.id || '');
      setClassName(classes[0]?.name || 'الصف الأول الإعدادي (1/1)');
      setIsInternational(false);
      setNationality('ماليزي');
      setPassportNumber('');
      setPassportExpiryDate('2028-06-30');
      setResidenceNumber('');
      setResidenceExpiry('2027-09-30');
      setMadhhab('شافعي');
      setNativeLanguage('الملايوية');
      setEmbassyContact('');
      setWhatsappNumber('');
      setAzharEnrollmentDate('2025-09-01');
      setGuardianName('');
      setGuardianRelation('أب');
      setGuardianPhone('');
      setGuardianJob('');
      setAddress('');
      setGovernorate('القاهرة');
      setPhotoUrl('https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&h=200&fit=crop&crop=face');
      setStatus('active');
      setNotes('');
    }
  }, [initialStudent, isOpen, classes]);

  // Adjust grade & track options when stage changes
  const handleStageChange = (newStage: StageType) => {
    setStage(newStage);
    if (newStage === 'preparatory') {
      setGrade('prep_1');
      setTrack('general');
    } else {
      setGrade('sec_1');
      setTrack('general');
    }
  };

  const handleGradeChange = (newGrade: GradeType) => {
    setGrade(newGrade);
    if (newGrade === 'sec_2' || newGrade === 'sec_3') {
      if (track === 'general') setTrack('scientific');
    } else {
      setTrack('general');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !nationalId.trim()) {
      alert('يرجى كتابة اسم الطالب الرباعي والرقم القومي أو رقم الجواز.');
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedClass = classes.find(c => c.id === classId);
      const studentPayload: Partial<Student> = {
        ...(initialStudent ? { id: initialStudent.id, studentCode: initialStudent.studentCode } : {}),
        recordNumber: Number(recordNumber) || (initialStudent?.recordNumber || 1),
        seatNumber: seatNumber ? Number(seatNumber) : initialStudent?.seatNumber,
        fullName,
        nationalId,
        birthDate,
        birthPlace,
        stage,
        grade,
        track: stage === 'secondary' ? track : undefined,
        classId: classId || classes[0]?.id,
        className: selectedClass ? selectedClass.name : className,
        isInternational,
        internationalDetails: isInternational ? {
          nationality,
          passportNumber,
          passportExpiryDate,
          residenceNumber,
          residenceExpiry,
          madhhab,
          nativeLanguage,
          embassyContact,
          whatsappNumber,
          azharEnrollmentDate,
          scholarshipStatus: 'على منح الأزهر الشريف (مجمع البحوث الإسلامية)',
        } : undefined,
        guardianName,
        guardianRelation,
        guardianPhone,
        guardianJob,
        address,
        governorate,
        photoUrl: photoUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&h=200&fit=crop&crop=face',
        status,
        notes,
      };

      await onSave(studentPayload);
      onClose();
    } catch (err: any) {
      alert(`حدث خطأ أثناء الحفظ: ${err?.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-stone-200 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden text-right">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-emerald-900 text-white border-b border-stone-200">
          <div className="flex items-center gap-2.5">
            <User className="w-5 h-5 text-amber-300" />
            <div>
              <h3 className="font-bold text-base">
                {initialStudent ? 'تعديل بيانات الطالب الأزهري' : 'تسجيل طالب جديد بمعهد عبد الرؤوف'}
              </h3>
              <p className="text-xs text-emerald-200">
                شؤون الطلاب وقيد الدارسين (المصريين والوافدين)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* Top Section: Photo & Basic Name */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 bg-stone-50 rounded-lg border border-stone-200">
            <div className="flex flex-col items-center gap-2">
              <div className="w-20 h-24 rounded border-2 border-stone-300 overflow-hidden bg-stone-200 shrink-0 shadow-xs relative">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt={fullName || 'صورة الطالب'}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-stone-400">
                    <Camera className="w-6 h-6" />
                    <span className="text-[10px] mt-1">صورة الطالب</span>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-stone-500">صورة مقاس 4×6</span>
            </div>

            <div className="flex-1 w-full space-y-3">
              <div>
                <label className="block font-bold text-stone-800 mb-1">
                  الاسم الرباعي للطالب (كما في شهادة الميلاد أو جواز السفر) *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="مثال: أحمد محمود عبد الله إبراهيم"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:border-emerald-700"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-800 mb-1">
                    الرقم القومي / رقم جواز السفر *
                  </label>
                  <input
                    type="text"
                    required
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value)}
                    placeholder="14 رقماً أو رقم الجواز للوافد"
                    className="w-full px-3 py-2 font-mono border border-stone-300 rounded-lg focus:outline-hidden focus:border-emerald-700"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-800 mb-1">
                    رابط الصورة الشخصية (URL)
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:border-emerald-700"
                  />
                </div>
              </div>

              {/* Official Azhar Registry Numbers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-2.5 bg-emerald-50/50 rounded-lg border border-emerald-200">
                <div>
                  <label className="block font-bold text-emerald-950 mb-1 text-xs">
                    رقم السجل بالمعهد (يبدأ من 1 إلى ما لا نهاية - رقم الطالب على البطاقة) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={recordNumber}
                    onChange={(e) => setRecordNumber(Number(e.target.value))}
                    className="w-full px-3 py-1.5 font-mono font-bold text-emerald-950 border border-emerald-300 rounded bg-white text-xs"
                  />
                  <span className="text-[10px] text-stone-500 block mt-0.5">
                    الرقم المسلسل الثابت للطالب على البطاقة المدرسية وسجلات المعهد
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-stone-800 mb-1 text-xs">
                    رقم الجلوس في الامتحانات (يبدأ من 1000 تلقائياً)
                  </label>
                  <input
                    type="number"
                    min="1000"
                    value={seatNumber || ''}
                    onChange={(e) => setSeatNumber(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="تلقائي e.g. 1001"
                    className="w-full px-3 py-1.5 font-mono font-bold text-stone-900 border border-stone-300 rounded bg-white text-xs"
                  />
                  <span className="text-[10px] text-stone-500 block mt-0.5">
                    يُخصص تلقائياً للجان الامتحانات بدءاً من 1000 فما فوق
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Educational Stage & Grade */}
          <div className="space-y-3">
            <h4 className="font-bold text-emerald-900 border-b border-stone-200 pb-1.5 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-emerald-700" />
              <span>المرحلة التعليمية والصف الدراسي</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">المرحلة الدراسية</label>
                <select
                  value={stage}
                  onChange={(e) => handleStageChange(e.target.value as StageType)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white"
                >
                  <option value="preparatory">المرحلة الإعدادية</option>
                  <option value="secondary">المرحلة الثانوية</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">الصف الدراسي</label>
                <select
                  value={grade}
                  onChange={(e) => handleGradeChange(e.target.value as GradeType)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white"
                >
                  {stage === 'preparatory' ? (
                    <>
                      <option value="prep_1">الصف الأول الإعدادي</option>
                      <option value="prep_2">الصف الثاني الإعدادي</option>
                      <option value="prep_3">الصف الثالث الإعدادي (الشهادة الإعدادية)</option>
                    </>
                  ) : (
                    <>
                      <option value="sec_1">الصف الأول الثانوي</option>
                      <option value="sec_2">الصف الثاني الثانوي</option>
                      <option value="sec_3">الصف الثالث الثانوي (الشهادة الثانوية)</option>
                    </>
                  )}
                </select>
              </div>

              {stage === 'secondary' && (grade === 'sec_2' || grade === 'sec_3') ? (
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    الشعبة / التخصص (للثانوي فقط)
                  </label>
                  <select
                    value={track}
                    onChange={(e) => setTrack(e.target.value as TrackType)}
                    className="w-full px-3 py-2 border border-emerald-400 bg-emerald-50 font-bold text-emerald-900 rounded-lg"
                  >
                    <option value="scientific">القسم العلمي</option>
                    <option value="literary">القسم الأدبي</option>
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">الفصل الدراسي المسكن عليه</label>
                  <select
                    value={classId}
                    onChange={(e) => {
                      setClassId(e.target.value);
                      const cls = classes.find(c => c.id === e.target.value);
                      if (cls) setClassName(cls.name);
                    }}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white"
                  >
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* International Student Toggle & Details */}
          <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-amber-800" />
                <span className="font-bold text-stone-900">
                  هل الطالب من الطلاب الوافدين (غير مصري)؟
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isInternational}
                  onChange={(e) => setIsInternational(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-stone-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-800"></div>
              </label>
            </div>

            {isInternational && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-amber-200/60">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">الجنسية *</label>
                  <input
                    type="text"
                    required={isInternational}
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    placeholder="مثال: ماليزي، إندونيسي، سنغالي"
                    className="w-full px-3 py-1.5 border border-stone-300 rounded bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">المذهب الفقهي الأزهري *</label>
                  <select
                    value={madhhab}
                    onChange={(e) => setMadhhab(e.target.value as MadhhabType)}
                    className="w-full px-3 py-1.5 border border-stone-300 rounded bg-white font-bold text-stone-800"
                  >
                    <option value="شافعي">المذهب الشافعي</option>
                    <option value="حنفي">المذهب الحنفي</option>
                    <option value="مالكي">المذهب المالكي</option>
                    <option value="حنبلي">المذهب الحنبلي</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">اللغة الأم</label>
                  <input
                    type="text"
                    value={nativeLanguage}
                    onChange={(e) => setNativeLanguage(e.target.value)}
                    placeholder="مثال: الملايوية، الإندونيسية، الهوسا"
                    className="w-full px-3 py-1.5 border border-stone-300 rounded bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">رقم جواز السفر</label>
                  <input
                    type="text"
                    value={passportNumber}
                    onChange={(e) => setPassportNumber(e.target.value)}
                    placeholder="رقم الجواز"
                    className="w-full px-3 py-1.5 font-mono border border-stone-300 rounded bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-rose-900 mb-1">تاريخ انتهاء جواز السفر *</label>
                  <input
                    type="date"
                    value={passportExpiryDate}
                    onChange={(e) => setPassportExpiryDate(e.target.value)}
                    className="w-full px-3 py-1.5 border border-rose-300 rounded bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">رقم الإقامة بجمهورية مصر</label>
                  <input
                    type="text"
                    value={residenceNumber}
                    onChange={(e) => setResidenceNumber(e.target.value)}
                    placeholder="رقم بطاقة الإقامة"
                    className="w-full px-3 py-1.5 font-mono border border-stone-300 rounded bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">تاريخ انتهاء الإقامة</label>
                  <input
                    type="date"
                    value={residenceExpiry}
                    onChange={(e) => setResidenceExpiry(e.target.value)}
                    className="w-full px-3 py-1.5 border border-stone-300 rounded bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">رقم الواتساب للتواصل</label>
                  <input
                    type="text"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="+60123... أو 015..."
                    className="w-full px-3 py-1.5 font-mono border border-stone-300 rounded bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">تاريخ الالتحاق بالأزهر الشريف</label>
                  <input
                    type="date"
                    value={azharEnrollmentDate}
                    onChange={(e) => setAzharEnrollmentDate(e.target.value)}
                    className="w-full px-3 py-1.5 border border-stone-300 rounded bg-white font-mono"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block font-semibold text-stone-700 mb-1">
                    جهة الإشراف أو هاتف الملحقية الثقافية / السفارة
                  </label>
                  <input
                    type="text"
                    value={embassyContact}
                    onChange={(e) => setEmbassyContact(e.target.value)}
                    placeholder="مثال: سفارة إندونيسيا بالقاهرة - 0227947204"
                    className="w-full px-3 py-1.5 border border-stone-300 rounded bg-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Birth & Guardian Info */}
          <div className="space-y-3">
            <h4 className="font-bold text-stone-800 border-b border-stone-200 pb-1.5 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-stone-600" />
              <span>بيانات الميلاد وولي الأمر والعنوان</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">تاريخ الميلاد</label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">محل الميلاد</label>
                <input
                  type="text"
                  value={birthPlace}
                  onChange={(e) => setBirthPlace(e.target.value)}
                  placeholder="المحافظة أو دولة الميلاد"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">حالة القيد بالمعهد</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as StudentStatus)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white"
                >
                  <option value="active">مقيد ومنتظم</option>
                  <option value="transferred">محول لمعهد آخر</option>
                  <option value="graduated">متخرج</option>
                  <option value="suspended">منقطع / موقوف القيد</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">اسم ولي الأمر</label>
                <input
                  type="text"
                  value={guardianName}
                  onChange={(e) => setGuardianName(e.target.value)}
                  placeholder="اسم الأب أو الكفيل"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">صلة القرابة</label>
                <input
                  type="text"
                  value={guardianRelation}
                  onChange={(e) => setGuardianRelation(e.target.value)}
                  placeholder="أب / عم / كفيل"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">هاتف ولي الأمر / الكفيل</label>
                <input
                  type="tel"
                  dir="ltr"
                  value={guardianPhone}
                  onChange={(e) => setGuardianPhone(e.target.value)}
                  placeholder="01xxxxxxxxx"
                  className="w-full px-3 py-2 font-mono border border-stone-300 rounded-lg"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-stone-700 mb-1">عنوان الإقامة الحالي بمصر</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="الحي، الشارع، رقم العقار"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">المحافظة</label>
                <input
                  type="text"
                  value={governorate}
                  onChange={(e) => setGovernorate(e.target.value)}
                  placeholder="القاهرة / الجيزة / ..."
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block font-semibold text-stone-700 mb-1">ملاحظات إدارية أو طبية</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="مثال: منحة أزهرية، تفوق في القرآن الكريم، مذهب فقهي خاص..."
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg font-semibold transition-colors cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-6 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{isSubmitting ? 'جارٍ الحفظ...' : initialStudent ? 'تحديث بيانات الطالب' : 'حفظ وقيد الطالب'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
