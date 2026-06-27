import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const { userId, phone, secretKey, reference, amount, lessonId } = await request.json();

    if (!userId || !phone || !secretKey || !amount || !lessonId) {
      return NextResponse.json({ success: false, message: 'Missing required fields' });
    }

    // 1. نجيب بيانات المستخدم
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    // 2. نتأكد إن الحساب مش مقفول
    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      return NextResponse.json({ success: false, message: 'Account is locked. Try again later.', locked: true });
    }

    // 3. نتأكد من المفتاح السري
    if (user.secret_key !== secretKey) {
      const newAttempts = (user.failed_attempts || 0) + 1;
      
      if (newAttempts >= 3) {
        await supabase.from('users').update({
          failed_attempts: newAttempts,
          locked_until: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        }).eq('id', userId);
        
        return NextResponse.json({ success: false, message: 'Account locked for 30 minutes', locked: true });
      }

      await supabase.from('users').update({ failed_attempts: newAttempts }).eq('id', userId);
      return NextResponse.json({ success: false, message: 'Invalid secret key' });
    }

    // 4. نتأكد من رقم الهاتف
    if (user.phone !== phone) {
      return NextResponse.json({ success: false, message: 'Phone number does not match' });
    }

    // 5. نتأكد إن المفتاح متستخدمش قبل كده
    const { data: usedKey } = await supabase
      .from('used_keys')
      .select('*')
      .eq('user_id', userId)
      .eq('secret_key', secretKey)
      .single();

    if (usedKey) {
      return NextResponse.json({ success: false, message: 'This secret key has already been used' });
    }

    // 6. كل حاجة تمام! نسجل الدفع
    await supabase.from('payments').insert({
      user_id: userId,
      content_id: lessonId,
      amount: amount,
      phone_number: phone,
      secret_key: secretKey,
      reference_number: reference || null,
      status: 'completed',
    });

    // 7. نضيف المفتاح للمفاتيح المستخدمة
    await supabase.from('used_keys').insert({
      user_id: userId,
      secret_key: secretKey,
    });

    // 8. ننشئ مفتاح سري جديد للمستخدم
    const newSecretKey = Math.floor(100000 + Math.random() * 900000).toString();
    await supabase.from('users').update({
      secret_key: newSecretKey,
      failed_attempts: 0,
      locked_until: null,
    }).eq('id', userId);

    // 9. نضيف صلاحية للطالب
    await supabase.from('user_access').insert({
      user_id: userId,
      content_id: lessonId,
    });

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
    });
    
  } catch (error: any) {
    console.error('Verify error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}