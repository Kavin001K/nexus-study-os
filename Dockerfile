# Stage 1: Build the frontend
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Production Server
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy backend source code
COPY server ./server

# Copy built frontend assets from builder stage
COPY --from=builder /app/dist ./dist

# Environment variables
ENV NODE_ENV=production
ENV PORT=8080
ENV SERVE_STATIC=true

# Expose port
EXPOSE 8080

# Start command
CMD ["npm", "start"]
