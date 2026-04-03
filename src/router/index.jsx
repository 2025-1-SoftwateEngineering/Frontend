import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Layouts
import AppLayout from '../components/common/AppLayout';

// Auth pages
import SplashPage from '../pages/auth/SplashPage';
import WelcomePage from '../pages/auth/WelcomePage';
import LoginOptionsPage from '../pages/auth/LoginOptionsPage';
import EmailLoginPage from '../pages/auth/EmailLoginPage';
import PasswordResetPage from '../pages/auth/PasswordResetPage';
import SignUpPage from '../pages/auth/SignUpPage';

// Main pages
import HomePage from '../pages/home/HomePage';
import ShopPage from '../pages/home/ShopPage';
import FriendsPage from '../pages/home/FriendsPage';

// Voca pages
import VocaListPage from '../pages/vocab/VocaListPage';
import VocaDetailPage from '../pages/vocab/VocaDetailPage';
import WordTestPage from '../pages/vocab/WordTestPage';
import WordMemorizePage from '../pages/vocab/WordMemorizePage';
import VocaEditPage from '../pages/vocab/VocaEditPage';

// Member pages
import ProfilePage from '../pages/member/ProfilePage';
import ProfileEditPage from '../pages/member/ProfileEditPage';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/welcome" replace />;
}

function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return !user ? children : <Navigate to="/home" replace />;
}

export const router = createBrowserRouter([
  { path: '/', element: <SplashPage /> },
  {
    path: '/welcome',
    element: <GuestRoute><WelcomePage /></GuestRoute>,
  },
  {
    path: '/login',
    element: <GuestRoute><LoginOptionsPage /></GuestRoute>,
  },
  {
    path: '/login/email',
    element: <GuestRoute><EmailLoginPage /></GuestRoute>,
  },
  {
    path: '/login/password-reset',
    element: <GuestRoute><PasswordResetPage /></GuestRoute>,
  },
  {
    path: '/signup',
    element: <GuestRoute><SignUpPage /></GuestRoute>,
  },
  {
    path: '/',
    element: <PrivateRoute><AppLayout /></PrivateRoute>,
    children: [
      { path: 'home', element: <HomePage /> },
      { path: 'shop', element: <ShopPage /> },
      { path: 'friends', element: <FriendsPage /> },
      { path: 'voca', element: <VocaListPage /> },
      { path: 'voca/new', element: <VocaEditPage /> },
      { path: 'voca/:bookId', element: <VocaDetailPage /> },
      { path: 'voca/:bookId/test', element: <WordTestPage /> },
      { path: 'voca/:bookId/memorize', element: <WordMemorizePage /> },
      { path: 'voca/:bookId/edit', element: <VocaEditPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'profile/edit', element: <ProfileEditPage /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);
