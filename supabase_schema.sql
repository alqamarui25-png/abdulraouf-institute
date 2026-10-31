-- ==============================================================================
-- معهد عبد الرؤوف الإعدادي والثانوي الأزهري (بنين)
-- Abdel Raouf Al-Azhar Preparatory & Secondary Institute for Boys
-- سكربت إنشاء جداول وسياسات أمان قاعدة بيانات Supabase (PostgreSQL + RLS)
-- ==============================================================================

-- 1. تفعيل الامتدادات المطلوبة
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. جدول ملفات المستخدمين والصلاحيات (Profiles)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'teacher' CHECK (role IN ('headmaster', 'teacher', 'student_affairs', 'control', 'accountant', 'admin_staff')),
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. جدول الفصول الدراسية (Classes)
CREATE TABLE IF NOT EXISTS public.classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    stage TEXT NOT NULL CHECK (stage IN ('preparatory', 'secondary')),
    grade TEXT NOT NULL CHECK (grade IN ('prep_1', 'prep_2', 'prep_3', 'sec_1', 'sec_2', 'sec_3')),
    track TEXT DEFAULT 'general' CHECK (track IN ('general', 'scientific', 'literary')),
    room_number TEXT NOT NULL,
    capacity INT DEFAULT 35,
    supervisor_teacher_id UUID,
    supervisor_teacher_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. جدول شؤون الطلاب (Students)
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_code TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    national_id TEXT NOT NULL,
    birth_date DATE NOT NULL,
    birth_place TEXT NOT NULL,
    stage TEXT NOT NULL CHECK (stage IN ('preparatory', 'secondary')),
    grade TEXT NOT NULL CHECK (grade IN ('prep_1', 'prep_2', 'prep_3', 'sec_1', 'sec_2', 'sec_3')),
    track TEXT DEFAULT 'general' CHECK (track IN ('general', 'scientific', 'literary')),
    class_id UUID REFERENCES public.classes(id) ON DELETE SET NULL,
    class_name TEXT NOT NULL,
    is_international BOOLEAN DEFAULT FALSE,
    nationality TEXT DEFAULT 'مصري',
    passport_number TEXT,
    residence_number TEXT,
    residence_expiry DATE,
    madhhab TEXT CHECK (madhhab IN ('شافعي', 'حنفي', 'مالكي', 'حنبلي')),
    native_language TEXT DEFAULT 'العربية',
    embassy_contact TEXT,
    guardian_name TEXT NOT NULL,
    guardian_relation TEXT NOT NULL,
    guardian_phone TEXT NOT NULL,
    guardian_job TEXT,
    address TEXT NOT NULL,
    governorate TEXT NOT NULL,
    enrollment_date DATE DEFAULT CURRENT_DATE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'transferred', 'graduated', 'suspended')),
    photo_url TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. جدول السجل التاريخي والتدرج الدراسي (Academic History)
CREATE TABLE IF NOT EXISTS public.academic_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    student_name TEXT,
    school_year TEXT NOT NULL, -- e.g. 2024/2025
    stage TEXT NOT NULL CHECK (stage IN ('preparatory', 'secondary')),
    grade TEXT NOT NULL CHECK (grade IN ('prep_1', 'prep_2', 'prep_3', 'sec_1', 'sec_2', 'sec_3')),
    track TEXT DEFAULT 'general' CHECK (track IN ('general', 'scientific', 'literary')),
    term1_score NUMERIC(5,2) DEFAULT 0,
    term2_score NUMERIC(5,2) DEFAULT 0,
    total_score NUMERIC(5,2) DEFAULT 0,
    max_score NUMERIC(5,2) DEFAULT 100,
    percentage NUMERIC(5,2) DEFAULT 0,
    evaluation TEXT CHECK (evaluation IN ('ممتاز', 'جيد جداً', 'جيد', 'مقبول', 'دور ثان')),
    rank_in_class INT,
    conduct TEXT DEFAULT 'حسن السير والسلوك',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. جدول المدرسين وهيئة التدريس (Staff)
