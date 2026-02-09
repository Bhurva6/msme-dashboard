# MSME Funding Platform - Deployment Notes

## 🎯 Current Deployment Status

### Frontend (Vercel) ✅
- **Status**: Deployed and Live
- **Repository**: https://github.com/Bhurva6/msme-dashboard
- **Branch**: main (auto-deploys on push)

### Backend (Not Deployed) ⏳
- **Status**: Local development only
- **Requires**: Backend deployment to cloud service

---

## 🔧 How Demo Credentials Work

### **With Backend API (Production)**
When backend is deployed:
1. User enters: `demo@msme.com` / `Demo@123`
2. Frontend sends POST to: `https://your-backend-api.com/api/v1/auth/login`
3. Backend validates credentials
4. Returns JWT token + user data
5. User logs in successfully

### **Without Backend API (Current - Mock Mode)** ✅
The app now works **without a backend** using mock data:
1. User enters: `demo@msme.com` / `Demo@123`
2. Frontend checks if these are demo credentials
3. **Creates mock user data locally** (no API call)
4. Stores mock token in localStorage
5. User logs in successfully and can explore the full UI

---

## 🚀 What Works Now (Frontend-Only)

✅ **Login**: Demo credentials work with mock authentication  
✅ **Dashboard**: Business profile view with mock data  
✅ **Business Setup**: Form to create business profile  
✅ **Document Upload**: UI for uploading documents (files stored locally)  
✅ **Director Management**: Add/edit directors  
✅ **Funding Options**: View available funding (unlocked at 70%+ completion)  
✅ **Progress Tracking**: Visual completion percentage  

---

## 🔒 How to Fix the "ERR_CONNECTION_REFUSED" Error

### **The Problem**
When deployed on Vercel, your frontend tried to connect to:
```
http://localhost:5000/api/v1/auth/login
```

This URL only exists on **your local machine**, not on Vercel's servers!

### **The Solution (Already Implemented)** ✅
The login form now checks if you're using demo credentials **BEFORE** making an API call:

```typescript
// If demo credentials, use mock login (no API needed)
if (data.email === 'demo@msme.com' && data.password === 'Demo@123') {
  const mockUser = { /* ... */ };
  login(mockToken, mockUser);
  navigate('/dashboard');
  return; // Skip API call
}

// Otherwise try real API (will fail if backend not deployed)
const response = await axiosInstance.post('/auth/login', data);
```

---

## 📝 Next Steps (Optional - Backend Deployment)

If you want **real authentication** with a database:

### Option 1: Deploy Backend to Railway (Easiest)
```bash
# 1. Install Railway CLI
npm install -g railway

# 2. Login to Railway
railway login

# 3. Deploy backend
cd backend
railway init
railway up

# 4. Add environment variables in Railway dashboard:
# - DATABASE_URL
# - JWT_SECRET
# - SMS_API_KEY (for OTP)

# 5. Get your backend URL (e.g., https://your-app.railway.app)
```

### Option 2: Deploy to Heroku, Render, or AWS

### Option 3: Keep Using Mock Data (No Backend Needed)
Your app is **fully functional** with mock data for demos and testing!

---

## 🎨 Environment Variables

### Frontend (Vercel)
Set this in Vercel dashboard under "Environment Variables":

```bash
VITE_API_URL=https://your-backend-api.com/api/v1
```

**Current Default**: `http://localhost:5000/api/v1` (works for local development)

### Backend (When Deployed)
```bash
DATABASE_URL=mysql://user:pass@host:3306/msme_db
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
SMS_API_KEY=your-sms-provider-key
SMS_SENDER_ID=MSME
```

---

## 🧪 Testing Your Deployment

### Test Demo Login
1. Visit: `https://your-vercel-app.vercel.app`
2. Click "Login"
3. Use demo credentials:
   - Email: `demo@msme.com`
   - Password: `Demo@123`
4. Should login successfully ✅

### Test Real Login (After Backend Deployed)
1. Create real user via Signup
2. Verify OTP
3. Login with real credentials

---

## 📊 Mock Data Details

The app uses realistic mock data for:
- **Business Profile**: Pre-filled with sample MSME data
- **Documents**: 2 sample documents (Balance Sheet, P&L)
- **Directors**: Mock director information
- **Completion**: Shows 40% profile completion
- **Funding**: Requires 70%+ to unlock

---

## 🐛 Troubleshooting

### Issue: "Network Error" on login
**Solution**: Use demo credentials (`demo@msme.com` / `Demo@123`)  
**Reason**: Backend API not deployed yet

### Issue: Changes not showing on Vercel
**Solution**: 
```bash
git add -A
git commit -m "Your changes"
git push origin main
```
Wait 2-3 minutes for Vercel to rebuild.

### Issue: Can't see new features
**Solution**: Hard refresh browser (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)

---

## 📞 Support

For backend deployment help or questions:
1. Check Railway docs: https://docs.railway.app
2. Check Vercel docs: https://vercel.com/docs
3. Review backend setup guide: `backend/SETUP_GUIDE.md`

---

**Last Updated**: February 7, 2026  
**Version**: 1.0.0 (Frontend-Only with Mock Authentication)
