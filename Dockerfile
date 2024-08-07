# 使用 OpenResty 作为基础镜像
FROM openresty/openresty:alpine AS openresty-base

# 使用 Node.js 作为基础镜像
FROM node:20-alpine AS node-base

# 构建阶段
FROM node-base AS builder

WORKDIR /app

COPY . .

RUN npm i --registry=https://mirrors.cloud.tencent.com/npm/

RUN npx prisma generate

RUN npm run build

# 运行阶段
FROM openresty-base AS runner

WORKDIR /app

COPY --from=builder /app/public ./public

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

ENV NEXT_TELEMETRY_DISABLED 1

COPY prisma ./prisma/
COPY startup.sh ./startup.sh
RUN chmod +x /app/startup.sh

# 复制 OpenResty 配置文件
COPY nginx.conf /usr/local/openresty/nginx/conf/nginx.conf

# 安装 Node.js
# RUN apk add --no-cache nodejs npm

# 启动脚本
ENTRYPOINT ["sh", "/app/startup.sh"]