import { useState, useEffect } from 'react';
import { Music, LogOut, Clock, Flame, Plus } from 'lucide-react';
import { LPCard } from './LPCard';
import { LimitedEditionSection } from './LimitedEditionSection';
import { SellLPModal, type LPFormData } from './SellLPModal';

interface User {
  id: string;
  username: string;
  nickname: string;
  email: string;
}

interface MainPageProps {
  user: User;
  onLogout: () => void;
}

export interface LP {
  id: string;
  title: string;
  artist: string;
  price: number;
  imageUrl: string;
  condition: string;
  year: number;
  isLimited?: boolean;
  releaseTime?: Date;
  stock?: number;
}

export function MainPage({ user, onLogout }: MainPageProps) {
  const [regularLPs, setRegularLPs] = useState<LP[]>([]);
  const [limitedLPs, setLimitedLPs] = useState<LP[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Mock 데이터 - 실제로는 백엔드에서 가져와야 합니다
    const mockRegularLPs: LP[] = [
      {
        id: '1',
        title: 'Abbey Road',
        artist: 'The Beatles',
        price: 120000,
        imageUrl: 'https://images.unsplash.com/photo-1619983081563-430f63602796?w=500',
        condition: 'VG+',
        year: 1969
      },
      {
        id: '2',
        title: 'Dark Side of the Moon',
        artist: 'Pink Floyd',
        price: 95000,
        imageUrl: 'https://images.unsplash.com/photo-1615232644984-a28e2276d6ea?w=500',
        condition: 'NM',
        year: 1973
      },
      {
        id: '3',
        title: 'Thriller',
        artist: 'Michael Jackson',
        price: 85000,
        imageUrl: 'https://images.unsplash.com/photo-1603048588665-791ca8ffe39e?w=500',
        condition: 'VG',
        year: 1982
      },
      {
        id: '4',
        title: 'Rumours',
        artist: 'Fleetwood Mac',
        price: 78000,
        imageUrl: 'https://images.unsplash.com/photo-1619983081593-e2ba5b543168?w=500',
        condition: 'VG+',
        year: 1977
      },
      {
        id: '5',
        title: 'Led Zeppelin IV',
        artist: 'Led Zeppelin',
        price: 110000,
        imageUrl: 'https://images.unsplash.com/photo-1611115728932-9c00ad7af9e0?w=500',
        condition: 'NM',
        year: 1971
      },
      {
        id: '6',
        title: 'Kind of Blue',
        artist: 'Miles Davis',
        price: 135000,
        imageUrl: 'https://images.unsplash.com/photo-1606509761291-c3c37de05f21?w=500',
        condition: 'VG+',
        year: 1959
      }
    ];

    // 한정판 LP - 특정 시간에 판매 시작
    const now = new Date();
    const limitedReleaseTime1 = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2시간 후
    const limitedReleaseTime2 = new Date(now.getTime() + 5 * 60 * 60 * 1000); // 5시간 후
    const limitedReleaseTime3 = new Date(now.getTime() - 1 * 60 * 60 * 1000); // 1시간 전 (이미 오픈)

    const mockLimitedLPs: LP[] = [
      {
        id: 'limited-1',
        title: 'The Velvet Underground & Nico',
        artist: 'The Velvet Underground',
        price: 450000,
        imageUrl: 'https://images.unsplash.com/photo-1601042879364-f3947d3f9c16?w=500',
        condition: 'NM',
        year: 1967,
        isLimited: true,
        releaseTime: limitedReleaseTime1,
        stock: 5
      },
      {
        id: 'limited-2',
        title: 'Blue Train',
        artist: 'John Coltrane',
        price: 380000,
        imageUrl: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=500',
        condition: 'VG++',
        year: 1957,
        isLimited: true,
        releaseTime: limitedReleaseTime2,
        stock: 3
      },
      {
        id: 'limited-3',
        title: 'OK Computer',
        artist: 'Radiohead',
        price: 280000,
        imageUrl: 'https://images.unsplash.com/photo-1611339555312-e607c8352fd7?w=500',
        condition: 'NM',
        year: 1997,
        isLimited: true,
        releaseTime: limitedReleaseTime3,
        stock: 2
      }
    ];

    setRegularLPs(mockRegularLPs);
    setLimitedLPs(mockLimitedLPs);
  }, []);

  const handlePurchase = (lpId: string) => {
    alert(`LP ${lpId} 구매가 완료되었습니다!`);
  };

  const handleSellLP = (lpData: LPFormData) => {
    const newLP: LP = {
      id: Date.now().toString(),
      title: lpData.title,
      artist: lpData.artist,
      price: lpData.price,
      imageUrl: lpData.imageUrl,
      condition: lpData.condition,
      year: lpData.year,
      isLimited: lpData.isLimited,
      releaseTime: lpData.releaseTime ? new Date(lpData.releaseTime) : undefined,
      stock: lpData.stock
    };

    if (lpData.isLimited) {
      setLimitedLPs([...limitedLPs, newLP]);
    } else {
      setRegularLPs([...regularLPs, newLP]);
    }

    alert('LP가 성공적으로 등록되었습니다!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Plus className="w-4 h-4" />
                판매하기
              </button>
              <span className="text-sm text-gray-600">
                {user.nickname}님 환영합니다
              </span>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Limited Edition Section */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Flame className="w-6 h-6 text-red-500" />
            <h2 className="text-2xl">한정판 LP</h2>
            <Clock className="w-5 h-5 text-gray-500 ml-2" />
          </div>
          <LimitedEditionSection lps={limitedLPs} onPurchase={handlePurchase} />
        </section>

        {/* Regular LPs Section */}
        <section>
          <h2 className="text-2xl mb-6">판매 중인 LP</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularLPs.map((lp) => (
              <LPCard key={lp.id} lp={lp} onPurchase={handlePurchase} />
            ))}
          </div>
        </section>
      </main>

      {/* Sell LP Modal */}
      <SellLPModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSellLP}
      />
    </div>
  );
}