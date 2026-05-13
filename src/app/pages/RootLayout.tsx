import { Outlet } from 'react-router';
import { AuthProvider } from '../../main/features/domain/auth/AuthContext';
import { ProgressProvider } from '../../main/features/domain/voca/ProgressContext';
import { StreakProvider } from '../../main/features/domain/streak/StreakContext';

export function RootLayout() {
  return (
    <AuthProvider>
      <ProgressProvider>
        <StreakProvider>
          <Outlet />
        </StreakProvider>
      </ProgressProvider>
    </AuthProvider>
  );
}
