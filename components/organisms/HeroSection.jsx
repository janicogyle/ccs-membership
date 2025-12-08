import Image from 'next/image';


export default function HeroSection({ title, subtitle, logoSrc = '/CSSlogo.png', showLogo = true }) {
  return (
    <header className="relative overflow-hidden py-20 px-6 bg-gradient-to-br from-orange-50 via-white to-slate-50 border-b border-slate-100 flex justify-center">
      {/* Background Blobs */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000 opacity-30"></div>
      </div>

      <div className="relative z-10 max-w-6xl w-full text-center">
        {showLogo && (
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-orange-500 blur-2xl opacity-20 rounded-full"></div>
              <Image
                className="relative"
                src={logoSrc}
                alt="CCS Logo"
                width={90}
                height={90}
                priority
              />
            </div>
          </div>
        )}
        
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
          {title || (
            <>
              Connecting <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">Talent</span>
              <br />
              with <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">Opportunity</span>
            </>
          )}
        </h1>
        
        {subtitle && (
          <div className="flex justify-center">
            <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          </div>
        )}
      </div>
    </header>
  );
}
