#!/bin/bash
# Build script for Vercel deployment
echo "Starting build process..."
npm install
npm run build
echo "Build completed successfully!"
