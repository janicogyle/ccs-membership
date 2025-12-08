export default function PageTemplate({
  children,
  className = '',
}) {
  return (
    <div className={`min-h-screen bg-white text-center ${className}`}>
      <div>
        {children}
        
        <footer className="w-full text-center text-slate-600 text-sm py-6 mt-12 border-t border-slate-200 bg-slate-50 flex justify-center">
          <div className="max-w-7xl px-6 w-full">
            <div className="flex justify-center">
              <p className="font-medium">© {new Date().getFullYear()} CCS MemberLink. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
