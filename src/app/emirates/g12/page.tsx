'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useLanguageStore } from '@/store/languageStore';
import { toast } from 'react-hot-toast';

export default function G12Page() {
  const { t, language } = useLanguageStore();
  const isArabic = language === 'ar';
  const [showPayment, setShowPayment] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState({ title: '', price: 0, id: '' });
  const [user, setUser] = useState<any>(null);
  const [secretKeyInput, setSecretKeyInput] = useState('');
  const [referenceInput, setReferenceInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const openPayment = (title: string, price: number, id: string) => {
    if (!user) {
      toast.error(isArabic ? 'يجب تسجيل الدخول أولاً' : 'Please login first');
      return;
    }
    setSelectedLesson({ title, price, id });
    setStep(1);
    setSecretKeyInput('');
    setReferenceInput('');
    setPhoneInput('');
    setScreenshot(null);
    setShowPayment(true);
  };

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setScreenshot(e.target.files[0]);
  };

  const handleSubmitPayment = async () => {
    if (!secretKeyInput || !phoneInput) {
      toast.error(isArabic ? 'برجاء ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          phone: phoneInput,
          secretKey: secretKeyInput,
          reference: referenceInput,
          amount: selectedLesson.price,
          lessonId: selectedLesson.id,
        }),
      });
      const result = await response.json();
      if (result.success) {
        setStep(3);
        toast.success(isArabic ? 'تم تأكيد الدفع! الحصة متاحة الآن' : 'Payment confirmed! Lesson unlocked');
      } else {
        toast.error(result.message || (isArabic ? 'فشل التحقق من الدفع' : 'Payment verification failed'));
        if (result.locked) toast.error(isArabic ? 'تم قفل الحساب لكثرة المحاولات' : 'Account locked due to too many attempts');
      }
    } catch (error: any) {
      toast.error(isArabic ? 'حدث خطأ' : 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => { setShowPayment(false); setStep(1); };

  return (
    <div dir={isArabic ? 'rtl' : 'ltr'} className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-blue-600">{t.nav.home}</Link>
          <span className="mx-2">/</span>
          <Link href="/emirates" className="hover:text-blue-600">{t.emirates.title}</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{t.emirates.g12}</span>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">👨‍⚕️</div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{t.doctors.drLoaie}</h2>
            <p className="text-gray-500 text-sm">{isArabic ? 'مدرس المادة' : 'Course Instructor'}</p>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 text-center mb-4">{t.emirates.g12}</h1>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📹 {isArabic ? 'الحصص المتاحة' : 'Available Lessons'}</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{isArabic ? 'الحصة الأولى' : 'Lesson 1'}</p>
                <p className="text-sm text-gray-500">100 ج.م</p>
              </div>
              <button onClick={() => openPayment(isArabic ? 'الحصة الأولى' : 'Lesson 1', 100, 'g12-l1')} className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition">
                {isArabic ? 'شراء الحصة' : 'Buy Lesson'}
              </button>
            </div>
          </div>
        </div>

        {showPayment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full my-8">
              {step === 1 && (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">{t.payment.title}</h2>
                  <div className="bg-blue-50 border-2 border-blue-500 rounded-lg p-4 mb-4">
                    <h3 className="font-bold text-blue-700 text-lg mb-2">📋 {isArabic ? 'تعليمات الدفع' : 'Payment Instructions'}</h3>
                    <ol className="list-decimal list-inside text-sm text-gray-700 space-y-2">
                      <li>{isArabic ? 'افتح تطبيق فودافون كاش' : 'Open Vodafone Cash app'}</li>
                      <li>{isArabic ? 'اختر تحويل فلوس' : 'Select Send Money'}</li>
                      <li>{isArabic ? 'الرقم: ' : 'Number: '}<span className="font-bold text-red-600">{t.payment.phoneNumber}</span></li>
                      <li>{isArabic ? 'المبلغ: ' : 'Amount: '}<span className="font-bold text-green-600">{selectedLesson.price} ج.م</span></li>
                      <li className="font-bold text-red-600">{isArabic ? '⚠️ في خانة المرجع: اكتب مفتاحك السري' : '⚠️ In reference: Write your secret key'}</li>
                    </ol>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{isArabic ? 'رقم هاتفك' : 'Your Phone'} *</label>
                      <input type="tel" value={phoneInput} onChange={(e) => setPhoneInput(e.target.value)} className="w-full px-4 py-3 border rounded-lg text-gray-900" placeholder="010XXXXXXXX" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{isArabic ? 'المفتاح السري' : 'Secret Key'} *</label>
                      <input type="text" value={secretKeyInput} onChange={(e) => setSecretKeyInput(e.target.value)} className="w-full px-4 py-3 border rounded-lg text-gray-900 text-2xl tracking-widest text-center font-bold" placeholder="••••••" maxLength={6} />
                    </div>
                    <button onClick={handleSubmitPayment} disabled={loading} className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50">
                      {loading ? '⏳...' : isArabic ? '✅ تأكيد الدفع' : '✅ Confirm Payment'}
                    </button>
                  </div>
                </>
              )}
              {step === 3 && (
                <div className="text-center space-y-4">
                  <div className="text-6xl">🎉</div>
                  <h2 className="text-2xl font-bold text-green-600">{isArabic ? 'تم بنجاح!' : 'Success!'}</h2>
                  <p className="text-gray-700">{selectedLesson.title}</p>
                  <Link href="/watch" className="block w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                    {isArabic ? '▶️ مشاهدة الحصة' : '▶️ Watch Lesson'}
                  </Link>
                </div>
              )}
              {step !== 3 && (
                <button onClick={handleClose} className="w-full mt-4 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition">
                  {isArabic ? 'إغلاق' : 'Close'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}