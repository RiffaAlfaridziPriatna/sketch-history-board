# 🔧 Environment Variables Setup

## 📁 **Environment Files Structure**

```
sketch-history-board/
├── backend/
│   ├── .env                 # Backend environment variables
│   └── env.example         # Backend environment template
├── frontend/
│   ├── .env.local          # Frontend environment variables
│   └── env.example         # Frontend environment template
└── .gitignore              # Ignores all .env files
```

## 🎯 **Backend Environment (.env)**

**Location:** `backend/.env`

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sketch_history_board
DB_USER=postgres
DB_PASSWORD=password

# Server Configuration
PORT=3001
NODE_ENV=development

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000
```

## 🎨 **Frontend Environment (.env.local)**

**Location:** `frontend/.env.local`

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001

# Environment
NODE_ENV=development
```

## 🚀 **Quick Setup Commands**

### **1. Copy Environment Templates:**
```bash
# Backend
cp backend/env.example backend/.env

# Frontend
cp frontend/env.example frontend/.env.local
```

### **2. Edit Environment Variables:**
```bash
# Edit backend environment
nano backend/.env

# Edit frontend environment
nano frontend/.env.local
```

## 🔒 **Security & Git Ignore**

### **✅ Protected Files (Not Committed to Git):**
- `backend/.env`
- `frontend/.env.local`
- `backend/.env.production`
- `frontend/.env.production.local`

### **📝 Template Files (Committed to Git):**
- `backend/env.example`
- `frontend/env.example`

## 🌍 **Environment-Specific Configurations**

### **Development:**
```bash
# Backend
NODE_ENV=development
DB_HOST=localhost
PORT=3001

# Frontend
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### **Production:**
```bash
# Backend
NODE_ENV=production
DB_HOST=your-production-db-host
PORT=3001

# Frontend
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

## 🔧 **Environment Variable Usage**

### **Backend (Express.js):**
```typescript
// Automatically loaded by dotenv
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbName = process.env.DB_NAME;
```

### **Frontend (Next.js):**
```typescript
// Only NEXT_PUBLIC_* variables are available in browser
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

## ⚠️ **Important Notes**

1. **Frontend Environment Variables:**
   - Must start with `NEXT_PUBLIC_` to be available in browser
   - Are embedded at build time
   - Should not contain sensitive information

2. **Backend Environment Variables:**
   - Can contain sensitive information (database passwords, API keys)
   - Are loaded at runtime
   - Should never be committed to Git

3. **Docker Environment:**
   - Use `docker-compose.yml` for container environment variables
   - Override with `.env` files in Docker Compose

## 🐳 **Docker Environment**

### **Docker Compose Override:**
```yaml
# docker-compose.override.yml
services:
  backend:
    environment:
      - DB_HOST=postgres
      - DB_PASSWORD=password
  frontend:
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:3001
```

## 🚀 **Development Workflow**

1. **Start PostgreSQL:**
   ```bash
   npm run db:start
   ```

2. **Start Backend:**
   ```bash
   cd backend && npm run dev
   # Uses backend/.env automatically
   ```

3. **Start Frontend:**
   ```bash
   cd frontend && npm run dev
   # Uses frontend/.env.local automatically
   ```

## 🔍 **Troubleshooting**

### **Environment Variables Not Loading?**
```bash
# Check if files exist
ls -la backend/.env
ls -la frontend/.env.local

# Check file contents
cat backend/.env
cat frontend/.env.local
```

### **API Connection Issues?**
```bash
# Verify API URL in frontend
echo $NEXT_PUBLIC_API_URL

# Test backend endpoint
curl http://localhost:3001/health
```

### **Database Connection Issues?**
```bash
# Check database environment
echo $DB_HOST
echo $DB_PORT
echo $DB_NAME
```

Your environment is now properly configured! 🎉
