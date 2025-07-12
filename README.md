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

- Go 1.24.3 or later
- Google API keys for Gemini API

### Running the Go Server

```bash
# Set environment variables
export GOOGLE_API_KEYS="your-google-api-keys"
export AUTH_API_KEY="your-auth-key"

# Run the server
go run main.go
```

The server will start on `http://localhost:8080`

## Deployment

### Vercel Deployment

This project is configured for easy deployment on Vercel:

1. Connect your repository to Vercel
2. Set the required environment variables in Vercel dashboard
3. Deploy automatically

The `vercel.json` configuration routes all requests to the API handler.

## API Usage

Send requests to the proxy server with the required authentication header:

```bash
curl -X POST "http://localhost:8080/v1beta/models/gemini-2.0-flash:generateContent" \
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