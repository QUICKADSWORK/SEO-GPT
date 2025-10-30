#!/bin/bash
# Start Domain Metrics Web App with proper environment variables

echo "🚀 Starting Domain Metrics Web App..."
echo ""

# Kill any existing Flask processes
echo "Stopping any existing Flask processes..."
pkill -f "flask run" 2>/dev/null || true
pkill -f "python.*app.py" 2>/dev/null || true
sleep 1

# Set API key
export SEMRUSH_API_KEY="56b6f4dce1mshc3398ebe2b7bdf7p1a8c18jsn91e4f7fa09ae"
export RAPIDAPI_KEY="56b6f4dce1mshc3398ebe2b7bdf7p1a8c18jsn91e4f7fa09ae"
export FLASK_APP=app.py
export FLASK_ENV=development

echo "✅ Environment variables set"
echo "✅ API Key: ${SEMRUSH_API_KEY:0:10}...${SEMRUSH_API_KEY: -5}"
echo ""
echo "🌐 Starting server on http://localhost:8000"
echo "📝 Press Ctrl+C to stop"
echo ""

# Start the app
python3 app.py

