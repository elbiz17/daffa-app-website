# Gunakan Bun image
FROM oven/bun:latest

WORKDIR /app

# Copy files
COPY package.json bun.lockb* ./
COPY prisma ./prisma
COPY src ./src

# Install dependencies
RUN bun install

# Generate Prisma Client
RUN bunx prisma generate

EXPOSE 3000

CMD ["bun", "run", "src/index.ts"]
