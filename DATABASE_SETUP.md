# Database Setup Options - MSME Funding Platform

You have MySQL command not found. Here are your options:

---

## ✅ OPTION 1: Install MySQL via Homebrew (Recommended)

### 1. Install Homebrew (if not installed)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2. Install MySQL
```bash
brew install mysql
```

### 3. Start MySQL Service
```bash
brew services start mysql
```

### 4. Secure MySQL Installation
```bash
mysql_secure_installation
```

### 5. Connect and Create Database
```bash
mysql -u root -p

# Inside MySQL prompt:
CREATE DATABASE IF NOT EXISTS msme_funding;
USE msme_funding;
SOURCE /Users/bhurvasharma/msme/msme-funding-platform/database/migrations/001_initial_schema.sql;
SOURCE /Users/bhurvasharma/msme/msme-funding-platform/database/migrations/002_business_documents_schema.sql;
SHOW TABLES;
EXIT;
```

---

## ✅ OPTION 2: Use Docker (Quick Setup)

### 1. Install Docker Desktop for Mac
Download from: https://www.docker.com/products/docker-desktop

### 2. Run MySQL in Docker
```bash
cd /Users/bhurvasharma/msme/msme-funding-platform

# Create docker-compose.yml (see below)

# Start MySQL
docker-compose up -d
```

### 3. Create docker-compose.yml file:
```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: msme_mysql
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: msme_funding
      MYSQL_USER: msme_user
      MYSQL_PASSWORD: msme_password
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./database/migrations:/docker-entrypoint-initdb.d
    command: --default-authentication-plugin=mysql_native_password

volumes:
  mysql_data:
```

### 4. Migrations will auto-run on first start!

### 5. Connect to verify:
```bash
docker exec -it msme_mysql mysql -u root -p
```

---

## ✅ OPTION 3: Use SQLite (Development Only)

If you want to start quickly without MySQL installation, we can switch to SQLite for development.

### Advantages:
- ✅ No installation needed
- ✅ File-based database
- ✅ Perfect for development

### Disadvantages:
- ❌ Limited for production
- ❌ Need to modify backend code

---

## ✅ OPTION 4: Skip Database for Now (Test Frontend Only)

You can still work on the frontend and test with mock data! The backend just won't persist anything.

---

## 🎯 RECOMMENDED APPROACH

**For quick development:** Use **Option 2 (Docker)** - It's the fastest!

1. Install Docker Desktop
2. Create docker-compose.yml in project root
3. Run `docker-compose up -d`
4. Database automatically set up with migrations!

---

## 📝 Update Backend .env After Setup

Depending on your choice, update `backend/.env`:

### For MySQL (Option 1):
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=msme_funding
```

### For Docker (Option 2):
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=msme_user
DB_PASSWORD=msme_password
DB_NAME=msme_funding
```

---

## 🚀 Quick Start with Docker (Easiest)

1. **Install Docker Desktop**: Download and install from docker.com
2. **Create docker-compose.yml**: Use the config above
3. **Start services**: `docker-compose up -d`
4. **Verify**: `docker ps` (should show mysql running)
5. **Check logs**: `docker-compose logs mysql`
6. **Start backend**: `cd backend && npm run dev`

---

## 🆘 Need Help?

Choose which option you'd like to proceed with and I can:
- Create the docker-compose.yml file for you
- Help with Homebrew installation
- Convert to SQLite for development
- Set up mock data for frontend-only development

**Which option works best for you?**
