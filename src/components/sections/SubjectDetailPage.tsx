'use client';

import Link from 'next/link';
import { useLanguageStore } from '@/store/languageStore';

interface SubjectDetailPageProps {
  subjectName: string;
  trackName: string;
  trackSlug: string;
  gameType?: 'chemistry' | 'physics';
  doctorName: string;
}

export default function SubjectDetailPage({ subjectName, trackName, trackSlug, gameType, doctorName }: SubjectDetailPageProps) {
  const { t, language } = useLanguageStore();
  const isArabic = language === 'ar';

  const sampleVideos = [
    { id: 1, title: isArabic ? 'الدرس الأول - الأساسيات' : 'Lesson 1 - Basics' },
    { id: 2, title: isArabic ? 'الدرس الثاني - مفاهيم متقدمة' : 'Lesson 2 - Advanced Concepts' },
    { id: 3, title: isArabic ? 'الدرس الثالث - تطبيقات' : 'Lesson 3 - Applications' },
  ];

  const sampleFiles = [
    { id: 1, title: isArabic ? 'مذكرة الشرح' : 'Study Notes' },
    { id: 2, title: isArabic ? 'ورقة تمارين' : 'Practice Sheet' },
    { id: 3, title: isArabic ? 'امتحانات سابقة' : 'Past Exams' },
  ];

  return (
    <div dir={isArabic ? 'rtl' : 'ltr'} className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-blue-600">{t.nav.home}</Link>
          <span className="mx-2">/</span>
          <Link href="/secondary" className="hover:text-blue-600">{t.nav.secondary}</Link>
          <span className="mx-2">/</span>
          <Link href={`/secondary/${trackSlug}`} className="hover:text-blue-600">{trackName}</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{subjectName}</span>
        </div>

        {/* Doctor Info */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            👨‍⚕️
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{doctorName}</h2>
            <p className="text-gray-500 text-sm">{isArabic ? 'مدرس المادة' : 'Course Instructor'}</p>
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-10">
          {subjectName}
        </h1>

        {/* Videos & Files */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Videos */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              📹 {isArabic ? 'فيديوهات الشرح' : 'Lesson Videos'}
            </h2>
            <div className="space-y-3">
              {sampleVideos.map((video) => (
                <div key={video.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <span className="text-gray-700 text-sm font-medium">{video.title}</span>
                  <button className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full hover:bg-blue-700 transition">
                    {isArabic ? 'مشاهدة' : 'Watch'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Files */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              📄 {isArabic ? 'الملفات والملازم' : 'Files & Resources'}
            </h2>
            <div className="space-y-3">
              {sampleFiles.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <span className="text-gray-700 text-sm font-medium">{file.title}</span>
                  <button className="bg-green-600 text-white text-xs px-3 py-1 rounded-full hover:bg-green-700 transition">
                    {isArabic ? 'تحميل' : 'Download'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Meetings Section */}
        <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🎥</span>
            <h2 className="text-2xl font-bold">{t.meetings.title}</h2>
          </div>
          <p className="text-white/90 mb-4">
            {isArabic ? `احجز جلسة مباشرة مع ${doctorName}` : `Book a live session with ${doctorName}`}
          </p>
          <div className="flex items-center gap-4">
            <span className="text-lg font-bold">{t.meetings.price}: 100 ج.م</span>
            <button className="bg-white text-green-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition">
              {t.meetings.bookNow}
            </button>
          </div>
        </div>

        {/* Games Section (only for Chemistry and Physics) */}
        {gameType && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              🎮 {isArabic ? 'قســم الألعاب التفاعلية' : 'Interactive Games'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {gameType === 'chemistry' && (
                <>
                  <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl p-6 text-center">
                    <div className="text-5xl mb-3">⚗️</div>
                    <h3 className="text-lg font-bold mb-2">{t.games.chemistryGame}</h3>
                    <button className="mt-3 bg-white text-purple-600 px-4 py-2 rounded-full font-semibold text-sm hover:bg-gray-100 transition">
                      {t.games.tryNow}
                    </button>
                  </div>
                  <div className="bg-gradient-to-br from-indigo-500 to-blue-500 text-white rounded-xl p-6 text-center">
                    <div className="text-5xl mb-3">🧪</div>
                    <h3 className="text-lg font-bold mb-2">{t.games.chemistryLab}</h3>
                    <button className="mt-3 bg-white text-indigo-600 px-4 py-2 rounded-full font-semibold text-sm hover:bg-gray-100 transition">
                      {t.games.watchExperiment}
                    </button>
                  </div>
                </>
              )}
              {gameType === 'physics' && (
                <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-xl p-6 text-center md:col-span-2">
                  <div className="text-5xl mb-3">🔬</div>
                  <h3 className="text-lg font-bold mb-2">{t.games.physicsGame}</h3>
                  <button className="mt-3 bg-white text-orange-600 px-4 py-2 rounded-full font-semibold text-sm hover:bg-gray-100 transition">
                    {t.games.tryNow}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}