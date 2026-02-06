import { useState, useEffect } from 'react';
import { Clock, ShoppingCart, Lock } from 'lucide-react';
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

  const calculateTimeRemaining = (releaseTime: Date): TimeRemaining => {
    const diff = releaseTime.getTime() - currentTime.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { hours, minutes, seconds };
  };

  const isAvailable = (releaseTime: Date): boolean => {
    return currentTime >= releaseTime;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {lps.map((lp) => {
        const available = isAvailable(lp.releaseTime!);
        const timeRemaining = !available ? calculateTimeRemaining(lp.releaseTime!) : null;

        return (
          <div
            key={lp.id}
            className={`bg-white rounded-lg shadow-md overflow-hidden ${
              !available ? 'opacity-75' : 'hover:shadow-lg'
            } transition-all relative`}
          >
            {/* Limited Edition Badge */}
            <div className="absolute top-3 right-3 z-10 px-3 py-1 bg-red-500 text-white text-xs rounded-full">
              한정 {lp.stock}개
            </div>

            <div className="aspect-square overflow-hidden bg-gray-100 relative">
              <img
                src={lp.imageUrl}
                alt={lp.title}
                className={`w-full h-full object-cover ${!available ? 'filter grayscale' : ''}`}
              />
              {!available && (
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <Lock className="w-12 h-12 text-white" />
                </div>
              )}
            </div>

            <div className="p-4">
              <h3 className="text-lg mb-1">{lp.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{lp.artist}</p>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                <span>{lp.year}</span>
                <span className="px-2 py-1 bg-gray-100 rounded">
                  {lp.condition}
                </span>
              </div>

              {/* Timer or Available Status */}
              {!available && timeRemaining ? (
                <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <Clock className="w-4 h-4" />
                    <span>판매 시작까지</span>
                  </div>
                  <div className="flex gap-2 text-center">
                    <div className="flex-1 bg-white rounded p-2">
                      <div className="text-xl">{timeRemaining.hours}</div>
                      <div className="text-xs text-gray-500">시간</div>
                    </div>
                    <div className="flex-1 bg-white rounded p-2">
                      <div className="text-xl">{timeRemaining.minutes}</div>
                      <div className="text-xs text-gray-500">분</div>
                    </div>
                    <div className="flex-1 bg-white rounded p-2">
                      <div className="text-xl">{timeRemaining.seconds}</div>
                      <div className="text-xs text-gray-500">초</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-3 p-2 bg-green-50 rounded-lg text-center text-sm text-green-700">
                  지금 구매 가능!
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-xl">
                  ₩{lp.price.toLocaleString()}
                </span>
                <button
                  onClick={() => onPurchase(lp.id)}
                  disabled={!available}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    available
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {available ? '구매' : '대기중'}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
