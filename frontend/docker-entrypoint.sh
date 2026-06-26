#!/bin/sh
set -e

BACKEND_URL="${BACKEND_URL:-http://backend:3001}"

# Extract hostname for the Host header (strips protocol)
BACKEND_HOST=$(echo "$BACKEND_URL" | sed 's|https\?://||' | sed 's|/.*||')

sed -i "s|__BACKEND_URL__|${BACKEND_URL}|g" /etc/nginx/conf.d/default.conf
sed -i "s|__BACKEND_HOST__|${BACKEND_HOST}|g" /etc/nginx/conf.d/default.conf

exec nginx -g "daemon off;"
