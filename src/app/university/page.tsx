'use client';

import Link from 'next/link';
import { useLanguageStore } from '@/store/languageStore';

export default function UniversityPage() {
  const { t, language } = useLanguageStore();
  const isArabic = language === 'ar';

  const sections = [
    {
      title: t.university.basic,
      slug: 'basic',
      icon: '🔬',
      desc: isArabic ? 'مواد العلوم الأساسية' : 'Basic Sciences Courses'
    },
    {
      title: t.university.programming,
      slug: 'programming',
      icon: '💻',
      desc: isArabic ? 'مواد البرمجة' : 'Programming Courses'
    }
  ];

  return (
    <div dir={isArabic ? 'rtl' : 'ltr'} className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-blue-600">{t.nav.home}</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{t.nav.university}</span>
        </div>

        {/* Doctor Info */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            👨‍⚕️
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{t.doctors.drLoaie}</h2>
            <p className="text-gray-500 text-sm">{isArabic ? 'مسؤول القسم' : 'Section Head'}</p>
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-10">
          {t.nav.university}
        </h1>

        {/* Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((section) => (
            <Link
              key={section.slug}
              href={`/university/${section.slug}`}
              className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl hover:scale-105 transition transform text-center border-2 border-transparent hover:border-blue-500"
            >
              <div className="text-5xl mb-4">{section.icon}</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{section.title}</h2>
              <p className="text-gray-500 text-sm">{section.desc}</p>
              <span className="inline-block mt-4 text-blue-600 font-semibold text-sm">
                {isArabic ? 'تصفح ➜' : 'Browse ➜'}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}