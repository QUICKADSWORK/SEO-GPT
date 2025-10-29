# Domain Metrics Web App - Deployment Guide 🚀

Beautiful web interface for checking Domain Rating and US Traffic for any website.

## 🎯 Features

✅ **Beautiful Modern UI** - Gradient design, responsive layout
✅ **Batch Analysis** - Check up to 20 domains at once
✅ **Real-time Results** - Live updates as domains are analyzed
✅ **Export to CSV** - Download results with one click
✅ **Mobile Friendly** - Works on all devices
✅ **SEMrush Powered** - Accurate DR and traffic data

---

## 🏃 Quick Start (Local)

### 1. Install Dependencies

```bash
pip3 install flask requests
```

### 2. Run the App

```bash
./run_webapp.sh
```

Or manually:

```bash
python3 app.py
```

### 3. Open in Browser

Visit: **http://localhost:5000**

---

## 🌐 Deploy to Production

### Option 1: Deploy to Render (Free, Recommended)

1. **Create account** at https://render.com

2. **Create `render.yaml`** (already included):
```yaml
services:
  - type: web
    name: domain-metrics
    env: python
    buildCommand: "pip install -r requirements.txt"
    startCommand: "gunicorn app:app"
```

3. **Push to GitHub**:
```bash
git init
git add .
git commit -m "Domain Metrics Web App"
git remote add origin YOUR_GITHUB_REPO
git push -u origin main
```

4. **Connect Render to GitHub** and deploy!

**Live in 2 minutes!** ✨

---

### Option 2: Deploy to Heroku

1. **Install Heroku CLI**:
```bash
brew install heroku/brew/heroku
```

2. **Create Heroku app**:
```bash
heroku create domain-metrics-app
```

3. **Create Procfile**:
```bash
echo "web: gunicorn app:app" > Procfile
```

4. **Deploy**:
```bash
git init
heroku git:remote -a domain-metrics-app
git add .
git commit -m "Deploy Domain Metrics"
git push heroku main
```

5. **Open app**:
```bash
heroku open
```

---

### Option 3: Deploy to DigitalOcean App Platform

1. **Create account** at https://digitalocean.com

2. **Create new App** from GitHub repo

3. **Configure**:
   - Runtime: Python
   - Build Command: `pip install -r requirements.txt`
   - Run Command: `gunicorn app:app`

4. **Deploy!**

---

### Option 4: Deploy to AWS (EC2)

1. **Launch EC2 instance** (Ubuntu)

2. **SSH into server**:
```bash
ssh -i your-key.pem ubuntu@your-server-ip
```

3. **Install dependencies**:
```bash
sudo apt update
sudo apt install python3-pip nginx
pip3 install flask requests gunicorn
```

4. **Upload files**:
```bash
scp -r * ubuntu@your-server-ip:/home/ubuntu/domain-metrics/
```

5. **Run with Gunicorn**:
```bash
cd /home/ubuntu/domain-metrics
gunicorn --bind 0.0.0.0:5000 app:app
```

6. **Configure Nginx** (optional):
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
    }
}
```

---

### Option 5: Deploy to Vercel (Serverless)

1. **Install Vercel CLI**:
```bash
npm i -g vercel
```

2. **Create `vercel.json`**:
```json
{
  "builds": [{
    "src": "app.py",
    "use": "@vercel/python"
  }],
  "routes": [{
    "src": "/(.*)",
    "dest": "app.py"
  }]
}
```

3. **Deploy**:
```bash
vercel
```

---

## 🔧 Environment Variables

Set these in your hosting platform:

```bash
SEMRUSH_API_KEY=56b6f4dce1mshc3398ebe2b7bdf7p1a8c18jsn91e4f7fa09ae
```

---

## 📁 File Structure

```
domain-metrics-app/
├── app.py                      # Flask backend
├── domain_metrics_agent.py     # Core logic
├── requirements.txt            # Python dependencies
├── templates/
│   └── index.html             # Frontend HTML
├── static/
│   ├── css/
│   │   └── style.css          # Styles
│   └── js/
│       └── script.js          # Frontend logic
└── run_webapp.sh              # Local run script
```

---

## 🎨 UI Features

### Input Section
- 📝 Paste domains (one per line or comma-separated)
- 📋 Load example domains
- 🗑️ Clear all
- 🚀 Analyze button with loading state

### Results Section
- 📊 Summary stats (avg DR, total traffic)
- 📋 Beautiful table with color-coded DR badges
- 💾 Export to CSV
- 📱 Mobile responsive

### DR Color Coding
- 🟢 Green: DR 60+ (High authority)
- 🟡 Orange: DR 30-59 (Medium authority)
- 🔴 Red: DR 0-29 (Low authority)

---

## 🔒 Security Notes

⚠️ **Before deploying publicly**:

1. **Remove hardcoded API key** from `app.py`
2. **Use environment variables**:
```python
RAPIDAPI_KEY = os.getenv('RAPIDAPI_KEY')
```

3. **Add rate limiting**:
```bash
pip install flask-limiter
```

4. **Add authentication** (optional):
```bash
pip install flask-login
```

---

## 💰 Hosting Cost Comparison

| Platform | Free Tier | Paid | Best For |
|----------|-----------|------|----------|
| **Render** | ✅ Yes | $7/mo | Easy deployment |
| **Heroku** | ❌ No | $5/mo | Quick setup |
| **Vercel** | ✅ Yes | $20/mo | Serverless |
| **DigitalOcean** | ❌ No | $6/mo | Full control |
| **AWS EC2** | ✅ 12mo free | $5-10/mo | Scalability |

**Recommendation**: Start with **Render.com** (free tier) for testing!

---

## 🚀 Production Checklist

Before going live:

- [ ] Remove hardcoded API keys
- [ ] Set environment variables
- [ ] Add rate limiting (max requests/minute)
- [ ] Enable HTTPS
- [ ] Add Google Analytics (optional)
- [ ] Test on mobile devices
- [ ] Set up error logging
- [ ] Add domain limit (20 max)
- [ ] Configure CORS if needed

---

## 🐛 Troubleshooting

### App won't start
```bash
# Check if Flask is installed
pip3 install flask

# Check if port 5000 is available
lsof -i :5000
```

### API errors
```bash
# Verify API key is set
echo $SEMRUSH_API_KEY

# Check rate limits on RapidAPI dashboard
```

### Slow responses
```bash
# Increase worker processes (Gunicorn)
gunicorn --workers 4 app:app
```

---

## 📈 Next Steps

Want to enhance the app?

1. **Add authentication** - Login system
2. **Save history** - Database integration
3. **Scheduled checks** - Monitor domains daily
4. **Email reports** - Send CSV via email
5. **API endpoint** - Expose as REST API
6. **Competitor analysis** - Compare multiple domains
7. **Trend charts** - Track DR/traffic over time

---

## 🎉 You're All Set!

Your beautiful domain metrics analyzer is ready to deploy! 

**Local**: `./run_webapp.sh`
**Production**: Choose your platform above

Questions? Check the main README or create an issue!

