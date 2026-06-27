'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useLanguageStore } from '@/store/languageStore';
import { toast } from 'react-hot-toast';
import GoogleButton from '@/components/auth/GoogleButton';

export default function LoginPage() {
  const router = useRouter();
  const { t, language } = useLanguageStore();
  const isArabic = language === 'ar';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      toast.error(isArabic ? 'برجاء إدخال البريد الإلكتروني وكلمة المرور' : 'Please enter email and password');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .single();

      if (error || !data) {
        toast.error(isArabic ? 'بريد إلكتروني أو كلمة مرور غير صحيحة' : 'Invalid email or password');
        setLoading(false);
        return;
      }

      localStorage.setItem('user', JSON.stringify(data));

      toast.success(isArabic ? 'تم تسجيل الدخول بنجاح!' : 'Login successful!');
      
      setTimeout(() => {
        router.push('/');
        router.refresh();
      }, 300);
      
    } catch (error: any) {
      toast.error(error.message || (isArabic ? 'حدث خطأ ما' : 'Something went wrong'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir={isArabic ? 'rtl' : 'ltr'} className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto flex items-center justify-center text-white text-2xl font-bold">
            DA
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
          {t.auth.loginTitle}
        </h1>

        {/* Google Button */}
        <GoogleButton />

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-sm text-gray-500">{isArabic ? 'أو' : 'or'}</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t.auth.email}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900 bg-white"
              placeholder="example@gmail.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {isArabic ? 'كلمة المرور' : 'Password'}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900 bg-white"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (isArabic ? 'جاري الدخول...' : 'Logging in...') : t.auth.loginBtn}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          {isArabic ? 'ليس لديك حساب؟' : "Don't have an account?"}{' '}
          <a href="/register" className="text-blue-600 hover:underline">
            {t.auth.submit}
          </a>
        </p>
      </div>
    </div>
  );
}