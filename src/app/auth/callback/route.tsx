import { createServerClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = createServerClient();
    
    // تبادل الكود والحصول على جلسة
    const { data: sessionData } = await supabase.auth.exchangeCodeForSession(code);
    
    if (sessionData?.user) {
      const { user } = sessionData;
      
      // التحقق إذا كان المستخدم موجود بالفعل
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('email', user.email)
        .single();

      // لو مش موجود، نضيفه
      if (!existingUser) {
        const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
        
        await supabase.from('users').insert({
          email: user.email,
          full_name: fullName,
          role: 'student',
          section: 'university', // افتراضي
          age: 18,
          phone: '',
        });
      }

      // نجيب بيانات المستخدم
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('email', user.email)
        .single();

      // نرجع للصفحة الرئيسية مع بيانات المستخدم
      const response = NextResponse.redirect(new URL('/', requestUrl.origin));
      
      if (userData) {
        // نضيف بيانات المستخدم في الـ session
        response.cookies.set('user_data', JSON.stringify(userData), {
          path: '/',
          maxAge: 60 * 60 * 24 * 7, // أسبوع
        });
      }
      
      return response;
    }
  }

  return NextResponse.redirect(new URL('/login', requestUrl.origin));
}