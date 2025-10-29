#!/bin/bash
# Start the Domain Metrics Web App

echo "🚀 Starting Domain Metrics Web App..."
echo ""

# Install dependencies if needed
if ! python3 -c "import flask" 2>/dev/null; then
    echo "📦 Installing Flask..."
    pip3 install flask
fi

# Set API key
export SEMRUSH_API_KEY="56b6f4dce1mshc3398ebe2b7bdf7p1a8c18jsn91e4f7fa09ae"

# Start the app
echo "✅ App will be available at: http://localhost:5000"
echo "Press Ctrl+C to stop the server"
echo ""

python3 app.py

