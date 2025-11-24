#!/bin/bash

# Start script for mljubenovic.com portfolio
# This script builds Tailwind CSS and starts the Jekyll development server

set -e

echo "🚀 Starting mljubenovic.com development environment..."
echo ""

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing Node.js dependencies..."
    npm install
    npm install -D @tailwindcss/typography
fi

# Build Tailwind CSS
echo "🎨 Building Tailwind CSS..."
npm run build

# Check if Jekyll is ready
if ! command -v bundle &> /dev/null; then
    echo "❌ Bundler is not installed. Please run: gem install bundler"
    exit 1
fi

if [ ! -f "Gemfile.lock" ]; then
    echo "📦 Installing Ruby dependencies..."
    bundle install
fi

# Start Jekyll server
echo ""
echo "✅ Starting Jekyll development server..."
echo "📍 Server will be available at: http://localhost:4000"
echo ""
echo "💡 To enable Tailwind CSS watch mode (for live CSS updates):"
echo "   Open a new terminal and run: npm run dev"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

bundle exec jekyll serve --livereload
