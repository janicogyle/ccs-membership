export default function ContactPage() {
  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-black mb-6">Contact Us</h1>
        
        <div className="bg-black text-white rounded-lg shadow-md p-8 border-l-4 border-orange-500">
          <h2 className="text-2xl font-semibold text-orange-500 mb-4">
            Get in Touch
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-orange-400">Email</h3>
              <p className="text-gray-300">contact@example.com</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-orange-400">Phone</h3>
              <p className="text-gray-300">+1 (555) 123-4567</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-orange-400">Address</h3>
              <p className="text-gray-300">
                123 Education Street<br />
                Learning City, LC 12345<br />
                United States
              </p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-orange-500">
            <h3 className="font-semibold text-orange-400 mb-4">Office Hours</h3>
            <p className="text-gray-300">
              Monday - Friday: 9:00 AM - 5:00 PM<br />
              Saturday - Sunday: Closed
            </p>
          </div>
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
