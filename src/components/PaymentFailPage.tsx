import { useEffect } from 'react';
import axios from 'axios';

interface PaymentFailPageProps {
  onGoHome: () => void;
}

export function PaymentFailPage({ onGoHome }: PaymentFailPageProps) {
  const params = new URLSearchParams(window.location.search);
  const errorMessage = params.get('message') ?? '결제가 취소되었습니다.';
  const errorCode = params.get('code');

  useEffect(() => {
    // 결제 실패/취소 시 점유한 재고 복구
    const pending = sessionStorage.getItem('pendingPayment');
    if (pending) {
      const { orderId } = JSON.parse(pending) as { orderId: string };
      const token = localStorage.getItem('accessToken');
      axios.post(`/orders/cancel/${orderId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      }).catch(() => {});
      sessionStorage.removeItem('pendingPayment');
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
      <h1 className="text-2xl font-bold text-red-600">결제 실패</h1>
      <p className="text-gray-600">{errorMessage}</p>
      {errorCode && <p className="text-sm text-gray-400">오류 코드: {errorCode}</p>}
      <button onClick={onGoHome} className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
        홈으로 돌아가기
      </button>
    </div>
  );
}
