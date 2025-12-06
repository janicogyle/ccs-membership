'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { PageTemplate } from '@/components/templates';
import { Button, Text } from '@/components/atoms';
import { useAuth } from '@/contexts/AuthContext';
import { API_ENDPOINTS } from '@/constants';

export default function StudentDetailPage() {
  const params = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.STUDENTS_DETAIL(params.id));
        const data = await response.json();

        if (data.success) {
          setStudent(data.student);
          setFormData(data.student);
        } else {
          setError(data.message || 'Failed to fetch student');
        }
      } catch (err) {
        setError('Error loading student');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchStudent();
    }
  }, [params.id]);

  const handleUpdateStudent = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.STUDENTS_DETAIL(params.id), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        setStudent(formData);
        setIsEditing(false);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Error updating student');
      console.error(err);
    }
  };

  const handleDeleteStudent = async () => {
    if (confirm('Are you sure you want to delete this student?')) {
      try {
        const response = await fetch(API_ENDPOINTS.STUDENTS_DETAIL(params.id), {
          method: 'DELETE',
        });

        const data = await response.json();
        if (data.success) {
          router.push('/students');
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('Error deleting student');
        console.error(err);
      }
    }
  };

  if (loading) {
    return (
      <PageTemplate>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading student details...</p>
        </div>
      </PageTemplate>
    );
  }

  if (error || !student) {
    return (
      <PageTemplate>
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Student Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The student does not exist.'}</p>
          <Button variant="primary" onClick={() => router.push('/students')}>
            Back to Students
          </Button>
        </div>
      </PageTemplate>
    );
  }

  return (
    <PageTemplate>
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{student.name}</h1>
            <p className="text-gray-600">Student ID: {student._id}</p>
          </div>
          <Button
            variant="secondary"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
          {isEditing ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateStudent();
              }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Major
                </label>
                <input
                  type="text"
                  value={formData.major || ''}
                  onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GPA
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="4"
                    value={formData.gpa || 0}
                    onChange={(e) => setFormData({ ...formData, gpa: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enrollment Year
                  </label>
                  <input
                    type="number"
                    value={formData.enrollmentYear || new Date().getFullYear()}
                    onChange={(e) => setFormData({ ...formData, enrollmentYear: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <Button variant="primary" type="submit">
                  Save Changes
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDeleteStudent}
                  disabled={!isAuthenticated}
                >
                  Delete Student
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <Text variant="caption" className="text-gray-600">
                    Email
                  </Text>
                  <p className="text-lg font-medium text-gray-900">{student.email}</p>
                </div>

                <div>
                  <Text variant="caption" className="text-gray-600">
                    Major
                  </Text>
                  <p className="text-lg font-medium text-gray-900">{student.major}</p>
                </div>

                <div>
                  <Text variant="caption" className="text-gray-600">
                    GPA
                  </Text>
                  <p className="text-lg font-medium text-gray-900">
                    {student.gpa ? student.gpa.toFixed(2) : 'N/A'}
                  </p>
                </div>

                <div>
                  <Text variant="caption" className="text-gray-600">
                    Enrollment Year
                  </Text>
                  <p className="text-lg font-medium text-gray-900">
                    {student.enrollmentYear}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8">
          <Button
            variant="secondary"
            onClick={() => router.push('/students')}
          >
            Back to Students
          </Button>
        </div>
      </div>
    </PageTemplate>
  );
}
