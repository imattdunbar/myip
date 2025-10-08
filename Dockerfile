FROM oven/bun:latest

WORKDIR /app

COPY . .
RUN bun install
RUN bun run build

EXPOSE $PORT

CMD ["bun", "run", ".output/server/index.mjs"]
