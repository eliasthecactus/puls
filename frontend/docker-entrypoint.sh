#!/bin/sh
set -e

# Replace API URL placeholder in the JS bundle at container startup.
# Default /api = same domain, proxied by nginx to http://backend:3001.
# Set BACKEND_URL=https://api.example.com for cross-domain deployments.
BACKEND_URL="${BACKEND_URL:-/api}"
find /usr/share/nginx/html/assets -name "*.js" -exec \
  sed -i "s|__BACKEND_URL__|${BACKEND_URL}|g" {} +

exec nginx -g "daemon off;"
