// Firebase Authentication Service
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  confirmPasswordReset,
} from 'firebase/auth'
import { auth, db } from './firebase'
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore'

/**
 * Register a new user
 */
export async function registerUser(email, name, password) {
  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Update profile with display name
    await updateProfile(user, {
      displayName: name,
    })

    // Store user data in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      name: name,
      isAdmin: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return {
      success: true,
      message: 'Registration successful',
      user: {
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        isAdmin: false,
      },
    }
  } catch (error) {
    console.error('Registration error:', error)
    return {
      success: false,
      message: error.message,
    }
  }
}

/**
 * Login user
 */
export async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid))
    const userData = userDoc.exists() ? userDoc.data() : {}

    // Get auth token
    const token = await user.getIdToken()

    return {
      success: true,
      message: 'Login successful',
      token: token,
      user: {
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        isAdmin: userData.isAdmin || false,
      },
    }
  } catch (error) {
    console.error('Login error:', error)
    return {
      success: false,
      message: 'Invalid credentials',
    }
  }
}

/**
 * Logout user
 */
export async function logoutUser() {
  try {
    await signOut(auth)
    return {
      success: true,
      message: 'Logout successful',
    }
  } catch (error) {
    console.error('Logout error:', error)
    return {
      success: false,
      message: error.message,
    }
  }
}

/**
 * Get current user
 */
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        const userData = userDoc.exists() ? userDoc.data() : {}
        const token = await user.getIdToken()

        callback({
          uid: user.uid,
          email: user.email,
          name: user.displayName,
          isAdmin: userData.isAdmin || false,
          token: token,
        })
      } catch (error) {
        console.error('Error fetching user data:', error)
        callback(null)
      }
    } else {
      callback(null)
    }
  })
}

/**
 * Update user profile
 */
export async function updateUserProfile(uid, updates) {
  try {
    const user = auth.currentUser

    if (!user || user.uid !== uid) {
      return {
        success: false,
        message: 'Unauthorized',
      }
    }

    // Update auth profile if name is provided
    if (updates.name) {
      await updateProfile(user, {
        displayName: updates.name,
      })
    }

    // Update Firestore document
    await updateDoc(doc(db, 'users', uid), {
      ...updates,
      updatedAt: new Date(),
    })

    return {
      success: true,
      message: 'Profile updated successfully',
    }
  } catch (error) {
    console.error('Update profile error:', error)
    return {
      success: false,
      message: error.message,
    }
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordReset(email) {
  try {
    await sendPasswordResetEmail(auth, email)
    return {
      success: true,
      message: 'Password reset email sent',
    }
  } catch (error) {
    console.error('Password reset error:', error)
    return {
      success: false,
      message: error.message,
    }
  }
}

/**
 * Confirm password reset
 */
export async function resetPassword(oobCode, newPassword) {
  try {
    await confirmPasswordReset(auth, oobCode, newPassword)
    return {
      success: true,
      message: 'Password reset successful',
    }
  } catch (error) {
    console.error('Confirm reset error:', error)
    return {
      success: false,
      message: error.message,
    }
  }
}

/**
 * Get user by ID
 */
export async function getUserById(uid) {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid))
    if (userDoc.exists()) {
      return userDoc.data()
    }
    return null
  } catch (error) {
    console.error('Get user error:', error)
    return null
  }
}

export default {
  registerUser,
  loginUser,
  logoutUser,
  onAuthChange,
  updateUserProfile,
  sendPasswordReset,
  resetPassword,
  getUserById,
}
