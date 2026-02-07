#!/bin/bash

echo "🚀 MSME Funding Platform - Docker Setup"
echo "======================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed!"
    echo "📥 Please install Docker Desktop from: https://www.docker.com/products/docker-desktop"
    exit 1
fi

echo "✅ Docker found!"
echo ""

# Check if docker-compose exists
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ docker-compose.yml not found!"
    exit 1
fi

echo "🐳 Starting MySQL database..."
docker-compose up -d

echo ""
echo "⏳ Waiting for MySQL to be ready..."
sleep 10

# Check if MySQL is running
if docker ps | grep -q msme_mysql; then
    echo "✅ MySQL is running!"
    echo ""
    echo "📊 Database Configuration:"
    echo "  Host: localhost"
    echo "  Port: 3306"
    echo "  Database: msme_funding"
    echo "  Username: msme_user"
    echo "  Password: msme_password"
    echo ""
    echo "🔧 Next Steps:"
    echo "1. Update backend/.env with:"
    echo "   DB_HOST=localhost"
    echo "   DB_PORT=3306"
    echo "   DB_USER=msme_user"
    echo "   DB_PASSWORD=msme_password"
    echo "   DB_NAME=msme_funding"
    echo ""
    echo "2. Install backend dependencies:"
    echo "   cd backend && npm install"
    echo ""
    echo "3. Start the backend server:"
    echo "   cd backend && npm run dev"
    echo ""
    echo "4. Start the frontend server (in another terminal):"
    echo "   cd frontend && npm run dev"
    echo ""
    echo "✅ Setup complete! Happy coding! 🎉"
else
    echo "❌ Failed to start MySQL container"
    echo "Run 'docker-compose logs' for details"
    exit 1
fi
