FROM node:22-alpine AS runtime

ENV NODE_ENV=production
WORKDIR /app

COPY package.json ./
COPY apps ./apps
COPY assets ./assets
COPY a_rota_origem_ms ./a_rota_origem_ms
COPY cultura_origem_ms ./cultura_origem_ms
COPY gastronomia_origem_ms ./gastronomia_origem_ms
COPY home ./home
COPY turismo_origem_ms ./turismo_origem_ms

RUN addgroup -S origem && adduser -S origem -G origem
USER origem

EXPOSE 3000

CMD ["node", "apps/web/server.js"]
