# 🎯 Domain Metrics Analyzer

**Beautiful web app to check Domain Rating & US Traffic for any website!**

[![Python](https://img.shields.io/badge/python-3.9+-blue.svg)](https://www.python.org/downloads/)
[![Flask](https://img.shields.io/badge/flask-3.0-green.svg)](https://flask.palletsprojects.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-ready-success.svg)]()

![Domain Metrics Analyzer](https://img.shields.io/badge/SEMrush-Powered-orange)

---

## ✨ Features

- 🎨 **Beautiful Modern UI** - Purple gradient design, fully responsive
- ⚡ **Fast Analysis** - Check up to 20 domains in seconds
- 📊 **Live Results** - Real-time table with color-coded DR badges
- 💾 **CSV Export** - Download results with one click
- 📱 **Mobile Friendly** - Works perfectly on all devices
- 🔒 **Accurate Data** - SEMrush API with adjusted DR formula

---

## 🚀 Quick Start

### Run Locally (30 seconds)

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/domain-metrics-analyzer.git
cd domain-metrics-analyzer

# Install dependencies
pip3 install -r requirements.txt

# Set your RapidAPI key
export SEMRUSH_API_KEY="your-rapidapi-key-here"

# Run the app
python3 app.py
```

Open **http://localhost:5000** in your browser! 🎉

---

## 📸 Screenshots

### Main Interface
Beautiful purple gradient UI with easy domain input:

```
┌─────────────────────────────────────────┐
│   🎯 Domain Metrics Analyzer            │
│   Get Domain Rating & US Traffic        │
├─────────────────────────────────────────┤
│   Enter Domains                          │
│   ┌────────────────────────────────────┐│
│   │ stripe.com                         ││
│   │ shopify.com                        ││
│   │ quickads.ai                        ││
│   └────────────────────────────────────┘│
│   [🚀 Analyze Domains]                  │
└─────────────────────────────────────────┘
```

### Results Table
Color-coded DR badges and formatted traffic numbers:

| Domain | Domain Rating | US Traffic | Status |
|--------|---------------|------------|--------|
| quickads.ai | 🟢 56.1 | 26,800 | ✓ Success |
| creatify.ai | 🟢 59.8 | 53,580 | ✓ Success |
| predis.ai | 🟢 72.1 | 129,189 | ✓ Success |

---

## 🎯 Use Cases

- **SEO Analysis** - Check domain authority quickly
- **Competitor Research** - Compare multiple domains
- **Client Reports** - Export beautiful CSV reports
- **Link Building** - Evaluate potential partners
- **Market Research** - Analyze traffic patterns

---

## 🛠️ How It Works

1. **Paste Domains** - Enter up to 20 domains (one per line or comma-separated)
2. **Click Analyze** - SEMrush API fetches the data
3. **View Results** - Beautiful table with DR & traffic metrics
4. **Export CSV** - Download results for reports

### Technology Stack

- **Backend:** Python 3.9 + Flask
- **Frontend:** Vanilla JavaScript (no frameworks!)
- **Styling:** Custom CSS with gradients
- **API:** SEMrush via RapidAPI
- **Server:** Gunicorn (production)

---

## 📊 Metrics Explained

### Domain Rating (DR)
- **Scale:** 0-100
- **Meaning:** Domain authority based on backlinks & keywords
- **Formula:** Adjusted SEMrush score (raw score - 19)
- **Color Coding:**
  - 🟢 60+ = High Authority
  - 🟡 30-59 = Medium Authority
  - 🔴 0-29 = Low Authority

### US Traffic
- **Metric:** Estimated monthly visits from USA
- **Source:** SEMrush organic search data
- **Includes:** Direct, referral, social, and organic traffic

---

## 🌐 Deploy to Production

### Option 1: Render.com (Free!)

1. Fork this repository
2. Sign up at [render.com](https://render.com)
3. Create new Web Service from GitHub
4. Set environment variable: `SEMRUSH_API_KEY`
5. Deploy! (Auto-deploys from `render.yaml`)

**Live in 2 minutes!** ✨

### Option 2: Heroku

```bash
heroku create your-app-name
heroku config:set SEMRUSH_API_KEY=your-key
git push heroku main
heroku open
```

### Option 3: Your Own Server

```bash
# Install dependencies
pip3 install -r requirements.txt

# Run with Gunicorn
gunicorn --bind 0.0.0.0:80 app:app
```

**See [WEBAPP_DEPLOYMENT.md](WEBAPP_DEPLOYMENT.md) for detailed guides**

---

## 🔑 Getting API Key

1. Sign up at [RapidAPI](https://rapidapi.com/)
2. Subscribe to [SEMrush Website Traffic Checker](https://rapidapi.com/semrush/api/semrush-website-traffic-checker)
3. Copy your API key
4. Set as environment variable:
   ```bash
   export SEMRUSH_API_KEY="your-key-here"
   ```

**Note:** Free tier available on RapidAPI!

---

## 📖 Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Get started in 30 seconds
- **[WEBAPP_README.md](WEBAPP_README.md)** - Complete feature guide
- **[WEBAPP_DEPLOYMENT.md](WEBAPP_DEPLOYMENT.md)** - Deploy anywhere

---

## 💻 CLI Version

Prefer command-line? Use the Python script directly:

```bash
python3 domain_metrics_agent.py domains.csv --provider semrush -o results.csv
```

**Input CSV:**
```csv
domain
stripe.com
shopify.com
```

**Output CSV:**
```csv
domain,domain_rating,us_traffic,provider
stripe.com,81.0,4052024,semrush
shopify.com,81.0,12095133,semrush
```

---

## 🎨 Customization

### Change Colors

Edit `static/css/style.css`:

```css
/* Primary gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* DR badge colors */
.dr-high { background: #10b981; }   /* Green: 60+ */
.dr-medium { background: #f59e0b; } /* Orange: 30-59 */
.dr-low { background: #ef4444; }    /* Red: 0-29 */
```

### Add Features

- **Frontend:** Edit `templates/index.html` and `static/js/script.js`
- **Backend:** Edit `app.py` and `domain_metrics_agent.py`

---

## 🔒 Security

### Before Public Deployment

1. **Move API key to environment variable** (already configured in `app.py`)
2. **Enable HTTPS** (automatic on Render/Heroku)
3. **Add rate limiting** (optional):
   ```bash
   pip install flask-limiter
   ```

---

## 🤝 Contributing

Contributions welcome! Here's how:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📝 License

MIT License - feel free to use and modify!

---

## 🙏 Acknowledgments

- **SEMrush API** for domain metrics data
- **Flask** for the amazing web framework
- **RapidAPI** for easy API access

---

## 📞 Support

- 📖 **Documentation:** See files in repository
- 🐛 **Issues:** [GitHub Issues](https://github.com/YOUR_USERNAME/domain-metrics-analyzer/issues)
- 💬 **Discussions:** [GitHub Discussions](https://github.com/YOUR_USERNAME/domain-metrics-analyzer/discussions)

---

## 🚀 Roadmap

Future enhancements:

- [ ] User authentication
- [ ] Save analysis history
- [ ] Scheduled monitoring
- [ ] Email reports
- [ ] Trend charts
- [ ] Competitor comparison
- [ ] More metrics (backlinks, keywords, etc.)

---

## ⭐ Star This Repo!

If you find this useful, please give it a star! It helps others discover the project.

---

**Built with ❤️ using Flask & SEMrush API**

