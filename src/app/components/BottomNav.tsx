import { useNavigate, useLocation } from 'react-router';
import { ShoppingBag, Users, Home, BookOpen, User } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/shop',        icon: ShoppingBag, label: '상점' },
  { path: '/friends',    icon: Users,       label: '친구' },
  { path: '/home',       icon: Home,        label: '홈' },
  { path: '/vocabulary', icon: BookOpen,    label: '학습' },
  { path: '/profile',    icon: User,        label: '내 정보' },
];

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="flex-shrink-0 w-full border-t border-[#e5e7eb] bg-white">
      <div className="flex items-center justify-around h-16">
        {NAV_ITEMS.map(({ path, icon: Icon, label }) => {
          const active = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full bg-transparent border-0 ${active ? 'text-brand-blue' : 'text-text-sub'}`}
            >
              <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
              <span className={`text-[10px] ${active ? 'font-semibold text-brand-blue-dark' : 'font-normal text-text-sub'}`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
      <div style={{ height: 'env(safe-area-inset-bottom, 0px)' }} />
    </nav>
  );
}
