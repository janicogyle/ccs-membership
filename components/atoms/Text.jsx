export default function Text({
  as: Component = 'p',
  variant = 'body',
  className = '',
  children,
}) {
  const variantStyles = {
    body: 'text-base text-gray-700',
    caption: 'text-sm text-gray-600',
    title: 'text-2xl font-bold text-gray-900',
    subtitle: 'text-lg text-gray-800',
  };
  
  return (
    <Component className={`${variantStyles[variant]} ${className}`}>
      {children}
    </Component>
  );
}
