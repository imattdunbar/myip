package main

import (
	"fmt"
	"net/http"

	"github.com/charmbracelet/log"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/cors"
	"github.com/imattdunbar/myip/internal/utils"
	"github.com/imattdunbar/myip/internal/web"
	_ "github.com/joho/godotenv/autoload"
)

func main() {

	router := chi.NewRouter()
	router.Use(middleware.Logger)
	router.Use(middleware.StripSlashes)

	router.Use(cors.Handler(cors.Options{
		AllowedOrigins: []string{"*"},
	}))

	router.Get("/ip", func(w http.ResponseWriter, r *http.Request) {
		response := map[string]interface{}{
			"ip": utils.GetClientIPFromRequest(r),
		}
		utils.SendJSONFrom(response, w)
	})

	router.Get("/checkport", func(w http.ResponseWriter, r *http.Request) {

		ip := utils.GetClientIPFromRequest(r)
		port := r.URL.Query().Get("port")
		result := utils.CheckPortForIP(ip, port)

		if result {
			w.WriteHeader(200)
		} else {
			w.WriteHeader(500)
		}
	})

	web.ServeUI(router)

	port := utils.GetPort()
	address := fmt.Sprintf(":%v", port)
	server := &http.Server{
		Addr:    address,
		Handler: router,
	}

	log.Infof("Starting server on port %v -- %v", port, utils.GetServerAddress())

	err := server.ListenAndServe()
	if err != nil {
		log.Fatalf("error starting server: %v", err)
	}

}
