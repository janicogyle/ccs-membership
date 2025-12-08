export default function PageTemplate({
  children,
  className = '',
}) {
  return (
    <div className={`min-h-screen bg-white ${className}`}>
      <div>
        {children}
        
        <footer className="w-full bg-slate-50 text-center text-slate-600 text-sm py-8 mt-20 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-6">
            <p className="font-medium text-slate-900 mb-2">© {new Date().getFullYear()} CCS MemberLink. All rights reserved.</p>
            <p className="text-xs">Supporting Gordon College's Digital Transformation</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
