'use client';

import { useState } from 'react';
import { useLanguageStore } from '@/store/languageStore';
import { toast } from 'react-hot-toast';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessonTitle: string;
  price: number;
  lessonId: string;
  userId?: string;
}

export default function PaymentModal({ isOpen, onClose, lessonTitle, price, lessonId, userId }: PaymentModalProps) {
  const { t, language } = useLanguageStore();
  const isArabic = language === 'ar';
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [ussdCode, setUssdCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  if (!isOpen) return null;

  const handleInitiatePayment = async () => {
    if (!paymentMethod) {
      toast.error(isArabic ? 'اختر طريقة الدفع' : 'Select payment method');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId,
          userId: userId || 'guest',
          amount: price,
          paymentMethod,
          phoneNumber,
        }),
      });

      const data = await response.json();

      if (data.success) {
        if (paymentMethod === 'vodafone_cash') {
          setUssdCode(data.ussdCode);
          setStep(2);
          toast.success(isArabic ? 'تم إرسال كود USSD' : 'USSD code sent');
        }
        setLoading(false);
      }
    } catch (error) {
      toast.error(isArabic ? 'فشل الدفع' : 'Payment failed');
      setLoading(false);
    }
  };

  const handleConfirmPayment = async () => {
    setLoading(true);

    // محاكاة تأكيد الدفع (في الحقيقي: Webhook من Paymob)
    setTimeout(() => {
      setPaymentComplete(true);
      setStep(3);
      setLoading(false);
      toast.success(isArabic ? 'تم الدفع بنجاح!' : 'Payment successful!');
    }, 2000);
  };

  const handleClose = () => {
    setStep(1);
    setPaymentMethod('');
    setPhoneNumber('');
    setUssdCode('');
    setPaymentComplete(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        {!paymentComplete ? (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              {t.payment.title}
            </h2>

            {/* Step 1: Choose Method */}
            {step === 1 && (
              <div className="space-y-4">
                <p className="text-center text-gray-600 mb-4">
                  {isArabic ? 'اختر طريقة الدفع' : 'Choose payment method'}
                </p>

                <button
                  onClick={() => setPaymentMethod('vodafone_cash')}
                  className={`w-full p-4 rounded-lg border-2 text-left transition ${
                    paymentMethod === 'vodafone_cash' ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  <span className="text-2xl mr-3">📱</span>
                  <span className="font-bold text-gray-900">{t.payment.vodafoneCash}</span>
                </button>

                <button
                  onClick={() => setPaymentMethod('instapay')}
                  className={`w-full p-4 rounded-lg border-2 text-left transition ${
                    paymentMethod === 'instapay' ? 'border-purple-500 bg-purple-50' : 'border-gray-300'
                  }`}
                >
                  <span className="text-2xl mr-3">💳</span>
                  <span className="font-bold text-gray-900">{t.payment.instaPay}</span>
                </button>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isArabic ? 'رقم الهاتف' : 'Phone Number'}
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                    placeholder="010XXXXXXXX"
                  />
                </div>

                <button
                  onClick={handleInitiatePayment}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {loading ? (isArabic ? 'جاري...' : 'Processing...') : isArabic ? 'متابعة الدفع' : 'Continue Payment'}
                </button>
              </div>
            )}

            {/* Step 2: USSD Code (Vodafone Cash) */}
            {step === 2 && paymentMethod === 'vodafone_cash' && (
              <div className="space-y-4 text-center">
                <div className="text-6xl mb-4">📱</div>
                <h3 className="text-xl font-bold text-gray-900">
                  {isArabic ? 'أدخل الكود التالي' : 'Enter the following code'}
                </h3>
                <div className="bg-gray-900 text-white text-3xl font-bold py-4 rounded-lg tracking-widest">
                  {ussdCode}
                </div>
                <p className="text-sm text-gray-500">
                  {isArabic ? 'على موبايلك، ثم أدخل الرقم السري للمحفظة' : 'on your phone, then enter wallet PIN'}
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-bold text-gray-900">{price} ج.م</p>
                  <p className="text-sm text-gray-500">{lessonTitle}</p>
                </div>
                <button
                  onClick={handleConfirmPayment}
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
                >
                  {loading ? (isArabic ? 'جاري التأكيد...' : 'Confirming...') : isArabic ? 'تم الدفع' : 'Payment Done'}
                </button>
              </div>
            )}
          </>
        ) : (
          /* Step 3: Success */
          <div className="text-center space-y-4">
            <div className="text-6xl">✅</div>
            <h2 className="text-2xl font-bold text-green-600">
              {isArabic ? 'تم الدفع بنجاح!' : 'Payment Successful!'}
            </h2>
            <p className="text-gray-600">{lessonTitle}</p>
            <p className="text-xl font-bold text-gray-900">{price} ج.م</p>
            <button
              onClick={handleClose}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              {isArabic ? 'مشاهدة الحصة' : 'Watch Lesson'}
            </button>
          </div>
        )}

        {/* Close Button */}
        {!paymentComplete && (
          <button
            onClick={handleClose}
            className="w-full mt-4 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            {isArabic ? 'إغلاق' : 'Close'}
          </button>
        )}
      </div>
    </div>
  );
}