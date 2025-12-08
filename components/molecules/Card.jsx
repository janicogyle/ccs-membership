import Link from 'next/link';


export default function Card({ title, description, href, icon, className = '', children, align = 'center' }) {
  const isLeft = align === 'left';
  
  const content = (
    <div className={`group relative flex flex-col bg-white rounded-3xl p-10 border border-slate-200 hover:border-orange-500/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 h-full overflow-hidden ${className}`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {icon && (
        <div className={`relative z-10 mb-6 ${isLeft ? 'flex justify-start' : 'flex justify-center'}`}>
          <div className={`w-16 h-16 flex items-center justify-center bg-slate-50 text-slate-600 rounded-full group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300 shadow-sm border border-slate-100`}>
            <span className="text-3xl">{icon}</span>
          </div>
        </div>
      )}
      
      <div className={`relative z-10 flex flex-col flex-grow ${isLeft ? 'items-start text-left' : 'items-center text-center'}`}>
        {title && (
          <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-orange-600 transition-colors">
            {title}
          </h3>
        )}
        {description && (
          <p className="text-slate-600 text-base leading-relaxed">
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
