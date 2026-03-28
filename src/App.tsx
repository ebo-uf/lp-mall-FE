import { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { MainPage } from './components/MainPage';
import { PaymentSuccessPage } from './components/PaymentSuccessPage';
import { PaymentFailPage } from './components/PaymentFailPage';
import { OrderHistoryPage } from './components/OrderHistoryPage';

type Page = 'login' | 'signup' | 'main' | 'order-history' | 'payment-success' | 'payment-fail';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');

  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/payment/success') {
      setCurrentPage('payment-success');
    } else if (path === '/payment/fail') {
      setCurrentPage('payment-fail');
    } else {
      const token = localStorage.getItem('accessToken');
      if (token) setCurrentPage('main');
    }
  }, []);

  const handleGoHome = () => {
    window.history.pushState({}, '', '/');
    const token = localStorage.getItem('accessToken');
    setCurrentPage(token ? 'main' : 'login');
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('nickname');
    localStorage.removeItem('name');
    setCurrentPage('login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentPage === 'login' && (
        <LoginPage
          onLoginSuccess={() => setCurrentPage('main')}
          onNavigateToSignup={() => setCurrentPage('signup')}
        />
      )}
      {currentPage === 'signup' && (
        <SignupPage onNavigateToLogin={() => setCurrentPage('login')} />
      )}
      {currentPage === 'main' && (
        <MainPage onLogout={handleLogout} onNavigateToOrders={() => setCurrentPage('order-history')} />
      )}
      {currentPage === 'order-history' && (
        <OrderHistoryPage onGoBack={() => setCurrentPage('main')} />
      )}
      {currentPage === 'payment-success' && (
        <PaymentSuccessPage onGoHome={handleGoHome} />
      )}
      {currentPage === 'payment-fail' && (
        <PaymentFailPage onGoHome={handleGoHome} />
      )}
    </div>
  );
}