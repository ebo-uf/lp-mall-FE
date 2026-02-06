import { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { MainPage } from './components/MainPage';

type Page = 'login' | 'signup' | 'main';

interface User {
  id: string;
  username: string;
  nickname: string;
  email: string;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLogin = (username: string, password: string) => {
    // Mock login - 실제로는 백엔드 인증이 필요합니다
    const mockUser: User = {
      id: '1',
      username,
      nickname: username,
      email: `${username}@example.com`
    };
    setCurrentUser(mockUser);
    setCurrentPage('main');
  };

  const handleSignup = (username: string, password: string, nickname: string, email: string) => {
    // Mock signup - 실제로는 백엔드에 저장이 필요합니다
    const newUser: User = {
      id: Date.now().toString(),
      username,
      nickname,
      email
    };
    setCurrentUser(newUser);
    setCurrentPage('main');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentPage === 'login' && (
        <LoginPage
          onLogin={handleLogin}
          onNavigateToSignup={() => setCurrentPage('signup')}
        />
      )}
      {currentPage === 'signup' && (
        <SignupPage
          onSignup={handleSignup}
          onNavigateToLogin={() => setCurrentPage('login')}
        />
      )}
      {currentPage === 'main' && currentUser && (
        <MainPage user={currentUser} onLogout={handleLogout} />
      )}
    </div>
  );
}
