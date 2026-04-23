# ============================================================
# Stage 1 – Node: install JS deps and build frontend assets
# ============================================================
FROM node:18-alpine AS node_builder

WORKDIR /app

# Copy only the files needed for the JS build first (layer-cache friendly)
COPY package.json package-lock.json* ./
RUN npm ci --ignore-scripts

# Copy the rest of the source and build
COPY . .
RUN npm run build

# ============================================================
# Stage 2 – PHP-FPM + nginx: production runtime
# ============================================================
FROM php:8.2-fpm-alpine

# Install system dependencies and PHP extensions
RUN apk add --no-cache \
        nginx \
        unzip \
        libzip-dev \
        oniguruma-dev \
    && docker-php-ext-install zip pdo pdo_mysql

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy application source
COPY . .

# Copy pre-built frontend assets from the node stage
COPY --from=node_builder /app/public/build ./public/build

# Install PHP dependencies (production only)
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Set correct ownership so php-fpm (www-data) can read/write
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache

# ── nginx configuration ──────────────────────────────────────
COPY docker/nginx.conf /etc/nginx/nginx.conf

# ── container entrypoint ─────────────────────────────────────
COPY docker/start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 80

CMD ["/start.sh"]