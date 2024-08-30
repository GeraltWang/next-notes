# 使用 Node.js 作为基础镜像
FROM node:20-alpine AS base

FROM base AS builder

# 构建阶段
WORKDIR /app

COPY . .

RUN npm config set registry https://mirrors.cloud.tencent.com/npm/

RUN npm i pnpm -g --registry=https://mirrors.cloud.tencent.com/npm/

RUN pnpm i --frozen-lockfile --registry=https://mirrors.cloud.tencent.com/npm/

RUN pnpx prisma generate

# 构建项目
RUN pnpm run build

FROM base AS runner

WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY prisma ./prisma/
COPY startup.sh ./startup.sh

RUN chmod +x /app/startup.sh

# 暴露容器 80 端口
EXPOSE 80

# 禁止 next.js 的遥测
ENV NEXT_TELEMETRY_DISABLED 1

# 为 next.js 服务设置端口环境变量
ENV PORT 80

ENV HOSTNAME="0.0.0.0"

# 启动脚本
ENTRYPOINT ["sh", "/app/startup.sh"]