export default function Input({
  error,
  label,
  className = '',
  ...props
}) {
  const baseStyles = 'block w-full h-12 px-4 text-base text-white placeholder:text-orange-200/40 bg-[#2d1810] border-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-[#1a0f0a] disabled:cursor-not-allowed';
  const errorStyles = error 
    ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' 
    : 'border-[#4d2f20] focus:border-[#ff6b35] focus:ring-[#ff6b35]/20 hover:border-[#5d3725]';
  
  return (
    <input
      className={`${baseStyles} ${errorStyles} ${className}`}
      {...props}
    />
  );
}
