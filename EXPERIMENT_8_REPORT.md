# Experiment – 8: Containerization, CI/CD Pipeline and Deployment

**Student Name:** Aditya Bhore  
**Project:** PassionX (Full-Stack MERN Community Platform)  
**Date:** November 16, 2026  

---

## 1. Aim
To containerize the Web Application using Docker and implement a robust CI/CD pipeline using GitHub Actions and modern cloud deployment platforms (Render and Vercel).

---

## 2. Problem Statement
Containerize the PassionX full-stack web application comprising a React (Vite) frontend and a Node.js (Express) backend using Docker. Configure multi-container orchestration with Docker Compose, automate code validation and build checks using GitHub Actions, and configure cloud deployment for the frontend and backend using Vercel and Render.

---

## 3. Theory Questions & Answers

### Q1. What is Docker and containerization?
**Answer:**  
**Containerization** is an operating-system-level virtualization technique where an application and all its required dependencies, libraries, configuration files, and system binaries are bundled into an isolated, lightweight package called a **container**.  
**Docker** is the industry-standard open-source containerization platform that allows developers to automate the deployment, scaling, and management of applications inside these containers. Unlike traditional Virtual Machines (VMs) that each run a full guest operating system on top of a hypervisor, Docker containers share the host operating system's kernel. This makes containers:
- **Extremely fast to boot** (milliseconds compared to minutes for VMs).
- **Resource-efficient** (minimal RAM/CPU overhead).
- **Consistent across environments** (eliminates the *"it works on my machine"* problem by guaranteeing that development, testing, and production run the exact same environment).

---

### Q2. What is Docker Compose?
**Answer:**  
**Docker Compose** is a declarative tool for defining and running multi-container Docker applications. Instead of running complex `docker run` commands with dozens of arguments for every service (e.g. frontend, backend, database), Docker Compose allows developers to define the entire application stack in a single `docker-compose.yml` file.  
With a single command (`docker compose up`), Docker Compose:
- Builds and runs all defined services (e.g., React frontend container, Node.js backend container, MongoDB database container).
- Sets up isolated inter-container networking so containers can communicate using their service names (e.g., `mongodb://mongo:27017/passionx` or `http://backend:5001`).
- Manages shared data storage volumes and health checks across dependencies.

---

### Q3. What is a Dockerfile?
**Answer:**  
A **Dockerfile** is a plain text recipe containing an ordered set of instructions and commands that Docker executes sequentially to automatically assemble a Docker **Image**. Key instructions include:
- `FROM`: Specifies the base operating image (e.g., `node:20-alpine`, `nginx:alpine`).
- `WORKDIR`: Sets the working directory inside the container.
- `COPY`: Copies files from the host machine into the container filesystem.
- `RUN`: Executes build commands inside the image during creation (e.g., `npm install`, `npm run build`).
- `EXPOSE`: Informs Docker which network ports the container listens on at runtime (e.g., `5001` or `80`).
- `CMD`: Defines the default executable command when the container starts (e.g., `["node", "index.js"]`).

Multi-stage Docker builds allow separating the compilation environment from the lean runtime environment, dramatically reducing the final image size.

---

### Q4. What is GitHub Actions?
**Answer:**  
**GitHub Actions** is a continuous integration and continuous delivery (CI/CD) automation platform built directly into GitHub. It allows developers to define automated workflows that trigger on repository events (such as `git push` or `pull_request`).  
A workflow is defined in a YAML file under `.github/workflows/` and runs on cloud-hosted virtual machines (runners). In PassionX, GitHub Actions automatically:
1. Clones the code and installs dependencies.
2. Compiles the React production bundle to verify there are no syntax or typing errors.
3. Performs syntax and validation checks on Express backend routes and middleware.
4. Builds the Docker images for both the frontend and backend to verify container readiness before deployment.

---

## 4. Source Code & Configuration Snippets

### A. Backend Dockerfile (`server/Dockerfile`)
```dockerfile
# --- Backend Dockerfile (Node.js + Express) ---
FROM node:20-alpine
WORKDIR /app

# Install dependencies first for layer caching
COPY package*.json ./
RUN npm install --omit=dev

# Copy application source code
COPY . ./

EXPOSE 5001

ENV NODE_ENV=production
ENV PORT=5001

CMD ["node", "index.js"]
```

---

