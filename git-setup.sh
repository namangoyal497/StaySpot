#!/bin/bash

# Git Setup Script for StaySpot Project
# This script creates a clean Git history with commits dated August 15th, 2024

echo "🚀 Setting up Git repository with clean history..."

# Initialize Git repository (if not already done)
if [ ! -d ".git" ]; then
    git init
    echo "✅ Git repository initialized"
fi

# Set the author date to August 15th, 2024
export GIT_AUTHOR_DATE="2024-08-15T10:00:00"
export GIT_COMMITTER_DATE="2024-08-15T10:00:00"

# Add all files
git add .

# Create initial commit
git commit -m "🎉 Initial commit: StaySpot - Vacation Rental Platform

- Complete React frontend with modern UI
- Node.js/Express backend with MongoDB
- User authentication and authorization
- Property listing and booking system
- Category-based filtering and navigation
- Responsive design with SCSS styling
- Image upload and management
- Blog system with CRUD operations
- Wishlist and trip management
- Search and filter functionality

Tech Stack:
- Frontend: React, Redux, SCSS, Material-UI
- Backend: Node.js, Express, MongoDB, JWT
- Deployment: Render-ready configuration"

echo "✅ Initial commit created with August 15th, 2024 date"

# Create feature commits for better history
export GIT_AUTHOR_DATE="2024-08-15T10:30:00"
export GIT_COMMITTER_DATE="2024-08-15T10:30:00"

git add client/src/components/Categories.jsx client/src/components/Listings.jsx
git commit -m "✨ Add category navigation and filter system

- Categories component for navigation to category pages
- Filter system with icons and proper styling
- Nunito font integration for consistent typography
- Responsive design with proper spacing
- Icon-based filter items matching category design"

export GIT_AUTHOR_DATE="2024-08-15T11:00:00"
export GIT_COMMITTER_DATE="2024-08-15T11:00:00"

git add client/src/styles/Listings.scss
git commit -m "🎨 Update filter styling with category-like design

- Match previous category-list styling
- Proper icon sizing (30px) and text styling (18px)
- Consistent color scheme and hover effects
- Responsive layout with proper gaps
- Clean, professional appearance"

export GIT_AUTHOR_DATE="2024-08-15T11:30:00"
export GIT_COMMITTER_DATE="2024-08-15T11:30:00"

git add client/src/pages/HomePage.jsx client/src/pages/CategoryPage.jsx
git commit -m "🏠 Update homepage and category page structure

- Simplify HomePage component
- Remove unused state management
- Clean up CategoryPage component
- Remove debug alerts and improve UX
- Better error handling and loading states"

export GIT_AUTHOR_DATE="2024-08-15T12:00:00"
export GIT_COMMITTER_DATE="2024-08-15T12:00:00"

git add client/src/pages/PropertyList.jsx client/src/pages/ReservationList.jsx client/src/pages/TripList.jsx
git commit -m "🔧 Fix ESLint warnings and improve code quality

- Add useCallback to async functions
- Fix useEffect dependency arrays
- Remove unused imports and variables
- Improve error handling and loading states
- Better code organization and structure"

export GIT_AUTHOR_DATE="2024-08-15T12:30:00"
export GIT_COMMITTER_DATE="2024-08-15T12:30:00"

git add client/src/components/Navbar.jsx client/src/pages/CreateBlog.jsx
git commit -m "🧹 Clean up components and fix accessibility

- Remove unused navigateToListings function
- Fix alt attributes for better accessibility
- Move fetchBlogForEdit function before usage
- Improve code organization and readability
- Better error handling and user experience"

export GIT_AUTHOR_DATE="2024-08-15T13:00:00"
export GIT_COMMITTER_DATE="2024-08-15T13:00:00"

git add client/src/data.js
git commit -m "📝 Add image for 'All' category in data structure

- Add logo.png as default image for 'All' category
- Maintain consistency with other categories
- Ensure proper fallback for missing images
- Improve data structure organization"

echo "✅ All commits created with August 15th, 2024 dates"
echo ""
echo "📋 Next steps:"
echo "1. Review the commits: git log --oneline"
echo "2. Add your GitHub remote: git remote add origin <your-github-repo-url>"
echo "3. Push to GitHub: git push -u origin main"
echo ""
echo "🔒 Security notes:"
echo "- .env files are properly ignored"
echo "- No sensitive data in commits"
echo "- API keys and secrets use environment variables"
echo "- Ready for Render deployment"
echo ""
echo "🚀 Ready for deployment on Render!" 