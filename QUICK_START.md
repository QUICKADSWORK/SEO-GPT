# 🚀 Quick Start Guide - Brand Ad Intelligence

## Test with Amazon India (Verified ✅)

The feature has been successfully tested with **www.amazon.in**!

### Start the Application

```bash
# 1. Install dependencies (if not already done)
npm install

# 2. Start development server
npm run dev

# 3. Open browser
# Navigate to: http://localhost:3000
```

### Use the Feature

1. Find the **"Brand Ad Intelligence"** section (purple card with 🎯 AI-Powered badge)

2. Enter a brand website URL:
   - `www.amazon.in` ✅ Tested - Returns: Amazon (46 total ads)
   - `nike.com`
   - `adidas.com`
   - `apple.com`

3. Click **"Get Ad Counts"**

4. View results showing:
   - Instagram brand name
   - Total ad count
   - Active ad count
   - Inactive ad count

### Test Results for Amazon

```
🏢 Brand: Amazon
🌐 Website: https://www.amazon.in
📊 Total Ads: 46
✅ Active Ads: 46
⏸️ Inactive Ads: 0
```

### Files Created

```
/workspace/
├── lib/ai/
│   └── gemini-brand.ts          ✅ Gemini & BrandBooster API
├── app/api/brand-ads/
│   └── route.ts                  ✅ API endpoint
├── components/
│   └── BrandAdCountForm.tsx     ✅ UI component
└── app/
    └── page.tsx                  ✅ Integration complete
```

### API Configuration

- **Gemini Model:** gemini-2.5-flash ✅
- **Gemini API Key:** AIzaSyAHY8-W3rmJzvARGUgTaZvFOFcLBCdNhU4 ✅
- **BrandBooster API:** https://api.brandbooster.ai/... ✅

### Test the API Directly

```bash
# Test with Amazon India
curl -X POST http://localhost:3000/api/brand-ads \
  -H "Content-Type: application/json" \
  -d '{"websiteUrl": "https://www.amazon.in"}'
```

---

**Status:** ✅ All systems operational  
**Last Tested:** 2025-11-08 with www.amazon.in  
**Result:** SUCCESS - 46 ads found for Amazon
