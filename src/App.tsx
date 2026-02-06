import { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { MainPage } from './components/MainPage';

type Page = 'login' | 'signup' | 'main';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');

  // [추가] 앱이 처음 켜질 때 토큰이 있는지 확인
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setCurrentPage('main'); // 토큰 있으면 바로 메인으로!
    }
  }, []);

  const handleLoginSuccess = () => {
    setCurrentPage('main');
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('nickname');
    setCurrentPage('login');
  };

  return (
      <div className="min-h-screen bg-gray-50">
        {currentPage === 'login' && (
            <LoginPage
                onLoginSuccess={handleLoginSuccess}
                onNavigateToSignup={() => setCurrentPage('signup')}
            />
        )}
        {currentPage === 'signup' && (
            <SignupPage
                onNavigateToLogin={() => setCurrentPage('login')}
            />
        )}
        {currentPage === 'main' && (
            <MainPage onLogout={handleLogout} />
        )}
      </div>
  );
}