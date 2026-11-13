# --- Multi-Stage Production Dockerfile for PassionX ---
# Stage 1: Build Frontend
FROM node:20-alpine AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Stage 2: Production Server & Static Delivery
FROM node:20-alpine
WORKDIR /app

# Install server production dependencies
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm install --omit=dev

# Copy server code
COPY server/ ./

# Copy built frontend assets from client-builder into expected location
COPY --from=client-builder /app/client/dist /app/client/dist

# Expose production port
ENV NODE_ENV=production
ENV PORT=5001
EXPOSE 5001

CMD ["node", "index.js"]

