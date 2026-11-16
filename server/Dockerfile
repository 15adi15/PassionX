# --- Backend Dockerfile (Node.js + Express) ---
FROM node:20-alpine
WORKDIR /app

# Install dependencies first for Docker layer caching
COPY package*.json ./
RUN npm install --omit=dev

# Copy application source code
COPY . ./

EXPOSE 5001

ENV NODE_ENV=production
ENV PORT=5001

CMD ["node", "index.js"]
