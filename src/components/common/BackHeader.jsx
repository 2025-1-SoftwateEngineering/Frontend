import { useNavigate } from 'react-router-dom';

export default function BackHeader({ title, rightElement }) {
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between px-5 py-4 bg-white border-b border-gray-100">
      <button
        onClick={() => navigate(-1)}
        className="p-1 rounded-lg text-app-black active:bg-gray-100"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      {title && <h1 className="text-base font-bold text-app-black">{title}</h1>}
      <div className="w-8 flex justify-end">{rightElement || null}</div>
    </header>
  );
}
