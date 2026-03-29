import React, { useEffect, useRef } from 'react';

const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon = null,
  className = '',
  ...props
}) => {
  const buttonRef = useRef(null);

  // Ripple effect on click
  const handleClick = (e) => {
    if (disabled || loading) return;

    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s ease-out;
      pointer-events: none;
    `;

    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);

    if (onClick) onClick(e);
  };

  useEffect(() => {
    if (document.getElementById('button-ripple-styles')) return;

    const style = document.createElement('style');
    style.id = 'button-ripple-styles';
    style.textContent = `
      @keyframes ripple {
        to {
          transform: scale(2);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);

    return () => style.remove();
  }, []);

  const baseStyles = 'font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 relative overflow-hidden flex items-center justify-center gap-2 disabled:cursor-not-allowed';

  const variants = {
    primary: 'btn-primary focus:ring-[#58cc02]',
    secondary: 'btn-secondary focus:ring-gray-500',
    success: 'btn-primary bg-[#58cc02] focus:ring-[#58cc02]',
    danger: 'bg-gradient-to-br from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 focus:ring-red-500 shadow-lg shadow-red-500/25',
    outline: 'border-2 border-gray-600 text-gray-300 hover:border-[#58cc02] hover:text-[#58cc02] bg-transparent',
  };

  const sizes = {
    small: 'px-4 py-2 text-sm gap-1.5',
    medium: 'px-6 py-3 text-base gap-2',
    large: 'px-8 py-4 text-lg gap-2.5',
  };

  const iconSizes = {
    small: 16,
    medium: 20,
    large: 24,
  };

  const spinnerSizes = {
    small: 14,
    medium: 18,
    large: 22,
  };

  const loadingSpinner = (
    <svg
      className="animate-spin"
      width={spinnerSizes[size]}
      height={spinnerSizes[size]}
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  return (
    <button
      ref={buttonRef}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled || loading ? 'opacity-60 cursor-not-allowed' : ''} ${className}`}
      onClick={handleClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && loadingSpinner}
      {!loading && icon && React.createElement(icon, { size: iconSizes[size] })}
      {children}
    </button>
  );
};

export default Button;
