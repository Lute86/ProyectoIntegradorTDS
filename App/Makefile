# =============================================================================
# IFTS 29 — Nueva Web · GoSoftware
# =============================================================================

RESET  = \033[0m
BOLD   = \033[1m
GREEN  = \033[32m
CYAN   = \033[36m
YELLOW = \033[33m
RED    = \033[31m

.DEFAULT_GOAL := help

# ── PHONYs agrupados por sección ──────────────────────────────────────────────
.PHONY: scaffold setup install install-frontend install-backend
.PHONY: dev dev-d dev-down dev-reset dev-reset-up
.PHONY: prod prod-down prod-reset ssl ssl-selfsigned setup-prod
.PHONY: logs logs-dev logs-be logs-fe
.PHONY: shell-be shell-be-dev migrate migrate-dev seed-dev seed seed-user-dev seed-user db-count db-count-dev tests-back tests-back-unit tests-back-all tests-frontend lint-backend lint-frontend
.PHONY: check-env help fclean

# =============================================================================
# SCAFFOLD (Solo arquitectura inicial - ya realizado)
# =============================================================================

# scaffold: ## Genera la estructura de carpetas (ejecuta scaffold.sh)
# 	@bash scaffold.sh

# setup: ## Inicializa frontend y backend con todas las dependencias (scaffold + setup scripts)
# 	@bash scaffold.sh
# 	@bash setup-frontend.sh
# 	@bash setup-backend.sh


# =============================================================================
# INSTALACIÓN
# =============================================================================

install: install-frontend install-backend ## Instala dependencias de frontend y backend

install-frontend: ## npm install en frontend/
	@echo "$(CYAN)▶ Instalando dependencias del frontend...$(RESET)"
	cd frontend && npm install

install-backend: ## npm install en backend/
	@echo "$(CYAN)▶ Instalando dependencias del backend...$(RESET)"
	cd backend && npm install

# =============================================================================
# DESARROLLO
# =============================================================================

dev: ## Levanta el entorno de desarrollo con hot-reload (Vite + Nodemon + SQLite)
	@echo "$(CYAN)▶ Iniciando entorno de desarrollo...$(RESET)"
	@echo "$(YELLOW)  Frontend → http://localhost:5173$(RESET)"
	@echo "$(YELLOW)  Backend  → http://localhost:3000/api$(RESET)"
	docker compose -f docker-compose.dev.yml up --build

dev-d: ## Igual que dev pero en background (detached)
	docker compose -f docker-compose.dev.yml up --build -d
	@echo "$(YELLOW)  Frontend → http://localhost:5173$(RESET)"
	@echo "$(YELLOW)  Backend  → http://localhost:3000/api$(RESET)"
	
dev-down: ## Detiene el entorno de desarrollo
	docker compose -f docker-compose.dev.yml down

dev-reset: ## Detiene el entorno de desarrollo y borra la BD SQLite
	@echo "$(RED)⚠  Esto eliminará la base de datos de desarrollo.$(RESET)"
	docker compose -f docker-compose.dev.yml down -v

dev-reset-up: dev-reset dev

fclean: ## Remove all containers, volumes, images and node_modules
	docker compose -f docker-compose.dev.yml down -v --rmi all --remove-orphans
	docker compose down -v --rmi all --remove-orphans
	rm -rf frontend/node_modules backend/node_modules
	rm -rf frontend/dist
	rm -f backend/data/dev.sqlite
# =============================================================================
# PRODUCCIÓN
# =============================================================================

setup-prod: ## Genera .env con secrets aleatorios (JWT_SECRET, DB_PASSWORD)
	@echo "$(CYAN)▶ Generando .env con secrets...$(RESET)"
	bash scripts/generate-secrets.sh

ssl-selfsigned: ## Genera certificado SSL auto-firmado en docker/ssl/
	@echo "$(CYAN)▶ Generando certificado SSL auto-firmado...$(RESET)"
	bash scripts/generate-ssl.sh

prod: check-env ssl-selfsigned ## Construye y levanta producción (Nginx HTTPS + Node + PostgreSQL)
	@echo "$(CYAN)▶ Iniciando producción...$(RESET)"
	docker compose up --build -d

prod-first: ## Primera vez: genera .env, SSL y levanta producción
	@echo "$(CYAN)▶ Configuración inicial de producción...$(RESET)"
	@$(MAKE) setup-prod
	@$(MAKE) ssl-selfsigned
	@$(MAKE) prod
	@echo ""
	@echo "$(GREEN)✔ Producción lista$(RESET)"
	@echo "  HTTPS → https://localhost"
	@echo "  Para cargar datos: make migrate && make seed && make seed-user"

prod-down: ## Detiene producción
	docker compose down

prod-reset: ## Detiene producción y elimina todos los volúmenes (⚠ borra la BD)
	@echo "$(RED)⚠  Esto eliminará la base de datos de producción.$(RESET)"
	docker compose down -v

ssl: check-env ## Obtiene certificado SSL con Let's Encrypt (requiere DOMAIN en .env)
	docker compose run --rm certbot certonly --webroot \
		--webroot-path /var/www/certbot \
		--email admin@$(shell grep ^DOMAIN .env | cut -d= -f2) \
		--agree-tos --no-eff-email \
		-d $(shell grep ^DOMAIN .env | cut -d= -f2)
	docker compose --profile ssl up -d certbot

# =============================================================================
# LOGS Y UTILIDADES
# =============================================================================

logs: ## Logs en tiempo real de todos los servicios (prod)
	docker compose logs -f

logs-dev: ## Logs en tiempo real de todos los servicios (dev)
	docker compose -f docker-compose.dev.yml logs -f

logs-be: ## Logs sólo del backend (prod)
	docker compose logs -f backend

logs-fe: ## Logs sólo del frontend (prod)
	docker compose logs -f frontend

shell-be: ## Shell dentro del contenedor backend (prod)
	docker compose exec backend sh

shell-be-dev: ## Shell dentro del contenedor backend (dev)
	docker compose -f docker-compose.dev.yml exec backend sh

migrate: ## Ejecuta migraciones en producción
	docker compose exec backend npx sequelize-cli db:migrate

migrate-dev: ## Ejecuta migraciones en desarrollo
	docker compose -f docker-compose.dev.yml exec backend npx sequelize-cli db:migrate

seed-dev: ## Carga los seeders en desarrollo
	docker compose -f docker-compose.dev.yml exec backend npx sequelize-cli db:seed:all

seed: ## Carga los seeders en producción
	docker compose exec backend npx sequelize-cli db:seed:all

seed-user-dev: ## Crea/actualiza un usuario en desarrollo. Uso: make seed-user-dev [EMAIL=...] [PASSWORD=...] [ROL=...]
	docker compose -f docker-compose.dev.yml exec backend node scripts/create-user.js

seed-user: ## Crea/actualiza un usuario en producción. Uso: make seed-user [EMAIL=...] [PASSWORD=...] [ROL=...]
	docker compose exec backend node scripts/create-user.js

db-count: ## Muestra cantidad de filas por tabla (producción)
	docker compose exec backend node scripts/db-count.js

db-count-dev: ## Muestra cantidad de filas por tabla (desarrollo)
	docker compose -f docker-compose.dev.yml exec backend node scripts/db-count.js

tests-back: ## Ejecuta tests del backend (docker). Uso: make tests-back | make tests-back arg=consulta
ifdef arg
	docker compose -f docker-compose.dev.yml exec backend npm run test:arg -- $(arg)
else
	docker compose -f docker-compose.dev.yml exec backend npm test
endif

tests-back-unit: ## Ejecuta solo unit tests del backend (docker). Uso: make tests-back-unit | make tests-back-unit arg=auth
ifdef arg
	docker compose -f docker-compose.dev.yml exec backend npm run test:arg -- tests/unit $(arg)
else
	docker compose -f docker-compose.dev.yml exec backend npm run test:arg -- tests/unit
endif

tests-back-all: ## Ejecuta todos los tests del backend: integration + unit (docker). Uso: make tests-back-all | make tests-back-all arg=evento
ifdef arg
	docker compose -f docker-compose.dev.yml exec backend npm run test:arg -- $(arg)
else
	docker compose -f docker-compose.dev.yml exec backend npm test
endif

tests-frontend: ## Ejecuta tests del frontend en desarrollo (docker)
	docker compose -f docker-compose.dev.yml exec frontend npm test -- --run

lint-backend: ## Ejecuta lint del backend (docker)
	docker compose -f docker-compose.dev.yml exec backend npm run lint

lint-frontend: ## Ejecuta lint del frontend (docker)
	docker compose -f docker-compose.dev.yml exec frontend npm run lint

# =============================================================================
# CHECKS / HELP
# =============================================================================

check-env:
	@if [ ! -f .env ]; then \
		echo "$(RED)✗ No existe el archivo .env$(RESET)"; \
		echo "  Ejecutá: $(BOLD)make setup-prod$(RESET)"; \
		exit 1; \
	fi
	@if grep -q "CAMBIA_ESTO" .env; then \
		echo "$(RED)✗ El .env tiene valores de ejemplo sin completar.$(RESET)"; \
		exit 1; \
	fi
	@echo "$(GREEN)✔ .env OK$(RESET)"

help: ## Muestra este mensaje de ayuda
	@echo ""
	@echo "$(BOLD)IFTS 29 — Nueva Web · GoSoftware$(RESET)"
	@echo ""
	@echo "$(BOLD)Uso:$(RESET)  make $(CYAN)<comando>$(RESET)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| sort \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "  $(CYAN)%-18s$(RESET) %s\n", $$1, $$2}'
	@echo ""
