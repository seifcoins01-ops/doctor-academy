'use client';

import Link from 'next/link';
import { useLanguageStore } from '@/store/languageStore';

export default function UniversityProgrammingPage() {
  const { t, language } = useLanguageStore();
  const isArabic = language === 'ar';

  const courses = [
    { name: t.university.python, slug: 'python', icon: '🐍' },
    { name: t.university.cpp, slug: 'cpp', icon: '⚙️' },
    { name: t.university.dataStructure, slug: 'data-structure', icon: '📊' },
  ];

  return (
    <div dir={isArabic ? 'rtl' : 'ltr'} className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-blue-600">{t.nav.home}</Link>
          <span className="mx-2">/</span>
          <Link href="/university" className="hover:text-blue-600">{t.nav.university}</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{t.university.programming}</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
          {t.university.programming}
        </h1>
        <p className="text-center text-gray-600 mb-10">
          {t.doctors.drLoaie}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Link
              key={course.slug}
              href={`/university/programming/${course.slug}`}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl hover:scale-105 transition transform text-center border-2 border-transparent hover:border-purple-500"
            >
              <div className="text-5xl mb-4">{course.icon}</div>
              <h3 className="text-xl font-bold text-gray-900">{course.name}</h3>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}