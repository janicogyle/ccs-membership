interface StudentDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function StudentDetailPage({ params }: StudentDetailPageProps) {
  const { id } = await params;
  
  // Sample student data
  const studentsData: Record<string, { name: string; course: string; email: string; year: string; gpa: string }> = {
    "1": {
      name: "John Doe",
      course: "Computer Science",
      email: "john.doe@example.com",
      year: "3rd Year",
      gpa: "3.8"
    },
    "2": {
      name: "Jane Smith",
      course: "Information Technology",
      email: "jane.smith@example.com",
      year: "2nd Year",
      gpa: "3.9"
    },
    "3": {
      name: "Mike Johnson",
      course: "Software Engineering",
      email: "mike.johnson@example.com",
      year: "4th Year",
      gpa: "3.7"
    },
    "4": {
      name: "Sarah Williams",
      course: "Data Science",
      email: "sarah.williams@example.com",
      year: "1st Year",
      gpa: "4.0"
    }
  };

  const student = studentsData[id];

  if (!student) {
    return (
      <div className="min-h-screen p-8 bg-gradient-to-br from-orange-50 to-orange-100">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-black mb-6">Student Not Found</h1>
          <p className="text-gray-800 mb-4">The student with ID {id} does not exist.</p>
          <a
            href="/students"
            className="text-black hover:text-gray-800 font-medium"
          >
            ← Back to Students
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-black mb-8">Student Details</h1>
        
        <div className="bg-black text-white rounded-lg shadow-lg p-8 border-l-4 border-orange-500">
          <div className="mb-6">
            <h2 className="text-3xl font-semibold mb-2">
              {student.name}
            </h2>
            <p className="text-orange-400">Student ID: {id}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold text-orange-400 uppercase mb-1">
                Course
              </h3>
              <p className="text-lg">{student.course}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-orange-400 uppercase mb-1">
                Email
              </h3>
              <p className="text-lg">{student.email}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-orange-400 uppercase mb-1">
                Year Level
              </h3>
              <p className="text-lg">{student.year}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-orange-400 uppercase mb-1">
                GPA
              </h3>
              <p className="text-lg">{student.gpa}</p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <a
            href="/students"
            className="text-black hover:text-gray-800 font-medium"
          >
            ← Back to Students
          </a>
        </div>
      </div>
    </div>
  );
}
