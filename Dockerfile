FROM node:20-alpine

RUN  addgroup -S appgroup && adduser -S appuser -G appgroup

USER appuser

WORKDIR /app
COPY package*.json pnpm-lock.yaml ./

USER root

RUN chown -R appuser:appgroup .

USER appuser


RUN npm install -g pnpm@latest && pnpm install

COPY . .

EXPOSE 3000
CMD ["pnpm", "dev"]