CREATE TABLE IF NOT EXISTS public.staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    national_id TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('headmaster', 'teacher', 'student_affairs', 'control', 'accountant', 'admin_staff')),
    specialization TEXT NOT NULL,
    stage TEXT NOT NULL CHECK (stage IN ('preparatory', 'secondary', 'both')),
    phone TEXT NOT NULL,
    email TEXT,
    qualification TEXT NOT NULL,
    hiring_date DATE DEFAULT CURRENT_DATE,
    weekly_quota INT DEFAULT 18,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'on_leave')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. جدول المواد الدراسية والمناهج الأزهرية (Subjects)
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('sharia', 'arabic', 'cultural', 'scientific')),
    stage TEXT NOT NULL CHECK (stage IN ('preparatory', 'secondary', 'both')),
    grade TEXT NOT NULL DEFAULT 'all',
    track TEXT DEFAULT 'all' CHECK (track IN ('all', 'scientific', 'literary')),
    max_grade NUMERIC(5,2) NOT NULL,
    min_passing_grade NUMERIC(5,2) NOT NULL,
    weekly_hours INT DEFAULT 2,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. جدول الحصص والجداول الأسبوعية (Schedules)
CREATE TABLE IF NOT EXISTS public.schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    day TEXT NOT NULL CHECK (day IN ('الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس')),
    period_number INT NOT NULL CHECK (period_number BETWEEN 1 AND 7),
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    subject_name TEXT NOT NULL,
    teacher_id UUID REFERENCES public.staff(id) ON DELETE SET NULL,
    teacher_name TEXT NOT NULL,
    time_slot TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. جدول الحضور والغياب (Attendance)
CREATE TABLE IF NOT EXISTS public.attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'excused', 'late')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, date)
);

-- 10. جدول الامتحانات والدرجات والكنترول (Exam Results)
CREATE TABLE IF NOT EXISTS public.exam_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    school_year TEXT NOT NULL,
    term TEXT NOT NULL CHECK (term IN ('الفصل الدراسي الأول', 'الفصل الدراسي الثاني')),
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    subject_name TEXT NOT NULL,
    subject_category TEXT NOT NULL,
    coursework_score NUMERIC(5,2) DEFAULT 0,
    oral_score NUMERIC(5,2) DEFAULT 0,
    written_score NUMERIC(5,2) DEFAULT 0,
    total_score NUMERIC(5,2) NOT NULL,
    max_score NUMERIC(5,2) NOT NULL,
    is_passed BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. جدول المصروفات والإيصالات المالية (Fee Records)
CREATE TABLE IF NOT EXISTS public.fee_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    receipt_number TEXT UNIQUE NOT NULL,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    grade TEXT NOT NULL,
    school_year TEXT NOT NULL,
    fee_type TEXT NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    paid_amount NUMERIC(10,2) NOT NULL,
    remaining_amount NUMERIC(10,2) DEFAULT 0,
    payment_date DATE DEFAULT CURRENT_DATE,
    payment_method TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('paid', 'partial', 'unpaid')),
    collector_name TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- إعداد سياسات الأمان على مستوى الصفوف (Row Level Security - RLS)
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_records ENABLE ROW LEVEL SECURITY;

-- سياسات القراءة والكتابة للمستخدمين المصادقين والمفتاح العام (anon)
CREATE POLICY "Allow public read classes" ON public.classes FOR SELECT USING (true);
CREATE POLICY "Allow authenticated manage classes" ON public.classes FOR ALL USING (true);

CREATE POLICY "Allow read students" ON public.students FOR SELECT USING (true);
CREATE POLICY "Allow manage students" ON public.students FOR ALL USING (true);

CREATE POLICY "Allow read academic_history" ON public.academic_history FOR SELECT USING (true);
CREATE POLICY "Allow manage academic_history" ON public.academic_history FOR ALL USING (true);

CREATE POLICY "Allow read staff" ON public.staff FOR SELECT USING (true);
CREATE POLICY "Allow manage staff" ON public.staff FOR ALL USING (true);

CREATE POLICY "Allow read subjects" ON public.subjects FOR SELECT USING (true);
CREATE POLICY "Allow manage subjects" ON public.subjects FOR ALL USING (true);

CREATE POLICY "Allow read schedules" ON public.schedules FOR SELECT USING (true);
CREATE POLICY "Allow manage schedules" ON public.schedules FOR ALL USING (true);

CREATE POLICY "Allow read attendance" ON public.attendance FOR SELECT USING (true);
CREATE POLICY "Allow manage attendance" ON public.attendance FOR ALL USING (true);

CREATE POLICY "Allow read exam_results" ON public.exam_results FOR SELECT USING (true);
CREATE POLICY "Allow manage exam_results" ON public.exam_results FOR ALL USING (true);

CREATE POLICY "Allow read fee_records" ON public.fee_records FOR SELECT USING (true);
CREATE POLICY "Allow manage fee_records" ON public.fee_records FOR ALL USING (true);

CREATE POLICY "Allow user read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow user update profile" ON public.profiles FOR ALL USING (auth.uid() = id);
