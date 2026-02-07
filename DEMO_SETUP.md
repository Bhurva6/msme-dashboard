# Quick Start Guide - Demo Account Setup

This guide will help you set up and use the demo credentials feature for testing.

## What Was Added

### 1. Frontend Changes

#### New Component: `DemoCredentials.tsx`
Location: `frontend/src/components/auth/DemoCredentials.tsx`

A blue information banner that displays:
- Demo email: `demo@msme.com`
- Demo password: `Demo@123`
- A clickable button to auto-fill the login form

#### Updated: `LoginForm.tsx`
Location: `frontend/src/components/auth/LoginForm.tsx`

Added:
- Import for `DemoCredentials` component
- `useDemoAccount()` function to auto-fill form fields
- `DemoCredentials` component rendered at the top of the form

### 2. Backend Changes

#### Updated: `auth.controller.ts`
Location: `backend/src/controllers/auth.controller.ts`

Added demo account bypass in `loginWithEmail()` function:
- Checks if credentials match demo account
- Returns hardcoded demo user data with JWT token
- No database lookup required for demo account

### 3. Documentation

#### New Files:
- `DEMO_CREDENTIALS.md` - Complete documentation of demo credentials
- `DEMO_SETUP.md` - This setup guide

## How to Test

### Start the Application

1. **Start Backend:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Start Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### Test the Demo Login

1. Open your browser and navigate to the login page
2. You should see a blue banner at the top with demo credentials
3. Click "Use Demo Credentials →" button to auto-fill the form
4. Click "Login" button
5. You should be redirected to the dashboard as "Demo User"

### Manual Testing

Alternatively, you can manually enter:
- Email: `demo@msme.com`
- Password: `Demo@123`

## Visual Preview

When you open the login page, you'll see:

```
┌─────────────────────────────────────────┐
│  ℹ️  Demo Account                       │
│                                         │
│  Email: demo@msme.com                   │
│  Password: Demo@123                     │
│                                         │
│  Use Demo Credentials →                 │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│  Email                                  │
│  [                                  ]   │
│                                         │
│  Password                              │
│  [                                  ]   │
│                                         │
│  [Remember me]  Forgot Password?        │
│                                         │
│  [        Login         ]              │
└─────────────────────────────────────────┘
```

## Features

✅ Visual display of demo credentials
✅ One-click auto-fill functionality
✅ Backend bypass for instant login
✅ No database setup required for demo
✅ Full JWT authentication
✅ Owner role privileges

## Security Notes

⚠️ **IMPORTANT:** This demo account is for development/testing only!

Before deploying to production:
1. Remove or comment out the demo account logic in `auth.controller.ts`
2. Or add environment-based feature flags
3. Consider implementing proper test accounts in the database

## Troubleshooting

### Demo credentials not showing
- Check that `DemoCredentials` component is imported in `LoginForm.tsx`
- Verify the component is rendered in the form JSX

### Login fails with demo credentials
- Ensure backend is running
- Check backend console for errors
- Verify the demo account logic in `auth.controller.ts` is present

### Auto-fill not working
- Check browser console for JavaScript errors
- Verify `setValue` is properly destructured from `useForm()`
- Ensure `useDemoAccount` function is called when button is clicked

## Next Steps

After successful demo login, you can:
1. Explore the dashboard as an owner role user
2. Test other features with the demo account
3. Create additional test accounts if needed
4. Build out more features knowing authentication works

## Support

If you encounter any issues:
1. Check browser console for errors
2. Check backend terminal for server errors
3. Verify all files were created/updated correctly
4. Ensure dependencies are installed (`npm install`)
