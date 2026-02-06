import React, { useState } from 'react';
import { Music } from 'lucide-react';
import axios from 'axios'; // axios 추가

interface SignupPageProps {
  // 부모 컴포넌트에서 특별한 처리가 필요 없다면 onSignup은 지우거나 옵셔널로 둬도 돼
  onNavigateToLogin: () => void;
}

export function SignupPage({ onNavigateToLogin }: SignupPageProps) {
  // 1. 상태 관리용 데이터
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    email: '',
  });

  // 2. 입력값 변경 감지
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // 3. 실제 회원가입 전송 로직
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      // 본인의 백엔드 API 주소로 수정 (예: 8082 포트)
      const response = await axios.post('http://localhost:8000/auth/register', {
        username: formData.username,
        password: formData.password,
        name: formData.nickname,
        email: formData.email,
      });

      if (response.status === 200 || response.status === 201) {
        alert('회원가입이 완료되었습니다!');
        onNavigateToLogin(); // 성공 시 로그인 페이지로 이동
      }
    } catch (error: any) {
      console.error('Signup Error:', error);
      alert(error.response?.data?.message || '회원가입 실패');
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-full mb-4">
              <Music className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl mb-2">LP Marketplace</h1>
            <p className="text-gray-600">희귀 LP를 거래하는 플랫폼</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl mb-6">회원가입</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm mb-2">
                  아이디
                </label>
                <input
                    type="text"
                    id="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm mb-2">
                  비밀번호
                </label>
                <input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    required
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm mb-2">
                  비밀번호 확인
                </label>
                <input
                    type="password"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    required
                />
              </div>
              <div>
                <label htmlFor="nickname" className="block text-sm mb-2">
                  닉네임
                </label>
                <input
                    type="text"
                    id="nickname"
                    value={formData.nickname}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm mb-2">
                  이메일
                </label>
                <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    required
                />
              </div>
              <button
                  type="submit"
                  className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors"
              >
                회원가입
              </button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                이미 계정이 있으신가요?{' '}
                <button
                    type="button" // form 전송 방지
                    onClick={onNavigateToLogin}
                    className="text-black hover:underline"
                >
                  로그인
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
  );
}