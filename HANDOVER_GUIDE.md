# 📋 Complete Project Handover & Deployment Guide

This guide details the clean monorepo folder structure, official account credentials, security architecture, and exact post-update deployment instructions for any company or developer taking over the **District 227 Toastmasters Platform**.

---

## 🔐 Official Account Credentials & Password Security

### 🛡️ Bcrypt Password Hashing
All user passwords in the backend are automatically hashed using **`bcryptjs`** (salt factor 10) in `backend/models/User.js` and `backend/controllers/authController.js`. No raw passwords are stored in the database.

### 🔑 Pre-Configured Official Officer Accounts (Default Credentials)

| Username | Default Password | Officer Name | Assigned Role | Division / Area |
| :--- | :--- | :--- | :--- | :--- |
| `admin` | `password` | System Administrator | **District Main Administrator** | Div A / Area 01 |
| `nitasha` | `password` | Nitasha Kumar | **District Director** | Div A / Area 01 |
| `prashanth` | `password` | Prashanth K | **Club Growth Director** | Div B / Area 01 |
| `nagesh` | `password` | Nagesh Ramamurthy | **CGB Pillar Lead** | Div C / Area 01 |
| `pramod` | `password` | Pramod K | **DMO Task Force Lead** | Div D / Area 01 |

> [!IMPORTANT]
> **Post-Handover Security Requirement**: Upon taking over the project, log into each account and update default passwords via the **Account & Security** page (`/security`), or update the hashes directly in your live MongoDB collection using `bcrypt`.

---

## 📁 Monorepo Directory Structure

```text
tost/
├── frontend/           <-- 🎨 React Frontend UI & Responsive Layouts
│   ├── src/
│   │   ├── services/api.js   <-- Backend REST API URL Connection
│   │   ├── context/
│   │   │   └── BookletContext.jsx <-- Global State & Data Purge (v900)
│   │   ├── components/
│   │   └── ...
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/            <-- ⚙️ Express REST API & MongoDB Database
│   ├── config/db.js
│   ├── controllers/
│   │   └── authController.js <-- Bcrypt Login/Register Controllers
│   ├── models/
│   │   └── User.js           <-- Mongoose Schema with Bcrypt Pre-Save Hook
│   ├── routes/
│   ├── server.js
│   ├── package.json
│   └── .env            <-- Database & Environment Credentials
│
├── HANDOVER_GUIDE.md   <-- Project Handover Documentation
├── README.md           <-- Quick Start & Architecture Overview
└── package.json        <-- Monorepo Script Runner
```

---

## 🧹 Clean Production Workspace (Zero Dummy Data)

The platform is configured with a **100% clean production storage model (`d227_booklets_v900`)**:
* **Initial State**: Starts at **0 Completed Meetings**, **0 Meetings Today**, and **0 Upcoming Meetings**.
* **Automatic Storage Purging**: Legacy cached mock data from earlier developer versions (`d227_booklets_v200`, `v300`, `v500`) is automatically purged on startup.
* Officers create real meetings from scratch using the **Create New Meeting** button.

---

## 🛠️ Step-by-Step File Modifications for Company Takeover

### 1️⃣ Frontend Backend URL Connection

* **File Location**: `frontend/src/services/api.js`
* **Line Number**: Line 2
* **What to do**: Replace the fallback Render URL (`https://toast-815a.onrender.com/api`) with your production backend server URL.

```javascript
// File: frontend/src/services/api.js (Line 2)

// BEFORE (Developer Render URL):
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://toast-815a.onrender.com/api';

// AFTER (Company Production Backend URL):
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://YOUR-COMPANY-BACKEND.onrender.com/api';
```

---

### 2️⃣ Backend Database Connection (MongoDB Atlas)

* **File Location**: `backend/.env`
* **Line Number**: Line 3
* **What to do**: Replace the local MongoDB URI with your live MongoDB Atlas connection string.

```env
# File: backend/.env (Line 3)

# BEFORE:
MONGO_URI=mongodb://localhost:27017/district227_toastmasters

# AFTER (Company MongoDB Atlas URI):
MONGO_URI=mongodb+srv://<COMPANY_DB_USER>:<COMPANY_DB_PASSWORD>@cluster0.mongodb.net/district227_toastmasters?retryWrites=true&w=majority
```

---

### 3️⃣ Backend Environment & Security Settings

* **File Location**: `backend/.env`
* **Line Numbers**: Lines 1 - 4
* **What to do**: Set production mode and a secure JWT secret key.

```env
# File: backend/.env

PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://<COMPANY_USER>:<PASSWORD>@cluster0.mongodb.net/district227_toastmasters?retryWrites=true&w=majority
JWT_SECRET=your_company_secure_random_jwt_secret_key_2026
```

---

## 🚀 Post-Update Checklist (Action Items After Takeover)

Follow this checklist after taking over the repository:

- [ ] **Step 1**: Change all default passwords for officer accounts via `/security`.
- [ ] **Step 2**: Generate a unique random string for `JWT_SECRET` in `backend/.env`.
- [ ] **Step 3**: Connect backend to a production MongoDB Atlas database cluster.
- [ ] **Step 4**: Verify `VITE_API_URL` environment variable points to live backend.
- [ ] **Step 5**: Execute `npm run build` inside `frontend/` to confirm 0 build errors.
- [ ] **Step 6**: Deploy `backend/` to Render/AWS and `frontend/` to Vercel/Netlify.

---

## ☁️ Cloud Hosting Deployment Setup

### 🅰️ Hosting Backend Server (Render / AWS / DigitalOcean)

1. Create a **Web Service**.
2. Set Root Directory: `backend`
3. Build & Start Commands:
   * **Build Command**: `npm install`
   * **Start Command**: `npm start`
4. Set Environment Variables in host dashboard:

| Variable Name | Value | Purpose |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Enables production mode |
| `JWT_SECRET` | `<your_secure_key>` | Secret key for JWT auth |
| `MONGO_URI` | `mongodb+srv://...` | Cloud MongoDB cluster link |

---

### 🅱️ Hosting Frontend (Vercel / Netlify / Render Static Site)

1. Create a **Static Web App**.
2. Set Root Directory: `frontend`
3. Build Settings:
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
4. Set Environment Variable:

| Variable Name | Value | Purpose |
| :--- | :--- | :--- |
| `VITE_API_URL` | `https://your-company-backend.onrender.com/api` | Points frontend to live company API |

---

*Official handover guide for District 227 Toastmasters platform deployment.*
