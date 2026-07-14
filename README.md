# District 228 Demo Meeting Booklet Manager

An enterprise SaaS-grade, complete frontend-only booklet management system designed for District 228 officers to organize, execute, and track Toastmasters corporate demo meetings.

---

## 🚀 Tech Stack
- **Framework**: React 18 & Vite
- **Styling**: Tailwind CSS v4 & custom Print CSS
- **Routing**: React Router DOM (v6)
- **Forms & Validation**: React Hook Form
- **Icons**: React Icons (Feather Icons)
- **State Management**: Context API & LocalStorage
- **PDF Export**: html2canvas & jsPDF
- **Date Handling**: date-fns
- **UID generation**: uuid

---

## 📂 Project Structure
```
src/
├── assets/             # Logo placeholders
├── components/         # Reusable widgets
│   ├── common/         # ConfirmDialog, Toast, PageSpinner
│   ├── forms/          # FormInput, FormCheckbox, FormTextarea
│   ├── layout/         # Header, Sidebar, Footer, AppLayout
│   ├── tables/         # Reusable DataTable with sorting/pagination/search
│   ├── dashboard/      # StatCards, UpcomingMeetings, RecentActivity
│   ├── booklet/        # Page-specific components
│   ├── tracker/        # Inline editing grid components
│   └── ui/             # Reusable core design components (Button, Modal, Badge, Card, ProgressRing)
├── constants/          # Action types, page lists, default data constants
├── context/            # BookletContext, ToastContext
├── data/               # Default booklet templates & mock seed lists
├── hooks/              # useLocalStorage, useUndo
├── pages/              # Pages 1-8, Dashboard, Settings, PrintView
├── routes/             # AppRouter configs
├── services/           # PDFGenerator, ExcelExporter (CSV)
├── styles/             # Stylesheet configuration overrides
└── utils/              # Calculation helpers, date formatters
```

---

## 🛠️ Installation & Getting Started

Follow these steps to run the application locally on your system:

### 1. Install Dependencies
Run the installation command to download all required packages:
```bash
npm install
```

### 2. Launch Local Development Server
Start the local Vite development server:
```bash
npm run dev
```

### 3. Open in Browser
Once started, the CLI will output the server URL. Open the link in your web browser:
```
http://localhost:5173/
```
---

## 📈 Verification Checklist
- **Autosave**: All inputs are saved on key-down to `localStorage` and automatically restored.
- **Undo / Redo Stack**: Revert unintended changes by clicking the Header controls or pressing `Ctrl+Z` / `Ctrl+Y`.
- **A4 PDF Exporter**: Export printable formats of meeting sheets or full booklets via `window.print()` PDF drivers.
- **Lead Tracker DataTable**: Search, filter, and sort Corporate Demo Leads in page 7 tracker grid. Export logs directly as a CSV sheet.
