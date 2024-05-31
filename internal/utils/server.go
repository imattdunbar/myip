package utils

import (
	"fmt"
	"net"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/charmbracelet/log"
)

func GetOutboundIP() string {
	ifaces, err := net.Interfaces()
	if err != nil {
		log.Fatalf("Couldn't get interfaces: %v", err)
	}

	for _, iface := range ifaces {
		if strings.Contains(iface.Name, "utun") {
			continue
		}

		addrs, err := iface.Addrs()
		if err != nil {
			continue
		}

		for _, addr := range addrs {
			var ip net.IP
			switch v := addr.(type) {
			case *net.IPNet:
				ip = v.IP
			case *net.IPAddr:
				ip = v.IP
			}

			if ip.To4() != nil && !ip.IsLoopback() {
				return ip.String()
			}
		}
	}

	panic("Couldn't get IP")
}

func GetServerAddress() string {
	port := GetPort()
	return fmt.Sprintf("http://%v:%v", GetOutboundIP(), port)
}

func GetPort() int {
	port, err := strconv.Atoi(os.Getenv("PORT"))
	if err != nil {
		return 42069
	}
	return port
}

func GetClientIPFromRequest(r *http.Request) string {
	forwarded := r.Header.Get("X-Forwarded-For")
	if forwarded != "" {
		return strings.Split(forwarded, ",")[0]
	}

	ip := r.RemoteAddr
	ip = ip[:strings.LastIndex(ip, ":")]

	if strings.Contains(ip, "[::1]") {
		return "localhost"
	}

	return ip
}

func CheckPortForIP(ip string, port string) bool {
	url := fmt.Sprintf("http://%s:%s", ip, port)
	log.Infof("Request sent to URL/PORT: %v", url)

	client := &http.Client{
		Timeout: 5 * time.Second,
	}

	resp, err := client.Get(url)
	if err != nil {
		return false
	}
	defer resp.Body.Close()

	return resp.StatusCode == http.StatusOK
}
