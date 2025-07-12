package handler

import (
	"net/http"

	"github.com/therainisme/gemini/proxy"
)

func VercelHandler(w http.ResponseWriter, r *http.Request) {
	proxy.HandleRequest(w, r)
}
