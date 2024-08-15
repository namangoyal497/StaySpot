# 🚀 StaySpot Deployment Guide

## 📋 Overview
This guide will help you deploy StaySpot (Vacation Rental Platform) to Render.com with a single URL for both frontend and backend.

## 🔗 Repository Information
- **GitHub Repository:** `https://github.com/namangoyal497/StaySpot.git`
- **Project Name:** StaySpot
- **Deployment Type:** Full-stack (React + Node.js)

## 🛠️ Render.com Setup

### Step 1: Create New Web Service
1. Go to [Render.com](https://render.com) and sign in
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account if not already connected
4. Select the repository: `namangoyal497/StaySpot`

### Step 2: Configure Service Settings

**Basic Settings:**
- **Name:** `stayspot-app` (or your preferred name)
- **Environment:** `Node`
- **Region:** Choose closest to your users
- **Branch:** `main`

**Build & Deploy Settings:**
- **Build Command:**
  ```bash
  cd server && npm install && cd ../client && npm install && npm run build
  ```
- **Start Command:**
  ```bash
  cd server && npm start
  ```

### Step 3: Environment Variables

Add these environment variables in Render dashboard:

| Variable Name | Value | Description |
|---------------|-------|-------------|
| `NODE_ENV` | `production` | Production environment |
| `REACT_APP_API_URL` | `https://your-app-name.onrender.com` | API base URL (replace with your actual Render URL) |
| `MONGO_URL` | `your_mongodb_connection_string` | MongoDB connection string |
| `PORT` | `10000` | Server port (Render will override this) |

**Important:** Replace `your-app-name` with your actual Render service name.

### Step 4: MongoDB Setup

1. **Create MongoDB Atlas Cluster:**
   - Go to [MongoDB Atlas](https://cloud.mongodb.com)
   - Create a new cluster (free tier available)
   - Create a database user with read/write permissions
   - Get your connection string

2. **Connection String Format:**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/StaySpot?retryWrites=true&w=majority
   ```

3. **Add to Render Environment Variables:**
   - Variable: `MONGO_URL`
   - Value: Your MongoDB connection string

## 🔧 How It Works

### Single URL Architecture
```
https://your-app-name.onrender.com/
├── / (React App - Home Page)
├── /login (React App - Login Page)
├── /register (React App - Register Page)
├── /auth/* (API - Authentication)
├── /users/* (API - User Management)
├── /properties/* (API - Property Listings)
├── /bookings/* (API - Booking Management)
└── /blog/* (API - Blog Posts)
```

### Request Flow
1. **Static Files:** React build files served by Express
2. **API Requests:** Handled by Node.js backend
3. **React Routing:** Fallback to `index.html` for client-side routing

## 🚀 Deployment Steps

### 1. Automatic Deployment
- Render will automatically deploy when you push to GitHub
- Build process: ~5-10 minutes
- First deployment may take longer

### 2. Manual Deployment (if needed)
```bash
# In your local repository
git add .
git commit -m "Update for deployment"
git push origin main
```

### 3. Monitor Deployment
- Check Render dashboard for build logs
- Monitor environment variables
- Test the live URL

## 🔍 Troubleshooting

### Common Issues:

**1. Build Fails**
- Check if all dependencies are in `package.json`
- Verify Node.js version compatibility
- Check build logs in Render dashboard

**2. API Calls Fail**
- Verify `REACT_APP_API_URL` environment variable
- Check MongoDB connection string
- Ensure all environment variables are set

**3. Images Not Loading**
- Check file paths in production
- Verify static file serving configuration
- Check image upload functionality

**4. Database Connection Issues**
- Verify MongoDB Atlas network access
- Check connection string format
- Ensure database user has correct permissions

### Debug Commands:
```bash
# Check environment variables
echo $NODE_ENV
echo $REACT_APP_API_URL
echo $MONGO_URL

# Check server logs
cd server && npm start
```

## 📱 Testing Your Deployment

### 1. Basic Functionality
- [ ] Home page loads
- [ ] Property listings display
- [ ] Images load correctly
- [ ] Navigation works

### 2. User Features
- [ ] Registration works
- [ ] Login works
- [ ] User profile accessible
- [ ] Wishlist functionality

### 3. Property Features
- [ ] Property details page
- [ ] Booking functionality
- [ ] Search and filters
- [ ] Category navigation

### 4. Blog Features
- [ ] Blog posts display
- [ ] Like functionality
- [ ] Comment system
- [ ] Create/edit posts

## 🔒 Security Checklist

- [ ] Environment variables set (no hardcoded secrets)
- [ ] MongoDB connection secure
- [ ] API endpoints protected
- [ ] File uploads secured
- [ ] CORS configured properly

## 📊 Performance Optimization

### For Production:
1. **Enable Caching** in Render dashboard
2. **Optimize Images** before upload
3. **Minimize Bundle Size** (already done with build)
4. **Monitor Performance** in Render analytics

## 🆘 Support

If you encounter issues:
1. Check Render build logs
2. Verify environment variables
3. Test locally first
4. Check MongoDB Atlas status
5. Review server logs in Render dashboard

## 🎉 Success!

Once deployed, your StaySpot application will be available at:
```
https://your-app-name.onrender.com
```

**Features Available:**
- ✅ User registration and authentication
- ✅ Property listings with images
- ✅ Wishlist functionality
- ✅ Booking system
- ✅ Blog posts with likes/comments
- ✅ Responsive design
- ✅ Search and filtering
- ✅ Category navigation

---

**Happy Deploying! 🏠✨** 