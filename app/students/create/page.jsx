'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthTemplate } from '@/components/templates';
import { Button, Input, Label, Text } from '@/components/atoms';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { API_ENDPOINTS, MESSAGES } from '@/constants';

function CreateStudentForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    major: '',
    gpa: 0,
    enrollmentYear: new Date().getFullYear(),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuth();
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'gpa' ? parseFloat(value) : name === 'enrollmentYear' ? parseInt(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(API_ENDPOINTS.STUDENTS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        router.push('/students');
      } else {
        setError(data.message || MESSAGES.GENERIC_ERROR);
      }
    } catch (err) {
      setError(MESSAGES.GENERIC_ERROR);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthTemplate title="Add New Student">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div>
          <Label htmlFor="name" required>Full Name</Label>
          <Input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            required
          />
        </div>

        <div>
          <Label htmlFor="email" required>Email</Label>
          <Input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            required
          />
        </div>

        <div>
          <Label htmlFor="major" required>Major</Label>
          <Input
            id="major"
            type="text"
            name="major"
            value={formData.major}
            onChange={handleChange}
            placeholder="Computer Science"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="gpa">GPA</Label>
            <Input
              id="gpa"
              type="number"
              name="gpa"
              value={formData.gpa}
              onChange={handleChange}
              placeholder="3.8"
              step="0.01"
              min="0"
              max="4"
            />
          </div>

          <div>
            <Label htmlFor="enrollmentYear" required>Enrollment Year</Label>
            <Input
              id="enrollmentYear"
              type="number"
              name="enrollmentYear"
              value={formData.enrollmentYear}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            variant="primary"
            type="submit"
            loading={loading}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Student'}
          </Button>
          <Button
            variant="secondary"
            type="button"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
      </form>
    </AuthTemplate>
  );
}

export default function CreateStudentPage() {
  return (
    <ProtectedRoute>
      <CreateStudentForm />
    </ProtectedRoute>
  );
}
