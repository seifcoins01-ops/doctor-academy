'use client';

import Link from 'next/link';
import { useLanguageStore } from '@/store/languageStore';

interface Subject {
  nameKey: string;
  slug: string;
  icon: string;
  hasGame?: 'chemistry' | 'physics';
}

interface SubjectsPageProps {
  trackName: string;
  trackSlug: string;
}

export default function SubjectsPage({ trackName, trackSlug }: SubjectsPageProps) {
  const { t, language } = useLanguageStore();
  const isArabic = language === 'ar';

  const subjects: Subject[] = [
    { nameKey: 'physics', slug: 'physics', icon: '⚛️', hasGame: 'physics' },
    { nameKey: 'chemistry', slug: 'chemistry', icon: '🧪', hasGame: 'chemistry' },
    { nameKey: 'math', slug: 'math', icon: '📐' },
    { nameKey: 'biology', slug: 'biology', icon: '🧬' },
  ];

  const getSubjectName = (key: string) => {
    const names: Record<string, string> = {
      physics: t.sections.physics,
      chemistry: t.sections.chemistry,
      math: t.sections.math,
      biology: t.sections.biology,
    };
    return names[key] || key;
  };

  return (
    <div dir={isArabic ? 'rtl' : 'ltr'} className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-blue-600">{t.nav.home}</Link>
          <span className="mx-2">/</span>
          <Link href="/secondary" className="hover:text-blue-600">{t.nav.secondary}</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{trackName}</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
          {trackName}
        </h1>
        <p className="text-center text-gray-600 mb-10">
          {t.sections.subjects}
        </p>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {subjects.map((subject) => (
            <Link
              key={subject.slug}
              href={`/secondary/${trackSlug}/${subject.slug}`}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl hover:scale-105 transition transform text-center border-2 border-transparent hover:border-blue-500"
            >
              <div className="text-5xl mb-4">{subject.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {getSubjectName(subject.nameKey)}
              </h3>
              <div className="flex flex-wrap justify-center gap-1 mt-3">
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">📹 {isArabic ? 'فيديو' : 'Video'}</span>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">📄 {isArabic ? 'ملفات' : 'Files'}</span>
                {subject.hasGame && (
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">🎮 {isArabic ? 'ألعاب' : 'Games'}</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}