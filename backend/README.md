# KaushalSetu Backend — Developer & Teammate Guide
**Problem Statement:** Smart India Hackathon 2026 (SIH26044)  
**Stack:** Node.js, Express, MongoDB (Mongoose), JWT Authentication

---

## 🚀 Quick Start for Teammate

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default values:
- `PORT=5000`
- `MONGO_URI=mongodb://127.0.0.1:27017/kaushalsetu`
- `JWT_SECRET=your_jwt_secret`

### 3. Start the Server
```bash
# Production mode
npm start

# Development mode (auto-reload with nodemon)
npm run dev
```

---

## 📂 Architecture Overview

```
backend/
├── config/
│   └── db.js                 # MongoDB connection & error logging
├── models/
│   ├── User.js               # Auth & RBAC (student, spoc, recruiter, ministry)
│   ├── StudentProfile.js     # Academics, skills, case logs, APAAR ID, DigiLocker
│   ├── JobPosting.js         # Weighted requirements (w1, w2, w3, w4), eligibility
│   ├── SkillTaxonomy.js      # Canonical dictionary, synonyms, SWAYAM/NPTEL links
│   └── Application.js        # Student applications, match scores, gap reports
├── controllers/              # ⭐️ EVERY FUNCTION HAS A STEP-BY-STEP SPECIFICATION!
│   ├── authController.js     # registerUser, loginUser, getCurrentUser
│   ├── studentController.js  # getProfile, updateProfile, uploadResumeNLP, applyToJob
│   ├── jobController.js      # getAllJobs, getJobById, createJob, getJobApplicants
│   ├── matchingController.js # 4-factor matching algorithm & candidate ranking
│   ├── spocController.js     # cohort roster, endorseSkill, curriculumGapRadar
│   ├── recruiterController.js# updateStatus, rejectWithFeedback, getAnalytics
│   └── seedController.js     # getDatabaseStatus, seedDatabaseIfEmpty, resetDatabase
├── routes/                   # Clean Express router endpoints
└── middleware/
    ├── authMiddleware.js     # protect (JWT verification), requireRole (RBAC)
    └── errorHandler.js       # Standardized JSON error response
```

---

## 🛠️ How Functions Are Structured for You

Every controller function has a dedicated block right above it explaining:
1. **WHAT IT NEEDS TO DO** (Business logic step-by-step)
2. **HTTP METHOD & ROUTE**
3. **REQUIRED INPUTS** (`req.body`, `req.params`, `req.query`, `req.user`)
4. **DATABASE OPERATIONS** (Which Mongoose model to query/update)
5. **EXPECTED RESPONSE FORMAT**

Working stubs and logic are already written so you can test endpoints with Postman/Thunder Client immediately!

---

## 🌱 Conditional Seeding Rule
The seeder is configured to run **only when the database is empty**:
- `GET /api/seed/status` $\rightarrow$ returns `{ hasData: boolean }`.
- `POST /api/seed` $\rightarrow$ checks `countDocuments()`. If data already exists, it skips seeding so your live data is never overwritten.
- `POST /api/seed/reset` $\rightarrow$ clears and re-seeds (handy before live judge demos).
