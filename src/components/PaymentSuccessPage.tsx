import { useEffect, useState } from 'react';
import axios from 'axios';

interface PaymentSuccessPageProps {
  onGoHome: () => void;
}

export function PaymentSuccessPage({ onGoHome }: PaymentSuccessPageProps) {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    const confirm = async () => {
      const params = new URLSearchParams(window.location.search);
      const paymentKey = params.get('paymentKey');
      const tossOrderId = params.get('orderId'); // = 우리 orderId
      const amount = params.get('amount');

      if (!paymentKey || !tossOrderId || !amount) {
        setStatus('error');
        setErrorMessage('결제 정보가 없습니다.');
        return;
      }

      const token = localStorage.getItem('accessToken');

      try {
        // payment-service에 결제 승인 요청
        await axios.post(
          '/payments/confirm',
          { paymentKey, tossOrderId, amount: Number(amount) },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        sessionStorage.removeItem('pendingPayment');
        setStatus('success');
      } catch (error) {
        // 결제 승인 실패 시 주문 취소 (재고 복구)
        await axios.post(`/orders/cancel/${tossOrderId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        ).catch(() => {});

        const msg = axios.isAxiosError(error)
          ? (error.response?.data?.message ?? '결제 승인 중 오류가 발생했습니다.')
          : '결제 승인 중 오류가 발생했습니다.';
        setStatus('error');
        setErrorMessage(msg);
      }
    };

    void confirm();
  }, []);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-600">결제 처리 중...</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
        <h1 className="text-2xl font-bold text-red-600">결제 실패</h1>
        <p className="text-gray-600">{errorMessage}</p>
        <button onClick={onGoHome} className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
          홈으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
      <h1 className="text-2xl font-bold text-green-600">결제 완료!</h1>
      <p className="text-gray-600">주문이 성공적으로 접수되었습니다.</p>
      <button onClick={onGoHome} className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
        홈으로 돌아가기
      </button>
    </div>
  );
}
