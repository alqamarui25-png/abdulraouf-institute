/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Student, StageType, GradeType, TrackType, MadhhabType } from '../types';

// The exact 50 students provided by the user
interface RawSeedStudent {
  rec: number;
  name: string;
  nat: string;
  stage: 'إعدادي' | 'ثانوي';
  grade: 'الأول' | 'الثاني' | 'الثالث';
  track: '—' | 'علمي' | 'أدبي';
  madhhab: MadhhabType;
  idNum: string;
  guardian: string;
  gov: string;
  status: 'منتظم' | 'وافد';
  lang?: string;
}

const RAW_50_STUDENTS: RawSeedStudent[] = [
  { rec: 1, name: 'محمد أحمد إبراهيم حسن', nat: 'مصري', stage: 'إعدادي', grade: 'الأول', track: '—', madhhab: 'شافعي', idNum: '31001010101122', guardian: 'أحمد إبراهيم', gov: 'القاهرة', status: 'منتظم', lang: 'العربية' },
  { rec: 2, name: 'عبد الله عمر محمد علي', nat: 'قمري', stage: 'ثانوي', grade: 'الأول', track: 'علمي', madhhab: 'شافعي', idNum: 'NBE882001', guardian: 'عمر محمد', gov: 'القاهرة', status: 'وافد', lang: 'القمرية' },
  { rec: 3, name: 'يوسف محمد عبد الرحمن', nat: 'سوداني', stage: 'إعدادي', grade: 'الثاني', track: '—', madhhab: 'مالكي', idNum: 'P01928374', guardian: 'محمد علي', gov: 'الجيزة', status: 'وافد', lang: 'العربية' },
  { rec: 4, name: 'إبراهيم أحمد عثمان', nat: 'تشادي', stage: 'ثانوي', grade: 'الثاني', track: 'أدبي', madhhab: 'مالكي', idNum: 'T99482711', guardian: 'عبد الرحمن عثمان', gov: 'الإسكندرية', status: 'وافد', lang: 'العربية' },
  { rec: 5, name: 'أحمد سعيد محمود', nat: 'مصري', stage: 'ثانوي', grade: 'الثالث', track: 'علمي', madhhab: 'حنفي', idNum: '30805120104433', guardian: 'سعيد محمود', gov: 'القليوبية', status: 'منتظم', lang: 'العربية' },
  { rec: 6, name: 'إسماعيل عبد الله حسن', nat: 'قمري', stage: 'إعدادي', grade: 'الثالث', track: '—', madhhab: 'شافعي', idNum: 'NBE882006', guardian: 'عبد الله حسن', gov: 'القاهرة', status: 'وافد', lang: 'القمرية' },
  { rec: 7, name: 'عمر خالد محمد', nat: 'نيجيري', stage: 'ثانوي', grade: 'الأول', track: 'أدبي', madhhab: 'مالكي', idNum: 'A09887766', guardian: 'خالد محمد', gov: 'القاهرة', status: 'وافد', lang: 'الهوسا' },
  { rec: 8, name: 'محمود علي عبد الكريم', nat: 'مصري', stage: 'إعدادي', grade: 'الأول', track: '—', madhhab: 'شافعي', idNum: '31102030105566', guardian: 'علي عبد الكريم', gov: 'الشرقية', status: 'منتظم', lang: 'العربية' },
  { rec: 9, name: 'عبد الرحمن صالح آدم', nat: 'سوداني', stage: 'ثانوي', grade: 'الأول', track: 'علمي', madhhab: 'مالكي', idNum: 'P02938475', guardian: 'صالح آدم', gov: 'القاهرة', status: 'وافد', lang: 'العربية' },
  { rec: 10, name: 'بلال عثمان إدريس', nat: 'سنغالي', stage: 'إعدادي', grade: 'الثاني', track: '—', madhhab: 'مالكي', idNum: 'SN778899', guardian: 'عثمان إدريس', gov: 'القاهرة', status: 'وافد', lang: 'الولوف' },
  { rec: 11, name: 'طارق زياد المنشاوي', nat: 'مصري', stage: 'ثانوي', grade: 'الثاني', track: 'علمي', madhhab: 'حنفي', idNum: '30903150106677', guardian: 'زياد المنشاوي', gov: 'الغربية', status: 'منتظم', lang: 'العربية' },
  { rec: 12, name: 'حمزة محمد الأمين', nat: 'إندونيسي', stage: 'إعدادي', grade: 'الأول', track: '—', madhhab: 'شافعي', idNum: 'ID9933221', guardian: 'محمد الأمين', gov: 'القاهرة', status: 'وافد', lang: 'الإندونيسية' },
  { rec: 13, name: 'رضوان شيخ علي', nat: 'صومالي', stage: 'ثانوي', grade: 'الثالث', track: 'أدبي', madhhab: 'شافعي', idNum: 'SO1122334', guardian: 'شيخ علي', gov: 'القاهرة', status: 'وافد', lang: 'الصومالية' },
  { rec: 14, name: 'مصطفى كمال الدين', nat: 'مصري', stage: 'ثانوي', grade: 'الأول', track: 'علمي', madhhab: 'شافعي', idNum: '31006180107788', guardian: 'كمال الدين', gov: 'المنوفية', status: 'منتظم', lang: 'العربية' },
  { rec: 15, name: 'زين العابدين تيجاني', nat: 'مالي', stage: 'إعدادي', grade: 'الثالث', track: '—', madhhab: 'مالكي', idNum: 'ML4455667', guardian: 'تيجاني كوليبالي', gov: 'القاهرة', status: 'وافد', lang: 'البمبرية' },
  { rec: 16, name: 'ياسين فؤاد النجار', nat: 'مصري', stage: 'إعدادي', grade: 'الثاني', track: '—', madhhab: 'حنفي', idNum: '31107220108899', guardian: 'فؤاد النجار', gov: 'الدقهلية', status: 'منتظم', lang: 'العربية' },
  { rec: 17, name: 'نور الدين عبد القيوم', nat: 'أوزبكي', stage: 'ثانوي', grade: 'الثاني', track: 'علمي', madhhab: 'حنفي', idNum: 'UZ8899001', guardian: 'عبد القيوم', gov: 'القاهرة', status: 'وافد', lang: 'الأوزبكية' },
  { rec: 18, name: 'زكريا عيسى باه', nat: 'غيني', stage: 'إعدادي', grade: 'الأول', track: '—', madhhab: 'مالكي', idNum: 'GN5566778', guardian: 'عيسى باه', gov: 'القاهرة', status: 'وافد', lang: 'الفولانية' },
  { rec: 19, name: 'كريم عبد العظيم شاكر', nat: 'مصري', stage: 'ثانوي', grade: 'الثالث', track: 'أدبي', madhhab: 'شافعي', idNum: '30811290109900', guardian: 'عبد العظيم شاكر', gov: 'الجيزة', status: 'منتظم', lang: 'العربية' },
  { rec: 20, name: 'لقمان هارون كوليبالي', nat: 'كوت ديفوار', stage: 'ثانوي', grade: 'الأول', track: 'أدبي', madhhab: 'مالكي', idNum: 'CI2233445', guardian: 'هارون كوليبالي', gov: 'القاهرة', status: 'وافد', lang: 'الفرنسية' },
  { rec: 21, name: 'حسن يحيى الهاشمي', nat: 'يمني', stage: 'ثانوي', grade: 'الثاني', track: 'علمي', madhhab: 'شافعي', idNum: 'YE7766554', guardian: 'يحيى الهاشمي', gov: 'القاهرة', status: 'وافد', lang: 'العربية' },
  { rec: 22, name: 'عبد الملك شريف داوود', nat: 'نيجيري', stage: 'إعدادي', grade: 'الثالث', track: '—', madhhab: 'مالكي', idNum: 'NG8899112', guardian: 'شريف داوود', gov: 'القاهرة', status: 'وافد', lang: 'الهوسا' },
  { rec: 23, name: 'زياد حسام عبد الباسط', nat: 'مصري', stage: 'إعدادي', grade: 'الأول', track: '—', madhhab: 'حنفي', idNum: '31012100101234', guardian: 'حسام عبد الباسط', gov: 'القاهرة', status: 'منتظم', lang: 'العربية' },
  { rec: 24, name: 'شعيب أحمد فارح', nat: 'جيبوتي', stage: 'ثانوي', grade: 'الثالث', track: 'علمي', madhhab: 'شافعي', idNum: 'DJ3344556', guardian: 'أحمد فارح', gov: 'القاهرة', status: 'وافد', lang: 'الصومالية' },
  { rec: 25, name: 'عمار ياسر القناوي', nat: 'مصري', stage: 'ثانوي', grade: 'الأول', track: 'أدبي', madhhab: 'مالكي', idNum: '30908140102345', guardian: 'ياسر القناوي', gov: 'قنا', status: 'منتظم', lang: 'العربية' },
  { rec: 26, name: 'داوود تراوري سيكو', nat: 'بوركينا فاسو', stage: 'إعدادي', grade: 'الثاني', track: '—', madhhab: 'مالكي', idNum: 'BF9988776', guardian: 'سيكو تراوري', gov: 'القاهرة', status: 'وافد', lang: 'الموشي' },
  { rec: 27, name: 'عبد الله ناصر السالمي', nat: 'عماني', stage: 'ثانوي', grade: 'الثاني', track: 'علمي', madhhab: 'شافعي', idNum: 'OM4433221', guardian: 'ناصر السالمي', gov: 'القاهرة', status: 'وافد', lang: 'العربية' },
  { rec: 28, name: 'أسامة صلاح الدين بدير', nat: 'مصري', stage: 'إعدادي', grade: 'الثالث', track: '—', madhhab: 'شافعي', idNum: '31104190103456', guardian: 'صلاح الدين بدير', gov: 'كفر الشيخ', status: 'منتظم', lang: 'العربية' },
  { rec: 29, name: 'إدريس محمد كانتي', nat: 'غامبي', stage: 'ثانوي', grade: 'الأول', track: 'علمي', madhhab: 'مالكي', idNum: 'GM6677889', guardian: 'محمد كانتي', gov: 'القاهرة', status: 'وافد', lang: 'الماندينكا' },
  { rec: 30, name: 'هارون يوسف موسى', nat: 'تشادي', stage: 'ثانوي', grade: 'الثالث', track: 'أدبي', madhhab: 'مالكي', idNum: 'TD1199882', guardian: 'يوسف موسى', gov: 'القاهرة', status: 'وافد', lang: 'العربية' },
  { rec: 31, name: 'إسلام عصام الشرقاوي', nat: 'مصري', stage: 'ثانوي', grade: 'الثاني', track: 'أدبي', madhhab: 'شافعي', idNum: '30909250104567', guardian: 'عصام الشرقاوي', gov: 'البحيرة', status: 'منتظم', lang: 'العربية' },
  { rec: 32, name: 'عرفان حبيب الرحمن', nat: 'بنغلاديشي', stage: 'إعدادي', grade: 'الأول', track: '—', madhhab: 'حنفي', idNum: 'BD8822334', guardian: 'حبيب الرحمن', gov: 'القاهرة', status: 'وافد', lang: 'البنغالية' },
  { rec: 33, name: 'عبد الرؤوف إبراهيم محمد', nat: 'قمري', stage: 'ثانوي', grade: 'الثالث', track: 'علمي', madhhab: 'شافعي', idNum: 'NBE810802', guardian: 'إبراهيم محمد', gov: 'القاهرة', status: 'وافد', lang: 'العربية' },
  { rec: 34, name: 'معاذ أيمن عبد التواب', nat: 'مصري', stage: 'إعدادي', grade: 'الثاني', track: '—', madhhab: 'شافعي', idNum: '31005110105678', guardian: 'أيمن عبد التواب', gov: 'الفيوم', status: 'منتظم', lang: 'العربية' },
  { rec: 35, name: 'صهيب أنور الأزهري', nat: 'سوداني', stage: 'ثانوي', grade: 'الأول', track: 'أدبي', madhhab: 'مالكي', idNum: 'SD4455112', guardian: 'أنور الأزهري', gov: 'القاهرة', status: 'وافد', lang: 'العربية' },
  { rec: 36, name: 'سليمان ديالو الحسن', nat: 'غيني', stage: 'ثانوي', grade: 'الثاني', track: 'علمي', madhhab: 'مالكي', idNum: 'GN9911223', guardian: 'الحسن ديالو', gov: 'القاهرة', status: 'وافد', lang: 'الفولانية' },
  { rec: 37, name: 'شريف مدحت الفقي', nat: 'مصري', stage: 'إعدادي', grade: 'الثالث', track: '—', madhhab: 'حنبلي', idNum: '31108090106789', guardian: 'مدحت الفقي', gov: 'القاهرة', status: 'منتظم', lang: 'العربية' },
  { rec: 38, name: 'قاسم محمد عبد الوهاب', nat: 'إثيوبي', stage: 'ثانوي', grade: 'الثالث', track: 'أدبي', madhhab: 'شافعي', idNum: 'ET7788443', guardian: 'محمد عبد الوهاب', gov: 'القاهرة', status: 'وافد', lang: 'الأورومية' },
  { rec: 39, name: 'حذيفة عبد المنعم غانم', nat: 'مصري', stage: 'ثانوي', grade: 'الأول', track: 'علمي', madhhab: 'شافعي', idNum: '31002280107890', guardian: 'عبد المنعم غانم', gov: 'المنيا', status: 'منتظم', lang: 'العربية' },
  { rec: 40, name: 'إحسان إلهي ظهير', nat: 'باكستاني', stage: 'إعدادي', grade: 'الأول', track: '—', madhhab: 'حنفي', idNum: 'PK3344991', guardian: 'إلهي ظهير', gov: 'القاهرة', status: 'وافد', lang: 'الأوردو' },
  { rec: 41, name: 'مأمون عيسى كمارا', nat: 'سيراليوني', stage: 'إعدادي', grade: 'الثاني', track: '—', madhhab: 'مالكي', idNum: 'SL6655443', guardian: 'عيسى كمارا', gov: 'القاهرة', status: 'وافد', lang: 'الإنجليزية' },
  { rec: 42, name: 'باهر وجدي الألفي', nat: 'مصري', stage: 'ثانوي', grade: 'الثاني', track: 'علمي', madhhab: 'شافعي', idNum: '30911040108901', guardian: 'وجدي الألفي', gov: 'القاهرة', status: 'منتظم', lang: 'العربية' },
  { rec: 43, name: 'مصعب يونس البشير', nat: 'سوداني', stage: 'ثانوي', grade: 'الثالث', track: 'أدبي', madhhab: 'مالكي', idNum: 'SD8877665', guardian: 'يونس البشير', gov: 'القاهرة', status: 'وافد', lang: 'العربية' },
  { rec: 44, name: 'فاروق أحمد السعدني', nat: 'مصري', stage: 'إعدادي', grade: 'الثالث', track: '—', madhhab: 'مالكي', idNum: '31103170109012', guardian: 'أحمد السعدني', gov: 'أسيوط', status: 'منتظم', lang: 'العربية' },
  { rec: 45, name: 'إلياس رضوان سويلم', nat: 'إندونيسي', stage: 'ثانوي', grade: 'الأول', track: 'علمي', madhhab: 'شافعي', idNum: 'ID5544332', guardian: 'رضوان سويلم', gov: 'القاهرة', status: 'وافد', lang: 'الإندونيسية' },
  { rec: 46, name: 'يحيى هاني البياع', nat: 'مصري', stage: 'ثانوي', grade: 'الثاني', track: 'أدبي', madhhab: 'حنفي', idNum: '30907190100123', guardian: 'هاني البياع', gov: 'بني سويف', status: 'منتظم', lang: 'العربية' },
  { rec: 47, name: 'أبوبكر عبد القادر كيتا', nat: 'مالي', stage: 'إعدادي', grade: 'الأول', track: '—', madhhab: 'مالكي', idNum: 'ML9988112', guardian: 'عبد القادر كيتا', gov: 'القاهرة', status: 'وافد', lang: 'البمبرية' },
  { rec: 48, name: 'تامر عبد الحميد الزيات', nat: 'مصري', stage: 'ثانوي', grade: 'الثالث', track: 'علمي', madhhab: 'شافعي', idNum: '30810230101234', guardian: 'عبد الحميد الزيات', gov: 'الغربية', status: 'منتظم', lang: 'العربية' },
  { rec: 49, name: 'مختار سيدي بوبكر', nat: 'موريتاني', stage: 'إعدادي', grade: 'الثاني', track: '—', madhhab: 'مالكي', idNum: 'MR3322110', guardian: 'سيدي بوبكر', gov: 'القاهرة', status: 'وافد', lang: 'الحسانية' },
  { rec: 50, name: 'عبد العزيز توفيق الصاوي', nat: 'مصري', stage: 'ثانوي', grade: 'الأول', track: 'أدبي', madhhab: 'شافعي', idNum: '31004120102345', guardian: 'توفيق الصاوي', gov: 'الإسماعيلية', status: 'منتظم', lang: 'العربية' },
];

