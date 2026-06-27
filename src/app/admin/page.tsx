'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useLanguageStore } from '@/store/languageStore';
import { 
  LayoutDashboard, BookOpen, Video, Users, DollarSign, 
  Palette, LogOut, Stethoscope, CreditCard, Radio, Globe, Plus, Trash2, Shield, RotateCcw, Timer
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AdminDashboard() {
  const { t, language } = useLanguageStore();
  const isArabic = language === 'ar';
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>({ students: 0, earnings: 0, courses: 0, videos: 0, recentPayments: [], recentStudents: [] });
  
  const [platformName, setPlatformName] = useState('Doctor Academy');
  const [primaryColor, setPrimaryColor] = useState('#2563EB');

  const [liveTitle, setLiveTitle] = useState('');
  const [liveLink, setLiveLink] = useState('');
  const [liveDate, setLiveDate] = useState('');
  const [liveTime, setLiveTime] = useState('');
  const [liveSection, setLiveSection] = useState('');

  const [videoTitle, setVideoTitle] = useState('');
  const [videoPrice, setVideoPrice] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoTimer, setVideoTimer] = useState('');

  const [sections, setSections] = useState<any[]>([]);
  const [newSectionName, setNewSectionName] = useState('');
  const [parentSection, setParentSection] = useState('');
  const [doctors, setDoctors] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);

  useEffect(() => {
    const adminAuth = localStorage.getItem('admin_auth');
    if (adminAuth === 'true') {
      setIsLoggedIn(true);
      loadStats();
      loadSections();
      loadDoctors();
    }
    const savedName = localStorage.getItem('platform_name');
    const savedColor = localStorage.getItem('primary_color');
    if (savedName) setPlatformName(savedName);
    if (savedColor) setPrimaryColor(savedColor);
    
    const color = savedColor || '#2563EB';
    document.documentElement.style.setProperty('--primary', color);
  }, []);

  const loadStats = async () => {
    const { count: studentsCount } = await supabase.from('users').select('*', { count: 'exact' }).eq('role', 'student');
    const { data: payments } = await supabase.from('payments').select('amount').eq('status', 'completed');
    const totalEarnings = payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
    const { count: coursesCount } = await supabase.from('content').select('*', { count: 'exact' });
    const { count: videosCount } = await supabase.from('content').select('*', { count: 'exact' }).eq('type', 'video');
    const { data: recentPayments } = await supabase.from('payments').select('*, users(full_name, email)').eq('status', 'completed').order('created_at', { ascending: false }).limit(5);
    const { data: recentStudents } = await supabase.from('users').select('*').eq('role', 'student').order('created_at', { ascending: false }).limit(10);

    setStats({ students: studentsCount || 0, earnings: totalEarnings, courses: coursesCount || 0, videos: videosCount || 0, recentPayments: recentPayments || [], recentStudents: recentStudents || [] });
  };

  const loadSections = async () => {
    const { data } = await supabase.from('sections').select('*');
    setSections(data || []);
  };

  const loadDoctors = async () => {
    const { data } = await supabase.from('users').select('*').neq('role', 'student');
    setDoctors(data || []);
  };

  const handleAdminLogin = () => {
    if (adminPassword === 'admin123') {
      setIsLoggedIn(true);
      localStorage.setItem('admin_auth', 'true');
      toast.success(isArabic ? 'تم الدخول' : 'Logged in');
      loadStats();
      loadSections();
      loadDoctors();
    } else {
      toast.error(isArabic ? 'كلمة مرور غير صحيحة' : 'Wrong password');
    }
  };

  const handleAddSection = async () => {
    if (!newSectionName) return;
    const slug = newSectionName.toLowerCase().replace(/\s+/g, '-');
    const { error } = await supabase.from('sections').insert({ name: newSectionName, slug, parent_id: parentSection || null });
    if (error) { toast.error(isArabic ? 'فشل الإضافة' : 'Failed to add'); }
    else { toast.success(isArabic ? 'تمت الإضافة' : 'Added'); setNewSectionName(''); setParentSection(''); loadSections(); }
  };

  const handleDeleteSection = async (id: string) => { await supabase.from('sections').delete().eq('id', id); loadSections(); toast.success(isArabic ? 'تم الحذف' : 'Deleted'); };

  const handleResetSections = async () => { await supabase.from('sections').delete().neq('id', '00000000-0000-0000-0000-000000000000'); loadSections(); toast.success(isArabic ? 'تم إعادة تعيين الأقسام' : 'Sections reset'); };

  const handleStartLive = async () => {
    if (!liveTitle || !liveLink || !liveSection) { toast.error(isArabic ? 'برجاء ملء جميع الحقول' : 'Please fill all fields'); return; }
    const { error } = await supabase.from('live_sessions').insert({ title: liveTitle, zoom_link: liveLink, session_date: liveDate, session_time: liveTime, course_id: liveSection, is_active: true });
    if (error) { toast.error(isArabic ? 'فشل' : 'Failed'); }
    else { toast.success(isArabic ? 'تم بدء اللايف' : 'Live started'); setLiveTitle(''); setLiveLink(''); setLiveDate(''); setLiveTime(''); setLiveSection(''); }
  };

  const handleSaveCustomize = () => { localStorage.setItem('platform_name', platformName); localStorage.setItem('primary_color', primaryColor); document.documentElement.style.setProperty('--primary', primaryColor); toast.success(isArabic ? 'تم الحفظ' : 'Saved'); };

  const handleResetCustomize = () => { setPlatformName('Doctor Academy'); setPrimaryColor('#2563EB'); localStorage.setItem('platform_name', 'Doctor Academy'); localStorage.setItem('primary_color', '#2563EB'); document.documentElement.style.setProperty('--primary', '#2563EB'); toast.success(isArabic ? 'تم إعادة التعيين' : 'Reset to default'); };

  const handleUploadVideo = async () => {
    if (!selectedCourse || !videoTitle || !videoPrice || !videoFile) { toast.error(isArabic ? 'برجاء ملء جميع الحقول واختيار ملف' : 'Please fill all fields and select a file'); return; }
    setLoading(true);
    try {
      const fileExt = videoFile.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('videos').upload(fileName, videoFile);
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from('videos').getPublicUrl(fileName);
      const { error } = await supabase.from('content').insert({ course_id: selectedCourse, title: videoTitle, type: 'video', url: urlData.publicUrl, price: parseFloat(videoPrice), description: videoDescription, timer: videoTimer || null });
      if (error) throw error;
      toast.success(isArabic ? `تم رفع "${videoTitle}" بنجاح!` : `"${videoTitle}" uploaded successfully!`);
      setVideoTitle(''); setVideoPrice(''); setVideoDescription(''); setSelectedCourse(''); setVideoFile(null); setVideoTimer(''); loadStats();
    } catch (error: any) { toast.error(error.message || (isArabic ? 'فشل الرفع' : 'Upload failed')); }
    finally { setLoading(false); }
  };if (!isLoggedIn) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <Shield size={50} className="mx-auto text-blue-600 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{isArabic ? 'لوحة التحكم' : 'Admin Panel'}</h1>
        <input type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} className="w-full px-4 py-3 border rounded-lg text-gray-900 text-center text-xl mb-4" placeholder={isArabic ? 'كلمة المرور' : 'Password'} onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()} />
        <button onClick={handleAdminLogin} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">{isArabic ? 'دخول' : 'Login'}</button>
        <p className="text-xs text-gray-400 mt-2">Default: admin123</p>
      </div>
    </div>
  );
}

const menuItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: isArabic ? 'الرئيسية' : 'Dashboard' },
  { id: 'content', icon: Video, label: isArabic ? 'رفع محتوى' : 'Upload Content' },
  { id: 'delete-content', icon: Trash2, label: isArabic ? 'حذف محتوى' : 'Delete Content' },
  { id: 'sections', icon: BookOpen, label: isArabic ? 'الأقسام' : 'Sections' },
  { id: 'students', icon: Users, label: isArabic ? 'الطلاب' : 'Students' },
  { id: 'doctors', icon: Stethoscope, label: isArabic ? 'الدكاترة' : 'Doctors' },
  { id: 'payments', icon: DollarSign, label: isArabic ? 'المدفوعات' : 'Payments' },
  { id: 'live', icon: Radio, label: isArabic ? 'بدء لايف' : 'Start Live' },
  { id: 'customize', icon: Palette, label: isArabic ? 'التخصيص' : 'Customize' },
];

return (
  <div dir={isArabic ? 'rtl' : 'ltr'} className="min-h-screen bg-gray-100 flex">
    <aside className="w-64 bg-gray-900 text-white min-h-screen fixed top-0 left-0 z-40 overflow-y-auto">
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">DA</div>
          <div><span className="font-bold text-lg block">{platformName}</span><span className="text-gray-400 text-xs">{isArabic ? 'لوحة التحكم' : 'Admin Panel'}</span></div>
        </div>
      </div>
      <nav className="p-4 space-y-1">
        {menuItems.map((item) => (
          <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left transition ${activeTab === item.id ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}>
            <item.icon size={20} /><span className="text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="absolute bottom-0 w-64 p-4 border-t border-gray-800">
        <button onClick={() => { localStorage.removeItem('admin_auth'); setIsLoggedIn(false); }} className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition w-full"><LogOut size={20} /><span className="text-sm">{isArabic ? 'تسجيل الخروج' : 'Logout'}</span></button>
      </div>
    </aside>

    <div className="ml-64 p-8 flex-1">
      {/* Dashboard */}
      {activeTab === 'dashboard' && (
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-8">{isArabic ? 'لوحة التحكم' : 'Dashboard'}</h1>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6"><div className="text-3xl mb-2">👨‍🎓</div><p className="text-3xl font-bold text-gray-900">{stats.students}</p><p className="text-gray-500 text-sm">{isArabic ? 'طالب' : 'Students'}</p></div>
            <div className="bg-white rounded-xl shadow-sm p-6"><div className="text-3xl mb-2">💰</div><p className="text-3xl font-bold text-green-600">{stats.earnings} ج.م</p><p className="text-gray-500 text-sm">{isArabic ? 'أرباح' : 'Earnings'}</p></div>
            <div className="bg-white rounded-xl shadow-sm p-6"><div className="text-3xl mb-2">📚</div><p className="text-3xl font-bold text-purple-600">{stats.courses}</p><p className="text-gray-500 text-sm">{isArabic ? 'مواد' : 'Courses'}</p></div>
            <div className="bg-white rounded-xl shadow-sm p-6"><div className="text-3xl mb-2">🎬</div><p className="text-3xl font-bold text-orange-600">{stats.videos}</p><p className="text-gray-500 text-sm">{isArabic ? 'فيديو' : 'Videos'}</p></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6"><h2 className="text-xl font-bold text-gray-900 mb-4">{isArabic ? 'آخر المدفوعات' : 'Recent Payments'}</h2><div className="space-y-3">{stats.recentPayments.length === 0 && <p className="text-gray-400 text-sm">{isArabic ? 'لا توجد مدفوعات' : 'No payments yet'}</p>}{stats.recentPayments.map((payment: any, i: number) => (<div key={i} className="flex justify-between p-3 bg-gray-50 rounded-lg"><span className="text-sm text-gray-700">{payment.users?.full_name || 'طالب'}</span><span className="text-sm font-medium text-green-600">{payment.amount} ج.م</span></div>))}</div></div>
            <div className="bg-white rounded-xl shadow-sm p-6"><h2 className="text-xl font-bold text-gray-900 mb-4">{isArabic ? 'آخر الطلاب' : 'Recent Students'}</h2><div className="space-y-3">{stats.recentStudents.length === 0 && <p className="text-gray-400 text-sm">{isArabic ? 'لا يوجد طلاب' : 'No students yet'}</p>}{stats.recentStudents.map((student: any, i: number) => (<div key={i} className="flex justify-between p-3 bg-gray-50 rounded-lg"><span className="text-sm text-gray-700">{student.full_name}</span><span className="text-xs text-gray-400">{student.email}</span></div>))}</div></div>
          </div>
        </div>
      )}{/* Upload Content */}
        {activeTab === 'content' && (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">{isArabic ? 'رفع فيديو جديد' : 'Upload New Video'}</h1>
            <div className="bg-white rounded-xl shadow-sm p-6 max-w-lg"><div className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">{isArabic ? 'اختر القسم' : 'Select Section'}</label><select className="w-full px-4 py-3 border rounded-lg text-gray-900 bg-white" value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}><option value="">{isArabic ? '-- اختر --' : '-- Select --'}</option><optgroup label={isArabic ? 'ثانوي - لغات' : 'Secondary - Languages'}><option value="secondary-languages-physics">{isArabic ? 'فيزياء' : 'Physics'}</option><option value="secondary-languages-chemistry">{isArabic ? 'كيمياء' : 'Chemistry'}</option><option value="secondary-languages-math">{isArabic ? 'رياضيات' : 'Math'}</option><option value="secondary-languages-biology">{isArabic ? 'أحياء' : 'Biology'}</option></optgroup><optgroup label={isArabic ? 'ثانوي - عربي' : 'Secondary - Arabic'}><option value="secondary-arabic-physics">{isArabic ? 'فيزياء' : 'Physics'}</option><option value="secondary-arabic-chemistry">{isArabic ? 'كيمياء' : 'Chemistry'}</option><option value="secondary-arabic-math">{isArabic ? 'رياضيات' : 'Math'}</option><option value="secondary-arabic-biology">{isArabic ? 'أحياء' : 'Biology'}</option></optgroup><optgroup label={isArabic ? 'جامعة' : 'University'}><option value="university-basic">Basic</option><option value="university-programming-python">Python</option><option value="university-programming-cpp">C++</option><option value="university-programming-ds">Data Structure</option></optgroup><optgroup label={isArabic ? 'إمارات' : 'Emirates'}><option value="emirates-g9">G9</option><option value="emirates-g10">G10</option><option value="emirates-g11">G11</option><option value="emirates-g12">G12</option></optgroup></select></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">{isArabic ? 'عنوان الفيديو' : 'Video Title'}</label><input type="text" value={videoTitle} onChange={(e) => setVideoTitle(e.target.value)} className="w-full px-4 py-3 border rounded-lg text-gray-900" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">{isArabic ? 'السعر (ج.م)' : 'Price (EGP)'}</label><input type="number" value={videoPrice} onChange={(e) => setVideoPrice(e.target.value)} className="w-full px-4 py-3 border rounded-lg text-gray-900" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1"><Timer size={16} className="inline mr-1" />{isArabic ? 'المدة (دقائق)' : 'Duration (min)'}</label><input type="number" value={videoTimer} onChange={(e) => setVideoTimer(e.target.value)} className="w-full px-4 py-3 border rounded-lg text-gray-900" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">{isArabic ? 'وصف' : 'Description'}</label><textarea className="w-full px-4 py-3 border rounded-lg text-gray-900" rows={3} value={videoDescription} onChange={(e) => setVideoDescription(e.target.value)} /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">📁 {isArabic ? 'رفع ملف' : 'Upload File'}</label><input type="file" accept="video/*" className="w-full" onChange={(e) => { if (e.target.files && e.target.files[0]) setVideoFile(e.target.files[0]); }} /></div>
              <button onClick={handleUploadVideo} disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50"><Video size={20} />{loading ? '⏳...' : isArabic ? 'رفع الفيديو' : 'Upload Video'}</button>
            </div></div>
          </div>
        )}

        {/* Delete Content */}
        {activeTab === 'delete-content' && (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">{isArabic ? 'حذف محتوى' : 'Delete Content'}</h1>
            <div className="bg-white rounded-xl shadow-sm p-6 max-w-lg"><div className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">{isArabic ? 'اختر القسم' : 'Select Section'}</label><select className="w-full px-4 py-3 border rounded-lg text-gray-900 bg-white" value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}><option value="">{isArabic ? '-- اختر --' : '-- Select --'}</option><optgroup label={isArabic ? 'ثانوي - لغات' : 'Secondary - Languages'}><option value="secondary-languages-physics">{isArabic ? 'فيزياء' : 'Physics'}</option><option value="secondary-languages-chemistry">{isArabic ? 'كيمياء' : 'Chemistry'}</option><option value="secondary-languages-math">{isArabic ? 'رياضيات' : 'Math'}</option><option value="secondary-languages-biology">{isArabic ? 'أحياء' : 'Biology'}</option></optgroup><optgroup label={isArabic ? 'ثانوي - عربي' : 'Secondary - Arabic'}><option value="secondary-arabic-physics">{isArabic ? 'فيزياء' : 'Physics'}</option><option value="secondary-arabic-chemistry">{isArabic ? 'كيمياء' : 'Chemistry'}</option><option value="secondary-arabic-math">{isArabic ? 'رياضيات' : 'Math'}</option><option value="secondary-arabic-biology">{isArabic ? 'أحياء' : 'Biology'}</option></optgroup><optgroup label={isArabic ? 'جامعة' : 'University'}><option value="university-basic">Basic</option><option value="university-programming-python">Python</option><option value="university-programming-cpp">C++</option><option value="university-programming-ds">Data Structure</option></optgroup><optgroup label={isArabic ? 'إمارات' : 'Emirates'}><option value="emirates-g9">G9</option><option value="emirates-g10">G10</option><option value="emirates-g11">G11</option><option value="emirates-g12">G12</option></optgroup></select></div>
              <button onClick={async () => { if (!selectedCourse) { toast.error(isArabic ? 'اختر القسم أولاً' : 'Select a section first'); return; } const { data } = await supabase.from('content').select('*').eq('course_id', selectedCourse); setLessons(data || []); toast.success(isArabic ? `تم تحميل ${data?.length || 0} فيديو` : `Loaded ${data?.length || 0} videos`); }} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">{isArabic ? 'عرض الفيديوهات' : 'Show Videos'}</button>
              {lessons.length > 0 && (<div className="space-y-2 mt-4"><h3 className="font-bold text-gray-900">{isArabic ? 'الفيديوهات' : 'Videos'}</h3>{lessons.map((lesson: any) => (<div key={lesson.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"><div><p className="text-sm font-medium text-gray-900">{lesson.title}</p><p className="text-xs text-gray-500">{lesson.price} ج.م</p></div><button onClick={async () => { await supabase.from('content').delete().eq('id', lesson.id); toast.success(isArabic ? 'تم الحذف' : 'Deleted'); setLessons(lessons.filter((l: any) => l.id !== lesson.id)); loadStats(); }} className="text-red-600 hover:text-red-800"><Trash2 size={20} /></button></div>))}</div>)}
            </div></div>
          </div>
        )}

        {/* Sections */}
        {activeTab === 'sections' && (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">{isArabic ? 'الأقسام' : 'Sections'}</h1>
            <div className="bg-white rounded-xl shadow-sm p-6 max-w-lg mb-6"><div className="space-y-3 mb-3"><input type="text" value={newSectionName} onChange={(e) => setNewSectionName(e.target.value)} className="w-full px-4 py-3 border rounded-lg text-gray-900" placeholder={isArabic ? 'اسم القسم' : 'Section name'} /><select value={parentSection} onChange={(e) => setParentSection(e.target.value)} className="w-full px-4 py-3 border rounded-lg text-gray-900 bg-white"><option value="">{isArabic ? 'بدون قسم أب' : 'No parent'}</option>{sections.map((s) => (<option key={s.id} value={s.id}>{s.name}</option>))}</select><button onClick={handleAddSection} className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"><Plus size={20} /> {isArabic ? 'إضافة' : 'Add'}</button></div><button onClick={handleResetSections} className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"><RotateCcw size={20} /> {isArabic ? 'إعادة تعيين' : 'Reset'}</button></div>
            <div className="space-y-3">{sections.map((section) => (<div key={section.id} className="bg-white rounded-xl shadow-sm p-4 flex justify-between items-center"><div><span className="font-medium text-gray-900">{section.name}</span>{section.parent_id && <span className="text-xs text-gray-400 ml-2">({isArabic ? 'فرعي' : 'Sub'})</span>}</div><button onClick={() => handleDeleteSection(section.id)} className="text-red-600 hover:text-red-800"><Trash2 size={20} /></button></div>))}</div>
          </div>
        )}

        {/* Students */}
        {activeTab === 'students' && (
          <div><h1 className="text-2xl font-bold text-gray-900 mb-6">{isArabic ? 'الطلاب' : 'Students'}</h1><div className="bg-white rounded-xl shadow-sm p-6"><table className="w-full text-sm"><thead><tr className="border-b"><th className="text-left py-3 px-4">#</th><th className="text-left py-3 px-4">{isArabic ? 'الاسم' : 'Name'}</th><th className="text-left py-3 px-4">{isArabic ? 'الإيميل' : 'Email'}</th><th className="text-left py-3 px-4">{isArabic ? 'الهاتف' : 'Phone'}</th><th className="text-left py-3 px-4">{isArabic ? 'القسم' : 'Section'}</th></tr></thead><tbody>{stats.recentStudents.map((s: any, i: number) => (<tr key={i} className="border-b"><td className="py-3 px-4">{i + 1}</td><td className="py-3 px-4">{s.full_name}</td><td className="py-3 px-4">{s.email}</td><td className="py-3 px-4">{s.phone}</td><td className="py-3 px-4">{s.section}</td></tr>))}</tbody></table></div></div>
        )}

        {/* Doctors */}
        {activeTab === 'doctors' && (
          <div><h1 className="text-2xl font-bold text-gray-900 mb-6">{isArabic ? 'الدكاترة' : 'Doctors'}</h1><div className="space-y-3">{doctors.map((doc) => (<div key={doc.id} className="bg-white rounded-xl shadow-sm p-4 flex justify-between items-center"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">👨‍⚕️</div><div><p className="font-medium text-gray-900">{doc.full_name}</p><p className="text-sm text-gray-500">{doc.email}</p></div></div><Link href={`/doctor-admin/${doc.id}`} className="text-blue-600 hover:underline text-sm">{isArabic ? 'لوحة التحكم' : 'Dashboard'}</Link></div>))}</div></div>
        )}

        {/* Payments */}
        {activeTab === 'payments' && (
          <div><h1 className="text-2xl font-bold text-gray-900 mb-6">{isArabic ? 'المدفوعات' : 'Payments'}</h1><div className="bg-white rounded-xl shadow-sm p-6"><table className="w-full text-sm"><thead><tr className="border-b"><th className="text-left py-3 px-4">#</th><th className="text-left py-3 px-4">{isArabic ? 'الطالب' : 'Student'}</th><th className="text-left py-3 px-4">{isArabic ? 'المبلغ' : 'Amount'}</th><th className="text-left py-3 px-4">{isArabic ? 'الحالة' : 'Status'}</th><th className="text-left py-3 px-4">{isArabic ? 'التاريخ' : 'Date'}</th></tr></thead><tbody>{stats.recentPayments.map((p: any, i: number) => (<tr key={i} className="border-b"><td className="py-3 px-4">{i + 1}</td><td className="py-3 px-4">{p.users?.full_name || '-'}</td><td className="py-3 px-4 text-green-600 font-medium">{p.amount} ج.م</td><td className="py-3 px-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">{p.status}</span></td><td className="py-3 px-4 text-xs text-gray-400">{new Date(p.created_at).toLocaleDateString()}</td></tr>))}</tbody></table></div></div>
        )}

        {/* Live */}
        {activeTab === 'live' && (
          <div><h1 className="text-2xl font-bold text-gray-900 mb-6">{isArabic ? 'بدء جلسة مباشرة' : 'Start Live Session'}</h1><div className="bg-white rounded-xl shadow-sm p-6 max-w-lg"><div className="space-y-4"><div><label className="block text-sm font-medium text-gray-700 mb-1">{isArabic ? 'اختر القسم' : 'Select Section'}</label><select className="w-full px-4 py-3 border rounded-lg text-gray-900 bg-white" value={liveSection} onChange={(e) => setLiveSection(e.target.value)}><option value="">{isArabic ? '-- اختر --' : '-- Select --'}</option><optgroup label={isArabic ? 'ثانوي' : 'Secondary'}><option value="secondary-languages-physics">{isArabic ? 'فيزياء - لغات' : 'Physics - Languages'}</option><option value="secondary-languages-chemistry">{isArabic ? 'كيمياء - لغات' : 'Chemistry - Languages'}</option><option value="secondary-languages-math">{isArabic ? 'رياضيات - لغات' : 'Math - Languages'}</option><option value="secondary-languages-biology">{isArabic ? 'أحياء - لغات' : 'Biology - Languages'}</option></optgroup><optgroup label={isArabic ? 'جامعة' : 'University'}><option value="university-basic">Basic</option><option value="university-programming">Programming</option></optgroup><optgroup label={isArabic ? 'إمارات' : 'Emirates'}><option value="emirates-g9">G9</option><option value="emirates-g10">G10</option><option value="emirates-g11">G11</option><option value="emirates-g12">G12</option></optgroup></select></div><div><label className="block text-sm font-medium text-gray-700 mb-1">{isArabic ? 'عنوان الجلسة' : 'Session Title'}</label><input type="text" value={liveTitle} onChange={(e) => setLiveTitle(e.target.value)} className="w-full px-4 py-3 border rounded-lg text-gray-900" /></div><div><label className="block text-sm font-medium text-gray-700 mb-1">{isArabic ? 'رابط Google Meet' : 'Google Meet Link'}</label><input type="url" value={liveLink} onChange={(e) => setLiveLink(e.target.value)} className="w-full px-4 py-3 border rounded-lg text-gray-900" placeholder="https://meet.google.com/xxx-xxxx-xxx" /></div><div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-gray-700 mb-1">{isArabic ? 'التاريخ' : 'Date'}</label><input type="date" value={liveDate} onChange={(e) => setLiveDate(e.target.value)} className="w-full px-4 py-3 border rounded-lg text-gray-900" /></div><div><label className="block text-sm font-medium text-gray-700 mb-1">{isArabic ? 'الوقت' : 'Time'}</label><input type="time" value={liveTime} onChange={(e) => setLiveTime(e.target.value)} className="w-full px-4 py-3 border rounded-lg text-gray-900" /></div></div><button onClick={handleStartLive} className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2"><Radio size={20} /> {isArabic ? 'بدء البث الآن' : 'Start Live Now'}</button></div></div></div>
        )}

        {/* Customize */}
        {activeTab === 'customize' && (
          <div><h1 className="text-2xl font-bold text-gray-900 mb-6">{isArabic ? 'تخصيص المنصة' : 'Customize Platform'}</h1><div className="bg-white rounded-xl shadow-sm p-6 max-w-lg space-y-6"><div><label className="block text-sm font-medium text-gray-700 mb-2"><Globe size={20} className="inline mr-2" />{isArabic ? 'اسم المنصة' : 'Platform Name'}</label><input type="text" value={platformName} onChange={(e) => setPlatformName(e.target.value)} className="w-full px-4 py-3 border rounded-lg text-gray-900 text-xl font-bold" /></div><div><label className="block text-sm font-medium text-gray-700 mb-2">{isArabic ? 'اللون الرئيسي' : 'Primary Color'}</label><input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-full h-12 rounded-lg cursor-pointer" /></div><div><label className="block text-sm font-medium text-gray-700 mb-2">{isArabic ? 'لوجو المنصة' : 'Platform Logo'}</label><input type="file" accept="image/*" className="w-full" /></div><button onClick={handleResetCustomize} className="w-full bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition flex items-center justify-center gap-2"><RotateCcw size={20} /> {isArabic ? 'إعادة تعيين' : 'Reset'}</button><button onClick={handleSaveCustomize} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">{isArabic ? 'حفظ التغييرات' : 'Save Changes'}</button></div></div>
        )}
      </div>
    </div>
  );
}