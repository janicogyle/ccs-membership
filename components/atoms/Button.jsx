export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  className = '',
  children,
  disabled,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-bold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transform hover:-translate-y-0.5 active:translate-y-0';
  
  const variantStyles = {
    primary: 'bg-gradient-to-r from-[#ff6b35] to-[#e85d2c] hover:from-[#e85d2c] hover:to-[#d54d1c] text-white focus:ring-[#ff6b35] shadow-lg hover:shadow-xl',
    secondary: 'bg-gradient-to-r from-[#4d2f20] to-[#3d2418] hover:from-[#5d3725] hover:to-[#4d2f20] text-white focus:ring-[#4d2f20] shadow-md hover:shadow-lg',
    danger: 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white focus:ring-red-500 shadow-lg hover:shadow-xl',
    ghost: 'text-orange-300 hover:text-white hover:bg-[#3d2418] focus:ring-[#ff6b35]',
    light: 'bg-[#3d2418] text-orange-300 hover:bg-[#4d2f20] focus:ring-[#ff6b35] border-2 border-[#4d2f20] hover:border-[#ff6b35] shadow-md hover:shadow-lg',
    'outline-white': 'bg-transparent text-white hover:bg-white/10 focus:ring-white border-2 border-white hover:border-white/80',
  };
  
  const sizeStyles = {
    sm: 'h-9 px-4 text-sm',
    md: 'h-11 px-6 text-base',
    lg: 'h-12 px-8 text-base',
  };
  
  const widthStyle = fullWidth ? 'w-full' : '';
  
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </>
      ) : children}
    </button>
  );
}