### B. Frontend Dockerfile (`client/Dockerfile`)
```dockerfile
# --- Frontend Dockerfile (Vite + React + Nginx Multi-Stage) ---
# Stage 1: Build React static bundle
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . ./
RUN npm run build

# Stage 2: Serve static files with production Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

---

### C. Frontend Nginx Configuration (`client/nginx.conf`)
```nginx
server {
    listen 80;
    server_name localhost;

    # Static frontend assets
    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    # Reverse proxy API requests to backend container
    location /api/ {
        proxy_pass http://backend:5001/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Reverse proxy WebSocket requests to backend container
    location /socket.io/ {
        proxy_pass http://backend:5001/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
```

---

### D. `.dockerignore` Configuration
**Backend (`server/.dockerignore`):**
```text
node_modules
.git
.env
*.log
```

**Frontend (`client/.dockerignore`):**
```text
node_modules
dist
.git
.env
*.log
```

---

### E. Docker Compose Configuration (`docker-compose.yml`)
```yaml
services:
  backend:
    build:
      context: ./server
      dockerfile: Dockerfile
    container_name: passionx_backend
    ports:
      - "5001:5001"
    environment:
      - NODE_ENV=production
      - PORT=5001
      - MONGODB_URI=mongodb://mongo:27017/passionx
      - JWT_SECRET=passionx_jwt_secret_token_2026_secure
    depends_on:
      mongo:
        condition: service_healthy
    restart: unless-stopped

  frontend:
    build:
      context: ./client
      dockerfile: Dockerfile
    container_name: passionx_frontend
    ports:
      - "3000:80"
    depends_on:
      - backend
    restart: unless-stopped

  mongo:
    image: mongo:7-jammy
    container_name: passionx_mongo
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
      interval: 5s
      timeout: 5s
      retries: 5
    restart: unless-stopped

volumes:
  mongo-data:
```

---

### F. GitHub Actions CI Workflow (`.github/workflows/ci.yml`)
```yaml
name: PassionX CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  validate-and-build:
    name: Code Validation & Client Build
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Client & Server Dependencies
        run: |
          npm install --prefix client --include=dev
          npm install --prefix server

      - name: Build React Client Bundle
        run: |
          npm run build --prefix client

      - name: Verify Server Syntax
        run: |
          node -c server/index.js
          node -c server/routes/auth.js
          node -c server/routes/users.js
          node -c server/middleware/auth.js
          node -c server/middleware/validate.js

  docker-build:
    name: Docker Container Build Check
    runs-on: ubuntu-latest
    needs: validate-and-build

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Build Server Docker Image
        uses: docker/build-push-action@v5
        with:
          context: ./server
          file: ./server/Dockerfile
          push: false
          tags: passionx-backend:latest

      - name: Build Client Docker Image
        uses: docker/build-push-action@v5
        with:
          context: ./client
          file: ./client/Dockerfile
          push: false
          tags: passionx-frontend:latest
```

---

### G. Deployment Configuration

#### Render Configuration (`render.yaml`):
```yaml
services:
  - type: web
    name: passionx
    env: node
    plan: free
    region: oregon
    buildCommand: npm run build
    startCommand: node server/index.js
    healthCheckPath: /api/health
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
      - key: JWT_SECRET
        generateValue: true
      - key: MONGODB_URI
        sync: false
```

#### Vercel Configuration (`client/vercel.json`):
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/api/:match*",
      "destination": "https://passionx.onrender.com/api/:match*"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

### H. Docker Build and Run Commands
```bash
# 1. Build and start all 3 containers (Frontend, Backend, MongoDB) in background:
docker compose up --build -d

# 2. View running containers and status:
docker compose ps

# 3. View live logs:
docker compose logs -f

# 4. Stop and remove containers:
docker compose down
```

---

## 5. Required Screenshots Checklist for Lab Submission

| # | Required Screenshot | Where to Capture | What It Proves |
| :--- | :--- | :--- | :--- |
| **1** | **Docker Configuration & Running Containers** | Terminal: `docker compose ps` (or Docker Desktop Dashboard) | Shows `passionx_backend`, `passionx_frontend`, and `passionx_mongo` in `Up` status. |
| **2** | **Successful GitHub Actions CI Pipeline** | GitHub: `https://github.com/15adi15/PassionX/actions` | Green checkmark (✔) on `PassionX CI/CD Pipeline` showing successful validation and Docker build. |
| **3** | **Backend Deployment on Render** | Render Dashboard (`dashboard.render.com`) | Shows Web Service `passionx` deployed and `Live` with green status light. |
| **4** | **Frontend Deployment on Vercel** | Vercel Dashboard (`vercel.com`) | Shows Project deployment status `Ready` with assigned domain. |
| **5** | **Application Running Successfully Online** | Browser: `https://passionx.onrender.com` | Shows the landing page with video background, navigation, and member discovery. |
