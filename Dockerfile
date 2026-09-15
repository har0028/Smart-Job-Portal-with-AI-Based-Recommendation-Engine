# ── Stage 1: Build React Frontend ─────────────────────────────
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
ENV VITE_API_BASE_URL=""
RUN npm run build

# ── Stage 2: Build Spring Boot Backend + Bundle Frontend ──────
FROM maven:3.9.6-eclipse-temurin-17-alpine AS backend-builder
WORKDIR /app/backend

COPY backend/pom.xml ./
RUN mvn dependency:go-offline -q

COPY backend/ ./

# Copy built static React frontend assets into Spring Boot static resources
COPY --from=frontend-builder /app/frontend/dist ./src/main/resources/static

RUN mvn clean package -DskipTests -q

# ── Stage 3: Production Runtime ────────────────────────────────
FROM eclipse-temurin:17-jre-alpine AS runner
WORKDIR /app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=backend-builder /app/backend/target/smart-job-portal-backend-1.0.0.jar app.jar

RUN mkdir -p uploads/resumes && chown -R appuser:appgroup /app

USER appuser

ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["java", \
  "-Djava.security.egd=file:/dev/./urandom", \
  "-Xms256m", \
  "-Xmx512m", \
  "-jar", "app.jar"]
