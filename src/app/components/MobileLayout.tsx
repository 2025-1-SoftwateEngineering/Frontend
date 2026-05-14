import React from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
}

export function MobileLayout({ children, className = '' }: Props) {
  return (
    <div className="min-h-screen flex justify-center bg-[#e8e8e8]">
      <div
        className={`relative flex flex-col w-full overflow-hidden max-w-[430px] min-h-dvh bg-white ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
