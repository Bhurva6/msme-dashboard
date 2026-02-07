# Authentication System Documentation

## Overview
Complete authentication system with phone OTP and email login functionality for the MSME Funding Platform.

## Features
- ✅ Phone-based signup with OTP verification
- ✅ Email/password login
- ✅ JWT token authentication (7-day expiry)
- ✅ Password management
- ✅ Rate limiting on OTP requests
- ✅ Input validation and sanitization
- ✅ Role-based access control

## API Endpoints

### 1. Signup (Send OTP)
**POST** `/api/v1/auth/signup`

Request:
```json
{
  "name": "John Doe",
  "phone": "9876543210",
  "email": "john@example.com" // optional
}
```

Success Response (200):
```json
{
  "success": true,
  "message": "OTP sent to phone number",
  "data": {
    "phone": "9876543210"
  }
}
```

Error Responses:
- `409`: Phone/email already registered
- `429`: Too many OTP requests
- `400`: Validation error

### 2. Verify OTP
**POST** `/api/v1/auth/verify-otp`

Request:
```json
{
  "phone": "9876543210",
  "otp": "123456",
  "name": "John Doe",
  "email": "john@example.com" // optional
}
```

Success Response (201):
```json
{
  "success": true,
  "message": "User verified successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210",
      "role": "owner",
      "created_at": "2026-01-23T10:00:00.000Z",
      "updated_at": "2026-01-23T10:00:00.000Z"
    }
  }
}
```

Error Responses:
- `400`: Invalid OTP or expired
- `400`: Validation error

### 3. Resend OTP
**POST** `/api/v1/auth/resend-otp`

Request:
```json
{
  "phone": "9876543210"
}
```

Success Response (200):
```json
{
  "success": true,
  "message": "OTP sent successfully"
}
```

### 4. Email Login
**POST** `/api/v1/auth/login`

Request:
```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```

Success Response (200):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210",
      "role": "owner",
      "created_at": "2026-01-23T10:00:00.000Z",
      "updated_at": "2026-01-23T10:00:00.000Z"
    }
  }
}
```

Error Responses:
- `401`: Invalid email or password
- `401`: Password not set
- `400`: Validation error

### 5. Set Password
**POST** `/api/v1/auth/set-password`

Headers:
```
Authorization: Bearer <token>
```

Request:
```json
{
  "password": "Password123"
}
```

Success Response (200):
```json
{
  "success": true,
  "message": "Password set successfully"
}
```

Error Responses:
- `401`: Unauthorized (invalid/missing token)
- `400`: Weak password

### 6. Get Current User
**GET** `/api/v1/auth/me`

Headers:
```
Authorization: Bearer <token>
```

Success Response (200):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210",
      "role": "owner",
      "created_at": "2026-01-23T10:00:00.000Z",
      "updated_at": "2026-01-23T10:00:00.000Z"
    }
  }
}
```

Error Responses:
- `401`: Unauthorized
- `404`: User not found

## Validation Rules

### Phone Number
- Must be 10 digits
- Must start with 6, 7, 8, or 9
- Format: `9876543210`

### Email
- Must be valid email format
- Example: `user@example.com`

### Password
- Minimum 8 characters
- Must contain at least 1 letter
- Must contain at least 1 number
- Example: `Password123`

### Name
- 2-255 characters
- Non-empty string

### OTP
- Must be exactly 6 digits
- Example: `123456`

## Rate Limiting

### OTP Requests
- Maximum 3 OTP requests per phone number per hour
- After limit: Wait 1 hour before next request

### OTP Verification
- Maximum 3 verification attempts per OTP
- OTP expires after 10 minutes
- After max attempts: Request new OTP

## Security Features

1. **Password Hashing**: bcrypt with 10 salt rounds
2. **JWT Secret**: Stored in environment variables
3. **Input Sanitization**: XSS prevention
4. **Input Validation**: Strict validation on all inputs
5. **SQL Injection Protection**: Parameterized queries
6. **Rate Limiting**: Prevents OTP spam
7. **Token Expiry**: 7-day JWT expiry
8. **Helmet**: HTTP headers security

## Environment Variables

Required in `.env`:
```bash
DATABASE_URL=postgresql://user:password@host:port/dbname
JWT_SECRET=your_very_secure_random_secret_key_here
PORT=5000
NODE_ENV=development
S3_BUCKET=your-s3-bucket-name
AWS_REGION=ap-south-1
```

## Database Schema

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(15) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    role VARCHAR(20) DEFAULT 'owner',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

## Error Handling

All errors follow this format:
```json
{
  "success": false,
  "error": "Error message here"
}
```

### HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error)
- `401`: Unauthorized (auth required)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `409`: Conflict (resource exists)
- `429`: Too Many Requests (rate limit)
- `500`: Internal Server Error

## Testing

### Using cURL

1. **Signup**:
```bash
curl -X POST http://localhost:5000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","phone":"9876543210","email":"john@example.com"}'
```

2. **Verify OTP** (check console for OTP):
```bash
curl -X POST http://localhost:5000/api/v1/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phone":"9876543210","otp":"123456","name":"John Doe","email":"john@example.com"}'
```

3. **Set Password**:
```bash
curl -X POST http://localhost:5000/api/v1/auth/set-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"password":"Password123"}'
```

4. **Login**:
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"Password123"}'
```

5. **Get User**:
```bash
curl -X GET http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Using VS Code REST Client

See `test-auth.http` file for interactive testing.

## Authentication Flow

### First-time User (Phone OTP)
1. User enters phone number → `POST /signup`
2. System sends OTP (logged to console)
3. User enters OTP → `POST /verify-otp`
4. System creates account and returns JWT
5. User sets password (optional) → `POST /set-password`

### Returning User (Email Login)
1. User enters email & password → `POST /login`
2. System validates credentials
3. System returns JWT token
4. Use token for authenticated requests

## Role-Based Access Control

### Roles
- `owner`: Business owner (default)
- `ops`: Operations team member

### Using Role Middleware
```typescript
import { requireRole } from './middleware/auth.middleware';

// Only accessible by ops team
router.get('/admin', authenticateToken, requireRole('ops'), handler);

// Accessible by both roles
router.get('/profile', authenticateToken, handler);
```

## Future Enhancements

- [ ] Integrate Twilio for real SMS
- [ ] Add refresh tokens
- [ ] Implement 2FA
- [ ] Add password reset flow
- [ ] Social login (Google, etc.)
- [ ] Email verification
- [ ] Session management
- [ ] Audit logs

## Support

For issues or questions, contact the development team.
