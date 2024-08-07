#!/bin/sh

MIGRATION_STATUS=$(npx prisma migrate status)

if echo "$MIGRATION_STATUS" | grep -q "Database schema is up to date"; then
    echo "No migrations needed."
else
    echo "Running migrations..."
    pnpx prisma migrate deploy
fi

# 启动 Node.js 应用
node server.js &

# 启动 OpenResty
openresty -g 'daemon off;'