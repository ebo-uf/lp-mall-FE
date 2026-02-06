import React, { useState } from 'react';
import { Music } from 'lucide-react';
import axios from 'axios';

interface LoginPageProps {
  onLoginSuccess: () => void; // 로그인 성공 시 메인 화면으로 이동시키기 위한 함수
  onNavigateToSignup: () => void;
}

export function LoginPage({ onLoginSuccess, onNavigateToSignup }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/auth/login', {
        username,
        password,
      });

      const token = response.data.accessToken;

      if (token) {
        localStorage.setItem('accessToken', token);
        alert('로그인에 성공했습니다!');

        // 알럿 창을 닫은 직후에 이동하도록 확실히 순서를 보장
        onLoginSuccess();
      }
    } catch (error: any) {
      // [중요] axios.isCancel(error) 또는 요청 중단 에러는 무시
      if (axios.isCancel(error)) return;

      console.error('Login Error:', error);

      // 서버 응답이 명확히 에러(4xx, 5xx)인 경우에만 에러 메시지 출력
      if (error.response) {
        alert(error.response.data.message || '아이디 또는 비밀번호가 틀렸습니다.');
      }
      // 페이지 이동 등으로 인해 요청이 끊긴 게 아닐 때만 "통신 오류" 출력
      else if (error.request) {
        // 요청은 갔으나 응답을 못 받은 경우 (서버 다운 등)
        alert('서버와 통신 중 오류가 발생했습니다.');
      }
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-full mb-4">
              <Music className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl mb-2">LP Marketplace</h1>
            <p className="text-gray-600">희귀 LP를 거래하는 플랫폼</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl mb-6">로그인</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm mb-2">
                  아이디
                </label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    required
                />
              </div>
              <button
                  type="submit"
                  className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors"
              >
                로그인
              </button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                계정이 없으신가요?{' '}
                <button
                    type="button"
                    onClick={onNavigateToSignup}
                    className="text-black hover:underline"
                >
                  회원가입
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
  );
}