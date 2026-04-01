import React from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
}

/** Wrapper that simulates a smartphone viewport centered on desktop. */
export function MobileLayout({ children, className = '' }: Props) {
  return (
    <div className="min-h-screen flex justify-center" style={{ background: '#e8e8e8' }}>
      <div
        className={`relative flex flex-col w-full overflow-hidden ${className}`}
        style={{
          maxWidth: 430,
          minHeight: '100dvh',
          background: '#ffffff',
          fontFamily: "'Noto Sans KR', sans-serif",
        }}
      >
        {children}
      </div>
    </div>
  );
}
