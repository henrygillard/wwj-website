#!/bin/bash
# WWJ Website — one-time git + GitHub setup
# Run this from inside the wwj-website folder: bash setup.sh

set -e

echo "🎸 Setting up WWJ website repo..."

# Configure git identity if not already set
if [ -z "$(git config --global user.email)" ]; then
  git config --global user.email "henrywyattgillard@gmail.com"
  git config --global user.name "Henry Gillard"
fi

# Init, branch, and commit
git init
git branch -M main
git add .
git commit -m "Initial commit: React + Vite + Express scaffold

- Vite React app with Nav, Hero, About, Gallery, Contact, Footer components
- CSS Modules for component-scoped styles
- Express server to serve built app in production
- Google Drive photo integration via thumbnail API
- Photo lightbox with keyboard support"

# Push to GitHub
git remote add origin https://github.com/henrygillard/wwj-website.git
git push -u origin main

echo ""
echo "✅ Done! Repo live at https://github.com/henrygillard/wwj-website"
echo ""
echo "To start dev server: npm run dev"
echo "To build for production: npm run build"
echo "To serve production build: npm run serve"
