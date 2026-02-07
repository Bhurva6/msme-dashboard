# MSME Funding Platform

A modern web platform for MSME (Micro, Small, and Medium Enterprises) funding management.

## 🚀 Quick Start with Demo Account

Want to test the platform immediately? Use our demo account!

### Demo Credentials
- **Email:** `demo@msme.com`
- **Password:** `Demo@123`

Simply navigate to the login page, click "Use Demo Credentials" button, and you're in!

📖 [Read Full Demo Setup Guide](./DEMO_SETUP.md)

## 📁 Project Structure

```
msme-funding-platform/
├── backend/          # Node.js + Express backend
├── frontend/         # React + TypeScript frontend
├── database/         # Database migrations
├── DEMO_CREDENTIALS.md
└── DEMO_SETUP.md
```

## 🛠️ Installation

### Backend Setup
```bash
cd backend
npm install
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## ✨ Features

- 🔐 Secure authentication with JWT
- 📱 Phone OTP verification
- 📧 Email/Password login
- 👤 User profile management
- 🎯 Role-based access (Owner, Ops, Admin)
- 🧪 Demo account for quick testing

## 🧪 Testing

### Using Demo Account
1. Start both backend and frontend servers
2. Navigate to login page
3. Click "Use Demo Credentials" or manually enter:
   - Email: `demo@msme.com`
   - Password: `Demo@123`
4. Access the dashboard instantly!

### Creating Real Accounts
Follow the signup flow with phone OTP verification.

## 📚 Documentation

- [Demo Credentials Documentation](./DEMO_CREDENTIALS.md)
- [Demo Setup Guide](./DEMO_SETUP.md)
- [Backend Setup](./backend/SETUP_GUIDE.md)
- [Frontend README](./frontend/README.md)

## 🔧 Technologies

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Zustand (State Management)
- React Router
- Axios

### Backend
- Node.js
- Express
- TypeScript
- PostgreSQL
- JWT Authentication
- Bcrypt

## 🌐 Development URLs

- Frontend: `http://localhost:5173` (default Vite port)
- Backend: `http://localhost:3000` (or configured port)

## 🔒 Security Notes

⚠️ **The demo account is for development/testing only!**

Remove or secure the demo account logic before deploying to production:
- Remove demo bypass in `backend/src/controllers/auth.controller.ts`
- Remove demo credentials display in frontend
- Implement proper feature flags

## 📝 License

[Add your license here]

## 👥 Contributing

[Add contribution guidelines here]

## 📧 Contact

[Add contact information here]
