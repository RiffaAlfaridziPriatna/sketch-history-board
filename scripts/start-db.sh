#!/bin/bash

echo "🐳 Starting PostgreSQL with Docker..."
echo ""

# Start PostgreSQL container
docker-compose -f docker-compose.dev.yml up -d postgres

echo ""
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 5

echo ""
echo "✅ PostgreSQL is running!"
echo "📊 Database: sketch_history_board"
echo "🔗 Host: localhost:5432"
echo "👤 User: postgres"
echo "🔑 Password: password"
echo ""
echo "🚀 You can now start your backend with:"
echo "   cd backend && npm run dev"
echo ""
echo "🛑 To stop PostgreSQL:"
echo "   docker-compose -f docker-compose.dev.yml down"
