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