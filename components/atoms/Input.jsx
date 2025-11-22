export default function Input({
  error,
  label,
  className = '',
  ...props
}) {
  const baseStyles = 'appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 focus:outline-none focus:z-10 sm:text-sm';
  const errorStyles = error 
    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500';
  
  return (
    <input
      className={`${baseStyles} ${errorStyles} ${className}`}
      {...props}
    />
  );
}
