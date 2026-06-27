'use client';

import Link from 'next/link';
import { useLanguageStore } from '@/store/languageStore';

export default function UniversityBasicPage() {
  const { t, language } = useLanguageStore();
  const isArabic = language === 'ar';

  return (
    <div dir={isArabic ? 'rtl' : 'ltr'} className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-blue-600">{t.nav.home}</Link>
          <span className="mx-2">/</span>
          <Link href="/university" className="hover:text-blue-600">{t.nav.university}</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{t.university.basic}</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
          {t.university.basic}
        </h1>
        <p className="text-center text-gray-600 mb-10">
          {t.doctors.drLoaie}
        </p>

        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <div className="text-6xl mb-4">🔬</div>
          <p className="text-gray-500 text-lg">
            {isArabic ? 'سيتم إضافة المواد من لوحة التحكم' : 'Courses will be added from the Admin Dashboard'}
          </p>
        </div>
      </div>
    </div>
  );
}