// Helper to convert RawSeed to full Student model
function convertRawToStudent(r: RawSeedStudent): Student {
  const isPrep = r.stage === 'إعدادي';
  const stage: StageType = isPrep ? 'preparatory' : 'secondary';
  
  let grade: GradeType = 'prep_1';
  let className = '';
  let classId = '';

  if (isPrep) {
    if (r.grade === 'الأول') {
      grade = 'prep_1';
      className = 'الصف الأول الإعدادي (1/1)';
      classId = 'cls-prep-1-1';
    } else if (r.grade === 'الثاني') {
      grade = 'prep_2';
      className = 'الصف الثاني الإعدادي (2/1)';
      classId = 'cls-prep-2-1';
    } else {
      grade = 'prep_3';
      className = 'الصف الثالث الإعدادي (3/1 - الشهادة الإعدادية)';
      classId = 'cls-prep-3-1';
    }
  } else {
    if (r.grade === 'الأول') {
      grade = 'sec_1';
      className = 'الصف الأول الثانوي (1/1)';
      classId = 'cls-sec-1-1';
    } else if (r.grade === 'الثاني') {
      grade = 'sec_2';
      className = r.track === 'علمي' ? 'الصف الثاني الثانوي (علمي)' : 'الصف الثاني الثانوي (أدبي)';
      classId = r.track === 'علمي' ? 'cls-sec-2-sci' : 'cls-sec-2-lit';
    } else {
      grade = 'sec_3';
      className = r.track === 'علمي' ? 'الصف الثالث الثانوي (علمي - الشهادة الثانوية)' : 'الصف الثالث الثانوي (أدبي - الشهادة الثانوية)';
      classId = r.track === 'علمي' ? 'cls-sec-3-sci' : 'cls-sec-3-lit';
    }
  }

  const track: TrackType = isPrep ? 'general' : r.track === 'علمي' ? 'scientific' : r.track === 'أدبي' ? 'literary' : 'general';
  const isIntl = r.nat !== 'مصري';
  const studentCode = `AR-${String(r.rec).padStart(4, '0')}`;
  const padRec = String(r.rec).padStart(4, '0');

  return {
    id: `std-${1000 + r.rec}`,
    recordNumber: r.rec,
    seatNumber: 1000 + r.rec,
    studentCode,
    fullName: r.name,
    nationalId: r.idNum,
    birthDate: isPrep ? '2011-03-15' : '2008-07-20',
    birthPlace: isIntl ? r.nat : r.gov,
    stage,
    grade,
    track,
    classId,
    className,
    isInternational: isIntl,
    internationalDetails: isIntl ? {
      nationality: r.nat,
      passportNumber: r.idNum,
      passportExpiryDate: '2028-06-30',
      residenceNumber: `RES-EG-${20000 + r.rec}`,
      residenceExpiry: '2027-09-30',
      madhhab: r.madhhab,
      nativeLanguage: r.lang || 'العربية',
      embassyContact: `سفارة ${r.nat} بالقاهرة - 0227${padRec}`,
      whatsappNumber: `01500${padRec}12`,
      azharEnrollmentDate: '2025-09-15',
      scholarshipStatus: 'على منح الأزهر الشريف (مجمع البحوث الإسلامية)',
    } : undefined,
    guardianName: r.guardian,
    guardianRelation: 'أب',
    guardianPhone: isIntl ? `+201500${padRec}` : `010${padRec}9988`,
    guardianJob: isIntl ? 'إمام ومدرس شريعة' : 'موظف حكومي',
    address: isIntl ? 'مدينة البعوث الإسلامية - العباسية، القاهرة' : `${r.gov}، جمهورية مصر العربية`,
    governorate: isIntl ? 'القاهرة' : r.gov,
    enrollmentDate: '2025-09-15',
    status: 'active',
    photoUrl: '', // Without photo as requested: "هؤلاء بدون صورة وسنضيف صورة الآن"
    notes: `طالب مقيد بالسجل رقم 2026-${padRec} - مذهب ${r.madhhab}`,
  };
}

