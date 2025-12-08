export default function AuthTemplate({
  children,
  title,
  subtitle,
}) {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-slate-50 py-12 px-4 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000 opacity-30"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Card Container */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 px-8 py-10 md:px-10 md:py-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-400 to-orange-600"></div>
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-3">
              {title}
            </h1>
            {subtitle && (
              <div className="text-base text-slate-600">
                {subtitle}
              </div>
            )}
          </div>

          {/* Content */}
          {children}
        </div>
      </div>
    </div>
  );
}
