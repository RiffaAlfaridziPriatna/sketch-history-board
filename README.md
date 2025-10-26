# Sketch History Board

A full-stack web application for drawing sketches with version history management. Users can draw freely, save versions, and restore previous sketches.

## 🎯 Features

- **Interactive Drawing Canvas**: Draw with mouse or touch using pen and eraser tools
- **Version Management**: Save sketches as versions with thumbnails and timestamps
- **History Panel**: View and restore previous sketch versions
- **Real-time Tools**: Undo/redo functionality, brush size control, color picker
- **Responsive Design**: Works on desktop and mobile devices

## 🏗️ Architecture

### Frontend (Next.js + TypeScript + Tailwind)
- **Atomic Design Pattern**: Reusable components organized by complexity
- **Custom Hooks**: Encapsulated business logic for sketch management
- **TypeScript**: Full type safety across the application
- **Tailwind CSS**: Utility-first styling for rapid development

### Backend (Express.js + TypeScript + PostgreSQL)
- **Domain-Driven Design (DDD)**: Clean architecture with separated concerns
- **Event-Driven Architecture**: Loose coupling between components
- **Repository Pattern**: Abstracted data access layer
- **Use Cases**: Business logic encapsulated in application layer

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL 12+ (or Docker)
- npm or yarn

### Option 1: Docker Compose (Recommended)

1. **Clone and start services:**
```bash
git clone <repository-url>
cd sketch-history-board
docker-compose up -d
```

2. **Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- PostgreSQL: localhost:5432

### Option 2: Manual Setup

1. **Setup PostgreSQL:**
```bash
# Create database
createdb sketch_history_board

# Or using psql
psql -U postgres -c "CREATE DATABASE sketch_history_board;"
```

2. **Install dependencies:**
```bash
# Install all dependencies
npm run install:all

# Or install separately
cd frontend && npm install
cd ../backend && npm install
```

3. **Configure environment:**
```bash
# Copy environment file
cp backend/env.example backend/.env

# Edit database credentials in backend/.env
```

4. **Start development servers:**
```bash
# Start both frontend and backend
npm run dev

# Or start separately
npm run dev:frontend  # Frontend on :3000
npm run dev:backend   # Backend on :3001
```

## 📁 Project Structure

```
sketch-history-board/
├── frontend/                 # Next.js application
│   ├── src/
│   │   ├── components/       # Atomic design components
│   │   │   ├── atoms/        # Basic UI elements
│   │   │   ├── molecules/    # Composite components
│   │   │   └── organisms/    # Complex components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API service layer
│   │   └── types/           # TypeScript definitions
│   └── package.json
├── backend/                 # Express.js API
│   ├── src/
│   │   ├── domain/          # Domain layer (DDD)
│   │   │   ├── entities/     # Business entities
│   │   │   ├── value-objects/ # Value objects
│   │   │   └── repositories/ # Repository interfaces
│   │   ├── application/     # Application layer
│   │   │   └── use-cases/   # Business use cases
│   │   ├── infrastructure/  # Infrastructure layer
│   │   │   ├── database/    # Database implementation
│   │   │   └── repositories/ # Repository implementations
│   │   └── interfaces/      # Interface layer
│   │       ├── controllers/ # HTTP controllers
│   │       └── middleware/  # Express middleware
│   └── package.json
└── docker-compose.yml       # Docker services
```

## 🎨 Design Decisions

### Frontend Architecture

**Why Next.js?**
- **Server-Side Rendering**: Better SEO and initial load performance
- **Built-in Optimization**: Image optimization, code splitting, and more
- **TypeScript Support**: Excellent TypeScript integration out of the box
- **API Routes**: Can serve as both frontend and backend if needed

**Why Atomic Design?**
- **Reusability**: Components can be composed in different ways
- **Maintainability**: Clear separation of concerns
- **Scalability**: Easy to add new features without breaking existing code
- **Testing**: Smaller components are easier to test

**Why Tailwind CSS?**
- **Rapid Development**: Utility classes speed up styling
- **Consistency**: Design system enforced through utilities
- **Performance**: Only used styles are included in final bundle
- **Responsive**: Mobile-first approach with responsive utilities

### Backend Architecture

**Why Domain-Driven Design (DDD)?**
- **Business Focus**: Code structure reflects business domain
- **Maintainability**: Clear boundaries between layers
- **Testability**: Each layer can be tested independently
- **Scalability**: Easy to add new features without affecting existing code

**Why Event-Driven Architecture?**
- **Loose Coupling**: Components don't depend on each other directly
- **Extensibility**: Easy to add new event handlers
- **Testability**: Events can be tested in isolation
- **Scalability**: Can be distributed across services

**Why PostgreSQL over SQLite?**
- **Production Ready**: Better for production environments
- **Concurrent Access**: Multiple users can access simultaneously
- **Data Integrity**: ACID compliance and better data validation
- **Scalability**: Can handle larger datasets and more connections
- **Features**: Advanced features like JSON support, full-text search, etc.

### Database Design

**Schema Design:**
```sql
CREATE TABLE sketch_versions (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  thumbnail TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);
```

**Why this design?**
- **Simple Schema**: Only essential fields for MVP
- **Base64 Storage**: Easy to store and retrieve image data
- **Timestamps**: Track creation and modification times
- **Thumbnails**: Fast loading of version history

## 🔧 API Endpoints

### Sketches
- `POST /api/sketches` - Create a new sketch version
- `GET /api/sketches` - Get all sketch versions
- `GET /api/sketches/:id` - Get a specific sketch version
- `DELETE /api/sketches/:id` - Delete a sketch version

### Health Check
- `GET /health` - Server health status

## 🧪 Development

### Running Tests
```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

### Code Quality
```bash
# Linting
npm run lint

# Type checking
npm run type-check

# Formatting
npm run format
```

## 🚀 Deployment

### Production Build
```bash
# Build all applications
npm run build

# Start production servers
npm start
```

### Docker Deployment
```bash
# Build and start with Docker Compose
docker-compose -f docker-compose.prod.yml up -d
```

## 🔒 Environment Variables

### Backend (.env)
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sketch_history_board
DB_USER=postgres
DB_PASSWORD=password
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

If you have any questions or need help, please open an issue in the repository.
