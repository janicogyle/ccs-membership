#!/usr/bin/env node

/**
 * Seed script to populate MongoDB with sample data
 * Usage: node scripts/seed.js
 */

require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'ccs_membership';

async function seed() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db(MONGODB_DB);

    console.log('🌱 Starting seed process...');

    // Clear existing data
    await db.collection('users').deleteMany({});
    await db.collection('students').deleteMany({});
    console.log('✓ Cleared existing data');

    // Seed users
    const hashedPassword = await bcrypt.hash('password123', 10);
    const users = [
      {
        name: 'Admin User',
        email: 'admin@ccs.edu',
        password: hashedPassword,
        isAdmin: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'John Smith',
        email: 'john@ccs.edu',
        password: hashedPassword,
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Jane Doe',
        email: 'jane@ccs.edu',
        password: hashedPassword,
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const usersResult = await db.collection('users').insertMany(users);
    console.log(`✓ Inserted ${usersResult.insertedCount} users`);

    // Seed students
    const students = [
      {
        name: 'Alice Johnson',
        email: 'alice.johnson@student.edu',
        major: 'Computer Science',
        gpa: 3.9,
        enrollmentYear: 2022,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Bob Williams',
        email: 'bob.williams@student.edu',
        major: 'Computer Science',
        gpa: 3.7,
        enrollmentYear: 2021,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Carol Davis',
        email: 'carol.davis@student.edu',
        major: 'Computer Science',
        gpa: 3.85,
        enrollmentYear: 2023,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'David Martinez',
        email: 'david.martinez@student.edu',
        major: 'Software Engineering',
        gpa: 3.6,
        enrollmentYear: 2022,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Emma Wilson',
        email: 'emma.wilson@student.edu',
        major: 'Information Technology',
        gpa: 3.95,
        enrollmentYear: 2023,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Frank Brown',
        email: 'frank.brown@student.edu',
        major: 'Data Science',
        gpa: 3.75,
        enrollmentYear: 2021,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Grace Lee',
        email: 'grace.lee@student.edu',
        major: 'Computer Science',
        gpa: 4.0,
        enrollmentYear: 2023,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Henry Taylor',
        email: 'henry.taylor@student.edu',
        major: 'Software Engineering',
        gpa: 3.8,
        enrollmentYear: 2022,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const studentsResult = await db.collection('students').insertMany(students);
    console.log(`✓ Inserted ${studentsResult.insertedCount} students`);

    // Create indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('students').createIndex({ email: 1 }, { unique: true });
    console.log('✓ Created database indexes');

    console.log('\n✅ Seed process completed successfully!');
    console.log('\n📝 Test Credentials:');
    console.log('  Email: admin@ccs.edu');
    console.log('  Password: password123');
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seed();
