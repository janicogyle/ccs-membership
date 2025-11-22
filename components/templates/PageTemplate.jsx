export default function PageTemplate({
  children,
  className = '',
}) {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 ${className}`}>
      <div className="max-w-6xl mx-auto p-8">
        {children}
        
        <footer className="text-center text-gray-800 pb-8 mt-12">
          <p>Built with Next.js {new Date().getFullYear()}</p>
        </footer>
      </div>
    </div>
  );
}
