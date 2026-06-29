'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useLanguageStore } from '@/store/languageStore';
import { toast } from 'react-hot-toast';
import GoogleButton from '@/components/auth/GoogleButton';

export default function RegisterPage() {
  const router = useRouter();
  const { t, language } = useLanguageStore();
  const isArabic = language === 'ar';

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    age: '',
    phone: '',
    section: '',
    universityType: '',
    guardianPhone: '',
  });
  const [loading, setLoading] = useState(false);

  const validateEgyptianPhone = (phone: string): boolean => {
    const egyptianPhoneRegex = /^(010|011|012|015)\d{8}$/;
    return egyptianPhoneRegex.test(phone);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!form.fullName || !form.email || !form.password || !form.age || !form.phone || !form.section) {
      toast.error(isArabic ? 'برجاء ملء جميع الحقول المطلوبة' : 'Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (form.password.length < 6) {
      toast.error(isArabic ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : 'Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    if (!validateEgyptianPhone(form.phone)) {
      toast.error(isArabic ? 'رقم الهاتف غير صحيح' : 'Invalid phone number');
      setLoading(false);
      return;
    }

    if (form.section === 'secondary' && !form.guardianPhone) {
      toast.error(isArabic ? 'رقم ولي الأمر مطلوب' : 'Guardian phone number is required');
      setLoading(false);
      return;
    }

    if (form.section === 'university' && !form.universityType) {
      toast.error(isArabic ? 'برجاء اختيار نوع القسم' : 'Please select department type');
      setLoading(false);
      return;
    }

    try {
      const secretKey = Math.floor(100000 + Math.random() * 900000).toString();

      const { data, error } = await supabase
        .from('users')
        .insert({
          full_name: form.fullName,
          email: form.email,
          password: form.password,
          age: parseInt(form.age),
          phone: form.phone,
          section: form.section,
          university_type: form.universityType || null,
          guardian_phone: form.guardianPhone || null,
          role: 'student',
          secret_key: secretKey,
        })
        .select();

      if (error) {
        console.error('Supabase error:', JSON.stringify(error));
        
        if (error?.message?.includes('duplicate') || error?.code === '23505') {
          toast.error(isArabic ? 'هذا الإيميل مسجل بالفعل' : 'This email is already registered');
        } else {
          toast.error(isArabic ? 'حدث خطأ في التسجيل' : 'Registration error');
        }
        setLoading(false);
        return;
      }

      if (data && data[0]) {
        localStorage.setItem('user', JSON.stringify(data[0]));
        toast.success(
          isArabic 
            ? `تم التسجيل! مفتاحك السري: ${secretKey}` 
            : `Registered! Your secret key: ${secretKey}`,
          { duration: 10000 }
        );
      }

      setTimeout(() => {
        router.push('/');
        router.refresh();
      }, 1500);
      
    } catch (error: any) {
      console.error('Catch error:', error);
      toast.error(error.message || (isArabic ? 'حدث خطأ ما' : 'Something went wrong'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir={isArabic ? 'rtl' : 'ltr'} className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto flex items-center justify-center text-white text-2xl font-bold">DA</div>
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">{t.auth.welcome}</h1>
        <p className="text-center text-gray-500 mb-6 text-sm">{t.site.tagline}</p>

        <GoogleButton />

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-sm text-gray-500">{isArabic ? 'أو' : 'or'}</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{isArabic ? 'الاسم الكامل' : 'Full Name'}</label>
            <input type="text" name="fullName" value={form.fullName} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900 bg-white" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.auth.email}</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900 bg-white" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{isArabic ? 'كلمة المرور' : 'Password'}</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900 bg-white" required minLength={6} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.auth.age}</label>
            <input type="number" name="age" value={form.age} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900 bg-white" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{isArabic ? 'رقم الهاتف' : 'Phone Number'}</label>
            <input type="tel" name="phone" value={form.phone} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900 bg-white" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.auth.selectSection}</label>
            <select name="section" value={form.section} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white text-gray-900" required>
              <option value="">{isArabic ? '-- اختر --' : '-- Select --'}</option>
              <option value="secondary">{t.auth.secondary}</option>
              <option value="university">{t.auth.university}</option>
            </select>
          </div>

          {form.section === 'university' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{isArabic ? 'اختر القسم' : 'Select Department'}</label>
              <select name="universityType" value={form.universityType} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white text-gray-900" required>
                <option value="">{isArabic ? '-- اختر --' : '-- Select --'}</option>
                <option value="basic">{t.university.basic}</option>
                <option value="programming">{t.university.programming}</option>
              </select>
            </div>
          )}

          {form.section === 'secondary' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.auth.guardianPhone}</label>
              <input type="tel" name="guardianPhone" value={form.guardianPhone} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900 bg-white" required />
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? (isArabic ? 'جاري التسجيل...' : 'Registering...') : t.auth.submit}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">{t.auth.haveAccount}</p>
      </div>
    </div>
  );
}