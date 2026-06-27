'use client';

import Link from 'next/link';
import { useLanguageStore } from '@/store/languageStore';

export default function Footer() {
  const { t, language } = useLanguageStore();
  const isArabic = language === 'ar';

  return (
    <footer className="bg-gray-900 text-white" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                DA
              </div>
              <span className="text-xl font-bold">Doctor Academy</span>
            </div>
            <p className="text-gray-400 text-sm">
              {t.site.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">
              {isArabic ? 'روابط سريعة' : 'Quick Links'}
            </h3>
            <ul className="space-y-2">
              <li><Link href="/secondary" className="text-gray-400 hover:text-white transition text-sm">{t.nav.secondary}</Link></li>
              <li><Link href="/university" className="text-gray-400 hover:text-white transition text-sm">{t.nav.university}</Link></li>
              <li><Link href="/programming" className="text-gray-400 hover:text-white transition text-sm">{t.nav.programming}</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-lg mb-4">
              {isArabic ? 'قانوني' : 'Legal'}
            </h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition text-sm">{t.footer.privacy}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition text-sm">{t.footer.terms}</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}