# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build the Docusaurus site
RUN yarn build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install curl for healthcheck
RUN apk add --no-cache curl

# Copy package files for serve command
COPY package.json yarn.lock ./

# Install only production dependencies needed for serve
RUN yarn install --frozen-lockfile --production

# Copy built files from builder stage
COPY --from=builder /app/build ./build
COPY --from=builder /app/docusaurus.config.ts ./
COPY --from=builder /app/sidebars.ts ./

# Expose port 3001
EXPOSE 3001

# Serve the built site on port 3001
CMD ["yarn", "serve", "--host", "0.0.0.0", "--port", "3001"]
