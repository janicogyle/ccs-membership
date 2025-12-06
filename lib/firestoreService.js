// Firestore Database Service
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase'

// ==================== STUDENTS ====================

/**
 * Create a new student
 */
export async function createStudent(studentData) {
  try {
    const docRef = await addDoc(collection(db, 'students'), {
      ...studentData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return {
      success: true,
      id: docRef.id,
      message: 'Student created successfully',
    }
  } catch (error) {
    console.error('Create student error:', error)
    return {
      success: false,
      message: error.message,
    }
  }
}

/**
 * Get all students
 */
export async function getAllStudents() {
  try {
    const q = query(collection(db, 'students'), orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    const students = []
    querySnapshot.forEach((doc) => {
      students.push({
        id: doc.id,
        ...doc.data(),
      })
    })
    return {
      success: true,
      data: students,
    }
  } catch (error) {
    console.error('Get students error:', error)
    return {
      success: false,
      message: error.message,
      data: [],
    }
  }
}

/**
 * Get student by ID
 */
export async function getStudentById(id) {
  try {
    const docRef = doc(db, 'students', id)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return {
        success: true,
        data: {
          id: docSnap.id,
          ...docSnap.data(),
        },
      }
    }
    return {
      success: false,
      message: 'Student not found',
    }
  } catch (error) {
    console.error('Get student error:', error)
    return {
      success: false,
      message: error.message,
    }
  }
}

/**
 * Update student
 */
export async function updateStudent(id, updates) {
  try {
    const docRef = doc(db, 'students', id)
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    })
    return {
      success: true,
      message: 'Student updated successfully',
    }
  } catch (error) {
    console.error('Update student error:', error)
    return {
      success: false,
      message: error.message,
    }
  }
}

/**
 * Delete student
 */
export async function deleteStudent(id) {
  try {
    await deleteDoc(doc(db, 'students', id))
    return {
      success: true,
      message: 'Student deleted successfully',
    }
  } catch (error) {
    console.error('Delete student error:', error)
    return {
      success: false,
      message: error.message,
    }
  }
}

/**
 * Search students by name or email
 */
export async function searchStudents(query) {
  try {
    const q = query(
      collection(db, 'students'),
      orderBy('name'),
    )
    const querySnapshot = await getDocs(q)
    const students = []
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      if (
        data.name.toLowerCase().includes(query.toLowerCase()) ||
        data.email.toLowerCase().includes(query.toLowerCase())
      ) {
        students.push({
          id: doc.id,
          ...data,
        })
      }
    })
    return {
      success: true,
      data: students,
    }
  } catch (error) {
    console.error('Search students error:', error)
    return {
      success: false,
      message: error.message,
      data: [],
    }
  }
}

/**
 * Filter students by major
 */
export async function filterStudentsByMajor(major) {
  try {
    const q = query(
      collection(db, 'students'),
      where('major', '==', major),
      orderBy('name')
    )
    const querySnapshot = await getDocs(q)
    const students = []
    querySnapshot.forEach((doc) => {
      students.push({
        id: doc.id,
        ...doc.data(),
      })
    })
    return {
      success: true,
      data: students,
    }
  } catch (error) {
    console.error('Filter students error:', error)
    return {
      success: false,
      message: error.message,
      data: [],
    }
  }
}

/**
 * Get student statistics
 */
export async function getStudentStats() {
  try {
    const querySnapshot = await getDocs(collection(db, 'students'))
    const students = []
    querySnapshot.forEach((doc) => {
      students.push(doc.data())
    })

    const totalStudents = students.length
    const gpas = students.map(s => s.gpa).filter(g => g)
    const averageGpa = gpas.length > 0
      ? (gpas.reduce((a, b) => a + b, 0) / gpas.length).toFixed(2)
      : 0

    const majors = {}
    students.forEach(s => {
      majors[s.major] = (majors[s.major] || 0) + 1
    })

    return {
      success: true,
      data: {
        totalStudents,
        averageGpa,
        majors,
      },
    }
  } catch (error) {
    console.error('Get student stats error:', error)
    return {
      success: false,
      message: error.message,
    }
  }
}

// ==================== ADMIN FUNCTIONS ====================

/**
 * Get all users (admin only)
 */
export async function getAllUsers() {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'))
    const users = []
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      users.push({
        id: doc.id,
        ...data,
      })
    })
    return {
      success: true,
      data: users,
    }
  } catch (error) {
    console.error('Get all users error:', error)
    return {
      success: false,
      message: error.message,
      data: [],
    }
  }
}

/**
 * Create admin user (admin only)
 */
export async function createAdminUser(userData) {
  try {
    // This should be called from API route with admin verification
    const docRef = await addDoc(collection(db, 'users'), {
      ...userData,
      isAdmin: userData.isAdmin || false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return {
      success: true,
      id: docRef.id,
      message: 'User created successfully',
    }
  } catch (error) {
    console.error('Create admin user error:', error)
    return {
      success: false,
      message: error.message,
    }
  }
}

/**
 * Update user role (admin only)
 */
export async function updateUserRole(uid, isAdmin) {
  try {
    await updateDoc(doc(db, 'users', uid), {
      isAdmin: isAdmin,
      updatedAt: serverTimestamp(),
    })
    return {
      success: true,
      message: 'User role updated successfully',
    }
  } catch (error) {
    console.error('Update user role error:', error)
    return {
      success: false,
      message: error.message,
    }
  }
}

/**
 * Delete user (admin only)
 */
export async function deleteUser(uid) {
  try {
    await deleteDoc(doc(db, 'users', uid))
    return {
      success: true,
      message: 'User deleted successfully',
    }
  } catch (error) {
    console.error('Delete user error:', error)
    return {
      success: false,
      message: error.message,
    }
  }
}

export default {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  searchStudents,
  filterStudentsByMajor,
  getStudentStats,
  getAllUsers,
  createAdminUser,
  updateUserRole,
  deleteUser,
}
