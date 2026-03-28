import { useEffect, useState } from 'react';
import { ArrowLeft, Music } from 'lucide-react';
import axios from 'axios';

interface Order {
  orderId: string;
  status: string;
  productName: string;
  quantity: number;
  totalPrice: number;
  isLimited: boolean;
  createdAt: string;
}

const STATUS_LABEL: Record<string, string> = {
  PENDING: '결제 대기',
  PAYMENT_COMPLETED: '결제 완료',
  COMPLETED: '주문 완료',
  CANCELED: '취소됨',
};

const STATUS_COLOR: Record<string, string> = {
  PENDING: 'text-yellow-600 bg-yellow-50',
  PAYMENT_COMPLETED: 'text-blue-600 bg-blue-50',
  COMPLETED: 'text-green-600 bg-green-50',
  CANCELED: 'text-gray-400 bg-gray-100',
};

interface Props {
  onGoBack: () => void;
}

export function OrderHistoryPage({ onGoBack }: Props) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    axios.get('/orders/my', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setOrders(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button onClick={onGoBack} className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">돌아가기</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-black rounded-full">
                <Music className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl">내 주문 내역</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {loading && (
          <p className="text-center text-gray-400 py-16">불러오는 중...</p>
        )}
        {!loading && orders.length === 0 && (
          <p className="text-center text-gray-400 py-16">주문 내역이 없습니다.</p>
        )}
        {!loading && orders.map(order => (
          <div key={order.orderId} className="mb-4 p-5 bg-white border rounded-xl shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{order.productName}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {order.quantity}개 · {order.totalPrice.toLocaleString()}원
                  {order.isLimited && (
                    <span className="ml-2 text-xs text-red-500 font-medium">한정판</span>
                  )}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(order.createdAt).toLocaleString('ko-KR')}
                </p>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap ${STATUS_COLOR[order.status] ?? 'text-gray-600 bg-gray-100'}`}>
                {STATUS_LABEL[order.status] ?? order.status}
              </span>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
