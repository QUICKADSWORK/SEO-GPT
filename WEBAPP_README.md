# 🎯 Domain Metrics Web App

**Beautiful web interface to check Domain Rating & US Traffic for any website!**

![Status](https://img.shields.io/badge/status-ready-green)
![Python](https://img.shields.io/badge/python-3.9+-blue)
![Flask](https://img.shields.io/badge/flask-3.0-lightgrey)

---

## ✨ Features

- 🎨 **Beautiful Modern UI** - Purple gradient design, fully responsive
- ⚡ **Fast Analysis** - Check up to 20 domains in seconds
- 📊 **Live Results** - Real-time table with color-coded DR badges
- 💾 **CSV Export** - Download results with one click
- 📱 **Mobile Friendly** - Works perfectly on all devices
- 🔒 **Secure** - SEMrush API integration

---

## 🚀 Quick Start (30 seconds)

### Run Locally

```bash
# 1. Install Flask (if needed)
pip3 install flask

# 2. Start the app
./run_webapp.sh
```

**That's it!** Open **http://localhost:5000** in your browser! 🎉

---

## 📸 Screenshots

### Main Interface
```
┌─────────────────────────────────────────┐
│   🎯 Domain Metrics Analyzer            │
│   Get Domain Rating & US Traffic        │
├─────────────────────────────────────────┤
│                                          │
│   Enter Domains                          │
│   ┌────────────────────────────────────┐│
│   │ stripe.com                         ││
│   │ shopify.com                        ││
│   │ salesforce.com                     ││
│   └────────────────────────────────────┘│
│                                          │
│   [📝 Load Example]  [🗑️ Clear]        │
│                                          │
│   [      🚀 Analyze Domains      ]      │
└─────────────────────────────────────────┘
```

### Results Table
```
┌──────────────────────────────────────────────────────────┐
│  Results                            [📥 Export CSV]      │
├──────────────────────────────────────────────────────────┤
│  # │ Domain        │ DR    │ US Traffic │ Status         │
├────┼───────────────┼───────┼────────────┼────────────────┤
│  1 │ stripe.com    │ [81]  │ 4,052,024  │ ✓ Success      │
│  2 │ shopify.com   │ [81]  │ 12,095,133 │ ✓ Success      │
│  3 │ salesforce.com│ [81]  │ 8,231,838  │ ✓ Success      │
└──────────────────────────────────────────────────────────┘
```

---

## 🎨 UI Preview

**Color-Coded DR Badges:**
- 🟢 **60+** = High Authority (Green)
- 🟡 **30-59** = Medium Authority (Orange)  
- 🔴 **0-29** = Low Authority (Red)

**Features:**
- Gradient header with emoji icons
- Smooth animations and hover effects
- Loading spinner during analysis
- Responsive design (works on phones!)
- Stats summary (avg DR, total traffic)

---

## 🌐 Deploy to Production

### Option 1: Render.com (Easiest, Free!)

1. **Sign up** at https://render.com
2. **Create New Web Service** from GitHub repo
3. **Auto-deploys** from `render.yaml`!

**Live in 2 minutes!** ✨

### Option 2: Heroku

```bash
heroku create my-domain-analyzer
git push heroku main
heroku open
```

### Option 3: Vercel (Serverless)

```bash
npm i -g vercel
vercel
```

### Option 4: Your Own Server

```bash
# SSH to your server
ssh user@yourserver.com

# Run with Gunicorn
gunicorn --bind 0.0.0.0:80 app:app
```

**Full deployment guide:** See `WEBAPP_DEPLOYMENT.md`

---

## 📖 How to Use

### 1. Enter Domains

Paste domains in the text area:
- One per line: `stripe.com`
- Comma-separated: `stripe.com, shopify.com`
- Mixed format: Works!

**Max:** 20 domains at once

### 2. Analyze

Click **"🚀 Analyze Domains"**

Wait a few seconds (depends on # of domains)

### 3. View Results

Beautiful table shows:
- Domain Rating (0-100)
- US Traffic (monthly visits)
- Status (success/error)

### 4. Export

Click **"📥 Export CSV"** to download results

---

## 🔧 Technical Details

### Stack
- **Backend:** Python 3.9 + Flask
- **Frontend:** Vanilla JavaScript (no frameworks!)
- **Styling:** Custom CSS with gradients
- **API:** SEMrush via RapidAPI
- **Server:** Gunicorn (production)

### File Structure
```
domain-metrics-app/
├── app.py                    # Flask backend
├── domain_metrics_agent.py   # API logic
├── templates/
│   └── index.html           # HTML
├── static/
│   ├── css/style.css        # Styles
│   └── js/script.js         # Frontend JS
├── requirements.txt         # Dependencies
├── Procfile                 # Heroku config
└── render.yaml              # Render config
```

### API Endpoints

**POST /analyze**
```json
{
  "domains": "stripe.com\nshopify.com"
}
```

**Response:**
```json
{
  "success": true,
  "results": [
    {
      "domain": "stripe.com",
      "domain_rating": 81.0,
      "us_traffic": 4052024,
      "status": "success"
    }
  ]
}
```

**POST /export**
- Returns CSV file download

---

## 🎯 Example Usage

### Try These Domains:

**SaaS Companies:**
```
stripe.com
shopify.com
salesforce.com
hubspot.com
```

**AI Ad Tools:**
```
predis.ai
creatify.ai
adcreative.ai
quickads.ai
```

**Your Competitors:**
Just paste any domains you want to analyze!

---

## 🔒 Security

### Before Public Deployment:

1. **Move API key to env var:**
```python
RAPIDAPI_KEY = os.getenv('RAPIDAPI_KEY')
```

2. **Add rate limiting:**
```bash
pip install flask-limiter
```

3. **Enable HTTPS** (automatic on Render/Heroku)

4. **Set domain limit** (already set to 20)

---

## 📊 Metrics Explained

### Domain Rating (DR)
- 0-100 score of domain authority
- Based on backlinks & keyword rankings
- Higher = stronger SEO presence
- Formula: `(keyword_count_score) - 19`

### US Traffic
- Estimated monthly visits from USA
- Based on organic search traffic
- Includes direct, referral, social sources
- Real numbers from SEMrush data

---

## 🐛 Troubleshooting

### Port already in use
```bash
# Kill process on port 5000
lsof -i :5000
kill -9 <PID>
```

### Flask not found
```bash
pip3 install flask
```

### API errors
- Check RapidAPI dashboard for rate limits
- Verify API key is set correctly
- Wait a few seconds between requests

---

## 🚀 Performance

**Speed:**
- ~2 seconds per domain
- Parallel processing for batches
- Optimized with 1-2s delay between requests

**Limits:**
- Max 20 domains per request
- RapidAPI rate limits apply
- Recommended: 10 domains at a time

---

## 💡 Pro Tips

1. **Keyboard shortcut:** Ctrl+Enter to analyze
2. **Example button:** Click to load sample domains
3. **Mobile:** Swipe table horizontally to see all columns
4. **Export:** Download results before closing page
5. **Bookmark:** Save the URL for quick access

---

## 🎨 Customization

### Change Colors

Edit `static/css/style.css`:

```css
/* Primary gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* DR badge colors */
.dr-high { background: #10b981; }   /* Green */
.dr-medium { background: #f59e0b; } /* Orange */
.dr-low { background: #ef4444; }    /* Red */
```

### Add Features

Want to add more? Edit:
- `app.py` - Backend logic
- `templates/index.html` - Layout
- `static/js/script.js` - Frontend behavior

---

## 📈 Future Enhancements

Ideas for v2:

- [ ] User accounts & authentication
- [ ] Save analysis history
- [ ] Scheduled monitoring
- [ ] Email reports
- [ ] Trend charts over time
- [ ] Competitor comparison
- [ ] API key management
- [ ] Bulk CSV upload
- [ ] More metrics (backlinks, keywords, etc.)

---

## 🎉 You're Ready!

**Local Development:**
```bash
./run_webapp.sh
```

**Production Deployment:**
See `WEBAPP_DEPLOYMENT.md` for detailed guides!

**Questions?** Check the main README or open an issue!

---

## 📝 License

MIT License - Feel free to use and modify!

**Built with ❤️ using Flask & SEMrush API**

