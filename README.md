# LiveHere - Rental Application

A full-stack rental application built with React (frontend) and Node.js/Express (backend).

## Project Structure

```
livehere/
├── client/          # React frontend
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── redux/
│       └── styles/
└── server/          # Node.js backend
    ├── routes/
    ├── public/
    └── index.js
```

## Local Development Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)

### Backend Setup
1. Navigate to server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp env.example .env
   ```
   Then edit `.env` with your MongoDB connection string and JWT secret.

4. Start the server:
   ```bash
   npm run dev
   ```
   Server will run on http://localhost:5000

### Frontend Setup
1. Navigate to client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the React app:
   ```bash
   npm start
   ```
   App will run on http://localhost:3000

## Environment Variables

Create a `.env` file in the server directory with:

```env
PORT=5000
MONGO_URL=mongodb://localhost:27017/livehere
JWT_SECRET=your_secret_key_here
```

## Deployment on Render

### Backend Deployment
1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**: Add your MongoDB connection string and JWT secret

### Frontend Deployment
1. Create a new Static Site service on Render
2. Configure:
   - **Build Command**: `cd client && npm install && npm run build`
   - **Publish Directory**: `client/build`

## Features
- User authentication (register/login)
- Property listings
- Booking system
- Wishlist functionality
- Search and filtering
- Responsive design

## Technologies Used
- **Frontend**: React, Redux, React Router, SCSS
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Authentication**: JWT
- **File Upload**: Multer 