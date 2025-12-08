import Link from 'next/link';


export default function Card({ title, description, href, icon, className = '', children, align = 'center' }) {
  const isLeft = align === 'left';
  
  const content = (
    <div className={`group relative flex flex-col bg-orange-50 rounded-2xl p-8 border border-orange-100 hover:border-orange-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full overflow-hidden ${className}`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-100 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {icon && (
        <div className={`relative z-10 mb-6 ${isLeft ? 'flex justify-start' : 'flex justify-center'}`}>
          <div className={`w-16 h-16 flex items-center justify-center bg-white text-gray-700 rounded-2xl group-hover:scale-110 transition-all duration-300 shadow-sm border border-orange-100`}>
            <span className="text-3xl">{icon}</span>
          </div>
        </div>
      )}
      
      <div className={`relative z-10 flex flex-col flex-grow ${isLeft ? 'items-start text-left' : 'items-center text-center'}`}>
        {title && (
          <h3 className="text-xl font-bold text-slate-900 mb-3">
            {title}
          </h3>
        )}
        {description && (
          <p className="text-slate-600 text-sm leading-relaxed">
            {description}
          </p>
        )}
        {children}
      </div>
    </div>
  );
  
  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  
  return content;
}
