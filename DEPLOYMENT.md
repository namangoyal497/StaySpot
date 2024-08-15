# 🚀 StaySpot Deployment Guide

## 📋 Prerequisites

- GitHub repository with your code
- Render account
- MongoDB database (MongoDB Atlas recommended)

## 🔧 Environment Variables

### Backend Environment Variables (Server)

Create these in your Render backend service:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# Server Configuration
PORT=3001
NODE_ENV=production

# CORS (if needed)
CORS_ORIGIN=https://your-frontend-domain.onrender.com
```

### Frontend Environment Variables (Client)

Create these in your Render frontend service:

```env
# API Configuration
REACT_APP_API_URL=https://your-backend-domain.onrender.com

# Build Configuration
GENERATE_SOURCEMAP=false
```

## 🏗️ Render Setup

### 1. Backend Service

1. **Create New Web Service**
   - Connect your GitHub repository
   - Name: `stayspot-backend`
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`

2. **Environment Variables**
   - Add all backend environment variables listed above

3. **Auto-Deploy**
   - Enable auto-deploy from main branch

### 2. Frontend Service

1. **Create New Static Site**
   - Connect your GitHub repository
   - Name: `stayspot-frontend`
   - Root Directory: `client`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `build`

2. **Environment Variables**
   - Add all frontend environment variables listed above

3. **Auto-Deploy**
   - Enable auto-deploy from main branch

## 🔒 Security Checklist

✅ **Environment Variables**
- All sensitive data moved to environment variables
- No hardcoded secrets in code
- JWT_SECRET properly configured

✅ **Database Security**
- MongoDB connection string secured
- Database user with minimal required permissions
- Network access properly configured

✅ **API Security**
- CORS properly configured
- JWT authentication implemented
- Input validation on all endpoints

✅ **File Upload Security**
- File type validation
- File size limits
- Secure file storage

## 📁 File Structure for Deployment

```
stayspot/
├── client/                 # Frontend (React)
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── build/             # Generated on build
├── server/                # Backend (Node.js)
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── public/uploads/    # User uploaded files
│   └── package.json
├── .gitignore            # Properly configured
├── render.yaml           # Render configuration
└── README.md
```

## 🚀 Deployment Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "🚀 Deploy to Render"
   git push origin main
   ```

2. **Create Render Services**
   - Backend: Web Service
   - Frontend: Static Site

3. **Configure Environment Variables**
   - Add all required environment variables

4. **Deploy**
   - Render will automatically build and deploy
   - Monitor deployment logs for any issues

## 🔍 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies in package.json
   - Check build logs for specific errors

2. **Environment Variables**
   - Ensure all variables are properly set
   - Check variable names match code
   - Verify no typos in values

3. **Database Connection**
   - Verify MongoDB URI is correct
   - Check network access from Render
   - Ensure database is running

4. **CORS Issues**
   - Update CORS_ORIGIN to match frontend URL
   - Check browser console for CORS errors

### Monitoring

- Use Render's built-in logging
- Monitor application performance
- Set up alerts for downtime

## 📞 Support

If you encounter issues:
1. Check Render deployment logs
2. Verify environment variables
3. Test locally with production settings
4. Check MongoDB connection

## 🎉 Success!

Once deployed, your StaySpot application will be available at:
- Frontend: `https://your-app-name.onrender.com`
- Backend: `https://your-backend-name.onrender.com`

The application will automatically restart on code changes and maintain high availability. 