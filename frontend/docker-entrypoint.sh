#!/bin/sh
set -e

# Process nginx template (replaces ${NGINX_BACKEND_URL} in nginx config)
envsubst '${NGINX_BACKEND_URL}' \
  < /etc/nginx/templates/default.conf.template \
  > /etc/nginx/conf.d/default.conf

# Replace placeholder in JS bundle with the runtime BACKEND_URL.
# Defaults to /api so single-domain deployments work without setting the variable.
BACKEND_URL="${BACKEND_URL:-/api}"
find /usr/share/nginx/html/assets -name "*.js" -exec \
  sed -i "s|__BACKEND_URL__|${BACKEND_URL}|g" {} +

exec nginx -g "daemon off;"
