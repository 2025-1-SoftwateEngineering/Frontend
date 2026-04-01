import { useNavigate, useLocation } from 'react-router';
import { ShoppingBag, Users, Home, BookOpen, User } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/shop',       icon: ShoppingBag, label: '상점' },
  { path: '/friends',   icon: Users,       label: '친구' },
  { path: '/home',      icon: Home,        label: '홈' },
  { path: '/vocabulary', icon: BookOpen,   label: '학습' },
  { path: '/profile',   icon: User,        label: '내 정보' },
];

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav
      className="flex-shrink-0 w-full border-t"
      style={{ background: '#ffffff', borderColor: '#e5e7eb' }}
    >
      <div className="flex items-center justify-around" style={{ height: 64 }}>
        {NAV_ITEMS.map(({ path, icon: Icon, label }) => {
          const active = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="flex flex-col items-center justify-center gap-0.5"
              style={{ flex: 1, height: '100%', color: active ? '#B8D0FA' : '#737373', background: 'none', border: 'none' }}
            >
              <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
              <span style={{ fontSize: 10, fontWeight: active ? 600 : 400, color: active ? '#94B9F3' : '#737373' }}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
      {/* Safe area bottom padding */}
      <div style={{ height: 'env(safe-area-inset-bottom, 0px)' }} />
    </nav>
  );
}
