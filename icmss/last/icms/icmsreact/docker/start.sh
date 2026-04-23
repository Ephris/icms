#!/bin/sh
set -e

# Ensure storage and cache directories exist and are writable
mkdir -p /var/www/html/storage/framework/{sessions,views,cache}
mkdir -p /var/www/html/storage/logs
mkdir -p /var/www/html/bootstrap/cache
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Cache Laravel configuration for production performance
php artisan config:cache  || true
php artisan route:cache   || true
php artisan view:cache    || true

# Start PHP-FPM in the background
php-fpm -D

# Start nginx in the foreground (keeps the container alive)
exec nginx -g "daemon off;"
