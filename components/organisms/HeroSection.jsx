import Image from 'next/image';


export default function HeroSection({ title, subtitle, logoSrc = '/CSSlogo.png', showLogo = true }) {
  return (
    <header className="text-center py-16 px-6 bg-gradient-to-b from-orange-50 to-white border-b border-slate-100">
      {showLogo && (
        <Image
          className="mx-auto mb-6"
          src={logoSrc}
          alt="CCS Logo"
          width={80}
          height={80}
          priority
        />
      )}
      <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
        {title || (
          <>
            Connecting <span className="text-orange-500">Talent</span>
            <br />
            with <span className="text-orange-500">Opportunity</span>
          </>
        )}
      </h1>
      {subtitle && (
        <p className="text-base text-slate-700 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </header>
  );
}
