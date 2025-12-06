'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export default function AdminStudents() {
  const { token } = useAuth()
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterMajor, setFilterMajor] = useState('')
  const [majors, setMajors] = useState([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  // Fetch students
  const fetchStudents = async (pageNum = 1) => {
    try {
      setLoading(true)
      let url = `${API_BASE}/api/students?page=${pageNum}&limit=10`
      
      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`
      }
      if (filterMajor) {
        url += `&major=${encodeURIComponent(filterMajor)}`
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (data.success) {
        setStudents(data.students)
        setTotal(data.total || data.students.length)
        setPage(pageNum)

        // Extract unique majors
        const uniqueMajors = [...new Set(data.students.map((s) => s.major))]
        setMajors(uniqueMajors)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Failed to load students')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      fetchStudents()
    }
  }, [token])

  // Delete student
  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this student?')) {
      try {
        const response = await fetch(`${API_BASE}/api/students/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        const data = await response.json()
        if (data.success) {
          fetchStudents(page)
        } else {
          setError(data.message)
        }
      } catch (err) {
        setError('Failed to delete student')
        console.error(err)
      }
    }
  }

  // Export to CSV
  const handleExport = () => {
    const csv = [
      ['Name', 'Email', 'Major', 'GPA', 'Enrollment Year'],
      ...students.map((s) => [
        s.name,
        s.email,
        s.major,
        s.gpa,
        s.enrollmentYear
      ])
    ]
      .map((row) => row.join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `students-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  if (loading && students.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-600 mt-2">Manage student records</p>
        </div>
        <button
          onClick={handleExport}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          📥 Export CSV
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold">Search & Filter</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Search by Name or Email
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setPage(1)
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  fetchStudents()
                }
              }}
              placeholder="Type to search..."
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Filter by Major
            </label>
            <select
              value={filterMajor}
              onChange={(e) => {
                setFilterMajor(e.target.value)
                setPage(1)
              }}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Majors</option>
              {majors.map((major) => (
                <option key={major} value={major}>
                  {major}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Major
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  GPA
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Year
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {students.map((student) => (
                <tr key={student._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {student.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {student.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {student.major}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    {student.gpa?.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {student.enrollmentYear}
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <a
                      href={`/students/${student._id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View
                    </a>
                    <button
                      onClick={() => handleDelete(student._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <p className="text-gray-600">
          Showing {students.length} students
        </p>
        <div className="space-x-2">
          <button
            onClick={() => fetchStudents(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-600">Page {page}</span>
          <button
            onClick={() => fetchStudents(page + 1)}
            disabled={students.length < 10}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
