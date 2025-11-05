#!/bin/bash
# Build and start the AI Multi-Blog Generator in production mode

set -euo pipefail

echo "🚀 Building AI Multi-Blog Generator for production..."
echo ""

npm install
npm run build

echo "🌐 Starting Next.js server on http://localhost:3000"
echo "📝 Press Ctrl+C to stop"
echo ""

npm run start

