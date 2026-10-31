/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Subject, StageType, GradeType, TrackType, MadhhabType } from '../types';

export interface CurriculumSubjectDetail {
  code: string;
  name: string;
  category: 'sharia' | 'arabic' | 'scientific' | 'cultural';
  maxGrade: number;
  minPassingGrade: number;
  weeklyHours: number;
  description: string;
}

// Egyptian Al-Azhar Curriculum Subjects by Stage & Track
export const AZHAR_EGYPTIAN_CURRICULUM = {
  // المرحلة الإعدادية (الأول، الثاني، الثالث الإعدادي)
  preparatory: [
    {
      code: 'PREP-QURAN',
      name: 'القرآن الكريم وتجويده',
      category: 'sharia' as const,
      maxGrade: 50,
      minPassingGrade: 25,
      weeklyHours: 4,
      description: 'حفظ وتجويد الأجزاء المقررة مع أحكام التلاوة والتجويد',
    },
    {
      code: 'PREP-FIQH',
      name: 'الفقه المذهبي (شافعي / حنفي / مالكي / حنبلي)',
      category: 'sharia' as const,
      maxGrade: 50,
      minPassingGrade: 25,
      weeklyHours: 3,
      description: 'أحكام العبادات والمعاملات طبقاً للمذهب الفقهي للطالب',
    },
    {
      code: 'PREP-USUL',
      name: 'أصول الدين (التفسير والحديث والتوحيد والسيرة النبوية)',
      category: 'sharia' as const,
      maxGrade: 100,
      minPassingGrade: 50,
      weeklyHours: 4,
      description: 'العقيدة الإسلامية، تفسير الآيات، الأحاديث الشريفة والسيرة العطرة',
    },
    {
      code: 'PREP-ARABIC',
      name: 'اللغة العربية (النحو، الصرف، المطالعة والنصوص، الإنشاء، الخط)',
      category: 'arabic' as const,
      maxGrade: 100,
      minPassingGrade: 50,
      weeklyHours: 6,
      description: 'قواعد الإعراب، البناء، نصوص فصحى، التعبير والخط العربي والإملاء',
    },
    {
      code: 'PREP-ENGLISH',
      name: 'اللغة الإنجليزية',
      category: 'cultural' as const,
      maxGrade: 40,
      minPassingGrade: 20,
      weeklyHours: 4,
      description: 'المنهج الأزهري المعتمد للغة الأجنبية الأولى',
    },
    {
      code: 'PREP-MATH',
      name: 'الرياضيات (الجبر والإحصاء والهندسة المستوية)',
      category: 'scientific' as const,
      maxGrade: 60,
      minPassingGrade: 30,
      weeklyHours: 4,
      description: 'المفاهيم الجبرية، المعادلات، الإحصاء، نظريات الهندسة والبراهين',
    },
    {
      code: 'PREP-SCIENCE',
      name: 'العلوم العامة',
      category: 'scientific' as const,
      maxGrade: 40,
      minPassingGrade: 20,
      weeklyHours: 3,
      description: 'المادة وخواصها، الطاقة، التفاعلات الكيميائية، الكائنات الحية والكون',
    },
    {
      code: 'PREP-SOCIAL',
      name: 'الدراسات الاجتماعية (الجغرافيا والتاريخ الإسلامي والوطني)',
      category: 'cultural' as const,
      maxGrade: 40,
      minPassingGrade: 20,
      weeklyHours: 3,
      description: 'جغرافية مصر والعالم الإسلامي، تاريخ الحضارة الإسلامية وتاريخ مصر الحديث',
    },
    {
      code: 'PREP-COMPUTER',
      name: 'الحاسب الآلي وتكنولوجيا المعلومات',
      category: 'cultural' as const,
      maxGrade: 20,
      minPassingGrade: 10,
      weeklyHours: 2,
      description: 'أساسيات الحاسب والبرمجة والمواطنة الرقمية',
    },
    {
      code: 'PREP-ART',
      name: 'التربية الفنية والخط العربي',
      category: 'cultural' as const,
      maxGrade: 20,
      minPassingGrade: 10,
      weeklyHours: 1,
      description: 'أنشطة تربوية وفنية',
    },
  ],

  // المرحلة الثانوية - الصف الأول الثانوي (جذع مشترك)
  sec_1: [
    {
      code: 'SEC1-QURAN',
      name: 'القرآن الكريم وتجويده',
      category: 'sharia' as const,
      maxGrade: 40,
      minPassingGrade: 20,
      weeklyHours: 3,
      description: 'مقرر الحفظ والتلاوة والأحكام للصف الأول الثانوي',
    },
    {
      code: 'SEC1-FIQH',
      name: 'الفقه المذهبي التخصصي',
      category: 'sharia' as const,
      maxGrade: 40,
      minPassingGrade: 20,
      weeklyHours: 3,
      description: 'فقه العبادات والأحكام المذهبية التخصصية',
    },
    {
      code: 'SEC1-TAFSEER',
      name: 'التفسير وعلوم القرآن',
      category: 'sharia' as const,
      maxGrade: 30,
      minPassingGrade: 15,
      weeklyHours: 2,
      description: 'تفسير السور المقررة وبيان أوجه الإعجاز والدلالات',
    },
    {
      code: 'SEC1-HADITH',
      name: 'الحديث النبوي ومصطلح الحديث',
      category: 'sharia' as const,
      maxGrade: 30,
      minPassingGrade: 15,
      weeklyHours: 2,
      description: 'شرح الأحاديث النبوية وأصول التخريج والمصطلح',
    },
    {
      code: 'SEC1-TAWHID',
      name: 'التوحيد والعقيدة الإسلامية',
      category: 'sharia' as const,
      maxGrade: 30,
      minPassingGrade: 15,
      weeklyHours: 2,
      description: 'علم الكلام، أدلة الإيمان والرد على الشبهات',
    },
    {
      code: 'SEC1-NAHW',
      name: 'النحو والصرف',
      category: 'arabic' as const,
      maxGrade: 40,
      minPassingGrade: 20,
      weeklyHours: 3,
      description: 'شرح ابن عقيل على ألفية ابن مالك في النحو والصرف',
    },
    {
      code: 'SEC1-BALAGHA',
      name: 'البلاغة والأدب والنصوص',
      category: 'arabic' as const,
      maxGrade: 40,
      minPassingGrade: 20,
      weeklyHours: 3,
      description: 'علوم المعاني والبيان والبديع وعصور الأدب العربي',
    },
    {
      code: 'SEC1-ENGLISH',
      name: 'اللغة الأجنبية الأولى (الإنجليزية)',
      category: 'cultural' as const,
      maxGrade: 40,
      minPassingGrade: 20,
      weeklyHours: 3,
      description: 'المقرر الثانوي الأزهري للغة الإنجليزية',
    },
    {
      code: 'SEC1-FRENCH',
      name: 'اللغة الأجنبية الثانية (الفرنسية)',
      category: 'cultural' as const,
      maxGrade: 30,
      minPassingGrade: 15,
      weeklyHours: 2,
      description: 'أساسيات اللغة الفرنسية لطلاب الأزهر',
    },
    {
      code: 'SEC1-MATH',
      name: 'الرياضيات العامة (الجبر وحساب المثلثات والهندسة التحليلية)',
      category: 'scientific' as const,
      maxGrade: 50,
      minPassingGrade: 25,
      weeklyHours: 4,
      description: 'المفاهيم الرياضية للمرحلة الثانوية',
    },
    {
      code: 'SEC1-PHYSICS',
      name: 'الفيزياء والكيمياء',
      category: 'scientific' as const,
      maxGrade: 40,
      minPassingGrade: 20,
      weeklyHours: 3,
      description: 'مبادئ الميكانيكا، الحرارة، البنية الذرية والتفاعلات',
    },
    {
      code: 'SEC1-BIOLOGY',
      name: 'الأحياء والجيولوجيا',
      category: 'scientific' as const,
      maxGrade: 30,
      minPassingGrade: 15,
      weeklyHours: 2,
      description: 'الخلية، الوراثة وتراكيب الأرض',
    },
    {
      code: 'SEC1-HISTORY',
      name: 'التاريخ والجغرافيا',
      category: 'cultural' as const,
      maxGrade: 40,
      minPassingGrade: 20,
      weeklyHours: 2,
      description: 'تاريخ مصر والحضارات القديمة وجغرافية البيئة',
    },
  ],

  // المرحلة الثانوية - القسم العلمي (الصف الثاني والثالث الثانوي)
  sec_scientific: [
    {
      code: 'SCI-QURAN',
      name: 'القرآن الكريم وتجويده',
      category: 'sharia' as const,
      maxGrade: 40,
      minPassingGrade: 20,
      weeklyHours: 3,
      description: 'تلاوة وحفظ سورة البقرة وآل عمران والمقررات الأزهرية',
    },
    {
      code: 'SCI-FIQH',
      name: 'الفقه المذهبي التخصصي',
      category: 'sharia' as const,
      maxGrade: 40,
      minPassingGrade: 20,
      weeklyHours: 3,
      description: 'فقه المعاملات والجنايات والأسرة حسب مذهب الطالب',
    },
    {
      code: 'SCI-TAFSEER',
      name: 'التفسير والحديث والتوحيد',
      category: 'sharia' as const,
      maxGrade: 70,
      minPassingGrade: 35,
      weeklyHours: 4,
      description: 'أصول الدين والمواد الشرعية الأساسية للثانوية الأزهرية',
    },
    {
      code: 'SCI-ARABIC-1',
      name: 'النحو والصرف',
      category: 'arabic' as const,
      maxGrade: 40,
      minPassingGrade: 20,
      weeklyHours: 3,
      description: 'قواعد النحو العربي وأبنية الأفعال والمشتقات من ألفية ابن مالك',
    },
    {
      code: 'SCI-ARABIC-2',
      name: 'البلاغة والأدب والنصوص والإنشاء',
      category: 'arabic' as const,
      maxGrade: 40,
      minPassingGrade: 20,
      weeklyHours: 3,
      description: 'المحسنات البديعية والبيانية والشعر العربي القديم والحديث',
    },
    {
      code: 'SCI-ENGLISH',
      name: 'اللغة الأجنبية الأولى (الإنجليزية)',
      category: 'cultural' as const,
      maxGrade: 40,
      minPassingGrade: 20,
      weeklyHours: 4,
      description: 'مهارات اللغة الأجنبية، النصوص والترجمة الأكاديمية',
    },
    {
      code: 'SCI-FRENCH',
      name: 'اللغة الأجنبية الثانية (الفرنسية)',
      category: 'cultural' as const,
      maxGrade: 30,
      minPassingGrade: 15,
      weeklyHours: 2,
      description: 'المستوى الثاني للغة الفرنسية',
    },
    {
      code: 'SCI-MATH-PURE',
      name: 'الرياضيات البحتة (التفاضل والتكامل والجبر والهندسة الفراغية)',
      category: 'scientific' as const,
      maxGrade: 60,
      minPassingGrade: 30,
      weeklyHours: 4,
      description: 'التحليل الرياضي والمصفوفات والمتجهات ثلاثية الأبعاد',
    },
    {
      code: 'SCI-MATH-APP',
      name: 'الرياضيات التطبيقية (الميكانيكا: الاستاتيكا والديناميكا)',
      category: 'scientific' as const,
      maxGrade: 40,
      minPassingGrade: 20,
      weeklyHours: 3,
      description: 'قوانين نيوتن وحركة الأجسام والاتزان الميكانيكي',
    },
    {
      code: 'SCI-PHYSICS',
      name: 'الفيزياء',
      category: 'scientific' as const,
      maxGrade: 60,
      minPassingGrade: 30,
      weeklyHours: 4,
      description: 'الفيزياء الكلاسيكية والكهربية والمغناطيسية والفيزياء الحديثة',
    },
    {
      code: 'SCI-CHEMISTRY',
      name: 'الكيمياء العامة والعضوية',
      category: 'scientific' as const,
      maxGrade: 60,
      minPassingGrade: 30,
      weeklyHours: 4,
      description: 'العناصر الانتقالية، الاتزان الكيميائي، الكيمياء الكهربية والكيمياء العضوية',
    },
    {
      code: 'SCI-BIOLOGY',
      name: 'الأحياء والجيولوجيا',
      category: 'scientific' as const,
      maxGrade: 60,
      minPassingGrade: 30,
      weeklyHours: 3,
      description: 'الدعامة والحركة، التنسيق الهرموني، التكاثر والبيولوجيا الجزيئية DNA',
    },
  ],

  // المرحلة الثانوية - القسم الأدبي (الصف الثاني والثالث الثانوي)
  sec_literary: [
    {
      code: 'LIT-QURAN',
      name: 'القرآن الكريم وتجويده',
      category: 'sharia' as const,
      maxGrade: 40,
      minPassingGrade: 20,
      weeklyHours: 3,
      description: 'مقرر الحفظ والتلاوة والأحكام للثانوية الأزهرية الأدبية',
    },
    {
      code: 'LIT-FIQH',
      name: 'الفقه المذهبي التخصصي',
      category: 'sharia' as const,
      maxGrade: 40,
      minPassingGrade: 20,
      weeklyHours: 3,
      description: 'الأحكام الفقهية المفصلة على المذهب مع الأدلة الشرعية',
    },
    {
      code: 'LIT-TAFSEER',
      name: 'التفسير والحديث',
      category: 'sharia' as const,
      maxGrade: 60,
      minPassingGrade: 30,
      weeklyHours: 4,
      description: 'تفسير سور القرآن الكريم، فتح المبين وشرح الحديث النبوي',
    },
    {
      code: 'LIT-TAWHID-LOGIC',
      name: 'التوحيد والمنطق القديم والحديث',
      category: 'sharia' as const,
      maxGrade: 50,
      minPassingGrade: 25,
      weeklyHours: 3,
      description: 'عقائد أهل السنة والجماعة وقواعد المنطق الصوري والاستدلالي',
    },
    {
      code: 'LIT-NAHW',
      name: 'النحو والصرف التخصصي',
      category: 'arabic' as const,
      maxGrade: 50,
      minPassingGrade: 25,
      weeklyHours: 4,
      description: 'دراسة تعمقية لألفية ابن مالك وشذا العرف في فن الصرف',
    },
    {
      code: 'LIT-BALAGHA',
      name: 'البلاغة والأدب والنصوص والعروض',
      category: 'arabic' as const,
      maxGrade: 50,
      minPassingGrade: 25,
      weeklyHours: 4,
      description: 'المعاني والبيان والبديع، بحور الشعر العربي وتاريخ الأدب في العصور المختلفة',
    },
    {
      code: 'LIT-INSHA',
      name: 'الإنشاء والمطالعة الأدبية',
      category: 'arabic' as const,
      maxGrade: 30,
      minPassingGrade: 15,
      weeklyHours: 2,
      description: 'فنون المقال الأدبي والتحرير الصحفي ونقد النصوص',
    },
    {
      code: 'LIT-ENGLISH',
      name: 'اللغة الأجنبية الأولى (الإنجليزية)',
      category: 'cultural' as const,
      maxGrade: 40,
      minPassingGrade: 20,
      weeklyHours: 4,
      description: 'مقرر اللغة الإنجليزية المعتمد للثانوي الأزهري الأدبي',
    },
    {
      code: 'LIT-FRENCH',
      name: 'اللغة الأجنبية الثانية (الفرنسية)',
      category: 'cultural' as const,
      maxGrade: 30,
      minPassingGrade: 15,
      weeklyHours: 2,
      description: 'قواعد اللغة الفرنسية والترجمة',
    },
    {
      code: 'LIT-HISTORY',
      name: 'التاريخ الحديث والمعاصر وتاريخ الحضارة الإسلامية',
      category: 'cultural' as const,
      maxGrade: 50,
      minPassingGrade: 25,
      weeklyHours: 3,
      description: 'تاريخ مصر والشرق العربي، الثورات والحركات التحررية والحضارة الإسلامية',
    },
    {
      code: 'LIT-GEOGRAPHY',
      name: 'الجغرافيا السياسية والاقتصادية',
      category: 'cultural' as const,
      maxGrade: 50,
      minPassingGrade: 25,
      weeklyHours: 3,
      description: 'الخريطة السياسية للعالم، التكتلات الاقتصادية، الأحلاف العسكرية والحدود',
    },
    {
      code: 'LIT-PHILOSOPHY',
      name: 'الفلسفة وقضايا العصر وعلم النفس والاجتماع',
      category: 'cultural' as const,
      maxGrade: 50,
      minPassingGrade: 25,
      weeklyHours: 3,
      description: 'الفلسفة الأخلاقية والبيئية، مدارس علم النفس ونظريات علم الاجتماع',
    },
  ],
};

/**
 * Returns subjects tailored for a student's specific stage, grade, track, and madhhab.
 */
export function getCurriculumSubjectsForStudent(
  stage: StageType,
  grade: GradeType,
  track: TrackType = 'general',
  madhhab: MadhhabType = 'شافعي'
): CurriculumSubjectDetail[] {
  let list: CurriculumSubjectDetail[] = [];

  if (stage === 'preparatory') {
    list = [...AZHAR_EGYPTIAN_CURRICULUM.preparatory];
  } else if (grade === 'sec_1') {
    list = [...AZHAR_EGYPTIAN_CURRICULUM.sec_1];
  } else if (track === 'scientific') {
    list = [...AZHAR_EGYPTIAN_CURRICULUM.sec_scientific];
  } else {
    list = [...AZHAR_EGYPTIAN_CURRICULUM.sec_literary];
  }

  // Refine subject name with specific madhhab
  return list.map((sub) => {
    if (sub.name.includes('الفقه')) {
      return {
        ...sub,
        name: `الفقه ال${madhhab}ي`,
      };
    }
    return sub;
  });
}

/**
 * Convert curriculum list into standard Subject[] models for the institute system.
 */
export function generateAllInstituteSubjects(): Subject[] {
  const result: Subject[] = [];
  const addedCodes = new Set<string>();

  const processCategory = (items: CurriculumSubjectDetail[], stage: 'preparatory' | 'secondary' | 'both', grade: GradeType | 'all', track?: TrackType | 'all') => {
    items.forEach((item) => {
      const uniqueId = `sub-${item.code.toLowerCase()}`;
      if (!addedCodes.has(uniqueId)) {
        addedCodes.add(uniqueId);
        result.push({
          id: uniqueId,
          code: item.code,
          name: item.name,
          category: item.category,
          stage,
          grade,
          track,
          maxGrade: item.maxGrade,
          minPassingGrade: item.minPassingGrade,
          weeklyHours: item.weeklyHours,
          description: item.description,
        });
      }
    });
  };

  processCategory(AZHAR_EGYPTIAN_CURRICULUM.preparatory, 'preparatory', 'all', 'general');
  processCategory(AZHAR_EGYPTIAN_CURRICULUM.sec_1, 'secondary', 'sec_1', 'general');
  processCategory(AZHAR_EGYPTIAN_CURRICULUM.sec_scientific, 'secondary', 'all', 'scientific');
  processCategory(AZHAR_EGYPTIAN_CURRICULUM.sec_literary, 'secondary', 'all', 'literary');

  return result;
}
