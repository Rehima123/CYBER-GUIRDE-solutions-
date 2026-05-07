# 🚀 Quick Start Guide

Get your Cyber Guard Solutions website running in 5 minutes!

## Option 1: Automated Setup (Recommended)

### Windows
```bash
scripts\setup.bat
```

### macOS/Linux
```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

## Option 2: Manual Setup

### 1. Install Dependencies
```bash
npm run install-all
```

### 2. Configure Environment
```bash
# Copy example environment file
cp backend/.env.example backend/.env

# Edit with your settings
# Minimum required: MONGODB_URI and JWT_SECRET
```

### 3. Start Development
```bash
npm run dev
```

Visit:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000/api/health

## 🎯 What You Get

✅ Modern React frontend with Tailwind CSS  
✅ Secure Node.js + Express backend  
✅ MongoDB database integration  
✅ AI-powered chatbot assistant  
✅ Contact form with email notifications  
✅ User authentication system  
✅ Responsive mobile-first design  
✅ Security best practices built-in  

## 📋 Prerequisites

- Node.js 18+ ([Download](https://nodejs.org))
- MongoDB ([Local](https://www.mongodb.com/try/download/community) or [Atlas](https://www.mongodb.com/cloud/atlas))

## 🔑 Get API Keys (Optional but Recommended)

### For AI Assistant
Choose one:
- **OpenAI**: Get key at [platform.openai.com](https://platform.openai.com)
- **Gemini**: Get key at [makersuite.google.com](https://makersuite.google.com/app/apikey)

Add to `backend/.env`:
```env
OPENAI_API_KEY=sk-your-key-here
# OR
GEMINI_API_KEY=your-key-here
```

### For Email Notifications
Use Gmail with app password:
1. Enable 2FA on Gmail
2. Generate app password at [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Add to `backend/.env`:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

## 🎨 Customize Your Site

### Update Content
Edit files in `frontend/src/pages/`:
- `Home.jsx` - Homepage content
- `Services.jsx` - Services page
- `About.jsx` - About page
- `Contact.jsx` - Contact page

### Update Branding
- Logo: `frontend/src/components/Navbar.jsx`
- Colors: `frontend/tailwind.config.js`
- Footer: `frontend/src/components/Footer.jsx`

## 🚀 Deploy Your Site

### Quick Deploy Options

#### Vercel (Frontend) - Free
```bash
cd frontend
npm install -g vercel
vercel --prod
```

#### Render (Backend) - Free Tier
1. Push code to GitHub
2. Go to [render.com](https://render.com)
3. Connect repository
4. Deploy

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## 📚 Documentation

- [README.md](README.md) - Full documentation
- [SETUP.md](SETUP.md) - Detailed setup guide
- [API.md](API.md) - API documentation
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guide

## 🆘 Troubleshooting

### Port Already in Use
```bash
npx kill-port 3000
npx kill-port 5000
```

### MongoDB Connection Error
Make sure MongoDB is running:
```bash
# Check connection
mongosh

# Start MongoDB (if local)
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod
# Windows: net start MongoDB
```

### Module Not Found
```bash
rm -rf node_modules frontend/node_modules backend/node_modules
npm run install-all
```

## 💡 Tips

1. **Use MongoDB Atlas** for easy cloud database (free tier available)
2. **Get API keys** for full AI assistant functionality
3. **Test locally** before deploying
4. **Read DEPLOYMENT.md** for production setup
5. **Check API.md** for endpoint documentation

## 📞 Support

- Email: info@cyberguard.com
- Phone: +251 925 259 536

## ⭐ Features Checklist

After setup, test these features:

- [ ] Homepage loads correctly
- [ ] Navigation works
- [ ] Services page displays
- [ ] Contact form submits
- [ ] AI assistant responds
- [ ] Mobile responsive
- [ ] All pages accessible

## 🎉 You're Ready!

Your cybersecurity solutions website is now running. Start customizing and deploy when ready!

**Next Steps:**
1. Customize content and branding
2. Add your API keys for full features
3. Test all functionality
4. Deploy to production
5. Share with the world! 🌍
