build-web:
	@echo "Building web..."
	@cd internal/web && bun i && bun run build

run-web:
	@echo "Running web..."
	@cd internal/web && bun i && bun dev

build-server:
	@echo "Building server..."
	@go build -o tmp/main cmd/main.go

run-server: build-server
	@echo "Running server..."
	@cd tmp && ./main

build-prod: build-web
	@echo "Building server..."
	@go build -o out cmd/main.go