# Gemini API Proxy Server

A proxy server for Google Gemini API requests with API key rotation and authentication features.

## Features

- **API Proxy**: Forwards requests to Google Generative Language API
- **Key Rotation**: Supports random rotation of multiple Google API keys
- **Authentication**: Validates incoming requests with custom API key
- **Vercel Support**: Ready for deployment on Vercel platform

## Environment Variables

You need to set the following environment variables:

- `GOOGLE_API_KEYS`: Comma-separated list of Google API keys for rotation
- `AUTH_API_KEY`: Authentication key for incoming requests

Example:

```bash
export GOOGLE_API_KEYS="key1,key2,key3"
export AUTH_API_KEY="your-auth-key"
```

## Local Development

### Prerequisites

- Node.js 18+ or later
- Google API keys for Gemini API

### Running the Development Server

```bash
# Install dependencies
pnpm install

# Set environment variables
export GOOGLE_API_KEYS="your-google-api-keys"
export AUTH_API_KEY="your-auth-key"

# Run the development server
pnpm dev
```

The server will start on `http://localhost:3000`

### Building for Production

```bash
# Build the project
pnpm build

# Start production server
pnpm start
```

## Deployment

### Vercel Deployment

This project is configured for easy deployment on Vercel:

1. Connect your repository to Vercel
2. Set the required environment variables in Vercel dashboard:
   - `GOOGLE_API_KEYS`
   - `AUTH_API_KEY`
3. Deploy automatically

The Next.js API routes handle all proxy requests with automatic edge runtime optimization.

## API Usage

Send requests to the proxy server with the required authentication header:

```bash
curl -X POST "https://your-domain.vercel.app/v1beta/models/gemini-2.0-flash:generateContent" \
  -H "Content-Type: application/json" \
  -H "X-Goog-Api-Key: your-auth-key" \
  -d '{
    "contents": [{
      "parts": [{
        "text": "Hello, Gemini!"
      }]
    }]
  }'
```

For local development:

```bash
curl -X POST "http://localhost:3000/v1beta/models/gemini-2.0-flash:generateContent" \
  -H "Content-Type: application/json" \
  -H "X-Goog-Api-Key: your-auth-key" \
  -d '{
    "contents": [{
      "parts": [{
        "text": "Hello, Gemini!"
      }]
    }]
  }'
```