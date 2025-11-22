import Image from 'next/image';


export default function HeroSection({ title, subtitle, logoSrc = '/next.svg' }) {
  return (
    <header className="text-center mb-12 pt-12">
      <Image
        className="dark:invert mx-auto mb-6"
        src={logoSrc}
        alt="Logo"
        width={180}
        height={38}
        priority
      />
      <h1 className="text-5xl font-bold text-black mb-4">
        {title}
      </h1>
      {subtitle && (
        <p className="text-xl text-gray-800">
          {subtitle}
        </p>
      )}
    </header>
  );
}
