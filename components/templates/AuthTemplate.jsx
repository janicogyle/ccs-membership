export default function AuthTemplate({
  children,
  title,
  subtitle,
}) {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-slate-50 py-12 px-4">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 px-8 py-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-3 text-base text-slate-600">
                {subtitle}
              </p>
            )}
          </div>

          {/* Content */}
          {children}
        </div>
      </div>
    </div>
  );
}
