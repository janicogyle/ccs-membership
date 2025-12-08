// Script to create admin user in Firebase
const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword, updateProfile } = require('firebase/auth');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBnJ95B_KXitkjTXZYF-9630MG-Xh8z3lk",
  authDomain: "ccs-membership-6dbc9.firebaseapp.com",
  projectId: "ccs-membership-6dbc9",
  storageBucket: "ccs-membership-6dbc9.firebasestorage.app",
  messagingSenderId: "177386511662",
  appId: "1:177386511662:web:3522a2f4d33b7d84932ebf",
  measurementId: "G-581Q3NXJ95"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function createAdminUser() {
  try {
    console.log('Creating admin user...');
    
    // Admin credentials
    const email = 'admin@gmail.com';
    const password = 'Admin123';
    const displayName = 'System Administrator';

    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log('User created in Firebase Auth:', user.uid);

    // Update profile with display name
    await updateProfile(user, {
      displayName: displayName,
    });

    console.log('Profile updated with display name');

    // Store user data in Firestore with admin privileges
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      name: displayName,
      firstName: 'System',
      lastName: 'Administrator',
      isAdmin: true, // Set as admin
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log('✅ Admin user created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('You can now login with these credentials');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    process.exit(1);
  }
}

createAdminUser();
