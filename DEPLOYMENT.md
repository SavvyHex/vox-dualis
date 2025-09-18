# Vox Dualis Deployment Guide

## 🚀 Quick Deployment Options

### Option 1: Vercel (Recommended for Hackathons)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy from project root:**
   ```bash
   vercel
   ```

3. **Add environment variables in Vercel dashboard:**
   - GEMINI_API_KEY_1
   - GEMINI_API_KEY_2  
   - GEMINI_API_KEY_3

### Option 2: Railway

1. **Go to [railway.app](https://railway.app)**
2. **Connect your GitHub repo**
3. **Deploy both services:**
   - Backend: Detects Python automatically
   - Frontend: Detects Next.js automatically
4. **Add environment variables in Railway dashboard**

### Option 3: Separate Hosting

**Backend (Choose one):**
- Render: Connect GitHub → Web Service
- Heroku: `git push heroku main`
- Google Cloud Run: Use gcloud CLI

**Frontend:**
- Vercel: `vercel --prod`
- Netlify: Drag & drop build folder

## 🔧 Environment Variables

Make sure to set these in your hosting platform:
```
GEMINI_API_KEY_1=your_first_key
GEMINI_API_KEY_2=your_second_key  
GEMINI_API_KEY_3=your_third_key
```

## 📱 Frontend API Configuration

Update your frontend to use the deployed backend URL:
```javascript
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-url.com'
  : 'http://localhost:8000';
```

## 🎯 Quick Start for Demo

For fastest deployment during hackathon:

1. **Push to GitHub**
2. **Connect Railway to your repo**
3. **Add environment variables**
4. **Get URLs and demo!**

Both services will be live within 5-10 minutes!
