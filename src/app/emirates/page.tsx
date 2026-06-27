'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguageStore } from '@/store/languageStore';

export default function EmiratesPage() {
  const { t, language } = useLanguageStore();
  const isArabic = language === 'ar';
  const [showPayment, setShowPayment] = useState(false);

  const grades = [
    { name: t.emirates.g9, slug: 'g9', icon: '9️⃣' },
    { name: t.emirates.g10, slug: 'g10', icon: '🔟' },
    { name: t.emirates.g11, slug: 'g11', icon: '1️⃣1️⃣' },
    { name: t.emirates.g12, slug: 'g12', icon: '1️⃣2️⃣' },
  ];

  return (
    <div dir={isArabic ? 'rtl' : 'ltr'} className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-blue-600">{t.nav.home}</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{t.emirates.title}</span>
        </div>

        {/* Doctor Info */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">👨‍⚕️</div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{t.doctors.drLoaie}</h2>
            <p className="text-gray-500 text-sm">{isArabic ? 'مسؤول القسم' : 'Section Head'}</p>
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
          {t.emirates.title}
        </h1>
        <p className="text-center text-gray-600 mb-10">
          {isArabic ? 'اختر الصف الدراسي' : 'Choose your grade'}
        </p>

        {/* Grades Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {grades.map((grade) => (
            <Link
              key={grade.slug}
              href={`/emirates/${grade.slug}`}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl hover:scale-105 transition transform text-center border-2 border-transparent hover:border-red-500"
            >
              <div className="text-4xl mb-3">{grade.icon}</div>
              <h3 className="text-lg font-bold text-gray-900">{grade.name}</h3>
              <p className="text-xs text-gray-500 mt-2">
                {isArabic ? 'اضغط للدخول' : 'Click to enter'}
              </p>
            </Link>
          ))}
        </div>

        {/* Meetings Section */}
        <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🎥</span>
            <h2 className="text-2xl font-bold">{t.meetings.title}</h2>
          </div>
          <p className="text-white/90 mb-4">
            {isArabic ? `احجز جلسة مباشرة مع ${t.doctors.drLoaie}` : `Book a live session with ${t.doctors.drLoaie}`}
          </p>
          <button
            onClick={() => setShowPayment(true)}
            className="bg-white text-green-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition"
          >
            {t.meetings.bookNow}
          </button>
        </div>

        {/* Payment Modal */}
        {showPayment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                {t.payment.title}
              </h2>

              <div className="space-y-4 mb-6">
                <p className="text-center text-gray-600 mb-4">
                  {isArabic ? 'اختر طريقة الدفع' : 'Choose payment method'}
                </p>

                <div className="bg-gray-50 p-4 rounded-lg border-2 border-green-500">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">📱</span>
                    <span className="font-bold text-green-600">{t.payment.vodafoneCash}</span>
                  </div>
                  <p className="text-sm text-gray-700">{t.payment.phoneNumber}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border-2 border-purple-500">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">💳</span>
                    <span className="font-bold text-purple-600">{t.payment.instaPay}</span>
                  </div>
                  <p className="text-sm text-gray-700">{t.payment.phoneNumber}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border-2 border-red-500">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🏦</span>
                    <span className="font-bold text-red-600">{t.emirates.bankTransfer}</span>
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                      {isArabic ? 'لطلبة الإمارات' : 'For Emirates'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{t.emirates.bankAccount}</p>
                </div>
              </div>

              <button
                onClick={() => setShowPayment(false)}
                className="w-full bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
              >
                {isArabic ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}