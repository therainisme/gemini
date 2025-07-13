import { NextRequest, NextResponse } from 'next/server';

export const config = {
  runtime: "edge",
};

// Log request information for debugging
function logRequest(request: NextRequest): void {
  console.log(`Request Method: ${request.method}`);
  console.log(`Request URL: ${request.url}`);
  console.log(`Request Headers:`, Object.fromEntries(request.headers.entries()));
  console.log("---");
}

// Get random API key from environment variable and return a random one
function getRandomAPIKey(): string {
  const apiKeysEnv = process.env.GOOGLE_API_KEYS;
  if (!apiKeysEnv) {
    console.log("Error: GOOGLE_API_KEYS environment variable not set");
    throw new Error("GOOGLE_API_KEYS environment variable not set");
  }

  const apiKeys = apiKeysEnv.split(",");
  if (apiKeys.length === 0) {
    console.log("Error: No API keys found in environment variable");
    throw new Error("No API keys found in environment variable");
  }

  // Clean up keys (remove spaces)
  const validKeys = apiKeys
    .map((key: string) => key.trim())
    .filter((key: string) => key !== "");

  if (validKeys.length === 0) {
    console.log("Error: No valid API keys found after cleanup");
    throw new Error("No valid API keys found");
  }

  // Select random API key
  const selectedKey = validKeys[Math.floor(Math.random() * validKeys.length)];
  return selectedKey;
}

// Validate API key by checking if the X-Goog-Api-Key header contains the expected value
function validateAPIKey(request: NextRequest): boolean {
  const apiKey = request.headers.get("X-Goog-Api-Key");
  console.log(`API Key from header: ${apiKey}`);

  // Get expected API key from environment variable
  const expectedKey = process.env.AUTH_API_KEY;
  if (!expectedKey) {
    console.log("API Key validation: FAILED - AUTH_API_KEY environment variable not set");
    return false;
  }

  if (apiKey === expectedKey) {
    console.log("API Key validation: PASSED");
    return true;
  }

  console.log("API Key validation: FAILED");
  return false;
}

async function handleRequest(request: NextRequest): Promise<NextResponse> {
  try {
    // Log request information
    logRequest(request);

    // Validate API Key
    if (!validateAPIKey(request)) {
      return new NextResponse("Unauthorized: Invalid API Key", {
        status: 401,
        headers: {
          "Content-Type": "text/plain",
        },
      });
    }

    // Replace API Key with a random one from environment
    let randomAPIKey: string;
    try {
      randomAPIKey = getRandomAPIKey();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.log(`Failed to get API key: ${errorMessage}`);
      return new NextResponse("Internal Server Error: API Key configuration error", {
        status: 500,
        headers: {
          "Content-Type": "text/plain",
        },
      });
    }

    // Build target URL
    const url = new URL(request.url);
    // Use the full pathname as the API path (since all routes come here now)
    const apiPath = url.pathname || '/';
    const targetURL = `https://generativelanguage.googleapis.com${apiPath}${url.search}`;

    // Create new request headers
    const headers = new Headers(request.headers);
    headers.set("X-Goog-Api-Key", randomAPIKey);
    headers.set("Host", "generativelanguage.googleapis.com");

    // Create proxy request
    const proxyRequest = new Request(targetURL, {
      method: request.method,
      headers: headers,
      body: request.body,
      // @ts-ignore - duplex is required for streaming but not in TS types yet
      duplex: 'half',
    });

    // Send request to target server
    const response = await fetch(proxyRequest);

    // Create new response headers
    const responseHeaders = new Headers(response.headers);

    // If it's a streaming response, ensure correct Content-Type is set
    if (response.headers.get("Content-Type")?.includes("text/event-stream")) {
      responseHeaders.set("Content-Type", "text/event-stream; charset=utf-8");
      responseHeaders.set("Cache-Control", "no-cache");
      responseHeaders.set("Connection", "keep-alive");
    }

    // Return proxy response
    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });

  } catch (error) {
    console.error("Proxy error:", error);
    return new NextResponse("Internal Server Error", {
      status: 500,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }
}

// Export handlers for all HTTP methods
export async function GET(request: NextRequest): Promise<NextResponse> {
  return handleRequest(request);
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  return handleRequest(request);
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
  return handleRequest(request);
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  return handleRequest(request);
}

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  return handleRequest(request);
}

export async function HEAD(request: NextRequest): Promise<NextResponse> {
  return handleRequest(request);
}

export async function OPTIONS(request: NextRequest): Promise<NextResponse> {
  return handleRequest(request);
}