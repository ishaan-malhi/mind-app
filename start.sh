#!/bin/bash
# Serves the app over HTTPS — required for microphone access on iPhone.
# Generates a self-signed certificate on first run (trusted via Settings on iOS).

set -e

if [ ! -f cert.pem ] || [ ! -f key.pem ]; then
  echo "Generating local SSL certificate..."
  openssl req -x509 -newkey rsa:2048 \
    -keyout key.pem -out cert.pem \
    -days 730 -nodes \
    -subj "/CN=localhost" \
    -addext "subjectAltName=IP:$(ipconfig getifaddr en0 2>/dev/null || echo 0.0.0.0)" \
    2>/dev/null
  echo "Certificate generated."
fi

IP=$(ipconfig getifaddr en0 2>/dev/null || echo "your-local-ip")
echo ""
echo "  HTTPS server: https://$IP:8080"
echo ""
echo "  On iPhone — first visit:"
echo "  1. Open the URL above in Safari"
echo "  2. Tap 'Show Details' → 'visit this website'"
echo "  3. Reload — microphone will now work"
echo ""

npx http-server . -S -C cert.pem -K key.pem -p 8080 --cors -s
