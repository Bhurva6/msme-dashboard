# 🐳 Docker + Database Setup Complete Guide

## ✅ WHAT WE'VE CREATED

1. **docker-compose.yml** - MySQL 8.0 configuration with auto-migration
2. **setup-docker.sh** - Automated setup script
3. **.dockerignore** - Optimization for Docker builds

---

## 🚀 OPTION 1: Quick Setup (Recommended)

### Step 1: Install Docker Desktop
**Download for Mac:** https://www.docker.com/products/docker-desktop

1. Download the `.dmg` file
2. Drag Docker to Applications
3. Open Docker Desktop
4. Wait for "Docker Desktop is running" message

### Step 2: Run the Setup Script
```bash
cd /Users/bhurvasharma/msme/msme-funding-platform
./setup-docker.sh
```

**That's it!** The script will:
- ✅ Check Docker installation
- ✅ Start MySQL container
- ✅ Auto-run database migrations
- ✅ Show you database credentials

---

## 🛠️ OPTION 2: Manual Setup

### Step 1: Start Docker Container
```bash
cd /Users/bhurvasharma/msme/msme-funding-platform
docker-compose up -d
```

### Step 2: Verify MySQL is Running
```bash
docker ps
```

You should see: `msme_mysql` container running

### Step 3: Check Migrations (Auto-Applied)
```bash
docker exec -it msme_mysql mysql -u root -prootpassword msme_funding -e "SHOW TABLES;"
```

You should see 7 tables:
- users
- businesses
- document_groups
- documents
- directors  
- funding_utilities

---

## 🔧 UPDATE BACKEND CONFIGURATION

### Edit `backend/.env`:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=msme_user
DB_PASSWORD=msme_password
DB_NAME=msme_funding

# Storage
LOCAL_STORAGE_PATH=./uploads

# JWT
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Server
PORT=5000
NODE_ENV=development
```

---

## 📦 INSTALL BACKEND DEPENDENCIES

```bash
cd backend
npm install mysql2 multer @types/multer
npm install  # Install all dependencies
```

---

## ▶️ START THE SERVERS

### Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

### Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

---

## 🧪 TEST DATABASE CONNECTION

### Option 1: From Host Machine
```bash
mysql -h 127.0.0.1 -P 3306 -u msme_user -pmsme_password msme_funding
```

### Option 2: Inside Docker Container
```bash
docker exec -it msme_mysql mysql -u msme_user -pmsme_password msme_funding
```

### Run Test Query:
```sql
-- Check users table
SELECT * FROM users LIMIT 1;

-- Check businesses table
SELECT * FROM businesses;

-- Check document_groups table
SELECT * FROM document_groups;

EXIT;
```

---

## 🐛 TROUBLESHOOTING

### Problem: "Cannot connect to Docker"
**Solution:**
```bash
# Check Docker status
docker ps

# Restart Docker Desktop from Applications
```

### Problem: "Port 3306 already in use"
**Solution:**
```bash
# Check what's using port 3306
sudo lsof -i :3306

# Stop existing MySQL
brew services stop mysql

# Or change port in docker-compose.yml
ports:
  - "3307:3306"  # Use port 3307 instead
```

### Problem: "Migrations not applied"
**Solution:**
```bash
# Connect to container
docker exec -it msme_mysql bash

# Inside container, run migrations manually
mysql -u root -prootpassword msme_funding < /docker-entrypoint-initdb.d/001_initial_schema.sql
mysql -u root -prootpassword msme_funding < /docker-entrypoint-initdb.d/002_business_documents_schema.sql

exit
```

### Problem: "Can't connect from backend"
**Solution:**
```bash
# Check backend/.env has correct credentials:
DB_HOST=localhost  # NOT 127.0.0.1 or container name
DB_PORT=3306
DB_USER=msme_user
DB_PASSWORD=msme_password
```

---

## 📋 USEFUL DOCKER COMMANDS

```bash
# View running containers
docker ps

# View all containers (including stopped)
docker ps -a

# View logs
docker-compose logs mysql
docker-compose logs -f mysql  # Follow logs

# Stop containers
docker-compose stop

# Start containers
docker-compose start

# Restart containers
docker-compose restart

# Stop and remove containers
docker-compose down

# Stop and remove containers + volumes (⚠️ DELETES DATA)
docker-compose down -v

# Access MySQL CLI
docker exec -it msme_mysql mysql -u msme_user -pmsme_password msme_funding

# Access container bash
docker exec -it msme_mysql bash

# View container stats
docker stats msme_mysql
```

---

## 🗄️ DATABASE BACKUP & RESTORE

### Backup Database:
```bash
docker exec msme_mysql mysqldump -u root -prootpassword msme_funding > backup.sql
```

### Restore Database:
```bash
docker exec -i msme_mysql mysql -u root -prootpassword msme_funding < backup.sql
```

---

## 🔄 RESET EVERYTHING

If you want to start fresh:

```bash
# Stop and remove everything
docker-compose down -v

# Remove Docker image
docker rmi mysql:8.0

# Start fresh
docker-compose up -d
```

---

## ✅ VERIFICATION CHECKLIST

- [ ] Docker Desktop installed and running
- [ ] `docker ps` shows `msme_mysql` container
- [ ] `docker-compose logs mysql` shows "ready for connections"
- [ ] Can connect via: `mysql -h 127.0.0.1 -P 3306 -u msme_user -pmsme_password`
- [ ] `SHOW TABLES;` returns 7 tables
- [ ] backend/.env configured with correct credentials
- [ ] `cd backend && npm install` completed
- [ ] `cd backend && npm run dev` starts without errors
- [ ] `cd frontend && npm run dev` starts without errors
- [ ] Can access frontend at http://localhost:5173

---

## 🎉 SUCCESS INDICATORS

When everything is working:

1. **Docker:** Container shows "healthy" status
2. **Backend:** Console shows "Connected to MySQL database"
3. **Frontend:** Opens in browser with login page
4. **Demo Login:** Can login with demo@msme.com / Demo@123
5. **Database:** Can query tables and see data

---

## 📞 NEXT STEPS AFTER SETUP

1. ✅ Test demo login
2. ✅ Create a business profile
3. ✅ Upload documents
4. ✅ Add directors
5. ✅ Check profile completion reaches 70%+
6. ✅ Access funding options

---

## 💡 PRO TIPS

1. **Keep Docker Desktop running** while developing
2. **Use Docker GUI** to view containers, logs, volumes
3. **Check logs first** when troubleshooting: `docker-compose logs`
4. **Don't delete volumes** unless you want to reset data
5. **Backup before experiments** using mysqldump

---

**Need help? Check the logs:**
```bash
docker-compose logs -f mysql
```
