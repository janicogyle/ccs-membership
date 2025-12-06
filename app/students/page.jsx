'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageTemplate } from '@/components/templates';
import { Button, Text } from '@/components/atoms';
import { Card } from '@/components/molecules';
import { useAuth } from '@/contexts/AuthContext';
import { API_ENDPOINTS } from '@/constants';

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.STUDENTS);
        const data = await response.json();

        if (data.success) {
          setStudents(data.students);
        } else {
          setError(data.message || 'Failed to fetch students');
        }
      } catch (err) {
        setError('Error loading students');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleAddStudent = () => {
    if (isAuthenticated) {
      router.push('/students/create');
    } else {
      router.push('/auth/login');
    }
  };

  const handleViewStudent = (id) => {
    router.push(`/students/${id}`);
  };

  return (
    <PageTemplate>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Students</h1>
            <Text variant="body" className="text-gray-600">
              Browse and manage student members
            </Text>
          </div>
          <Button
            variant="primary"
            onClick={handleAddStudent}
          >
            Add Student
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading students...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-12 text-center">
            <p className="text-gray-600 mb-4">No students found</p>
            <Button variant="primary" onClick={handleAddStudent}>
              Be the first to join!
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((student) => (
              <Card
                key={student._id}
                title={student.name}
                description={`${student.major} • Class of ${student.enrollmentYear}`}
                href={`/students/${student._id}`}
                onClick={() => handleViewStudent(student._id)}
              >
                {student.gpa > 0 && (
                  <p className="text-sm text-gray-600 mt-2">GPA: {student.gpa.toFixed(2)}</p>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageTemplate>
  );
}
