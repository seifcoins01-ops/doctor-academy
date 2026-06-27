'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useLanguageStore } from '@/store/languageStore';
import { toast } from 'react-hot-toast';

interface Lesson {
  id: string;
  title: string;
  price: number;
  description?: string;
  url?: string;
}

export default function G9Page() {
  const { t, language } = useLanguageStore();
  const isArabic = language === 'ar';
  const [showPayment, setShowPayment] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson>({ id: '', title: '', price: 0 });
  const [user, setUser] = useState<any>(null);
  const [secretKeyInput, setSecretKeyInput] = useState('');
  const [referenceInput, setReferenceInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) setUser(JSON.parse(saved));
    loadLessons();
  }, []);

  const loadLessons = async () => {
    const { data, error } = await supabase
      .from('content')
      .select('*')
      .eq('course_id', 'emirates-g9')
      .order('created_at', { ascending: false });

    if (data) {
      setLessons(data);
    }
    setPageLoading(false);
  };

  const openPayment = (lesson: Lesson) => {
    if (!user) {
      toast.error(isArabic ? 'يجب تسجيل الدخول أولاً' : 'Please login first');
      return;
    }
    setSelectedLesson(lesson);
    setStep(1);
    setSecretKeyInput('');
    setReferenceInput('');
    setPhoneInput('');
    setScreenshot(null);
    setShowPayment(true);
  };

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setScreenshot(e.target.files[0]);
    }
  };

  const handleSubmitPayment = async () => {
    if (!secretKeyInput || !phoneInput) {
      toast.error(isArabic ? 'برجاء ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
      return;
    }
    setLoading(true);

    try {
      let screenshotUrl = null;

      if (screenshot) {
        const fileExt = screenshot.name.split('.').pop();
        const fileName = `${user.id}_${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('payment-screenshots')
          .upload(fileName, screenshot);

        if (!uploadError && uploadData) {
          const { data: urlData } = supabase.storage
            .from('payment-screenshots')
            .getPublicUrl(fileName);
          screenshotUrl = urlData.publicUrl;
        }
      }

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
          screenshotUrl,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setStep(3);
        toast.success(isArabic ? 'تم تأكيد الدفع! الحصة متاحة الآن' : 'Payment confirmed! Lesson unlocked');
      } else {
        toast.error(result.message || (isArabic ? 'فشل التحقق من الدفع' : 'Payment verification failed'));
        if (result.locked) {
          toast.error(isArabic ? 'تم قفل الحساب لكثرة المحاولات' : 'Account locked');
        }
      }
    } catch (error: any) {
      toast.error(isArabic ? 'حدث خطأ' : 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowPayment(false);
    setStep(1);
  };

  return (
    <div dir={isArabic ? 'rtl' : 'ltr'} className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-blue-600">{t.nav.home}</Link>
          <span className="mx-2">/</span>
          <Link href="/emirates" className="hover:text-blue-600">{t.emirates.title}</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{t.emirates.g9}</span>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">👨‍⚕️</div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{t.doctors.drLoaie}</h2>
            <p className="text-gray-500 text-sm">{isArabic ? 'مدرس المادة' : 'Course Instructor'}</p>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 text-center mb-4">{t.emirates.g9}</h1>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📹 {isArabic ? 'الحصص المتاحة' : 'Available Lessons'}</h2>
          
          {pageLoading ? (
            <p className="text-center text-gray-400 py-8">⏳ {isArabic ? 'جاري التحميل...' : 'Loading...'}</p>
          ) : lessons.length === 0 ? (
            <p className="text-center text-gray-400 py-8">{isArabic ? 'لا توجد حصص حالياً' : 'No lessons available'}</p>
          ) : (
            <div className="space-y-4">
              {lessons.map((lesson) => (
                <div key={lesson.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{lesson.title}</p>
                    <p className="text-sm text-gray-500">{lesson.price} ج.م</p>
                  </div>
                  <button 
                    onClick={() => openPayment(lesson)} 
                    className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
                  >
                    {isArabic ? 'شراء الحصة' : 'Buy Lesson'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🎥</span>
            <h2 className="text-2xl font-bold">{t.meetings.title}</h2>
          </div>
          <p className="text-white/90 mb-4">{isArabic ? `احجز جلسة مباشرة مع ${t.doctors.drLoaie}` : `Book a live session with ${t.doctors.drLoaie}`}</p>
          <button onClick={() => openPayment({ id: 'g9-live', title: t.meetings.title, price: 150 })} className="bg-white text-green-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition">
            {t.meetings.bookNow}
          </button>
        </div>

        {showPayment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full my-8">
              {step === 1 && (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                    {t.payment.title}
                  </h2>
                  
                  <div className="bg-blue-50 border-2 border-blue-500 rounded-lg p-4 mb-4">
                    <h3 className="font-bold text-blue-700 text-lg mb-2">
                      📋 {isArabic ? 'تعليمات الدفع' : 'Payment Instructions'}
                    </h3>
                    <ol className="list-decimal list-inside text-sm text-gray-700 space-y-2">
                      <li>{isArabic ? 'افتح تطبيق فودافون كاش على هاتفك' : 'Open Vodafone Cash app on your phone'}</li>
                      <li>{isArabic ? 'اختر "تحويل فلوس"' : 'Select "Send Money"'}</li>
                      <li>
                        {isArabic ? 'ادخل الرقم: ' : 'Enter number: '}
                        <span className="font-bold text-red-600">{t.payment.phoneNumber}</span>
                      </li>
                      <li>
                        {isArabic ? 'المبلغ: ' : 'Amount: '}
                        <span className="font-bold text-green-600">{selectedLesson.price} ج.م</span>
                      </li>
                      <li className="font-bold text-red-600">
                        {isArabic ? '⚠️ في خانة المرجع: اكتب مفتاحك السري (6 أرقام)' : '⚠️ In reference field: Write your 6-digit secret key'}
                      </li>
                    </ol>
                  </div>

                  <div className="bg-yellow-50 border-2 border-yellow-500 rounded-lg p-4 mb-4">
                    <p className="font-bold text-yellow-700 mb-1">
                      🔑 {isArabic ? 'المفتاح السري' : 'Secret Key'}
                    </p>
                    <p className="text-sm text-gray-700">
                      {isArabic 
                        ? 'المفتاح السري الخاص بك هو 6 أرقام حصلت عليها عند التسجيل. اكتبه في خانة "المرجع" في تطبيق فودافون كاش.'
                        : 'Your secret key is the 6-digit number you received when registering. Write it in the "Reference" field in Vodafone Cash app.'}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {isArabic 
                        ? 'إذا نسيت مفتاحك، راجع إعدادات الحساب.'
                        : 'If you forgot your key, check account settings.'}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {isArabic ? 'رقم هاتفك (المرسل)' : 'Your Phone Number (Sender)'} *
                      </label>
                      <input 
                        type="tel" 
                        value={phoneInput} 
                        onChange={(e) => setPhoneInput(e.target.value)} 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
                        placeholder="010XXXXXXXX" 
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        {isArabic ? 'نفس الرقم المسجل به في المنصة' : 'Same number registered on the platform'}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {isArabic ? 'المفتاح السري (6 أرقام)' : 'Secret Key (6 digits)'} *
                      </label>
                      <input 
                        type="text" 
                        value={secretKeyInput} 
                        onChange={(e) => setSecretKeyInput(e.target.value)} 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 text-2xl tracking-widest text-center font-bold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
                        placeholder="••••••" 
                        maxLength={6} 
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        {isArabic ? 'نفس الرقم الذي كتبته في خانة المرجع في فودافون كاش' : 'Same number you wrote in the reference field in Vodafone Cash'}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {isArabic ? 'رقم مرجع فودافون (اختياري)' : 'Vodafone Reference Number (optional)'}
                      </label>
                      <input 
                        type="text" 
                        value={referenceInput} 
                        onChange={(e) => setReferenceInput(e.target.value)} 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
                        placeholder={isArabic ? 'الرقم اللي ظهر في رسالة التأكيد' : 'Number shown in confirmation SMS'} 
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        📸 {isArabic ? 'إثبات الدفع (سكرين شوت)' : 'Payment Proof (Screenshot)'}
                      </label>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleScreenshotUpload} 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        {isArabic ? 'صورة من رسالة تأكيد الدفع (اختياري)' : 'Screenshot of payment confirmation (optional)'}
                      </p>
                    </div>

                    <button 
                      onClick={handleSubmitPayment} 
                      disabled={loading} 
                      className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
                    >
                      {loading ? '⏳...' : isArabic ? '✅ تأكيد الدفع' : '✅ Confirm Payment'}
                    </button>
                  </div>
                </>
              )}

              {step === 3 && (
                <div className="text-center space-y-4">
                  <div className="text-6xl">🎉</div>
                  <h2 className="text-2xl font-bold text-green-600">
                    {isArabic ? 'تم بنجاح!' : 'Success!'}
                  </h2>
                  <p className="text-gray-700">{selectedLesson.title}</p>
                  <p className="text-sm text-gray-500">
                    {isArabic ? 'الحصة متاحة الآن' : 'Lesson is now available'}
                  </p>
                  <Link href="/watch" className="block w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                    {isArabic ? '▶️ مشاهدة الحصة' : '▶️ Watch Lesson'}
                  </Link>
                </div>
              )}

              {step !== 3 && (
                <button 
                  onClick={handleClose} 
                  className="w-full mt-4 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
                >
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