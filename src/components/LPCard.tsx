import { ShoppingCart, CheckCircle } from 'lucide-react';
import type { LP } from './MainPage';

interface LPCardProps {
  lp: LP;
  onPurchase: (lpId: string) => void;
}

export function LPCard({ lp, onPurchase }: LPCardProps) {
  const isSoldOut = lp.stock === undefined || lp.stock <= 0;

  return (
      <div className={`group bg-white rounded-lg shadow-md overflow-hidden transition-all ${
          isSoldOut ? 'opacity-75' : 'hover:shadow-lg'
      }`}>
        <div className="aspect-square overflow-hidden bg-gray-100 relative">
          <img
              src={lp.thumbnailPath}
              alt={lp.name}
              className={`w-full h-full object-cover transition-transform duration-500 ${
                  !isSoldOut && 'group-hover:scale-105'
              } ${isSoldOut ? 'filter grayscale' : ''}`}
          />

          {/* [수정] 글자 없이 어두운 오버레이만 적용 */}
          {isSoldOut && (
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white">
                <CheckCircle className="w-10 h-10 mb-2" />
                <span className="text-lg font-bold tracking-widest">판매 완료</span>
              </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-lg mb-1">{lp.name}</h3>
          <p className="text-sm text-gray-600 mb-3">{lp.artistName}</p>

          <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
            <span>{lp.year}</span>
            <span className="px-2 py-1 bg-gray-100 rounded">
            {lp.condition}
          </span>
          </div>

          <div className="flex items-center justify-between">
          <span className="text-xl">
            ₩{lp.price.toLocaleString()}
          </span>
            <button
                onClick={() => onPurchase(lp.id)}
                disabled={isSoldOut}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isSoldOut
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-black text-white hover:bg-gray-800'
                }`}
            >
              <ShoppingCart className="w-4 h-4" />
              {isSoldOut ? '품절' : '구매'}
            </button>
          </div>
        </div>
      </div>
  );
}