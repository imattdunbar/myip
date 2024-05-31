package utils

import (
	"encoding/json"
	"net/http"
)

func SendJSONFrom(payload interface{}, w http.ResponseWriter) error {
	json, err := json.Marshal(payload)
	if err != nil {
		return err
	}

	SendJSON(json, w)
	return nil
}

func SendJSON(json []byte, w http.ResponseWriter) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(200)
	w.Write(json)
}
