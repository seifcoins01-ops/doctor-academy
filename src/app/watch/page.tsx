'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useLanguageStore } from '@/store/languageStore';
import Link from 'next/link';
import ProtectedVideo from '@/components/video/ProtectedVideo';

export default function WatchPage() {
  const { t, language } = useLanguageStore();
  const isArabic = language === 'ar';
  const [user, setUser] = useState<any>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const checkAccess = async () => {
      const { data } = await supabase
        .from('user_access')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setHasAccess(true);
      }
      setLoading(false);
    };

    checkAccess();
  }, [user]);

  // منع الخروج من الصفحة
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">⏳ تحميل...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <p className="text-xl text-gray-300 mb-4">{isArabic ? 'يجب تسجيل الدخول أولاً' : 'Please login first'}</p>
          <Link href="/login" className="text-blue-400 hover:underline text-lg">{t.nav.login}</Link>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <p className="text-xl text-gray-300 mb-4">{isArabic ? 'يجب شراء الحصة أولاً' : 'Please purchase the lesson first'}</p>
          <Link href="/emirates/g9" className="text-blue-400 hover:underline text-lg">{isArabic ? 'شراء الحصة' : 'Buy Lesson'}</Link>
        </div>
      </div>
    );
  }

  return (
    <div dir={isArabic ? 'rtl' : 'ltr'} className="min-h-screen bg-gray-900 py-6 px-4">
      <div className="max-w-5xl mx-auto">
        <Link href="/emirates/g9" className="text-gray-400 hover:text-white mb-4 inline-block text-sm">
          ← {isArabic ? 'رجوع للمادة' : 'Back to course'}
        </Link>
        
        <ProtectedVideo 
          src="https://www.w3schools.com/html/mov_bbb.mp4" 
          title="الحصة الأولى - Doctor Academy"
        />

        <div className="mt-6">
          <h1 className="text-2xl font-bold text-white mb-2">
            {isArabic ? 'الحصة الأولى - الأساسيات' : 'Lesson 1 - Basics'}
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>👨‍⚕️ {t.doctors.drLoaie}</span>
            <span>|</span>
            <span>📅 60 دقيقة</span>
            <span>|</span>
            <span className="text-green-400">✅ تم الشراء</span>
          </div>
          <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
            <p className="text-yellow-400 text-sm flex items-center gap-2">
              <span>🔒</span>
              {isArabic 
                ? 'هذا المحتوى محمي. أي محاولة لتحميل أو تسجيل الفيديو سيتم اكتشافها.'
                : 'This content is protected. Any attempt to download or record will be detected.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}