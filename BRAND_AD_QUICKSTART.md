# Brand Ad Intelligence - Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies
```bash
cd /workspace
npm install
```

### Step 2: Start the Development Server
```bash
npm run dev
```

### Step 3: Use the Feature
1. Open your browser to `http://localhost:3000`
2. Find the **"Brand Ad Intelligence"** section (purple card)
3. Enter a brand website URL (e.g., `nike.com`)
4. Click **"Get Ad Counts"**
5. View the results!

## 📊 What You'll See

The feature displays:
- **Instagram Brand Name**: AI-identified display name
- **Total Ad Count**: All ads the brand has run
- **Active Ad Count**: Currently running ads
- **Inactive Ad Count**: Ads that are no longer active

## 🎯 Example Test Cases

Try these brand websites:
- `nike.com` → Nike
- `adidas.com` → Adidas
- `apple.com` → Apple
- `cocacola.com` → Coca-Cola
- `mcdonalds.com` → McDonald's

## 🔑 API Key

The Gemini API key is already configured:
```
AIzaSyAHY8-W3rmJzvARGUgTaZvFOFcLBCdNhU4
```

You can override it by creating a `.env.local` file:
```env
GEMINI_API_KEY=your_custom_key_here
```

## 🧪 Testing the API Directly

You can also test the API endpoint directly:

```bash
curl -X POST http://localhost:3000/api/brand-ads \
  -H "Content-Type: application/json" \
  -d '{"websiteUrl": "https://nike.com"}'
```

Expected response:
```json
{
  "websiteUrl": "https://nike.com",
  "brandName": "Nike",
  "totalAdCount": 1234,
  "activeAdCount": 456,
  "inactiveAdCount": 778,
  "timestamp": "2025-11-08T12:34:56.789Z"
}
```

## 🎨 UI Features

- **Loading Animation**: Spinner shows while processing
- **Error Handling**: Clear error messages if something goes wrong
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Modern UI**: Glass-morphism design with gradient cards

## 📁 Key Files

- `/components/BrandAdCountForm.tsx` - Main UI component
- `/app/api/brand-ads/route.ts` - API endpoint
- `/lib/ai/gemini-brand.ts` - Gemini integration & BrandBooster API calls

## ⚡ Performance

- Gemini API call: ~1-3 seconds
- BrandBooster API call: ~0.5-1 second
- Total time: ~2-4 seconds per request

## 🐛 Troubleshooting

**Issue**: "Failed to identify brand name"
- **Solution**: Check your internet connection and Gemini API key

**Issue**: "Failed to fetch ad counts"
- **Solution**: Verify the BrandBooster API is accessible

**Issue**: Module not found errors
- **Solution**: Run `npm install` to ensure all dependencies are installed

## 📚 More Information

See `BRAND_AD_FEATURE.md` for complete technical documentation.
