export default function Button({ children, onClick, variant = 'primary', size = 'md', disabled = false, className = '', type = 'button' }) {
  const base = 'font-semibold rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-primary-dark text-white shadow-sm shadow-primary-dark/20',
    secondary: 'bg-primary text-app-black',
    outline: 'border-2 border-primary-dark text-primary-dark bg-transparent',
    ghost: 'text-primary-dark bg-transparent',
    danger: 'bg-red-500 text-white',
    kakao: 'bg-[#FEE500] text-[#3A1D1D]',
    google: 'bg-white text-app-black border border-gray-200',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3.5 text-sm',
    lg: 'px-6 py-4 text-base w-full',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}