// Generate the remaining 950 students up to 1000 records
const FIRST_NAMES = [
  'محمد', 'أحمد', 'محمود', 'علي', 'إبراهيم', 'عمر', 'عثمان', 'يوسف', 'خالد', 'طارق',
  'حمزة', 'عبد الرحمن', 'عبد الله', 'مصطفى', 'بلال', 'حسن', 'حسين', 'سعيد', 'كريم', 'ياسين',
  'صلاح', 'أيمن', 'عصام', 'إسماعيل', 'هارون', 'داوود', 'سليمان', 'إدريس', 'زكريا', 'يحيى',
  'أنس', 'سعد', 'معاذ', 'حذيفة', 'صهيب', 'طلحة', 'الزبير', 'جعفر', 'عمار', 'سلمان'
];

const LAST_NAMES = [
  'السيد', 'عبد السلام', 'الشربيني', 'النجار', 'البدري', 'القاضي', 'الدسوقي', 'منصور',
  'العوضي', 'شحاتة', 'سالم', 'الجمال', 'زهران', 'الحداد', 'المنشاوي', 'الطهطاوي', 'البنا',
  'غنيم', 'جاد الحق', 'رضوان', 'الشناوي', 'الصاوي', 'الفقي', 'عطية', 'مبروك', 'الصباحي'
];

