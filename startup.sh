#!/bin/sh

MIGRATION_STATUS=$(pnpm dlx prisma migrate status)

if echo "$MIGRATION_STATUS" | grep -q "Database schema is up to date"; then
    echo "No migrations needed."
else
    echo "Running migrations..."
    pnpm dlx prisma migrate deploy
fi

node server.js
