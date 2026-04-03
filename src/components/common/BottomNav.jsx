import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  {
    key: 'shop',
    path: '/shop',
    label: '상점',
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill={active ? '#94B9F3' : 'none'} stroke={active ? '#94B9F3' : '#737373'} strokeWidth={1.8} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6h13M10 19a1 1 0 100 2 1 1 0 000-2zm7 0a1 1 0 100 2 1 1 0 000-2z" />
      </svg>
    ),
  },
  {
    key: 'friends',
    path: '/friends',
    label: '친구',
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill={active ? '#94B9F3' : 'none'} stroke={active ? '#94B9F3' : '#737373'} strokeWidth={1.8} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M16 7a4 4 0 11-8 0 4 4 0 018 0zM22 20v-2a4 4 0 00-3-3.87" />
      </svg>
    ),
  },
  {
    key: 'home',
    path: '/home',
    label: '홈',
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill={active ? '#94B9F3' : 'none'} stroke={active ? '#94B9F3' : '#737373'} strokeWidth={1.8} className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75L12 3l9 6.75V21a1 1 0 01-1 1H5a1 1 0 01-1-1V9.75z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 22V12h6v10" />
      </svg>
    ),
  },
  {
    key: 'voca',
    path: '/voca',
    label: '학습하기',
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill={active ? '#94B9F3' : 'none'} stroke={active ? '#94B9F3' : '#737373'} strokeWidth={1.8} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    key: 'profile',
    path: '/profile',
    label: '내 정보',
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill={active ? '#94B9F3' : 'none'} stroke={active ? '#94B9F3' : '#737373'} strokeWidth={1.8} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t border-gray-100 z-50">
      <div className="flex items-end justify-around px-2 pt-2 pb-3">
        {navItems.map((item) => {
          const active = isActive(item.path);
          const isHome = item.key === 'home';
          return (
            <button
              key={item.key}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-0.5 transition-all ${
                isHome
                  ? 'relative -top-3 bg-primary-dark rounded-full p-3 shadow-lg shadow-primary-dark/30'
                  : ''
              }`}
            >
              {isHome ? (
                <span className="text-white">{item.icon(true)}</span>
              ) : (
                item.icon(active)
              )}
              {!isHome && (
                <span
                  className={`text-[10px] font-medium ${
                    active ? 'text-primary-dark' : 'text-app-gray'
                  }`}
                >
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
