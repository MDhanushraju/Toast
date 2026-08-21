# 📋 Complete Project Handover & Deployment Guide

This guide details the clean monorepo folder structure, exact file locations, and line-by-line configuration for any company or developer taking over the **District 227 Toastmasters Platform**.

---

## 📁 Repository Directory Structure

```text
tost/
├── frontend/           <-- 🎨 All Frontend React Code & Assets
│   ├── src/
│   │   ├── services/api.js   <-- Backend URL Configuration
│   │   ├── context/
│   │   ├── components/
│   │   └── ...
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/            <-- ⚙️ All Backend Express API & Database Code
│   ├── config/db.js
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── package.json
│   └── .env            <-- Database & Environment Credentials
│
├── HANDOVER_GUIDE.md   <-- Handover Documentation
└── package.json        <-- Monorepo Root Script Runner
```

---

## 🛠️ Step-by-Step File Modifications for Company Takeover

### 1️⃣ Frontend Backend URL Connection

* **File Location**: `frontend/src/services/api.js`
* **Line Number**: Line 2
* **What to do**: Replace the fallback Render URL (`https://toast-815a.onrender.com/api`) with the company's backend server URL.

```javascript
// File: frontend/src/services/api.js (Line 2)

// BEFORE (Developer Render URL):
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://toast-815a.onrender.com/api';

// AFTER (Company Backend URL):
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://YOUR-COMPANY-BACKEND.onrender.com/api';
```

*(Alternatively, without editing any code, set the environment variable `VITE_API_URL` in your hosting platform).*

---

### 2️⃣ Backend Database Connection (MongoDB Atlas)

* **File Location**: `backend/.env`
* **Line Number**: Line 3
* **What to do**: Replace the developer MongoDB URI with the company's live MongoDB connection string.

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
* **What to do**: Set production mode and secure JWT secret key.

```env
# File: backend/.env

PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://<COMPANY_USER>:<PASSWORD>@cluster0.mongodb.net/district227_toastmasters?retryWrites=true&w=majority
JWT_SECRET=your_company_secure_random_jwt_secret_key_2026
```

---

## ☁️ Cloud Hosting Deployment Setup

### 🅰️ Hosting Backend Server (Render / AWS / DigitalOcean / Railway)

1. Create a **Web Service**.
2. Set Root Directory: `backend`
3. Set Build & Start Commands:
   * **Build Command**: `npm install`
   * **Start Command**: `npm start`
4. Add Environment Variables in host dashboard:

| Variable Name | Value | Purpose |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Enables production mode |
| `JWT_SECRET` | `<your_secure_key>` | Secret key for JWT auth |
| `MONGO_URI` | `mongodb+srv://...` | Cloud MongoDB cluster link |

---

### 🅱️ Hosting Frontend (Vercel / Netlify / Render Static Site / Cloudflare)

1. Create a **Static Web App**.
2. Set Root Directory: `frontend`
3. Set Build Commands:
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
4. Add Environment Variable:

| Variable Name | Value | Purpose |
| :--- | :--- | :--- |
| `VITE_API_URL` | `https://your-company-backend.onrender.com/api` | Points frontend to live company API |

---

## 📁 Key File Map Reference

| Module | File Path | Function |
| :--- | :--- | :--- |
| **API Client** | `frontend/src/services/api.js` | Connects frontend to backend URL |
| **Header Status** | `frontend/src/components/layout/Header.jsx` | Renders live backend status indicator |
| **Global State** | `frontend/src/context/BookletContext.jsx` | Manages app state and backend health check |
| **Frontend Package** | `frontend/package.json` | Frontend dependencies & build script |
| **Server Main** | `backend/server.js` | Express API REST Server entry point |
| **Database Connection** | `backend/config/db.js` | Mongoose MongoDB connection |
| **Backend Config** | `backend/.env` | Backend Environment Variables |

---
*Official handover guide for project takeover and production deployment.*
