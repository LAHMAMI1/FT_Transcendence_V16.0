#!/bin/sh

# Create the SSL directory
mkdir -p /etc/nginx/ssl

# Check if certificate and key already exist if not generate them
if [ ! -f /etc/nginx/ssl/cert.pem ] || [ ! -f /etc/nginx/ssl/key.pem ]; then
  echo "Generating self-signed SSL certificate..."
  openssl req -x509 -nodes -days 365 \
    -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/key.pem \
    -out /etc/nginx/ssl/cert.pem \
    -subj "/CN=localhost"
fi

# Start NGINX in the foreground
nginx -g 'daemon off;'
