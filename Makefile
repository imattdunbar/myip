build-web:
	@echo "Building web..."
	@cd internal/web && bun i && bun run build

run-web:
	@cd internal/web && bun i && bun dev

build:
	@echo "Building server..."
	@go build -o tmp/main cmd/main.go

run: build
	@echo "Running..."
	@cd tmp && ./main

build-prod: build-web
	@echo "Building..."
	@go build -o out cmd/main.go