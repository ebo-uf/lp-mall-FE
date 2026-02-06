import { ShoppingCart } from 'lucide-react';
import type { LP } from './MainPage';

interface LPCardProps {
  lp: LP;
  onPurchase: (lpId: string) => void;
}

export function LPCard({ lp, onPurchase }: LPCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-square overflow-hidden bg-gray-100">
        <img
          src={lp.imageUrl}
          alt={lp.title}
          className="w-full h-full object-cover"
        />
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
        <div className="flex items-center justify-between">
          <span className="text-xl">
            ₩{lp.price.toLocaleString()}
          </span>
          <button
            onClick={() => onPurchase(lp.id)}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            구매
          </button>
        </div>
      </div>
    </div>
  );
}
