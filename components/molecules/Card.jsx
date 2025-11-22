import Link from 'next/link';


export default function Card({ title, description, href, icon, className = '', children }) {
  const content = (
    <div className={`bg-black text-white rounded-lg shadow-lg p-8 hover:shadow-xl hover:bg-gray-900 transition-all border-t-4 border-orange-500 ${className}`}>
      {title && (
        <h2 className="text-2xl font-bold mb-3">
          {icon && <span className="mr-2">{icon}</span>}
          {title}
        </h2>
      )}
      {description && (
        <p className="text-gray-300">{description}</p>
      )}
      {children}
    </div>
  );
  
  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  
  return content;
}
