# ==============================================================================

# NGOTELIN ENVIRONMENT VARIABLES EXAMPLE

# ==============================================================================

# 🌐 APP CONFIGURATION

NODE_ENV=development
PORT=3000

# 🐘 DATABASE CONFIGURATION (PostgreSQL - Docker Compose Sync)

# Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public

# Copy To Your .env, for quick procces

DATABASE_URL="postgresql://admin_ngotel:ngotelin123@localhost:5432/ngotelin_db?schema=public"

# ==============================================================================

# ROOT ENVIRONMENT VARIABLES (For Docker Compose)

# ==============================================================================

# File ini harus diletakkan di luar folder backend (di root project: `/.env`)

# Digunakan oleh Docker Compose untuk membangun database PostgreSQL & pgAdmin dari awal.

# 🐘 PostgreSQL Credentials

POSTGRES_USER=admin_ngotel
POSTGRES_PASSWORD=ngotelin123
POSTGRES_DB=ngotelin_db
POSTGRES_PORT=5432

# 🛠️ pgAdmin Credentials (Web GUI untuk Database)

PGADMIN_DEFAULT_EMAIL=admin@ngotelin.com
PGADMIN_DEFAULT_PASSWORD=admin
PGADMIN_PORT=8080
