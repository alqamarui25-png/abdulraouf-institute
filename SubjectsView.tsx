/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Library, Plus, Search, BookOpen, Layers, Award, Sparkles } from 'lucide-react';
import { Subject, SubjectCategory } from '../../types';

interface SubjectsViewProps {
  subjects: Subject[];
  onSaveSubject: (subject: Partial<Subject>) => Promise<void>;
}

export const SubjectsView: React.FC<SubjectsViewProps> = ({
  subjects,
  onSaveSubject,
}) => {
  const [activeCategory, setActiveCategory] = useState<SubjectCategory | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState<SubjectCategory>('sharia');
  const [stage, setStage] = useState<'preparatory' | 'secondary' | 'both'>('both');
  const [maxGrade, setMaxGrade] = useState(50);
  const [minPassingGrade, setMinPassingGrade] = useState(25);
  const [weeklyHours, setWeeklyHours] = useState(3);
  const [description, setDescription] = useState('');

  const filteredSubjects = subjects.filter(s => {
    if (activeCategory !== 'all' && s.category !== activeCategory) return false;
    if (searchTerm && !s.name.includes(searchTerm) && !s.code.includes(searchTerm)) return false;
    return true;
  });

  const getCategoryInfo = (cat: SubjectCategory) => {
    switch (cat) {
      case 'sharia': return { label: 'المواد الشرعية', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
      case 'arabic': return { label: 'المواد العربية', color: 'bg-amber-100 text-amber-900 border-amber-300' };
      case 'cultural': return { label: 'المواد الثقافية', color: 'bg-blue-100 text-blue-900 border-blue-300' };
      case 'scientific': return { label: 'المواد العلمية', color: 'bg-purple-100 text-purple-900 border-purple-300' };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveSubject({
      name,
      category,
      stage,
      maxGrade: Number(maxGrade),
      minPassingGrade: Number(minPassingGrade),
      weeklyHours: Number(weeklyHours),
      description,
    });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 text-right">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <Library className="w-5 h-5 text-emerald-800" />
            <h2 className="text-lg font-bold text-stone-900">
              المناهج والمقررات الدراسية الأزهرية
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            دليل المواد الشرعية، العربية، الثقافية، والعلمية المعتمدة بقطاع المعاهد الأزهرية مع توزيع النهايات العظمى والصغرى.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة مادة دراسية</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        <button
          onClick={() => setActiveCategory('all')}
          className={`p-3 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
            activeCategory === 'all'
              ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
              : 'bg-white border-stone-200 text-stone-700 hover:border-emerald-600'
          }`}
        >
          كافة المقررات ({subjects.length})
        </button>

        <button
          onClick={() => setActiveCategory('sharia')}
          className={`p-3 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
            activeCategory === 'sharia'
              ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
              : 'bg-white border-stone-200 text-stone-700 hover:border-emerald-600'
          }`}
        >
          1. المواد الشرعية ({subjects.filter(s => s.category === 'sharia').length})
        </button>

        <button
          onClick={() => setActiveCategory('arabic')}
          className={`p-3 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
            activeCategory === 'arabic'
              ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
              : 'bg-white border-stone-200 text-stone-700 hover:border-emerald-600'
          }`}
        >
          2. المواد العربية ({subjects.filter(s => s.category === 'arabic').length})
        </button>

        <button
          onClick={() => setActiveCategory('cultural')}
          className={`p-3 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
            activeCategory === 'cultural'
              ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
              : 'bg-white border-stone-200 text-stone-700 hover:border-emerald-600'
          }`}
        >
          3. المواد الثقافية ({subjects.filter(s => s.category === 'cultural').length})
        </button>

        <button
          onClick={() => setActiveCategory('scientific')}
          className={`p-3 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
            activeCategory === 'scientific'
              ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
              : 'bg-white border-stone-200 text-stone-700 hover:border-emerald-600'
          }`}
        >
          4. المواد العلمية ({subjects.filter(s => s.category === 'scientific').length})
        </button>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSubjects.map((sub) => {
          const info = getCategoryInfo(sub.category);
          return (
            <div
              key={sub.id}
              className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-3 relative hover:border-emerald-600 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded border ${info.color}`}>
                    {info.label}
                  </span>
                  <h3 className="font-bold text-sm text-stone-900 mt-1.5">{sub.name}</h3>
                </div>
                <span className="font-mono text-xs text-stone-400">{sub.code}</span>
              </div>

              {sub.description && (
                <p className="text-xs text-stone-600 leading-relaxed">
                  {sub.description}
                </p>
              )}

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-100 text-xs text-center font-mono">
                <div className="bg-stone-50 p-2 rounded">
                  <span className="text-[10px] text-stone-400 font-sans block">العظمى</span>
                  <strong className="text-stone-900">{sub.maxGrade}</strong>
                </div>
                <div className="bg-stone-50 p-2 rounded">
                  <span className="text-[10px] text-stone-400 font-sans block">الصغرى</span>
                  <strong className="text-stone-700">{sub.minPassingGrade}</strong>
                </div>
                <div className="bg-emerald-50 p-2 rounded">
                  <span className="text-[10px] text-emerald-700 font-sans block">الحصص</span>
                  <strong className="text-emerald-950 font-bold">{sub.weeklyHours} أسبوعياً</strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-stone-200 w-full max-w-md p-6 space-y-4 text-right text-xs">
            <h3 className="font-bold text-sm text-stone-900 border-b border-stone-200 pb-2">
              إضافة مادة دراسية جديدة للمقررات
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block font-bold text-stone-800 mb-1">اسم المادة الدراسية *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: الفقه المالكي"
                  className="w-full px-3 py-1.5 border border-stone-300 rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-800 mb-1">التصنيف *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-1.5 border border-stone-300 rounded bg-white"
                  >
                    <option value="sharia">مواد شرعية</option>
                    <option value="arabic">مواد عربية</option>
                    <option value="cultural">مواد ثقافية وعامة</option>
                    <option value="scientific">مواد علمية</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-800 mb-1">المرحلة *</label>
                  <select
                    value={stage}
                    onChange={(e) => setStage(e.target.value as any)}
                    className="w-full px-3 py-1.5 border border-stone-300 rounded bg-white"
                  >
                    <option value="both">إعدادي وثانوي</option>
                    <option value="preparatory">إعدادي فقط</option>
                    <option value="secondary">ثانوي فقط</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-stone-800 mb-1">الدرجة العظمى</label>
                  <input
                    type="number"
                    value={maxGrade}
                    onChange={(e) => setMaxGrade(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-stone-300 rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-800 mb-1">درجة النجاح</label>
                  <input
                    type="number"
                    value={minPassingGrade}
                    onChange={(e) => setMinPassingGrade(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-stone-300 rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-800 mb-1">الحصص أسبوعياً</label>
                  <input
                    type="number"
                    value={weeklyHours}
                    onChange={(e) => setWeeklyHours(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-stone-300 rounded font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">وصف المنهج أو الكتاب المقرر</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="مثال: شرح ابن قاسم الغزي على متن أبي شجاع..."
                  className="w-full px-3 py-1.5 border border-stone-300 rounded"
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
                  حفظ المادة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
