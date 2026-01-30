# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the Docusaurus site
RUN pnpm build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install pnpm and curl for healthcheck
RUN corepack enable && corepack prepare pnpm@latest --activate && \
    apk add --no-cache curl

# Copy package files for serve command
COPY package.json pnpm-lock.yaml ./

# Install only production dependencies needed for serve
RUN pnpm install --frozen-lockfile --prod

# Copy built files from builder stage
COPY --from=builder /app/build ./build
COPY --from=builder /app/docusaurus.config.ts ./
COPY --from=builder /app/sidebars.ts ./

# Expose port 3001
EXPOSE 3001

# Serve the built site on port 3001
CMD ["pnpm", "serve", "--host", "0.0.0.0", "--port", "3001"]
