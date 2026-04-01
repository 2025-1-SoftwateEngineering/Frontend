import { Outlet, useNavigate } from 'react-router';
import { useEffect } from 'react';
import { useAuth } from '../../main/features/domain/auth/AuthContext';
import { BottomNav } from '../components/BottomNav';
import { MobileLayout } from '../components/MobileLayout';

export function AppLayout() {
  const { currentUser, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !currentUser) {
      navigate('/welcome', { replace: true });
    }
  }, [currentUser, isLoading, navigate]);

  if (isLoading || !currentUser) return null;

  return (
    <MobileLayout>
      <div className="flex flex-col" style={{ height: '100dvh' }}>
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
        <BottomNav />
      </div>
    </MobileLayout>
  );
}
