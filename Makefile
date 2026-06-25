.PHONY: up down build logs clean dev-backend dev-frontend

## Run full stack with Docker
up:
	docker-compose up --build -d
	@echo ""
	@echo "  Frontend → http://localhost:3000"
	@echo "  Backend  → http://localhost:8080"
	@echo "  Admin    → admin@smartjobportal.com / Admin@123"

## Stop all containers
down:
	docker-compose down

## Build only (no start)
build:
	docker-compose build

## Tail logs
logs:
	docker-compose logs -f

## Stop and remove volumes (full reset)
clean:
	docker-compose down -v --remove-orphans
	docker system prune -f

## Run backend locally (requires MySQL on localhost:3306)
dev-backend:
	cd backend && mvn spring-boot:run

## Run frontend locally (requires backend on localhost:8080)
dev-frontend:
	cd frontend && npm install && npm run dev

## Run backend tests
test-backend:
	cd backend && mvn test

## Build frontend for production
build-frontend:
	cd frontend && npm install && npm run build
