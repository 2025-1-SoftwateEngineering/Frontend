import { Outlet } from 'react-router';
import { AuthProvider } from '../../main/features/domain/auth/AuthContext';
import { ProgressProvider } from '../../main/features/domain/voca/ProgressContext';

export function RootLayout() {
  return (
    <AuthProvider>
      <ProgressProvider>
        <Outlet />
      </ProgressProvider>
    </AuthProvider>
  );
}