const INTL_DATA: Array<{ nat: string; lang: string; madhhab: MadhhabType }> = [
  { nat: 'قمري', lang: 'القمرية', madhhab: 'شافعي' },
  { nat: 'سوداني', lang: 'العربية', madhhab: 'مالكي' },
  { nat: 'تشادي', lang: 'العربية', madhhab: 'مالكي' },
  { nat: 'نيجيري', lang: 'الهوسا', madhhab: 'مالكي' },
  { nat: 'إندونيسي', lang: 'الإندونيسية', madhhab: 'شافعي' },
  { nat: 'ماليزي', lang: 'الملايوية', madhhab: 'شافعي' },
  { nat: 'سنغالي', lang: 'الولوف', madhhab: 'مالكي' },
  { nat: 'صومالي', lang: 'الصومالية', madhhab: 'شافعي' },
  { nat: 'أوزبكي', lang: 'الأوزبكية', madhhab: 'حنفي' },
  { nat: 'تركي', lang: 'التركية', madhhab: 'حنفي' },
  { nat: 'مالي', lang: 'البمبرية', madhhab: 'مالكي' },
  { nat: 'غيني', lang: 'الفولانية', madhhab: 'مالكي' },
  { nat: 'نيجري', lang: 'الهوسا', madhhab: 'مالكي' },
  { nat: 'جيبوتي', lang: 'الصومالية', madhhab: 'شافعي' },
  { nat: 'بوركيني', lang: 'الموشي', madhhab: 'مالكي' },
  { nat: 'طاجيكي', lang: 'الطاجيكية', madhhab: 'حنفي' },
  { nat: 'تايلاندي', lang: 'التايلاندية', madhhab: 'شافعي' },
  { nat: 'أفغاني', lang: 'البشتو', madhhab: 'حنفي' },
  { nat: 'غامبي', lang: 'الماندينكا', madhhab: 'مالكي' },
  { nat: 'إيفواري', lang: 'الفرنسية', madhhab: 'مالكي' },
];

