import { useState } from 'react';
import { X, Upload } from 'lucide-react';

interface SellLPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
}

export function SellLPModal({ isOpen, onClose, onSubmit }: SellLPModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    price: 0,
    condition: 'VG',
    year: new Date().getFullYear(),
    isLimited: false,
    releaseTime: '',
    stock: 1
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageFile) {
      alert('이미지를 업로드해주세요.');
      return;
    }

    const data = new FormData();
    data.append('file', imageFile);

    let formattedDate = null;
    if (formData.isLimited && formData.releaseTime) {
      const localDate = new Date(formData.releaseTime);

      const offset = localDate.getTimezoneOffset() * 60000;
      const dateWithOffset = new Date(localDate.getTime() - offset);
      formattedDate = dateWithOffset.toISOString().slice(0, 19);
    }

    const productDto = {
      name: formData.title,
      artistName: formData.artist,
      price: formData.price,
      year: formData.year,
      condition: formData.isLimited ? 'NEW' : formData.condition,
      isLimited: formData.isLimited,
      stock: formData.isLimited ? formData.stock : 1,

      saleStartAt: formattedDate
    };

    data.append('dto', new Blob([JSON.stringify(productDto)], {
      type: 'application/json'
    }));

    onSubmit(data);

    setFormData({
      title: '', artist: '', price: 0, condition: 'VG',
      year: new Date().getFullYear(), isLimited: false,
      releaseTime: '', stock: 1
    });
    setImagePreview('');
    setImageFile(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-2xl">LP 판매 등록</h2>
            <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* 이미지 업로드 - 기존 스타일 유지 */}
            <div>
              <label className="block text-sm mb-2">LP 이미지 *</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                {imagePreview ? (
                    <div className="space-y-3">
                      <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-48 h-48 object-cover mx-auto rounded"
                      />
                      <button
                          type="button"
                          onClick={() => {
                            setImagePreview('');
                            setImageFile(null);
                          }}
                          className="text-sm text-red-500 hover:underline"
                      >
                        이미지 제거
                      </button>
                    </div>
                ) : (
                    <label className="cursor-pointer">
                      <Upload className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600 mb-1">클릭하여 이미지 업로드</p>
                      <p className="text-xs text-gray-400">JPG, PNG (최대 10MB)</p>
                      <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                      />
                    </label>
                )}
              </div>
            </div>

            {/* 기본 정보 - 기존 grid 유지 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label htmlFor="title" className="block text-sm mb-2">앨범 제목 *</label>
                <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    required
                />
              </div>

              <div className="col-span-2">
                <label htmlFor="artist" className="block text-sm mb-2">아티스트 *</label>
                <input
                    type="text"
                    id="artist"
                    value={formData.artist}
                    onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    required
                />
              </div>

              <div>
                <label htmlFor="price" className="block text-sm mb-2">가격 (원) *</label>
                <input
                    type="number"
                    id="price"
                    value={formData.price || ''}
                    onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    required
                />
              </div>

              <div>
                <label htmlFor="year" className="block text-sm mb-2">발매 연도 *</label>
                <input
                    type="number"
                    id="year"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || new Date().getFullYear() })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    required
                />
              </div>

              {!formData.isLimited && (
                  <div className="col-span-2">
                    <label htmlFor="condition" className="block text-sm mb-2">상태 *</label>
                    <select
                        id="condition"
                        value={formData.condition}
                        onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        required
                    >
                      <option value="NM">NM (Near Mint) - 거의 새것</option>
                      <option value="VG++">VG++ (Very Good++) - 매우 좋음</option>
                      <option value="VG+">VG+ (Very Good+) - 좋음</option>
                      <option value="VG">VG (Very Good) - 양호</option>
                      <option value="G">G (Good) - 보통</option>
                    </select>
                  </div>
              )}
            </div>

            {/* 한정판 옵션 - 기존 디자인 유지 */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center gap-2 mb-4">
                <input
                    type="checkbox"
                    id="isLimited"
                    checked={formData.isLimited}
                    onChange={(e) => setFormData({ ...formData, isLimited: e.target.checked })}
                    className="w-4 h-4"
                />
                <label htmlFor="isLimited" className="text-sm">한정판으로 등록 (시간 제한 판매)</label>
              </div>

              {formData.isLimited && (
                  <div className="pl-6 space-y-4">
                    <div>
                      <label htmlFor="releaseTime" className="block text-sm mb-2">판매 시작 시간 *</label>
                      <input
                          type="datetime-local"
                          id="releaseTime"
                          value={formData.releaseTime}
                          onChange={(e) => setFormData({ ...formData, releaseTime: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                          required
                      />
                    </div>
                    <div>
                      <label htmlFor="stock" className="block text-sm mb-2">재고 수량 *</label>
                      <input
                          type="number"
                          id="stock"
                          value={formData.stock}
                          onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 1 })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                          required
                      />
                    </div>
                  </div>
              )}
            </div>

            {/* 하단 버튼 - 기존 스타일 유지 */}
            <div className="flex gap-3 pt-4">
              <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                등록하기
              </button>
            </div>
          </form>
        </div>
      </div>
  );
}