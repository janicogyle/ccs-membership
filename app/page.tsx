import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="max-w-6xl mx-auto p-8">
        <header className="text-center mb-12 pt-12">
          <Image
            className="dark:invert mx-auto mb-6"
            src="/next.svg"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
          />
          <h1 className="text-5xl font-bold text-black mb-4">
            Welcome to CCS Next.js Project
          </h1>
          <p className="text-xl text-gray-800">
            Activity 3: Project Setup Using Next.js
          </p>
        </header>

        <main className="grid gap-6 md:grid-cols-3 mb-12">
          <a
            href="/students"
            className="bg-black text-white rounded-lg shadow-lg p-8 hover:shadow-xl hover:bg-gray-900 transition-all border-t-4 border-orange-500"
          >
            <h2 className="text-2xl font-bold mb-3">
              📚 Students
            </h2>
            <p className="text-gray-300">
              View the student directory and explore individual student profiles.
            </p>
          </a>

          <a
            href="/about"
            className="bg-black text-white rounded-lg shadow-lg p-8 hover:shadow-xl hover:bg-gray-900 transition-all border-t-4 border-orange-500"
          >
            <h2 className="text-2xl font-bold mb-3">
              ℹ️ About
            </h2>
            <p className="text-gray-300">
              Learn more about our application and what we do.
            </p>
          </a>

          <a
            href="/contact"
            className="bg-black text-white rounded-lg shadow-lg p-8 hover:shadow-xl hover:bg-gray-900 transition-all border-t-4 border-orange-500"
          >
            <h2 className="text-2xl font-bold mb-3">
              📞 Contact
            </h2>
            <p className="text-gray-300">
              Get in touch with us for any inquiries or support.
            </p>
          </a>
        </main>

        <section className="bg-black text-white rounded-lg shadow-lg p-8 mb-12 border-l-4 border-orange-500">
          <h2 className="text-3xl font-bold mb-4">
            Project Features
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-orange-500 mr-2">✓</span>
              <span>Next.js App Router with TypeScript</span>
            </li>
            <li className="flex items-start">
              <span className="text-orange-500 mr-2">✓</span>
              <span>Multiple pages (Students, About, Contact)</span>
            </li>
            <li className="flex items-start">
              <span className="text-orange-500 mr-2">✓</span>
              <span>Dynamic routing for student details</span>
            </li>
            <li className="flex items-start">
              <span className="text-orange-500 mr-2">✓</span>
              <span>Modern UI with Tailwind CSS</span>
            </li>
            <li className="flex items-start">
              <span className="text-orange-500 mr-2">✓</span>
              <span>Responsive design for all devices</span>
            </li>
          </ul>
        </section>

        <footer className="text-center text-gray-800 pb-8">
          <p>Built with Next.js {new Date().getFullYear()}</p>
        </footer>
      </div>
    </div>
  );
}
