'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguageStore } from '@/store/languageStore';

export default function Header() {
  const { t, language, setLanguage } = useLanguageStore();
  const isArabic = language === 'ar';
  const [user, setUser] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      const cookies = document.cookie.split('; ');
      const userCookie = cookies.find(c => c.startsWith('user_data='));
      if (userCookie) {
        const userData = JSON.parse(decodeURIComponent(userCookie.split('=')[1]));
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      }
    }
  }, []);

  const toggleLanguage = () => {
    setLanguage(isArabic ? 'en' : 'ar');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    document.cookie = 'user_data=; path=/; max-age=0';
    setUser(null);
    setShowDropdown(false);
    window.location.href = '/';
  };

  const getInitial = () => {
    if (user?.full_name) {
      return user.full_name.charAt(0).toUpperCase();
    }
    return '?';
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              DA
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">
              Doctor Academy
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6" dir={isArabic ? 'rtl' : 'ltr'}>
            <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition">
              {t.nav.home}
            </Link>
            <Link href="/secondary" className="text-gray-700 hover:text-blue-600 font-medium transition">
              {t.nav.secondary}
            </Link>
            <Link href="/university" className="text-gray-700 hover:text-blue-600 font-medium transition">
              {t.nav.university}
            </Link>
            <Link href="/emirates" className="text-gray-700 hover:text-red-600 font-medium transition">
              {isArabic ? 'طلبة الإمارات' : 'Emirates Students'}
            </Link>
          </nav>

          <div className="flex items-center gap-3" dir={isArabic ? 'rtl' : 'ltr'}>
            <button
              onClick={toggleLanguage}
              className="text-sm text-gray-600 hover:text-blue-600 font-medium transition px-2 py-1"
            >
              {t.nav.language}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg hover:bg-blue-700 transition"
                  title={user.full_name || user.email}
                >
                  {getInitial()}
                </button>

                {showDropdown && (
                  <div className="absolute top-12 right-0 bg-white rounded-lg shadow-xl border border-gray-200 py-2 w-48 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.full_name || 'User'}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <Link
                      href="/settings"
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                      onClick={() => setShowDropdown(false)}
                    >
                      ⚙️ {isArabic ? 'الإعدادات' : 'Settings'}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition"
                    >
                      {isArabic ? 'تسجيل الخروج' : 'Logout'}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm text-gray-700 hover:text-blue-600 font-medium transition"
                >
                  {t.nav.login}
                </Link>
                <Link
                  href="/register"
                  className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  {t.nav.register}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}