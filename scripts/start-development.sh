#!/bin/bash

# Start PostgreSQL (if not running)
# sudo service postgresql start

echo "🏥 Starting Hospital Staff Allocation AI System"

# Start backend
echo "🚀 Starting Backend API..."
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python run.py &
BACKEND_PID=$!

# Wait for backend to start
sleep 5

# Start frontend
echo "⚛️ Starting Frontend..."
cd ../frontend
npm install
npm run dev &
FRONTEND_PID=$!

echo "✅ System started successfully!"
echo "Backend API: http://localhost:8000"
echo "Frontend: http://localhost:5173"
echo "API Docs: http://localhost:8000/docs"

# Wait for user input to stop
read -p "Press any key to stop the system..."

# Kill processes
kill $BACKEND_PID
kill $FRONTEND_PID

echo "🛑 System stopped"