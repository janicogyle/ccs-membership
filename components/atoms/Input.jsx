export default function Input({
  error,
  label,
  className = '',
  ...props
}) {
  const baseStyles = 'block w-full h-11 px-4 text-base text-slate-900 placeholder:text-slate-400 bg-white border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0';
  const errorStyles = error 
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
    : 'border-slate-300 focus:border-orange-500 focus:ring-orange-500/20';
  
  return (
    <input
      className={`${baseStyles} ${errorStyles} ${className}`}
      {...props}
    />
  );
}
