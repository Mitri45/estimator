#!/bin/bash

# Estimator App Deployment Script
# This script builds the frontend, copies it to the Nginx root, and starts the server with PM2

set -e  # Exit on any error

echo "🚀 Starting Estimator App deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/home/dima/estimator"
NGINX_ROOT="/var/www/estimator.madeby.dev/html"
SERVER_PORT=5003
PM2_APP_NAME="estimator-server"

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -d "$PROJECT_DIR" ]; then
    print_error "Project directory $PROJECT_DIR not found!"
    exit 1
fi

cd "$PROJECT_DIR"
print_status "Changed to project directory: $PROJECT_DIR"

    PACKAGE_MANAGER="pnpm"
    INSTALL_CMD="pnpm install"
    BUILD_CMD="pnpm build"
    SERVER_BUILD_CMD="pnpm build"

# Install root dependencies
print_status "Installing root dependencies..."
$INSTALL_CMD

# Build frontend
print_status "Building frontend..."
cd app
$INSTALL_CMD
$BUILD_CMD

# Check if build was successful
if [ ! -d "dist" ]; then
    print_error "Frontend build failed - dist directory not found!"
    exit 1
fi

print_status "Frontend build completed successfully"

# Copy frontend files to Nginx root
print_status "Copying frontend files to Nginx root..."
if [ ! -d "$NGINX_ROOT" ]; then
    print_warning "Nginx root directory $NGINX_ROOT does not exist. Creating it..."
    sudo mkdir -p "$NGINX_ROOT"
fi

# Remove old files
sudo rm -rf "$NGINX_ROOT"/*

# Copy new files
sudo cp -r dist/* "$NGINX_ROOT"/

print_status "Frontend files copied to $NGINX_ROOT"

# Build and start server
print_status "Building and starting server..."
cd ../server

# Set environment variables for production
export NODE_ENV=production
export SERVER_PORT=$SERVER_PORT
export ORIGIN="https://estimator.madeby.dev"

# Install server dependencies
$INSTALL_CMD

# Build server
$SERVER_BUILD_CMD

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    print_warning "PM2 not found. Installing PM2 globally..."
    if [ "$PACKAGE_MANAGER" = "pnpm" ]; then
        pnpm add -g pm2
    else
        npm install -g pm2
    fi
fi

# Stop existing PM2 process if running
print_status "Stopping existing PM2 process (if any)..."
pm2 stop "$PM2_APP_NAME" 2>/dev/null || true
pm2 delete "$PM2_APP_NAME" 2>/dev/null || true

# Start server with PM2
print_status "Starting server with PM2..."
pm2 start dist/index.js --name "$PM2_APP_NAME" --env NODE_ENV=production --env SERVER_PORT=$SERVER_PORT --env ORIGIN="https://estimator.madeby.dev"

# Save PM2 configuration
pm2 save

print_status "Deployment completed successfully! 🎉"
print_status "Frontend: https://estimator.madeby.dev"
print_status "WebSocket: wss://estimator-ws.madeby.dev"
print_status "Server running on port $SERVER_PORT"

# Show PM2 status
print_status "PM2 status:"
pm2 list

echo ""
print_status "To check server logs: pm2 logs $PM2_APP_NAME"
print_status "To restart server: pm2 restart $PM2_APP_NAME"
print_status "To stop server: pm2 stop $PM2_APP_NAME"