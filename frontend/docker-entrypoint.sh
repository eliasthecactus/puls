#!/bin/sh
set -e

BACKEND_URL="${BACKEND_URL:-/api}"
NGINX_BACKEND_URL="${NGINX_BACKEND_URL:-http://backend:3001}"

# Inject nginx upstream
sed -i "s|__NGINX_BACKEND_URL__|${NGINX_BACKEND_URL}|g" /etc/nginx/conf.d/default.conf

# Inject API URL into JS bundle
find /usr/share/nginx/html/assets -name "*.js" -exec \
  sed -i "s|__BACKEND_URL__|${BACKEND_URL}|g" {} +

exec nginx -g "daemon off;"
