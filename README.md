# LeetCode Clone

A full-stack coding platform built with MERN stack and Judge0.

## Features
- User Authentication (Login/Signup)
- Problem List & Details
- Code Editor (Monaco)
- Code Execution (Judge0)
- Admin Panel to Add Problems

## Setup

### Prerequisites
- Node.js
- MongoDB
- Judge0 API Key (RapidAPI)

### Installation

1. **Server Setup**
   ```bash
   cd server
   npm install
   cp .env.example .env # Configure your .env
   npm run dev
   ```

2. **Client Setup**
   ```bash
   cd client
   npm install
   npm run dev
   ```

## Environment Variables

### Server (.env)
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/leetcode_clone
JWT_SECRET=your_secret
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
JUDGE0_API_KEY=your_rapidapi_key
```

## Tech Stack
- **Frontend**: React, Vite, TailwindCSS, Monaco Editor
- **Backend**: Node.js, Express, MongoDB
- **Execution**: Judge0 API
