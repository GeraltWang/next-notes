#!/bin/sh

MIGRATION_STATUS=$(pnpx prisma migrate status)

if echo "$MIGRATION_STATUS" | grep -q "Database schema is up to date"; then
    echo "No migrations needed."
else
    echo "Running migrations..."
    pnpx prisma migrate deploy
fi

node server.js