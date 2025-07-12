package proxy

import (
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"strings"
)

// logRequest prints request information for debugging
func logRequest(r *http.Request) {
	log.Printf("Request Method: %s", r.Method)
	log.Printf("Request URL: %s", r.URL.String())
	log.Printf("Request Path: %s", r.URL.Path)
	log.Printf("Request Host: %s", r.Host)
	log.Printf("Request Remote Addr: %s", r.RemoteAddr)
	log.Printf("Request User-Agent: %s", r.Header.Get("User-Agent"))
	log.Printf("Request Headers: %v", r.Header)
	log.Println("---")
}

// getRandomAPIKey reads API keys from environment variable and returns a random one
func getRandomAPIKey() (string, error) {
	apiKeysEnv := os.Getenv("GOOGLE_API_KEYS")
	if apiKeysEnv == "" {
		log.Println("Error: GOOGLE_API_KEYS environment variable not set")
		return "", fmt.Errorf("GOOGLE_API_KEYS environment variable not set")
	}

	apiKeys := strings.Split(apiKeysEnv, ",")
	if len(apiKeys) == 0 {
		log.Println("Error: No API keys found in environment variable")
		return "", fmt.Errorf("no API keys found in environment variable")
	}

	// Clean up keys (remove spaces)
	var validKeys []string
	for _, key := range apiKeys {
		trimmed := strings.TrimSpace(key)
		if trimmed != "" {
			validKeys = append(validKeys, trimmed)
		}
	}

	if len(validKeys) == 0 {
		log.Println("Error: No valid API keys found after cleanup")
		return "", fmt.Errorf("no valid API keys found")
	}

	// Select random API key
	selectedKey := validKeys[rand.Intn(len(validKeys))]

	return selectedKey, nil
}

// validateAPIKey checks if the X-Goog-Api-Key header contains the expected value
func validateAPIKey(r *http.Request) bool {
	apiKey := r.Header.Get("X-Goog-Api-Key")
	log.Printf("API Key from header: %s", apiKey)

	// Get expected API key from environment variable
	expectedKey := os.Getenv("AUTH_API_KEY")
	if expectedKey == "" {
		log.Println("API Key validation: FAILED - AUTH_API_KEY environment variable not set")
		return false
	}

	if apiKey == expectedKey {
		log.Println("API Key validation: PASSED")
		return true
	}

	log.Println("API Key validation: FAILED")
	return false
}

func HandleRequest(w http.ResponseWriter, r *http.Request) {
	// Log request information
	logRequest(r)

	// Validate API Key
	if !validateAPIKey(r) {
		http.Error(w, "Unauthorized: Invalid API Key", http.StatusUnauthorized)
		return
	}

	// Replace API Key with a random one from environment
	randomAPIKey, err := getRandomAPIKey()
	if err != nil {
		log.Printf("Failed to get API key: %v", err)
		http.Error(w, "Internal Server Error: API Key configuration error", http.StatusInternalServerError)
		return
	}
	r.Header.Set("X-Goog-Api-Key", randomAPIKey)

	// Target URL
	targetURL, _ := url.Parse("https://generativelanguage.googleapis.com")

	// Create reverse proxy
	proxy := httputil.NewSingleHostReverseProxy(targetURL)

	// Modify request headers
	r.Host = targetURL.Host
	r.URL.Host = targetURL.Host
	r.URL.Scheme = targetURL.Scheme

	// Handle proxy request
	proxy.ServeHTTP(w, r)
}
