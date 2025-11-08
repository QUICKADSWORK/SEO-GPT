# Environment Variables Setup

## For Local Development

Set the API keys before running:

```bash
export SEMRUSH_API_KEY="56b6f4dce1mshc3398ebe2b7bdf7p1a8c18jsn91e4f7fa09ae"
export GEMINI_API_KEY="your-gemini-api-key"
```

Or add to your `~/.zshrc` or `~/.bashrc`:

```bash
echo 'export SEMRUSH_API_KEY="56b6f4dce1mshc3398ebe2b7bdf7p1a8c18jsn91e4f7fa09ae"' >> ~/.zshrc
echo 'export GEMINI_API_KEY="your-gemini-api-key"' >> ~/.zshrc
source ~/.zshrc
```

## For Production (Render/Heroku)

Add environment variable in the dashboard:

**Key:** `SEMRUSH_API_KEY`  
**Value:** `56b6f4dce1mshc3398ebe2b7bdf7p1a8c18jsn91e4f7fa09ae`

**Key:** `GEMINI_API_KEY`  
**Value:** *your Gemini API key*

