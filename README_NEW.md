# 🏢 MSME Funding Platform

> A complete end-to-end platform for Micro, Small, and Medium Enterprises (MSMEs) to manage business profiles, upload documents, track completion, and access funding opportunities.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-61dafb)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🎯 **Live Demo**

**Demo Credentials:**
- Email: `demo@msme.com`
- Password: `Demo@123`

**Try it out at:** `http://localhost:5173` (after setup)

---

## ✨ **Key Features**

### 🔐 **Authentication**
- OTP-based phone verification
- JWT token authentication
- Demo login for quick testing
- Protected routes

### 🏢 **Business Profile Management**
- Complete business information (PAN, GSTIN, UDYAM)
- Entity type selection (Sole Proprietorship, Partnership, Private Limited, etc.)
- Address and contact details
- Year of establishment validation
- **Profile Completion Tracking (0-100%)**

### 📄 **Document Management**
- Upload up to 10MB files (PDF, JPG, PNG)
- 5 Document Categories:
  - Balance Sheet & P&L Statements (20%)
  - Sanction Letters (20%)
  - Business Profile Documents (10%)
  - Director KYC (20%)
  - Director ITR (20%)
- Document verification status
- Download and delete functionality
- Drag-and-drop upload

### 👥 **Director Management**
- Add multiple directors/owners
- PAN and Aadhaar validation
- KYC completion tracking
- Designation management
- Contact information

### 💰 **Funding Utilities**
- **70% Profile Completion Gate** (access control)
- **4 Funding Types:**
  1. **Term Loan** - Amount, tenure, interest rate, security
  2. **Working Capital** - Revolving credit with frequency
  3. **Asset Finance** - Equipment/machinery financing
  4. **Government Scheme Loans** - Interest subsidy programs
- Draft → Submit → Review → Approve/Reject workflow
- Filter by status
- Batch submission
- INR currency formatting

### 📊 **Progress Tracking**
- Real-time completion percentage (0-100%)
- 6-category breakdown with weights
- Color-coded progress bars (red < 40%, yellow 40-70%, green 70%+)
- Next steps recommendations
- "Bank-ready" status at 70%+

---

## 🏗️ **Tech Stack**

### **Frontend**
- **Framework:** React 18.2 + TypeScript 5.2
- **Build Tool:** Vite 5.0
- **Styling:** Tailwind CSS 3.3
- **State Management:** Zustand 4.4 (with localStorage persistence)
- **Forms:** React Hook Form 7.49
- **HTTP Client:** Axios 1.6
- **Icons:** Lucide React 0.294
- **Routing:** React Router DOM 6.20

### **Backend**
- **Runtime:** Node.js 20+
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MySQL 8.0 (MySQL2 driver)
- **Authentication:** JWT + Bcrypt
- **File Upload:** Multer
- **OTP:** Custom generator with 6-digit codes

### **Database**
- **RDBMS:** MySQL 8.0
- **Tables:** 7 (users, businesses, document_groups, documents, directors, funding_utilities)
- **Migrations:** Auto-run with Docker
- **Relationships:** Foreign keys with CASCADE deletes

### **DevOps**
- **Containerization:** Docker + Docker Compose
- **Version Control:** Git + GitHub
- **Package Manager:** npm

---

## 📁 **Project Structure**

```
msme-funding-platform/
├── backend/               # Node.js + Express API
│   ├── src/
│   │   ├── controllers/   # Request handlers (5 controllers)
│   │   ├── models/        # Database models (6 models)
│   │   ├── routes/        # API routes (5 route files)
│   │   ├── services/      # Business logic (3 services)
│   │   ├── middleware/    # Auth, validation, error handling
│   │   ├── config/        # Database & environment config
│   │   └── utils/         # Helpers (OTP, validators)
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/              # React + TypeScript UI
│   ├── src/
│   │   ├── components/    # Reusable components (18 components)
│   │   │   ├── auth/      # Login, Signup, OTP forms
│   │   │   ├── business/  # Business forms & displays (7)
│   │   │   └── common/    # Button, Input, Toast, Navbar
│   │   ├── pages/         # Route pages (7 pages)
│   │   │   ├── auth/      # Auth pages
│   │   │   ├── business/  # Setup page
│   │   │   ├── dashboard/ # Profile & main dashboard
│   │   │   └── funding/   # Funding options page
│   │   ├── hooks/         # Custom hooks (2: useBusiness, useFileUpload)
│   │   ├── store/         # Zustand stores (2: auth, business)
│   │   ├── api/           # API service layer (15 endpoints)
│   │   ├── types/         # TypeScript definitions
│   │   └── utils/         # Formatters & validators
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── database/
│   └── migrations/        # SQL schema files (2 migrations)
│
├── docker-compose.yml     # MySQL container config
├── setup-docker.sh        # Automated Docker setup
└── README.md              # This file
```

