export default function StudentsPage() {
  const students = [
    { id: 1, name: "John Doe", course: "Computer Science" },
    { id: 2, name: "Jane Smith", course: "Information Technology" },
    { id: 3, name: "Mike Johnson", course: "Software Engineering" },
    { id: 4, name: "Sarah Williams", course: "Data Science" },
  ];

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-black mb-8">Students Directory</h1>
        
        <div className="grid gap-4 md:grid-cols-2">
          {students.map((student) => (
            <div
              key={student.id}
              className="bg-black text-white rounded-lg shadow-md p-6 hover:shadow-lg hover:bg-gray-900 transition-all border-l-4 border-orange-500"
            >
              <h2 className="text-xl font-semibold mb-2">
                {student.name}
              </h2>
              <p className="text-gray-300">Course: {student.course}</p>
              <a
                href={`/students/${student.id}`}
                className="inline-block mt-4 text-orange-500 hover:text-orange-400 font-medium"
              >
                View Details →
              </a>
            </div>
          ))}
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
