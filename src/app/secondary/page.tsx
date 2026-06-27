'use client';

import Link from 'next/link';
import { useLanguageStore } from '@/store/languageStore';

export default function SecondaryPage() {
  const { t, language } = useLanguageStore();
  const isArabic = language === 'ar';

  return (
    <div dir={isArabic ? 'rtl' : 'ltr'} className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-blue-600">{t.nav.home}</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{t.nav.secondary}</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
          {t.sections.secondaryTitle}
        </h1>
        <p className="text-center text-gray-600 mb-10">
          {t.sections.secondaryDesc}
        </p>

        {/* Track Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Languages Track */}
          <Link
            href="/secondary/languages"
            className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl hover:scale-105 transition transform text-center border-2 border-transparent hover:border-blue-500"
          >
            <div className="text-6xl mb-4">🌍</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.sections.languages}</h2>
            <p className="text-gray-500 text-sm">
              {isArabic ? 'فيزياء - كيمياء - رياضيات - أحياء' : 'Physics - Chemistry - Math - Biology'}
            </p>
            <span className="inline-block mt-4 text-blue-600 font-semibold text-sm">
              {isArabic ? 'تصفح المواد ➜' : 'Browse Subjects ➜'}
            </span>
          </Link>

          {/* Arabic Track */}
          <Link
            href="/secondary/arabic"
            className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl hover:scale-105 transition transform text-center border-2 border-transparent hover:border-green-500"
          >
            <div className="text-6xl mb-4">📖</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.sections.arabic}</h2>
            <p className="text-gray-500 text-sm">
              {isArabic ? 'فيزياء - كيمياء - رياضيات - أحياء' : 'Physics - Chemistry - Math - Biology'}
            </p>
            <span className="inline-block mt-4 text-green-600 font-semibold text-sm">
              {isArabic ? 'تصفح المواد ➜' : 'Browse Subjects ➜'}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}