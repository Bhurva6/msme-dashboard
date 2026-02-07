# Authentication System Setup Guide

## Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

## Installation Steps

### 1. Install Dependencies
```bash
cd backend
npm install
```

Required packages (already in package.json):
- express
- typescript
- ts-node
- pg
- jsonwebtoken
- bcrypt
- dotenv
- cors
- helmet
- multer

Dev dependencies:
- nodemon
- @types/node
- @types/express
- @types/jsonwebtoken
- @types/bcrypt
- @types/cors

### 2. Install Missing Type Definitions
If you see TypeScript errors about missing types:
```bash
npm install --save-dev @types/pg
```

### 3. Set Up Environment Variables

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Edit `.env` with your values:
```bash
DATABASE_URL=postgresql://postgres:password@localhost:5432/msme_funding
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
NODE_ENV=development
S3_BUCKET=your-s3-bucket-name
AWS_REGION=ap-south-1
```

**Important**: Generate a strong JWT secret:
```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Or using OpenSSL
openssl rand -hex 64
```

### 4. Set Up Database

Connect to PostgreSQL and create the database:
```bash
psql -U postgres
```

```sql
CREATE DATABASE msme_funding;
\c msme_funding
```

Run the migration script:
```bash
psql -U postgres -d msme_funding -f ../database/migrations/001_initial_schema.sql
```

Or from Node.js:
```bash
cd database/migrations
psql $DATABASE_URL < 001_initial_schema.sql
```

### 5. Verify Database Connection

Create a test script `test-db.ts`:
```typescript
import { pool } from './src/config/database';

async function testConnection() {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Database connected:', result.rows[0]);
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

testConnection();
```

Run it:
```bash
npx ts-node test-db.ts
```

### 6. Start the Development Server

```bash
npm run dev
```

You should see:
```
🚀 Server running on port 5000
📝 Environment: development
🔗 Health check: http://localhost:5000/api/health
```

### 7. Test the Health Endpoint

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "timestamp": "2026-01-23T10:00:00.000Z"
  }
}
```

## Testing the Authentication System

### Option 1: Using cURL

See examples in `AUTH_README.md`

### Option 2: Using VS Code REST Client

1. Install the REST Client extension in VS Code
2. Open `test-auth.http`
3. Click "Send Request" above each API call

### Option 3: Using Postman

Import the following collection or manually create requests following the API documentation in `AUTH_README.md`

## Common Issues & Solutions

### Issue: Database connection failed
**Solution**: 
- Check if PostgreSQL is running
- Verify DATABASE_URL in .env
- Check if database exists
- Check firewall/network settings

### Issue: JWT secret not found
**Solution**:
- Make sure JWT_SECRET is in .env
- Restart the server after adding it

### Issue: TypeScript compilation errors
**Solution**:
```bash
npm install --save-dev @types/pg @types/jsonwebtoken @types/bcrypt
```

### Issue: Port already in use
**Solution**:
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or change PORT in .env
PORT=5001
```

### Issue: OTP not being sent
**Solution**:
- Check server console logs - OTP is printed there in development
- In production, integrate with Twilio or similar SMS service

### Issue: CORS errors from frontend
**Solution**:
The CORS middleware is already configured. If you need specific origins:
```typescript
// In server.ts
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend URL
  credentials: true
}));
```

## Development Workflow

### 1. Test Authentication Flow

```bash
# Terminal 1: Start server
npm run dev

# Terminal 2: Test signup
curl -X POST http://localhost:5000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","phone":"9876543210"}'

# Check console for OTP, then verify
curl -X POST http://localhost:5000/api/v1/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phone":"9876543210","otp":"123456","name":"Test User"}'
```

### 2. Use Token for Authenticated Requests

```bash
# Save token from previous response
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Get user profile
curl -X GET http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer $TOKEN"

# Set password
curl -X POST http://localhost:5000/api/v1/auth/set-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"password":"Password123"}'
```

## Security Checklist

- [ ] Strong JWT_SECRET in production
- [ ] DATABASE_URL is secure and not exposed
- [ ] HTTPS enabled in production
- [ ] Rate limiting configured
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (input sanitization)
- [ ] Password hashing with bcrypt
- [ ] Token expiry set to reasonable time
- [ ] Environment variables not committed to git

## Production Deployment

### 1. Build TypeScript

```bash
npm run build
```

### 2. Set Production Environment

```bash
export NODE_ENV=production
```

### 3. Use PM2 for Process Management

```bash
npm install -g pm2
pm2 start dist/server.js --name msme-backend
pm2 save
pm2 startup
```

### 4. Configure Nginx as Reverse Proxy

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 5. Integrate Real SMS Service

Update `sms.service.ts`:
```typescript
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

static async sendOTP(phone: string): Promise<{ success: boolean; message: string }> {
  // ... existing code ...
  
  // Send SMS via Twilio
  await client.messages.create({
    body: `Your OTP is: ${otp}. Valid for 10 minutes.`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: `+91${phone}`
  });
  
  // ... rest of the code ...
}
```

## Monitoring

### Logs
```bash
# View logs in development
npm run dev

# View PM2 logs in production
pm2 logs msme-backend
```

### Database Queries
```sql
-- Check user count
SELECT COUNT(*) FROM users;

-- Check recent signups
SELECT name, phone, created_at FROM users ORDER BY created_at DESC LIMIT 10;

-- Check users by role
SELECT role, COUNT(*) FROM users GROUP BY role;
```

## Next Steps

After authentication is working:
1. Implement business profile management
2. Add document upload functionality
3. Create funding application endpoints
4. Build operations dashboard
5. Add analytics and reporting

## Support

For questions or issues:
- Check `AUTH_README.md` for API documentation
- Review error logs in console
- Test with `test-auth.http` file
- Check PostgreSQL logs for database issues

## Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [JWT.io](https://jwt.io/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [bcrypt Documentation](https://github.com/kelektiv/node.bcrypt.js)
