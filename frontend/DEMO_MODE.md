# 🎮 Demo Mode - Quick Start Guide

## Getting Started Without OTP

Since the backend API is not running, we've implemented **Demo Mode** to let you explore the full application!

### 🚀 Method 1: One-Click Demo (Signup Page)

1. Go to the **Signup Page** (`/signup`)
2. Click on the big blue button: **"🚀 Try Demo Mode"**
3. You'll be instantly logged in and redirected to the onboarding flow!

**No form filling required!** Just one click and you're in.

---

### 📝 Method 2: Demo Credentials (Login Page)

If you're on the login page, use these credentials:

```
Email: demo@msme.com
Password: Demo@123
```

You can also click the **"Use Demo Credentials →"** button to auto-fill the form.

---

## What You Can Do in Demo Mode

✅ **Language Selection**: Choose English, Hindi, or Marathi  
✅ **Onboarding Flow**: Experience the complete onboarding journey  
✅ **Scheme Selection**: Browse government schemes with match percentages  
✅ **Questions**: Answer 5 MCQs about your business  
✅ **Full Navigation**: Access all pages and features  

---

## Demo User Details

When you use demo mode, you're logged in as:

- **Name**: Demo User
- **Email**: demo@msme.com
- **Phone**: 9876543210
- **User ID**: demo-123

---

## Features You Can Test

### 1. **Language Switching** 🌐
- Select language at signup
- Watch the beautiful loading animation
- See entire UI translate to your chosen language

### 2. **Onboarding Journey** 🎯
Choose between:
- **"I Know About Government Schemes"** → Browse all schemes directly
- **"I Don't Know - Help Me"** → Answer questions for personalized matching

### 3. **Government Schemes** 📋
- View 6 different government schemes
- See match percentages (75-95%)
- Click cards for detailed information
- Select schemes you're interested in

### 4. **MCQ Questions** ❓
Answer 5 questions about:
- Business type
- Annual turnover  
- Number of employees
- Funding requirements
- Business ownership category

---

## Technical Notes

### How Demo Mode Works

**Signup Demo Mode:**
```typescript
// Bypasses OTP verification
// Creates a mock user session
// Directly navigates to /onboarding
```

**Login Demo Mode:**
```typescript
// Checks for demo credentials
// Creates mock JWT token
// Stores in authStore
// Redirects to dashboard
```

### Data Persistence

- Language preference is saved in `localStorage`
- User session is managed by Zustand store
- All scheme data is frontend dummy data (no backend calls)

---

## Troubleshooting

**Q: I clicked signup but nothing happened?**  
A: Use the "🚀 Try Demo Mode" button instead of filling the form

**Q: Do I need to enter real phone number?**  
A: No! Demo mode skips all verification

**Q: Can I test OTP verification?**  
A: Not without backend. Demo mode bypasses it entirely

**Q: Will my data be saved?**  
A: No, it's all in-memory. Refresh = fresh start

---

## Backend Integration (Future)

When backend is available, the app will:
- Send real OTPs via SMS
- Store user data in database
- Fetch actual government schemes
- Calculate real match percentages based on answers

But for now, enjoy the **fully functional frontend demo**! 🎉

---

## Quick Links

- **Signup**: `/signup` → Click "Try Demo Mode"
- **Login**: `/login` → Use demo@msme.com / Demo@123
- **Onboarding**: `/onboarding` (after demo login)
- **Questions**: `/onboarding/questions`
- **Schemes**: `/onboarding/schemes`

---

**Happy Testing! 🚀**
