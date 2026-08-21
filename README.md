# District 227 Toastmasters SaaS Platform

An enterprise SaaS-grade, full-stack meeting booklet management platform designed for District 227 Toastmasters officers to organize, execute, and track Toastmasters corporate meetings, booklets, and chartering progress.

---

## 🚀 Tech Stack

### 🎨 Frontend
- **Framework**: React 18 & Vite
- **Styling**: Tailwind CSS v4 & custom Print CSS
- **Routing**: React Router DOM (v6)
- **Icons**: React Icons (Feather Icons)
- **State Management**: Context API & LocalStorage (`d227_booklets_v900`)
- **PDF Export**: Custom Print Engine & html2canvas / jsPDF
- **Date Handling**: date-fns
- **UID Generation**: uuid

### ⚙️ Backend REST API & Database
- **Server**: Node.js & Express.js (ES Modules)
- **Database**: MongoDB & Mongoose ORM
- **Password Security**: `bcryptjs` salt hashing (factor 10)
- **Token Auth**: JSON Web Tokens (`jsonwebtoken`)
- **Deployment Health Check**: Live indicator in top header bar

---

## 🔐 Default Officer Credentials & Security

### 🛡️ Password Encryption
User passwords are automatically encrypted with **Bcrypt** (`bcryptjs`) before storing in the database.

### 🔑 Pre-Configured Accounts

| Username | Default Password | Officer Name | Assigned Role |
| :--- | :--- | :--- | :--- |
| `admin` | `password` | System Administrator | **District Main Administrator** |
| `nitasha` | `password` | Nitasha Kumar | **District Director** |
| `prashanth` | `password` | Prashanth K | **Club Growth Director** |
| `nagesh` | `password` | Nagesh Ramamurthy | **CGB Pillar Lead** |
| `pramod` | `password` | Pramod K | **DMO Task Force Lead** |

---

## 📂 Repository Structure

```text
tost/
├── frontend/           <-- 🎨 React Frontend Client
│   ├── src/
│   │   ├── services/api.js   <-- Backend REST API Connection
│   │   ├── context/BookletContext.jsx <-- Production Clean State (v900)
│   │   ├── components/
│   │   └── pages/
│   └── package.json
│
├── backend/            <-- ⚙️ Express API Server & Database
│   ├── models/User.js        <-- Mongoose Schema with Bcrypt Pre-Save Hook
│   ├── controllers/authController.js <-- Bcrypt Login/Register Controllers
│   ├── server.js
│   └── .env            <-- Database & Environment Credentials
│
├── HANDOVER_GUIDE.md   <-- Detailed Handover & Production Guide
└── package.json        <-- Monorepo Script Runner
```

---

## 🛠️ Installation & Getting Started

### 1️⃣ Run Frontend Client
```bash
cd frontend
npm install
npm run dev
```

### 2️⃣ Run Backend API Server
```bash
cd backend
npm install
npm start
```

---

## 📋 What to Do After All Updates (Post-Update Setup)

Upon completing setup or taking over deployment, perform the following action items:

1. **Change Default Passwords**: Log into each account and update passwords via `/security`.
2. **Configure Database**: Connect `backend/.env` to your production MongoDB Atlas cluster (`MONGO_URI`).
3. **Set Production JWT Secret**: Update `JWT_SECRET` in `backend/.env` with a random secret key.
4. **Point Frontend to Backend**: Update `VITE_API_URL` in `frontend/src/services/api.js` to point to your live backend server.
5. **Verify Build**: Run `npm run build` in `frontend/` to confirm zero compilation errors.
6. **Handover Reference**: Refer to `HANDOVER_GUIDE.md` for full step-by-step handover details.
