'use client';

import Link from 'next/link';
import { useLanguageStore } from '@/store/languageStore';

export default function HomePage() {
  const { t, language } = useLanguageStore();
  const isArabic = language === 'ar';

  const sections = [
    {
      title: t.nav.secondary,
      desc: t.sections.secondaryDesc,
      href: '/secondary',
      color: 'from-blue-500 to-blue-700',
      icon: '🎓',
    },
    {
      title: t.nav.university,
      desc: t.site.description,
      href: '/university',
      color: 'from-green-500 to-green-700',
      icon: '🏛️',
    },
    {
      title: t.nav.emirates,
      desc: 'G9 - G10 - G11 - G12',
      href: '/emirates',
      color: 'from-red-500 to-red-700',
      icon: '🇦🇪',
    },
  ];

  return (
    <div dir={isArabic ? 'rtl' : 'ltr'} className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            {t.site.name}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            {t.site.tagline}
          </p>
          <Link
            href="/register"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-xl text-lg font-semibold hover:bg-blue-700 transition shadow-lg"
          >
            {isArabic ? 'انضم إلينا' : 'Join Us'}
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {['📹 Videos', '🎮 Games', '📄 Files', '💳 Easy Pay'].map((feat, i) => (
            <div key={i} className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition">
              <p className="font-medium text-gray-700">{feat}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sections Cards */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
            {isArabic ? 'الأقســـام الرئيسية' : 'Main Sections'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sections.map((section, i) => (
              <Link
                key={i}
                href={section.href}
                className={`bg-gradient-to-br ${section.color} text-white rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:scale-105 transition transform text-center`}
              >
                <div className="text-5xl mb-4">{section.icon}</div>
                <h3 className="text-2xl font-bold mb-2">{section.title}</h3>
                <p className="text-white/80 text-sm">{section.desc}</p>
                <span className="inline-block mt-4 text-sm font-semibold border border-white/50 rounded-full px-4 py-1 hover:bg-white/20 transition">
                  {isArabic ? 'تصفّح ➜' : 'Browse ➜'}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}