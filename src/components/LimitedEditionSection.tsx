import { useState, useEffect } from 'react';
import { Clock, ShoppingCart, CheckCircle } from 'lucide-react';
import type { LP } from './MainPage';

interface LimitedEditionSectionProps {
  lps: LP[];
  onPurchase: (lpId: string) => void;
}

interface TimeRemaining {
  hours: number;
  minutes: number;
  seconds: number;
}

export function LimitedEditionSection({ lps, onPurchase }: LimitedEditionSectionProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const calculateTimeRemaining = (saleStartAt: Date): TimeRemaining => {
    const diff = saleStartAt.getTime() - currentTime.getTime();
    const hours = Math.max(0, Math.floor(diff / (1000 * 60 * 60)));
    const minutes = Math.max(0, Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)));
    const seconds = Math.max(0, Math.floor((diff % (1000 * 60)) / 1000));

    return { hours, minutes, seconds };
  };

  const isAvailable = (saleStartAt: Date): boolean => {
    return currentTime >= saleStartAt;
  };

  return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {lps.map((lp) => {
          const available = isAvailable(lp.saleStartAt!);
          const timeRemaining = !available ? calculateTimeRemaining(lp.saleStartAt!) : null;

          const isOutOfStock = lp.stock === undefined || lp.stock <= 0;
          const canPurchase = available && !isOutOfStock;

          return (
              <div
                  key={lp.id}
                  className={`group bg-white rounded-lg shadow-md overflow-hidden transition-all relative ${
                      !canPurchase ? 'opacity-90' : 'hover:shadow-lg'
                  }`}
              >
                {/* [수정] 재고가 있을 때만 한정판 배지 표시, 품절 시 제거 */}
                {!isOutOfStock && (
                    <div className="absolute top-3 right-3 z-10 px-3 py-1 bg-red-500 text-white text-xs rounded-full font-bold shadow-sm">
                      한정 {lp.stock}개
                    </div>
                )}

                <div className="aspect-square overflow-hidden bg-gray-100 relative">
                  <img
                      src={lp.thumbnailPath}
                      alt={lp.name}
                      // [수정] 품절 시 흑백 처리 적용
                      className={`w-full h-full object-cover transition-transform duration-500 ${
                          !canPurchase ? '' : 'group-hover:scale-105'
                      } ${isOutOfStock ? 'filter grayscale' : ''}`}
                  />

                  {/* [추가] 품절 시 어두운 오버레이와 중앙 '판매 완료' 표시 */}
                  {isOutOfStock && (
                      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white z-20">
                        <CheckCircle className="w-10 h-10 mb-2" />
                        <span className="text-lg font-bold tracking-widest">판매 완료</span>
                      </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-bold mb-1 truncate">{lp.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{lp.artistName}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <span>{lp.year}</span>
                  </div>

                  {/* Timer or Status Message */}
                  {!available && timeRemaining ? (
                      <div className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="flex items-center gap-2 text-xs text-red-500 mb-2 font-bold">
                          <Clock className="w-3.5 h-3.5" />
                          <span>판매 시작까지 대기</span>
                        </div>
                        <div className="flex gap-2 text-center">
                          <TimeBox value={timeRemaining.hours} unit="시간" />
                          <TimeBox value={timeRemaining.minutes} unit="분" />
                          <TimeBox value={timeRemaining.seconds} unit="초" />
                        </div>
                      </div>
                  ) : (
                      <div className={`mb-3 p-2 rounded-lg text-center text-sm font-bold border ${
                          isOutOfStock
                              ? 'bg-gray-100 text-gray-500 border-gray-200'
                              : 'bg-green-50 text-green-700 border-green-100'
                      }`}>
                        {isOutOfStock ? '재고가 모두 소진되었습니다' : '지금 바로 구매 가능!'}
                      </div>
                  )}

                  <div className="flex items-center justify-between mt-4">
                <span className={`text-xl font-bold ${isOutOfStock ? 'text-gray-400' : 'text-black'}`}>
                  ₩{lp.price.toLocaleString()}
                </span>
                    <button
                        onClick={() => onPurchase(lp.id)}
                        disabled={!canPurchase}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-bold ${
                            canPurchase
                                ? 'bg-red-500 text-white hover:bg-red-600 active:scale-95 shadow-md'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {isOutOfStock ? '품절' : !available ? '대기 중' : '구매'}
                    </button>
                  </div>
                </div>
              </div>
          );
        })}
      </div>
  );
}

function TimeBox({ value, unit }: { value: number; unit: string }) {
  return (
      <div className="flex-1 bg-white rounded p-1.5 shadow-sm border border-gray-100">
        <div className="text-lg font-bold text-gray-800">{String(value).padStart(2, '0')}</div>
        <div className="text-[10px] text-gray-400 font-medium">{unit}</div>
      </div>
  );
}