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

    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      return NextResponse.json({ success: false, message: 'Account is locked. Try again later.', locked: true });
    }

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

    if (user.phone !== phone) {
      return NextResponse.json({ success: false, message: 'Phone number does not match' });
    }

    // تحقق من المفتاح المستخدم
    const { data: usedKey } = await supabase
      .from('used_keys')
      .select('*')
      .eq('user_id', userId)
      .eq('secret_key', secretKey)
      .single();

    if (usedKey) {
      return NextResponse.json({ success: false, message: 'This secret key has already been used' });
    }

    // سجل الدفع
    await supabase.from('payments').insert({
      user_id: userId,
      content_id: lessonId,
      amount: amount,
      phone_number: phone,
      secret_key: secretKey,
      reference_number: reference || null,
      status: 'completed',
    });

    // سجل المفتاح كمستخدم
    await supabase.from('used_keys').insert({
      user_id: userId,
      secret_key: secretKey,
    });

    // انشئ مفتاح جديد
    const newSecretKey = Math.floor(100000 + Math.random() * 900000).toString();
    
    const { error: updateError } = await supabase.from('users')
      .update({
        secret_key: newSecretKey,
        failed_attempts: 0,
        locked_until: null,
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Update secret key error:', updateError);
    }

    // أضف صلاحية المشاهدة (7 أيام)
    await supabase.from('user_access').insert({
      user_id: userId,
      content_id: lessonId,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      newSecretKey: newSecretKey,
    });
    
  } catch (error: any) {
    console.error('Verify error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}