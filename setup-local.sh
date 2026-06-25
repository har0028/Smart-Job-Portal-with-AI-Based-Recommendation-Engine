#!/bin/bash
set -e

echo "======================================"
echo "  Smart Job Portal — Local Setup"
echo "======================================"

# ── Check prerequisites ───────────────────
command -v java  >/dev/null 2>&1 || { echo "ERROR: Java 21+ is required"; exit 1; }
command -v mvn   >/dev/null 2>&1 || { echo "ERROR: Maven 3.8+ is required"; exit 1; }
command -v node  >/dev/null 2>&1 || { echo "ERROR: Node 18+ is required"; exit 1; }
command -v mysql >/dev/null 2>&1 || { echo "ERROR: MySQL client is required"; exit 1; }

echo ""
echo "Prerequisites OK"
echo ""

# ── Database ─────────────────────────────
echo "Enter MySQL root password (leave blank if none):"
read -s DB_PASS

if [ -z "$DB_PASS" ]; then
  MYSQL_CMD="mysql -u root"
else
  MYSQL_CMD="mysql -u root -p$DB_PASS"
fi

echo "Creating database..."
$MYSQL_CMD -e "CREATE DATABASE IF NOT EXISTS smart_job_portal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
$MYSQL_CMD smart_job_portal < backend/src/main/resources/schema.sql
$MYSQL_CMD smart_job_portal < backend/src/main/resources/sample_data.sql
echo "Database ready"

# ── Backend config ────────────────────────
if [ -z "$DB_PASS" ]; then
  sed -i "s/spring.datasource.password=root/spring.datasource.password=/" \
    backend/src/main/resources/application.properties
else
  sed -i "s/spring.datasource.password=root/spring.datasource.password=$DB_PASS/" \
    backend/src/main/resources/application.properties
fi

# ── Frontend install ──────────────────────
echo "Installing frontend dependencies..."
cd frontend && npm install --silent && cd ..

echo ""
echo "======================================"
echo "  Setup complete!"
echo "======================================"
echo ""
echo "  Start backend:  cd backend && mvn spring-boot:run"
echo "  Start frontend: cd frontend && npm run dev"
echo ""
echo "  Or use:  make dev-backend  and  make dev-frontend"
echo ""
echo "  Admin login:"
echo "    Email:    admin@smartjobportal.com"
echo "    Password: Admin@123"
echo ""
