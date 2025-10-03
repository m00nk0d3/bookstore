FROM node:20-alpine

RUN  addgroup -S appgroup && adduser -S appuser -G appgroup

USER appuser

WORKDIR /app
COPY package*.json pnpm-lock.yaml ./

USER root

RUN chown -R appuser:appgroup . && npm install -g pnpm@latest

USER appuser 

RUN pnpm install

COPY . .

EXPOSE 3000
CMD ["pnpm", "dev"]
