export default function AboutPage() {
  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-black mb-6">About Us</h1>
        
        <div className="bg-black text-white rounded-lg shadow-md p-8 border-l-4 border-orange-500">
          <p className="text-lg mb-4">
            Welcome to our Next.js application! This project demonstrates the power
            and flexibility of Next.js for building modern web applications.
          </p>
          
          <h2 className="text-2xl font-semibold text-orange-500 mb-3 mt-6">
            What We Do
          </h2>
          <p className="mb-4">
            We provide a comprehensive student management system that helps
            educational institutions manage their student data efficiently.
          </p>
          
          <h2 className="text-2xl font-semibold text-orange-500 mb-3 mt-6">
            Our Mission
          </h2>
          <p className="mb-4">
            To create innovative solutions that make education management easier
            and more accessible for everyone.
          </p>
        </div>

        <div className="mt-8">
          <a
            href="/"
            className="text-black hover:text-gray-800 font-medium"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
