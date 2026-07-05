'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useLanguageStore } from '@/store/languageStore';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID = 'service_0lwm793';
const EMAILJS_TEMPLATE_ID = 'template_جديد'; // حط Template ID الجديد
const EMAILJS_PUBLIC_KEY = 'GZHtebHLm6KTI7Y7O';

export default function SettingsPage() {
  const { t, language } = useLanguageStore();
  const isArabic = language === 'ar';
  const [user, setUser] = useState<any>(null);
  const [showForgotKey, setShowForgotKey] = useState(false);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) setUser(JSON.parse(saved));
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }, []);

  const handleSendCode = async () => {
    if (!email) {
      toast.error(isArabic ? 'برجاء إدخال الإيميل' : 'Please enter email');
      return;
    }
    setLoading(true);

    try {
      const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

      const { error: dbError } = await supabase.from('reset_codes').insert({
        user_id: user?.id,
        code: resetCode,
        expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      });

      if (dbError) throw dbError;

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          to_email: email,
          code: resetCode,
        }
      );

      toast.success(
        isArabic ? 'تم إرسال الكود إلى إيميلك' : 'Code sent to your email'
      );

      setStep(2);
    } catch (error: any) {
      toast.error(isArabic ? 'فشل إرسال الكود' : 'Failed to send code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!code) {
      toast.error(isArabic ? 'برجاء إدخال الكود' : 'Please enter code');
      return;
    }
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('reset_codes')
        .select('*')
        .eq('user_id', user?.id)
        .eq('code', code)
        .eq('used', false)
        .gte('expires_at', new Date().toISOString())
        .single();

      if (error || !data) {
        toast.error(isArabic ? 'كود غير صحيح أو منتهي' : 'Invalid or expired code');
        setLoading(false);
        return;
      }

      await supabase.from('reset_codes').update({ used: true }).eq('id', data.id);

      const { data: userData } = await supabase
        .from('users')
        .select('secret_key')
        .eq('id', user?.id)
        .single();

      if (userData) {
        setSecretKey(userData.secret_key);
        setStep(3);
        toast.success(isArabic ? 'تم التحقق بنجاح!' : 'Verified successfully!');
      }
    } catch (error: any) {
      toast.error(isArabic ? 'فشل التحقق' : 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">{isArabic ? 'يجب تسجيل الدخول' : 'Please login first'}</p>
      </div>
    );
  }

  return (
    <div dir={isArabic ? 'rtl' : 'ltr'} className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-blue-600">{t.nav.home}</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{isArabic ? 'إعدادات الحساب' : 'Account Settings'}</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {isArabic ? 'إعدادات الحساب' : 'Account Settings'}
        </h1>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            👤 {isArabic ? 'معلومات الحساب' : 'Account Info'}
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">{isArabic ? 'الاسم' : 'Name'}</span>
              <span className="font-medium">{user.full_name || '-'}</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">{isArabic ? 'الإيميل' : 'Email'}</span>
              <span className="font-medium">{user.email || '-'}</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">{isArabic ? 'الهاتف' : 'Phone'}</span>
              <span className="font-medium">{user.phone || '-'}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            🔑 {isArabic ? 'استعادة المفتاح السري' : 'Recover Secret Key'}
          </h2>

          {!showForgotKey ? (
            <button
              onClick={() => setShowForgotKey(true)}
              className="text-blue-600 hover:underline font-medium"
            >
              {isArabic ? 'نسيت المفتاح السري؟' : 'Forgot your secret key?'}
            </button>
          ) : (
            <div className="space-y-4">
              {step === 1 && (
                <>
                  <p className="text-sm text-gray-600 mb-4">
                    {isArabic 
                      ? 'أدخل إيميلك وسنرسل لك كود تحقق'
                      : 'Enter your email and we will send you a verification code'}
                  </p>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg text-gray-900"
                    placeholder="example@gmail.com"
                  />
                  <button
                    onClick={handleSendCode}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {loading ? '...' : isArabic ? 'إرسال الكود' : 'Send Code'}
                  </button>
                </>
              )}

              {step === 2 && (
                <>
                  <p className="text-sm text-gray-600 mb-4">
                    {isArabic 
                      ? 'أدخل الكود المرسل إلى إيميلك'
                      : 'Enter the code sent to your email'}
                  </p>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg text-gray-900 text-2xl tracking-widest text-center font-bold"
                    placeholder={isArabic ? 'أدخل الكود' : 'Enter code'}
                  />
                  <button
                    onClick={handleVerifyCode}
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
                  >
                    {loading ? '...' : isArabic ? 'تحقق' : 'Verify'}
                  </button>
                  <button
                    onClick={() => { setStep(1); setCode(''); }}
                    className="w-full text-blue-600 hover:underline text-sm"
                  >
                    {isArabic ? 'إعادة إرسال الكود' : 'Resend code'}
                  </button>
                </>
              )}

              {step === 3 && (
                <div className="text-center space-y-4">
                  <div className="text-4xl">🔑</div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {isArabic ? 'مفتاحك السري هو:' : 'Your secret key is:'}
                  </h3>
                  <div className="bg-gray-900 text-white text-4xl font-bold py-4 rounded-lg tracking-widest">
                    {secretKey}
                  </div>
                  <p className="text-sm text-gray-500">
                    {isArabic ? 'احفظه في مكان آمن' : 'Keep it in a safe place'}
                  </p>
                  <button
                    onClick={() => { setShowForgotKey(false); setStep(1); setEmail(''); setCode(''); setSecretKey(''); }}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    {isArabic ? 'تم' : 'Done'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}