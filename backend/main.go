package main

import (
	"embed"
	"html/template"
	"log/slog"
	"net/http"
	"os"
)

//go:embed all:templates all:static
var assets embed.FS

func main() {
	// Logger for structured logging - standard in modern Go
	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
	slog.SetDefault(logger)

	// Create a modern ServeMux (supports methods like "GET /")
	mux := http.NewServeMux()

	// 1. API routes first (more specific matches)
	mux.HandleFunc("GET /api/about", handleAboutAPI)
	mux.HandleFunc("GET /api/about-snippet", handleAboutSnippet)

	// 2. Handle static assets for the React SPA (if built)
	// Vite places built assets in /assets/ folder
	distPath := "../frontend/dist"
	if _, err := os.Stat(distPath); err == nil {
		slog.Info("Serving React frontend from dist folder", "path", distPath)
		fs := http.FileServer(http.Dir(distPath))

		// SPA routing: If a file doesn't exist, serve index.html
		// This allows React Router (if used) to handle SPA navigation
		mux.HandleFunc("GET /", func(w http.ResponseWriter, r *http.Request) {
			// Check if the requested path corresponds to a real file in the dist folder
			// (like /assets/index.js or /favicon.ico)
			filePath := distPath + r.URL.Path
			info, err := os.Stat(filePath)
			if err == nil && !info.IsDir() {
				// It's a real file, serve it
				fs.ServeHTTP(w, r)
				return
			}
			// It's not a file (or it's a directory), serve index.html for SPA routing
			http.ServeFile(w, r, distPath+"/index.html")
		})
	} else {
		slog.Warn("React dist folder not found. Falling back to Go templates.", "path", distPath)
		// Handle static files for Go templates
		mux.Handle("GET /static/", http.FileServer(http.FS(assets)))
		// Route for the home page (Go template)
		mux.HandleFunc("GET /{$}", handleHome)
	}

	port := ":8080"
	slog.Info("Starting server", "port", port)
	if err := http.ListenAndServe(port, mux); err != nil {
		slog.Error("Server failed to start", "error", err)
		os.Exit(1)
	}
}

func handleHome(w http.ResponseWriter, r *http.Request) {
	// Parse templates from embed FS
	tmpl, err := template.ParseFS(assets, "templates/*.html")
	if err != nil {
		http.Error(w, "Failed to load templates", http.StatusInternalServerError)
		slog.Error("Template parsing error", "error", err)
		return
	}

	data := struct {
		Title string
		Name  string
	}{
		Title: "Welcome to My Website",
		Name:  "Jack",
	}

	if err := tmpl.ExecuteTemplate(w, "home", data); err != nil {
		http.Error(w, "Failed to render template", http.StatusInternalServerError)
		slog.Error("Template execution error", "error", err)
	}
}

func handleAboutAPI(w http.ResponseWriter, r *http.Request) {
	// Pure JSON response (best for React/SPAs)
	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(`{"name": "Jack", "role": "Developer", "interests": ["Go", "Kubernetes", "Cloud Native"]}`))
}

func handleAboutSnippet(w http.ResponseWriter, r *http.Request) {
	// HTML snippet response (best for HTMX/SSR)
	w.Header().Set("Content-Type", "text/html")
	w.Write([]byte(`
        <div class="space-y-4 animate-in fade-in duration-500">
            <p class="text-slate-600"><strong>Role:</strong> Developer</p>
            <p class="text-slate-600"><strong>Interests:</strong> Go, Kubernetes, React, TypeScript</p>
            <div class="flex gap-2 pt-4">
                <span class="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-xs font-semibold uppercase">Go</span>
                <span class="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-semibold uppercase">TS</span>
                <span class="px-3 py-1 bg-teal-100 text-teal-600 rounded-full text-xs font-semibold uppercase">K8s</span>
            </div>
        </div>
    `))
}
