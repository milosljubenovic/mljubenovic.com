#!/bin/bash

# Setup script for mljubenovic.com portfolio

echo "🚀 Setting up your Jekyll portfolio..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed."
    echo "📦 Please install Node.js 18.x or higher from https://nodejs.org/"
    echo ""
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    echo "📦 Please install npm (usually comes with Node.js)"
    echo ""
    exit 1
fi

# Install Ruby dependencies
echo "📦 Installing Ruby dependencies..."
bundle install

# Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
npm install

# Install Tailwind typography plugin
echo "📦 Installing Tailwind CSS Typography plugin..."
npm install -D @tailwindcss/typography

# Build Tailwind CSS
echo "🎨 Building Tailwind CSS..."
npm run build

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the development server:"
echo "  1. Run: bundle exec jekyll serve"
echo "  2. In another terminal, run: npm run dev"
echo "  3. Visit: http://localhost:4000"
echo ""
