# 🚀 PassionX Deployment Guide

This guide walks you through deploying PassionX.

---

## 🏆 Recommendation: Render (Fastest & Easiest)

**Why Render is the best choice:**
1. **Free Cloud Hosting**: Free Web Service tier with automatic SSL (`https://...onrender.com`).
2. **Git Push-to-Deploy**: Every time you push to your GitHub `main` branch, Render automatically builds and redeploys.
3. **Single Unified Service**: Express serves the React production build (`/client/dist`) and API routes (`/api/*`), which means **no CORS issues**, single-port efficiency, and no need to pay or manage two separate servers.
4. **Free Cloud Database**: Pairs natively with **MongoDB Atlas** (Free M0 512MB shared cluster).

---

### Step 1: Set up Free MongoDB Atlas (3 minutes)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign in/register for free.
2. Click **Create a Deployment** and choose the **M0 Free Shared** tier.
3. Under **Security Quickstart**:
   - Create a database user (e.g. `passionx_admin` with a secure password).
   - Under **IP Access List**, click **Allow Access from Anywhere** (`0.0.0.0/0`) so Render can connect.
4. Click **Connect** → **Drivers** (Node.js) and copy your connection string:
   ```text
   mongodb+srv://2024adityabhore_db_user:ttghqEJEiryg7kXN@cluster0.mfeje1v.mongodb.net/passionx?retryWrites=true&w=majority
   ```

---

### Step 2: Push Your Code to GitHub

Make sure your latest code is committed and pushed:
```bash
git add .
git commit -m "Configure production deployment for Render and Docker"
git push origin main
```

---

### Step 3: Deploy on Render

#### Option A: 1-Click Blueprint (Recommended)
1. Go to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** → **Blueprint**.
3. Select your `PassionX` GitHub repository.
4. Render will read [render.yaml](file:///Users/adityasanjaybhore/Documents/FSD_PROJECT/PassionX/render.yaml) automatically:
   - Sets build command to: `npm run build`
   - Sets start command to: `node server/index.js`
   - Generates a random `JWT_SECRET`
5. When prompted, paste your `MONGODB_URI` from Step 1.
6. Click **Apply**. Render will build and deploy your app with a live HTTPS URL!

#### Option B: Manual Web Service Setup
1. On [Render Dashboard](https://dashboard.render.com), click **New +** → **Web Service**.
2. Connect your GitHub repository.
3. Fill in the fields:
   - **Name**: `passionx`
   - **Region**: Oregon (or closest to you)
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**: `npm run build`
   - **Start Command**: `node server/index.js`
4. Add **Environment Variables**:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `MONGODB_URI`: *Your MongoDB Atlas connection string from Step 1*
   - `JWT_SECRET`: *Any secure random string, e.g. `passionx_super_secret_jwt_key_2026`*
5. Click **Create Web Service**. Your live site will be ready in ~2 minutes!

---

## 🐳 Alternative: Docker Deployment

If you prefer self-hosting or deploying to any VPS (DigitalOcean, AWS EC2, GCP Compute Engine) or running fully containerized locally:

### Run Locally with Docker Compose:
```bash
docker compose up --build
```
This automatically:
- Builds the React client production bundle.
- Spins up an official **MongoDB 7** container with health checks and volume persistence.
- Starts the production Express server on port `5001`.
- Access the app at: `http://localhost:5001`

### Stop containers:
```bash
docker compose down
```

