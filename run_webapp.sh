#!/bin/bash
# Start the AI Multi-Blog Generator (Next.js) in development mode

set -euo pipefail

echo "🚀 Starting AI Multi-Blog Generator..."
echo ""

if [ ! -d "node_modules" ]; then
  echo "📦 Installing npm dependencies"
  npm install
fi

echo "⚙️  Launching Next.js dev server on http://localhost:3000"
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev

