# ==============================================================================

# 🌐 APP CONFIGURATION (backend/.env)

# ==============================================================================

# Copy To Your .env, for quick procces

# 🌐 APP CONFIGURATION

NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000

# 🐘 DATABASE

DATABASE_URL="postgresql://admin_ngotel:ngotelin123@localhost:5432/ngotelin_db?schema=public"

GEMINI_API_KEY="GCP_API_KEY"
BLOB_READ_WRITE_TOKEN="vercel_blob"

# 💰 MIDTRANS

MIDTRANS_SERVER_KEY="server_key"
MIDTRANS_CLIENT_KEY="client_key"
MIDTRANS_NOTIFICATION_URL="Sesuaikan dengan url ngrok masing-masing"

# ==============================================================================

# 🐘 FRONTEND ROOT VARIABLES (For Docker Compose) root project: (frontend/.env)

# ==============================================================================

NEXT_PUBLIC_API_URL=http://localhost:3001

# ==============================================================================

# ROOT ENVIRONMENT VARIABLES (For Docker Compose) root project: (/.env)

# ==============================================================================

# 🐘 PostgreSQL Credentials

POSTGRES_USER=admin_ngotel
POSTGRES_PASSWORD=ngotelin123
POSTGRES_DB=ngotelin_db
POSTGRES_PORT=5432

# 🛠️ pgAdmin Credentials (Web GUI untuk Database)

PGADMIN_DEFAULT_EMAIL=admin@ngotelin.com
PGADMIN_DEFAULT_PASSWORD=admin
PGADMIN_PORT=8080
