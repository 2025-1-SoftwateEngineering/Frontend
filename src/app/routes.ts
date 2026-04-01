import { createBrowserRouter } from 'react-router';
import { RootLayout } from './pages/RootLayout';
import { SplashScreen } from './pages/SplashScreen';
import { WelcomeScreen } from './pages/WelcomeScreen';
import { LoginOptionsScreen } from './pages/LoginOptionsScreen';
import { EmailLoginScreen } from './pages/EmailLoginScreen';
import { ForgotPasswordScreen } from './pages/ForgotPasswordScreen';
import { RegisterScreen } from './pages/RegisterScreen';
import { AppLayout } from './pages/AppLayout';
import { HomeScreen } from './pages/HomeScreen';
import { ShopScreen } from './pages/ShopScreen';
import { FriendsScreen } from './pages/FriendsScreen';
import { VocabularyListScreen } from './pages/VocabularyListScreen';
import { VocabularyBookScreen } from './pages/VocabularyBookScreen';
import { WordTestScreen } from './pages/WordTestScreen';
import { WordMemorizeScreen } from './pages/WordMemorizeScreen';
import { VocabularyEditScreen } from './pages/VocabularyEditScreen';
import { ProfileScreen } from './pages/ProfileScreen';
import { ProfileEditScreen } from './pages/ProfileEditScreen';

export const router = createBrowserRouter([
  {
    Component: RootLayout,
    children: [
      { path: '/', Component: SplashScreen },
      { path: '/welcome', Component: WelcomeScreen },
      { path: '/login', Component: LoginOptionsScreen },
      { path: '/login/email', Component: EmailLoginScreen },
      { path: '/login/forgot-password', Component: ForgotPasswordScreen },
      { path: '/register', Component: RegisterScreen },

      // In-app screens with bottom nav
      {
        Component: AppLayout,
        children: [
          { path: '/home', Component: HomeScreen },
          { path: '/shop', Component: ShopScreen },
          { path: '/friends', Component: FriendsScreen },
          { path: '/vocabulary', Component: VocabularyListScreen },
          { path: '/profile', Component: ProfileScreen },
        ],
      },

      // Full-screen in-app screens (no bottom nav)
      { path: '/vocabulary/create', Component: VocabularyEditScreen },
      { path: '/vocabulary/:bookId', Component: VocabularyBookScreen },
      { path: '/vocabulary/:bookId/test', Component: WordTestScreen },
      { path: '/vocabulary/:bookId/memorize', Component: WordMemorizeScreen },
      { path: '/vocabulary/:bookId/edit', Component: VocabularyEditScreen },
      { path: '/profile/edit', Component: ProfileEditScreen },
    ],
  },
]);
