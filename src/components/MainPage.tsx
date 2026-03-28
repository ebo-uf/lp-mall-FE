import { useState, useEffect, useCallback } from 'react';
import { Music, LogOut, Clock, Flame, Plus } from 'lucide-react';
import { LPCard } from './LPCard';
import { LimitedEditionSection } from './LimitedEditionSection';
import { SellLPModal } from './SellLPModal';
import axios from 'axios';

// 인터페이스를 더 유연하게 (필수값 제거)
interface MainPageProps {
  user?: { nickname?: string };
  onLogout: () => void;
}

export interface LP {
  id: number;
  name: string;
  artistName: string;
  year: number;
  condition: string;
  price: number;
  stock?: number;
  saleStartAt?: Date;
  isLimited?: boolean;
  thumbnailPath: string;
}

export function MainPage({ user, onLogout }: MainPageProps) {
  const [regularLPs, setRegularLPs] = useState<LP[]>([]);
  const [limitedLPs, setLimitedLPs] = useState<LP[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const displayNickname = user?.nickname || localStorage.getItem('nickname') || '사용자';

  const fetchProducts = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('/products/all', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const allProducts: LP[] = response.data.map((lp: LP & { thumbnailPath: string; saleStartAt: string }) => ({
        ...lp,
        thumbnailPath: lp.thumbnailPath
            ? `/products/images/${lp.thumbnailPath}`
            : 'https://via.placeholder.com/400?text=No+Image',
        saleStartAt: lp.saleStartAt ? new Date(lp.saleStartAt) : undefined
      }));

      setRegularLPs(allProducts.filter(lp => !lp.isLimited));
      setLimitedLPs(allProducts.filter(lp => lp.isLimited));
    } catch (error) {
      console.error("상품 로드 실패:", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        alert("세션이 만료되었습니다. 다시 로그인해 주세요.");
        onLogout();
      }
    }
  }, [onLogout]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchProducts();
  }, [fetchProducts]);

  const handlePurchase = async (lpId: number) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        alert("로그인이 필요한 서비스입니다.");
        return;
      }

      // 1. 현재 클릭한 상품이 한정판인지 찾기
      const isLimited = limitedLPs.some(lp => lp.id === lpId);

      // 2. 타입에 따른 API 경로 설정
      const endpoint = isLimited
          ? `/orders/create-limited`
          : `/orders/create`;

      // 3. 주문 API 호출 (보통 productId와 수량을 보냄)
      const response = await axios.post(endpoint,
          {
            productId: lpId,
            quantity: 1
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
      );

      if (response.status === 200 || response.status === 201) {
        alert("주문이 성공적으로 완료되었습니다! 🎉");
        await fetchProducts();
      }
    } catch (error) {
      console.error("주문 실패:", error);
      const errorMessage = axios.isAxiosError(error)
          ? error.response?.data?.message ?? "주문 처리 중 오류가 발생했습니다."
          : "주문 처리 중 오류가 발생했습니다.";
      alert(`주문 실패: ${errorMessage}`);
    }
  };

  const handleAddProduct = async (formData: FormData) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }

      // 실제 백엔드 API 호출
      const response = await axios.post(`/products/create`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          // FormData를 보낼 때는 browser가 알아서 boundary를 설정하도록
          // Content-Type을 명시하지 않거나 multipart/form-data로 설정해
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200 || response.status === 201) {
        alert("상품이 성공적으로 등록되었습니다! 🎉");
        await fetchProducts();
      }
    } catch (error) {
      console.error("등록 실패:", error);
      const errorMessage = axios.isAxiosError(error)
          ? error.response?.data?.message ?? "서버 오류"
          : "서버 오류";
      alert(`등록 실패: ${errorMessage}`);
    }
  };

  return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-black rounded-full">
                  <Music className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl">LP Marketplace</h1>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                  <Plus className="w-4 h-4" /> 판매하기
                </button>

                {/* 핵심: displayNickname 사용 */}
                <span className="text-sm text-gray-600">
                {displayNickname}님 환영합니다
              </span>

                <button onClick={onLogout} className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <LogOut className="w-4 h-4" /> 로그아웃
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Flame className="w-6 h-6 text-red-500" />
              <h2 className="text-2xl">한정판 LP</h2>
              <Clock className="w-5 h-5 text-gray-500 ml-2" />
            </div>
            <LimitedEditionSection lps={limitedLPs} onPurchase={handlePurchase} />
          </section>

          <section>
            <h2 className="text-2xl mb-6">판매 중인 LP</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularLPs.map((lp) => (
                  <LPCard key={lp.id} lp={lp} onPurchase={handlePurchase} />
              ))}
            </div>
          </section>
        </main>

        <SellLPModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleAddProduct} />
      </div>
  );
}