# Brand Ad Intelligence Feature

## Overview
This feature allows you to identify a brand's Instagram display name from their website URL and retrieve their ad metrics using AI and the BrandBooster API.

## How It Works

### 1. Website URL → Instagram Brand Name
- User enters a website URL (e.g., `nike.com`)
- Gemini API analyzes the URL and identifies the Instagram display name (e.g., `Nike`)
- Uses Google's Gemini Pro model for intelligent brand identification

### 2. Brand Name → Ad Metrics
- The identified brand name is sent to the BrandBooster API
- API endpoint: `https://api.brandbooster.ai/api/v1/research/brand-ads-count-public`
- Returns three key metrics:
  - **Total Ad Count**: All ads ever run by the brand
  - **Active Ad Count**: Currently running ads
  - **Inactive Ad Count**: Ads that are no longer active

## Files Created

### 1. `/lib/ai/gemini-brand.ts`
Core utility functions for:
- `getInstagramBrandName(websiteUrl)`: Uses Gemini API to identify brand name
- `getBrandAdCounts(brandName)`: Fetches ad metrics from BrandBooster API

### 2. `/app/api/brand-ads/route.ts`
Next.js API route that:
- Accepts POST requests with website URL
- Calls Gemini API to identify brand name
- Fetches ad counts from BrandBooster API
- Returns comprehensive results

### 3. `/components/BrandAdCountForm.tsx`
React component featuring:
- Clean, modern UI with input field for website URL
- Loading state with animated spinner
- Error handling and display
- Beautiful results display with:
  - Brand name card
  - Three metric cards (Total, Active, Inactive ads)
  - Responsive grid layout

### 4. `/app/page.tsx` (Updated)
Main page updated to include the BrandAdCountForm component in a dedicated section.

## Usage

### From the UI
1. Navigate to the main page
2. Find the "Brand Ad Intelligence" section
3. Enter a brand website URL (e.g., `https://nike.com` or `nike.com`)
4. Click "Get Ad Counts"
5. View the results showing:
   - Identified Instagram brand name
   - Total ad count
   - Active ad count
   - Inactive ad count

### API Endpoint
```bash
POST /api/brand-ads
Content-Type: application/json

{
  "websiteUrl": "https://nike.com"
}
```

**Response:**
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

## Configuration

### Environment Variables
Create a `.env.local` file (see `.env.local.example`):
```env
GEMINI_API_KEY=AIzaSyAHY8-W3rmJzvARGUgTaZvFOFcLBCdNhU4
```

The default API key is already included in the code, but you can override it via environment variable.

## Examples

### Example Inputs
- `nike.com`
- `https://www.adidas.com`
- `apple.com`
- `https://coca-cola.com`

### Expected Flow
1. Input: `nike.com`
2. Gemini identifies: `Nike`
3. BrandBooster API returns ad counts
4. Display results in beautiful card layout

## Technical Details

### Dependencies
- `@google/generative-ai`: For Gemini API integration
- `react-hook-form`: Form validation and handling
- `clsx`: Dynamic class names
- `zod`: Request validation

### API Rate Limiting
- The BrandBooster API is public and doesn't require authentication
- Gemini API key is provided (rate limits apply based on Google's free tier)

### Error Handling
- Invalid URL format
- Gemini API failures
- BrandBooster API unavailability
- Network errors

All errors are gracefully displayed to the user with helpful messages.

## Testing

To test the feature:
1. Start the development server: `npm run dev`
2. Navigate to `http://localhost:3000`
3. Find the "Brand Ad Intelligence" section
4. Enter a brand website URL
5. Click "Get Ad Counts" and view results

## Future Enhancements
- Add caching for repeated queries
- Support for batch URL processing
- Historical ad count trends
- Export results to CSV
- Integration with other social media platforms
