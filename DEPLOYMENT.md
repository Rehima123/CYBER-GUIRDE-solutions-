# Deployment Guide

## Quick Deployment Options

### 1. Vercel (Frontend) + Render (Backend) - Recommended

#### Frontend on Vercel
```bash
cd frontend
npm install -g vercel
vercel login
vercel --prod
```

Set environment variables in Vercel dashboard:
- Add your backend API URL

#### Backend on Render
1. Go to render.com
2. Create new Web Service
3. Connect GitHub repository
4. Configure:
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
5. Add environment variables from `.env.example`
6. Deploy

### 2. Railway (Full Stack)

```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

Add environment variables in Railway dashboard.

### 3. Heroku (Backend)

```bash
# Install Heroku CLI
heroku login
heroku create cyber-guard-api

# Add MongoDB addon
heroku addons:create mongolab:sandbox

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=$(openssl rand -base64 32)
heroku config:set OPENAI_API_KEY=your-key

# Deploy
git subtree push --prefix backend heroku main
```

### 4. DigitalOcean App Platform

1. Connect GitHub repository
2. Configure build settings:
   - Frontend: `cd frontend && npm run build`
   - Backend: `cd backend && npm start`
3. Add environment variables
4. Deploy

### 5. AWS (EC2 + S3)

#### Frontend (S3 + CloudFront)
```bash
cd frontend
npm run build
aws s3 sync dist/ s3://your-bucket-name
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

#### Backend (EC2)
```bash
# SSH into EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
sudo apt-get install -y mongodb-org

# Clone and setup
git clone your-repo
cd cyber-guard-solutions/backend
npm install
npm install -g pm2

# Start with PM2
pm2 start server.js --name cyber-guard-api
pm2 startup
pm2 save

# Setup Nginx
sudo apt install nginx
sudo nano /etc/nginx/sites-available/cyberguard
```

Nginx config:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/cyberguard /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 6. Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d

# Or build manually
docker build -t cyber-guard-backend .
docker run -p 5000:5000 --env-file backend/.env cyber-guard-backend
```

### 7. Netlify (Frontend) + MongoDB Atlas (Database)

#### Frontend on Netlify
```bash
cd frontend
npm run build
netlify deploy --prod --dir=dist
```

#### MongoDB Atlas
1. Create account at mongodb.com/cloud/atlas
2. Create cluster (free tier available)
3. Get connection string
4. Add to backend environment variables

## Environment Variables Checklist

### Backend (.env)
- [ ] NODE_ENV=production
- [ ] PORT=5000
- [ ] MONGODB_URI=your-mongodb-connection-string
- [ ] JWT_SECRET=your-secret-key
- [ ] FRONTEND_URL=your-frontend-url
- [ ] OPENAI_API_KEY or GEMINI_API_KEY
- [ ] EMAIL_HOST, EMAIL_USER, EMAIL_PASSWORD (optional)

### Frontend
- [ ] VITE_API_URL=your-backend-url

## Post-Deployment Checklist

- [ ] Test all API endpoints
- [ ] Verify database connection
- [ ] Test contact form submission
- [ ] Test AI assistant
- [ ] Check mobile responsiveness
- [ ] Verify SSL certificate
- [ ] Test authentication flow
- [ ] Monitor error logs
- [ ] Set up monitoring (e.g., Sentry)
- [ ] Configure backups for database

## Monitoring & Maintenance

### Recommended Tools
- **Uptime Monitoring**: UptimeRobot, Pingdom
- **Error Tracking**: Sentry, LogRocket
- **Analytics**: Google Analytics, Plausible
- **Performance**: Lighthouse, WebPageTest

### Database Backups
```bash
# MongoDB backup
mongodump --uri="your-mongodb-uri" --out=/backup/$(date +%Y%m%d)

# Restore
mongorestore --uri="your-mongodb-uri" /backup/20240101
```

## Scaling Considerations

1. **Load Balancing**: Use Nginx or cloud load balancers
2. **Caching**: Implement Redis for session storage
3. **CDN**: Use CloudFlare or AWS CloudFront
4. **Database**: Consider MongoDB sharding for large datasets
5. **Horizontal Scaling**: Deploy multiple backend instances

## Security Checklist

- [ ] HTTPS enabled (SSL certificate)
- [ ] Environment variables secured
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] Database access restricted
- [ ] Regular security updates
- [ ] Backup strategy in place
- [ ] Monitoring and alerts set up

## Cost Estimates (Monthly)

### Free Tier Option
- Frontend: Vercel/Netlify (Free)
- Backend: Render (Free tier)
- Database: MongoDB Atlas (Free 512MB)
- **Total: $0/month**

### Production Option
- Frontend: Vercel Pro ($20)
- Backend: Render Standard ($25)
- Database: MongoDB Atlas M10 ($57)
- **Total: ~$100/month**

### Enterprise Option
- AWS/DigitalOcean: $200-500/month
- Includes: Load balancing, auto-scaling, monitoring

## Support

For deployment issues:
- Email: info@cyberguard.com
- Phone: +251 925 259 536
