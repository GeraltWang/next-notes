FROM node:20-alpine

WORKDIR /app

COPY . .

RUN npm install --registry=https://registry.npmmirror.com

RUN npx prisma generate

RUN chmod +x /startup.sh

EXPOSE 3000

ENTRYPOINT ["/startup.sh"]