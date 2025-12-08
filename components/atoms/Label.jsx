export default function Label({
  htmlFor,
  required = false,
  className = '',
  children,
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-base font-medium text-slate-700 mb-2 ${className}`}
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
}
