package main

import (
	"log"
	"net/http"

	"github.com/therainisme/gemini/proxy"
)

func main() {
	http.HandleFunc("/", proxy.HandleRequest)
	log.Printf("Server starting on http://localhost:8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal(err)
	}
}
