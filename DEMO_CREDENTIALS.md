# Demo Credentials

This document contains demo/test credentials for quick testing of the MSME Funding Platform.

## Demo Account

Use these credentials to quickly test the application without going through the signup process:

### Login Credentials
- **Email:** `demo@msme.com`
- **Password:** `Demo@123`

### Account Details
- **Name:** Demo User
- **Phone:** +919999999999
- **Role:** Owner

## Features

- The demo account is automatically recognized by the backend
- No database entry is required for the demo account
- A JWT token is generated for authentication
- The demo user has "owner" role privileges

## Usage

1. Navigate to the login page
2. You'll see a blue information banner with the demo credentials
3. Click "Use Demo Credentials →" to auto-fill the form
4. Or manually enter:
   - Email: `demo@msme.com`
   - Password: `Demo@123`
5. Click "Login" to access the dashboard

## Implementation Notes

- **Frontend:** Demo credentials are displayed in `DemoCredentials` component
- **Backend:** Demo account is hardcoded in `auth.controller.ts` for quick bypass
- **Security:** This is for development/testing only. Remove or secure for production!

## ⚠️ Important

**This demo account should be disabled or properly secured before deploying to production!**

For production:
- Remove the demo account hardcoded logic from `auth.controller.ts`
- Or add proper environment-based feature flags
- Consider implementing a proper test account system with database entries