const EGYPTIAN_GOVS = [
  'القاهرة', 'الجيزة', 'القليوبية', 'الشرقية', 'الدقهلية', 'الغربية', 'المنوفية',
  'كفر الشيخ', 'البحيرة', 'الإسكندرية', 'الفيوم', 'بني سويف', 'المنيا', 'أسيوط', 'سوهاج', 'قنا'
];

function generateProceduralStudents(): Student[] {
  const result: Student[] = [];

  // Convert the exact 50 students
  RAW_50_STUDENTS.forEach((raw) => {
    result.push(convertRawToStudent(raw));
  });

  // Generate records 51 to 1000
  for (let rec = 51; rec <= 1000; rec++) {
    const isPrep = rec <= 500;
    const stage: StageType = isPrep ? 'preparatory' : 'secondary';

    let grade: GradeType;
    let track: TrackType = 'general';
    let className = '';
    let classId = '';

    if (isPrep) {
      const pIdx = rec % 3;
      if (pIdx === 1) {
        grade = 'prep_1';
        className = rec % 2 === 0 ? 'الصف الأول الإعدادي (1/1)' : 'الصف الأول الإعدادي (1/2)';
        classId = rec % 2 === 0 ? 'cls-prep-1-1' : 'cls-prep-1-2';
      } else if (pIdx === 2) {
        grade = 'prep_2';
        className = 'الصف الثاني الإعدادي (2/1)';
        classId = 'cls-prep-2-1';
      } else {
        grade = 'prep_3';
        className = 'الصف الثالث الإعدادي (3/1 - الشهادة الإعدادية)';
        classId = 'cls-prep-3-1';
      }
    } else {
      const sIdx = rec % 3;
      if (sIdx === 1) {
        grade = 'sec_1';
        className = 'الصف الأول الثانوي (1/1)';
        classId = 'cls-sec-1-1';
      } else if (sIdx === 2) {
        grade = 'sec_2';
        track = rec % 2 === 0 ? 'scientific' : 'literary';
        className = track === 'scientific' ? 'الصف الثاني الثانوي (علمي)' : 'الصف الثاني الثانوي (أدبي)';
        classId = track === 'scientific' ? 'cls-sec-2-sci' : 'cls-sec-2-lit';
      } else {
        grade = 'sec_3';
        track = rec % 2 === 0 ? 'scientific' : 'literary';
        className = track === 'scientific' ? 'الصف الثالث الثانوي (علمي - الشهادة الثانوية)' : 'الصف الثالث الثانوي (أدبي - الشهادة الثانوية)';
        classId = track === 'scientific' ? 'cls-sec-3-sci' : 'cls-sec-3-lit';
      }
    }

    const isIntl = rec % 2 === 0; // ~50% International students
    const fn1 = FIRST_NAMES[rec % FIRST_NAMES.length];
    const fn2 = FIRST_NAMES[(rec * 3 + 1) % FIRST_NAMES.length];
    const fn3 = FIRST_NAMES[(rec * 7 + 2) % FIRST_NAMES.length];
    const ln = LAST_NAMES[rec % LAST_NAMES.length];
    const fullName = `${fn1} ${fn2} ${fn3} ${ln}`;

    const intlProfile = INTL_DATA[rec % INTL_DATA.length];
    const madhhab: MadhhabType = isIntl ? intlProfile.madhhab : (rec % 4 === 0 ? 'حنفي' : rec % 4 === 1 ? 'شافعي' : rec % 4 === 2 ? 'مالكي' : 'حنبلي');
    const gov = EGYPTIAN_GOVS[rec % EGYPTIAN_GOVS.length];
    const padRec = String(rec).padStart(4, '0');
    const studentCode = `AR-${padRec}`;
    const idNum = isIntl ? `PAS-${intlProfile.nat.substring(0, 2)}-${padRec}` : `3${isPrep ? '11' : '08'}0${rec % 9 + 1}15010${padRec}`;

    result.push({
      id: `std-${1000 + rec}`,
      recordNumber: rec,
      seatNumber: 1000 + rec,
      studentCode,
      fullName,
      nationalId: idNum,
      birthDate: isPrep ? '2011-04-10' : '2008-09-18',
      birthPlace: isIntl ? intlProfile.nat : gov,
      stage,
      grade,
      track,
      classId,
      className,
      isInternational: isIntl,
      internationalDetails: isIntl ? {
        nationality: intlProfile.nat,
        passportNumber: idNum,
        passportExpiryDate: '2028-06-30',
        residenceNumber: `RES-EG-${30000 + rec}`,
        residenceExpiry: '2027-09-30',
        madhhab,
        nativeLanguage: intlProfile.lang,
        embassyContact: `سفارة ${intlProfile.nat} بالقاهرة - 0227${padRec}`,
        whatsappNumber: `01500${padRec}88`,
        azharEnrollmentDate: '2025-09-15',
        scholarshipStatus: 'على منح الأزهر الشريف (مجمع البحوث الإسلامية)',
      } : undefined,
      guardianName: `${fn2} ${fn3} ${ln}`,
      guardianRelation: 'أب',
      guardianPhone: isIntl ? `+201500${padRec}` : `010${padRec}1234`,
      guardianJob: isIntl ? 'إمام وخطيب' : 'موظف بالتربية والتعليم',
      address: isIntl ? 'مدينة البعوث الإسلامية - العباسية، القاهرة' : `${gov}، جمهورية مصر العربية`,
      governorate: isIntl ? 'القاهرة' : gov,
      enrollmentDate: '2025-09-15',
      status: 'active',
      photoUrl: '', // Without photo initially, ready for device upload!
      notes: `طالب مقيد برقم السجل 2026-${padRec} - مذهب ${madhhab}`,
    });
  }

  return result;
}

export const ALL_1000_STUDENTS: Student[] = generateProceduralStudents();
