package web

import (
	"embed"
	"io/fs"
	"log"
	"net/http"
	"os"
	"path"
	"strings"

	"github.com/go-chi/chi"
)

//go:embed all:dist/*
var spaFiles embed.FS

func ServeUI(r chi.Router) {
	r.NotFound(func(w http.ResponseWriter, r *http.Request) {
		spaFS, err := fs.Sub(spaFiles, "dist")
		if err != nil {
			log.Fatalf("failed getting the sub tree for the site files: %v", err)
		}
		f, err := spaFS.Open(strings.TrimPrefix(path.Clean(r.URL.Path), "/"))
		if err == nil {
			defer f.Close()
		}
		if os.IsNotExist(err) {
			http.Redirect(w, r, "/", http.StatusMovedPermanently)
			return
		}
		http.FileServer(http.FS(spaFS)).ServeHTTP(w, r)
	})
}
