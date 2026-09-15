import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { StudentProfile } from '../models/StudentProfile.js';
import { JobPosting } from '../models/JobPosting.js';
import { SkillTaxonomy } from '../models/SkillTaxonomy.js';
import { Application } from '../models/Application.js';
import { seedTaxonomy, seedStudents, seedJobs, seedUsers } from '../data/seedData.js';

dotenv.config();

async function runSeed() {
  console.log('🌱 Checking database status before seeding...');
  const isConnected = await connectDB();
  if (!isConnected) {
    console.error('❌ Cannot run standalone seeder without MongoDB connection.');
    process.exit(1);
  }

  try {
    const studentCount = await StudentProfile.countDocuments();
    const jobCount = await JobPosting.countDocuments();

    if (studentCount > 0 || jobCount > 0) {
      console.log(`ℹ️ Database already contains ${studentCount} students and ${jobCount} jobs.`);
      console.log('   Skipping seeding to prevent overwriting live records.');
      process.exit(0);
    }

    console.log('📦 Database is empty. Seeding initial records...');
    await User.insertMany(seedUsers);
    await SkillTaxonomy.insertMany(seedTaxonomy);
    await StudentProfile.insertMany(seedStudents);
    await JobPosting.insertMany(seedJobs);

    console.log('✅ Database seeded successfully!');
    console.log(`   • ${seedUsers.length} Users inserted (shiv@123 / 123)`);
    console.log(`   • ${seedTaxonomy.length} Skills inserted`);
    console.log(`   • ${seedStudents.length} Student profiles inserted`);
    console.log(`   • ${seedJobs.length} Job postings inserted`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
}

runSeed();
