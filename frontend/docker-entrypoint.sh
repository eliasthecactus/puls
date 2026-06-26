#!/bin/sh
set -e

# Replace the placeholder baked into the JS bundle with the runtime BACKEND_URL.
# Default to /api so single-domain deployments work without setting the variable.
BACKEND_URL="${BACKEND_URL:-/api}"

find /usr/share/nginx/html/assets -name "*.js" -exec \
  sed -i "s|__BACKEND_URL__|${BACKEND_URL}|g" {} +

exec nginx -g "daemon off;"
