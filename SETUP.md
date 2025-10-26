# 🚀 Quick Setup Guide

## **Option 1: One-Command Setup (Recommended)**

```bash
# Install dependencies and start PostgreSQL
npm run setup
```

This will:
- Install all dependencies (frontend + backend)
- Start PostgreSQL in Docker
- Show you the connection details

## **Option 2: Step-by-Step Setup**

### **1. Install Dependencies**
```bash
npm run install:all
```

### **2. Start PostgreSQL with Docker**
```bash
# Start PostgreSQL (no local installation needed!)
npm run db:start
```

### **3. Start Development Servers**
```bash
# Start both frontend and backend
npm run dev

# Or start them separately:
npm run dev:frontend  # Frontend on http://localhost:3000
npm run dev:backend   # Backend on http://localhost:3001
```

## **🐳 Docker Commands**

```bash
# Start PostgreSQL
npm run db:start

# Stop PostgreSQL
npm run db:stop

# View PostgreSQL logs
npm run db:logs

# Check if PostgreSQL is running
docker ps
```

## **🔧 Database Connection Details**

When PostgreSQL is running via Docker:
- **Host**: localhost
- **Port**: 5432
- **Database**: sketch_history_board
- **Username**: postgres
- **Password**: password

## **✅ Verify Everything is Working**

1. **Check PostgreSQL is running:**
   ```bash
   docker ps
   # Should show sketch-history-postgres container
   ```

2. **Test database connection:**
   ```bash
   # Connect to PostgreSQL (optional)
   docker exec -it sketch-history-postgres psql -U postgres -d sketch_history_board
   ```

3. **Start the application:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001/health

## **🛠️ Troubleshooting**

### **Docker not running?**
```bash
# Start Docker Desktop, then try again
npm run db:start
```

### **Port 5432 already in use?**
```bash
# Stop any existing PostgreSQL
npm run db:stop

# Or change the port in docker-compose.dev.yml
```

### **Database connection issues?**
```bash
# Check PostgreSQL logs
npm run db:logs

# Restart PostgreSQL
npm run db:stop
npm run db:start
```

## **🎯 What You Get**

- ✅ PostgreSQL running in Docker (no local installation needed)
- ✅ Frontend: Next.js with TypeScript and Tailwind
- ✅ Backend: Express.js with DDD architecture
- ✅ Full drawing functionality with version history
- ✅ Responsive design for desktop and mobile

## **🚀 Next Steps**

1. Open http://localhost:3000
2. Start drawing on the canvas
3. Save versions using "Save as Version" button
4. View and restore previous versions in the history panel

Happy coding! 🎨