---

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 20+ ([Download](https://nodejs.org/))
- Docker Desktop ([Download](https://www.docker.com/products/docker-desktop/))
- Git

### **1. Clone the Repository**
```bash
git clone https://github.com/Bhurva6/msme-dashboard.git
cd msme-dashboard
```

### **2. Frontend Setup (Test with Mock Data)**
```bash
cd frontend
npm install
npm run dev
```
🌐 Open: `http://localhost:5173`
🔑 Login: `demo@msme.com` / `Demo@123`

✅ **Frontend works standalone with mock data!**

### **3. Backend Setup (Optional - for Full Integration)**

#### **Step 3a: Start Database with Docker**
```bash
# From project root
./setup-docker.sh

# Or manually:
docker-compose up -d
```
Wait 30 seconds for MySQL initialization.

#### **Step 3b: Install Backend Dependencies**
```bash
cd backend
npm install
```

#### **Step 3c: Configure Environment**
```bash
# Copy example env file
cp .env.example .env

# Edit .env with your settings:
DB_HOST=localhost
DB_PORT=3306
DB_USER=msme_user
DB_PASSWORD=msme_password
DB_NAME=msme_funding
JWT_SECRET=your-super-secret-jwt-key-change-this
PORT=5000
```

#### **Step 3d: Start Backend Server**
```bash
npm run dev
```
🚀 Backend running at: `http://localhost:5000`

---

## 📖 **Usage Guide**

### **Complete User Flow**

#### **1. Authentication**
- Navigate to `/login`
- Enter: `demo@msme.com` / `Demo@123`
- Auto-redirected to `/business/setup`

#### **2. Business Setup**
- Fill business basics form (legal name, PAN, GSTIN, etc.)
- Submit → Saved to localStorage
- Redirected to `/dashboard`

#### **3. Main Dashboard** (`/dashboard`)
- **Progress Bar** shows 0-100% completion
- **3 Tabs:**
  - **Business Info:** Edit profile inline
  - **Documents:** Upload files by category
  - **Directors:** Add/edit/delete directors
- **Explore Funding Button:** Appears when 70%+ complete

#### **4. Funding Options** (`/funding`)
- **Access Gate:** Requires 70% profile completion
- **Create Funding Requests:**
  - Select type (Term Loan, Working Capital, etc.)
  - Fill type-specific fields
  - Save as draft or submit
- **Manage Requests:**
  - Filter by status
  - Edit drafts
  - Delete drafts
  - Submit all drafts (batch)

---

## 📊 **Profile Completion Algorithm**

```
Total = 100%

Business Info (10%):
  - Legal name, entity type, PAN, sector, etc.

Financial Documents (20%):
  - Balance Sheet & P&L Statements (3+ docs = complete)

Sanction Letters (20%):
  - Bank sanction letters (3+ docs = complete)

Business Profile (10%):
  - Business description documents (3+ docs = complete)

Director KYC (20%):
  - All directors have PAN, Aadhaar, DOB

Director ITR (20%):
  - Income Tax Returns for all directors (3+ docs = complete)

✅ Funding Access: ≥70% completion required
```

---

## 🔌 **API Endpoints**

### **Authentication**
- `POST /api/v1/auth/signup` - Register new user
- `POST /api/v1/auth/send-otp` - Send OTP to phone
- `POST /api/v1/auth/verify-otp` - Verify OTP & login
- `POST /api/v1/auth/login` - Direct login (demo)

### **Business**
- `POST /api/v1/businesses` - Create business profile
- `GET /api/v1/businesses/my-business` - Get my business
- `PUT /api/v1/businesses/:id` - Update business
- `GET /api/v1/businesses/:id/completion` - Get completion breakdown

### **Documents**
- `POST /api/v1/documents` - Upload document (multipart/form-data)
- `GET /api/v1/documents` - Get all documents
- `GET /api/v1/documents/:id/download` - Download document
- `DELETE /api/v1/documents/:id` - Delete document

### **Directors**
- `POST /api/v1/directors` - Add director
- `GET /api/v1/directors` - Get all directors
- `PUT /api/v1/directors/:id` - Update director
- `DELETE /api/v1/directors/:id` - Delete director

### **Funding Utilities**
- `POST /api/v1/funding-utilities` - Create funding request
- `GET /api/v1/funding-utilities` - Get all utilities
- `PUT /api/v1/funding-utilities/:id` - Update utility
- `DELETE /api/v1/funding-utilities/:id` - Delete utility
- `POST /api/v1/funding-utilities/submit` - Submit drafts (batch)

---

## 🧪 **Testing**

### **Frontend Testing (No Backend Required)**
1. Start frontend: `cd frontend && npm run dev`
2. Login with demo credentials
3. All features work with mock data from localStorage
4. Test complete user flow

### **Full Integration Testing**
1. Start Docker + Backend (see Quick Start)
2. Use REST client (Thunder Client, Postman, etc.)
3. Test file uploads (10MB max, PDF/JPG/PNG)
4. Verify profile completion calculations
5. Test 70% funding gate

---

## 🐳 **Docker Commands**

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Remove data volumes (reset database)
docker-compose down -v

# Restart services
docker-compose restart

# Check MySQL status
docker-compose exec mysql mysql -u msme_user -pmsme_password -e "SHOW DATABASES;"
```

---

## 🛠️ **Development**

### **Run Frontend Dev Server**
```bash
cd frontend
npm run dev
```
Hot reload enabled at `http://localhost:5173`

### **Run Backend Dev Server**
```bash
cd backend
npm run dev
```
Auto-restart with nodemon at `http://localhost:5000`

### **Build for Production**
```bash
# Frontend
cd frontend
npm run build
# Output: frontend/dist/

# Backend
cd backend
npm run build
# Output: backend/dist/
```

---

## 📝 **Environment Variables**

### **Backend (.env)**
```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=msme_user
DB_PASSWORD=msme_password
DB_NAME=msme_funding

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server
PORT=5000
NODE_ENV=development

# File Storage
LOCAL_STORAGE_PATH=./uploads
MAX_FILE_SIZE=10485760

# SMS (Optional - for OTP)
SMS_API_KEY=your-sms-provider-api-key
```

### **Frontend (.env)**
```env
VITE_API_BASE_URL=http://localhost:5000
```

---

## 📚 **Documentation**

- **[QUICKSTART.md](./QUICKSTART.md)** - Get started in 5 minutes
- **[FRONTEND_COMPLETE.md](./FRONTEND_COMPLETE.md)** - Frontend architecture & components
- **[DATABASE_SETUP.md](./DATABASE_SETUP.md)** - Database schema details
- **[DOCKER_SETUP_COMPLETE.md](./DOCKER_SETUP_COMPLETE.md)** - Docker configuration guide
- **[DEMO_CREDENTIALS.md](./DEMO_CREDENTIALS.md)** - Demo account information
- **[backend/AUTH_README.md](./backend/AUTH_README.md)** - Authentication flow
- **[backend/SETUP_GUIDE.md](./backend/SETUP_GUIDE.md)** - Backend setup

---

## 🎨 **Screenshots**

### Login Page
- Demo credentials banner
- OTP-based authentication

### Business Setup
- Wizard with progress steps
- Form validation

### Dashboard
- Progress bar with 6-category breakdown
- Tabbed interface (Business, Documents, Directors)
- File upload with drag & drop

### Funding Options
- 70% completion gate
- Stats cards (Total Requested, Drafts, Active)
- Funding utility cards with status badges
- Type-specific form fields

---

## 🤝 **Contributing**

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 **Author**

**Bhurva Sharma**
- GitHub: [@Bhurva6](https://github.com/Bhurva6)
- Repository: [msme-dashboard](https://github.com/Bhurva6/msme-dashboard)

---

## 🙏 **Acknowledgments**

- React Team for amazing framework
- Tailwind CSS for utility-first styling
- Zustand for simple state management
- Lucide for beautiful icons
- MySQL team for reliable database

---

## 📊 **Project Stats**

- **Lines of Code:** 20,000+
- **Files Created:** 104
- **Components:** 18
- **API Endpoints:** 20+
- **Database Tables:** 7
- **Documentation Files:** 9

---

## 🔮 **Roadmap**

- [ ] Add unit tests (Jest + React Testing Library)
- [ ] Implement S3 file storage
- [ ] Add email notifications
- [ ] Create admin dashboard
- [ ] Add analytics dashboard
- [ ] Implement WebSocket for real-time updates
- [ ] Add PDF report generation
- [ ] Multi-language support
- [ ] Mobile app (React Native)

---

## 🐛 **Known Issues**

- TypeScript warnings for field name mismatches (non-blocking)
- ESLint warnings for unused imports (false positives)

---

## 💬 **Support**

For questions or issues, please:
1. Check existing documentation
2. Search [Issues](https://github.com/Bhurva6/msme-dashboard/issues)
3. Create a new issue with details

---

**⭐ If you find this project helpful, please give it a star!**

---

Made with ❤️ for MSMEs
