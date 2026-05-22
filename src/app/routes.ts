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
import { ShopScreen } from './pages/ShopScreen.tsx';
import { FriendsScreen } from './pages/FriendsScreen';
import { VocabularyListScreen } from './pages/VocabularyListScreen';
import { VocabularyBookScreen } from './pages/VocabularyBookScreen';
import { WordTestScreen } from './pages/WordTestScreen';
import { WordMemorizeScreen } from './pages/WordMemorizeScreen';
import { VocabularyEditScreen } from './pages/VocabularyEditScreen';
import { ProfileScreen } from './pages/ProfileScreen.tsx';
import { ProfileEditScreen } from './pages/ProfileEditScreen';
import FriendProfilePage from './pages/FriendProfilePage.tsx';
<<<<<<< HEAD
import { PetScreen } from './pages/PetScreen.tsx';
import { PetProfileEditScreen } from './pages/PetProfileEditScreen.tsx';

=======
import { ChoiceListScreen } from './pages/ChoiceListScreen';
import { QuizScreen } from './pages/QuizScreen';
import { CrosswordListScreen } from './pages/CrosswordListScreen';
import { CrosswordScreen } from './pages/CrosswordScreen';
>>>>>>> 801b6f54a54d8cf0f212db75a86c481b9fe0d9dc

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
      { path: '/friends/:memberId', Component: FriendProfilePage },
<<<<<<< HEAD
      { path: '/pet', Component: PetScreen },
      { path: '/pet/edit', Component: PetProfileEditScreen }
=======
      { path: '/choices', Component: ChoiceListScreen },
      { path: '/choices/:choiceId', Component: QuizScreen },
      { path: '/crosswords', Component: CrosswordListScreen },
      { path: '/crosswords/:crosswordId', Component: CrosswordScreen },
>>>>>>> 801b6f54a54d8cf0f212db75a86c481b9fe0d9dc
    ],
  },
]);
