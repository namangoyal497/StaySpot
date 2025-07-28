# LiveHere Deployment Guide

## Overview
This guide will help you deploy your LiveHere application to Render.com.

## Prerequisites
1. GitHub repository with your code
2. MongoDB Atlas account (for cloud database)
3. Render.com account

## Step 1: Set up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and cluster
3. Get your connection string
4. Example connection string: `mongodb+srv://username:password@cluster.mongodb.net/livehere`

## Step 2: Deploy Backend to Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `livehere-backend`
   - **Root Directory**: Leave empty (deploy from root)
   - **Environment**: `Node`
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Plan**: Free

5. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `MONGO_URL`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A strong secret key (e.g., `your-super-secret-jwt-key-here`)

6. Click "Create Web Service"

## Step 3: Deploy Frontend to Render

1. In Render Dashboard, click "New +" → "Static Site"
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `livehere-frontend`
   - **Root Directory**: Leave empty
   - **Build Command**: `cd client && npm install && npm run build`
   - **Publish Directory**: `client/build`

4. Add Environment Variable:
   - `REACT_APP_API_URL`: Your backend URL (e.g., `https://livehere-backend.onrender.com`)

5. Click "Create Static Site"

## Step 4: Update Frontend API Calls

The frontend is configured to use environment variables for API calls. Make sure all pages use the `apiCall` utility:

```javascript
import { apiCall } from "../utils/api";

// Instead of:
// fetch("http://127.0.0.1:3001/auth/login", {...})

// Use:
// apiCall("/auth/login", {...})
```

## Step 5: Test Your Deployment

1. Backend should be available at: `https://your-backend-name.onrender.com`
2. Frontend should be available at: `https://your-frontend-name.onrender.com`

## Troubleshooting

### Common Issues:

1. **Build Fails**: Check that all dependencies are in package.json
2. **Database Connection**: Verify MongoDB connection string
3. **CORS Issues**: Backend has CORS enabled for all origins
4. **Environment Variables**: Make sure all required variables are set

### Local Testing:

1. Create `.env` file in server directory:
   ```env
   PORT=5000
   MONGO_URL=mongodb://localhost:27017/livehere
   JWT_SECRET=your-secret-key
   ```

2. Create `.env` file in client directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000
   ```

3. Start server: `cd server && npm run dev`
4. Start client: `cd client && npm start`

## File Structure for Deployment

```
livehere/
├── client/
│   ├── package.json          ✅ Required
│   ├── src/
│   └── .env                  ❌ Not in git (sensitive)
├── server/
│   ├── package.json          ✅ Required
│   ├── models/               ✅ Required
│   ├── routes/               ✅ Required
│   └── .env                  ❌ Not in git (sensitive)
├── .gitignore               ✅ Required
├── render.yaml              ✅ Optional (for auto-deploy)
└── README.md                ✅ Required
```

## Environment Variables Summary

### Backend (.env):
- `PORT`: Server port (5000 for local, 10000 for Render)
- `MONGO_URL`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens

### Frontend (.env):
- `REACT_APP_API_URL`: Backend API URL

## Security Notes

1. Never commit `.env` files to Git
2. Use strong JWT secrets in production
3. Enable MongoDB Atlas network access for Render IPs
4. Consider using environment-specific configurations

## Support

If you encounter issues:
1. Check Render logs in the dashboard
2. Verify environment variables are set correctly
3. Test locally first
4. Check MongoDB Atlas connection 